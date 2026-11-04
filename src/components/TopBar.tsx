import React from 'react';
import { Sun, Moon, Volume2, VolumeX, Edit3, RotateCcw } from 'lucide-react';

interface TopBarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenPersonalize: () => void;
  onResetEnvelope: () => void;
  isOpened: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  onOpenPersonalize,
  onResetEnvelope,
  isOpened,
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-8 py-4 sm:py-5 z-40 relative">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3">
        <span className="font-handwritten text-2xl sm:text-3xl font-semibold tracking-wide text-stone-800 dark:text-stone-100 whitespace-nowrap">
          A Note For You
        </span>
      </div>

      {/* Zone 2 & 3: Clean utilities and actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Reset envelope if opened */}
        {isOpened && (
          <button
            type="button"
            onClick={onResetEnvelope}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors flex items-center gap-1.5"
            title="Close envelope and restart"
            aria-label="Re-close envelope"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Re-fold</span>
          </button>
        )}

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors"
          title={soundEnabled ? 'Mute soft acceptance chime' : 'Enable soft chime'}
          aria-label={soundEnabled ? 'Mute chime' : 'Enable chime'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors"
          title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
        </button>

        {/* Personalize Button */}
        <button
          type="button"
          onClick={onOpenPersonalize}
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-100 bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700/80 shadow-sm hover:shadow hover:border-rose-300 dark:hover:border-rose-800 transition-all whitespace-nowrap"
        >
          <Edit3 className="w-3.5 h-3.5 text-rose-400" />
          <span>Personalize</span>
        </button>
      </div>
    </header>
  );
};
