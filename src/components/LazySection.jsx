import React, { useState, useEffect, useRef } from "react";

/**
 * LazySection - Lazy loads content when it enters viewport
 * Only renders children when section is visible or about to be visible
 */
export default function LazySection({
  children,
  threshold = 0.1,
  rootMargin = "200px",
  fallback = null,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      {
        threshold,
        rootMargin, // Load 200px before section enters viewport
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, hasLoaded]);

  return <div ref={ref}>{isVisible ? children : fallback}</div>;
}
