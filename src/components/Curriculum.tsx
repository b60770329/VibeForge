import React, { useState } from 'react';
import {
  Lightbulb,
  Terminal,
  Layout,
  Database,
  Network,
  Rocket,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { CURRICULUM_MODULES } from '../data/courseData';
import { CurriculumModule } from '../types';
import { useAuth } from '../firebase/authContext';

export const Curriculum: React.FC = () => {
  const { user, savedModuleIds, toggleSaveModule } = useAuth();
  const [activeModuleId, setActiveModuleId] = useState<number>(1);

  const getModuleIcon = (iconName: CurriculumModule['iconName']) => {
    switch (iconName) {
      case 'Lightbulb':
        return <Lightbulb className="w-5 h-5 text-amber-400" />;
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-cyan-400" />;
      case 'Layout':
        return <Layout className="w-5 h-5 text-purple-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-emerald-400" />;
      case 'Network':
        return <Network className="w-5 h-5 text-blue-400" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-rose-400" />;
    }
  };

  const activeModule = CURRICULUM_MODULES.find((m) => m.id === activeModuleId) || CURRICULUM_MODULES[0];

  return (
    <section id="curriculum" className="relative py-24 md:py-32 bg-[#07090f] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Layers className="w-3.5 h-3.5" />
            <span>Пошаговая программа курса (6–8 недель)</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Краткий путь к{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
              MVP
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Шесть последовательных модулей, выстроенных от первой идеи до работающего веб-сервиса в публичном доступе.
            Каждый модуль завершается осязаемым практическим артефактом.
          </p>
        </div>

        {/* Interactive Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 6 Modules List */}
          <div className="lg:col-span-5 space-y-3">
            {CURRICULUM_MODULES.map((module) => {
              const isActive = activeModuleId === module.id;
              const isSaved = savedModuleIds.includes(module.id);

              return (
                <div
                  key={module.id}
                  onClick={() => setActiveModuleId(module.id)}
                  className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0d1222] to-[#12162a] border-cyan-500/50 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-400/30'
                      : 'bg-[#080b14] border-white/10 hover:border-white/20 hover:bg-[#0b0e1a]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 ${
                          isActive
                            ? 'bg-cyan-500/10 border-cyan-500/40 shadow-md shadow-cyan-500/20'
                            : 'bg-white/[0.03] border-white/10'
                        }`}
                      >
                        {getModuleIcon(module.iconName)}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-cyan-400">
                            Модуль {module.id}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {module.durationLabel}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {module.shortDesc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveModule(module.id);
                        }}
                        className={`p-2 rounded-xl border transition-colors ${
                          isSaved
                            ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                        }`}
                        title={isSaved ? 'Сохранено в вашем плане' : 'Сохранить модуль в личный план'}
                        aria-label={isSaved ? 'Сохранено' : 'Сохранить'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isActive ? 'text-cyan-400 translate-x-1' : 'text-slate-400 group-hover:text-white'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed View of Active Module */}
          <div className="lg:col-span-7 sticky top-28">
            <div className="rounded-3xl bg-[#090d18] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              {/* Top ambient glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

              {/* Module Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center">
                    {getModuleIcon(activeModule.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                        Модуль {activeModule.id} из 6
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs font-mono text-purple-300">
                        {activeModule.durationLabel}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mt-0.5">
                      {activeModule.title}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleSaveModule(activeModule.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    savedModuleIds.includes(activeModule.id)
                      ? 'bg-purple-950/80 border-purple-400 text-purple-300'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {savedModuleIds.includes(activeModule.id) ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-purple-400" />
                      <span>В вашем плане</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>{user ? 'Сохранить модуль' : 'Войти и сохранить'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Description */}
              <div className="py-6 border-b border-white/10 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Цель и содержание модуля:
                </h4>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                  {activeModule.fullDesc}
                </p>
              </div>

              {/* Topics Breakdown */}
              <div className="py-6 border-b border-white/10 space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Ключевые темы и практические навыки:
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {activeModule.topics.map((topic, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5"
                    >
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-200">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Deliverable & Tech Stack */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30">
                  <div className="text-[11px] font-mono uppercase text-cyan-400 font-bold mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Практический результат
                  </div>
                  <p className="text-xs font-medium text-white leading-relaxed">
                    {activeModule.keyDeliverable}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30">
                  <div className="text-[11px] font-mono uppercase text-purple-400 font-bold mb-1">
                    Инструменты и стек
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {activeModule.toolsAndTech.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.08] text-slate-200 border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
