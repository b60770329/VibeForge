import React, { useState } from 'react';
import { VIBE_METHOD_STEPS, VERIFICATION_LEVELS, SECURITY_PRINCIPLES } from '../data/courseData';
import {
  RotateCcw,
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Sliders,
  FileCheck,
  Cpu,
  Terminal,
  HelpCircle,
  Eye,
  GitBranch,
  Bug,
  Award,
  ChevronRight,
} from 'lucide-react';

export const VibeMethodology: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'loop' | 'verification' | 'security'>('loop');

  const currentStepData = VIBE_METHOD_STEPS.find((s) => s.step === selectedStep) || VIBE_METHOD_STEPS[0];

  const getSecurityIcon = (name: string) => {
    switch (name) {
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case 'Lock':
        return <Lock className="w-5 h-5 text-cyan-400" />;
      case 'Sliders':
        return <Sliders className="w-5 h-5 text-purple-400" />;
      case 'FileCheck':
      default:
        return <FileCheck className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <section id="methodology" className="relative py-24 sm:py-32 bg-[#05070c] border-t border-white/5 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-mono font-medium text-purple-300">
            <Cpu className="w-3.5 h-3.5" />
            <span>Разделы 7, 8 и 10: Инженерный стандарт</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Методика и гарантии качества{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-emerald-400">
              Vibe Coding
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            ИИ может убедительно утверждать, что задача решена. Мы учим отличать правдоподобные объяснения
            от реально работающего кода с помощью строгого 8-шагового цикла и 3 уровней проверки.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveTab('loop')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'loop'
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-950 shadow-lg shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>8 шагов цикла с ИИ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('verification')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'verification'
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>3 уровня проверки</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'security'
                  ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Безопасность</span>
            </button>
          </div>
        </div>

        {/* Tab 1: 8-Step Vibe Coding Cycle */}
        {activeTab === 'loop' && (
          <div className="space-y-8">
            {/* Step navigation ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {VIBE_METHOD_STEPS.map((s) => {
                const isCurrent = s.step === selectedStep;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setSelectedStep(s.step)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-purple-500/20 border-purple-400 shadow-lg shadow-purple-500/25 ring-1 ring-purple-400'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-mono text-xs font-bold text-slate-300">0{s.step}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isCurrent ? 'bg-purple-400 animate-pulse' : 'bg-slate-700'
                        }`}
                      />
                    </div>
                    <div className="text-xs font-semibold text-white truncate">{s.title}</div>
                  </button>
                );
              })}
            </div>

            {/* Step Deep Dive Card */}
            <div className="rounded-3xl bg-[#090c17]/90 border border-white/10 p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
                      Шаг {currentStepData.step} из 8: {currentStepData.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-300">Принцип: {currentStepData.principle}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {currentStepData.title}
                  </h3>

                  <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-purple-200 text-sm font-medium flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold block mb-0.5">
                        Вопрос для самоконтроля:
                      </span>
                      <span>«{currentStepData.question}»</span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                    {currentStepData.description}
                  </p>
                </div>

                <div className="lg:col-span-4 p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                  <div className="text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
                    Инженерное правило курса
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                    <p>
                      📌 <strong className="text-white">Не доверяйте заявлениям:</strong> Если ИИ сообщает «Я всё успешно починил», это всего лишь гипотеза. Окончательным ответом является запуск приложения и прохождение сценария.
                    </p>
                    <p>
                      📌 <strong className="text-white">Малые шаги:</strong> Одно изменение за один промпт. Это позволяет точно знать, какая правка сломала код в случае ошибки.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      disabled={selectedStep === 1}
                      onClick={() => setSelectedStep((prev) => Math.max(1, prev - 1))}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Предыдущий
                    </button>

                    <button
                      type="button"
                      disabled={selectedStep === 8}
                      onClick={() => setSelectedStep((prev) => Math.min(8, prev + 1))}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-xs text-purple-300 hover:bg-purple-500/30 disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <span>Следующий шаг</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 3-Level Verification System */}
        {activeTab === 'verification' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VERIFICATION_LEVELS.map((lvl) => {
              const borderGlow =
                lvl.accentColor === 'cyan'
                  ? 'border-cyan-500/30 hover:border-cyan-500/60 shadow-cyan-950/20'
                  : lvl.accentColor === 'purple'
                  ? 'border-purple-500/30 hover:border-purple-500/60 shadow-purple-950/20'
                  : 'border-emerald-500/30 hover:border-emerald-500/60 shadow-emerald-950/20';

              const badgeColor =
                lvl.accentColor === 'cyan'
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                  : lvl.accentColor === 'purple'
                  ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';

              return (
                <div
                  key={lvl.level}
                  className={`rounded-3xl bg-[#090c17]/90 border backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 ${borderGlow}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${badgeColor}`}>
                        Уровень {lvl.level}
                      </span>
                      <span className="text-xs font-mono text-slate-300">Строгий аудит</span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white">{lvl.title}</h3>
                      <p className="text-xs text-slate-300 mt-1 font-mono">{lvl.role}</p>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      {lvl.points.map((pt, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-slate-300">
                    🛡️ {lvl.statusNote}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Security & Responsible AI */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SECURITY_PRINCIPLES.map((sec, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#090c17]/80 border border-white/10 p-6 space-y-4 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {getSecurityIcon(sec.icon)}
                  </div>
                  <h3 className="text-base font-bold text-white">{sec.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {sec.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs sm:text-sm text-slate-300 max-w-4xl mx-auto flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-amber-200">Обязательное условие программы:</strong> Обучение безопасности данных и переменным окружения — это неотъемлемая часть каждого модуля курса VibeForge, а не факультативное дополнение. Ваш проект никогда не подвергнется утечке токенов.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
