/**
 * Parent & Teacher Dashboard
 * Comprehensive pedagogical view for parents and educators to monitor child progress,
 * learning time, conceptual masteries, and actionable suggestions.
 */

import React from 'react';
import { UserProfile } from '../../types';
import {
  X,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Award,
  BookOpen,
  BarChart3,
  RotateCcw,
} from 'lucide-react';
import { sound } from '../../services/sound';

interface ParentTeacherDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onResetProgress: () => void;
}

export const ParentTeacherDashboard: React.FC<ParentTeacherDashboardProps> = ({
  isOpen,
  onClose,
  profile,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  const topicsMastery = [
    { title: 'Panca Indera Manusia', score: 92, status: 'Menguasai Sangat Baik' },
    { title: 'Wujud Benda (Padat, Cair, Gas)', score: 85, status: 'Menguasai Baik' },
    { title: 'Sifat Benda: Mengapung & Tenggelam', score: 88, status: 'Menguasai Baik' },
    { title: 'Kebutuhan Tumbuhan (Air & Cahaya)', score: 78, status: 'Perlu Latihan Ekstra' },
    { title: 'Siklus Hidup Metamorfosis Kupu-Kupu', score: 80, status: 'Menguasai Baik' },
    { title: 'Cahaya & Bayangan', score: 74, status: 'Perlu Pendampingan' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        {/* Modal Top Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-700">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Mode Khusus Guru & Orang Tua
              </span>
              <h2 className="font-heading font-bold text-2xl text-slate-900">
                Dashboard Evaluasi Belajar Anak
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Snapshot Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Nama Siswa:</div>
            <div className="text-base font-bold text-slate-900">
              {profile.name} (Kelas {profile.grade} SD)
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-semibold">Estimasi Waktu Belajar:</div>
            <div className="text-base font-bold text-sky-700 tabular-nums">
              {profile.timeSpentMinutes} Menit Aktif
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-semibold">Tingkat Konsistensi:</div>
            <div className="text-base font-bold text-amber-600 tabular-nums">
              Streak {profile.streakDays} Hari
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-semibold">Total Level & XP:</div>
            <div className="text-base font-bold text-purple-700 tabular-nums">
              Level {profile.level} · {profile.xp} XP
            </div>
          </div>
        </div>

        {/* Conceptual Mastery Matrix */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Capaian Pemahaman Topik IPA
            </h3>
            <span className="text-xs text-slate-500 font-medium">Berdasarkan hasil eksplorasi & kuis</span>
          </div>

          <div className="space-y-2.5">
            {topicsMastery.map((topic, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">{topic.title}</span>
                    <span className="text-sky-700 tabular-nums">{topic.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        topic.score >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${topic.score}%` }}
                    />
                  </div>
                </div>

                <div className="sm:w-44 text-right">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md inline-block ${
                      topic.score >= 85
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {topic.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pedagogical Guidance for Parents/Teachers */}
        <div className="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-100 space-y-2 text-indigo-950">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
            <Lightbulb className="w-4 h-4 text-indigo-600" />
            <span>Saran Pembelajaran Nyata di Rumah:</span>
          </div>
          <ul className="text-xs space-y-1.5 list-disc pl-4 text-slate-700 font-medium leading-relaxed">
            <li>
              Ajak anak menutup mata di rumah, lalu minta mereka menebak benda hanya dari aroma atau rabaan tangan (memperkuat konsep <strong>Panca Indera</strong>).
            </li>
            <li>
              Di dapur, tunjukkan es batu yang meleleh dan uap ceret air panas untuk menghubungkan konsep <strong>Wujud Benda Padat, Cair, dan Gas</strong> secara langsung.
            </li>
            <li>
              Gunakan senter hp di malam hari sebelum tidur untuk bermain wayang bayangan di dinding kamar tidur (memperkuat pemahaman materi <strong>Bayangan</strong>).
            </li>
          </ul>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              if (window.confirm('Apakah Anda yakin ingin menyetel ulang kemajuan belajar anak?')) {
                onResetProgress();
                onClose();
              }
            }}
            className="text-xs text-rose-600 hover:text-rose-700 font-bold inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Kemajuan</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="py-2.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Tutup Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
