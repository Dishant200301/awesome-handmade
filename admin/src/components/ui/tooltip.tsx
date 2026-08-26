import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'right',
  delayDuration = 80,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      if (side === 'right') {
        setCoords({
          top: rect.top + rect.height / 2,
          left: rect.right + 10,
        });
      } else if (side === 'left') {
        setCoords({
          top: rect.top + rect.height / 2,
          left: rect.left - 10,
        });
      } else if (side === 'top') {
        setCoords({
          top: rect.top - 10,
          left: rect.left + rect.width / 2,
        });
      } else {
        setCoords({
          top: rect.bottom + 10,
          left: rect.left + rect.width / 2,
        });
      }
    }
  };

  const handleMouseEnter = () => {
    if (disabled || !content) return;
    updatePosition();
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsVisible(true);
    }, delayDuration);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (disabled || !content) return children;

  return (
    <div
      ref={triggerRef}
      className="w-full flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {isVisible &&
        ReactDOM.createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -4 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: coords.top,
                left: coords.left,
                transform: 'translateY(-50%)',
                zIndex: 99999,
              }}
              className="pointer-events-none whitespace-nowrap bg-zinc-900 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-md shadow-2xl border border-zinc-800 tracking-tight"
            >
              {content}
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};
