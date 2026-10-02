/**
 * Kiko Character Mascot Component (Faceless Aesthetic)
 * Friendly science guide with speech bubbles and expressive states.
 */

import React from 'react';
import mascotImg from '../../assets/images/kiko_faceless_mascot_1790869612195.jpg';

interface KikoMascotProps {
  message?: string;
  mood?: 'happy' | 'thinking' | 'celebrating' | 'curious';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  actionText?: string;
  onAction?: () => void;
}

export const KikoMascot: React.FC<KikoMascotProps> = ({
  message = 'Halo teman kecil! Ayo mulai petualangan sains kita!',
  mood = 'happy',
  size = 'md',
  className = '',
  actionText,
  onAction,
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20 sm:w-24 sm:h-24',
    lg: 'w-28 h-28 sm:w-36 sm:h-36',
  };

  const moodBadges = {
    happy: '🌟',
    thinking: '💭',
    celebrating: '🎉',
    curious: '✨',
  };

  return (
    <div className={`flex items-start gap-3 sm:gap-4 ${className}`}>
      {/* Faceless Mascot Avatar */}
      <div className="relative shrink-0">
        <div
          className={`${sizeClasses[size]} rounded-2xl overflow-hidden shadow-md border-2 border-white ring-2 ring-sky-300/60 bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center`}
        >
          <img
            src={mascotImg}
            alt="Kiko Sahabat Petualang Sains (Faceless)"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {/* Fallback Icon if img hidden */}
          <span className="text-3xl select-none" aria-hidden="true">
            🧭
          </span>
        </div>

        {/* Mood indicator badge (faceless symbols) */}
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-xs">
          {moodBadges[mood]}
        </div>
      </div>

      {/* Speech Bubble */}
      {message && (
        <div className="relative flex-1 bg-white p-3.5 sm:p-4 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200/90 text-slate-800">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-heading font-bold text-sky-700 text-xs tracking-wide">
              Kiko Penjelajah
            </span>
            <span className="text-[10px] text-slate-500 font-medium">· Pemandu Sains</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {message}
          </p>
          {actionText && onAction && (
            <button
              onClick={onAction}
              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>{actionText}</span>
              <span>→</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
