/**
 * Progress & Learning Analytics View
 * Visual indicators for Understanding, Exploration, Accuracy, Completion, and Consistency.
 */

import React from 'react';
import { UserProfile } from '../../types';
import { BADGES_DATA, WORLDS_DATA } from '../../data/scienceContent';
import {
  Trophy,
  Award,
  BookOpen,
  Gamepad2,
  FlaskConical,
  Flame,
  CheckCircle2,
  Star,
} from 'lucide-react';

interface ProgressAnalyticsViewProps {
  profile: UserProfile;
}

export const ProgressAnalyticsView: React.FC<ProgressAnalyticsViewProps> = ({ profile }) => {
  // Assessment Multi-indicators (Section 22)
  const understandingRate = Math.min(100, 75 + profile.completedLessons.length * 8);
  const explorationRate = Math.min(100, 70 + profile.explorationCount * 5);
  const accuracyRate = 88;
  const completionRate = Math.min(
    100,
    Math.round(
      ((profile.completedLessons.length +
        profile.completedGames.length +
        profile.completedExperiments.length) /
        14) *
        100
    )
  );

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-6 space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
          Statistik Prestasi Anak
        </span>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
          Laporan Kemajuan Sains
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Pantau pencapaian belajar IPA, lencana yang sudah terbuka, dan konsistensi streak belajarmu!
        </p>
      </div>

      {/* Multi-indicator Assessment Matrix (Section 22) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Pemahaman Konsep</span>
            <span className="text-sky-600 tabular-nums">{understandingRate}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-500"
              style={{ width: `${understandingRate}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Sangat Baik</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Daya Eksplorasi</span>
            <span className="text-emerald-600 tabular-nums">{explorationRate}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${explorationRate}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Aktif Menyentuh & Menguji</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Ketepatan Kuis</span>
            <span className="text-amber-600 tabular-nums">{accuracyRate}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${accuracyRate}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Konsisten Teliti</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Penyelesaian Misi</span>
            <span className="text-indigo-600 tabular-nums">{completionRate}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Terus Berkembang</div>
        </div>
      </div>

      {/* Summary Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Materi Tuntas</div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {profile.completedLessons.length} Pelajaran
            </div>
            <div className="text-xs text-sky-600 font-semibold">Panca Indera & Benda</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Gamepad2 className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Game Dimainkan</div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {profile.completedGames.length} Permainan
            </div>
            <div className="text-xs text-purple-600 font-semibold">Sortir, Drag, & Memori</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <FlaskConical className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500">Eksperimen Lab</div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {profile.completedExperiments.length} Simulasi
            </div>
            <div className="text-xs text-emerald-600 font-semibold">Uji Apung & Suhu Es</div>
          </div>
        </div>
      </div>

      {/* Badges Showcase Gallery */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-xl text-slate-900">
              Galeri Lencana Sains Terbuka
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Setiap capaian belajar memberikan tanda kehormatan peneliti cilik.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{BADGES_DATA.length} / {BADGES_DATA.length} Semua Terbuka (100%)</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {BADGES_DATA.map((badge) => {
            const isEarned = true; // All unlocked and accessible
            return (
              <div
                key={badge.id}
                className="p-4 rounded-3xl border-2 text-center flex flex-col items-center justify-between transition-all bg-white border-amber-300 shadow-xs hover:shadow-md"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl mb-2 shadow-2xs">
                  {badge.icon}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-slate-900">
                    {badge.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                    {badge.description}
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-bold">
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terbuka & Diraih
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
