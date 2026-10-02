/**
 * Mini Game Arcade Hub
 * Browse and play all interactive game engines with category filters.
 */

import React, { useState } from 'react';
import { Play, Sparkles, Filter, CheckCircle2, RotateCcw, BookOpen, Lightbulb, ArrowLeft } from 'lucide-react';
import { MINI_GAMES_DATA } from '../../data/scienceContent';
import { MiniGameDefinition } from '../../types';
import { sound } from '../../services/sound';
import { DragDropGame } from './DragDropGame';
import { SortingGame } from './SortingGame';
import { SequenceGame } from './SequenceGame';
import { MemoryCardGame } from './MemoryCardGame';
import { CatchGame } from './CatchGame';
import { FindObjectGame } from './FindObjectGame';
import { GameTutorialBriefing } from './GameTutorialBriefing';

interface MiniGameArcadeProps {
  initialGameId?: string | null;
  completedGameIds: string[];
  onGameCompleted: (gameId: string, rewardXp: number) => void;
}

export const MiniGameArcade: React.FC<MiniGameArcadeProps> = ({
  initialGameId,
  completedGameIds,
  onGameCompleted,
}) => {
  const [activeGameId, setActiveGameId] = useState<string | null>(initialGameId || null);
  const [showTutorial, setShowTutorial] = useState<boolean>(true);
  const [showModalTutorial, setShowModalTutorial] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'drag_drop' | 'sorting' | 'sequence' | 'memory' | 'catch' | 'find_object'>('all');

  const filteredGames = MINI_GAMES_DATA.filter((game) => {
    if (categoryFilter === 'all') return true;
    return game.type === categoryFilter;
  });

  const activeGame = MINI_GAMES_DATA.find((g) => g.id === activeGameId);

  const handleLaunchGame = (id: string) => {
    sound.playClick();
    setActiveGameId(id);
    setShowTutorial(true);
    setShowModalTutorial(false);
  };

  const handleFinishCurrentGame = (rewardXp: number) => {
    if (activeGameId) {
      onGameCompleted(activeGameId, rewardXp);
    }
    setActiveGameId(null);
  };

  const handleBackToArcade = () => {
    sound.playClick();
    setActiveGameId(null);
    setShowModalTutorial(false);
  };

  // If a game is active: first show tutorial briefing, then the active game with in-game helper
  if (activeGame) {
    if (showTutorial) {
      return (
        <div className="w-full px-4 sm:px-8 lg:px-12 py-6 space-y-4">
          <button
            onClick={handleBackToArcade}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Game</span>
          </button>

          <GameTutorialBriefing
            gameTitle={activeGame.title}
            topicTitle={activeGame.topicTitle}
            grade={activeGame.grade}
            gameIcon={activeGame.icon}
            rewardXp={activeGame.rewardXp}
            tutorial={activeGame.tutorial}
            onStartGame={() => {
              setShowTutorial(false);
            }}
            onClose={handleBackToArcade}
            isModal={false}
          />
        </div>
      );
    }

    return (
      <div className="w-full px-4 sm:px-8 lg:px-12 py-6 space-y-4">
        {/* In-Game Top Navigation & Helper Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackToArcade}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            {/* In-Game Tutorial Trigger Button */}
            <button
              onClick={() => {
                sound.playClick();
                setShowModalTutorial(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-xl border border-indigo-200 shadow-2xs transition-all"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>📖 Petunjuk & Materi Sains</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200/70">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{activeGame.tutorial?.kikoTip ? activeGame.tutorial.kikoTip.slice(0, 50) + '...' : 'Amati ciri-cirinya!'}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              +{activeGame.rewardXp} XP
            </span>
          </div>
        </div>

        {/* Dedicated Game Engine Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xs">
          {activeGame.type === 'drag_drop' && (
            <DragDropGame
              config={activeGame.config as any}
              title={activeGame.title}
              description={activeGame.description}
              onFinish={handleFinishCurrentGame}
              onBack={handleBackToArcade}
            />
          )}

          {activeGame.type === 'sorting' && (
            <SortingGame
              config={activeGame.config as any}
              title={activeGame.title}
              description={activeGame.description}
              onFinish={handleFinishCurrentGame}
              onBack={handleBackToArcade}
            />
          )}

          {activeGame.type === 'sequence' && (
            <SequenceGame
              config={activeGame.config as any}
              title={activeGame.title}
              description={activeGame.description}
              onFinish={handleFinishCurrentGame}
              onBack={handleBackToArcade}
            />
          )}

          {activeGame.type === 'memory' && (
            <MemoryCardGame
              config={activeGame.config as any}
              title={activeGame.title}
              description={activeGame.description}
              onFinish={handleFinishCurrentGame}
              onBack={handleBackToArcade}
            />
          )}

          {activeGame.type === 'catch' && (
            <CatchGame
              config={activeGame.config as any}
              onFinish={handleFinishCurrentGame}
              onBack={handleBackToArcade}
            />
          )}

          {activeGame.type === 'find_object' && (
            <FindObjectGame
              config={activeGame.config as any}
              onFinish={handleFinishCurrentGame}
              onBack={handleBackToArcade}
            />
          )}
        </div>

        {/* Modal Tutorial if user clicks "Petunjuk & Materi Sains" while playing */}
        {showModalTutorial && (
          <GameTutorialBriefing
            gameTitle={activeGame.title}
            topicTitle={activeGame.topicTitle}
            grade={activeGame.grade}
            gameIcon={activeGame.icon}
            rewardXp={activeGame.rewardXp}
            tutorial={activeGame.tutorial}
            onStartGame={() => setShowModalTutorial(false)}
            onClose={() => setShowModalTutorial(false)}
            isModal={true}
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-6 space-y-6">
      {/* Arcade Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Arena Permainan Edukasi
          </span>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
            Arcade Mini Game Sains
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Belajar konsep IPA sambil bermain game seru: menyusun, memilah, menangkap, dan mengamati!
          </p>
        </div>

        {/* Filter controls conforming to anti-slop guidelines (functional buttons) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              categoryFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Game
          </button>
          <button
            onClick={() => setCategoryFilter('catch')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              categoryFilter === 'catch'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🧪 Tangkap Cepat
          </button>
          <button
            onClick={() => setCategoryFilter('find_object')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              categoryFilter === 'find_object'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔍 Detektif Objek
          </button>
          <button
            onClick={() => setCategoryFilter('drag_drop')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              categoryFilter === 'drag_drop'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Drag & Drop
          </button>
          <button
            onClick={() => setCategoryFilter('sorting')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              categoryFilter === 'sorting'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Klasifikasi / Sortir
          </button>
          <button
            onClick={() => setCategoryFilter('sequence')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              categoryFilter === 'sequence'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Urutan Siklus
          </button>
          <button
            onClick={() => setCategoryFilter('memory')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              categoryFilter === 'memory'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kartu Memori
          </button>
        </div>
      </div>

      {/* Game Cards Grid - Edge to Edge 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredGames.map((game) => {
          const isDone = completedGameIds.includes(game.id);
          return (
            <div
              key={game.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-3xl">
                    {game.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Kelas {game.grade} SD · {game.topicTitle}
                    </span>
                    <span className="text-xs font-extrabold text-amber-600">
                      +{game.rewardXp} XP
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900">
                    {game.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {game.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                {isDone ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Pernah Dimainkan
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-400">Belum dimainkan</span>
                )}

                <button
                  onClick={() => handleLaunchGame(game.id)}
                  className="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-heading font-bold text-xs shadow-xs transition-all active:scale-95 inline-flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Mainkan Game</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
