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

// Detect mobile device
export const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768
  );
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

  // Consider weak if mobile, less than 4 cores, or slow connection
  return isMobileDevice() || cores < 4 || slowConnection;
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
      duration: 0.2,
      staggerDelay: 0,
      disabled: false,
    };
  }

  return {
    duration: 0.4,
    staggerDelay: 0.05,
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
      transition: { duration: config.duration },
    };

export const fadeInUp =
  config.disabled || isWeakDevice()
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: config.duration },
      };

export const fadeInDown =
  config.disabled || isWeakDevice()
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, y: -15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: config.duration },
      };

// Slide animations (transform only - hardware accelerated)
export const slideInLeft =
  config.disabled || isWeakDevice()
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: config.duration },
      };

export const slideInRight =
  config.disabled || isWeakDevice()
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: config.duration },
      };

// Scale animations (transform only)
export const scaleIn =
  config.disabled || isWeakDevice()
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: config.duration },
      };

// Hover animations - disabled on mobile/weak devices
export const hoverScale =
  config.disabled || isWeakDevice()
    ? {}
    : {
        whileHover: { scale: 1.02 },
        transition: { duration: 0.15 },
      };

export const hoverLift =
  config.disabled || isWeakDevice()
    ? {}
    : {
        whileHover: { y: -3 },
        transition: { duration: 0.15 },
      };

// Stagger container variants - disabled on mobile
export const staggerContainer =
  config.disabled || isWeakDevice()
    ? {}
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: config.staggerDelay,
          },
        },
      };

export const staggerItem =
  config.disabled || isWeakDevice()
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      }
    : {
        hidden: { opacity: 0, y: 10 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: config.duration },
        },
      };

// Viewport settings for scroll animations
export const viewportConfig = {
  once: true, // Animate only once when entering viewport
  margin: "0px", // Start animation when element is visible
  amount: 0.2, // Trigger when 20% of element is visible
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
