import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Link } from "react-router-dom";
import aureaLogo from "../../assets/AUREA - Logo.png";

const AnimatedLogo = ({ className = "" }) => {
  const [showText, setShowText] = useState(false);
  const { scrollY } = useScroll();
  const logoRef = useRef(null);

  // Transform values based on scroll position
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.8]);
  const logoOpacity = useTransform(scrollY, [0, 50, 100], [1, 0.5, 0]);
  const textOpacity = useTransform(scrollY, [50, 100, 150], [0, 0.5, 1]);
  const textScale = useTransform(scrollY, [50, 150], [0.5, 1]);

  // Monitor scroll to trigger text appearance
  useEffect(() => {
    const unsubscribe = scrollY.onChange((value) => {
      setShowText(value > 80);
    });

    return () => unsubscribe();
  }, [scrollY]);

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.5,
      rotateX: -90,
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    }),
    exit: (i) => ({
      opacity: 0,
      y: -30,
      scale: 0.8,
      rotateX: 90,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeInOut",
      },
    }),
  };

  const logoVariants = {
    initial: { scale: 1, opacity: 1 },
    animate: {
      scale: logoScale,
      opacity: logoOpacity,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      scale: 0,
      opacity: 0,
      rotateY: 180,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const AUREA = "AUREA".split("");

  return (
    <Link to="/" className={`relative flex items-center ${className}`}>
      <div className="relative w-full h-12 flex items-center justify-start overflow-hidden">
        {/* Logo Image */}
        <AnimatePresence>
          {!showText && (
            <motion.div
              ref={logoRef}
              variants={logoVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute left-0 flex items-center"
              style={{
                scale: logoScale,
                opacity: logoOpacity,
              }}
            >
              <motion.img
                src={aureaLogo}
                alt="AUREA Logo"
                className="h-8 w-auto"
                whileHover={{
                  scale: 1.1,
                  rotateY: 5,
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Text */}
        <AnimatePresence>
          {showText && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute left-0 flex items-center"
              style={{
                opacity: textOpacity,
                scale: textScale,
              }}
            >
              {AUREA.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  className="text-2xl font-bold tracking-wide uppercase text-[#1a1a1a] inline-block"
                  style={{
                    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                  whileHover={{
                    color: "#fb8500",
                    scale: 1.1,
                    y: -2,
                    transition: { duration: 0.2 },
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transition Effects */}
        <motion.div
          className="absolute left-0 w-full h-full pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: showText ? [0, 0.3, 0] : 0,
            background: showText
              ? "linear-gradient(90deg, transparent 0%, rgba(251,133,0,0.1) 50%, transparent 100%)"
              : "transparent",
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Sparkle Effect */}
        <AnimatePresence>
          {showText && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-[#fb8500] rounded-full"
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: Math.random() * 100,
                    y: Math.random() * 20,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    rotate: 360,
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
};

export default AnimatedLogo;
