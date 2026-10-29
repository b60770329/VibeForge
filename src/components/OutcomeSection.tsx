import React from 'react';
import {
  Check,
  ArrowRight,
  ShieldCheck,
  Layers,
  Database,
  Lock,
  Globe2,
  Workflow,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { OUTCOME_CRITERIA } from '../data/courseData';

interface OutcomeSectionProps {
  onStartCreating: () => void;
}

export const OutcomeSection: React.FC<OutcomeSectionProps> = ({ onStartCreating }) => {
  return (
    <section id="outcome" className="relative py-24 md:py-32 bg-[#06080d] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-600/10 via-purple-600/15 to-pink-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-mono text-purple-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Учебные критерии качества продукта</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Результат{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
              курса
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            В конце обучения каждый участник стремится разработать, протестировать и развернуть собственный
            полнофункциональный MVP, готовый к показу первым пользователям и тестированию бизнес-гипотез.
          </p>
        </div>

        {/* Big Interactive Card: The Complete MVP Anatomy */}
        <div className="rounded-3xl bg-[#090d19] border border-white/15 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl mb-12">
          {/* Subtle grid in card */}
          <div className="absolute inset-0 bg-grid-cyber opacity-30 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            {/* Left Column: 7 Specific Outcome Criteria */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  Анатомия вашего первого MVP:
                </span>
                <span className="text-xs text-slate-500">• 7 ключевых компонентов</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {OUTCOME_CRITERIA.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                          <Check className="w-3 h-3" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                ))}

                {/* Summary Bonus Box */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/40 via-purple-950/30 to-indigo-950/40 border border-cyan-500/30 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-cyan-300 font-semibold uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Итоговый артефакт
                    </span>
                    <p className="text-xs font-bold text-white">
                      Публичная ссылка на работающий сервис
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Проект готов для демонстрации аудитории, инвесторам или добавления в резюме.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Product Architecture Schematic */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl bg-[#06080e] border border-white/10 p-5 shadow-xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[11px] text-slate-400">
                  <span className="text-cyan-400 font-bold">// АРХИТЕКТУРА MVP</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Production Ready
                  </span>
                </div>

                {/* Architectural Stack Layers */}
                <div className="space-y-2">
                  {/* Layer 1: UI */}
                  <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span className="text-white font-semibold">1. UI & State Layer</span>
                    </div>
                    <span className="text-[10px] text-cyan-300">React 19 + Tailwind</span>
                  </div>

                  {/* Layer 2: Business Logic */}
                  <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-indigo-400" />
                      <span className="text-white font-semibold">2. Logic & Workflows</span>
                    </div>
                    <span className="text-[10px] text-indigo-300">TypeScript Hooks</span>
                  </div>

                  {/* Layer 3: Database & Auth */}
                  <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-purple-400" />
                      <span className="text-white font-semibold">3. Database & Security</span>
                    </div>
                    <span className="text-[10px] text-purple-300">Firestore NoSQL</span>
                  </div>

                  {/* Layer 4: Identity */}
                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span className="text-white font-semibold">4. User Authentication</span>
                    </div>
                    <span className="text-[10px] text-emerald-300">Google Sign-in</span>
                  </div>

                  {/* Layer 5: AI Engine */}
                  <div className="p-2.5 rounded-lg bg-pink-950/30 border border-pink-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      <span className="text-white font-semibold">5. External AI API</span>
                    </div>
                    <span className="text-[10px] text-pink-300">Gemini 3.8 Flash</span>
                  </div>

                  {/* Layer 6: Hosting */}
                  <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe2 className="w-4 h-4 text-sky-400" />
                      <span className="text-white font-semibold">6. Cloud Deployment</span>
                    </div>
                    <span className="text-[10px] text-sky-300">HTTPS + Global CDN</span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Сквозная связность всех уровней</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Area */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              *Все компоненты проверяются на практике в ходе прохождения программы курса.
            </p>

            <button
              type="button"
              onClick={onStartCreating}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-cyan-500/20"
            >
              <span>Создать свой MVP</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
