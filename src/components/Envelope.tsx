import React from 'react';
import { ApologyData, EnvelopeState } from '../types';
import { LetterContent } from './LetterContent';
import { DodgingButton } from './DodgingButton';

interface EnvelopeProps {
  data: ApologyData;
  state: EnvelopeState;
  isAccepted: boolean;
  onOpen: () => void;
  onAccept: () => void;
  onDodgeAttempt?: (count: number) => void;
}

export const Envelope: React.FC<EnvelopeProps> = ({
  data,
  state,
  isAccepted,
  onOpen,
  onAccept,
  onDodgeAttempt,
}) => {
  const isOpened = state === 'opened';

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-lg mx-auto py-8 sm:py-14 select-none">
      {/* 3D Envelope Container */}
      <div
        className={`relative w-[310px] h-[215px] sm:w-[390px] sm:h-[260px] perspective-1000 transition-transform duration-700 ${
          !isOpened ? 'animate-float-envelope cursor-pointer' : ''
        }`}
        onClick={() => {
          if (!isOpened) onOpen();
        }}
        role="button"
        tabIndex={0}
        aria-label={isOpened ? 'Opened apology letter' : 'Tap to open apology envelope'}
        onKeyDown={(e) => {
          if (!isOpened && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onOpen();
          }
        }}
      >
        {/* Envelope Back Interior Panel */}
        <div className="absolute inset-0 rounded-2xl bg-[#F6D5DC] dark:bg-[#251723] border border-rose-200/60 dark:border-rose-950/60 shadow-xl overflow-hidden transition-colors duration-500" />

        {/* Sliding Letter Card (inside pocket, slides up when opened) */}
        <div
          className={`absolute left-3 right-3 sm:left-5 sm:right-5 top-4 bg-[#FFFEFC] dark:bg-[#1F1923] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-lg dark:shadow-2xl transition-all duration-700 ease-out preserve-3d ${
            isOpened
              ? '-translate-y-[85px] sm:-translate-y-[115px] opacity-100 z-30 pointer-events-auto'
              : 'translate-y-2 opacity-0 z-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <LetterContent data={data} isAccepted={isAccepted} />
        </div>

        {/* Envelope 3D Folding Top Flap */}
        <div
          className={`absolute top-0 left-0 w-full h-[120px] sm:h-[145px] origin-top preserve-3d transition-all duration-800 ease-in-out ${
            isOpened
              ? 'rotate-x-180 z-10 pointer-events-none'
              : 'z-25'
          }`}
          style={{
            transform: isOpened ? 'rotateX(180deg)' : 'rotateX(0deg)',
            transformOrigin: 'top center',
          }}
        >
          {/* Outer Flap Face (Blush Pink Triangle) */}
          <div
            className="w-full h-full bg-[#FCE8EB] dark:bg-[#322131] border-t border-rose-200/50 dark:border-rose-900/40 shadow-sm"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
            }}
          />
        </div>

        {/* Envelope Front Pockets (Left, Right, Bottom Triangles) */}
        {/* Left Fold */}
        <div
          className="absolute inset-0 bg-[#FAD9E0] dark:bg-[#2C1C29] z-20 pointer-events-none rounded-2xl"
          style={{
            clipPath: 'polygon(0 0, 0 100%, 53% 54%)',
          }}
        />

        {/* Right Fold */}
        <div
          className="absolute inset-0 bg-[#FAD9E0] dark:bg-[#2C1C29] z-20 pointer-events-none rounded-2xl"
          style={{
            clipPath: 'polygon(100% 0, 100% 100%, 47% 54%)',
          }}
        />

        {/* Bottom Fold */}
        <div
          className="absolute inset-0 bg-[#FDECEF] dark:bg-[#2F1F2D] z-22 pointer-events-none rounded-b-2xl shadow-sm"
          style={{
            clipPath: 'polygon(0 100%, 100% 100%, 50% 48%)',
          }}
        />

        {/* Wax Seal Stamp (Centered at flap tip when closed) */}
        <div
          className={`absolute top-[82px] sm:top-[100px] left-1/2 -translate-x-1/2 z-26 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#F5D59A] via-[#E8B86D] to-[#CF9B48] dark:from-[#ECC37F] dark:via-[#DDA254] dark:to-[#B68134] shadow-md flex items-center justify-center transition-all duration-500 animate-seal-glow ${
            isOpened ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          {/* Inner embossed ring */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-amber-100/50 flex items-center justify-center shadow-inner">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 fill-[#FFFDF9] drop-shadow-sm"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>

        {/* "Sorry" Written in handwritten-style font on front */}
        <div
          className={`absolute bottom-5 sm:bottom-6 inset-x-0 text-center font-handwritten text-3xl sm:text-4xl font-semibold tracking-wide text-stone-700/85 dark:text-stone-200/85 z-24 pointer-events-none transition-opacity duration-400 ${
            isOpened ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Sorry
        </div>
      </div>

      {/* Tap hint below closed envelope */}
      <div
        className={`mt-6 flex items-center gap-1.5 text-xs sm:text-sm font-medium tracking-wider lowercase text-stone-500 dark:text-stone-400 transition-all duration-400 ${
          isOpened ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100 animate-tap-hint'
        }`}
      >
        <span>✉️</span>
        <span>tap to open</span>
      </div>

      {/* Interactive Action Buttons (Fade in when envelope opens) */}
      <div
        className={`mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full transition-all duration-700 ${
          isOpened
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Accepted Button */}
        <button
          type="button"
          onClick={onAccept}
          className={`group px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-amber-950 dark:text-amber-950 bg-gradient-to-r from-[#F6D28B] via-[#E8B86D] to-[#E2AA54] hover:from-[#FADAA0] hover:to-[#E8B86D] shadow-md hover:shadow-lg shadow-amber-500/15 dark:shadow-amber-900/30 transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            isAccepted ? 'ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-stone-900' : ''
          }`}
        >
          <span>Accepted</span>
          <span className="transition-transform group-hover:scale-125">💛</span>
        </button>

        {/* Not Accepted Dodging Button */}
        <DodgingButton
          isAccepted={isAccepted}
          isVisible={isOpened}
          onDodgeAttempt={onDodgeAttempt}
        />
      </div>
    </div>
  );
};
