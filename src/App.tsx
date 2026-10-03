/**
 * Jelajah Dunia IPA - Petualangan Sains SD Interaktif
 * Main Application Orchestrator
 */

import React, { useState, useEffect } from 'react';
import {
  DailyMission,
  GradeLevel,
  NavigationTab,
  UserProfile,
} from './types';
import {
  WORLDS_DATA,
  PANCA_INDERA_LESSON,
  ALL_LESSONS,
  BADGES_DATA,
  DAILY_MISSIONS_POOL,
} from './data/scienceContent';
import { sound } from './services/sound';
import { Header } from './components/common/Header';
import { CelebrationModal } from './components/common/CelebrationModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { GradeSelectorView } from './components/grades/GradeSelectorView';
import { WorldMapView } from './components/world/WorldMapView';
import { LessonEngine } from './components/lesson/LessonEngine';
import { VirtualLabView } from './components/experiments/VirtualLabView';
import { MiniGameArcade } from './components/games/MiniGameArcade';
import { ChallengesView } from './components/challenges/ChallengesView';
import { CollectionEncyclopediaView } from './components/collection/CollectionEncyclopediaView';
import { ProgressAnalyticsView } from './components/progress/ProgressAnalyticsView';
import { ProfileView } from './components/profile/ProfileView';
import { ParentTeacherDashboard } from './components/parent/ParentTeacherDashboard';

const STORAGE_KEY = 'jelajah_dunia_ipa_user_profile';

const ALL_BADGE_IDS = [
  'badge-peneliti',
  'badge-indera',
  'badge-benda',
  'badge-tumbuhan',
  'badge-hewan',
  'badge-energi',
  'badge-air',
  'badge-bumi',
];

const ALL_COLLECTION_IDS = [
  'col-mata',
  'col-telinga',
  'col-lidah',
  'col-batu',
  'col-air',
  'col-udara',
  'col-kupukupu',
  'col-matahari',
  'col-katak',
  'col-daun-klorofil',
  'col-es-krim',
  'col-balon-gas',
  'col-garpu-tala',
  'col-magnet-ladam',
  'col-pelangi',
  'col-akar',
  'col-awan-hujan',
  'col-elang',
  'col-sabun',
  'col-kompas',
];

