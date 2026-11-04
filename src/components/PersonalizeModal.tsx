import React, { useState } from 'react';
import { ApologyData } from '../types';
import { downloadStandaloneHtmlFile } from '../utils/exportHtml';
import { X, Copy, Check, Download, Sparkles, RotateCcw } from 'lucide-react';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ApologyData;
  onSave: (newData: ApologyData) => void;
}

const DEFAULT_APOLOGY: ApologyData = {
  recipientName: 'Siddhi',
  senderName: 'Shyan',
  whatHappened: 'I hid something from you instead of being open and honest with you.',
  whatIllDoDifferently: 'I promise to never keep things from you again, to always be completely transparent, and to share everything openly with you.',
};

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
}) => {
  const [formData, setFormData] = useState<ApologyData>(data);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Calculate word count
  const fullMessage = `${formData.whatHappened} I take full responsibility with no excuses, and I am truly sorry. ${formData.whatIllDoDifferently}`;
  const wordCount = fullMessage.trim().split(/\s+/).filter(Boolean).length;

  const handleCopyShareLink = () => {
    const params = new URLSearchParams();
    params.set('to', formData.recipientName);
    params.set('from', formData.senderName);
    params.set('what', formData.whatHappened);
    params.set('future', formData.whatIllDoDifferently);

    const shareUrl = `${window.location.origin}${window.location.pathname}#${params.toString()}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSaveAndApply = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleDownload = () => {
    onSave(formData);
    downloadStandaloneHtmlFile(formData);
  };

  const handleResetDefaults = () => {
    setFormData(DEFAULT_APOLOGY);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FFFEFC] dark:bg-[#1C1620] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl border border-stone-200/90 dark:border-stone-800 text-stone-800 dark:text-stone-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xl">✍️</span>
            <h3 className="font-letter text-lg sm:text-xl font-semibold">Personalize Your Apology</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveAndApply} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
                Friend&apos;s Name (For)
              </label>
              <input
                type="text"
                required
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                placeholder="e.g. Maya"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-700/80 focus:outline-none focus:ring-2 focus:ring-rose-400/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
                Your Name (From)
              </label>
              <input
                type="text"
                required
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                placeholder="e.g. Jordan"
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-700/80 focus:outline-none focus:ring-2 focus:ring-rose-400/50"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider">
                What Happened (One honest sentence)
              </label>
            </div>
            <textarea
              rows={2}
              required
              value={formData.whatHappened}
              onChange={(e) => setFormData({ ...formData, whatHappened: e.target.value })}
              placeholder="e.g. I spoke impatiently during our meeting and dismissed your thoughts."
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-700/80 focus:outline-none focus:ring-2 focus:ring-rose-400/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
              What I&apos;ll Do Differently (Sincere commitment)
            </label>
            <textarea
              rows={2}
              required
              value={formData.whatIllDoDifferently}
              onChange={(e) => setFormData({ ...formData, whatIllDoDifferently: e.target.value })}
              placeholder="e.g. I promise to listen without interrupting, take deep breaths, and treat your input with the respect it deserves."
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-700/80 focus:outline-none focus:ring-2 focus:ring-rose-400/50 resize-none"
            />
          </div>

          {/* Word count meter (target: under 80 words) */}
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span>Word count:</span>
              <span className={`font-semibold ${wordCount <= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                {wordCount} / 80 words
              </span>
            </span>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset sample</span>
            </button>
          </div>

          {/* Quick preset scenarios */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block mb-1.5">
              Or pick an apology scenario:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    recipientName: formData.recipientName || 'Alex',
                    senderName: formData.senderName || 'Sam',
                    whatHappened: 'I forgot our scheduled catch-up call and made you feel like an afterthought.',
                    whatIllDoDifferently: 'I have set multiple reminders and promise to treat our time together with the priority it deserves.',
                  })
                }
                className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-stone-700 dark:text-stone-300 transition-colors"
              >
                📞 Missed call
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    recipientName: formData.recipientName || 'Alex',
                    senderName: formData.senderName || 'Sam',
                    whatHappened: 'I let my stress get the best of me and snapped at you when you were only trying to help.',
                    whatIllDoDifferently: 'I am practicing pausing before reacting and will always communicate gently with you.',
                  })
                }
                className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-stone-700 dark:text-stone-300 transition-colors"
              >
                🌧️ Snapped in stress
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    recipientName: formData.recipientName || 'Alex',
                    senderName: formData.senderName || 'Sam',
                    whatHappened: 'I ate the last pastry in the fridge that I knew you were saving for yourself.',
                    whatIllDoDifferently: 'I am getting you a fresh box of your favorite treats today and keeping hands off forever.',
                  })
                }
                className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-stone-700 dark:text-stone-300 transition-colors"
              >
                🥐 Ate the last snack
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-amber-800 dark:text-amber-200 bg-amber-100/70 dark:bg-amber-950/50 hover:bg-amber-200/70 dark:hover:bg-amber-900/50 transition-colors"
                title="Download as 1 self-contained HTML file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .html</span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply to Envelope</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
