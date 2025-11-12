import React, { lazy, Suspense } from "react";
import V2Navbar from "../components/LandingPage/V2Navbar";
import V2Hero from "../components/LandingPage/V2Hero";
import TimelineSection from "../components/LandingPage/TimelineSection";
import ProblemSection from "../components/LandingPage/ProblemSection";
import TransitionSection from "../components/LandingPage/TransitionSection";
import ImpactSection from "../components/LandingPage/ImpactSection";
import SolutionSection from "../components/LandingPage/SolutionSection";
import MarqueeSection from "../components/LandingPage/MarqueeSection";
import HowItWorksSection from "../components/LandingPage/HowItWorksSection";
import V2Footer from "../components/LandingPage/V2Footer";
import ScrollProgress from "../components/LandingPage/ScrollProgress";

// Simple loading placeholder
const SectionSkeleton = () => (
  <div className="min-h-[400px] bg-gray-50/50 animate-pulse" />
);

export default function HomePage() {
  return (
    <div className="app-page min-h-screen bg-[#1a1a1a]">
      <ScrollProgress />
      <V2Navbar />

      <main className="bg-white">
        {/* Hero Section - Large Typography */}
        <div id="home">
          <V2Hero />
        </div>

        {/* Timeline Section - The Journey */}
        <TimelineSection />

        {/* Marquee Section - Visual Impact */}
        <MarqueeSection />

        {/* Problem Section - The Challenge */}
        <ProblemSection />

        {/* Transition Section - Before & After */}
        <TransitionSection />

        {/* Impact Section - Why It Matters */}
        <ImpactSection />

        {/* Solution Section - Our Services */}
        <div id="services">
          <SolutionSection />
        </div>

        {/* How It Works - Scroll-jacking Section */}
        <HowItWorksSection />
      </main>

      <V2Footer />
    </div>
  );
}
