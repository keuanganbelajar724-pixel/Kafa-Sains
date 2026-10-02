/**
 * Type definitions for Jelajah Dunia IPA
 * Extensible for Grades 1, 2, 3 and beyond.
 */

export type GradeLevel = 1 | 2 | 3;

export type NavigationTab = 
  | 'beranda'
  | 'kelas'
  | 'dunia'
  | 'materi'
  | 'eksperimen'
  | 'game'
  | 'tantangan'
  | 'koleksi'
  | 'progres'
  | 'profil'
  | 'parent_dashboard';

export interface UserProfile {
  name: string;
  avatar: string;
  grade: GradeLevel;
  level: number;
  xp: number;
  stars: number;
  streakDays: number;
  lastActiveDate: string;
  badges: string[]; // Badge IDs
  completedLessons: string[]; // Topic / Lesson IDs
  completedGames: string[]; // Game IDs
  completedExperiments: string[]; // Experiment IDs
  unlockedCollections: string[]; // Collection item IDs
  quizScores: Record<string, number>; // topicId -> score
  timeSpentMinutes: number;
  dailyMissionCompleted: boolean;
  explorationCount: number;
}

export interface Badge {
  id: string;
  title: string;
  category: 'IPA 1' | 'IPA 2' | 'IPA 3' | 'Eksplorasi' | 'Spesial';
  description: string;
  icon: string;
  requirement: string;
  color: string;
}

export interface CollectionItem {
  id: string;
  title: string;
  category: 'Indera' | 'Benda' | 'Hewan' | 'Tumbuhan' | 'Energi' | 'Bumi';
  grade: GradeLevel;
  icon: string;
  description: string;
  funFact: string;
  characteristics: string[];
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  targetType: 'lesson' | 'game' | 'experiment';
  targetId: string;
  rewardXp: number;
  rewardStars: number;
  completed: boolean;
}

export type LessonStageType =
  | 'lihat'         // Stage 1: Interactive visual with click points
  | 'eksplorasi'    // Stage 2: Exploration prompt with rich visual choices
  | 'interaksi'     // Stage 3: Direct interaction (drag/drop or matching)
  | 'eksperimen'    // Stage 4: Virtual experiment simulation
  | 'tantangan'     // Stage 5: Mini-game mission for Kiko
  | 'kuis';         // Stage 6: Encouraging star quiz

export interface InteractiveHotspot {
  id: string;
  name: string;
  icon: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  title: string;
  explanation: string;
  funDetail: string;
  example: string;
}

export interface LessonContent {
  id: string;
  topicId: string;
  grade: GradeLevel;
  title: string;
  subtitle: string;
  objective: string;
  stages: {
    lihat: {
      title: string;
      instruction: string;
      heroVisual: string;
      hotspots: InteractiveHotspot[];
    };
    eksplorasi: {
      question: string;
      instruction: string;
      options: {
        id: string;
        text: string;
        icon: string;
        isCorrect: boolean;
        feedback: string;
      }[];
    };
    interaksi: {
      title: string;
      instruction: string;
      pairs: {
        id: string;
        label: string;
        icon: string;
        matchId: string;
        targetLabel: string;
        targetIcon: string;
      }[];
    };
    eksperimen: {
      experimentId: string;
      instruction: string;
    };
    tantangan: {
      title: string;
      missionText: string;
      gameId: string;
    };
    kuis: {
      summaryPoints?: string[];
      questions: {
        id: string;
        prompt: string;
        options: {
          id: string;
          text: string;
          icon?: string;
          isCorrect: boolean;
        }[];
        explanation: string;
      }[];
    };
  };
}

export interface ScienceTopic {
  id: string;
  grade: GradeLevel;
  worldId: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  badgeId: string;
  estimatedMinutes: number;
  xpReward: number;
  hasLesson: boolean;
  hasGame: boolean;
  hasExperiment: boolean;
}

export interface ScienceWorld {
  id: string;
  title: string;
  subtitle: string;
  grade: GradeLevel;
  icon: string;
  color: string;
  bgColor: string;
  requiredStars: number;
  topics: ScienceTopic[];
}

export interface GameTutorialGuide {
  conceptTitle: string;
  conceptSummary: string;
  keyFacts: {
    icon: string;
    title: string;
    description: string;
  }[];
  howToPlay: {
    step: number;
    title: string;
    instruction: string;
    icon?: string;
  }[];
  kikoTip: string;
}

export interface MiniGameDefinition {
  id: string;
  title: string;
  grade: GradeLevel;
  topicTitle: string;
  type: 'drag_drop' | 'sorting' | 'matching' | 'memory' | 'sequence' | 'catch' | 'find_object';
  description: string;
  icon: string;
  rewardXp: number;
  config: unknown;
  tutorial?: GameTutorialGuide;
}

export interface VirtualExperimentDefinition {
  id: string;
  title: string;
  grade: GradeLevel;
  category: string;
  shortDesc: string;
  goal: string;
  icon: string;
  color: string;
  badgeRewardId?: string;
}

export interface PracticeQuestion {
  id: string;
  prompt: string;
  options: {
    id: string;
    text: string;
    icon?: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  hint?: string;
}

export interface PracticeQuizSet {
  id: string;
  title: string;
  grade: GradeLevel;
  category: string;
  icon: string;
  color: string;
  description: string;
  rewardXp: number;
  questions: PracticeQuestion[];
}
