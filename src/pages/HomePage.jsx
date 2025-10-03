import Navbar from "../components/Shared/Navbar";
import Carousel from "../components/LandingPage/Carousel";
import ContentSection from "../components/LandingPage/ContentSection";
import Playground from "../components/LandingPage/Playground";
import CallToAction from "../components/LandingPage/CallToAction";
import Footer from "../components/Shared/Footer";
import MemeSurvey from "../components/LandingPage/MemeSurvey";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="min-h-screen bg-white pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-12 md:py-16">
          <div className="max-w-7xl w-full grid grid-cols-12 gap-6 sm:gap-8">
            <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
              <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#fb8500] text-white text-xs sm:text-sm font-mono mb-4 sm:mb-6 w-fit">
                FOR DESIGNERS · BY DESIGNERS
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-none mb-6 sm:mb-8 text-[#1a1a1a]">
                Your Portfolio.
                <br />
                <span className="text-neutral-400">Built in Minutes.</span>
              </h1>
              <div className="w-16 sm:w-20 md:w-24 h-1 bg-[#fb8500] mb-6 sm:mb-8"></div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl mb-8 sm:mb-10 md:mb-12 text-[#1a1a1a]">
                Stop spending days coding. Start showcasing your work in under
                10 minutes. AUREA turns your design files into stunning
                portfolios—no code required.
              </p>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12">
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-[#fb8500]">
                    10min
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-600">
                    Average Setup Time
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-[#fb8500]">
                    Zero
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-600">
                    Code Needed
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-[#fb8500]">
                    100%
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-600">
                    Designer Focused
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href="/signup"
                  className="px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 bg-[#fb8500] text-white font-bold text-base sm:text-lg hover:bg-[#fb8500]/90 transition-all hover:shadow-lg transform hover:scale-105 text-center rounded"
                >
                  Start Building Free
                </a>
                <a
                  href="#how-it-works"
                  className="px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 border-2 border-[#fb8500] text-[#fb8500] font-bold text-base sm:text-lg hover:bg-[#fb8500] hover:text-white transition-colors text-center rounded"
                >
                  See How It Works
                </a>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-5 flex items-center justify-center mt-8 lg:mt-0">
              <div className="w-full max-w-md lg:max-w-none aspect-square bg-gradient-to-br from-[#fb8500] to-[#ff9500] flex items-center justify-center relative overflow-hidden rounded-lg shadow-2xl">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-6 sm:top-10 left-6 sm:left-10 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 border-2 sm:border-4 border-white"></div>
                  <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-white"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 sm:w-32 md:w-40 h-28 sm:h-32 md:h-40 border border-white sm:border-2 rotate-45"></div>
                </div>
                <div className="text-white text-center z-10">
                  <div className="text-6xl sm:text-7xl md:text-8xl font-bold mb-3 sm:mb-4">
                    ⚡
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">
                    Fast & Beautiful
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Carousel Section */}
        <section id="how-it-works" className="h-screen">
          <Carousel />
        </section>

        {/* Content Sections */}
        <ContentSection
          title="Drag. Drop. Done."
          subtitle="01"
          content="No more wrestling with code or complicated tools. Upload your design files, arrange them beautifully, and publish. Your portfolio builder that actually respects your time."
          imagePosition="left"
        />

        <ContentSection
          title="Template-Free Design"
          subtitle="02"
          content="Every designer is unique. Skip the cookie-cutter templates. Build something that truly represents your style with our flexible grid system and modern design principles."
          imagePosition="right"
        />

        <ContentSection
          title="Mobile-Perfect, Always"
          subtitle="03"
          content="Your work looks stunning on every device—automatically. Focus on your designs while we handle responsive layouts, load times, and technical optimization."
          imagePosition="left"
        />

        <ContentSection
          title="Live in Minutes"
          subtitle="04"
          content="From zero to published portfolio faster than you can make coffee. Custom domain, SSL, and hosting included. Because busy designers need solutions, not complications."
          imagePosition="right"
        />

        {/* Meme Survey */}
        <MemeSurvey />

        {/* Interactive Playground */}
        <section id="playground">
          <Playground />
        </section>

        {/* Call to Action */}
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}
