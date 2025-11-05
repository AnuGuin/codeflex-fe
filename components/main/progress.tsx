"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { API_BASE_URL } from "@/lib/api";

type ProgressHistoryEntry = {
  timestamp: string;
  score: number;
};

type ProgressResponse = {
  status: string;
  platform: string;
  score: number;
  feedback?: string;
  history: ProgressHistoryEntry[];
};

type ProgressPoint = {
  timestamp: string;
  score: number;
};

type PlatformProgress = {
  platform: string;
  data: ProgressPoint[];
};

export default function ProgressTracker() {
  const [progressData, setProgressData] = useState<PlatformProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<ProgressResponse | null>(null);

  useEffect(() => {
    async function fetchProgress() {
      setIsLoading(true);
      setError(null);

      const username = localStorage.getItem("username");
      const platform = "codechef";

      if (!username) {
        setError("Username not found. Please log in again.");
        setIsLoading(false);
        return;
      }

      try {
        const url = new URL(`${API_BASE_URL}/progress`);
        url.searchParams.set("username", username);
        url.searchParams.set("platform", platform);
        url.searchParams.set("hints_used", "0");

        const res = await fetch(url.toString(), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = (await res.json()) as ProgressResponse;

        if (data && data.status === "success") {
          const history: ProgressHistoryEntry[] = Array.isArray(data.history)
            ? data.history.map((entry) => ({
                timestamp: String(entry.timestamp),
                score: Number(entry.score ?? data.score ?? 0),
              }))
            : [];

          setRawResponse({ ...data, history });

          const platformProgress: PlatformProgress = {
            platform: data.platform,
            data: history.map((h, i) => ({
              timestamp: h.timestamp
                ? new Date(h.timestamp).toLocaleString()
                : `Attempt ${i + 1}`,
              score: h.score ?? data.score ?? 0,
            })),
          };
          setProgressData([platformProgress]);
        } else {
          setRawResponse(null);
          setProgressData([]);
        }
      } catch (err) {
        console.error("Error fetching progress data:", err);
        const msg = err instanceof Error ? err.message : String(err);
        setError(
          msg.includes("Failed to fetch")
            ? `Backend may be unreachable or CORS is blocking the request.\nVerify backend (${API_BASE_URL}) is running.`
            : msg
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchProgress();
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );

  if (error)
    return (
      <div className="h-screen overflow-y-auto p-6">
        <h2 className="text-3xl font-bold mb-6">📊 Progress Tracker</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading progress data</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
              {error}
            </p>
          </div>
        </div>
      </div>
    );

  if (progressData.length === 0)
    return (
      <div className="h-screen overflow-y-auto p-6">
        <h2 className="text-3xl font-bold mb-6">📊 Progress Tracker</h2>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          No progress data available yet
        </div>
      </div>
    );

  return (
    <div className="min-h-screen overflow-y-auto bg-background">
      <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
        <h2 className="text-3xl font-bold mb-2">📊 Progress Tracker</h2>

        {rawResponse && (
          <>
            {/* Top Section — Status + Graph */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Status Card */}
              <Card className="p-6 rounded-2xl shadow-sm border border-border bg-card">
                <h3 className="text-2xl font-semibold mb-4">
                  {rawResponse.platform.toUpperCase()} Status
                </h3>

                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground">
                      Status
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        rawResponse.status === "success"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {rawResponse.status === "success"
                        ? "✓ Success"
                        : "✗ Failed"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground">
                      Score
                    </span>
                    <div className="text-4xl font-bold text-primary">
                      {(rawResponse.score * 100).toFixed(0)}%
                    </div>
                  </div>

                  {rawResponse.feedback && (
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Feedback
                      </div>
                      <p className="text-base leading-relaxed">
                        {rawResponse.feedback}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Performance Graph */}
              <Card className="p-6 rounded-2xl shadow-sm border border-border bg-card">
                <h3 className="text-2xl font-semibold mb-4">
                  Performance History
                </h3>
                <div className="h-[320px] w-full">
                  {progressData[0].data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData[0].data}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--muted-foreground))"
                          opacity={0.2}
                        />
                        <XAxis
                          dataKey="timestamp"
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis
                          domain={[0, 1]}
                          tick={{ fontSize: 11 }}
                          label={{
                            value: "Score",
                            angle: -90,
                            position: "insideLeft",
                            style: { fill: "hsl(var(--muted-foreground))" },
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => [
                            `${(value * 100).toFixed(0)}%`,
                            "Score",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          dot={{ fill: "hsl(var(--primary))", r: 6 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No history data available
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Submission History Section */}
            {rawResponse.history?.length > 0 && (
              <Card className="p-6 rounded-2xl shadow-sm border border-border bg-card">
                <h3 className="text-2xl font-semibold mb-4">
                  Submission History
                </h3>
                <div className="space-y-3">
                  {rawResponse.history.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
                          #{idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(entry.timestamp).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`text-2xl font-bold ${
                          entry.score === 1
                            ? "text-green-600 dark:text-green-400"
                            : entry.score >= 0.7
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-orange-600 dark:text-orange-400"
                        }`}
                      >
                        {(entry.score * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
