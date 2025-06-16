import { useRef, useCallback, useEffect } from "react";

export default function useLongPress(callback = () => {}, delay = 500) {
  const timeoutRef = useRef();
  const targetRef = useRef();

  const start = useCallback(() => {
    timeoutRef.current = setTimeout(callback, delay);
  }, [callback, delay]);

  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    const node = targetRef.current;
    if (!node) return;

    node.addEventListener("mousedown", start);
    node.addEventListener("touchstart", start);
    node.addEventListener("mouseup", clear);
    node.addEventListener("mouseleave", clear);
    node.addEventListener("touchend", clear);

    return () => {
      node.removeEventListener("mousedown", start);
      node.removeEventListener("touchstart", start);
      node.removeEventListener("mouseup", clear);
      node.removeEventListener("mouseleave", clear);
      node.removeEventListener("touchend", clear);
    };
  }, [start, clear]);

  return {
    ref: targetRef,
  };
}
