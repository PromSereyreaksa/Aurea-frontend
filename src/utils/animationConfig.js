/**
 * Optimized Animation Configuration for Weak Devices
 *
 * Key Optimizations:
 * 1. Reduced motion preference detection
 * 2. Hardware-accelerated properties only (transform, opacity)
 * 3. Shorter durations
 * 4. Simplified easing functions
 * 5. Conditional animations based on device capabilities
 */

// Detect if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Detect weak device based on hardware concurrency and connection
export const isWeakDevice = () => {
  if (typeof window === "undefined") return false;

  const cores = navigator.hardwareConcurrency || 4;
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  const slowConnection =
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "slow-2g";

  // Consider weak if less than 4 cores or slow connection
  return cores < 4 || slowConnection;
};

// Get appropriate animation configuration based on device capabilities
export const getAnimationConfig = () => {
  const reduced = prefersReducedMotion();
  const weak = isWeakDevice();

  if (reduced) {
    return {
      duration: 0,
      initial: {},
      animate: {},
      transition: {},
      disabled: true,
    };
  }

  if (weak) {
    return {
      duration: 0.3,
      staggerDelay: 0.05,
      disabled: false,
    };
  }

  return {
    duration: 0.6,
    staggerDelay: 0.1,
    disabled: false,
  };
};

const config = getAnimationConfig();

// Fade animations (opacity only - very performant)
export const fadeIn = config.disabled
  ? {}
  : {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: config.duration, ease: [0.25, 0.1, 0.25, 1] },
    };

export const fadeInUp = config.disabled
  ? {}
  : {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: config.duration, ease: [0.25, 0.1, 0.25, 1] },
    };

export const fadeInDown = config.disabled
  ? {}
  : {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: config.duration, ease: [0.25, 0.1, 0.25, 1] },
    };

// Slide animations (transform only - hardware accelerated)
export const slideInLeft = config.disabled
  ? {}
  : {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: config.duration, ease: [0.25, 0.1, 0.25, 1] },
    };

export const slideInRight = config.disabled
  ? {}
  : {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: config.duration, ease: [0.25, 0.1, 0.25, 1] },
    };

// Scale animations (transform only)
export const scaleIn = config.disabled
  ? {}
  : {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: config.duration, ease: [0.25, 0.1, 0.25, 1] },
    };

// Hover animations - only on non-weak devices
export const hoverScale =
  config.disabled || isWeakDevice()
    ? {}
    : {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        transition: { duration: 0.2 },
      };

export const hoverLift =
  config.disabled || isWeakDevice()
    ? {}
    : {
        whileHover: { y: -5 },
        transition: { duration: 0.2 },
      };

// Stagger container variants
export const staggerContainer = config.disabled
  ? {}
  : {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: config.staggerDelay,
          delayChildren: 0.1,
        },
      },
    };

export const staggerItem = config.disabled
  ? {}
  : {
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: config.duration, ease: [0.25, 0.1, 0.25, 1] },
      },
    };

// Viewport settings for scroll animations
export const viewportConfig = {
  once: true, // Animate only once when entering viewport
  margin: "-50px", // Start animation slightly before element is visible
  amount: 0.3, // Trigger when 30% of element is visible
};

// Floating animations (only for powerful devices)
export const getFloatingAnimation = () => {
  if (config.disabled || isWeakDevice()) return {};

  return {
    animate: {
      y: [0, -20, 0],
    },
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };
};

// Background blob animations (only for powerful devices)
export const getBlobAnimation = (duration = 20) => {
  if (config.disabled || isWeakDevice()) {
    // Static position for weak devices
    return {};
  }

  return {
    animate: {
      y: [0, -30, 0],
      x: [0, 20, 0],
    },
    transition: {
      duration,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };
};

// Helper to get delay
export const getDelay = (index) => {
  if (config.disabled) return 0;
  return index * config.staggerDelay;
};

// Export configuration
export default {
  fadeIn,
  fadeInUp,
  fadeInDown,
  slideInLeft,
  slideInRight,
  scaleIn,
  hoverScale,
  hoverLift,
  staggerContainer,
  staggerItem,
  viewportConfig,
  getFloatingAnimation,
  getBlobAnimation,
  getDelay,
  config,
  isWeakDevice: isWeakDevice(),
  prefersReducedMotion: prefersReducedMotion(),
};
