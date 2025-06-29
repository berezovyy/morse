import { useState, useEffect, useRef, RefObject, useCallback } from "react";

interface Dimensions {
  width: number;
  height: number;
}

// Singleton ResizeObserver to reduce overhead
let sharedObserver: ResizeObserver | null = null;
const observerCallbacks = new WeakMap<Element, () => void>();

const getSharedObserver = (): ResizeObserver => {
  if (!sharedObserver) {
    sharedObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const callback = observerCallbacks.get(entry.target);
        if (callback) {
          callback();
        }
      }
    });
  }
  return sharedObserver;
};

export const useDimensionsOptimized = (
  ref: RefObject<HTMLElement | null>,
  debounceMs: number = 0
): Dimensions => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateDimensions = useCallback(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();

      // Only update if dimensions actually changed
      setDimensions((prev) => {
        if (prev.width === width && prev.height === height) {
          return prev;
        }
        return { width, height };
      });
    }
  }, [ref]);

  const debouncedUpdate = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (debounceMs > 0) {
      timeoutRef.current = setTimeout(updateDimensions, debounceMs);
    } else {
      updateDimensions();
    }
  }, [updateDimensions, debounceMs]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Initial dimensions
    updateDimensions();

    // Use shared observer
    const observer = getSharedObserver();
    observerCallbacks.set(element, debouncedUpdate);
    observer.observe(element);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (element) {
        observerCallbacks.delete(element);
        observer.unobserve(element);
      }
    };
  }, [ref, debouncedUpdate, updateDimensions]);

  return dimensions;
};

// Hook for just width (more efficient when height isn't needed)
export const useWidth = (
  ref: RefObject<HTMLElement | null>,
  debounceMs: number = 0
): number => {
  const [width, setWidth] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateWidth = useCallback(() => {
    if (ref.current) {
      const newWidth = ref.current.getBoundingClientRect().width;
      setWidth((prev) => (prev === newWidth ? prev : newWidth));
    }
  }, [ref]);

  const debouncedUpdate = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (debounceMs > 0) {
      timeoutRef.current = setTimeout(updateWidth, debounceMs);
    } else {
      updateWidth();
    }
  }, [updateWidth, debounceMs]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Initial width
    updateWidth();

    // Use shared observer
    const observer = getSharedObserver();
    observerCallbacks.set(element, debouncedUpdate);
    observer.observe(element);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (element) {
        observerCallbacks.delete(element);
        observer.unobserve(element);
      }
    };
  }, [ref, debouncedUpdate, updateWidth]);

  return width;
};
