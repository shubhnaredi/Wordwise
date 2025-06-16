import { useRef, useCallback } from "react";

export default function useLongPress(callback = () => {}, ms = 500) {
  const timerRef = useRef();
  const targetRef = useRef();

  const start = useCallback((e) => {
    e.persist?.();
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => callback(e), ms);
  }, [callback, ms]);

  const clear = () => clearTimeout(timerRef.current);

  const bind = {
    onTouchStart: start,
    onTouchEnd: clear,
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    ref: targetRef,
  };

  return bind;
}
