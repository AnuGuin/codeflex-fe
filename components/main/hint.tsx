"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Send, ChevronRight } from "lucide-react";

interface Hint {
  hint: string;
}

export default function HintComponent() {
  const [link, setLink] = useState("");
  const [hints, setHints] = useState<Hint[]>([]);
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState("");
  const [thinking, setThinking] = useState(false);

  function parseHintsFromText(text: string): Hint[] {
    try {
      // First, try to parse as JSON array
      const block = text.match(/(?:json)?\s*(\[[\s\S]*?\])\s*/);
      const jsonStr = block ? block[1] : text.match(/(\[[\s\S]*?\])/ )?.[1];
      if (jsonStr) {
        return JSON.parse(jsonStr.trim());
      }

      // If not JSON, parse markdown-style hints
      const hints: Hint[] = [];
      
      // Split by the ### Hint pattern
      const hintSections = text.split(/###\s*Hint\s*\d+/i);
      
      // Skip the first element (text before first hint) and process the rest
      for (let i = 1; i < hintSections.length; i++) {
        const hintContent = hintSections[i].trim();
        if (hintContent) {
          hints.push({ hint: hintContent });
        }
      }

      if (hints.length > 0) {
        console.log(`Successfully parsed ${hints.length} hints`);
        return hints;
      }

      // If no structured format found, return the whole text as a single hint
      console.warn("Could not parse hints in expected format, returning as single hint");
      return [{ hint: text }];
    } catch (error) {
      console.error("Error parsing hints:", error);
      return [{ hint: text }];
    }
  }

  const handleFetchSolution = async () => {
    if (!link.trim()) return;

    setIsLoading(true);
    setNotFound("");
    try {
      const res = await fetch(`http://localhost:8001/generate/hints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem_url: link }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Error fetching hints:", data);
        setNotFound(data.error || "Could not fetch hints");
      } else {
        const parsed = parseHintsFromText(data.generated_hints);
        if (parsed && parsed.length > 0) {
          setHints(parsed);
          setCurrentHintIndex(0); // Show first hint automatically
        } else {
          setNotFound("No valid hints found in the response.");
        }
      }
    } catch (error) {
      console.error("Failed to fetch hints:", error);
      setNotFound("Failed to fetch hints. Please try again.");
    }
    setIsLoading(false);
  };

  const handleShowNextHint = () => {
    if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage = { role: "user" as const, content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    try {
      setThinking(true);
      const res = await fetch(`http://localhost:8001/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, context: chatMessages }),
      });

      const data = await res.json();
      const reply = data.reply || "No response";
      const assistantMessage = { role: "assistant" as const, content: reply };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error communicating with AI:", error);
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error communicating with AI" },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="flex-1 w-full overflow-y-auto">
      <Card className="p-6 mb-8 border-border bg-card">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary" />
          Get Hints for Your Problem
        </h2>
        <div className="flex p-4 gap-3">
          <Input
            placeholder="Paste CodeChef/Codeforces/LeetCode link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="flex-1 p-2"
          />
          <Button onClick={handleFetchSolution} disabled={isLoading || !link.trim()} className="px-8">
            {isLoading ? "Loading..." : "Get Hints"}
          </Button>
        </div>
      </Card>

      {notFound !== "" && (
        <div className="bg-red-500 text-white rounded-md p-3 mb-6 flex items-center justify-center">
          {notFound}
        </div>
      )}

      {hints?.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Generated Hints</h3>
              <span className="text-sm text-muted-foreground">
                {currentHintIndex + 1} / {hints.length}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              {hints.slice(0, currentHintIndex + 1).map((hintObj, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-secondary/50 border border-border"
                >
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                    <p className="text-foreground flex-1 pt-1">{hintObj.hint}</p>
                  </div>
                </div>
              ))}
            </div>

            {currentHintIndex < hints.length - 1 && (
              <Button onClick={handleShowNextHint} className="w-full" size="lg">
                Show Next Hint <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            )}

            {currentHintIndex === hints.length - 1 && (
              <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-primary font-medium">All hints revealed!</p>
              </div>
            )}
          </Card>

          <Card className="p-6 border-border bg-card flex flex-col h-[600px]">
            <h3 className="text-xl font-bold mb-4">AI Assistant</h3>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary/20 ml-8"
                      : "bg-secondary/50 mr-8"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
              {thinking && (
                <div className="p-3 rounded-lg bg-secondary/50 mr-8 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 border-t border-border pt-4">
              <Textarea
                placeholder="Ask about the problem..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="resize-none min-h-[60px]"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || thinking}
                size="icon"
                className="h-[60px] w-[60px]"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}