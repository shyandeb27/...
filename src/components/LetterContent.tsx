import React from 'react';
import { ApologyData } from '../types';

interface LetterContentProps {
  data: ApologyData;
  isAccepted: boolean;
}

export const LetterContent: React.FC<LetterContentProps> = ({ data, isAccepted }) => {
  const { recipientName, senderName, whatHappened, whatIllDoDifferently } = data;

  return (
    <div className="relative w-full text-left transition-all duration-700 select-text">
      {!isAccepted ? (
        <div className="space-y-3.5 transition-opacity duration-500">
          {/* Header Greeting */}
          <div className="flex items-baseline justify-between border-b border-rose-100 dark:border-rose-950/40 pb-2.5">
            <h2 className="font-letter text-lg sm:text-xl font-medium tracking-tight text-amber-800/90 dark:text-amber-300/90">
              Dear {recipientName || 'Friend'},
            </h2>
            <span className="font-handwritten text-xs sm:text-sm text-stone-400 dark:text-stone-500">
              from the bottom of my heart
            </span>
          </div>

          {/* Honest Apology & Taking Responsibility */}
          <p className="font-letter text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-200">
            {whatHappened || 'I hid something from you instead of being open and honest with you.'}{' '}
            I take full responsibility with no excuses, and I am truly sorry.
          </p>

          {/* What I'll do differently */}
          <p className="font-letter text-xs sm:text-sm leading-relaxed text-stone-600 dark:text-stone-300/90 italic pl-3 border-l-2 border-rose-300/60 dark:border-rose-600/60">
            {whatIllDoDifferently ||
              'I promise to never keep things from you again, to always be completely transparent, and to share everything openly with you.'}
          </p>

          {/* Sign-off */}
          <div className="pt-2 text-right">
            <span className="font-handwritten text-xl sm:text-2xl text-stone-800 dark:text-stone-100">
              — {senderName || 'Shyan'} 💛
            </span>
          </div>
        </div>
      ) : (
        /* Celebration Thank You Note */
        <div className="py-4 text-center space-y-3 animate-in fade-in zoom-in-95 duration-700">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 shadow-sm mb-1">
            <svg
              className="w-6 h-6 fill-current animate-pulse"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          <h2 className="font-letter text-xl sm:text-2xl font-semibold text-stone-800 dark:text-stone-100">
            Thank you. It means a lot to me.
          </h2>

          <p className="font-letter text-sm sm:text-base leading-relaxed text-stone-600 dark:text-stone-300 max-w-sm mx-auto">
            Your forgiveness and grace are a gift I will never take for granted, {recipientName || 'my friend'}.
          </p>

          <div className="pt-2 font-handwritten text-xl text-amber-700 dark:text-amber-400">
            Forever grateful, {senderName || 'Me'} 🌸
          </div>
        </div>
      )}
    </div>
  );
};
