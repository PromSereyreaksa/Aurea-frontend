"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "The Problem",
    description:
      "You're a designer, not a developer. Building a portfolio shouldn't take a week.",
    stat: "73% of designers delay portfolio updates due to time constraints",
    color: "bg-gradient-to-br from-[#1a1a1a] to-neutral-800",
  },
  {
    title: "The Solution",
    description:
      "AUREA handles the tech. You handle the creativity. 10 minutes from start to published.",
    stat: "10 minutes average setup time · Zero code required",
    color: "bg-gradient-to-br from-[#fb8500] to-[#ff9500]",
  },
  {
    title: "The Result",
    description:
      "A stunning, professional portfolio that showcases your work—not your coding skills.",
    stat: "Join 1,000+ designers who got their time back",
    color: "bg-gradient-to-br from-neutral-800 to-[#1a1a1a]",
  },
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [resetKey, setResetKey] = useState(0); // Key to reset timer

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setResetKey((prev) => prev + 1); // Reset timer
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setResetKey((prev) => prev + 1); // Reset timer
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setResetKey((prev) => prev + 1); // Reset timer
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [resetKey]); // Depend on resetKey to restart timer

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } ${slide.color}`}
          >
            <div className="h-full w-full flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-24">
              <div className="max-w-7xl w-full grid grid-cols-12 gap-4 sm:gap-8">
                <div className="col-span-12 lg:col-span-8">
                  <div className="text-white">
                    <div className="text-xs sm:text-sm font-mono mb-3 sm:mb-4">
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(slides.length).padStart(2, "0")}
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 leading-none">
                      {slide.title}
                    </h2>
                    <div className="w-12 sm:w-16 h-1 bg-white mb-4 sm:mb-6"></div>
                    <p className="text-base sm:text-lg md:text-2xl leading-relaxed max-w-2xl mb-6 sm:mb-8">
                      {slide.description}
                    </p>
                    {slide.stat && (
                      <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-white text-black font-mono text-xs sm:text-sm font-bold">
                        {slide.stat}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="absolute bottom-6 sm:bottom-12 right-4 sm:right-12 flex gap-2 sm:gap-4 z-10">
        <button
          onClick={prevSlide}
          className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-white text-white hover:bg-[#fb8500] hover:border-[#fb8500] transition-all flex items-center justify-center rounded"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-white text-white hover:bg-[#fb8500] hover:border-[#fb8500] transition-all flex items-center justify-center rounded"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 sm:bottom-12 left-4 sm:left-12 flex gap-2 sm:gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-8 sm:w-12 h-1 transition-all rounded ${
              index === currentSlide ? "bg-[#fb8500]" : "bg-white/30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
