/**
 * Reusable Find Object / Observation Game Engine
 * Nature ecosystem scenery where kids search and tap hidden science discoveries!
 */

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RotateCcw, Search, Eye } from 'lucide-react';
import { sound } from '../../services/sound';

interface HiddenScienceItem {
  id: string;
  name: string;
  icon: string;
  x: number; // percentage 10 to 85
  y: number; // percentage 15 to 80
  hint: string;
  scienceFact: string;
}

interface FindObjectConfig {
  title: string;
  sceneTitle: string;
  missionPrompt: string;
  items: HiddenScienceItem[];
}

interface FindObjectGameProps {
  config: FindObjectConfig;
  onFinish: (rewardXp: number) => void;
  onBack: () => void;
}

export const FindObjectGame: React.FC<FindObjectGameProps> = ({
  config,
  onFinish,
  onBack,
}) => {
  const [foundItemIds, setFoundItemIds] = useState<string[]>([]);
  const [lastFoundFact, setLastFoundFact] = useState<string | null>(null);

  const isAllFound = foundItemIds.length === config.items.length;

  const handleTapObject = (item: HiddenScienceItem) => {
    if (foundItemIds.includes(item.id)) return;

    sound.playSuccess();
    setFoundItemIds((prev) => [...prev, item.id]);
    setLastFoundFact(`🎉 Kamu menemukan ${item.name}! ${item.scienceFact}`);

    if (foundItemIds.length + 1 === config.items.length) {
      sound.playFanfare();
    }
  };

  const handleReset = () => {
    sound.playClick();
    setFoundItemIds([]);
    setLastFoundFact(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Game Observasi & Ketelitian
          </span>
          <h2 className="font-heading font-bold text-2xl text-slate-900">
            {config.title}
          </h2>
          <p className="text-sm text-slate-600">
            {config.missionPrompt}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tabular-nums">
            Ditemukan: {foundItemIds.length} / {config.items.length}
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Checklist Pill Bar */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap gap-2.5 items-center">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">
          Target Penemuan:
        </span>
        {config.items.map((item) => {
          const isFound = foundItemIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isFound
                  ? 'bg-emerald-100 text-emerald-900 line-through opacity-80 border border-emerald-300'
                  : 'bg-white text-slate-700 border border-slate-200 shadow-2xs'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
              {isFound && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </div>
          );
        })}
      </div>

      {/* Scenery Exploration Canvas */}
      <div className="relative w-full h-[400px] rounded-3xl bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-100 border-2 border-emerald-400/50 shadow-inner overflow-hidden select-none p-4">
        {/* Background Landscape Elements (Sun, Clouds, Trees, Pond) */}
        <div className="absolute top-4 right-8 text-6xl opacity-90">☀️</div>
        <div className="absolute top-8 left-16 text-5xl opacity-40">☁️</div>
        <div className="absolute top-12 right-40 text-4xl opacity-40">☁️</div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-emerald-600 via-emerald-500 to-transparent rounded-b-3xl opacity-80" />
        <div className="absolute bottom-6 left-12 text-6xl opacity-80">🌳</div>
        <div className="absolute bottom-4 right-16 text-6xl opacity-80">🌿</div>
        <div className="absolute bottom-2 left-1/3 w-36 h-20 bg-sky-400/60 rounded-full blur-xs" />

        {/* Hidden Interactive Objects */}
        {config.items.map((item) => {
          const isFound = foundItemIds.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleTapObject(item)}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
              }}
              className={`absolute p-2 rounded-2xl flex items-center justify-center transition-all ${
                isFound
                  ? 'bg-emerald-400 text-white ring-4 ring-emerald-200 scale-125 z-20 shadow-lg'
                  : 'hover:scale-125 hover:bg-white/80 active:scale-95 cursor-pointer z-10'
              }`}
              title={item.hint}
            >
              <span className="text-4xl drop-shadow-md">{item.icon}</span>
            </button>
          );
        })}
      </div>

      {/* Discovery Fact Banner */}
      {lastFoundFact && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm font-medium">
          {lastFoundFact}
        </div>
      )}

      {/* Victory Card */}
      {isAllFound && (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 flex items-center justify-center text-4xl">
            🔍
          </div>
          <h3 className="font-heading font-bold text-2xl">
            Luar Biasa! Semua Benda Sains Berhasil Ditemukan!
          </h3>
          <p className="text-sm text-emerald-100 max-w-md mx-auto">
            Matamu sangat jeli mengamati ekosistem alam di sekitar kita!
          </p>
          <button
            onClick={() => onFinish(90)}
            className="py-3 px-8 rounded-2xl bg-white text-emerald-800 font-heading font-bold text-sm shadow-md hover:bg-yellow-300 transition-all active:scale-95 inline-flex items-center gap-2"
          >
            <span>Klaim Hadiah 90 XP</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
