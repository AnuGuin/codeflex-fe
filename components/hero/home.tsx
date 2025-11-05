import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { FeatureCards } from "@/components/hero/feature";
 
export function HomePage() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-black dark:to-blue-900">
      {/* Diagonal Fade Center Grid Background - Lowest layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #d1d5db 1px, transparent 0.5px),
            linear-gradient(to bottom, #d1d5db 1px, transparent 0.5px)
          `,
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, #000 20%, transparent 80%)",
          maskImage:
            "radial-gradient(circle at 50% 50%, #000 20%, transparent 80%)",
          opacity: 0.25,
        }}
      />
      
      {/* Blue Gradient Overlay - Middle layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle 1200px at 50% 40%, rgba(59,130,246,0.5), transparent),
            radial-gradient(circle 800px at 80% 70%, rgba(96,165,250,0.4), transparent),
            radial-gradient(circle 600px at 20% 80%, rgba(147,197,253,0.3), transparent)
          `,
        }}
      />
      
      {/* Hero Section with Background Lines */}
      <BackgroundLines className="relative z-10 w-full min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
            Codeflex<br />
          </h1>
          <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
            Building intuition for the mind behind the machine — one concept at a time.
          </p>
        </div>
      </BackgroundLines>
      
      {/* Feature Cards Section - Without background lines */}
      <div className="relative z-10">
        <FeatureCards />
      </div>
    </div>
  );
}