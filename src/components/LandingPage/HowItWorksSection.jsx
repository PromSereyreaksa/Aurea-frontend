import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Choose Template",
    description:
      "Select from our professionally designed templates. Each one is fully customizable to match your unique style.",
    image: "/landingMock/1.png",
    color: "#FF6B35",
  },
  {
    number: "02",
    title: "Setup Your Portfolio",
    description:
      "Fill in your information with our intuitive builder. Add your projects, skills, and experience in minutes.",
    image: "/landingMock/2.png",
    color: "#FF6B35",
  },
  {
    number: "03",
    title: "Publish Your Portfolio",
    description:
      "Launch your portfolio with a custom URL. Share your work with the world and stand out from the crowd.",
    image: "/landingMock/3.png",
    color: "#FF6B35",
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const contentRefs = useRef([]);
  const imageRefs = useRef([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-advance steps on mobile
  useEffect(() => {
    if (!isMobile) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [isMobile]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (!isMobile) {
        // Desktop: Use scroll-jacking
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=80%`,
          pin: true,
          scrub: 1,
          markers: false,
        });

        // Set initial visibility for content (text scrolls up)
        contentRefs.current.forEach((content, i) => {
          if (content) {
            gsap.set(content, {
              opacity: 1,
              y: i === 0 ? 0 : "100%"
            });
          }
        });

        // Set initial visibility for images (stack on top)
        imageRefs.current.forEach((image, i) => {
          if (image) {
            gsap.set(image, {
              autoAlpha: i === 0 ? 1 : 0,
              scale: i === 0 ? 1 : 0.95
            });
          }
        });

        // Create scroll-based animations
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=80%",
            scrub: 1,
            markers: false,
          }
        });

        // Step 1 to Step 2 transition
        tl.to(contentRefs.current[0], { y: "-100%", duration: 0.3, ease: "power2.inOut" })
          .to(contentRefs.current[1], { y: 0, duration: 0.3, ease: "power2.inOut" }, "-=0.2")
          .to(imageRefs.current[1], { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power2.out" }, "<");

        // Pause to view Step 2
        tl.to({}, { duration: 0.1 });

        // Step 2 to Step 3 transition
        tl.to(contentRefs.current[1], { y: "-100%", duration: 0.3, ease: "power2.inOut" })
          .to(contentRefs.current[2], { y: 0, duration: 0.3, ease: "power2.inOut" }, "-=0.2")
          .to(imageRefs.current[2], { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power2.out" }, "<");
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: isMobile ? 'auto' : `110vh` }}
    >
      <div
        ref={containerRef}
        className={`${isMobile ? 'relative' : 'sticky top-0'} h-screen w-full overflow-hidden`}
      >
        {/* Background gradient that changes per step */}
        <div className="absolute inset-0" />

        {/* Title - Fixed at top */}
        <div className="absolute top-20 sm:top-24 md:top-32 left-0 right-0 z-10 text-center px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
            Build Your Portfolio
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to launch your professional portfolio
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative h-full flex items-center justify-center pt-24 sm:pt-28 md:pt-32">
          <div className="max-w-7xl w-full flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center px-4 sm:px-6 md:px-8 lg:px-16">
            {/* Left side - Text content that changes */}
            <div className="relative h-[200px] sm:h-[250px] md:h-[350px] lg:h-[500px] w-full overflow-hidden order-2 lg:order-1">
              {steps.map((step, index) => (
                <div
                  key={index}
                  ref={(el) => (contentRefs.current[index] = el)}
                  className={`absolute inset-0 flex flex-col justify-center space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6 px-2 sm:px-0 ${
                    isMobile ? (index === currentStep ? 'block' : 'hidden') : ''
                  }`}
                >
                  <div
                    className="inline-block text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-bold"
                    style={{ color: step.color, opacity: 0.3 }}
                  >
                    {step.number}
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-xl xl:text-2xl text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {step.description}
                  </p>
                  <div
                    className="w-12 sm:w-16 md:w-20 lg:w-24 h-1 sm:h-1.5 md:h-2 rounded-full mt-2 sm:mt-4 md:mt-6 lg:mt-8"
                    style={{ backgroundColor: step.color }}
                  />
                </div>
              ))}
            </div>

            {/* Right side - Images that stack over each other */}
            <div className="relative h-[200px] sm:h-[250px] md:h-[350px] lg:h-[500px] xl:h-[600px] w-full overflow-hidden order-1 lg:order-2">
              {steps.map((step, index) => (
                <div
                  key={`image-${index}`}
                  ref={(el) => (imageRefs.current[index] = el)}
                  className={`absolute inset-0 flex items-center justify-center px-2 sm:px-4 lg:px-0 ${
                    isMobile ? (index === currentStep ? 'block' : 'hidden') : ''
                  }`}
                  style={{ zIndex: index + 1 }}
                >
                  <div className="relative w-full max-w-[240px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] xl:max-w-none mx-auto">
                    {/* MacBook Frame */}
                    <div className="relative">
                      {/* Screen bezel */}
                      <div className="relative bg-gray-900 rounded-t-lg sm:rounded-t-xl md:rounded-t-2xl p-1 sm:p-1.5 md:p-2 shadow-xl md:shadow-2xl">
                        {/* Top bar with camera */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 md:w-20 h-3 sm:h-4 md:h-5 bg-gray-900 rounded-b-md md:rounded-b-lg flex items-center justify-center">
                          <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-gray-700 rounded-full"></div>
                        </div>
                        {/* Screen */}
                        <div className="relative bg-white rounded-md md:rounded-lg overflow-hidden">
                          <img
                            src={step.image}
                            alt={step.title}
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                      {/* MacBook base */}
                      <div className="relative h-1 sm:h-1.5 md:h-2 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-lg md:rounded-b-xl shadow-md md:shadow-lg">
                        <div className="absolute inset-x-0 top-0 h-px bg-gray-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dots */}
        {isMobile && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-[#FF6B35]'
                    : 'bg-gray-400 hover:bg-gray-600'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
