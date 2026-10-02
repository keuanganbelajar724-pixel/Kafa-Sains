/**
 * Reusable Drag & Drop Game Engine
 * Supports both touch tap-to-place and mouse drag, with friendly feedback and rewards.
 */

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { sound } from '../../services/sound';

interface DragDropCategory {
  id: string;
  label: string;
  icon: string;
  helper: string;
}

interface DragDropItem {
  id: string;
  label: string;
  icon: string;
  correctCategory: string;
}

interface DragDropConfig {
  categories: DragDropCategory[];
  items: DragDropItem[];
}

interface DragDropGameProps {
  config: DragDropConfig;
  title?: string;
  description?: string;
  onFinish: (rewardXp: number) => void;
  onBack: () => void;
}

export const DragDropGame: React.FC<DragDropGameProps> = ({ config, title, description, onFinish, onBack }) => {
  const [placedItems, setPlacedItems] = useState<Record<string, string>>({}); // itemId -> categoryId
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const unplacedItems = config.items.filter((item) => !placedItems[item.id]);
  const isAllCompleted = unplacedItems.length === 0;

  const handleSelectItem = (item: DragDropItem) => {
    sound.playPop();
    setSelectedItemId(item.id);
    setFeedbackMsg(`Pilih kotak indera untuk "${item.label}"`);
  };

  const handleSelectCategory = (category: DragDropCategory) => {
    if (!selectedItemId) {
      setFeedbackMsg('Pilih salah satu benda di bawah terlebih dahulu!');
      return;
    }

    const currentItem = config.items.find((i) => i.id === selectedItemId);
    if (!currentItem) return;

    if (currentItem.correctCategory === category.id) {
      sound.playSuccess();
      setPlacedItems((prev) => ({ ...prev, [currentItem.id]: category.id }));
      setSelectedItemId(null);
      setFeedbackMsg(`Tepat sekali! ${currentItem.label} masuk ke ${category.label}! ✨`);

      if (Object.keys(placedItems).length + 1 === config.items.length) {
        sound.playFanfare();
      }
    } else {
      sound.playGentleWrong();
      setFeedbackMsg(`Belum tepat! Yuk coba perhatikan fungsi ${category.label} lagi.`);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setPlacedItems({});
    setSelectedItemId(null);
    setFeedbackMsg(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Mini Game Edukasi
          </span>
          <h2 className="font-heading font-bold text-2xl text-slate-900">
            {title || 'Drag & Drop Panca Indera'}
          </h2>
          <p className="text-sm text-slate-600">
            {description || 'Ketuk benda di bawah, lalu ketuk kotak yang tepat!'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-xs font-bold inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mulai Ulang</span>
          </button>
        </div>
      </div>

      {/* Target Drop Zones (Categories) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {config.categories.map((cat) => {
          const itemsInCat = config.items.filter((i) => placedItems[i.id] === cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat)}
              className={`p-4 rounded-3xl border-2 text-center transition-all flex flex-col items-center justify-between min-h-[160px] ${
                selectedItemId
                  ? 'border-sky-300 bg-sky-50/40 hover:bg-sky-100 hover:border-sky-500 scale-102 cursor-pointer shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl shadow-inner mb-2">
                {cat.icon}
              </div>
              <div className="font-heading font-bold text-sm text-slate-900">{cat.label}</div>
              <div className="text-[10px] text-slate-500 leading-tight mb-2">{cat.helper}</div>

              {/* Items already placed in this category */}
              <div className="w-full flex flex-wrap gap-1 justify-center min-h-[30px] pt-2 border-t border-slate-100">
                {itemsInCat.map((item) => (
                  <span
                    key={item.id}
                    title={item.label}
                    className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-sm shadow-2xs"
                  >
                    {item.icon}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback banner */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 text-sky-900 text-xs font-semibold flex items-center justify-between">
          <span>{feedbackMsg}</span>
          <span className="text-slate-500">
            Tersisa: {unplacedItems.length} dari {config.items.length} benda
          </span>
        </div>
      )}

      {/* Items Waiting to Be Placed */}
      {!isAllCompleted ? (
        <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
            Benda yang Harus Dipasangkan:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {unplacedItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`p-3.5 rounded-2xl border-2 text-left flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'bg-amber-50 border-amber-500 ring-4 ring-amber-200 scale-105 shadow-md'
                      : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-xs'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div className="font-bold text-xs text-slate-800 leading-snug">
                    {item.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Victory Card */
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 flex items-center justify-center text-4xl">
            🎉
          </div>
          <h3 className="font-heading font-bold text-2xl">
            Luar Biasa! Semua Benda Tepat Pada Tempatnya!
          </h3>
          <p className="text-sm text-emerald-100 max-w-md mx-auto">
            Kamu sangat paham cara kerja kelima panca indera dalam kehidupan sehari-hari!
          </p>
          <button
            onClick={() => onFinish(80)}
            className="py-3 px-8 rounded-2xl bg-white text-emerald-800 font-heading font-bold text-sm shadow-md hover:bg-yellow-300 transition-all active:scale-95 inline-flex items-center gap-2"
          >
            <span>Klaim Hadiah 80 XP</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
