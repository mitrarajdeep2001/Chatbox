import { useEffect, useRef } from "react";

interface Options {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export const useIntersectionObserver = (
  callback: () => void,
  shouldFireEvent: () => boolean, // Ensure event fires only once per message
  options: Options = { threshold: 1.0 }
) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && shouldFireEvent()) {
          callback(); // Fire the event only if it hasn’t been fired before
        }
      });
    }, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [callback, shouldFireEvent, options]);

  return targetRef;
};

export const useUserInteraction = (callback: () => void) => {
  useEffect(() => {
    const handleUserInteraction = () => {
      callback();
    };

    // Attach event listeners for user interactions
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);
    document.addEventListener("mousemove", handleUserInteraction);

    // Cleanup event listeners when the component unmounts
    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("mousemove", handleUserInteraction);
    };
  }, [callback]);
};
