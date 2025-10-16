import ModernNavbar from "../components/LandingPage/ModernNavbar";
import ModernHero from "../components/LandingPage/ModernHero";
import TrustBanner from "../components/LandingPage/TrustBanner";
import FeaturesGrid from "../components/LandingPage/FeaturesGrid";
import HowItWorks from "../components/LandingPage/HowItWorks";
import StatsSection from "../components/LandingPage/StatsSection";
import TestimonialsSection from "../components/LandingPage/TestimonialsSection";
import FinalCTA from "../components/LandingPage/FinalCTA";
import ModernFooter from "../components/LandingPage/ModernFooter";

export default function HomePage() {
  return (
    <div className="app-page min-h-screen bg-white">
      <ModernNavbar />

      <main className="bg-white">
        <ModernHero />
        <TrustBanner />
        <FeaturesGrid />
        <HowItWorks />
        <StatsSection />
        <TestimonialsSection />
        <FinalCTA />
      </main>

      <ModernFooter />
    </div>
  );
}
