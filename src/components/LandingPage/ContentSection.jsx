export default function ContentSection({
  title,
  subtitle,
  content,
  imagePosition = "left",
}) {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-12 lg:px-24 py-24">
      <div className="max-w-7xl w-full mx-auto">
        <div
          className={`grid grid-cols-12 gap-8 lg:gap-16 ${
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
                  <div className="text-white text-9xl font-bold opacity-20">
                    {subtitle}
                  </div>
                </div>
              </div>
              {/* Accent line */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 border-4 border-[#fb8500] rounded"></div>
            </div>
          </div>

          {/* Content */}
          <div
            className={`col-span-12 lg:col-span-7 flex flex-col justify-center ${
              imagePosition === "right" ? "lg:col-start-1 lg:row-start-1" : ""
            }`}
          >
            <div className="font-mono text-sm mb-4 text-[#fb8500] font-bold">
              {subtitle}
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-none text-[#1a1a1a]">
              {title}
            </h2>
            <div className="w-16 h-1 bg-[#fb8500] mb-8"></div>
            <p className="text-lg md:text-xl leading-relaxed text-neutral-700 max-w-xl">
              {content}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
