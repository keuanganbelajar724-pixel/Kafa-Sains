/**
 * Reusable Sorting Game Engine
 * e.g. Sorting objects into Solid (Padat), Liquid (Cair), and Gas bins in Professor Kiko's Mini Lab.
 */

import React, { useState } from 'react';
import { Sparkles, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import { sound } from '../../services/sound';

interface SortingBin {
  id: string;
  label: string;
  icon: string;
  color: string;
  hint: string;
}

interface SortingObject {
  id: string;
  name: string;
  icon: string;
  correctBin: string;
}

interface SortingConfig {
  bins: SortingBin[];
  objects: SortingObject[];
}

interface SortingGameProps {
  config: SortingConfig;
  title?: string;
  description?: string;
  onFinish: (rewardXp: number) => void;
  onBack: () => void;
}

export const SortingGame: React.FC<SortingGameProps> = ({ config, title, description, onFinish, onBack }) => {
  const [sortedItems, setSortedItems] = useState<Record<string, string>>({}); // objId -> binId
  const [activeObjIndex, setActiveObjIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const remainingObjects = config.objects.filter((obj) => !sortedItems[obj.id]);
  const currentObject = remainingObjects[0] || null;

  const handlePlaceInBin = (bin: SortingBin) => {
    if (!currentObject) return;

    if (currentObject.correctBin === bin.id) {
      sound.playSuccess();
      setSortedItems((prev) => ({ ...prev, [currentObject.id]: bin.id }));
      setFeedback(`Hebat! ${currentObject.name} adalah benda ${bin.label}! ✨`);

      if (remainingObjects.length === 1) {
        sound.playFanfare();
      }
    } else {
      sound.playGentleWrong();
      setFeedback(`Coba lagi! Perhatikan ciri-ciri ${currentObject.name}.`);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setSortedItems({});
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Laboratorium Mini Sains
          </span>
          <h2 className="font-heading font-bold text-2xl text-slate-900">
            {title || 'Pilah Kategori Sains'}
          </h2>
          <p className="text-sm text-slate-600">
            {description || 'Bantu Profesor Kiko memilah benda uji ke dalam wadah yang sesuai!'}
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

      {/* Main Inspection Table */}
      {currentObject ? (
        <div className="bg-gradient-to-b from-sky-50 to-indigo-50/40 p-6 sm:p-8 rounded-3xl border border-sky-100 flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
            Benda yang Sedang Diuji:
          </span>

          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border-2 border-sky-300 shadow-lg flex items-center justify-center text-5xl sm:text-6xl animate-bounce">
            {currentObject.icon}
          </div>

          <div className="font-heading font-bold text-2xl text-slate-900">
            {currentObject.name}
          </div>

          <p className="text-xs text-slate-600 max-w-sm">
            Apakah benda ini memiliki bentuk tetap (padat), mengalir (cair), atau mengisi ruangan (gas)?
          </p>

          {/* Feedback bar */}
          {feedback && (
            <div className="px-4 py-2 rounded-xl bg-white/90 border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs">
              {feedback}
            </div>
          )}
        </div>
      ) : (
        /* Victory state */
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 flex items-center justify-center text-4xl">
            🏆
          </div>
          <h3 className="font-heading font-bold text-2xl">
            Selamat! Kamu Ahli Wujud Benda!
          </h3>
          <p className="text-sm text-emerald-100 max-w-md mx-auto">
            Semua benda padat, cair, dan gas telah berhasil dikelompokkan dengan benar.
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

      {/* Target Bins */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {config.bins.map((bin) => {
          const itemsCount = config.objects.filter((o) => sortedItems[o.id] === bin.id).length;
          return (
            <button
              key={bin.id}
              onClick={() => handlePlaceInBin(bin)}
              disabled={!currentObject}
              className={`p-6 rounded-3xl border-2 text-center transition-all flex flex-col items-center justify-between min-h-[180px] bg-white border-slate-200 hover:border-sky-400 hover:shadow-md active:scale-98`}
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl shadow-inner mb-2">
                {bin.icon}
              </div>

              <div>
                <h4 className="font-heading font-bold text-lg text-slate-900">{bin.label}</h4>
                <p className="text-xs text-slate-500 mt-1">{bin.hint}</p>
              </div>

              <div className="mt-3 w-full pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Terkumpul:</span>
                <span className="font-bold text-sky-700 tabular-nums">{itemsCount} benda</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
