export default function ContentSection({
  title,
  subtitle,
  content,
  imagePosition = "left",
}) {
  return (
    <section className="min-h-screen flex items-center px-4 sm:px-6 md:px-12 lg:px-24 py-16 sm:py-20 md:py-24">
      <div className="max-w-7xl w-full mx-auto">
        <div
          className={`grid grid-cols-12 gap-6 sm:gap-8 lg:gap-16 ${
            imagePosition === "right" ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Image/Visual Element */}
          <div
            className={`col-span-12 lg:col-span-5 ${
              imagePosition === "right" ? "lg:col-start-8" : ""
            }`}
          >
            <div className="relative">
              {/* Geometric shape */}
              <div className="aspect-square bg-gradient-to-br from-[#fb8500] to-[#ff9500] relative overflow-hidden rounded-lg shadow-xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold opacity-20">
                    {subtitle}
                  </div>
                </div>
              </div>
              {/* Accent line */}
              <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-24 h-24 sm:w-32 sm:h-32 border-2 sm:border-4 border-[#fb8500] rounded"></div>
            </div>
          </div>

          {/* Content */}
          <div
            className={`col-span-12 lg:col-span-7 flex flex-col justify-center ${
              imagePosition === "right" ? "lg:col-start-1 lg:row-start-1" : ""
            }`}
          >
            <div className="font-mono text-xs sm:text-sm mb-3 sm:mb-4 text-[#fb8500] font-bold">
              {subtitle}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-none text-[#1a1a1a]">
              {title}
            </h2>
            <div className="w-12 sm:w-16 h-1 bg-[#fb8500] mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-neutral-700 max-w-xl">
              {content}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
