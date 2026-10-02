/**
 * Reusable Sequence Ordering Game Engine
 * e.g. Metamorphosis of Butterfly (Telur -> Ulat -> Kepompong -> Kupu-kupu)
 */

import React, { useState } from 'react';
import { Sparkles, RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sound } from '../../services/sound';

interface SequenceStage {
  id: string;
  order: number;
  title: string;
  icon: string;
  desc: string;
}

interface SequenceConfig {
  stages: SequenceStage[];
}

interface SequenceGameProps {
  config: SequenceConfig;
  title?: string;
  description?: string;
  onFinish: (rewardXp: number) => void;
  onBack: () => void;
}

export const SequenceGame: React.FC<SequenceGameProps> = ({ config, title, description, onFinish, onBack }) => {
  // Scramble the stages initially
  const [availableCards, setAvailableCards] = useState<SequenceStage[]>(() => {
    return [...config.stages].sort(() => Math.random() - 0.5);
  });
  const [placedSlots, setPlacedSlots] = useState<(SequenceStage | null)[]>([null, null, null, null]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const isComplete = placedSlots.every((s) => s !== null);

  const handlePlaceCardInNextSlot = (card: SequenceStage) => {
    sound.playPop();
    const nextEmptyIndex = placedSlots.findIndex((s) => s === null);
    if (nextEmptyIndex === -1) return;

    const newSlots = [...placedSlots];
    newSlots[nextEmptyIndex] = card;
    setPlacedSlots(newSlots);
    setAvailableCards((prev) => prev.filter((c) => c.id !== card.id));

    // Check if correct order so far
    if (card.order === nextEmptyIndex + 1) {
      sound.playSuccess();
      setFeedback(`Bagus! Tahap ${nextEmptyIndex + 1} benar!`);
    } else {
      sound.playGentleWrong();
      setFeedback(`Tahap ${nextEmptyIndex + 1} belum tepat. Perhatikan urutan pertumbuhannya.`);
    }

    if (newSlots.every((s, idx) => s !== null && s.order === idx + 1)) {
      sound.playFanfare();
    }
  };

  const handleReset = () => {
    sound.playClick();
    setAvailableCards([...config.stages].sort(() => Math.random() - 0.5));
    setPlacedSlots([null, null, null, null]);
    setFeedback(null);
  };

  const isAllCorrect = placedSlots.every((s, idx) => s !== null && s.order === idx + 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Siklus & Urutan Sains
          </span>
          <h2 className="font-heading font-bold text-2xl text-slate-900">
            {title || 'Susun Urutan Metamorfosis'}
          </h2>
          <p className="text-sm text-slate-600">
            {description || 'Urutkan tahap kehidupan dengan urutan yang tepat dari awal hingga akhir!'}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-xs font-bold inline-flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Mulai Ulang</span>
        </button>
      </div>

      {/* Slots Sequence (1 to 4) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {placedSlots.map((slot, index) => {
          const isSlotCorrect = slot !== null && slot.order === index + 1;
          return (
            <div
              key={index}
              className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-between min-h-[200px] text-center transition-all ${
                slot
                  ? isSlotCorrect
                    ? 'bg-emerald-50/70 border-emerald-400'
                    : 'bg-amber-50 border-amber-300'
                  : 'bg-slate-50 border-dashed border-slate-300'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center mb-2">
                {index + 1}
              </div>

              {slot ? (
                <>
                  <div className="text-4xl mb-1">{slot.icon}</div>
                  <h4 className="font-heading font-bold text-sm text-slate-900">{slot.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">{slot.desc}</p>
                  <div className="mt-2 text-xs font-bold">
                    {isSlotCorrect ? (
                      <span className="text-emerald-700 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Benar
                      </span>
                    ) : (
                      <span className="text-amber-700">Perlu ditukar</span>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs font-medium">
                  <span>Slot Tahap {index + 1}</span>
                  <span className="text-[10px] mt-1">Pilih kartu di bawah</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 text-sky-900 text-xs font-semibold">
          {feedback}
        </div>
      )}

      {/* Available cards to pick */}
      {availableCards.length > 0 ? (
        <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
            Kartu Tahapan yang Tersedia (Ketuk untuk Menaruh di Urutan Berikutnya):
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {availableCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handlePlaceCardInNextSlot(card)}
                className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all text-center flex flex-col items-center gap-2 active:scale-95"
              >
                <span className="text-3xl">{card.icon}</span>
                <span className="font-heading font-bold text-sm text-slate-800">{card.title}</span>
              </button>
            ))}
          </div>
        </div>
      ) : isAllCorrect ? (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 flex items-center justify-center text-4xl">
            🦋
          </div>
          <h3 className="font-heading font-bold text-2xl">
            Luar Biasa! Urutan Siklus Sempurna!
          </h3>
          <p className="text-sm text-emerald-100 max-w-md mx-auto">
            Telur menetas jadi ulat, lalu tidur dalam kepompong, hingga menjadi kupu-kupu yang bersayap indah!
          </p>
          <button
            onClick={() => onFinish(85)}
            className="py-3 px-8 rounded-2xl bg-white text-emerald-800 font-heading font-bold text-sm shadow-md hover:bg-yellow-300 transition-all active:scale-95 inline-flex items-center gap-2"
          >
            <span>Klaim Hadiah 85 XP</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
};
