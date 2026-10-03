/**
 * Child Profile View
 * Avatar customizer, student name, current level, XP, and streaks.
 */

import React, { useState } from 'react';
import { UserProfile, GradeLevel } from '../../types';
import { BADGES_DATA } from '../../data/scienceContent';
import { sound } from '../../services/sound';
import { Star, Flame, Award, Check, User, Sparkles } from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdateProfile }) => {
  const [nameInput, setNameInput] = useState<string>(profile.name);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  const avatarOptions = ['🚀', '🔬', '🧭', '🌱', '🪐', '⚡', '🧪', '💎', '🌟', '🔭'];

  const handleSelectAvatar = (avatar: string) => {
    sound.playPop();
    onUpdateProfile({ avatar });
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    sound.playSuccess();
    onUpdateProfile({ name: nameInput.trim() });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-6 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Main Avatar Circle */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-sky-400 to-indigo-500 border-4 border-white shadow-xl flex items-center justify-center text-5xl">
            {profile.avatar}
          </div>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-900 font-bold text-xs shadow-xs border border-white">
            Lv. {profile.level}
          </span>
        </div>

        {/* Profile Info & Form */}
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Profil Penjelajah Sains
            </span>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
              {profile.name}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Siswa Kelas {profile.grade} SD · Petualang IPA Aktif
            </p>
          </div>

          {/* Edit Name Form */}
          <form onSubmit={handleSaveName} className="flex max-w-sm gap-2 mx-auto sm:mx-0">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Ganti Nama Kamu"
              className="flex-1 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-heading font-bold text-xs shadow-xs transition-all active:scale-95"
            >
              Simpan
            </button>
          </form>

          {savedFeedback && (
            <div className="text-xs font-bold text-emerald-600">
              ✓ Nama berhasil diperbarui!
            </div>
          )}
        </div>
      </div>

      {/* Avatar Picker */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
        <h2 className="font-heading font-bold text-lg text-slate-900">
          Pilih Karakter Avatar Kamu
        </h2>
        <div className="flex flex-wrap gap-3">
          {avatarOptions.map((av) => {
            const isSelected = profile.avatar === av;
            return (
              <button
                key={av}
                onClick={() => handleSelectAvatar(av)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-2 transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50 ring-4 ring-sky-200 scale-110 shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:bg-white hover:scale-105'
                }`}
              >
                {av}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gamification Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center space-y-1">
          <div className="text-xs font-bold text-slate-500">Total XP</div>
          <div className="text-2xl font-extrabold text-sky-700 tabular-nums">{profile.xp}</div>
          <span className="text-[10px] text-slate-400 font-medium">Poin Petualangan</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center space-y-1">
          <div className="text-xs font-bold text-slate-500">Bintang Emas</div>
          <div className="text-2xl font-extrabold text-amber-500 tabular-nums">{profile.stars}</div>
          <span className="text-[10px] text-slate-400 font-medium">Koleksi Bintang</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center space-y-1">
          <div className="text-xs font-bold text-slate-500">Streak Hari</div>
          <div className="text-2xl font-extrabold text-orange-600 tabular-nums">
            {profile.streakDays} Hari
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Konsistensi Belajar</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center space-y-1">
          <div className="text-xs font-bold text-slate-500">Lencana</div>
          <div className="text-2xl font-extrabold text-purple-600 tabular-nums">
            {BADGES_DATA.length}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">Semua Terbuka 100%</span>
        </div>
      </div>

      {/* Badges Showcase in Profile */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-heading font-bold text-xl text-slate-900">
              Koleksi Lencana Peneliti (Semua Terbuka)
            </h2>
            <p className="text-xs text-slate-500">
              Semua penghargaan dan gelar sains telah terbuka untuk kamu jelajahi dengan bebas!
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> Akses Penuh Tanpa Kunci
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES_DATA.map((badge) => (
            <div
              key={badge.id}
              className="p-3.5 rounded-2xl border border-amber-200/80 bg-amber-50/40 text-center flex flex-col items-center justify-between hover:bg-amber-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-2xl shadow-2xs mb-2">
                {badge.icon}
              </div>
              <h3 className="font-heading font-bold text-xs text-slate-900 leading-snug">
                {badge.title}
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                {badge.description}
              </p>
              <span className="mt-2 text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-3 h-3" /> Terbuka
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
