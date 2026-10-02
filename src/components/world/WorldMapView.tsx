/**
 * Interactive Adventure World Map View
 * Shows interconnected island regions, path nodes, unlocked/locked states,
 * and direct topic launchers.
 */

import React, { useState } from 'react';
import {
  Compass,
  Star,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Award,
  Play,
} from 'lucide-react';
import { ScienceTopic, ScienceWorld, UserProfile } from '../../types';
import { WORLDS_DATA } from '../../data/scienceContent';
import { sound } from '../../services/sound';
import worldMapImg from '../../assets/images/world_map_adventure_1790867994895.jpg';

interface WorldMapViewProps {
  profile: UserProfile;
  onSelectTopic: (topicId: string) => void;
  onOpenMiniGame: (gameId: string) => void;
}

export const WorldMapView: React.FC<WorldMapViewProps> = ({
  profile,
  onSelectTopic,
  onOpenMiniGame,
}) => {
  const [selectedWorldId, setSelectedWorldId] = useState<string>('world-tubuh');
  const [selectedTopic, setSelectedTopic] = useState<ScienceTopic | null>(
    WORLDS_DATA[0].topics[0]
  );

  const selectedWorld =
    WORLDS_DATA.find((w) => w.id === selectedWorldId) || WORLDS_DATA[0];

  const handleSelectWorld = (world: ScienceWorld) => {
    sound.playClick();
    setSelectedWorldId(world.id);
    setSelectedTopic(world.topics[0] || null);
  };

  const handleSelectTopicNode = (topic: ScienceTopic) => {
    sound.playPop();
    setSelectedTopic(topic);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Petualangan Nusantara Sains
          </span>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
            Peta Jelajah Dunia IPA
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Jelajahi pulau-pulau ajaib untuk membuka pengetahuan baru dan lencana sains!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>Koleksi: {profile.stars} Bintang Emas</span>
          </div>
        </div>
      </div>

      {/* Visual Adventure Map Canvas */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border-2 border-sky-400/40 shadow-xl min-h-[360px] sm:min-h-[420px] flex flex-col justify-between p-6">
        <img
          src={worldMapImg}
          alt="Peta Petualangan Sains"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity hover:opacity-60"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Top Floating World Tabs */}
        <div className="relative z-10 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {WORLDS_DATA.map((world) => {
            const isCurrent = selectedWorldId === world.id;
            return (
              <button
                key={world.id}
                onClick={() => handleSelectWorld(world)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'bg-sky-500 text-white shadow-lg ring-2 ring-white'
                    : 'bg-slate-900/80 text-slate-200 hover:bg-slate-800 border border-white/20'
                }`}
              >
                <span>{world.icon}</span>
                <span>{world.title}</span>
                <span className="text-[10px] text-emerald-400 font-bold">✓</span>
              </button>
            );
          })}
        </div>

        {/* Center Interactive Waypoint Nodes */}
        <div className="relative z-10 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-items-center">
          {selectedWorld.topics.map((topic, idx) => {
            const isDone = profile.completedLessons.includes(topic.id);
            const isSelected = selectedTopic?.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => handleSelectTopicNode(topic)}
                className={`relative group flex flex-col items-center p-3 rounded-2xl backdrop-blur-md transition-all duration-300 ${
                  isSelected
                    ? 'bg-white text-slate-900 scale-110 shadow-2xl ring-4 ring-sky-400'
                    : 'bg-slate-900/80 hover:bg-white/90 text-white hover:text-slate-900 border border-white/20'
                }`}
              >
                {/* Node Level Number Pin */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-3xl shadow-md group-hover:rotate-6 transition-transform">
                  {topic.icon}
                </div>

                <span className="font-heading font-bold text-xs mt-2 text-center max-w-[120px] leading-tight">
                  {topic.title}
                </span>

                {isDone ? (
                  <span className="text-[10px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Selesai
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-300 font-semibold mt-1">
                    +{topic.xpReward} XP
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Map Legend Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-white/80 border-t border-white/15 pt-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Wilayah Terbuka</span>
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Kumpulkan Bintang Emas</span>
            </span>
          </div>
          <span className="hidden sm:inline text-sky-200 font-medium">
            Ketuk ikon pin untuk melihat detail misi
          </span>
        </div>
      </div>

      {/* Selected Topic Inspector Drawer Card */}
      {selectedTopic && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
              <span className="text-2xl">{selectedTopic.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Topik Sains Kelas {selectedTopic.grade} SD
              </span>
              <span className="text-xs font-bold text-slate-500">
                · {selectedTopic.estimatedMinutes} Menit Belajar
              </span>
            </div>

            <h2 className="font-heading font-bold text-2xl text-slate-900">
              {selectedTopic.title}
            </h2>

            <p className="text-sm text-slate-600 max-w-xl font-medium leading-relaxed">
              {selectedTopic.subtitle}
            </p>

            {/* Badges and features included */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-1">
              {selectedTopic.hasLesson && (
                <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 text-xs font-bold border border-sky-100">
                  📖 Materi Interaktif 6 Tahap
                </span>
              )}
              {selectedTopic.hasGame && (
                <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                  🎮 Mini Game Seru
                </span>
              )}
              {selectedTopic.hasExperiment && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                  🧪 Uji Coba Mini Lab
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                sound.playSuccess();
                onSelectTopic(selectedTopic.id);
              }}
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-heading font-bold text-sm shadow-md transition-all active:scale-95 inline-flex items-center justify-center gap-2"
            >
              <span>Mulai Belajar Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
