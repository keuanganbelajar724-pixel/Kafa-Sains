/**
 * Challenges & Practice Quiz View
 * 1. Daily Missions & Special Achievement Quests
 * 2. Arena Latihan Soal & Bank Soal IPA SD (Grades 1, 2, 3)
 */

import React, { useState } from 'react';
import { DailyMission, PracticeQuizSet, UserProfile } from '../../types';
import { DAILY_MISSIONS_POOL, PRACTICE_QUIZ_SETS } from '../../data/scienceContent';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Star,
  Trophy,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Lightbulb,
  ArrowLeft,
  Award,
  Check,
  X,
  Target,
  Info,
} from 'lucide-react';
import { sound } from '../../services/sound';
import kikoImg from '../../assets/images/kiko_faceless_mascot_1790869612195.jpg';

interface ChallengesViewProps {
  profile: UserProfile;
  onLaunchMission: (mission: DailyMission) => void;
  onClaimMissionReward: (missionId: string, xp: number, stars: number) => void;
  onCompletePracticeQuiz?: (quizId: string, xp: number, stars: number) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  profile,
  onLaunchMission,
  onClaimMissionReward,
  onCompletePracticeQuiz,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'misi' | 'latihan'>('latihan');
  const [gradeFilter, setGradeFilter] = useState<number>(0); // 0 = all

