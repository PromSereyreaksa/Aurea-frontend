import React, { lazy, Suspense } from "react";
import ModernNavbar from "../components/LandingPage/ModernNavbar";
import ModernHero from "../components/LandingPage/ModernHero";
import ModernFooter from "../components/LandingPage/ModernFooter";
import LazySection from "../components/LazySection";

// Eagerly load sections that are in navigation for instant access
import FeaturesGrid from "../components/LandingPage/FeaturesGrid";
import TestimonialsSection from "../components/LandingPage/TestimonialsSection";

// Lazy load other sections below the fold
const TrustBanner = lazy(() => import("../components/LandingPage/TrustBanner"));
const HowItWorks = lazy(() => import("../components/LandingPage/HowItWorks"));
const StatsSection = lazy(() =>
  import("../components/LandingPage/StatsSection")
);
const FinalCTA = lazy(() => import("../components/LandingPage/FinalCTA"));

// Simple loading placeholder
const SectionSkeleton = () => (
  <div className="min-h-[400px] bg-gray-50/50 animate-pulse" />
);

export default function HomePage() {
  return (
    <div className="app-page min-h-screen bg-white">
      <ModernNavbar />

      <main className="bg-white">
        {/* Hero always loads immediately */}
        <ModernHero />

        {/* Eagerly loaded sections - in navigation, no lazy loading */}
        <FeaturesGrid />

        {/* Lazy load sections with aggressive preloading */}
        <LazySection fallback={<SectionSkeleton />} rootMargin="500px">
          <Suspense fallback={<SectionSkeleton />}>
            <HowItWorks />
          </Suspense>
        </LazySection>

        <LazySection fallback={<SectionSkeleton />} rootMargin="500px">
          <Suspense fallback={<SectionSkeleton />}>
            <StatsSection />
          </Suspense>
        </LazySection>

        {/* Testimonials - eagerly loaded for navigation */}
        <TestimonialsSection />

        <LazySection fallback={<SectionSkeleton />} rootMargin="500px">
          <Suspense fallback={<SectionSkeleton />}>
            <FinalCTA />
          </Suspense>
        </LazySection>
      </main>

      <ModernFooter />
    </div>
  );
}
