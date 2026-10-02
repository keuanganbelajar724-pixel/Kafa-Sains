/**
 * Collection Encyclopedia View
 * Science discovery cards with 3D flip inspection, fun facts, and characteristics.
 */

import React, { useState } from 'react';
import { COLLECTIONS_DATA } from '../../data/scienceContent';
import { CollectionItem } from '../../types';
import { Sparkles, BookOpen, X, Info, Award } from 'lucide-react';
import { sound } from '../../services/sound';

interface CollectionEncyclopediaViewProps {
  unlockedIds: string[];
}

export const CollectionEncyclopediaView: React.FC<CollectionEncyclopediaViewProps> = ({
  unlockedIds,
}) => {
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'Indera', 'Benda', 'Hewan', 'Tumbuhan', 'Energi'];

  const filteredItems = COLLECTIONS_DATA.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handleInspectItem = (item: CollectionItem) => {
    sound.playPop();
    setSelectedItem(item);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Ensiklopedia Sains Anak
          </span>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
            Koleksi Penemuan Kiko
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Buka kartu ensiklopedia untuk membaca rahasia dan fakta ajaib dari setiap penemuan sainsmu!
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors capitalize whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'Semua' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredItems.map((item) => {
          const isUnlocked = unlockedIds.includes(item.id) || true; // Unlocked for delightful exploration
          return (
            <button
              key={item.id}
              onClick={() => handleInspectItem(item)}
              className="p-5 rounded-3xl bg-white border-2 border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all text-left flex flex-col justify-between group active:scale-98"
            >
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                    {item.category} · Kelas {item.grade} SD
                  </span>
                  <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700">
                <span>Baca Fakta Unik</span>
                <span>→</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Inspection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-emerald-300 space-y-5">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-5xl shadow-sm">
                {selectedItem.icon}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Ensiklopedia Sains · {selectedItem.category}
                </span>
                <h3 className="font-heading font-bold text-2xl text-slate-900">
                  {selectedItem.title}
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  Materi Rekomendasi Kelas {selectedItem.grade} SD
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {selectedItem.description}
            </p>

            {/* Fun fact callout */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-950 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Tahukah Kamu? (Fakta Ajaib):</span>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                {selectedItem.funFact}
              </p>
            </div>

            {/* Characteristics */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Ciri-Ciri Utama:
              </span>
              <div className="space-y-1.5">
                {selectedItem.characteristics.map((charac, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{charac}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-sm shadow-md transition-all active:scale-95"
            >
              Tutup Kartu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
