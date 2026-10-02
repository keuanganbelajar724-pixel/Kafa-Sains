/**
 * Game Tutorial & Science Briefing Component
 * Displays science concept explanation, key facts cheat-sheet,
 * and step-by-step how-to-play before launching a game or as an in-game helper.
 */

import React from 'react';
import { GameTutorialGuide } from '../../types';
import { Sparkles, BookOpen, Lightbulb, Play, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { sound } from '../../services/sound';
import kikoImg from '../../assets/images/kiko_faceless_mascot_1790869612195.jpg';

interface GameTutorialBriefingProps {
  gameTitle: string;
  topicTitle: string;
  grade: number;
  gameIcon: string;
  rewardXp: number;
  tutorial?: GameTutorialGuide;
  onStartGame: () => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const GameTutorialBriefing: React.FC<GameTutorialBriefingProps> = ({
  gameTitle,
  topicTitle,
  grade,
  gameIcon,
  rewardXp,
  tutorial,
  onStartGame,
  onClose,
  isModal = false,
}) => {
  // Default tutorial fallback if game has no custom tutorial
  const fallbackTutorial: GameTutorialGuide = {
    conceptTitle: 'Misi Penyelidikan Sains Kiko',
    conceptSummary: 'Uji pemahamanmu tentang konsep sains ini melalui permainan interaktif! Amati karakteristik setiap benda sebelum menentukan pilihanmu.',
    keyFacts: [
      {
        icon: '👀',
        title: 'Amati Cermat',
        description: 'Perhatikan wujud, sifat, dan ciri khas dari setiap objek sains yang muncul.',
      },
      {
        icon: '🧠',
        title: 'Ingat Materi',
        description: 'Gunakan pengetahuan yang sudah dipelajari di tahap sebelumnya untuk memecahkan misi.',
      },
      {
        icon: '✨',
        title: 'Coba Tanpa Takut',
        description: 'Jika belum tepat, Kiko akan memberimu petunjuk ramah untuk mencoba lagi.',
      },
    ],
    howToPlay: [
      {
        step: 1,
        title: 'Pilih Objek',
        instruction: 'Ketuk atau seret benda sains yang ingin kamu kelompokkan.',
        icon: '👆',
      },
      {
        step: 2,
        title: 'Tempatkan dengan Benar',
        instruction: 'Arahkan ke kotak atau kategori yang sesuai dengan sifat sainsnya.',
        icon: '🎯',
      },
      {
        step: 3,
        title: 'Klaim Bintang & XP',
        instruction: 'Selesaikan semua tantangan untuk mendapatkan bintang emas dan bonus XP!',
        icon: '⭐',
      },
    ],
    kikoTip: 'Santai saja dan nikmati petualangan sains ini! Semua ilmuwan hebat belajar dari mencoba berkali-kali.',
  };

  const activeTutorial = tutorial || fallbackTutorial;

  const content = (
    <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-xl space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-4xl shadow-md shrink-0">
            {gameIcon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200 uppercase tracking-wider">
                Kelas {grade} SD · {topicTitle}
              </span>
              <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                +{rewardXp} XP
              </span>
            </div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 leading-tight">
              {gameTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              💡 Panduan Materi & Petunjuk Cara Bermain
            </p>
          </div>
        </div>

        {isModal && onClose && (
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Tutup Petunjuk"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mascot Intro Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/50 to-slate-50 border border-sky-100 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0 bg-sky-200">
          <img
            src={kikoImg}
            alt="Kiko Penjelajah Sains"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold text-sky-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Pesan Kiko untuk Penjelajah Sains:
          </span>
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            "{activeTutorial.kikoTip}"
          </p>
        </div>
      </div>

      {/* Section 1: Konsep & Rahasia Sains yang Diuji */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h3 className="font-heading font-bold text-lg text-slate-900">
            1. Rahasia Sains di Balik Game Ini
          </h3>
        </div>

        <p className="text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          {activeTutorial.conceptSummary}
        </p>

        {/* Key Facts Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {activeTutorial.keyFacts.map((fact, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-sky-300 transition-colors flex flex-col gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-2xl shadow-2xs">
                {fact.icon}
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-slate-900 leading-snug">
                  {fact.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium mt-1">
                  {fact.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Cara Memainkan Game (1-2-3 Langkah Mudah) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="font-heading font-bold text-lg text-slate-900">
            2. Cara Bermain & Menyelesaikan Misi
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {activeTutorial.howToPlay.map((step) => (
            <div
              key={step.step}
              className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 font-heading font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                {step.step}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  {step.icon && <span className="text-base">{step.icon}</span>}
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {step.instruction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Launch Button */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Kamu bisa membuka petunjuk ini lagi kapan saja saat bermain!</span>
        </div>

        <button
          onClick={() => {
            sound.playSuccess();
            onStartGame();
          }}
          className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-sm shadow-md shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Aku Sudah Paham, Ayo Main!</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
        <div className="relative w-full max-w-3xl my-6">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
