/**
 * Reusable Catch Arcade Game Engine
 * Move the laboratory beaker left and right to catch target science objects!
 * Real-time loop, responsive touch controls, high game feel.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RotateCcw, ArrowRight, Trophy, Heart, ArrowLeft } from 'lucide-react';
import { sound } from '../../services/sound';

interface CatchItem {
  id: string;
  name: string;
  icon: string;
  isTarget: boolean; // if true, catch it; if false, avoid it!
  points: number;
}

interface CatchGameConfig {
  title: string;
  targetDescription: string;
  items: CatchItem[];
  goalScore: number;
}

interface CatchGameProps {
  config: CatchGameConfig;
  onFinish: (rewardXp: number) => void;
  onBack: () => void;
}

interface FallingObject {
  id: number;
  item: CatchItem;
  x: number; // 5 to 90 %
  y: number; // 0 to 100 %
  speed: number;
}

export const CatchGame: React.FC<CatchGameProps> = ({ config, onFinish, onBack }) => {
  const [basketX, setBasketX] = useState<number>(50); // percentage 10 to 90
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Spawn falling objects loop
  useEffect(() => {
    if (isGameOver || isVictory) return;

    const spawnInterval = setInterval(() => {
      const randomItem = config.items[Math.floor(Math.random() * config.items.length)];
      const newObj: FallingObject = {
        id: Date.now() + Math.random(),
        item: randomItem,
        x: Math.floor(Math.random() * 80) + 10,
        y: 0,
        speed: Math.random() * 1.5 + 2,
      };
      setFallingObjects((prev) => [...prev, newObj]);
    }, 1200);

    return () => clearInterval(spawnInterval);
  }, [isGameOver, isVictory, config.items]);

  // Falling animation and collision loop
  useEffect(() => {
    if (isGameOver || isVictory) return;

    const updateInterval = setInterval(() => {
      setFallingObjects((prev) => {
        const nextList: FallingObject[] = [];

        for (const obj of prev) {
          const nextY = obj.y + obj.speed;

          // Check collision with basket at bottom (y ~ 80-92%)
          if (nextY >= 80 && nextY <= 92 && Math.abs(obj.x - basketX) < 14) {
            // Caught!
            if (obj.item.isTarget) {
              sound.playSuccess();
              setScore((s) => {
                const newScore = s + obj.item.points;
                if (newScore >= config.goalScore) {
                  sound.playFanfare();
                  setIsVictory(true);
                }
                return newScore;
              });
            } else {
              sound.playGentleWrong();
              setLives((l) => {
                const newL = l - 1;
                if (newL <= 0) {
                  setIsGameOver(true);
                }
                return newL;
              });
            }
            continue; // Remove object
          }

          // Off bottom of screen
          if (nextY > 96) {
            continue;
          }

          nextList.push({ ...obj, y: nextY });
        }

        return nextList;
      });
    }, 50);

    return () => clearInterval(updateInterval);
  }, [basketX, isGameOver, isVictory, config.goalScore]);

  // Touch and mouse movement over game area
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(10, Math.min(90, relativeX)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || e.touches.length === 0) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const relativeX = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(10, Math.min(90, relativeX)));
  };

  const handleMoveLeft = () => {
    setBasketX((x) => Math.max(10, x - 15));
  };

  const handleMoveRight = () => {
    setBasketX((x) => Math.min(90, x + 15));
  };

  const handleRestart = () => {
    sound.playClick();
    setScore(0);
    setLives(3);
    setIsGameOver(false);
    setIsVictory(false);
    setFallingObjects([]);
    setBasketX(50);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Game Refleks & Tangkap
          </span>
          <h2 className="font-heading font-bold text-2xl text-slate-900">
            {config.title}
          </h2>
          <p className="text-sm text-slate-600">
            {config.targetDescription}
          </p>
        </div>

        {/* HUD Meters */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-800 text-xs font-bold tabular-nums">
            Skor: {score} / {config.goalScore}
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold">
            <Heart className="w-4 h-4 fill-rose-500" />
            <span>x{lives}</span>
          </div>
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Arcade Catch Stage Canvas */}
      <div
        ref={gameAreaRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[420px] rounded-3xl bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900 border-2 border-sky-400/40 overflow-hidden shadow-inner cursor-ew-resize select-none"
      >
        {/* Sky Background Atmosphere */}
        <div className="absolute top-4 left-6 text-xs font-bold text-sky-300/80">
          🎯 Tangkap HANYA benda yang sesuai target!
        </div>

        {/* Falling objects */}
        {fallingObjects.map((obj) => (
          <div
            key={obj.id}
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute flex flex-col items-center pointer-events-none transition-transform"
          >
            <span className="text-3xl sm:text-4xl drop-shadow-md">{obj.item.icon}</span>
            <span className="text-[10px] font-bold text-white bg-slate-900/80 px-1.5 py-0.5 rounded-md mt-0.5">
              {obj.item.name}
            </span>
          </div>
        ))}

        {/* Catcher Basket / Lab Beaker */}
        <div
          style={{
            left: `${basketX}%`,
            bottom: '15px',
            transform: 'translateX(-50%)',
          }}
          className="absolute flex flex-col items-center pointer-events-none transition-all duration-75"
        >
          <div className="w-20 h-16 rounded-b-2xl rounded-t-xs bg-gradient-to-tr from-sky-400 to-indigo-500 border-3 border-white shadow-xl flex items-center justify-center text-3xl">
            🧪
          </div>
          <span className="text-[10px] font-bold text-white uppercase tracking-wider mt-1 bg-black/60 px-2 py-0.5 rounded-full">
            Wadah Penampung
          </span>
        </div>

        {/* Victory Overlay */}
        {isVictory && (
          <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 text-white space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-amber-400 text-slate-900 flex items-center justify-center text-4xl shadow-xl">
              🏆
            </div>
            <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white">
              Target Tercapai! Kamu Hebat!
            </h3>
            <p className="text-sm text-sky-200 max-w-sm font-medium">
              Kamu berhasil mengidentifikasi dan menangkap seluruh benda cair dengan sangat lincah!
            </p>
            <button
              onClick={() => onFinish(95)}
              className="py-3 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-heading font-bold text-sm shadow-lg shadow-amber-400/30 transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span>Klaim Hadiah 95 XP</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {isGameOver && !isVictory && (
          <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 text-white space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-rose-500 flex items-center justify-center text-4xl shadow-xl">
              💔
            </div>
            <h3 className="font-heading font-bold text-2xl text-white">
              Yuk Coba Sekali Lagi!
            </h3>
            <p className="text-sm text-slate-300 max-w-sm">
              Perhatikan benda yang jatuh. Jangan menangkap benda padat ya!
            </p>
            <button
              onClick={handleRestart}
              className="py-3 px-6 rounded-2xl bg-white text-slate-900 font-heading font-bold text-sm shadow-md hover:bg-sky-100 transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Lagi</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch Control Helpers */}
      <div className="flex sm:hidden items-center justify-between gap-4">
        <button
          onClick={handleMoveLeft}
          className="flex-1 py-3 rounded-2xl bg-slate-100 border border-slate-200 font-heading font-bold text-sm text-slate-800 active:bg-slate-200"
        >
          ← Geser Kiri
        </button>
        <button
          onClick={handleMoveRight}
          className="flex-1 py-3 rounded-2xl bg-slate-100 border border-slate-200 font-heading font-bold text-sm text-slate-800 active:bg-slate-200"
        >
          Geser Kanan →
        </button>
      </div>
    </div>
  );
};
