export default function CallToAction() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 bg-gradient-to-br from-[#1a1a1a] to-neutral-900 text-white">
      <div className="max-w-7xl w-full">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <div className="font-mono text-sm mb-6 text-[#fb8500] font-bold">
              READY TO GET STARTED?
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Stop Procrastinating.
              <br />
              Start Building.
            </h2>
            <div className="w-24 h-1 bg-[#fb8500] mb-12"></div>
            <p className="text-xl md:text-2xl leading-relaxed mb-12 max-w-2xl">
              Join thousands of designers who chose to showcase their work
              instead of learning to code. Your portfolio is 10 minutes away.
            </p>

            {/* Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div>
                <div className="text-3xl mb-2 text-[#fb8500]">✓</div>
                <div className="font-bold mb-1">Free to Start</div>
                <div className="text-sm text-neutral-400">
                  No credit card needed
                </div>
              </div>
              <div>
                <div className="text-3xl mb-2 text-[#fb8500]">✓</div>
                <div className="font-bold mb-1">Custom Domain</div>
                <div className="text-sm text-neutral-400">
                  yourname.com ready
                </div>
              </div>
              <div>
                <div className="text-3xl mb-2 text-[#fb8500]">✓</div>
                <div className="font-bold mb-1">24/7 Support</div>
                <div className="text-sm text-neutral-400">
                  Designers helping designers
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <a
                href="/signup"
                className="px-12 py-6 bg-[#fb8500] text-white font-bold text-lg hover:bg-[#fb8500]/90 transition-all hover:shadow-lg transform hover:scale-105 text-center rounded"
              >
                Create Your Portfolio
              </a>
              <a
                href="/events"
                className="px-12 py-6 border-2 border-[#fb8500] text-[#fb8500] font-bold text-lg hover:bg-[#fb8500] hover:text-white transition-colors text-center rounded"
              >
                Browse Examples
              </a>
            </div>
          </div>

          {/* Geometric accent */}
          <div className="col-span-12 lg:col-span-4 flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-square">
              <div className="absolute inset-0 border-4 border-[#fb8500] rounded-lg"></div>
              <div className="absolute inset-8 border-2 border-[#fb8500]/50 rounded"></div>
              <div className="absolute inset-16 border border-[#fb8500]/25 flex items-center justify-center rounded">
                <div className="text-6xl">⚡</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
