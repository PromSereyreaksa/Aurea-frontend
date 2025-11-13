import V2Navbar from "../components/LandingPage/V2Navbar";
import V2Hero from "../components/LandingPage/V2Hero";
import PortfolioGalleryMarquee from "../components/LandingPage/PortfolioGalleryMarquee";
import MarqueeSection from "../components/LandingPage/MarqueeSection";
import SolutionSection from "../components/LandingPage/SolutionSection";
import TransitionSection from "../components/LandingPage/TransitionSection";
import HowItWorksSection from "../components/LandingPage/HowItWorksSection";
import V2Footer from "../components/LandingPage/V2Footer";
import ScrollProgress from "../components/LandingPage/ScrollProgress";

export default function HomePage() {
  return (
    <div className="app-page min-h-screen bg-[#1a1a1a]">
      <ScrollProgress />
      <V2Navbar />

      <main>
        {/* Portfolio Gallery Marquee - Moving Left/Right with fade to black */}
        <PortfolioGalleryMarquee />

        {/* Hero Section */}
        <div id="home">
          <V2Hero />
        </div>

        {/* Marquee Section - Scroll-based */}
        <MarqueeSection />

        {/* Solution Section - Our Services */}
        <div id="services" className="bg-white">
          <SolutionSection />
        </div>

        {/* Transition Section - Before & After */}
        <div className="bg-white">
          <TransitionSection />
        </div>

        {/* How It Works - Scroll-jacking Section */}
        <div className="bg-white">
          <HowItWorksSection />
        </div>
      </main>

      <V2Footer />
    </div>
  );
}
