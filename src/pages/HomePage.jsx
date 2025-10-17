import React, { lazy, Suspense } from "react";
import ModernNavbar from "../components/LandingPage/ModernNavbar";
import ModernHero from "../components/LandingPage/ModernHero";
import ModernFooter from "../components/LandingPage/ModernFooter";
import LazySection from "../components/LazySection";

// Lazy load sections that are below the fold
const TrustBanner = lazy(() => import("../components/LandingPage/TrustBanner"));
const FeaturesGrid = lazy(() =>
  import("../components/LandingPage/FeaturesGrid")
);
const HowItWorks = lazy(() => import("../components/LandingPage/HowItWorks"));
const StatsSection = lazy(() =>
  import("../components/LandingPage/StatsSection")
);
const TestimonialsSection = lazy(() =>
  import("../components/LandingPage/TestimonialsSection")
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

        {/* Lazy load sections as user scrolls */}
        <LazySection fallback={<SectionSkeleton />}>
          <Suspense fallback={<SectionSkeleton />}>
            {/* <TrustBanner /> */}
          </Suspense>
        </LazySection>

        <LazySection fallback={<SectionSkeleton />}>
          <Suspense fallback={<SectionSkeleton />}>
            <FeaturesGrid />
          </Suspense>
        </LazySection>

        <LazySection fallback={<SectionSkeleton />}>
          <Suspense fallback={<SectionSkeleton />}>
            <HowItWorks />
          </Suspense>
        </LazySection>

        <LazySection fallback={<SectionSkeleton />}>
          <Suspense fallback={<SectionSkeleton />}>
            <StatsSection />
          </Suspense>
        </LazySection>

        <LazySection fallback={<SectionSkeleton />}>
          <Suspense fallback={<SectionSkeleton />}>
            <TestimonialsSection />
          </Suspense>
        </LazySection>

        <LazySection fallback={<SectionSkeleton />}>
          <Suspense fallback={<SectionSkeleton />}>
            <FinalCTA />
          </Suspense>
        </LazySection>
      </main>

      <ModernFooter />
    </div>
  );
}
