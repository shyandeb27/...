/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ApologyData, EnvelopeState } from './types';
import { TopBar } from './components/TopBar';
import { Envelope } from './components/Envelope';
import { CelebrationCanvas } from './components/CelebrationCanvas';
import { PersonalizeModal } from './components/PersonalizeModal';
import { playSoftChime } from './utils/audio';

const INITIAL_APOLOGY: ApologyData = {
  recipientName: 'Siddhi',
  senderName: 'Shyan',
  whatHappened: 'I hid something from you instead of being open and honest with you.',
  whatIllDoDifferently:
    'I promise to never keep things from you again, to always be completely transparent, and to share everything openly with you.',
};

export default function App() {
  const [apologyData, setApologyData] = useState<ApologyData>(INITIAL_APOLOGY);
  const [envelopeState, setEnvelopeState] = useState<EnvelopeState>('closed');
  const [isAccepted, setIsAccepted] = useState(false);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load URL hash params or localStorage on first load
  useEffect(() => {
    try {
      const hash = window.location.hash.replace(/^#/, '');
      const search = window.location.search.replace(/^\?/, '');
      const query = hash || search;

      if (query) {
        const params = new URLSearchParams(query);
        const to = params.get('to');
        const from = params.get('from');
        const what = params.get('what');
        const future = params.get('future');

        if (to || from || what || future) {
          setApologyData((prev) => ({
            recipientName: to || prev.recipientName,
            senderName: from || prev.senderName,
            whatHappened: what || prev.whatHappened,
            whatIllDoDifferently: future || prev.whatIllDoDifferently,
          }));
        }
      }
    } catch (e) {
      console.debug('Could not parse URL query:', e);
    }

    // Check system dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const handleOpenEnvelope = () => {
    setEnvelopeState('opened');
  };

  const handleResetEnvelope = () => {
    setEnvelopeState('closed');
    setIsAccepted(false);
  };

  const handleAccept = useCallback(() => {
    setIsAccepted(true);
    playSoftChime(soundEnabled);
  }, [soundEnabled]);

  const handleSaveData = (newData: ApologyData) => {
    setApologyData(newData);
    // Update hash
    const params = new URLSearchParams();
    params.set('to', newData.recipientName);
    params.set('from', newData.senderName);
    params.set('what', newData.whatHappened);
    params.set('future', newData.whatIllDoDifferently);
    window.location.hash = params.toString();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden bg-[#FAF7F2] dark:bg-[#151118] text-[#342A2F] dark:text-[#F3ECF0] transition-colors duration-500">
      {/* Soft Ambient Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full bg-gradient-to-b from-rose-200/40 via-amber-100/30 to-transparent dark:from-rose-950/25 dark:via-purple-950/15 dark:to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-rose-100/30 dark:bg-rose-950/20 blur-3xl" />
      </div>

      {/* Floating Celebration Particles */}
      <CelebrationCanvas active={isAccepted} />

      {/* Top Bar */}
      <TopBar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onOpenPersonalize={() => setIsPersonalizeOpen(true)}
        onResetEnvelope={handleResetEnvelope}
        isOpened={envelopeState === 'opened'}
      />

      {/* Main Interactive Stage */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 z-10 w-full max-w-4xl mx-auto my-auto">
        <Envelope
          data={apologyData}
          state={envelopeState}
          isAccepted={isAccepted}
          onOpen={handleOpenEnvelope}
          onAccept={handleAccept}
        />
      </main>

      {/* Quiet Footer Note */}
      <footer className="w-full text-center py-4 text-xs font-medium text-stone-400 dark:text-stone-500 z-10 select-none">
        <p className="font-letter tracking-wide">
          Crafted with care, honesty, and affection.
        </p>
      </footer>

      {/* Personalize & Download Modal */}
      <PersonalizeModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
        data={apologyData}
        onSave={handleSaveData}
      />
    </div>
  );
}
