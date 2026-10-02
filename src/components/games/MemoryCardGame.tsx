/**
 * Reusable Memory Card Matching Game Engine
 * e.g. Match sense organ with function, or pair scientific concepts
 */

import React, { useState } from 'react';
import { Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import { sound } from '../../services/sound';

interface MemoryCardItem {
  id: string;
  matchKey: string;
  icon: string;
  label: string;
}

interface MemoryConfig {
  pairs: MemoryCardItem[];
}

interface MemoryCardGameProps {
  config: MemoryConfig;
  title?: string;
  description?: string;
  onFinish: (rewardXp: number) => void;
  onBack: () => void;
}

interface GameCard {
  instanceId: string;
  matchKey: string;
  icon: string;
  label: string;
}

export const MemoryCardGame: React.FC<MemoryCardGameProps> = ({ config, title, description, onFinish, onBack }) => {
  // Generate pairs (each item duplicated once and shuffled)
  const [cards, setCards] = useState<GameCard[]>(() => {
    const list: GameCard[] = [];
    config.pairs.forEach((p, idx) => {
      list.push({ instanceId: `${p.id}-1`, matchKey: p.matchKey, icon: p.icon, label: p.label });
      list.push({ instanceId: `${p.id}-2`, matchKey: p.matchKey, icon: p.icon, label: p.label });
    });
    return list.sort(() => Math.random() - 0.5);
  });

  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedKeys, setMatchedKeys] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState<number>(0);

  const handleCardClick = (card: GameCard) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(card.instanceId)) return;
    if (matchedKeys.has(card.matchKey)) return;

    sound.playPop();
    const newFlipped = [...flippedCards, card.instanceId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const firstCard = cards.find((c) => c.instanceId === newFlipped[0]);
      const secondCard = cards.find((c) => c.instanceId === newFlipped[1]);

      if (firstCard && secondCard && firstCard.matchKey === secondCard.matchKey) {
        sound.playSuccess();
        setMatchedKeys((prev) => new Set([...prev, firstCard.matchKey]));
        setFlippedCards([]);
        if (matchedKeys.size + 1 === config.pairs.length) {
          sound.playFanfare();
        }
      } else {
        sound.playGentleWrong();
        setTimeout(() => {
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  const handleReset = () => {
    sound.playClick();
    const list: GameCard[] = [];
    config.pairs.forEach((p) => {
      list.push({ instanceId: `${p.id}-1`, matchKey: p.matchKey, icon: p.icon, label: p.label });
      list.push({ instanceId: `${p.id}-2`, matchKey: p.matchKey, icon: p.icon, label: p.label });
    });
    setCards(list.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatchedKeys(new Set());
    setMoves(0);
  };

  const isAllMatched = matchedKeys.size === config.pairs.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Game Ingatan & Konsentrasi
          </span>
          <h2 className="font-heading font-bold text-2xl text-slate-900">
            {title || 'Kartu Memori Sains'}
          </h2>
          <p className="text-sm text-slate-600">
            {description || 'Buka kartu dua-dua dan temukan pasangan konsep sains yang cocok!'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold tabular-nums">
            Langkah: {moves}
          </div>
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-xs font-bold inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Kocok Ulang</span>
          </button>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {cards.map((card) => {
          const isFlipped = flippedCards.includes(card.instanceId);
          const isMatched = matchedKeys.has(card.matchKey);
          return (
            <button
              key={card.instanceId}
              onClick={() => handleCardClick(card)}
              disabled={isMatched || isFlipped}
              className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-3 transition-all ${
                isMatched
                  ? 'bg-emerald-50 border-emerald-400 opacity-80 cursor-default scale-95'
                  : isFlipped
                  ? 'bg-white border-purple-500 shadow-md scale-102 ring-2 ring-purple-200'
                  : 'bg-gradient-to-tr from-indigo-500 to-purple-600 border-indigo-400 hover:scale-102 shadow-xs cursor-pointer text-white'
              }`}
            >
              {isFlipped || isMatched ? (
                <>
                  <span className="text-3xl sm:text-4xl mb-1">{card.icon}</span>
                  <span className="text-[11px] font-heading font-bold text-slate-800 text-center leading-tight">
                    {card.label}
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-2xl opacity-75">✨</span>
                  <span className="text-[10px] font-bold tracking-widest mt-1 opacity-90 uppercase">
                    IPA
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isAllMatched && (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 flex items-center justify-center text-4xl">
            🌟
          </div>
          <h3 className="font-heading font-bold text-2xl">
            Hebat Sekali! Daya Ingatmu Luar Biasa!
          </h3>
          <p className="text-sm text-purple-100 max-w-md mx-auto">
            Kamu berhasil menemukan semua pasangan kartu sains dalam {moves} langkah!
          </p>
          <button
            onClick={() => onFinish(75)}
            className="py-3 px-8 rounded-2xl bg-white text-purple-900 font-heading font-bold text-sm shadow-md hover:bg-yellow-300 transition-all active:scale-95 inline-flex items-center gap-2"
          >
            <span>Klaim Hadiah 75 XP</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
