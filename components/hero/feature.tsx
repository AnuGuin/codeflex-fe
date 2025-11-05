
"use client";

import React from "react";
import { Lightbulb, BookOpen, TrendingUp, BarChart3, Brain, Sparkles } from "lucide-react";
import CardFlip from "../mvpblocks/card-flip";

export function FeatureCards() {
  const features = [
    {
      title: "AI-Powered Hints",
      subtitle: "Smart learning assistance",
      description: "Get step-by-step hints for Codeforces and CodeChef problems without revealing full solutions.",
      features: [
        "Step-by-step guidance",
        "No spoilers",
        "Adaptive difficulty",
        "Learn at your pace"
      ],
      icon: Lightbulb
    },
    {
      title: "Editorial Fetching",
      subtitle: "Instant problem insights",
      description: "Instantly pulls official editorials and tutorials for each problem to deepen understanding.",
      features: [
        "Official editorials",
        "Tutorial access",
        "Multiple approaches",
        "Community solutions"
      ],
      icon: BookOpen
    },
    {
      title: "Difficulty Insights",
      subtitle: "Know your challenge level",
      description: "View each problem's rating and compare it with your own level for optimal learning.",
      features: [
        "Problem ratings",
        "Skill comparison",
        "Personalized difficulty",
        "Smart recommendations"
      ],
      icon: TrendingUp
    },
    {
      title: "Progress Tracking",
      subtitle: "Monitor your growth",
      description: "Calculates your progress based on problem difficulty, rating, and hints used.",
      features: [
        "Performance metrics",
        "Hint usage stats",
        "Difficulty progression",
        "Visual analytics"
      ],
      icon: BarChart3
    },
    {
      title: "Interactive Learning",
      subtitle: "Build real understanding",
      description: "Improve logic and problem-solving skills instead of memorizing solutions.",
      features: [
        "Logic-first approach",
        "Pattern recognition",
        "Conceptual learning",
        "Critical thinking"
      ],
      icon: Brain
    },
    {
      title: "Clean & Intuitive UI",
      subtitle: "Focused learning experience",
      description: "Minimal, responsive design focused on learning efficiency and user experience.",
      features: [
        "Minimal design",
        "Responsive layout",
        "Fast performance",
        "Distraction-free"
      ],
      icon: Sparkles
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
          Powerful Features
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Everything you need to master competitive programming through intelligent learning
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {features.map((feature, index) => (
          <CardFlip
            key={index}
            title={feature.title}
            subtitle={feature.subtitle}
            description={feature.description}
            features={feature.features}
            icon={feature.icon}
          />
        ))}
      </div>
    </div>
  );
}