  // Practice Quiz Runner State
  const [activeQuizSet, setActiveQuizSet] = useState<PracticeQuizSet | null>(null);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [currentQIdx, setCurrentQIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  const quests = [
    {
      id: 'quest-indera',
      title: 'Master Panca Indera',
      description: 'Selesaikan seluruh 6 tahap pembelajaran panca indera bersama Kiko.',
      rewardXp: 120,
      rewardStars: 3,
      isDone: profile.completedLessons.includes('panca-indera'),
    },
    {
      id: 'quest-lab-apung',
      title: 'Peneliti Bejana Air',
      description: 'Uji sedikitnya 4 benda di laboratorium mengapung atau tenggelam.',
      rewardXp: 90,
      rewardStars: 2,
      isDone: profile.completedExperiments.includes('exp-apung-tenggelam'),
    },
    {
      id: 'quest-sorting-benda',
      title: 'Pilah Wujud Benda',
      description: 'Selesaikan tantangan sortir benda Padat, Cair, dan Gas di arcade.',
      rewardXp: 80,
      rewardStars: 2,
      isDone: profile.completedGames.includes('game-sorting-wujud'),
    },
    {
      id: 'quest-sampah',
      title: 'Pahlawan Bumi 3R',
      description: 'Selesaikan pembelajaran kelola sampah 3R dan sortir sampah di lab.',
      rewardXp: 110,
      rewardStars: 3,
      isDone: profile.completedLessons.includes('sampah-3r'),
    },
    {
      id: 'quest-streak',
      title: 'Penjelajah Rajin 3 Hari',
      description: 'Pertahankan streak belajar sains selama minimal 3 hari berturut-turut.',
      rewardXp: 100,
      rewardStars: 2,
      isDone: profile.streakDays >= 3,
    },
  ];

  const filteredQuizSets = PRACTICE_QUIZ_SETS.filter((set) => {
    if (gradeFilter === 0) return true;
    return set.grade === gradeFilter;
  });

  const handleStartQuiz = (set: PracticeQuizSet) => {
    sound.playClick();
    setActiveQuizSet(set);
    setQuizStarted(false);
    setCurrentQIdx(0);
    setSelectedAnswers({});
    setShowHint(false);
    setIsQuizFinished(false);
  };

  const handleBeginQuestions = () => {
    sound.playSparkle();
    setQuizStarted(true);
  };

  const handleSelectOption = (optionId: string) => {
    if (!activeQuizSet) return;
    if (selectedAnswers[currentQIdx] !== undefined) return; // already answered

    const currentQ = activeQuizSet.questions[currentQIdx];
    const isCorrect = currentQ.options.find((o) => o.id === optionId)?.isCorrect;

    if (isCorrect) {
      sound.playSuccess();
    } else {
      sound.playPop();
    }

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQIdx]: optionId,
    }));
  };

  const handleNextQuestion = () => {
    if (!activeQuizSet) return;
    sound.playClick();
    setShowHint(false);

    if (currentQIdx + 1 < activeQuizSet.questions.length) {
      setCurrentQIdx((prev) => prev + 1);
    } else {
      // Finish quiz!
      sound.playSuccess();
      setIsQuizFinished(true);

      // calculate score
      let correctCount = 0;
      activeQuizSet.questions.forEach((q, idx) => {
        const chosenId = selectedAnswers[idx];
        const opt = q.options.find((o) => o.id === chosenId);
        if (opt?.isCorrect) correctCount++;
      });

      if (onCompletePracticeQuiz) {
        onCompletePracticeQuiz(activeQuizSet.id, activeQuizSet.rewardXp, 3);
      }
    }
  };

  const handleExitQuiz = () => {
    sound.playClick();
    setActiveQuizSet(null);
    setQuizStarted(false);
    setIsQuizFinished(false);
  };

  // ========================================================
  // RENDER ACTIVE QUIZ DRILL RUNNER
  // ========================================================
  if (activeQuizSet) {
    const currentQ = activeQuizSet.questions[currentQIdx];
    const hasAnsweredCurrent = selectedAnswers[currentQIdx] !== undefined;
    const selectedOptionId = selectedAnswers[currentQIdx];
    const selectedOpt = currentQ?.options.find((o) => o.id === selectedOptionId);

    // Calculate score
    let totalCorrect = 0;
    activeQuizSet.questions.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      const opt = q.options.find((o) => o.id === chosen);
      if (opt?.isCorrect) totalCorrect++;
    });

    return (
      <div className="w-full px-4 sm:px-8 lg:px-12 py-6 max-w-4xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleExitQuiz}
            className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Bank Soal</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800">
              Kelas {activeQuizSet.grade} SD
            </span>
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>+{activeQuizSet.rewardXp} XP</span>
            </span>
          </div>
        </div>

        {/* 1. PRE-QUIZ BRIEFING SCREEN */}
        {!quizStarted && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-sky-50 border-2 border-sky-200 flex items-center justify-center shrink-0 overflow-hidden p-2">
                <img
                  src={kikoImg}
                  alt="Kiko Mascot"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  {activeQuizSet.category} · Bank Soal Latihan
                </span>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
                  {activeQuizSet.title}
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {activeQuizSet.description}
                </p>
              </div>
            </div>

            {/* Preparation Points */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-sky-600" />
                <span>Petunjuk Latihan Bersama Kiko:</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">1.</span>
                  <span>Ada <strong>{activeQuizSet.questions.length} butir soal pilihan ganda</strong> bergambar yang dirancang menyenangkan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">2.</span>
                  <span>Jika bingung, kamu bisa menekan tombol <strong>"💡 Petunjuk Kiko"</strong> untuk mendapatkan arahan!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">3.</span>
                  <span>Di akhir latihan, ada <strong>rangkuman ulasan ilmiah</strong> untuk setiap jawaban agar kamu semakin pintar.</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center sm:justify-end pt-2">
              <button
                onClick={handleBeginQuestions}
                className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-heading font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span>Mulai Kerjakan Soal Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 2. QUESTION SCREEN */}
        {quizStarted && !isQuizFinished && currentQ && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
            {/* Header progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Soal {currentQIdx + 1} dari {activeQuizSet.questions.length}</span>
                <span className="text-emerald-600">
                  Benar: {totalCorrect} / {currentQIdx + (hasAnsweredCurrent ? 1 : 0)}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQIdx + 1) / activeQuizSet.questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Prompt */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-900 leading-snug">
                {currentQ.prompt}
              </h2>

              {/* Hint button */}
              {currentQ.hint && (
                <div className="mt-3 pt-3 border-t border-slate-200/80">
                  <button
                    onClick={() => setShowHint((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Tutup Petunjuk' : '💡 Butuh Petunjuk Kiko?'}</span>
                  </button>
                  {showHint && (
                    <div className="mt-2 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 font-medium leading-relaxed">
                      <strong>Petunjuk:</strong> {currentQ.hint}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let optionStyle = 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50/30';

                if (hasAnsweredCurrent) {
                  if (opt.isCorrect) {
                    optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300';
                  } else if (isSelected && !opt.isCorrect) {
                    optionStyle = 'bg-rose-50 border-rose-400 text-rose-950';
                  } else {
                    optionStyle = 'bg-slate-50 border-slate-200 opacity-50';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={hasAnsweredCurrent}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-4 ${optionStyle} ${
                      !hasAnsweredCurrent ? 'active:scale-[0.99] cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {opt.icon && (
                        <span className="text-2xl shrink-0 p-1.5 rounded-xl bg-white border border-slate-100 shadow-xs">
                          {opt.icon}
                        </span>
                      )}
                      <span className="text-sm sm:text-base font-semibold text-slate-800">
                        {opt.text}
                      </span>
                    </div>

                    <div className="shrink-0">
                      {hasAnsweredCurrent && opt.isCorrect && (
                        <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                      {hasAnsweredCurrent && isSelected && !opt.isCorrect && (
                        <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center">
                          <X className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {hasAnsweredCurrent && (
              <div className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-1 ${
                selectedOpt?.isCorrect
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/80 border-amber-200 text-amber-950'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  {selectedOpt?.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Hebat Sekali! Jawabanmu Benar!</span>
                    </>
                  ) : (
                    <>
                      <Info className="w-4 h-4 text-amber-600" />
                      <span>Belum Tepat, Ini Penjelasan Ilmiahnya:</span>
                    </>
                  )}
                </div>
                <p>{currentQ.explanation}</p>
              </div>
            )}

            {/* Next Button */}
            {hasAnsweredCurrent && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  className="py-3 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-heading font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 active:scale-95 transition-all"
                >
                  <span>
                    {currentQIdx + 1 < activeQuizSet.questions.length ? 'Lanjut ke Soal Berikutnya' : 'Lihat Hasil Latihan 🏆'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. RESULTS SUMMARY SCREEN */}
        {isQuizFinished && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
            <div className="text-center space-y-3 py-4">
              <span className="text-5xl block animate-bounce">🏆</span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Latihan Selesai!
              </span>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
                Nilai Latihanmu: {Math.round((totalCorrect / activeQuizSet.questions.length) * 100)}
              </h1>
              <p className="text-sm text-slate-600 font-medium">
                Kamu menjawab dengan benar <strong>{totalCorrect} dari {activeQuizSet.questions.length} soal</strong>.
              </p>

              <div className="inline-flex items-center gap-3 py-2 px-5 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>+{activeQuizSet.rewardXp} XP Tambahan</span>
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>+3 Bintang Emas</span>
                </span>
              </div>
            </div>

            {/* Answer Breakdown Review */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Ulasan Kunci Jawaban & Pembahasan Sains:</span>
              </h3>

              <div className="space-y-3">
                {activeQuizSet.questions.map((q, idx) => {
                  const chosenId = selectedAnswers[idx];
                  const chosenOpt = q.options.find((o) => o.id === chosenId);
                  const correctOpt = q.options.find((o) => o.isCorrect);
                  const isCorrect = chosenOpt?.isCorrect;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 ${
                        isCorrect
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-rose-50/40 border-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900">
                          {idx + 1}. {q.prompt}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isCorrect ? '✅ Benar' : '❌ Perlu Diingat'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 space-y-1">
                        <div>
                          <strong>Jawaban Kamu:</strong> {chosenOpt?.text || '-'}
                        </div>
                        {!isCorrect && (
                          <div className="text-emerald-700 font-bold">
                            <strong>Jawaban Tepat:</strong> {correctOpt?.text}
                          </div>
                        )}
                        <p className="text-slate-600 mt-1 italic">
                          💡 <strong>Pembahasan:</strong> {q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleStartQuiz(activeQuizSet)}
                className="py-2.5 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 inline-flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Latihan Ini</span>
              </button>
              <button
                onClick={handleExitQuiz}
                className="py-2.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-heading font-bold text-xs shadow-md inline-flex items-center justify-center gap-1.5"
              >
                <span>Pilih Latihan Lain</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========================================================
  // MAIN VIEW: TAB TOGGLE (MISI VS LATIHAN SOAL)
  // ========================================================
  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Tantangan & Evaluasi Sains Cilik
          </span>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
            Pusat Misi & Latihan Soal SD
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kerjakan misi harian, kuis evaluasi materi, dan asah kemampuan dengan bank soal IPA terlengkap!
          </p>
        </div>

        {/* Top Toggle Switch */}
        <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200 flex items-center shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setActiveSubTab('latihan');
            }}
            className={`py-2 px-4 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'latihan'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📝 Bank Soal Latihan</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900">
              Lengkap
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveSubTab('misi');
            }}
            className={`py-2 px-4 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'misi'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>🌟 Misi Harian</span>
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* SUB-TAB 1: ARENA LATIHAN SOAL (BANK SOAL SD)         */}
      {/* ==================================================== */}
      {activeSubTab === 'latihan' && (
        <div className="space-y-6">
          {/* Grade filter buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1">Tingkat Kelas:</span>
            {[
              { id: 0, label: 'Semua Kelas' },
              { id: 1, label: 'Kelas 1 SD' },
              { id: 2, label: 'Kelas 2 SD' },
              { id: 3, label: 'Kelas 3 SD' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  sound.playClick();
                  setGradeFilter(f.id);
                }}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all ${
                  gradeFilter === f.id
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Quiz Sets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredQuizSets.map((quizSet) => (
              <div
                key={quizSet.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2 rounded-2xl bg-sky-50 border border-sky-100 shadow-xs">
                      {quizSet.icon}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800">
                      Kelas {quizSet.grade} SD
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {quizSet.category} · {quizSet.questions.length} Soal Pilihan Ganda
                    </span>
                    <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-sky-600 transition-colors">
                      {quizSet.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                      {quizSet.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>+{quizSet.rewardXp} XP · +3 ⭐</span>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(quizSet)}
                    className="py-2 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-heading font-bold text-xs shadow-xs inline-flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <span>Mulai Latihan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SUB-TAB 2: MISI HARIAN & TANTANGAN PENELITI          */}
      {/* ==================================================== */}
      {activeSubTab === 'misi' && (
        <div className="space-y-6">
          {/* Daily Quests List */}
          <div className="space-y-4">
            {DAILY_MISSIONS_POOL.map((mission) => {
              const isDone = profile.completedLessons.includes(mission.targetId) ||
                profile.completedExperiments.includes(mission.targetId) ||
                profile.completedGames.includes(mission.targetId);

              return (
                <div
                  key={mission.id}
                  className={`p-6 rounded-3xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                    isDone
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shrink-0">
                      🌱
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                          Misi Hari Ini
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                          +{mission.rewardXp} XP · +{mission.rewardStars} ⭐
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                        {mission.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium">
                        {mission.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto">
                    {isDone ? (
                      <button
                        onClick={() => {
                          sound.playSuccess();
                          onClaimMissionReward(mission.id, mission.rewardXp, mission.rewardStars);
                        }}
                        className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs shadow-xs inline-flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Misi Selesai (Klaim)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          sound.playClick();
                          onLaunchMission(mission);
                        }}
                        className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-heading font-bold text-xs shadow-xs inline-flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <span>Mulai Misi</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Special Achievement Quests */}
            <div className="pt-4">
              <h2 className="font-heading font-bold text-xl text-slate-900 mb-3">
                Tantangan Peneliti Handal
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quests.map((q) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xl">🏆</span>
                        <span className="text-xs font-bold text-amber-600">
                          +{q.rewardXp} XP · +{q.rewardStars} ⭐
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        {q.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {q.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                      {q.isDone ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Tercapai
                        </span>
                      ) : (
                        <span className="text-slate-400">Sedang Berlangsung</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
