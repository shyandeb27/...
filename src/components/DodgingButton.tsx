import React, { useState, useEffect, useRef, useCallback } from 'react';

interface DodgingButtonProps {
  isAccepted: boolean;
  isVisible: boolean;
  onDodgeAttempt?: (count: number) => void;
}

const DODGE_TEXTS = [
  'Not accepted',
  'Are you sure? 🥺',
  'Please? 🥹',
  'Give me a chance? 💛',
  "Don't do this 💔",
  'Pretty please? 🌸',
  'I really am sorry... 🥺',
  'Still running away! 🏃‍♂️💨',
  'No rejections allowed! ✨',
];

export const DodgingButton: React.FC<DodgingButtonProps> = ({
  isAccepted,
  isVisible,
  onDodgeAttempt,
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isEvadingRef = useRef(false);

  const dodge = useCallback(
    (pointerX: number, pointerY: number) => {
      if (isAccepted || !isVisible || !buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const deltaX = btnCenterX - pointerX;
      const deltaY = btnCenterY - pointerY;
      const distance = Math.hypot(deltaX, deltaY);

      // Trigger if cursor/finger within 85px threshold or direct trigger
      if (distance < 85 || pointerX === 0) {
        if (isEvadingRef.current) return;
        isEvadingRef.current = true;
        setTimeout(() => {
          isEvadingRef.current = false;
        }, 120);

        setDodgeCount((prev) => {
          const next = prev + 1;
          onDodgeAttempt?.(next);
          return next;
        });

        // Compute escape angle
        let angle = Math.atan2(deltaY, deltaX);
        if (distance === 0 || isNaN(angle)) {
          angle = Math.random() * Math.PI * 2;
        } else {
          // Add a slight random angular deviation for playful organic movement
          angle += (Math.random() - 0.5) * 0.8;
        }

        const jumpDistance = 140 + Math.random() * 90;
        let targetX = btnCenterX + Math.cos(angle) * jumpDistance;
        let targetY = btnCenterY + Math.sin(angle) * jumpDistance;

        // Viewport padding bounds
        const pad = 24;
        const minX = pad + rect.width / 2;
        const maxX = window.innerWidth - pad - rect.width / 2;
        const minY = pad + rect.height / 2;
        const maxY = window.innerHeight - pad - rect.height / 2;

        // If target is out of bounds, bounce into safe random region
        if (targetX < minX || targetX > maxX) {
          targetX = minX + Math.random() * (maxX - minX);
        }
        if (targetY < minY || targetY > maxY) {
          targetY = minY + Math.random() * (maxY - minY);
        }

        const diffX = targetX - btnCenterX;
        const diffY = targetY - btnCenterY;

        setOffset((prev) => ({
          x: prev.x + diffX,
          y: prev.y + diffY,
        }));
      }
    },
    [isAccepted, isVisible, onDodgeAttempt]
  );

  // Global mousemove proximity detector
  useEffect(() => {
    if (isAccepted || !isVisible) return;

    const handleMouseMove = (e: MouseEvent) => {
      dodge(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        dodge(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        dodge(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isAccepted, isVisible, dodge]);

  if (!isVisible || isAccepted) return null;

  const currentText = DODGE_TEXTS[Math.min(dodgeCount, DODGE_TEXTS.length - 1)];

  return (
    <button
      ref={buttonRef}
      type="button"
      onMouseEnter={(e) => dodge(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        if (e.touches.length > 0) {
          dodge(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onClick={(e) => {
        // Fallback safety: if clicked somehow, dodge immediately without registering
        e.preventDefault();
        e.stopPropagation();
        dodge(e.clientX, e.clientY);
      }}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: 'transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1.2), opacity 0.4s ease',
      }}
      className="relative z-40 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wide text-stone-600 dark:text-stone-300 bg-white/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700/80 shadow-sm hover:shadow hover:border-rose-300 dark:hover:border-rose-800 transition-colors select-none cursor-pointer whitespace-nowrap active:scale-95"
      aria-label="Cannot be rejected"
    >
      {currentText}
    </button>
  );
};
