/**
 * Multi-Stage Interactive Lesson Engine
 * Follows pedagogical flow:
 * BELAJAR (Lihat) -> EKSPLORASI -> INTERAKSI -> EKSPERIMEN -> TANTANGAN -> KUIS
 */

import React, { useState } from 'react';
import {
  Eye,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Volume2,
  Award,
  Star,
  Compass,
  BookOpen,
  Lightbulb,
  Play,
  X,
} from 'lucide-react';
import { LessonContent, LessonStageType } from '../../types';
import { sound } from '../../services/sound';
import { KikoMascot } from '../common/KikoMascot';
import { MINI_GAMES_DATA } from '../../data/scienceContent';
import kikoImg from '../../assets/images/kiko_faceless_mascot_1790869612195.jpg';

interface LessonEngineProps {
  lesson: LessonContent;
  onFinishLesson: (stats: { xp: number; stars: number; badgeId?: string }) => void;
  onBackToWorld: () => void;
  onOpenMiniGame: (gameId: string) => void;
}

export const LessonEngine: React.FC<LessonEngineProps> = ({
  lesson,
  onFinishLesson,
  onBackToWorld,
  onOpenMiniGame,
}) => {
  const stages: { type: LessonStageType; label: string; icon: string }[] = [
    { type: 'lihat', label: '1. Lihat', icon: '👀' },
    { type: 'eksplorasi', label: '2. Eksplorasi', icon: '🔍' },
    { type: 'interaksi', label: '3. Interaksi', icon: '🧩' },
    { type: 'eksperimen', label: '4. Eksperimen', icon: '🔬' },
    { type: 'tantangan', label: '5. Tantangan', icon: '🎯' },
    { type: 'kuis', label: '6. Kuis Bintang', icon: '⭐' },
  ];

  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const currentStage = stages[currentStageIdx].type;

  // Stage 1 (Lihat) State
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>(
    lesson.stages.lihat.hotspots[0]?.id || 'mata'
  );
  const [inspectedHotspots, setInspectedHotspots] = useState<Set<string>>(
    new Set([lesson.stages.lihat.hotspots[0]?.id || 'mata'])
  );

  // Stage 2 (Eksplorasi) State
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [explorationFeedback, setExplorationFeedback] = useState<string | null>(null);
  const [isExplorationCorrect, setIsExplorationCorrect] = useState<boolean>(false);

  // Stage 3 (Interaksi - Matching) State
  const [activeLeftId, setActiveLeftId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({}); // organId -> targetId

  // Stage 4 (Eksperimen Virtual - Getaran Suara / Suhu / Tanaman) State
  const [activeInstrument, setActiveInstrument] = useState<'lonceng' | 'gendang' | 'garputala'>('lonceng');
  const [isPlayingSoundExp, setIsPlayingSoundExp] = useState<boolean>(false);
  const [soundFrequencyHz, setSoundFrequencyHz] = useState<number>(440);
  const [lessonTemp, setLessonTemp] = useState<number>(0);
  const [lessonPlantSun, setLessonPlantSun] = useState<boolean>(true);
  const [lessonPlantWater, setLessonPlantWater] = useState<boolean>(true);

  // Stage 6 (Kuis) State
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, string>>({});
  const [quizScore, setQuizScore] = useState<number>(0);
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [showQuizNotesModal, setShowQuizNotesModal] = useState<boolean>(false);

  // Reset states whenever lesson changes
  React.useEffect(() => {
    setCurrentStageIdx(0);
    const initialH = lesson.stages.lihat.hotspots[0]?.id || 'mata';
    setSelectedHotspotId(initialH);
    setInspectedHotspots(new Set([initialH]));
    setSelectedOptionId(null);
    setExplorationFeedback(null);
    setIsExplorationCorrect(false);
    setActiveLeftId(null);
    setMatchedPairs({});
    setCurrentQuizIdx(0);
    setSelectedQuizAnswers({});
    setQuizScore(0);
    setShowQuizResult(false);
    setQuizStarted(false);
    setShowQuizNotesModal(false);
    setLessonTemp(0);
  }, [lesson.id]);

  // Stage 1: Select hotspot
  const handleSelectHotspot = (id: string) => {
    sound.playPop();
    setSelectedHotspotId(id);
    setInspectedHotspots((prev) => new Set([...prev, id]));
  };

  // Stage 2: Select exploration option
  const handleSelectExploration = (opt: { id: string; isCorrect: boolean; feedback: string }) => {
    setSelectedOptionId(opt.id);
    setExplorationFeedback(opt.feedback);
    setIsExplorationCorrect(opt.isCorrect);
    if (opt.isCorrect) {
      sound.playSuccess();
    } else {
      sound.playGentleWrong();
    }
  };

  // Stage 3: Matching interaction
  const handleSelectMatchLeft = (pairId: string) => {
    sound.playClick();
    setActiveLeftId(pairId);
  };

  const handleSelectMatchRight = (targetMatchId: string) => {
    if (!activeLeftId) return;
    const targetPair = lesson.stages.interaksi.pairs.find((p) => p.id === activeLeftId);
    if (targetPair && targetPair.matchId === targetMatchId) {
      sound.playSuccess();
      setMatchedPairs((prev) => ({ ...prev, [activeLeftId]: targetMatchId }));
      setActiveLeftId(null);
    } else {
      sound.playGentleWrong();
    }
  };

  // Stage 4: Trigger sound simulation
  const handleTriggerInstrument = (type: 'lonceng' | 'gendang' | 'garputala', hz: number) => {
    setActiveInstrument(type);
    setSoundFrequencyHz(hz);
    setIsPlayingSoundExp(true);
    sound.playSparkle();
    setTimeout(() => {
      setIsPlayingSoundExp(false);
    }, 1800);
  };

  // Stage 6: Quiz answer
  const handleSelectQuizOption = (optId: string, isCorrect: boolean) => {
    if (selectedQuizAnswers[currentQuizIdx]) return; // already answered
    setSelectedQuizAnswers((prev) => ({ ...prev, [currentQuizIdx]: optId }));
    if (isCorrect) {
      sound.playSuccess();
      setQuizScore((prev) => prev + 1);
    } else {
      sound.playGentleWrong();
    }
  };

  const handleNextQuiz = () => {
    sound.playClick();
    if (currentQuizIdx < lesson.stages.kuis.questions.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
    } else {
      setShowQuizResult(true);
      sound.playFanfare();
    }
  };

  // Navigation between stages
  const goToNextStage = () => {
    sound.playSuccess();
    if (currentStageIdx < stages.length - 1) {
      setCurrentStageIdx((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onFinishLesson({
        xp: lesson.stages.kuis.questions.length * 30 + 60,
        stars: 3,
        badgeId: 'badge-indera',
      });
    }
  };

  const goToPrevStage = () => {
    sound.playClick();
    if (currentStageIdx > 0) {
      setCurrentStageIdx((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentHotspot = lesson.stages.lihat.hotspots.find((h) => h.id === selectedHotspotId) || lesson.stages.lihat.hotspots[0];

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-6 space-y-6">
      {/* Top Breadcrumb & Return to Map */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBackToWorld}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Peta Dunia</span>
        </button>

        <div className="text-right">
          <div className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
            Kelas {lesson.grade} SD · IPA
          </div>
          <h1 className="font-heading font-bold text-xl text-slate-900 leading-tight">
            {lesson.title}
          </h1>
        </div>
      </div>

      {/* Stage Progression Steps Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[580px] gap-2">
          {stages.map((stage, idx) => {
            const isCompleted = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            return (
              <button
                key={stage.type}
                onClick={() => {
                  sound.playClick();
                  setCurrentStageIdx(idx);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl font-heading text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-300'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <span>{stage.icon}</span>
                <span className="truncate">{stage.label}</span>
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 ml-0.5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area based on current Stage - Full Width */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xs">
        {/* ==================================================== */}
        {/* STAGE 1: LIHAT (Interactive Visual with Sense Organs) */}
        {/* ==================================================== */}
        {currentStage === 'lihat' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Tahap 1 — Lihat & Amati (Faceless)</span>
              <h2 className="font-heading font-bold text-2xl text-slate-900 mt-1">
                {lesson.stages.lihat.title}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {lesson.stages.lihat.instruction}
              </p>
            </div>

            {/* Interactive Stage Layout: Split 2 Zones */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Zone: Interactive Faceless Science Visual */}
              <div className="lg:col-span-6 bg-gradient-to-b from-sky-50 via-indigo-50/40 to-slate-50 rounded-3xl p-6 border border-sky-100 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden">
                {/* Visual Canvas Container */}
                <div className="relative w-full max-w-md h-80 bg-white/90 backdrop-blur-xs rounded-3xl border border-sky-200/60 shadow-inner flex flex-col items-center justify-center p-4 overflow-hidden">
                  {/* Visual 1: Explorer Body (Panca Indera) */}
                  {lesson.stages.lihat.heroVisual === 'explorer_body' && (
                    <div className="relative w-64 h-72 flex flex-col items-center justify-center">
                      {/* Clean Faceless Head Silhouette */}
                      <div className="w-32 h-36 rounded-full bg-gradient-to-b from-amber-200 to-amber-100 border-2 border-amber-300/80 relative flex items-center justify-center shadow-xs">
                        <div className="absolute -top-3 w-32 h-10 bg-teal-600 rounded-t-full flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
                          <span>Topi Penjelajah</span>
                        </div>
                        <button
                          onClick={() => handleSelectHotspot('mata')}
                          className={`absolute top-12 left-6 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            selectedHotspotId === 'mata' ? 'ring-4 ring-sky-400 bg-sky-500 text-white scale-125 z-20 shadow-md' : 'hover:scale-110 bg-white/95 text-slate-800 shadow-xs border border-slate-200'
                          }`}
                          title="Sensor Mata"
                        >
                          <span className="text-base">👁️</span>
                        </button>
                        <button
                          onClick={() => handleSelectHotspot('mata')}
                          className={`absolute top-12 right-6 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            selectedHotspotId === 'mata' ? 'ring-4 ring-sky-400 bg-sky-500 text-white scale-125 z-20 shadow-md' : 'hover:scale-110 bg-white/95 text-slate-800 shadow-xs border border-slate-200'
                          }`}
                          title="Sensor Mata"
                        >
                          <span className="text-base">👁️</span>
                        </button>
                        <button
                          onClick={() => handleSelectHotspot('telinga')}
                          className={`absolute -left-4 top-14 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            selectedHotspotId === 'telinga' ? 'ring-4 ring-purple-400 bg-purple-500 text-white scale-125 z-20 shadow-md' : 'hover:scale-110 bg-white/95 text-slate-800 shadow-xs border border-slate-200'
                          }`}
                          title="Sensor Telinga"
                        >
                          <span className="text-base">👂</span>
                        </button>
                        <button
                          onClick={() => handleSelectHotspot('telinga')}
                          className={`absolute -right-4 top-14 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            selectedHotspotId === 'telinga' ? 'ring-4 ring-purple-400 bg-purple-500 text-white scale-125 z-20 shadow-md' : 'hover:scale-110 bg-white/95 text-slate-800 shadow-xs border border-slate-200'
                          }`}
                          title="Sensor Telinga"
                        >
                          <span className="text-base">👂</span>
                        </button>
                        <button
                          onClick={() => handleSelectHotspot('hidung')}
                          className={`absolute top-22 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            selectedHotspotId === 'hidung' ? 'ring-4 ring-emerald-400 bg-emerald-500 text-white scale-125 z-20 shadow-md' : 'hover:scale-110 bg-white/95 text-slate-800 shadow-xs border border-slate-200'
                          }`}
                          title="Sensor Hidung"
                        >
                          <span className="text-base">👃</span>
                        </button>
                        <button
                          onClick={() => handleSelectHotspot('lidah')}
                          className={`absolute bottom-2 w-9 h-8 rounded-full flex items-center justify-center transition-all ${
                            selectedHotspotId === 'lidah' ? 'ring-4 ring-rose-400 bg-rose-500 text-white scale-125 z-20 shadow-md' : 'hover:scale-110 bg-white/95 text-slate-800 shadow-xs border border-slate-200'
                          }`}
                          title="Sensor Lidah"
                        >
                          <span className="text-base">👅</span>
                        </button>
                      </div>
                      <div className="w-44 h-20 bg-teal-500 rounded-t-2xl mt-2 relative flex justify-between px-3 pt-2 text-white">
                        <span className="text-[11px] font-bold">Rompi Kiko</span>
                        <button
                          onClick={() => handleSelectHotspot('kulit')}
                          className={`absolute -right-4 top-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            selectedHotspotId === 'kulit' ? 'ring-4 ring-amber-400 bg-amber-500 text-white scale-125 z-20 shadow-md' : 'hover:scale-110 bg-white/95 text-slate-800 shadow-xs border border-slate-200'
                          }`}
                          title="Sensor Kulit"
                        >
                          <span className="text-lg">✋</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Visual 2: Clean Body Hygiene (Tubuh Sehat) */}
                  {lesson.stages.lihat.heroVisual === 'clean_body' && (
                    <div className="w-full h-full flex flex-col items-center justify-around py-2">
                      <div className="text-[11px] font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                        ✨ Stasiun Rawat Tubuh Bersih
                      </div>
                      <div className="grid grid-cols-3 gap-3 w-full px-2">
                        {lesson.stages.lihat.hotspots.slice(0, 3).map((h) => (
                          <button
                            key={h.id}
                            onClick={() => handleSelectHotspot(h.id)}
                            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${
                              selectedHotspotId === h.id ? 'bg-teal-500 text-white border-teal-600 scale-105 shadow-md' : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-3xl">{h.icon}</span>
                            <span className="text-[11px] font-bold truncate max-w-full">{h.name}</span>
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3 w-3/4">
                        {lesson.stages.lihat.hotspots.slice(3, 5).map((h) => (
                          <button
                            key={h.id}
                            onClick={() => handleSelectHotspot(h.id)}
                            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${
                              selectedHotspotId === h.id ? 'bg-teal-500 text-white border-teal-600 scale-105 shadow-md' : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-2xl">{h.icon}</span>
                            <span className="text-[11px] font-bold truncate max-w-full">{h.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visual 3: Buoyancy Tank (Apung & Tenggelam) */}
                  {lesson.stages.lihat.heroVisual === 'buoyancy_tank' && (
                    <div className="w-full h-full relative rounded-2xl border-2 border-sky-400 overflow-hidden bg-gradient-to-b from-sky-100 via-sky-200 to-sky-400 flex flex-col justify-between p-3">
                      {/* Water surface line */}
                      <div className="absolute top-24 left-0 right-0 h-1 bg-sky-500/60 border-t border-sky-300 border-dashed" />
                      <div className="text-[10px] font-extrabold text-sky-800 uppercase tracking-wider flex justify-between z-10">
                        <span>Permukaan Air (Mengapung)</span>
                        <span>Massa Jenis Ringan</span>
                      </div>
                      <div className="flex justify-around items-center z-10 pt-2">
                        {lesson.stages.lihat.hotspots.slice(0, 2).map((h) => (
                          <button
                            key={h.id}
                            onClick={() => handleSelectHotspot(h.id)}
                            className={`p-2.5 rounded-2xl flex items-center gap-1.5 border transition-all ${
                              selectedHotspotId === h.id ? 'bg-sky-600 text-white border-sky-700 scale-110 shadow-lg ring-2 ring-sky-300' : 'bg-white/90 text-slate-800 hover:bg-white shadow-xs'
                            }`}
                          >
                            <span className="text-2xl">{h.icon}</span>
                            <span className="text-xs font-bold">{h.name}</span>
                          </button>
                        ))}
                      </div>
                      <div className="text-[10px] font-extrabold text-indigo-950 uppercase tracking-wider flex justify-between z-10 mt-6">
                        <span>Dasar Bejana (Tenggelam)</span>
                        <span>Massa Jenis Padat</span>
                      </div>
                      <div className="flex justify-around items-center z-10 pb-1">
                        {lesson.stages.lihat.hotspots.slice(2, 4).map((h) => (
                          <button
                            key={h.id}
                            onClick={() => handleSelectHotspot(h.id)}
                            className={`p-2.5 rounded-2xl flex items-center gap-1.5 border transition-all ${
                              selectedHotspotId === h.id ? 'bg-indigo-700 text-white border-indigo-900 scale-110 shadow-lg ring-2 ring-indigo-300' : 'bg-white/90 text-slate-800 hover:bg-white shadow-xs'
                            }`}
                          >
                            <span className="text-2xl">{h.icon}</span>
                            <span className="text-xs font-bold">{h.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visual 4: Matter Beakers (Padat, Cair, Gas) */}
                  {lesson.stages.lihat.heroVisual === 'matter_beakers' && (
                    <div className="w-full h-full flex items-center justify-around gap-2 px-2">
                      {lesson.stages.lihat.hotspots.map((h) => (
                        <button
                          key={h.id}
                          onClick={() => handleSelectHotspot(h.id)}
                          className={`flex-1 h-64 rounded-3xl border-2 flex flex-col items-center justify-between p-3 transition-all ${
                            selectedHotspotId === h.id
                              ? 'bg-sky-50 border-sky-500 ring-4 ring-sky-200 scale-105 shadow-md'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                          }`}
                        >
                          <span className="text-xs font-bold text-slate-500 uppercase">{h.name}</span>
                          <div className="w-16 h-28 rounded-b-2xl border-2 border-slate-300 bg-slate-50 flex items-center justify-center text-4xl relative overflow-hidden">
                            {h.icon}
                          </div>
                          <span className="text-xs font-bold text-sky-700">Pilih Tabung</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Visual 5: Plant Anatomy (Kebutuhan Tumbuhan) */}
                  {lesson.stages.lihat.heroVisual === 'plant_anatomy' && (
                    <div className="w-full h-full flex flex-col items-center justify-between relative py-2">
                      <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        🌱 Struktur Anatomi Tanaman
                      </div>
                      <div className="flex flex-col items-center justify-center gap-2 flex-1 w-full">
                        {lesson.stages.lihat.hotspots.map((h) => (
                          <button
                            key={h.id}
                            onClick={() => handleSelectHotspot(h.id)}
                            className={`w-4/5 py-2 px-4 rounded-xl border flex items-center justify-between transition-all ${
                              selectedHotspotId === h.id ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-102' : 'bg-white border-slate-200 hover:bg-emerald-50 text-slate-800'
                            }`}
                          >
                            <span className="text-xl">{h.icon}</span>
                            <span className="font-bold text-xs">{h.name}</span>
                            <span className="text-[10px] opacity-75">Detail →</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visual 6: Metamorphosis Cycle (Siklus Kupu) */}
                  {lesson.stages.lihat.heroVisual === 'butterfly_cycle' && (
                    <div className="w-full h-full flex flex-col items-center justify-between py-2">
                      <div className="text-[11px] font-bold text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                        🔄 Metamorfosis Kupu-Kupu
                      </div>
                      <div className="grid grid-cols-2 gap-3 w-full px-4 flex-1 items-center">
                        {lesson.stages.lihat.hotspots.map((h, i) => (
                          <button
                            key={h.id}
                            onClick={() => handleSelectHotspot(h.id)}
                            className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                              selectedHotspotId === h.id ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-105' : 'bg-white border-slate-200 hover:bg-purple-50 text-slate-800'
                            }`}
                          >
                            <span className="text-3xl">{h.icon}</span>
                            <div className="text-left">
                              <span className="text-[10px] block opacity-75 font-semibold">Tahap {i + 1}</span>
                              <span className="text-xs font-bold">{h.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visual 7: Light & Shadow (Cahaya & Bayangan) */}
                  {lesson.stages.lihat.heroVisual === 'light_shadow' && (
                    <div className="w-full h-full flex items-center justify-between px-3 bg-gradient-to-r from-yellow-50 via-slate-100 to-slate-900 rounded-2xl p-4 relative overflow-hidden">
                      {lesson.stages.lihat.hotspots.map((h, i) => (
                        <button
                          key={h.id}
                          onClick={() => handleSelectHotspot(h.id)}
                          className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all z-10 ${
                            selectedHotspotId === h.id ? 'bg-amber-500 text-white border-amber-600 scale-110 shadow-lg' : 'bg-white/95 text-slate-800 border-slate-200 hover:bg-white'
                          }`}
                        >
                          <span className="text-3xl">{h.icon}</span>
                          <span className="text-[11px] font-bold">{h.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Visual 8: Magnet Poles (Daya Magnet) */}
                  {lesson.stages.lihat.heroVisual === 'magnet_poles' && (
                    <div className="w-full h-full flex flex-col items-center justify-around py-2">
                      <div className="text-[11px] font-bold text-red-800 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                        🧲 Medan & Kutub Magnet
                      </div>
                      <div className="flex items-center justify-center gap-4 w-full">
                        {lesson.stages.lihat.hotspots.map((h) => (
                          <button
                            key={h.id}
                            onClick={() => handleSelectHotspot(h.id)}
                            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                              selectedHotspotId === h.id ? 'bg-red-600 text-white border-red-700 scale-110 shadow-lg ring-2 ring-red-300' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-3xl">{h.icon}</span>
                            <span className="text-xs font-bold text-center">{h.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visual 9: Sun & Earth (Siang & Malam) */}
                  {lesson.stages.lihat.heroVisual === 'sun_earth' && (
                    <div className="w-full h-full flex flex-col items-center justify-around py-2 bg-gradient-to-r from-amber-100 via-sky-50 to-indigo-950 rounded-2xl p-4">
                      <div className="text-[11px] font-bold text-indigo-900 bg-white/90 px-3 py-1 rounded-full border border-indigo-200">
                        🌍 Rotasi Bumi 24 Jam
                      </div>
                      <div className="flex items-center justify-around w-full">
                        {lesson.stages.lihat.hotspots.map((h) => (
                          <button
                            key={h.id}
                            onClick={() => handleSelectHotspot(h.id)}
                            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                              selectedHotspotId === h.id ? 'bg-indigo-600 text-white border-indigo-700 scale-110 shadow-lg' : 'bg-white/95 text-slate-800 border-slate-200 hover:bg-white'
                            }`}
                          >
                            <span className="text-3xl">{h.icon}</span>
                            <span className="text-[11px] font-bold">{h.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visual 10: Weather Sky (Cuaca & Musim) */}
                  {lesson.stages.lihat.heroVisual === 'weather_sky' && (
                    <div className="w-full h-full grid grid-cols-2 gap-2 p-2">
                      {lesson.stages.lihat.hotspots.map((h) => (
                        <button
                          key={h.id}
                          onClick={() => handleSelectHotspot(h.id)}
                          className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                            selectedHotspotId === h.id ? 'bg-indigo-600 text-white border-indigo-700 scale-105 shadow-md' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-3xl">{h.icon}</span>
                          <span className="text-xs font-bold">{h.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Visual 11: Animal Habitats (Habitat Satwa) */}
                  {lesson.stages.lihat.heroVisual === 'animal_habitats' && (
                    <div className="w-full h-full flex flex-col items-center justify-around py-2">
                      <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        🐾 Tiga Habitat Utama Satwa
                      </div>
                      <div className="flex items-center justify-center gap-3 w-full px-2">
                        {lesson.stages.lihat.hotspots.map((h) => (
                          <button
                            key={h.id}
                            onClick={() => handleSelectHotspot(h.id)}
                            className={`flex-1 p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                              selectedHotspotId === h.id ? 'bg-emerald-600 text-white border-emerald-700 scale-105 shadow-md' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-3xl">{h.icon}</span>
                            <span className="text-[11px] font-bold text-center leading-tight">{h.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visual 12: Food Chain (Rantai Makanan) */}
                  {lesson.stages.lihat.heroVisual === 'food_chain' && (
                    <div className="w-full h-full flex flex-col items-center justify-around py-2">
                      <div className="text-[11px] font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">
                        🌾 Aliran Energi Ekosistem Sawah
                      </div>
                      <div className="grid grid-cols-2 gap-2.5 w-full px-2">
                        {lesson.stages.lihat.hotspots.map((h) => (
                          <button
                            key={h.id}
                            onClick={() => handleSelectHotspot(h.id)}
                            className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                              selectedHotspotId === h.id ? 'bg-emerald-700 text-white border-emerald-800 scale-102 shadow-md' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-2xl">{h.icon}</span>
                            <span className="text-[11px] font-bold text-left">{h.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hotspot buttons picker */}
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {lesson.stages.lihat.hotspots.map((hotspot) => {
                    const isSelected = selectedHotspotId === hotspot.id;
                    const isSeen = inspectedHotspots.has(hotspot.id);
                    return (
                      <button
                        key={hotspot.id}
                        onClick={() => handleSelectHotspot(hotspot.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-sky-600 text-white shadow-md scale-105'
                            : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
                        }`}
                      >
                        <span>{hotspot.icon}</span>
                        <span>{hotspot.name}</span>
                        {isSeen && <span className="text-emerald-500">✓</span>}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 mt-2">
                  Sudah diamati: {inspectedHotspots.size} dari {lesson.stages.lihat.hotspots.length} Elemen Sains (Model Faceless)
                </div>
              </div>

              {/* Right Zone: Concept Annotation Card */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-3xl">
                      {currentHotspot.icon}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                        {lesson.title}
                      </span>
                      <h3 className="font-heading font-bold text-xl text-slate-900">
                        {currentHotspot.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {currentHotspot.explanation}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-amber-900 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Fakta Sains Menakjubkan:</span>
                    </div>
                    <p className="text-xs leading-relaxed font-medium">
                      {currentHotspot.funDetail}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100 text-sky-900 text-xs font-semibold">
                    {currentHotspot.example}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={goToNextStage}
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-heading font-bold text-sm shadow-md transition-all active:scale-95"
                  >
                    <span>Lanjut ke Tahap Eksplorasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* STAGE 2: EKSPLORASI (Active Choice Discovery)         */}
        {/* ==================================================== */}
        {currentStage === 'eksplorasi' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Tahap 2 — Eksplorasi</span>
              <h2 className="font-heading font-bold text-2xl text-slate-900 mt-1">
                Ayo Bantu Kiko Menemukan Jawabannya!
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {lesson.stages.eksplorasi.instruction}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-2xl shrink-0">
                {lesson.stages.eksplorasi.options.find((o) => o.isCorrect)?.icon || '💡'}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Pertanyaan Eksplorasi Sains
                </span>
                <p className="text-base font-bold text-slate-900 leading-snug">
                  "{lesson.stages.eksplorasi.question}"
                </p>
                <div className="text-xs text-indigo-700 font-medium flex items-center gap-1.5 pt-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>💡 Petunjuk: Ketuk salah satu pilihan di bawah yang menurutmu paling tepat!</span>
                </div>
              </div>
            </div>

            {/* Visual Choice Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {lesson.stages.eksplorasi.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectExploration(opt)}
                    className={`p-6 rounded-3xl border-2 text-center transition-all flex flex-col items-center justify-center gap-3 ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-200'
                          : 'bg-amber-50 border-amber-400 ring-4 ring-amber-100'
                        : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-md'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-4xl shadow-inner">
                      {opt.icon}
                    </div>
                    <span className="font-heading font-bold text-lg text-slate-900">
                      {opt.text}
                    </span>
                    {isSelected && (
                      <span className={`text-xs font-bold ${opt.isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {opt.isCorrect ? '✓ Pilihan Tepat!' : 'Yuk coba cermati lagi!'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback callout */}
            {explorationFeedback && (
              <div
                className={`p-4 rounded-2xl border text-sm font-medium ${
                  isExplorationCorrect
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  {isExplorationCorrect ? '🎉 Luar Biasa!' : '💡 Tips dari Kiko:'}
                </div>
                <p>{explorationFeedback}</p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={goToPrevStage}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Tahap Sebelumnya</span>
              </button>

              <button
                onClick={goToNextStage}
                disabled={!isExplorationCorrect}
                className={`py-3 px-6 rounded-2xl font-heading font-bold text-sm inline-flex items-center gap-2 transition-all ${
                  isExplorationCorrect
                    ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-md active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Lanjut ke Tahap Interaksi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* STAGE 3: INTERAKSI (Matching Hands-On Pairs)         */}
        {/* ==================================================== */}
        {currentStage === 'interaksi' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Tahap 3 — Interaksi Sentuh & Pasangkan</span>
              <h2 className="font-heading font-bold text-2xl text-slate-900 mt-1">
                {lesson.stages.interaksi.title}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {lesson.stages.interaksi.instruction}
              </p>
            </div>

            {/* Petunjuk Interaksi Box */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center gap-3 text-xs text-sky-900 font-medium">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                <strong>Petunjuk:</strong> Pertama, klik kartu di kolom sebelah kiri (Nomor 1), lalu klik pasangannya yang cocok di kolom sebelah kanan (Nomor 2)!
              </span>
            </div>

            {/* Matching Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  1. Pilih Kartu Pertama
                </div>
                {lesson.stages.interaksi.pairs.map((pair) => {
                  const isMatched = !!matchedPairs[pair.id];
                  const isSelected = activeLeftId === pair.id;
                  return (
                    <button
                      key={pair.id}
                      onClick={() => !isMatched && handleSelectMatchLeft(pair.id)}
                      disabled={isMatched}
                      className={`w-full p-3.5 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                        isMatched
                          ? 'bg-emerald-50/70 border-emerald-300 opacity-80 cursor-default'
                          : isSelected
                          ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-200 scale-102'
                          : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{pair.icon}</span>
                        <span className="font-bold text-sm text-slate-800">{pair.label}</span>
                      </div>
                      {isMatched ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Terpasang
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-500">
                          {isSelected ? 'Klik pasangannya 👉' : 'Pilih'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Matched Item */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  2. Pilih Pasangan yang Sesuai
                </div>
                {lesson.stages.interaksi.pairs.map((pair) => {
                  // Check if this right item is already matched
                  const isMatched = Object.values(matchedPairs).includes(pair.matchId);
                  return (
                    <button
                      key={pair.matchId}
                      onClick={() => !isMatched && handleSelectMatchRight(pair.matchId)}
                      disabled={isMatched || !activeLeftId}
                      className={`w-full p-3.5 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                        isMatched
                          ? 'bg-emerald-50/70 border-emerald-300 opacity-80 cursor-default'
                          : activeLeftId
                          ? 'bg-white border-sky-200 hover:border-sky-500 hover:bg-sky-50 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-500 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{pair.targetIcon}</span>
                        <span className="font-bold text-sm text-slate-800">{pair.targetLabel}</span>
                      </div>
                      {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Matching Progress */}
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-between">
              <span className="text-xs font-bold text-sky-900">
                Pasangan Terhubung: {Object.keys(matchedPairs).length} dari {lesson.stages.interaksi.pairs.length}
              </span>
              {Object.keys(matchedPairs).length === lesson.stages.interaksi.pairs.length && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> Sempurna! Semua Pasangan Cocok!
                </span>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={goToPrevStage}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Tahap Sebelumnya</span>
              </button>

              <button
                onClick={goToNextStage}
                disabled={Object.keys(matchedPairs).length < lesson.stages.interaksi.pairs.length}
                className={`py-3 px-6 rounded-2xl font-heading font-bold text-sm inline-flex items-center gap-2 transition-all ${
                  Object.keys(matchedPairs).length === lesson.stages.interaksi.pairs.length
                    ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-md active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Lanjut ke Eksperimen Virtual</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* STAGE 4: EKSPERIMEN VIRTUAL (Sound Waves & Eardrum)   */}
        {/* ==================================================== */}
        {currentStage === 'eksperimen' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Tahap 4 — Eksperimen Virtual</span>
              <h2 className="font-heading font-bold text-2xl text-slate-900 mt-1">
                Eksperimen: Gelombang Suara Menuju Telinga
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {lesson.stages.eksperimen.instruction}
              </p>
            </div>

            {/* Simulation Canvas */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-inner relative overflow-hidden min-h-[300px] flex flex-col justify-between">
              {/* Top simulation readout */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                    Lab Simulasi Akustik Panca Indera
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400 tabular-nums">
                  Frekuensi: {soundFrequencyHz} Hz
                </div>
              </div>

              {/* Center visual: Instrument -> Air Wave Particles -> Ear */}
              <div className="py-8 flex items-center justify-between gap-4 relative">
                {/* Source Instrument */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-20 h-20 rounded-2xl bg-slate-800 border-2 border-sky-400 flex items-center justify-center text-4xl shadow-lg transition-transform ${
                      isPlayingSoundExp ? 'scale-115 rotate-6' : ''
                    }`}
                  >
                    {activeInstrument === 'lonceng' && '🔔'}
                    {activeInstrument === 'gendang' && '🥁'}
                    {activeInstrument === 'garputala' && '🔱'}
                  </div>
                  <span className="text-xs font-bold text-slate-300 mt-2 capitalize">
                    {activeInstrument}
                  </span>
                </div>

                {/* Animated Sound Compression Waves */}
                <div className="flex-1 flex items-center justify-center gap-3 px-4 relative">
                  {[1, 2, 3, 4, 5].map((wave) => (
                    <div
                      key={wave}
                      style={{
                        animationDelay: `${wave * 0.15}s`,
                      }}
                      className={`h-24 w-1.5 rounded-full transition-all duration-300 ${
                        isPlayingSoundExp
                          ? 'bg-sky-400 animate-pulse shadow-md shadow-sky-400/50'
                          : 'bg-slate-800 h-8'
                      }`}
                    />
                  ))}
                  <div className="absolute top-0 text-[10px] text-sky-300 font-semibold tracking-wide">
                    {isPlayingSoundExp ? 'Getaran Udara Bergelombang ~ ~ ~' : 'Sentuh tombol bunyi di bawah'}
                  </div>
                </div>

                {/* Receiver: Human Ear */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-20 h-20 rounded-2xl bg-indigo-950 border-2 border-indigo-400 flex items-center justify-center text-4xl shadow-lg transition-all ${
                      isPlayingSoundExp ? 'scale-110 ring-4 ring-indigo-500/50' : ''
                    }`}
                  >
                    👂
                  </div>
                  <span className="text-xs font-bold text-indigo-300 mt-2">Gendang Telinga</span>
                </div>
              </div>

              {/* Bottom controls: Trigger buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTriggerInstrument('lonceng', 580)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeInstrument === 'lonceng'
                        ? 'bg-sky-500 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>🔔 Lonceng (Tinggi)</span>
                  </button>
                  <button
                    onClick={() => handleTriggerInstrument('gendang', 180)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeInstrument === 'gendang'
                        ? 'bg-sky-500 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>🥁 Gendang (Rendah)</span>
                  </button>
                  <button
                    onClick={() => handleTriggerInstrument('garputala', 440)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeInstrument === 'garputala'
                        ? 'bg-sky-500 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>🔱 Garpu Tala</span>
                  </button>
                </div>

                <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kesimpulan: Bunyi berasal dari benda yang bergetar!</span>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={goToPrevStage}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Tahap Sebelumnya</span>
              </button>

              <button
                onClick={goToNextStage}
                className="py-3 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-heading font-bold text-sm inline-flex items-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <span>Lanjut ke Tantangan Kiko</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* STAGE 5: TANTANGAN (Bantu Kiko Mini-Game)             */}
        {/* ==================================================== */}
        {currentStage === 'tantangan' && (() => {
          const linkedGame = MINI_GAMES_DATA.find((g) => g.id === lesson.stages.tantangan.gameId);
          return (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                    Tahap 5 — Misi Tantangan Game Sains
                  </span>
                  <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    +{linkedGame?.rewardXp || 85} XP
                  </span>
                </div>
                <h2 className="font-heading font-bold text-2xl text-slate-900 mt-1">
                  {lesson.stages.tantangan.title}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {lesson.stages.tantangan.missionText}
                </p>
              </div>

              {/* Comprehensive Mission Briefing Card before playing game */}
              <div className="bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-4xl shadow-inner border border-white/20 shrink-0">
                      {linkedGame?.icon || '🎮'}
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
                        Game Khusus Materi Ini · Kelas {lesson.grade} SD
                      </span>
                      <h3 className="font-heading font-bold text-2xl text-white">
                        {linkedGame?.title || 'Tantangan Penyelidikan Sains'}
                      </h3>
                      <p className="text-xs sm:text-sm text-sky-100 mt-0.5 max-w-xl">
                        {linkedGame?.description || 'Bantu Kiko menyelesaikan misi sains ini!'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenMiniGame(lesson.stages.tantangan.gameId)}
                    className="py-3.5 px-7 rounded-2xl bg-white hover:bg-yellow-300 text-slate-900 font-heading font-bold text-sm shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-slate-900" />
                    <span>Mainkan Game Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Science Briefing & 1-2-3 How to Play */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/15">
                  {/* Science Concept */}
                  <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15 space-y-2">
                    <div className="flex items-center gap-2 text-yellow-300 font-heading font-bold text-xs uppercase tracking-wide">
                      <BookOpen className="w-4 h-4" />
                      <span>Konsep Sains yang Diuji:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-sky-50 leading-relaxed font-medium">
                      {linkedGame?.tutorial?.conceptSummary || lesson.objective}
                    </p>
                  </div>

                  {/* 1-2-3 How to Play */}
                  <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15 space-y-2">
                    <div className="flex items-center gap-2 text-yellow-300 font-heading font-bold text-xs uppercase tracking-wide">
                      <Lightbulb className="w-4 h-4" />
                      <span>Petunjuk Cara Bermain:</span>
                    </div>
                    <ul className="text-xs text-sky-50 space-y-1.5 font-medium">
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold text-amber-300">1.</span>
                        <span>{linkedGame?.tutorial?.howToPlay[0]?.instruction || 'Amati benda atau fenomena sains yang muncul di layar.'}</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold text-amber-300">2.</span>
                        <span>{linkedGame?.tutorial?.howToPlay[1]?.instruction || 'Pilah atau susun sesuai aturan sains yang telah dipelajari.'}</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold text-amber-300">3.</span>
                        <span>{linkedGame?.tutorial?.howToPlay[2]?.instruction || 'Raih skor target untuk klaim bintang emas dan bonus XP!'}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Kiko mascot message */}
                <div className="bg-black/15 rounded-xl px-4 py-2.5 flex items-center gap-3 text-xs text-sky-100">
                  <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
                  <span>
                    <strong>Pesan Kiko:</strong> "{linkedGame?.tutorial?.kikoTip || 'Tenang saja dan nikmati setiap teka-teki sains ini!'}"
                  </span>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={goToPrevStage}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Tahap Sebelumnya</span>
                </button>

                <button
                  onClick={goToNextStage}
                  className="py-3 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-heading font-bold text-sm inline-flex items-center gap-2 shadow-md active:scale-95 transition-all"
                >
                  <span>Lanjut ke Kuis Bintang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })()}

        {/* ==================================================== */}
        {/* STAGE 6: KUIS (Star Quiz with Briefing & Guidance)   */}
        {/* ==================================================== */}
        {currentStage === 'kuis' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  Tahap 6 — Kuis Tangkas Bintang
                </span>
                <h2 className="font-heading font-bold text-2xl text-slate-900 mt-1">
                  Kuis Sains: {lesson.title}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Jawab {lesson.stages.kuis.questions.length} pertanyaan seru ini untuk mengumpulkan bintang emasmu!
                </p>
              </div>

              {quizStarted && !showQuizResult && (
                <button
                  onClick={() => setShowQuizNotesModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl border border-indigo-200 transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
                >
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>📖 Intip Rangkuman Materi</span>
                </button>
              )}
            </div>

            {/* PRE-QUIZ BRIEFING: Shown before questions begin */}
            {!quizStarted && !showQuizResult && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
                {/* Header card with Mascot */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/60 to-slate-50 border border-sky-100 flex items-center gap-4">
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
                      Persiapan & Petunjuk Mengerjakan Soal Kuis
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      "Halo Sahabat Cilik! Sebelum mulai menjawab 3 soal kuis seru ini, yuk kita baca rangkuman materi kilat di bawah ini agar kamu makin paham dan tahu apa yang harus dikerjakan!"
                    </p>
                  </div>
                </div>

                {/* Section 1: Rangkuman Fakta Sains yang Perlu Diingat */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-heading font-bold text-lg text-slate-900">
                      1. Rangkuman Materi Sains yang Wajib Diingat
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {lesson.stages.lihat.hotspots.slice(0, 3).map((spot) => (
                      <div
                        key={spot.id}
                        className="p-4 rounded-2xl bg-sky-50/40 border border-sky-100/80 flex flex-col gap-2 hover:bg-sky-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white border border-sky-200 flex items-center justify-center text-2xl shadow-2xs">
                          {spot.icon}
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-sm text-slate-900">
                            {spot.name || spot.title}
                          </h4>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                            {spot.explanation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Petunjuk Mengerjakan Soal Kuis */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <h3 className="font-heading font-bold text-lg text-slate-900">
                      2. Petunjuk Cara Mengerjakan Soal Kuis (1-2-3)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 font-heading font-bold text-sm flex items-center justify-center shrink-0">
                        1
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                          Baca Soal dengan Teliti
                        </h4>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">
                          Pahami situasi sains yang ditanyakan Kiko di setiap nomor soal.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 font-heading font-bold text-sm flex items-center justify-center shrink-0">
                        2
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                          Pilih 1 Jawaban Terbaik
                        </h4>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">
                          Ketuk pilihan jawaban yang paling tepat menurut pemahamanmu.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 font-heading font-bold text-sm flex items-center justify-center shrink-0">
                        3
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                          Pelajari Ulasan Kiko
                        </h4>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">
                          Kiko akan langsung memberikan ulasan ilmiah ramah setelah kamu memilih!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Start Quiz Action */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Catatan materi bisa kamu buka kapan saja saat mengerjakan soal!</span>
                  </span>

                  <button
                    onClick={() => {
                      sound.playSuccess();
                      setQuizStarted(true);
                    }}
                    className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-sm shadow-md shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Saya Sudah Paham, Mulai Kerjakan Soal!</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* QUIZ IN ACTION: When quizStarted is true and not yet finished */}
            {quizStarted && !showQuizResult && (
              <div className="space-y-6">
                {/* Question Header & Counter */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Soal {currentQuizIdx + 1} dari {lesson.stages.kuis.questions.length}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500 font-bold text-xs">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <span>+{quizScore * 10} XP Didapat</span>
                  </div>
                </div>

                {/* Prompt Card */}
                <div className="p-6 rounded-3xl bg-sky-50/70 border border-sky-100">
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-900 leading-snug">
                    {lesson.stages.kuis.questions[currentQuizIdx].prompt}
                  </h3>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {lesson.stages.kuis.questions[currentQuizIdx].options.map((opt) => {
                    const hasAnswered = !!selectedQuizAnswers[currentQuizIdx];
                    const isSelected = selectedQuizAnswers[currentQuizIdx] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectQuizOption(opt.id, opt.isCorrect)}
                        disabled={hasAnswered}
                        className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                          hasAnswered
                            ? opt.isCorrect
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                              : isSelected
                              ? 'bg-amber-50 border-amber-400 text-amber-950'
                              : 'bg-white border-slate-200 text-slate-400'
                            : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {opt.icon && <span className="text-2xl">{opt.icon}</span>}
                          <span className="font-semibold text-sm">{opt.text}</span>
                        </div>
                        {hasAnswered && opt.isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation once answered */}
                {selectedQuizAnswers[currentQuizIdx] && (
                  <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-indigo-950 text-xs font-medium space-y-1">
                    <span className="font-bold">Penjelasan Kiko:</span>
                    <p>{lesson.stages.kuis.questions[currentQuizIdx].explanation}</p>
                  </div>
                )}

                {/* Next button */}
                {selectedQuizAnswers[currentQuizIdx] && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleNextQuiz}
                      className="py-3 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-heading font-bold text-sm shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
                    >
                      <span>
                        {currentQuizIdx < lesson.stages.kuis.questions.length - 1
                          ? 'Soal Berikutnya'
                          : 'Lihat Hasil Akhir'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* QUIZ RESULT: When finished */}
            {showQuizResult && (
              <div className="text-center py-6 space-y-6">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-4xl shadow-lg animate-bounce">
                  ⭐
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
                    Selamat! Kamu Mendapat 3 Bintang Emas!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Kamu telah menyelesaikan seluruh 6 tahap pembelajaran {lesson.title} dengan sempurna!
                  </p>
                </div>

                <div className="flex justify-center gap-3">
                  <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100 min-w-[120px]">
                    <div className="text-xs text-sky-600 font-bold">Skor Kuis</div>
                    <div className="text-xl font-extrabold text-sky-900 tabular-nums">
                      {quizScore} / {lesson.stages.kuis.questions.length}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-yellow-50 border border-yellow-100 min-w-[120px]">
                    <div className="text-xs text-yellow-700 font-bold">Total XP</div>
                    <div className="text-xl font-extrabold text-yellow-900 tabular-nums">+150 XP</div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onFinishLesson({
                      xp: 150,
                      stars: 3,
                      badgeId: `badge-${lesson.topicId}`,
                    })
                  }
                  className="py-4 px-8 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-heading font-bold text-base shadow-xl shadow-sky-500/25 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <span>Klaim Hadiah & Kembali ke Peta</span>
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Modal Quick Notes during Quiz */}
            {showQuizNotesModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
                <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-heading font-bold text-lg text-slate-900">
                        Catatan Rangkuman: {lesson.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowQuizNotesModal(false)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {lesson.stages.lihat.hotspots.map((spot) => (
                      <div
                        key={spot.id}
                        className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-100 flex flex-col gap-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{spot.icon}</span>
                          <span className="font-heading font-bold text-sm text-slate-900">
                            {spot.name || spot.title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {spot.explanation}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => setShowQuizNotesModal(false)}
                      className="py-2.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
                    >
                      Kembali ke Soal Kuis
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Kiko mascot helper floating speech banner */}
      <KikoMascot
        mood={currentStage === 'kuis' ? 'celebrating' : 'curious'}
        message={
          currentStage === 'lihat'
            ? 'Coba sentuh mata, telinga, hidung, lidah, dan kulit di atas untuk melihat fakta uniknya!'
            : currentStage === 'eksplorasi'
            ? 'Pilihlah indera yang tepat sesuai pertanyaan ya teman!'
            : currentStage === 'interaksi'
            ? 'Ayo pasangkan setiap indera dengan benda yang pas di sebelahnya!'
            : currentStage === 'eksperimen'
            ? 'Tekan tombol alat bunyi dan lihat gelombang suara bergerak menuju telinga!'
            : currentStage === 'tantangan'
            ? 'Bantu aku memilah benda-benda ini dalam game seru yuk!'
            : 'Jawab kuisnya dengan tenang, kamu pasti bisa!'
        }
      />
    </div>
  );
};
