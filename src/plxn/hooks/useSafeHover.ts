import { useState, useRef, useCallback, useEffect } from 'react';
import { isPointInPredictionCone, Point } from '../utils/safeTriangle';

interface UseSafeHoverOptions {
  delayMs?: number;
  keepOpenWhen?: boolean;
}

export function useSafeHover<T extends HTMLElement = HTMLElement, P extends HTMLElement = HTMLElement>({
  delayMs = 350,
  keepOpenWhen = false,
}: UseSafeHoverOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<T | null>(null);
  const popupRef = useRef<P | null>(null);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMousePosRef = useRef<Point | null>(null);
  const isPointerInsidePopupRef = useRef(false);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const open = useCallback(() => {
    cancelClose();
    setIsOpen(true);
  }, [cancelClose]);

  const scheduleClose = useCallback(
    (e?: React.MouseEvent | MouseEvent) => {
      if (keepOpenWhen) return;

      cancelClose();

      const targetElement = popupRef.current;
      if (e && targetElement && lastMousePosRef.current) {
        const currentPos: Point = { x: e.clientX, y: e.clientY };
        const rect = targetElement.getBoundingClientRect();
        const isInCone = isPointInPredictionCone(currentPos, lastMousePosRef.current, rect);

        const effectiveDelay = isInCone ? Math.max(delayMs, 400) : delayMs;

        closeTimerRef.current = setTimeout(() => {
          if (!isPointerInsidePopupRef.current && !keepOpenWhen) {
            setIsOpen(false);
          }
        }, effectiveDelay);
        return;
      }

      closeTimerRef.current = setTimeout(() => {
        if (!isPointerInsidePopupRef.current && !keepOpenWhen) {
          setIsOpen(false);
        }
      }, delayMs);
    },
    [cancelClose, delayMs, keepOpenWhen]
  );

  const closeImmediate = useCallback(() => {
    cancelClose();
    isPointerInsidePopupRef.current = false;
    setIsOpen(false);
  }, [cancelClose]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelClose();
    };
  }, [cancelClose]);

  useEffect(() => {
    if (keepOpenWhen) {
      cancelClose();
      setIsOpen(true);
    }
  }, [keepOpenWhen, cancelClose]);

  const triggerProps = {
    ref: triggerRef,
    onMouseEnter: () => open(),
    onMouseLeave: (e: React.MouseEvent) => scheduleClose(e),
  };

  const popupProps = {
    ref: popupRef,
    onMouseEnter: () => {
      isPointerInsidePopupRef.current = true;
      cancelClose();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      isPointerInsidePopupRef.current = false;
      scheduleClose(e);
    },
  };

  return {
    isOpen,
    setIsOpen,
    open,
    closeImmediate,
    scheduleClose,
    cancelClose,
    triggerRef,
    popupRef,
    triggerProps,
    popupProps,
  };
}
