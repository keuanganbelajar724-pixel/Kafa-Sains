/**
 * Virtual Science Lab Engine
 * Interactive experiments:
 * 1. Mengapung & Tenggelam (Buoyancy Tank)
 * 2. Es Mencair & Perubahan Suhu (Thermodynamics)
 * 3. Kebutuhan Tanaman (Photosynthesis / Water & Sunlight)
 * 4. Bayangan & Senter (Light & Shadow optics)
 * 5. Getaran Suara (Acoustics & Senses)
 * 6. Tarikan Magnet (Magnetism)
 */

import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Droplets,
  Flame,
  Sun,
  Lightbulb,
  Bell,
  Magnet,
  ArrowRight,
  Info,
  Zap,
  CloudRain,
  Globe,
  Recycle,
  Power,
} from 'lucide-react';
import { EXPERIMENTS_DATA } from '../../data/scienceContent';
import { sound } from '../../services/sound';
import labRoomImg from '../../assets/images/virtual_lab_room_1790868007229.jpg';

interface VirtualLabViewProps {
  initialExpId?: string | null;
  completedExpIds: string[];
  onCompleteExperiment: (expId: string, rewardXp: number, badgeId?: string) => void;
}

export const VirtualLabView: React.FC<VirtualLabViewProps> = ({
  initialExpId,
  completedExpIds,
  onCompleteExperiment,
}) => {
  const [selectedExpId, setSelectedExpId] = useState<string>(initialExpId || 'exp-apung-tenggelam');

  // ============================================
  // LAB 1: MENGAPUNG & TENGGELAM STATE
  // ============================================
  const buoyancyObjects = [
    { id: 'batu', name: 'Batu Kerikil', icon: '🪨', floats: false, density: 'Tinggi', desc: 'Batu padat dan lebih berat dari volume air yang dipindahkan.' },
    { id: 'kayu', name: 'Balok Kayu', icon: '🪵', floats: true, density: 'Rendah', desc: 'Kayu berpori ringan dan massa jenisnya lebih kecil dari air.' },
    { id: 'koin', name: 'Koin Besi Logam', icon: '🪙', floats: false, density: 'Tinggi', desc: 'Besi padat tenggelam langsung ke dasar wadah air.' },
    { id: 'apel', name: 'Buah Apel', icon: '🍎', floats: true, density: 'Rendah', desc: 'Apel memiliki rongga udara kecil di dalamnya sehingga mengapung!' },
    { id: 'bebek', name: 'Bebek Karet', icon: '🦆', floats: true, density: 'Rendah', desc: 'Bebek mainan berisi udara di dalamnya dan mengapung ceria.' },
    { id: 'daun', name: 'Daun Hijau', icon: '🍃', floats: true, density: 'Rendah', desc: 'Daun sangat ringan dan tertopang oleh tegangan permukaan air.' },
  ];
  const [tankItems, setTankItems] = useState<string[]>([]);
  const [waterType, setWaterType] = useState<'tawar' | 'garam'>('tawar');

  const handleDropInTank = (objId: string) => {
    if (tankItems.includes(objId)) return;
    sound.playWaterSplash();
    setTankItems((prev) => [...prev, objId]);
  };

  const handleResetTank = () => {
    sound.playClick();
    setTankItems([]);
  };

  // ============================================
  // LAB 2: ES MENCAIR & PERUBAHAN WUJUD
  // ============================================
  const [tempCelsius, setTempCelsius] = useState<number>(0);
  const handleTempChange = (val: number) => {
    setTempCelsius(val);
    if (val > 100) {
      sound.playSparkle();
    }
  };

  // ============================================
  // LAB 3: KEBUTUHAN TUMBUHAN
  // ============================================
  const [plantSunlight, setPlantSunlight] = useState<boolean>(true);
  const [plantWatered, setPlantWatered] = useState<boolean>(true);

  // ============================================
  // LAB 4: BAYANGAN & SENTER
  // ============================================
  const [flashlightDistance, setFlashlightDistance] = useState<number>(50); // 10 to 90

  // ============================================
  // LAB 5: SUARA & GETARAN
  // ============================================
  const [soundVibrating, setSoundVibrating] = useState<boolean>(false);
  const [soundPitch, setSoundPitch] = useState<'rendah' | 'sedang' | 'tinggi'>('sedang');
  const triggerSoundWave = (pitch: 'rendah' | 'sedang' | 'tinggi') => {
    setSoundPitch(pitch);
    setSoundVibrating(true);
    sound.playSparkle();
    setTimeout(() => setSoundVibrating(false), 2000);
  };

  // ============================================
  // LAB 6: DAYA TARIK MAGNET
  // ============================================
  const magnetItems = [
    { id: 'paku', name: 'Paku Besi', icon: '🔩', magnetic: true },
    { id: 'klip', name: 'Klip Kertas Logam', icon: '📎', magnetic: true },
    { id: 'sendok_plastik', name: 'Sendok Plastik', icon: '🥄', magnetic: false },
    { id: 'penghapus', name: 'Penghapus Karet', icon: '🧼', magnetic: false },
    { id: 'daun_kering', name: 'Daun Kering', icon: '🍂', magnetic: false },
  ];
  const [magnetPosition, setMagnetPosition] = useState<'jauh' | 'dekat'>('jauh');
  const handleToggleMagnet = () => {
    sound.playPop();
    setMagnetPosition((prev) => (prev === 'jauh' ? 'dekat' : 'jauh'));
  };

  // ============================================
  // LAB 7: RANGKAIAN LISTRIK STATE
  // ============================================
  const [circuitSwitchClosed, setCircuitSwitchClosed] = useState<boolean>(true);
  const [circuitMaterial, setCircuitMaterial] = useState<string>('tembaga');
  const circuitMaterials = [
    { id: 'tembaga', name: 'Kawat Tembaga', icon: '🧵', type: 'konduktor', isConductive: true, glow: 'terang', desc: 'Logam lentur penghantar listrik super baik!' },
    { id: 'paku', name: 'Paku Besi', icon: '🔩', type: 'konduktor', isConductive: true, glow: 'terang', desc: 'Besi padat mengalirkan elektron dengan lancar.' },
    { id: 'grafit', name: 'Isi Pensil Grafit', icon: '✏️', type: 'semikonduktor', isConductive: true, glow: 'redup', desc: 'Grafit karbon menghantar listrik sedang (bohlam redup).' },
    { id: 'karet', name: 'Karet Gelang', icon: '🎗️', type: 'isolator', isConductive: false, glow: 'mati', desc: 'Isolator kuat, menahan arus (bohlam padam).' },
    { id: 'plastik', name: 'Penggaris Plastik', icon: '📐', type: 'isolator', isConductive: false, glow: 'mati', desc: 'Bahan plastik menahan arus listrik.' },
  ];

  // ============================================
  // LAB 8: SIKLUS AIR STATE
  // ============================================
  const [waterCycleHeat, setWaterCycleHeat] = useState<'mati' | 'hangat' | 'panas'>('hangat');
  const [waterCycleStage, setWaterCycleStage] = useState<number>(2); // 1 = Evaporasi, 2 = Kondensasi, 3 = Presipitasi

  // ============================================
  // LAB 9: SIANG & MALAM BUMI BERPUTAR
  // ============================================
  const [earthAngle, setEarthAngle] = useState<number>(90); // 0 to 360

  // ============================================
  // LAB 10: PENGURAIAN SAMPAH 3R
  // ============================================
  const [decayDays, setDecayDays] = useState<number>(30); // 0, 30, 90, 365
  const wastePots = [
    { id: 'apel', name: 'Kulit Apel & Pisang', icon: '🍎', category: 'Organik', decayRate: 'Cepat membusuk', color: 'text-emerald-400' },
    { id: 'daun', name: 'Dedaunan Kering', icon: '🍂', category: 'Organik', decayRate: 'Cepat membusuk', color: 'text-amber-400' },
    { id: 'botol', name: 'Botol Minum Plastik', icon: '🧴', category: 'Anorganik', decayRate: 'Tetap utuh (450 tahun)', color: 'text-sky-400' },
    { id: 'kresek', name: 'Kantong Kresek Plastik', icon: '🛍️', category: 'Anorganik', decayRate: 'Tetap utuh (100 tahun)', color: 'text-rose-400' },
  ];

  const currentExp = EXPERIMENTS_DATA.find((e) => e.id === selectedExpId) || EXPERIMENTS_DATA[0];
  const isExpCompleted = completedExpIds.includes(currentExp.id);

  const handleFinishExperiment = () => {
    sound.playFanfare();
    onCompleteExperiment(currentExp.id, 100, currentExp.badgeRewardId);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-6 space-y-6">
      {/* Lab Header Hero with Generated Lab Visual */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-lg min-h-[140px] flex items-center">
        <img
          src={labRoomImg}
          alt="Laboratorium Virtual IPA"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Laboratorium Virtual Sains
              </span>
            </div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white">
              Mini Lab Sains Cilik
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Coba langsung berbagai fenomena alam secara interaktif: uji apung benda, lelehkan es dengan api, atur bayangan, dan buktikan getaran suara!
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs text-xs font-bold border border-white/15">
              🧪 6 Simulasi Eksperimen
            </span>
          </div>
        </div>
      </div>

      {/* Experiment Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {EXPERIMENTS_DATA.map((exp) => {
          const isSelected = selectedExpId === exp.id;
          const isDone = completedExpIds.includes(exp.id);
          return (
            <button
              key={exp.id}
              onClick={() => {
                sound.playClick();
                setSelectedExpId(exp.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-300'
                  : 'bg-white text-slate-700 hover:bg-sky-50 border border-slate-200'
              }`}
            >
              <span>{exp.icon}</span>
              <span>{exp.title}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
            </button>
          );
        })}
      </div>

      {/* Main Active Experiment Interactive Stage */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        {/* Experiment Objective Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 block">
              Kelas {currentExp.grade} SD · {currentExp.category}
            </span>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-900">
              {currentExp.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              🎯 Tujuan: {currentExp.goal}
            </p>
          </div>

          <button
            onClick={handleFinishExperiment}
            className="py-2.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs shadow-md transition-all active:scale-95 inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Tandai Selesai & Klaim XP</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {/* ==================================================== */}
        {/* 1. MENGAPUNG ATAU TENGGELAM                          */}
        {/* ==================================================== */}
        {selectedExpId === 'exp-apung-tenggelam' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Simulation Tank */}
              <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-between min-h-[360px] text-white">
                <div className="w-full flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                      Bejana Air Transparan ({waterType === 'tawar' ? 'Air Tawar' : 'Air Garam'})
                    </span>
                  </div>
                  <button
                    onClick={handleResetTank}
                    className="text-[11px] font-bold bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg text-slate-300 inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Kosongkan Bejana</span>
                  </button>
                </div>

                {/* Water Graphic Container */}
                <div className="w-full max-w-md h-60 rounded-2xl border-2 border-sky-400/50 bg-gradient-to-b from-sky-400/20 via-sky-500/30 to-blue-600/40 relative overflow-hidden flex flex-col justify-between p-3 mt-4">
                  {/* Floating Surface Zone */}
                  <div className="w-full border-b-2 border-dashed border-sky-300/40 pb-2 flex flex-wrap gap-3 items-center justify-center min-h-[60px]">
                    <span className="absolute top-1 left-2 text-[10px] text-sky-200 font-semibold">
                      Permukaan (Mengapung)
                    </span>
                    {tankItems.map((id) => {
                      const obj = buoyancyObjects.find((b) => b.id === id);
                      if (obj && obj.floats) {
                        return (
                          <div
                            key={id}
                            className="flex flex-col items-center animate-bounce"
                            style={{ animationDuration: '2s' }}
                          >
                            <span className="text-3xl">{obj.icon}</span>
                            <span className="text-[10px] font-bold text-sky-100">{obj.name}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Sinking Floor Zone */}
                  <div className="w-full border-t border-sky-300/30 pt-2 flex flex-wrap gap-3 items-center justify-center min-h-[60px]">
                    <span className="absolute bottom-1 left-2 text-[10px] text-sky-300/60 font-semibold">
                      Dasar Bejana (Tenggelam)
                    </span>
                    {tankItems.map((id) => {
                      const obj = buoyancyObjects.find((b) => b.id === id);
                      if (obj && !obj.floats) {
                        return (
                          <div key={id} className="flex flex-col items-center">
                            <span className="text-3xl">{obj.icon}</span>
                            <span className="text-[10px] font-bold text-slate-300">{obj.name}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                <div className="text-[11px] text-sky-200 mt-3 text-center">
                  💡 Ketuk benda di panel kanan untuk mencelupkannya ke dalam air!
                </div>
              </div>

              {/* Controls & Object Tray */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Pilih Benda untuk Dicelupkan:
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {buoyancyObjects.map((obj) => {
                      const isTested = tankItems.includes(obj.id);
                      return (
                        <button
                          key={obj.id}
                          onClick={() => handleDropInTank(obj.id)}
                          disabled={isTested}
                          className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all ${
                            isTested
                              ? 'bg-emerald-50 border-emerald-300 opacity-60 cursor-default'
                              : 'bg-white border-slate-200 hover:border-sky-400 hover:shadow-xs active:scale-95'
                          }`}
                        >
                          <span className="text-2xl">{obj.icon}</span>
                          <div>
                            <div className="font-heading font-bold text-xs text-slate-900 leading-snug">
                              {obj.name}
                            </div>
                            <span className="text-[10px] text-slate-500">
                              {isTested ? '✓ Di dalam air' : 'Celupkan'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation Card */}
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-sky-950 text-xs space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-sky-600" />
                    <span>Kenapa ada benda yang mengapung dan tenggelam?</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    Benda yang memiliki berat lebih ringan dibanding volume air yang digantikannya (seperti apel, kayu, bebek karet) akan <strong>mengapung</strong>. Sedangkan benda yang padat dan berat seperti batu dan besi akan <strong>tenggelam</strong>!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 2. ES MENCAIR & PERUBAHAN WUJUD                     */}
        {/* ==================================================== */}
        {selectedExpId === 'exp-wujud-suhu' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Simulation Chamber */}
              <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 min-h-[340px] text-white flex flex-col justify-between items-center relative overflow-hidden">
                <div className="w-full flex items-center justify-between z-10 border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Ruang Uji Termodinamika
                  </span>
                  <div className="px-3 py-1 rounded-xl bg-slate-800 text-xs font-mono font-bold text-amber-300 tabular-nums">
                    Suhu: {tempCelsius}°C
                  </div>
                </div>

                {/* Center Phase Transformation View */}
                <div className="py-8 flex flex-col items-center justify-center relative">
                  {tempCelsius < 0 && (
                    <div className="flex flex-col items-center animate-pulse">
                      <span className="text-7xl">🧊</span>
                      <span className="text-base font-bold text-sky-300 mt-2">Es Padat Beku</span>
                      <span className="text-xs text-slate-400 mt-1">Partikel tersusun rapat & tidak bergerak bebas</span>
                    </div>
                  )}

                  {tempCelsius >= 0 && tempCelsius < 100 && (
                    <div className="flex flex-col items-center">
                      <span className="text-7xl">💧</span>
                      <span className="text-base font-bold text-blue-300 mt-2">Air Cair Mengalir</span>
                      <span className="text-xs text-slate-400 mt-1">Partikel mulai bebas mengalir mengikuti wadah</span>
                    </div>
                  )}

                  {tempCelsius >= 100 && (
                    <div className="flex flex-col items-center animate-bounce">
                      <span className="text-7xl">💨</span>
                      <span className="text-base font-bold text-yellow-300 mt-2">Uap Air Gas Menguap</span>
                      <span className="text-xs text-slate-400 mt-1">Air mendidih dan berubah menjadi gas terbang ke udara!</span>
                    </div>
                  )}
                </div>

                {/* Bottom Status text */}
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Flame className={`w-4 h-4 ${tempCelsius > 30 ? 'text-amber-500 animate-bounce' : 'text-slate-500'}`} />
                  <span>
                    Status Wujud:{' '}
                    {tempCelsius < 0 ? 'PADAT (Es)' : tempCelsius < 100 ? 'CAIR (Air)' : 'GAS (Uap Mendidih)'}
                  </span>
                </div>
              </div>

              {/* Heater Controls */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Kontrol Kompor Pemanas:
                  </span>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-sky-600">-10°C (Dingin Beku)</span>
                      <span className="text-amber-600">110°C (Mendidih)</span>
                    </div>
                    <input
                      type="range"
                      min="-10"
                      max="110"
                      value={tempCelsius}
                      onChange={(e) => handleTempChange(Number(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTempChange(-5)}
                      className="flex-1 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold"
                    >
                      🧊 Bekukan (-5°C)
                    </button>
                    <button
                      onClick={() => handleTempChange(30)}
                      className="flex-1 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-bold"
                    >
                      💧 Suhu Ruang (30°C)
                    </button>
                    <button
                      onClick={() => handleTempChange(105)}
                      className="flex-1 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold"
                    >
                      🔥 Didihkan (105°C)
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1">
                  <span className="font-bold">Fakta Perubahan Wujud:</span>
                  <p className="leading-relaxed">
                    Suhu panas memberi energi sehingga es padat <strong>mencair</strong> menjadi air. Jika terus dipanaskan hingga 100°C, air akan <strong>menguap</strong> menjadi gas!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 3. KEBUTUHAN TUMBUHAN                                */}
        {/* ==================================================== */}
        {selectedExpId === 'exp-tumbuhan-cahaya' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Plant Nursery Chamber */}
              <div
                className={`lg:col-span-7 rounded-3xl p-6 min-h-[340px] text-white flex flex-col justify-between items-center relative overflow-hidden transition-colors ${
                  plantSunlight ? 'bg-gradient-to-b from-sky-400 to-emerald-700' : 'bg-slate-900'
                }`}
              >
                <div className="w-full flex items-center justify-between z-10">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Kebun Uji Tanaman
                  </span>
                  <div className="text-xs font-bold">
                    {plantSunlight ? '☀️ Terpapar Cahaya' : '🌑 Tempat Gelap'}
                  </div>
                </div>

                {/* Plant Visual State */}
                <div className="py-6 flex flex-col items-center">
                  <div className="text-7xl sm:text-8xl transition-transform">
                    {plantSunlight && plantWatered && '🌻'}
                    {plantSunlight && !plantWatered && '🥀'}
                    {!plantSunlight && plantWatered && '🌱'}
                    {!plantSunlight && !plantWatered && '🍂'}
                  </div>
                  <div className="mt-3 text-center">
                    <span className="font-heading font-bold text-lg text-white">
                      {plantSunlight && plantWatered && 'Tumbuh Segar & Berbunga Cantik!'}
                      {plantSunlight && !plantWatered && 'Tanaman Kekurangan Air (Layu)!'}
                      {!plantSunlight && plantWatered && 'Pucat & Lemah Karena Tanpa Cahaya'}
                      {!plantSunlight && !plantWatered && 'Kering & Gugur'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-white/90 font-medium">
                  {plantSunlight && plantWatered
                    ? '✓ Tumbuhan melakukan fotosintesis sempurna!'
                    : 'Coba nyalakan cahaya dan siram tanaman di samping!'}
                </div>
              </div>

              {/* Plant Controls */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Atur Kondisi Lingkungan:
                  </span>

                  {/* Sun Switch */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Sun className={`w-5 h-5 ${plantSunlight ? 'text-amber-500' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold text-slate-800">Sinar Matahari</span>
                    </div>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setPlantSunlight(!plantSunlight);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        plantSunlight ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {plantSunlight ? 'ON (Terang)' : 'OFF (Gelap)'}
                    </button>
                  </div>

                  {/* Water Switch */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Droplets className={`w-5 h-5 ${plantWatered ? 'text-blue-500' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold text-slate-800">Siraman Air</span>
                    </div>
                    <button
                      onClick={() => {
                        sound.playWaterSplash();
                        setPlantWatered(!plantWatered);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        plantWatered ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {plantWatered ? 'ON (Disiram)' : 'OFF (Kering)'}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1">
                  <span className="font-bold">Fakta Kebutuhan Tanaman:</span>
                  <p className="leading-relaxed">
                    Tumbuhan hijau adalah makhluk hidup yang memasak makanannya sendiri (fotosintesis). Tanaman wajib memperoleh <strong>cahaya matahari</strong> dan <strong>air</strong> agar dapat tumbuh subur dan berbunga!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 4. BAYANGAN & SENTER                                 */}
        {/* ==================================================== */}
        {selectedExpId === 'exp-bayangan-senter' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Shadow Optics Room */}
              <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-6 min-h-[340px] text-white flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                    Kamar Gelap Optika Bayangan
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Jarak Senter: {flashlightDistance}%
                  </span>
                </div>

                {/* Light Ray & Shadow Projection */}
                <div className="py-6 flex items-center justify-between relative">
                  {/* Flashlight */}
                  <div
                    className="flex flex-col items-center transition-all"
                    style={{ transform: `translateX(${(flashlightDistance - 50) * 0.8}px)` }}
                  >
                    <span className="text-4xl">🔦</span>
                    <span className="text-[10px] text-yellow-300 font-bold mt-1">Senter</span>
                  </div>

                  {/* Obstacle Object (Teddy Bear) */}
                  <div className="flex flex-col items-center z-10">
                    <span className="text-5xl">🧸</span>
                    <span className="text-[10px] text-slate-300 font-bold mt-1">Boneka Penghalang</span>
                  </div>

                  {/* Projected Shadow on Wall */}
                  <div className="flex flex-col items-center">
                    <div
                      className="bg-black/80 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{
                        width: `${Math.max(40, (100 - flashlightDistance) * 1.4)}px`,
                        height: `${Math.max(40, (100 - flashlightDistance) * 1.4)}px`,
                        filter: `blur(${Math.max(1, (100 - flashlightDistance) * 0.05)}px)`,
                      }}
                    >
                      <span className="text-2xl opacity-40">🧸</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold mt-1">Bayangan di Dinding</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 text-center">
                  Makin dekat senter ke boneka, makin besar bayangan yang terbentuk!
                </div>
              </div>

              {/* Flashlight Distance Slider */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Geser Posisi Senter:
                  </span>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-amber-600">Sangat Dekat (10%)</span>
                      <span className="text-slate-600">Jauh (90%)</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={flashlightDistance}
                      onChange={(e) => setFlashlightDistance(Number(e.target.value))}
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="font-bold">Hasil Pengamatan:</div>
                    <p>
                      Ukuran bayangan saat ini:{' '}
                      <span className="font-bold text-amber-600">
                        {flashlightDistance < 35 ? 'Sangat Besar' : flashlightDistance < 65 ? 'Sedang' : 'Kecil'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-950 text-xs space-y-1">
                  <span className="font-bold">Hukum Bayangan:</span>
                  <p className="leading-relaxed">
                    Bayangan terjadi karena cahaya merambat lurus dan dihalangi oleh benda gelap. Jika sumber cahaya digeser mendekati benda, sudut halangan membesar sehingga bayangan membesar!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 5. GETARAN SUARA & TELINGA                           */}
        {/* ==================================================== */}
        {selectedExpId === 'exp-indera-bunyi' && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl p-6 text-white min-h-[300px] flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Lab Gelombang Akustik
                </span>
                <span className="text-xs text-slate-400">Nada: {soundPitch.toUpperCase()}</span>
              </div>

              <div className="py-8 flex items-center justify-around">
                <div className="flex flex-col items-center">
                  <span className="text-5xl">{soundPitch === 'tinggi' ? '🔔' : soundPitch === 'sedang' ? '🔱' : '🥁'}</span>
                  <span className="text-xs font-bold text-slate-300 mt-2">Sumber Getaran</span>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((idx) => (
                    <div
                      key={idx}
                      className={`w-2 rounded-full transition-all duration-300 ${
                        soundVibrating ? 'bg-purple-400 h-20 animate-pulse' : 'bg-slate-800 h-6'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-5xl">👂</span>
                  <span className="text-xs font-bold text-indigo-300 mt-2">Telinga Pendengar</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => triggerSoundWave('rendah')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
                >
                  🥁 Gendang (Getaran Pelan)
                </button>
                <button
                  onClick={() => triggerSoundWave('sedang')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white shadow-md"
                >
                  🔱 Garpu Tala (Getaran Sedang)
                </button>
                <button
                  onClick={() => triggerSoundWave('tinggi')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
                >
                  🔔 Lonceng (Getaran Cepat)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 6. DAYA TARIK MAGNET                                */}
        {/* ==================================================== */}
        {selectedExpId === 'exp-daya-magnet' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 min-h-[340px] text-white flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    Meja Uji Medan Magnetik
                  </span>
                  <button
                    onClick={handleToggleMagnet}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    {magnetPosition === 'jauh' ? 'Dekatkan Magnet 👉' : 'Jauhkan Magnet 👈'}
                  </button>
                </div>

                <div className="py-6 flex items-center justify-between">
                  {/* Magnet */}
                  <div
                    className={`flex flex-col items-center transition-all duration-500 ${
                      magnetPosition === 'dekat' ? 'translate-x-12 scale-110' : ''
                    }`}
                  >
                    <span className="text-6xl">🧲</span>
                    <span className="text-xs font-bold text-rose-300 mt-2">Kutub Magnet</span>
                  </div>

                  {/* Objects on tray */}
                  <div className="flex flex-wrap gap-4 items-center justify-center max-w-xs">
                    {magnetItems.map((item) => {
                      const isPulled = magnetPosition === 'dekat' && item.magnetic;
                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-2xl border text-center transition-all duration-500 ${
                            isPulled
                              ? 'bg-rose-950/60 border-rose-400 -translate-x-8 ring-2 ring-rose-400/50'
                              : 'bg-slate-800 border-slate-700'
                          }`}
                        >
                          <span className="text-3xl">{item.icon}</span>
                          <div className="text-[10px] font-bold text-slate-200 mt-1">{item.name}</div>
                          <span
                            className={`text-[9px] font-bold block ${
                              item.magnetic ? 'text-emerald-400' : 'text-slate-500'
                            }`}
                          >
                            {item.magnetic ? 'Menempel!' : 'Diam'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-xs text-slate-400 text-center">
                  Benda dari bahan besi dan baja akan tertarik kuat oleh magnet!
                </div>
              </div>

              {/* Magnet Explanation */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Benda Magnetis vs Non-Magnetis:
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                      <strong>✅ Benda Magnetis (Tertarik):</strong> Paku besi, klip kertas, jarum pentul.
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800">
                      <strong>❌ Benda Non-Magnetis (Tidak Tertarik):</strong> Sendok plastik, penghapus karet, daun kering, kaca.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs space-y-1">
                  <span className="font-bold">Kesimpulan Magnet:</span>
                  <p className="leading-relaxed">
                    Magnet memiliki medan gaya tak kasat mata yang hanya menarik benda-benda logam tertentu, terutama yang mengandung unsur besi!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 7. SIRKUIT LISTRIK SEDERHANA                        */}
        {/* ==================================================== */}
        {selectedExpId === 'exp-rangkaian-listrik' && (() => {
          const activeMat = circuitMaterials.find((m) => m.id === circuitMaterial) || circuitMaterials[0];
          const isBulbLit = circuitSwitchClosed && activeMat.isConductive;
          const isDim = activeMat.glow === 'redup';

          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 min-h-[380px] text-white flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Meja Uji Rangkaian Sirkuit Listrik
                    </span>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setCircuitSwitchClosed((prev) => !prev);
                      }}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                        circuitSwitchClosed
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                          : 'bg-rose-600 hover:bg-rose-500 text-white'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{circuitSwitchClosed ? 'Sakelar ON (Tertutup)' : 'Sakelar OFF (Terbuka)'}</span>
                    </button>
                  </div>

                  {/* Circuit Graphic Simulation */}
                  <div className="py-6 flex flex-col items-center justify-center relative">
                    <div className="w-full max-w-md p-6 rounded-2xl bg-slate-800/80 border border-slate-700 relative">
                      {/* Flowing electrons visual indicator */}
                      {isBulbLit && (
                        <div className="absolute inset-0 rounded-2xl border-2 border-amber-400/40 pointer-events-none animate-pulse" />
                      )}

                      <div className="grid grid-cols-3 gap-4 items-center text-center">
                        {/* Battery */}
                        <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900 border border-slate-700">
                          <span className="text-4xl">🔋</span>
                          <span className="text-xs font-bold text-slate-200 mt-1">Baterai 1.5V</span>
                          <span className="text-[10px] text-emerald-400 font-bold">+ Kutub Positif -</span>
                        </div>

                        {/* Test Material Slot */}
                        <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/90 border-2 border-dashed border-amber-400/60">
                          <span className="text-3xl">{activeMat.icon}</span>
                          <span className="text-xs font-bold text-amber-300 mt-1">{activeMat.name}</span>
                          <span className={`text-[10px] font-bold uppercase ${activeMat.isConductive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {activeMat.type}
                          </span>
                        </div>

                        {/* Lightbulb */}
                        <div className={`flex flex-col items-center p-3 rounded-xl transition-all duration-500 ${
                          isBulbLit
                            ? isDim
                              ? 'bg-amber-950/80 border border-amber-500 shadow-lg shadow-amber-500/30 scale-105'
                              : 'bg-yellow-950 border-2 border-yellow-400 shadow-xl shadow-yellow-400/50 scale-105'
                            : 'bg-slate-900 border border-slate-800 opacity-60'
                        }`}>
                          <span className={`text-5xl transition-all ${isBulbLit ? 'filter drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]' : ''}`}>
                            {isBulbLit ? '💡' : '🌑'}
                          </span>
                          <span className="text-xs font-bold mt-1 text-slate-200">Bohlam</span>
                          <span className={`text-[10px] font-bold ${
                            isBulbLit
                              ? isDim ? 'text-amber-400' : 'text-yellow-300'
                              : 'text-slate-500'
                          }`}>
                            {isBulbLit ? (isDim ? 'Menyala Redup' : 'Menyala Terang!') : 'Lampu Padam'}
                          </span>
                        </div>
                      </div>

                      {/* Status explanation */}
                      <div className="mt-4 pt-3 border-t border-slate-700/80 text-center text-xs">
                        {isBulbLit ? (
                          <span className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                            <Zap className="w-4 h-4" />
                            <span>Arus mengalir sempurna! Rangkaian tertutup dan {activeMat.name} adalah konduktor.</span>
                          </span>
                        ) : !circuitSwitchClosed ? (
                          <span className="text-slate-400">
                            Sakelar dalam posisi TERBUKA (OFF). Arus listrik terputus sehingga lampu tidak menyala.
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold">
                            Arus listrik tertahan! {activeMat.name} adalah ISOLATOR yang tidak bisa mengalirkan listrik.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Material selector buttons */}
                  <div>
                    <span className="text-xs font-bold text-slate-400 block mb-2">
                      Ganti Benda Uji di Sirkuit:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {circuitMaterials.map((mat) => (
                        <button
                          key={mat.id}
                          onClick={() => {
                            sound.playClick();
                            setCircuitMaterial(mat.id);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            circuitMaterial === mat.id
                              ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          }`}
                        >
                          <span>{mat.icon}</span>
                          <span>{mat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Circuit Info Side */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                      Catatan Sains Listrik:
                    </span>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                        <strong>⚡ Konduktor Listrik:</strong> Tembaga dan paku besi memiliki partikel elektron bebas yang mudah bergerak membawa arus listrik.
                      </div>
                      <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-800">
                        <strong>🛡️ Isolator Listrik:</strong> Karet dan plastik menahan arus listrik agar tidak bocor, menjaga kita aman dari sengatan tersetrum!
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1">
                    <span className="font-bold">Tips Cerdas Kiko:</span>
                    <p className="leading-relaxed">
                      Kabel charger dan kabel TV di rumah kita menggunakan kawat tembaga di bagian dalam (konduktor) dan dibungkus plastik di luarnya (isolator pelindung).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ==================================================== */}
        {/* 8. SIKLUS AIR & HUJAN DI LAB                         */}
        {/* ==================================================== */}
        {selectedExpId === 'exp-siklus-air' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 min-h-[380px] text-white flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    Miniatur Siklus Perputaran Air
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">Panas:</span>
                    {(['mati', 'hangat', 'panas'] as const).map((h) => (
                      <button
                        key={h}
                        onClick={() => {
                          sound.playClick();
                          setWaterCycleHeat(h);
                          if (h === 'panas') {
                            setWaterCycleStage(3);
                            sound.playWaterSplash();
                          } else if (h === 'hangat') {
                            setWaterCycleStage(2);
                          } else {
                            setWaterCycleStage(1);
                          }
                        }}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase transition-all ${
                          waterCycleHeat === h
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulation Visual View */}
                <div className="py-6 flex flex-col items-center justify-center">
                  <div className="w-full max-w-sm p-6 rounded-2xl bg-gradient-to-b from-sky-950/80 to-slate-900 border border-sky-800/60 relative overflow-hidden flex flex-col items-center justify-between min-h-[220px]">
                    {/* Cloud / Condensation at top */}
                    <div className={`flex flex-col items-center transition-all duration-700 ${
                      waterCycleHeat === 'mati' ? 'opacity-30' : 'opacity-100 scale-105'
                    }`}>
                      <span className="text-5xl">{waterCycleHeat === 'panas' ? '🌧️' : '☁️'}</span>
                      <span className="text-[10px] font-bold text-sky-300">
                        {waterCycleHeat === 'panas' ? '2 & 3. Kondensasi & Hujan Turun' : '2. Awan Mengembun (Kondensasi)'}
                      </span>
                    </div>

                    {/* Raindrops Animation */}
                    {waterCycleHeat === 'panas' && (
                      <div className="flex gap-4 py-2 animate-bounce">
                        <span className="text-lg">💧</span>
                        <span className="text-lg">💧</span>
                        <span className="text-lg">💧</span>
                      </div>
                    )}

                    {/* Rising Steam */}
                    {waterCycleHeat !== 'mati' && (
                      <div className="flex gap-6 py-1 opacity-70 animate-pulse">
                        <span className="text-sm">♨️</span>
                        <span className="text-sm">♨️</span>
                        <span className="text-sm">♨️</span>
                      </div>
                    )}

                    {/* Water Beaker at bottom */}
                    <div className="w-full rounded-xl bg-blue-900/60 border border-blue-500/50 p-3 text-center flex items-center justify-between">
                      <span className="text-2xl">🌊</span>
                      <div className="text-left">
                        <span className="text-xs font-bold block text-blue-200">
                          1. Bejana Air & Lautan
                        </span>
                        <span className="text-[10px] text-blue-300/80">
                          {waterCycleHeat === 'panas' ? 'Air mendidih & menguap cepat (Evaporasi)' : waterCycleHeat === 'hangat' ? 'Air mulai menguap pelan' : 'Air tenang di suhu kamar'}
                        </span>
                      </div>
                      <span className="text-xl">
                        {waterCycleHeat === 'panas' ? '🔥' : waterCycleHeat === 'hangat' ? '☀️' : '❄️'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Steps Selector */}
                <div className="flex justify-around pt-3 border-t border-slate-800 text-center">
                  <div className={`p-2 rounded-xl text-xs font-bold ${waterCycleStage === 1 ? 'text-sky-400 bg-sky-950/50' : 'text-slate-500'}`}>
                    1. Evaporasi ♨️
                  </div>
                  <div className={`p-2 rounded-xl text-xs font-bold ${waterCycleStage === 2 ? 'text-sky-400 bg-sky-950/50' : 'text-slate-500'}`}>
                    2. Kondensasi ☁️
                  </div>
                  <div className={`p-2 rounded-xl text-xs font-bold ${waterCycleStage === 3 ? 'text-sky-400 bg-sky-950/50' : 'text-slate-500'}`}>
                    3. Presipitasi 🌧️
                  </div>
                </div>
              </div>

              {/* Siklus Air Notes */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Tahapan Siklus Air:
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-950">
                      <strong>♨️ 1. Evaporasi:</strong> Air laut dipanaskan matahari lalu berubah menjadi uap air yang naik ke angkasa.
                    </div>
                    <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950">
                      <strong>☁️ 2. Kondensasi:</strong> Uap air yang dingin berkumpul mengembun membentuk butiran awan mendung.
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
                      <strong>🌧️ 3. Presipitasi:</strong> Awan yang sudah terlalu berat menjatuhkan air hujan kembali ke tanah dan mengalir ke laut!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 9. SIANG & MALAM BUMI BERPUTAR                       */}
        {/* ==================================================== */}
        {selectedExpId === 'exp-siang-malam' && (() => {
          const isDaytimeInIndonesia = earthAngle >= 60 && earthAngle <= 240;

          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 min-h-[380px] text-white flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      Simulasi Rotasi Bumi: Siang & Malam
                    </span>
                    <span className="text-xs font-bold text-indigo-300">
                      Sudut Putar: {earthAngle}°
                    </span>
                  </div>

                  {/* Sun and Earth Graphic */}
                  <div className="py-6 flex items-center justify-around">
                    {/* Sun */}
                    <div className="flex flex-col items-center">
                      <span className="text-6xl animate-pulse">☀️</span>
                      <span className="text-xs font-bold text-amber-300 mt-2">Matahari Tetap</span>
                      <span className="text-[10px] text-slate-400">Pancaran Cahaya 👉</span>
                    </div>

                    {/* Rotating Globe Model */}
                    <div className="flex flex-col items-center relative">
                      <div
                        className="transition-transform duration-500 ease-out"
                        style={{ transform: `rotate(${earthAngle}deg)` }}
                      >
                        <span className="text-7xl block">🌍</span>
                      </div>
                      <div className="mt-3 text-center">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          isDaytimeInIndonesia
                            ? 'bg-amber-500/20 border border-amber-400 text-amber-300'
                            : 'bg-indigo-950 border border-indigo-500 text-indigo-300'
                        }`}>
                          {isDaytimeInIndonesia ? '☀️ Indonesia: Siang Terang' : '🌙 Indonesia: Malam Gelap'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rotation Slider and presets */}
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">Putar Bumi:</span>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="15"
                        value={earthAngle}
                        onChange={(e) => setEarthAngle(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setEarthAngle(120)}
                        className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300"
                      >
                        ☀️ Pukul 12:00 (Tengah Hari)
                      </button>
                      <button
                        onClick={() => setEarthAngle(300)}
                        className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-indigo-300"
                      >
                        🌙 Pukul 24:00 (Tengah Malam)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Day/Night Explanation */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                      Mengapa Ada Siang & Malam?
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Bumi kita berputar pada porosnya (Rotasi Bumi) seperti gasing. Bagian Bumi yang sedang menghadap ke arah matahari akan mengalami <strong>SIANG HARI</strong> yang terang dan hangat.
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Sebaliknya, bagian bumi yang membelakangi matahari akan mengalami <strong>MALAM HARI</strong> yang gelap dan bertabur bintang.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ==================================================== */}
        {/* 10. UJI PENGURAIAN SAMPAH 3R                         */}
        {/* ==================================================== */}
        {selectedExpId === 'exp-kompos-sampah' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 min-h-[380px] text-white flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Pot Uji Penguraian Sampah & Kompos
                  </span>
                  <span className="text-xs font-bold text-emerald-300">
                    Waktu: {decayDays === 365 ? '1 Tahun' : `${decayDays} Hari`}
                  </span>
                </div>

                {/* Pots Grid */}
                <div className="py-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {wastePots.map((pot) => {
                    const isOrganic = pot.category === 'Organik';
                    const isDecomposed = isOrganic && decayDays >= 90;
                    const isHalfDecomposed = isOrganic && decayDays === 30;

                    return (
                      <div
                        key={pot.id}
                        className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-center flex flex-col justify-between"
                      >
                        <span className="text-xs font-bold text-slate-300 block mb-1">
                          {pot.category}
                        </span>
                        <div className="py-3">
                          <span className="text-4xl block">
                            {isDecomposed ? '🪱' : isHalfDecomposed ? '🍂' : pot.icon}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-100 block">
                            {pot.name}
                          </span>
                          <span className={`text-[10px] font-bold block ${
                            isOrganic
                              ? isDecomposed ? 'text-emerald-400' : 'text-amber-300'
                              : 'text-rose-400'
                          }`}>
                            {isDecomposed
                              ? 'Hancur jadi Kompos!'
                              : isHalfDecomposed
                              ? 'Mulai Membusuk'
                              : isOrganic
                              ? 'Masih Utuh'
                              : 'Tetap Utuh (Abadi)'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Fast-forward Days Slider */}
                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Majukan Waktu Pengamatan:</span>
                    <span className="font-bold text-white">Hari ke-{decayDays}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    {[0, 30, 90, 365].map((d) => (
                      <button
                        key={d}
                        onClick={() => {
                          sound.playClick();
                          setDecayDays(d);
                          if (d >= 90) sound.playSparkle();
                        }}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          decayDays === d
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {d === 0 ? 'Hari 0' : d === 365 ? '1 Tahun' : `${d} Hari`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3R Notes */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Hasil Pengamatan Sampah 3R:
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                      <strong>🥬 Sampah Organik:</strong> Sisa buah dan daun terurai alami dalam hitungan minggu menjadi pupuk kompos yang menyuburkan tanaman.
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
                      <strong>🧴 Sampah Plastik:</strong> Tetap utuh selama berbulan-bulan bahkan hingga ratusan tahun! Itulah sebabnya kita harus mengurangi plastik (Reduce) dan mendaur ulang (Recycle).
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
