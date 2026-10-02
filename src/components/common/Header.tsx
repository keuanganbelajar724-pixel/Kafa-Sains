/**
 * Top Navigation Bar conforming to the clean Top Bar Contract:
 * Zone 1: Single Brand element
 * Zone 2: Clean navigation links
 * Zone 3: Actions (Sound toggle, Parent Dashboard, Child Stats)
 */

import React from 'react';
import { Volume2, VolumeX, Shield, Sparkles, Flame, Star } from 'lucide-react';
import { NavigationTab, UserProfile } from '../../types';
import { sound } from '../../services/sound';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  profile: UserProfile;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onOpenParentDashboard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  profile,
  isSoundEnabled,
  onToggleSound,
  onOpenParentDashboard,
}) => {
  const navLinks: { id: NavigationTab; label: string }[] = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'kelas', label: 'Pilih Kelas' },
    { id: 'dunia', label: 'Dunia Belajar' },
    { id: 'eksperimen', label: 'Eksperimen' },
    { id: 'game', label: 'Game' },
    { id: 'tantangan', label: 'Tantangan' },
    { id: 'koleksi', label: 'Koleksi' },
    { id: 'progres', label: 'Progres' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs w-full">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('beranda');
          }}
          className="flex items-center gap-2.5 text-left focus:outline-hidden group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-xl">🚀</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg text-slate-900 tracking-tight leading-none group-hover:text-sky-600 transition-colors">
              Jelajah Dunia IPA
            </span>
            <span className="text-[11px] font-medium text-slate-500 leading-tight">
              Sains SD Kelas {profile.grade}
            </span>
          </div>
        </button>

        {/* Zone 2: Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  sound.playClick();
                  onSelectTab(link.id);
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all text-xs font-semibold ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 shadow-xs border border-sky-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Gamified Stats & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Streak indicator */}
          <div
            title="Streak Belajar Harian"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60 text-xs font-bold tabular-nums"
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{profile.streakDays} Hari</span>
          </div>

          {/* Stars */}
          <div
            title="Bintang Terkumpul"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200/60 text-xs font-bold tabular-nums"
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
            <span>{profile.stars}</span>
          </div>

          {/* XP & Level chip */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('profil');
            }}
            title="Level & XP Profil"
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-800 border border-slate-200/80 transition-all text-xs font-semibold"
          >
            <span className="text-base">{profile.avatar}</span>
            <div className="text-left hidden md:block">
              <div className="text-[10px] text-slate-500 leading-none">Level {profile.level}</div>
              <div className="text-xs font-bold text-sky-700 tabular-nums">{profile.xp} XP</div>
            </div>
          </button>

          {/* Audio toggle button */}
          <button
            onClick={onToggleSound}
            title={isSoundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            className={`p-2 rounded-lg border transition-all ${
              isSoundEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Parent/Teacher Dashboard button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenParentDashboard();
            }}
            title="Menu Guru & Orang Tua"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs font-semibold transition-all whitespace-nowrap"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Orang Tua/Guru</span>
          </button>
        </div>
      </div>

      {/* Mobile secondary navigation pill bar */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto no-scrollbar border-t border-slate-100 bg-white">
        {navLinks.map((link) => {
          const isActive = currentTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => {
                sound.playClick();
                onSelectTab(link.id);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              {link.label}
            </button>
          );
        })}
        <button
          onClick={() => {
            sound.playClick();
            onOpenParentDashboard();
          }}
          className="px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap text-indigo-700 bg-indigo-50 border border-indigo-100"
        >
          Orang Tua/Guru
        </button>
      </div>
    </header>
  );
};
