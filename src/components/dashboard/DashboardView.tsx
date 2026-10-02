/**
 * Dashboard View for Kid Explorers
 * Displays Kiko greeting, Daily Mission with "MULAI MISI" CTA,
 * XP progress, Streak calendar, World cards, and Quick Continue.
 */

import React from 'react';
import {
  Sparkles,
  Flame,
  Star,
  Compass,
  ArrowRight,
  Award,
  Play,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { DailyMission, NavigationTab, UserProfile } from '../../types';
import { WORLDS_DATA, DAILY_MISSIONS_POOL } from '../../data/scienceContent';
import { sound } from '../../services/sound';
import kikoImg from '../../assets/images/kiko_faceless_mascot_1790869612195.jpg';

interface DashboardViewProps {
  profile: UserProfile;
  onNavigate: (tab: NavigationTab) => void;
  onSelectTopic: (topicId: string) => void;
  onLaunchDailyMission: (mission: DailyMission) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  onNavigate,
  onSelectTopic,
  onLaunchDailyMission,
}) => {
  // Current active daily mission
  const activeMission = DAILY_MISSIONS_POOL[0];

  // XP Progress calculation (each level is 150 XP)
  const currentLevelFloorXp = (profile.level - 1) * 150;
  const nextLevelXp = profile.level * 150;
  const xpInCurrentLevel = Math.max(0, profile.xp - currentLevelFloorXp);
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / 150) * 100));

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-6 space-y-6">
      {/* Hero Welcome Card with Faceless Mascot - Full Width Edge-to-Edge */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-700 text-white p-6 sm:p-8 lg:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left z-10 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/15 backdrop-blur-xs text-xs font-bold text-sky-100 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Petualangan Sains Kelas {profile.grade} SD</span>
          </div>

          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            Selamat Datang, {profile.name}! 🌟
          </h1>

          <p className="text-sm sm:text-base text-sky-100 font-medium leading-relaxed">
            Siap menjelajah dunia IPA hari ini? Kamu bisa menyentuh indera, menguji benda mengapung di lab, dan menyelesaikan misi seru!
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 justify-center md:justify-start">
            <button
              onClick={() => {
                sound.playClick();
                onSelectTopic('panca-indera');
              }}
              className="py-3 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-heading font-bold text-sm shadow-lg shadow-amber-400/30 transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span>Lanjut Belajar: Panca Indera</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('eksperimen');
              }}
              className="py-3 px-5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-heading font-bold text-sm border border-white/30 backdrop-blur-xs transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span>🧪 Lab Eksperimen (10 Uji)</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('tantangan');
              }}
              className="py-3 px-5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-heading font-bold text-sm shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span>📝 Bank Soal & Latihan</span>
            </button>
          </div>
        </div>

        {/* Faceless Mascot Avatar Right Anchor */}
        <div className="relative shrink-0 z-10">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 bg-sky-200">
            <img
              src={kikoImg}
              alt="Kiko Penjelajah Sains (Faceless)"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="absolute -bottom-2 -left-2 px-3 py-1 rounded-xl bg-white text-slate-800 text-xs font-bold shadow-md border border-slate-200">
            Kiko 🧭
          </div>
        </div>
      </div>

      {/* Gamification Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level & XP */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Level {profile.level}</span>
            <span className="text-sky-600 tabular-nums">{profile.xp} XP Total</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {150 - (profile.xp % 150)} XP lagi untuk Level {profile.level + 1}!
          </div>
        </div>

        {/* Streak Flame */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-500">
            <Flame className="w-6 h-6 fill-amber-500 animate-bounce" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Streak Belajar</div>
            <div className="text-xl font-extrabold text-slate-900 tabular-nums">
              {profile.streakDays} Hari Berturut-turut
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold">Aktif Hari Ini! 🔥</div>
          </div>
        </div>

        {/* Golden Stars */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-50 border border-yellow-200/60 flex items-center justify-center text-yellow-500">
            <Star className="w-6 h-6 fill-yellow-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Bintang Emas</div>
            <div className="text-xl font-extrabold text-slate-900 tabular-nums">
              {profile.stars} Bintang
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Bisa buka dunia baru</div>
          </div>
        </div>

        {/* Badges Count */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Lencana Diraih</div>
            <div className="text-xl font-extrabold text-slate-900 tabular-nums">
              {profile.badges.length} / 8 Lencana
            </div>
            <div className="text-[11px] text-indigo-600 font-semibold">Peneliti Cilik Aktif</div>
          </div>
        </div>
      </div>

      {/* Daily Mission Highlight (Section 4 requirement) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center text-2xl shadow-sm shrink-0">
            🌱
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Misi Hari Ini
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200 text-amber-900">
                +{activeMission.rewardXp} XP · +{activeMission.rewardStars} ⭐
              </span>
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">
              {activeMission.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              {activeMission.description}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onLaunchDailyMission(activeMission);
          }}
          className="py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-heading font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 shrink-0 inline-flex items-center justify-center gap-2"
        >
          <span>MULAI MISI</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3-Pillar Feature Strip: Praktek, Game, & Latihan Soal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Praktek Lab */}
        <div
          onClick={() => {
            sound.playClick();
            onNavigate('eksperimen');
          }}
          className="p-5 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2 rounded-2xl bg-white/20 backdrop-blur-xs">🧪</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                10 Lab Interaktif
              </span>
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              Praktek di Lab Virtual
            </h3>
            <p className="text-xs text-blue-100 font-medium leading-relaxed">
              Uji mengapung/tenggelam, es mencair, sirkuit listrik, siklus air, dan penguraian sampah 3R!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-blue-100 group-hover:text-white">
            <span>Buka Laboratorium</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Pillar 2: Game Arcade */}
        <div
          onClick={() => {
            sound.playClick();
            onNavigate('game');
          }}
          className="p-5 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2 rounded-2xl bg-white/20 backdrop-blur-xs">🎮</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                21 Mini Game
              </span>
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              Arcade Mini Game Sains
            </h3>
            <p className="text-xs text-amber-100 font-medium leading-relaxed">
              Drag & drop, pilah kategori, susun urutan metamorfosis & tata surya dengan panduan tutorial!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-amber-100 group-hover:text-white">
            <span>Mainkan Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Pillar 3: Bank Soal & Latihan */}
        <div
          onClick={() => {
            sound.playClick();
            onNavigate('tantangan');
          }}
          className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-3xl p-2 rounded-2xl bg-white/20 backdrop-blur-xs">📝</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                Bank Soal Lengkap
              </span>
            </div>
            <h3 className="font-heading font-bold text-lg text-white">
              Arena Latihan Soal SD
            </h3>
            <p className="text-xs text-emerald-100 font-medium leading-relaxed">
              Latihan ulangan harian, penilaian tengah semester, dan olimpiade cilik dengan pembahasan lengkap!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-emerald-100 group-hover:text-white">
            <span>Mulai Latihan Soal</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* World Map Explorer Cards (Preview of Unlocked Worlds) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Dunia Petualangan IPA
            </span>
            <h2 className="font-heading font-bold text-2xl text-slate-900">
              Pilih Wilayah Petualangan
            </h2>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onNavigate('dunia');
            }}
            className="text-xs font-bold text-sky-700 hover:text-sky-800 inline-flex items-center gap-1"
          >
            <span>Buka Peta Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {WORLDS_DATA.map((world) => {
            const isUnlocked = profile.stars >= world.requiredStars;
            return (
              <div
                key={world.id}
                className={`p-5 rounded-3xl border-2 flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-md'
                    : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{world.icon}</span>
                    {isUnlocked ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        Terbuka
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Butuh {world.requiredStars} ⭐
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Kelas {world.grade} SD
                    </span>
                    <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
                      {world.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                      {world.subtitle}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onSelectTopic(world.topics[0].id);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white font-heading font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Jelajahi Dunia</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="text-center text-[11px] font-semibold text-slate-400 py-1.5">
                      Terkunci (Kumpulkan Bintang)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
