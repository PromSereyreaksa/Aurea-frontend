import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function PortfolioGalleryMarquee() {
  const sectionRef = useRef(null);

  // Track scroll progress for middle row scale animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Scale middle row from 1 to 1.15 as user scrolls
  const middleRowScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // All portfolio images from public folder (1-16)
  const portfolioImages = [
    { id: 1, url: "/portfolios/1.png" },
    { id: 2, url: "/portfolios/2.png" },
    { id: 3, url: "/portfolios/3.png" },
    { id: 4, url: "/portfolios/4.png" },
    { id: 5, url: "/portfolios/5.jpg" },
    { id: 6, url: "/portfolios/6.jpg" },
    { id: 7, url: "/portfolios/7.jpg" },
    { id: 8, url: "/portfolios/8.jpg" },
    { id: 9, url: "/portfolios/9.jpg" },
    { id: 10, url: "/portfolios/10.jpg" },
    { id: 11, url: "/portfolios/11.jpg" },
    { id: 12, url: "/portfolios/12.jpg" },
    { id: 13, url: "/portfolios/13.jpg" },
    { id: 14, url: "/portfolios/14.jpg" },
    { id: 15, url: "/portfolios/15.jpg" },
    { id: 16, url: "/portfolios/16.jpg" },
  ];

  // Distribute images across 3 rows - 5 unique images per row
  const row1 = portfolioImages.slice(0, 5);   // Images 1-5
  const row2 = portfolioImages.slice(5, 10);  // Images 6-10
  const row3 = portfolioImages.slice(10, 15); // Images 11-15

  // Duplicate each row for seamless infinite scrolling
  const row1Images = [...row1, ...row1];
  const row2Images = [...row2, ...row2];
  const row3Images = [...row3, ...row3];

  return (
    <section ref={sectionRef} className="relative bg-[#1a1a1a] overflow-hidden">
      {/* Gallery Container - 3 rows with scroll-based middle row scaling */}
      <div className="relative pt-20 md:pt-24 pb-24 md:pb-32 overflow-hidden">
        {/* First Row - Moving Left */}
        <div className="relative mb-4 md:mb-8">
          <motion.div
            animate={{
              x: [0, -2020],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            className="flex gap-4 md:gap-6 whitespace-nowrap"
          >
            {[...Array(4)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-6">
                {row1Images.map((image, index) => (
                  <div
                    key={`${setIndex}-${index}`}
                    className="relative group cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    className="w-[220px] h-[140px] md:w-[380px] md:h-[240px]"
                  >
                    <img
                      src={image.url}
                      alt={`Portfolio ${image.id}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Second Row (Middle) - Moving Right with Scroll-based Scale */}
        <motion.div
          className="relative mb-4 md:mb-8"
          style={{ scale: middleRowScale }}
        >
          <motion.div
            animate={{
              x: [-2020, 0],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            className="flex gap-4 md:gap-6 whitespace-nowrap"
          >
            {[...Array(4)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-6">
                {row2Images.map((image, index) => (
                  <div
                    key={`${setIndex}-${index}`}
                    className="relative group cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    className="w-[220px] h-[140px] md:w-[380px] md:h-[240px]"
                  >
                    <img
                      src={image.url}
                      alt={`Portfolio ${image.id}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Third Row (Bottom) - Moving Left */}
        <div className="relative">
          <motion.div
            animate={{
              x: [0, -2020],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            className="flex gap-4 md:gap-6 whitespace-nowrap"
          >
            {[...Array(4)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-6">
                {row3Images.map((image, index) => (
                  <div
                    key={`${setIndex}-${index}`}
                    className="relative group cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    className="w-[220px] h-[140px] md:w-[380px] md:h-[240px]"
                  >
                    <img
                      src={image.url}
                      alt={`Portfolio ${image.id}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Fade to black at bottom - covers third row */}
        <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/80 to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}
