import React, { useState } from 'react';
import { COURSE_PROJECTS } from '../data/courseData';
import { ProjectShowcaseItem } from '../types';
import {
  FolderGit2,
  CheckCircle2,
  ArrowRight,
  Layers,
  Sparkles,
  ExternalLink,
  Target,
  Code2,
  Cpu,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface ProjectShowcaseProps {
  onStartCreating: (track?: string) => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ onStartCreating }) => {
  const [activeProjectId, setActiveProjectId] = useState<string>(COURSE_PROJECTS[0].id);

  const activeProject = COURSE_PROJECTS.find((p) => p.id === activeProjectId) || COURSE_PROJECTS[0];

  const getColorClasses = (color: ProjectShowcaseItem['color'], isSelected: boolean) => {
    switch (color) {
      case 'cyan':
        return {
          pill: isSelected
            ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20'
            : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20',
          accent: 'text-cyan-400',
          badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          glow: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
        };
      case 'purple':
        return {
          pill: isSelected
            ? 'bg-purple-500/15 border-purple-400 text-purple-300 shadow-lg shadow-purple-500/20'
            : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20',
          accent: 'text-purple-400',
          badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          glow: 'from-purple-500/20 via-purple-500/5 to-transparent',
        };
      case 'amber':
        return {
          pill: isSelected
            ? 'bg-amber-500/15 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/20'
            : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20',
          accent: 'text-amber-400',
          badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          glow: 'from-amber-500/20 via-amber-500/5 to-transparent',
        };
    }
  };

  const currentTheme = getColorClasses(activeProject.color, true);

  return (
    <section id="projects" className="relative py-24 sm:py-32 bg-[#07090e] border-t border-white/5 overflow-hidden">
      {/* Dynamic background ambient lighting */}
      <div className={`absolute top-1/3 -left-48 w-96 h-96 bg-gradient-to-r ${currentTheme.glow} blur-[140px] pointer-events-none transition-all duration-700`} />
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-purple-600/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono font-medium text-cyan-300">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Раздел 6 Программы: Проектная система</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            3 обязательных проекта в вашем{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-amber-300">
              портфолио
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Обучение строится вокруг реальной практики: вы проходите путь от простого интерактивного мини-приложения
            до полноценного опубликованного MVP с базой данных, авторизацией и искусственным интеллектом.
          </p>
        </div>

        {/* Interactive Step Switcher Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-10 max-w-4xl mx-auto">
          {COURSE_PROJECTS.map((project, idx) => {
            const isSelected = project.id === activeProjectId;
            const theme = getColorClasses(project.color, isSelected);

            return (
              <button
                key={project.id}
                type="button"
                onClick={() => setActiveProjectId(project.id)}
                className={`relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${theme.pill}`}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center font-mono font-bold text-sm">
                  <span className={theme.accent}>{project.number}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-medium">
                      Этап {idx + 1}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${theme.badge}`}>
                      {project.badge}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    {project.title.split(':')[0]}
                  </h3>
                  <p className="text-xs text-slate-300 truncate mt-0.5">
                    {project.durationWeeks}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Active Project Showcase Card */}
        <div className="relative rounded-3xl bg-[#0a0d18]/90 border border-white/10 backdrop-blur-xl p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
          {/* Subtle top indicator line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Project Overview and Deliverables */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${currentTheme.badge}`}>
                  {activeProject.stageName}
                </span>
                <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  <Clock className="w-3.5 h-3.5 text-slate-300" />
                  {activeProject.durationWeeks}
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {activeProject.title}
                </h3>
                <p className="text-cyan-300 font-medium text-sm sm:text-base mt-1">
                  {activeProject.tagline}
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {activeProject.description}
              </p>

              {/* Learning Objective Box */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <Target className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-300 font-medium mb-1">
                    Главная цель этапа
                  </div>
                  <div className="text-xs sm:text-sm text-slate-200 font-normal">
                    {activeProject.objective}
                  </div>
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Обязательные результаты сдачи проекта (Checklist)</span>
                </h4>

                <div className="grid grid-cols-1 gap-2.5">
                  {activeProject.deliverables.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl bg-black/30 border border-white/5 text-xs sm:text-sm text-slate-200 font-normal"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Visual Tech Spec & Action Panel */}
            <div className="lg:col-span-5 space-y-6">
              {/* Stack & Components Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-black/40 border border-white/10 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span>Фокус технологий этапа</span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400">Модуль {activeProject.number}/03</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeProject.techFocus.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Practical Rule Highlight */}
                <div className="pt-2 border-t border-white/10">
                  <div className="text-xs text-slate-300 leading-relaxed font-normal">
                    {activeProject.id === 'project-1' && (
                      <p>
                        💡 <strong className="text-white">Правило первого этапа:</strong> Не усложняйте. Главная задача — пройти весь цикл от формулировки промпта до кликабельного сайта по публичной ссылке без фрустрации.
                      </p>
                    )}
                    {activeProject.id === 'project-2' && (
                      <p>
                        💡 <strong className="text-white">Архитектурный рубеж:</strong> Вы подключаете настоящую облачную БД и Google Auth. Данные сохраняются реактивно в реальном времени.
                      </p>
                    )}
                    {activeProject.id === 'project-3' && (
                      <p>
                        💡 <strong className="text-white">Защита собственного MVP:</strong> Проект оценивается по 3 уровням (тесты, аудит ИИ, чек-лист). Вы получаете готовую строчку в резюме и рабочий бизнес-инструмент.
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onStartCreating(activeProject.title)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-purple-600 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 hover:opacity-95 transition-all duration-200"
                >
                  <span>Начать работу над проектом {activeProject.number}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Footnote */}
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <p className="leading-relaxed">
                  Все проекты сохраняются в репозитории вашего личного кабинета и остаются в вашей собственности навсегда.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
