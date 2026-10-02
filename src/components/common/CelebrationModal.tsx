/**
 * Celebration Modal for completing stages, quests, and unlocking badges.
 * Features confetti burst, XP count-up, star sparkles, and cheerful audio.
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { sound } from '../../services/sound';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  rewardXp?: number;
  rewardStars?: number;
  badgeTitle?: string;
  badgeIcon?: string;
  nextActionText?: string;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  title = 'Hebat Sekali! Misi Selesai!',
  subtitle = 'Kamu telah berhasil menyelesaikan petualangan ini dengan luar biasa!',
  rewardXp = 50,
  rewardStars = 2,
  badgeTitle,
  badgeIcon = '🏆',
  nextActionText = 'Lanjut Petualangan',
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playFanfare();
      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38BDF8', '#818CF8', '#FBBF24', '#34D399', '#F472B6'],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 text-center transform transition-all scale-100">
        {/* Floating badge crown */}
        <div className="w-20 h-20 mx-auto -mt-16 sm:-mt-20 mb-4 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-white shadow-xl flex items-center justify-center text-4xl animate-bounce">
          {badgeIcon || '🎉'}
        </div>

        <h3 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed font-medium">
          {subtitle}
        </p>

        {/* Reward pills */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center gap-2">
            <span className="text-xl">⭐</span>
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-sky-600 tracking-wider">Perolehan XP</div>
              <div className="text-lg font-extrabold text-sky-800 tabular-nums">+{rewardXp} XP</div>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-yellow-50 border border-yellow-100 flex items-center justify-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-500" />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-yellow-700 tracking-wider">Bintang Emas</div>
              <div className="text-lg font-extrabold text-yellow-800 tabular-nums">+{rewardStars} Bintang</div>
            </div>
          </div>
        </div>

        {/* Unlocked Badge preview if any */}
        {badgeTitle && (
          <div className="mb-6 p-3 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-indigo-100 flex items-center justify-center text-xl shrink-0">
              <Award className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                Lencana Baru Terbuka!
              </div>
              <div className="text-xs font-bold text-indigo-950">{badgeTitle}</div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-heading font-bold text-base shadow-lg shadow-sky-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>{nextActionText}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
