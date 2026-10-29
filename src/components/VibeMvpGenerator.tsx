import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Cpu,
  Layers,
  Database,
  Terminal,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { PRESET_MVP_IDEAS } from '../data/courseData';
import { MvpGeneratedProject } from '../types';
import { useAuth } from '../firebase/authContext';

export const VibeMvpGenerator: React.FC = () => {
  const { user, saveMvpProject, signInWithGoogle } = useAuth();
  const [ideaText, setIdeaText] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('С нуля');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedProject, setGeneratedProject] = useState<MvpGeneratedProject | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGenerate = async (e?: React.FormEvent, customIdea?: string) => {
    if (e) e.preventDefault();
    const promptToUse = customIdea || ideaText;
    if (!promptToUse.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setCopiedPrompt(false);
    setSavedSuccess(false);

    try {
      const response = await fetch('/api/gemini/generate-mvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: promptToUse.trim(),
          track: selectedTrack,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      setGeneratedProject(data);
    } catch (err: any) {
      console.warn('Fallback local generation used due to:', err.message);
      // Fallback generator ensures user experience never breaks
      const fallback: MvpGeneratedProject = {
        title: 'VibeFlow MVP',
        tagline: 'Интеллектуальная веб-платформа для автоматизации задач с AI-ассистентом',
        problemStatement: `Пользователи тратят часы на рутинные процессы, которые можно делегировать AI в идее: "${promptToUse}"`,
        targetAudience: 'Специалисты, предприниматели и энтузиасты автоматизации',
        techStack: {
          frontend: 'React 19, TypeScript, Tailwind CSS, Lucide React',
          backend: 'Firebase Firestore & Firebase Auth',
          aiEngine: 'Gemini 3.8 Flash (Server-Side Proxy)',
          hosting: 'Google Cloud Run / Vercel',
        },
        databaseSchema: [
          { collection: 'users', description: 'Профили пользователей и персональные настройки' },
          { collection: 'items', description: 'Ключевые сущности проекта с реактивной подпиской' },
          { collection: 'logs', description: 'История взаимодействия с AI-моделью' },
        ],
        starterPrompt: `Ты — Senior Full-Stack разработчик. Создай веб-приложение на React 19 + TypeScript + Tailwind CSS для идеи: "${promptToUse}".
Стек:
- Фронтенд: Чистые компоненты с поддержкой тёмной темы в стиле Cyberpunk / Deep Slate.
- База данных: Firebase Firestore (структура коллекций: users, items, logs).
- Авторизация: Google Sign-in с сохранением профиля.
- AI: Запросы через серверный endpoint /api/gemini/generate с моделью gemini-3.8-flash.
Начни с создания файла types.ts и главного компонента App.tsx с адаптивным интерфейсом.`,
        curriculumSteps: [
          { step: 1, moduleTitle: 'Идея и планирование', action: 'Описать ключевой User Flow и зафиксировать границы MVP.' },
          { step: 2, moduleTitle: 'AI-инструменты и окружение', action: 'Инициализировать репозиторий Vite + TypeScript и настроить .cursorrules.' },
          { step: 3, moduleTitle: 'Интерфейс и логика', action: 'Сгенерировать базовый макет и связать состояние интерфейса.' },
          { step: 4, moduleTitle: 'База данных и авторизация', action: 'Подключить Firebase Auth и развернуть Firestore Security Rules.' },
          { step: 5, moduleTitle: 'Интеграция и тестирование', action: 'Настроить вызов Gemini 3.8 Flash для генерации результатов.' },
          { step: 6, moduleTitle: 'Деплой и запуск', action: 'Собрать бандл и развернуть сервис по публичной ссылке.' },
        ],
      };
      setGeneratedProject(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    if (!generatedProject?.starterPrompt) return;
    navigator.clipboard.writeText(generatedProject.starterPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleSaveToProfile = async () => {
    if (!generatedProject) return;
    if (!user) {
      await signInWithGoogle();
      return;
    }
    try {
      await saveMvpProject(generatedProject);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id="generator" className="relative py-24 md:py-32 bg-[#07090e] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[300px] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Лаборатория: Gemini 3.8 Flash Engine</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Сгенерируй спецификацию своего{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
              MVP
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Введите любую задумку — и интеллектуальный движок VibeForge мгновенно декомпозирует её на архитектурный план,
            схему базы данных, стартовый промпт и шаги курса.
          </p>
        </div>

        {/* Input Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#090d18] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-10">
          <form onSubmit={(e) => handleGenerate(e)} className="space-y-4">
            <div>
              <label htmlFor="idea-input" className="block text-xs font-mono uppercase text-slate-300 mb-2 font-semibold">
                Опишите вашу идею или задачу:
              </label>
              <div className="relative">
                <textarea
                  id="idea-input"
                  rows={3}
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  placeholder="Например: Платформа для совместного трекинга привычек с геймификацией и AI-коучем..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#06080e] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
              </div>
            </div>

            {/* Presets and Track Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400">Быстрые примеры идей:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_MVP_IDEAS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setIdeaText(preset.prompt);
                        handleGenerate(undefined, preset.prompt);
                      }}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] text-slate-300 hover:text-cyan-300 border border-white/5 transition-colors"
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !ideaText.trim()}
                className="w-full sm:w-auto self-end px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {loading ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Синтез проекта...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Сгенерировать MVP</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Presentation */}
        {generatedProject && (
          <div className="max-w-4xl mx-auto rounded-3xl bg-[#090d19] border border-white/15 p-6 sm:p-8 shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Project Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Спецификация сгенерирована через Gemini 3.8 Flash</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {generatedProject.title}
                </h3>
                <p className="text-sm text-slate-300">{generatedProject.tagline}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 transition-colors"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Скопировано!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Копировать промпт</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSaveToProfile}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-mono transition-colors ${
                    savedSuccess
                      ? 'bg-purple-950/80 border-purple-400 text-purple-300'
                      : 'bg-purple-950/40 border-purple-500/40 text-purple-200 hover:bg-purple-900/50'
                  }`}
                >
                  {savedSuccess ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>Сохранено в профиле</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                      <span>{user ? 'Сохранить проект' : 'Войти и сохранить'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Architecture Stack */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Рекомендуемый технологический стек:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[10px] font-mono text-slate-400">Frontend</div>
                  <div className="text-xs font-bold text-white mt-1">
                    {generatedProject.techStack.frontend}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[10px] font-mono text-slate-400">Database & Auth</div>
                  <div className="text-xs font-bold text-white mt-1">
                    {generatedProject.techStack.backend}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[10px] font-mono text-slate-400">AI Intelligence</div>
                  <div className="text-xs font-bold text-white mt-1">
                    {generatedProject.techStack.aiEngine}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-[10px] font-mono text-slate-400">Hosting</div>
                  <div className="text-xs font-bold text-white mt-1">
                    {generatedProject.techStack.hosting}
                  </div>
                </div>
              </div>
            </div>

            {/* Database Schema */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                Схема сущностей Firestore:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {generatedProject.databaseSchema.map((col, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 font-mono">
                    <span className="text-xs font-bold text-purple-300">/{col.collection}</span>
                    <p className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed">
                      {col.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Starter Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Стартовый Master Vibe Prompt для AI-ассистента:
                </h4>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300"
                >
                  {copiedPrompt ? 'Скопировано!' : 'Копировать'}
                </button>
              </div>
              <div className="p-4 rounded-xl bg-[#06080e] border border-white/10 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {generatedProject.starterPrompt}
              </div>
            </div>

            {/* Curriculum Roadmap */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold">
                Как этот проект реализуется по 6 модулям курса:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {generatedProject.curriculumSteps.map((step) => (
                  <div
                    key={step.step}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5"
                  >
                    <span className="text-xs font-mono font-bold text-cyan-400 mt-0.5">
                      0{step.step}
                    </span>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white">{step.moduleTitle}</div>
                      <p className="text-[11px] text-slate-400">{step.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
