/**
 * Grade Selector View (Pilih Kelas 1, 2, 3 SD)
 * Tailored learning paths and syllabus breakdown for elementary grades.
 */

import React from 'react';
import { GradeLevel, UserProfile } from '../../types';
import { CheckCircle2, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { sound } from '../../services/sound';

interface GradeSelectorViewProps {
  currentGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  onNavigateToTopic: (topicId: string) => void;
}

export const GradeSelectorView: React.FC<GradeSelectorViewProps> = ({
  currentGrade,
  onSelectGrade,
  onNavigateToTopic,
}) => {
  const grades = [
    {
      grade: 1 as GradeLevel,
      title: 'Kelas 1 SD',
      age: 'Usia 6–7 Tahun',
      badge: 'Fase Fondasi Indera & Benda',
      color: 'from-sky-500 to-blue-600',
      description: 'Mengenal diri dan lingkungan terdekat melalui pengamatan visual, sentuhan, dan suara ceria.',
      focusList: [
        'Tubuhku & 5 Panca Indera',
        'Kebersihan Diri & Gigi Sehat',
        'Benda di Sekitarku (Halus & Kasar)',
        'Siang, Malam, & Cuaca Cerah',
      ],
      featuredTopicId: 'panca-indera',
      featuredTopicLabel: 'Panca Indera',
    },
    {
      grade: 2 as GradeLevel,
      title: 'Kelas 2 SD',
      age: 'Usia 7–8 Tahun',
      badge: 'Fase Klasifikasi & Eksperimen',
      color: 'from-emerald-500 to-teal-600',
      description: 'Mulai mengelompokkan benda, meneliti pertumbuhan makhluk hidup, dan menyelidiki wujud zat.',
      focusList: [
        'Wujud Benda: Padat, Cair, & Gas',
        'Kebutuhan Tumbuhan & Hewan',
        'Perubahan Suhu & Es Mencair',
        'Sumber Cahaya & Bayangan',
      ],
      featuredTopicId: 'wujud-benda',
      featuredTopicLabel: 'Padat, Cair, & Gas',
    },
    {
      grade: 3 as GradeLevel,
      title: 'Kelas 3 SD',
      age: 'Usia 8–9 Tahun',
      badge: 'Fase Siklus & Analisis Sains',
      color: 'from-amber-500 to-orange-600',
      description: 'Meneliti siklus metamorfosis, gaya dorong magnet, dan menjaga ekosistem bumi tercinta.',
      focusList: [
        'Siklus Hidup Metamorfosis Hewan',
        'Kekuatan Gaya Tarik Magnet',
        'Organ Tubuh Sederhana & Pernapasan',
        'Pelestarian Alam & Lingkungan',
      ],
      featuredTopicId: 'siklus-kupu',
      featuredTopicLabel: 'Siklus Metamorfosis',
    },
  ];

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-6 space-y-6">
      {/* Header */}
      <div className="w-full space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
          Jenjang Belajar Sains SD
        </span>
        <h1 className="font-heading font-bold text-3xl text-slate-900">
          Pilih Kelas IPA Kamu
        </h1>
        <p className="text-sm text-slate-600">
          Setiap kelas dirancang khusus sesuai tahap perkembangan anak dengan bahasa ramah dan interaksi seru.
        </p>
      </div>

      {/* Grade Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {grades.map((item) => {
          const isCurrent = currentGrade === item.grade;
          return (
            <div
              key={item.grade}
              className={`rounded-3xl p-6 sm:p-7 border-2 flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'bg-white border-sky-500 shadow-xl ring-4 ring-sky-200/50 scale-102'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className="space-y-4">
                {/* Grade Badge Header */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                    {item.age}
                  </span>
                  {isCurrent && (
                    <span className="text-xs font-bold text-sky-700 flex items-center gap-1 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Kelas Aktif
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="font-heading font-bold text-2xl text-slate-900">
                    {item.title}
                  </h2>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    {item.badge}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.description}
                </p>

                {/* Focus curriculum list */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Materi Inti:
                  </span>
                  {item.focusList.map((focus, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <span className="text-sky-500 font-bold">✓</span>
                      <span>{focus}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                {isCurrent ? (
                  <button
                    onClick={() => {
                      sound.playSuccess();
                      onNavigateToTopic(item.featuredTopicId);
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-heading font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Buka Materi: {item.featuredTopicLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sound.playPop();
                      onSelectGrade(item.grade);
                    }}
                    className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-heading font-bold text-xs border border-slate-200 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Pilih Jenjang Ini</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
