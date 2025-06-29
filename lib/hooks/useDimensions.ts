import { useState, useEffect, useRef, RefObject } from "react";

interface Dimensions {
  width: number;
  height: number;
}

export const useDimensions = (
  ref: RefObject<HTMLElement | null>
): Dimensions => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const updateDimensions = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();

    observerRef.current = new ResizeObserver(updateDimensions);
    observerRef.current.observe(ref.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [ref]);

  return dimensions;
};