const INITIAL_PROFILE: UserProfile = {
  name: 'Bima',
  avatar: '🧭',
  grade: 1,
  level: 3,
  xp: 320,
  stars: 12,
  streakDays: 5,
  lastActiveDate: new Date().toISOString(),
  badges: ALL_BADGE_IDS,
  completedLessons: ['panca-indera'],
  completedGames: ['game-drag-indera'],
  completedExperiments: ['exp-apung-tenggelam'],
  unlockedCollections: ALL_COLLECTION_IDS,
  quizScores: {},
  timeSpentMinutes: 45,
  dailyMissionCompleted: false,
  explorationCount: 16,
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Normalize any old face avatar to faceless
        if (['🧑‍🚀', '👧', '👦', '🦊', '🦁', '🐼', '🤖', '🦉', '🐱', '🐬'].includes(parsed.avatar)) {
          parsed.avatar = '🧭';
        }
        // Ensure all badges and collections are fully unlocked for seamless exploration
        parsed.badges = Array.from(new Set([...(parsed.badges || []), ...ALL_BADGE_IDS]));
        parsed.unlockedCollections = Array.from(new Set([...(parsed.unlockedCollections || []), ...ALL_COLLECTION_IDS]));
        return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PROFILE;
  });

  const [currentTab, setCurrentTab] = useState<NavigationTab>('beranda');
  const [activeTopicId, setActiveTopicId] = useState<string>('panca-indera');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [activeExpId, setActiveExpId] = useState<string | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(sound.getIsSoundEnabled());
  const [isParentDashboardOpen, setIsParentDashboardOpen] = useState<boolean>(false);

  // Celebration state
  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    title?: string;
    subtitle?: string;
    rewardXp?: number;
    rewardStars?: number;
    badgeTitle?: string;
    badgeIcon?: string;
    nextActionText?: string;
  }>({
    isOpen: false,
  });

  // Save profile changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  const handleToggleSound = () => {
    const newState = sound.toggleMute();
    setIsSoundEnabled(newState);
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleSelectGrade = (grade: GradeLevel) => {
    sound.playSuccess();
    setProfile((prev) => ({ ...prev, grade }));
    setCurrentTab('dunia');
  };

  const handleSelectTopic = (topicId: string) => {
    setActiveTopicId(topicId);
    setCurrentTab('materi');
  };

  const handleLaunchDailyMission = (mission: DailyMission) => {
    if (mission.targetType === 'lesson') {
      setActiveTopicId(mission.targetId);
      setCurrentTab('materi');
    } else if (mission.targetType === 'experiment') {
      setActiveExpId(mission.targetId);
      setCurrentTab('eksperimen');
    } else if (mission.targetType === 'game') {
      setActiveGameId(mission.targetId);
      setCurrentTab('game');
    }
  };

  const handleOpenMiniGame = (gameId: string) => {
    setActiveGameId(gameId);
    setCurrentTab('game');
  };

  // Add XP and handle potential level-up
  const addXpAndStars = (xpGained: number, starsGained: number, badgeId?: string) => {
    setProfile((prev) => {
      const newXp = prev.xp + xpGained;
      const newStars = prev.stars + starsGained;
      const newLevel = Math.max(prev.level, Math.floor(newXp / 150) + 1);
      const newBadges = [...prev.badges];
      let unlockedBadgeTitle: string | undefined;
      let unlockedBadgeIcon: string | undefined;

      if (badgeId && !newBadges.includes(badgeId)) {
        newBadges.push(badgeId);
        const b = BADGES_DATA.find((item) => item.id === badgeId);
        if (b) {
          unlockedBadgeTitle = b.title;
          unlockedBadgeIcon = b.icon;
        }
      }

      setCelebration({
        isOpen: true,
        title: 'Misi Berhasil Selesai!',
        subtitle: `Kamu mendapatkan +${xpGained} XP dan +${starsGained} Bintang Emas!`,
        rewardXp: xpGained,
        rewardStars: starsGained,
        badgeTitle: unlockedBadgeTitle,
        badgeIcon: unlockedBadgeIcon,
        nextActionText: 'Lanjut Petualangan',
      });

      return {
        ...prev,
        xp: newXp,
        stars: newStars,
        level: newLevel,
        badges: newBadges,
        timeSpentMinutes: prev.timeSpentMinutes + 5,
        explorationCount: prev.explorationCount + 1,
      };
    });
  };

  // Completion from Lesson Engine
  const handleFinishLesson = (stats: { xp: number; stars: number; badgeId?: string }) => {
    setProfile((prev) => ({
      ...prev,
      completedLessons: prev.completedLessons.includes(activeTopicId)
        ? prev.completedLessons
        : [...prev.completedLessons, activeTopicId],
    }));
    addXpAndStars(stats.xp, stats.stars, stats.badgeId);
    setCurrentTab('dunia');
  };

  // Completion from Mini Game
  const handleGameCompleted = (gameId: string, rewardXp: number) => {
    setProfile((prev) => ({
      ...prev,
      completedGames: prev.completedGames.includes(gameId)
        ? prev.completedGames
        : [...prev.completedGames, gameId],
    }));
    addXpAndStars(rewardXp, 2);
  };

  // Completion from Virtual Lab
  const handleCompleteExperiment = (expId: string, rewardXp: number, badgeId?: string) => {
    setProfile((prev) => ({
      ...prev,
      completedExperiments: prev.completedExperiments.includes(expId)
        ? prev.completedExperiments
        : [...prev.completedExperiments, expId],
    }));
    addXpAndStars(rewardXp, 2, badgeId);
  };

  const handleResetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(INITIAL_PROFILE);
    sound.playClick();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFD] text-slate-800 selection:bg-sky-200">
      {/* Top Bar Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        profile={profile}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        onOpenParentDashboard={() => setIsParentDashboardOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {currentTab === 'beranda' && (
          <DashboardView
            profile={profile}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectTopic={handleSelectTopic}
            onLaunchDailyMission={handleLaunchDailyMission}
          />
        )}

        {currentTab === 'kelas' && (
          <GradeSelectorView
            currentGrade={profile.grade}
            onSelectGrade={handleSelectGrade}
            onNavigateToTopic={handleSelectTopic}
          />
        )}

        {currentTab === 'dunia' && (
          <WorldMapView
            profile={profile}
            onSelectTopic={handleSelectTopic}
            onOpenMiniGame={handleOpenMiniGame}
          />
        )}

        {currentTab === 'materi' && (
          <LessonEngine
            lesson={ALL_LESSONS[activeTopicId] || PANCA_INDERA_LESSON}
            onFinishLesson={handleFinishLesson}
            onBackToWorld={() => setCurrentTab('dunia')}
            onOpenMiniGame={handleOpenMiniGame}
          />
        )}

        {currentTab === 'eksperimen' && (
          <VirtualLabView
            initialExpId={activeExpId}
            completedExpIds={profile.completedExperiments}
            onCompleteExperiment={handleCompleteExperiment}
          />
        )}

        {currentTab === 'game' && (
          <MiniGameArcade
            initialGameId={activeGameId}
            completedGameIds={profile.completedGames}
            onGameCompleted={handleGameCompleted}
          />
        )}

        {currentTab === 'tantangan' && (
          <ChallengesView
            profile={profile}
            onLaunchMission={handleLaunchDailyMission}
            onClaimMissionReward={(id, xp, stars) => addXpAndStars(xp, stars)}
            onCompletePracticeQuiz={(quizId, xp, stars) => {
              setProfile((prev) => ({
                ...prev,
                completedLessons: prev.completedLessons.includes(quizId)
                  ? prev.completedLessons
                  : [...prev.completedLessons, quizId],
              }));
              addXpAndStars(xp, stars);
            }}
          />
        )}

        {currentTab === 'koleksi' && (
          <CollectionEncyclopediaView unlockedIds={profile.unlockedCollections} />
        )}

        {currentTab === 'progres' && <ProgressAnalyticsView profile={profile} />}

        {currentTab === 'profil' && (
          <ProfileView profile={profile} onUpdateProfile={handleUpdateProfile} />
        )}
      </main>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={celebration.isOpen}
        onClose={() => setCelebration((prev) => ({ ...prev, isOpen: false }))}
        title={celebration.title}
        subtitle={celebration.subtitle}
        rewardXp={celebration.rewardXp}
        rewardStars={celebration.rewardStars}
        badgeTitle={celebration.badgeTitle}
        badgeIcon={celebration.badgeIcon}
        nextActionText={celebration.nextActionText}
      />

      {/* Parent / Teacher Dashboard Modal */}
      <ParentTeacherDashboard
        isOpen={isParentDashboardOpen}
        onClose={() => setIsParentDashboardOpen(false)}
        profile={profile}
        onResetProgress={handleResetProgress}
      />

      {/* Discreet Quiet Footer - Full Width Edge-to-Edge */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500 font-medium w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Jelajah Dunia IPA · Pembelajaran Sains Interaktif Kelas 1–3 SD</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsParentDashboardOpen(true)}
              className="hover:text-slate-800 transition-colors"
            >
              Mode Guru & Orang Tua
            </button>
            <span aria-hidden="true">·</span>
            <span>Didukung Simulasi Laboratorium Mini</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
