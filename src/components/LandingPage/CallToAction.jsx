export default function CallToAction() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#1a1a1a] to-neutral-900 text-white">
      <div className="max-w-7xl w-full">
        <div className="grid grid-cols-12 gap-6 sm:gap-8">
          <div className="col-span-12 lg:col-span-8">
            <div className="font-mono text-xs sm:text-sm mb-4 sm:mb-6 text-[#fb8500] font-bold">
              READY TO GET STARTED?
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
              Stop Procrastinating.
              <br />
              Start Building.
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 bg-[#fb8500] mb-8 sm:mb-10 md:mb-12"></div>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 sm:mb-10 md:mb-12 max-w-2xl">
              Join thousands of designers who chose to showcase their work
              instead of learning to code. Your portfolio is 10 minutes away.
            </p>

            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
              <div>
                <div className="text-2xl sm:text-3xl mb-2 text-[#fb8500]">
                  ✓
                </div>
                <div className="font-bold mb-1 text-sm sm:text-base">
                  Free to Start
                </div>
                <div className="text-xs sm:text-sm text-neutral-400">
                  No credit card needed
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl mb-2 text-[#fb8500]">
                  ✓
                </div>
                <div className="font-bold mb-1 text-sm sm:text-base">
                  Custom Domain
                </div>
                <div className="text-xs sm:text-sm text-neutral-400">
                  yourname.com ready
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl mb-2 text-[#fb8500]">
                  ✓
                </div>
                <div className="font-bold mb-1 text-sm sm:text-base">
                  24/7 Support
                </div>
                <div className="text-xs sm:text-sm text-neutral-400">
                  Designers helping designers
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <a
                href="/signup"
                className="px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 bg-[#fb8500] text-white font-bold text-base sm:text-lg hover:bg-[#fb8500]/90 transition-all hover:shadow-lg transform hover:scale-105 text-center rounded"
              >
                Create Your Portfolio
              </a>
              <a
                href="/events"
                className="px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 border-2 border-[#fb8500] text-[#fb8500] font-bold text-base sm:text-lg hover:bg-[#fb8500] hover:text-white transition-colors text-center rounded"
              >
                Browse Examples
              </a>
            </div>
          </div>

          {/* Geometric accent */}
          <div className="col-span-12 lg:col-span-4 flex items-center justify-center mt-8 lg:mt-0">
            <div className="relative w-full max-w-[280px] sm:max-w-sm aspect-square">
              <div className="absolute inset-0 border-2 sm:border-4 border-[#fb8500] rounded-lg"></div>
              <div className="absolute inset-6 sm:inset-8 border border-[#fb8500]/50 sm:border-2 rounded"></div>
              <div className="absolute inset-12 sm:inset-16 border border-[#fb8500]/25 flex items-center justify-center rounded">
                <div className="text-4xl sm:text-5xl md:text-6xl">⚡</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
