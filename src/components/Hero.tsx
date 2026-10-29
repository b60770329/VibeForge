import React, { useState } from 'react';
import { Sparkles, ArrowRight, Play, CheckCircle2, Terminal, Code2, Globe, Cpu, RefreshCw, Zap } from 'lucide-react';

interface HeroProps {
  onStartCreating: () => void;
  onExploreCurriculum: () => void;
  onOpenGenerator: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartCreating,
  onExploreCurriculum,
  onOpenGenerator,
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'code' | 'preview'>('preview');
  const [interactiveItems, setInteractiveItems] = useState([
    { id: 1, title: 'AI-генерация интерфейса', status: 'done' },
    { id: 2, title: 'Подключение Firebase Auth', status: 'done' },
    { id: 3, title: 'Реализация Gemini Reasoning', status: 'active' },
  ]);
  const [newTitle, setNewTitle] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setInteractiveItems((prev) => [
      ...prev,
      { id: Date.now(), title: newTitle.trim(), status: 'done' },
    ]);
    setNewTitle('');
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[400px] bg-gradient-to-tr from-cyan-600/20 via-indigo-600/15 to-purple-600/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Cyber Grid background */}
      <div className="absolute inset-0 bg-grid-cyber opacity-60 pointer-events-none -z-10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_80%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-7 flex flex-col text-left space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 backdrop-blur-md self-start text-xs font-mono text-cyan-300">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Образовательный курс нового поколения • 6–8 недель</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Vibe Coding — <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 drop-shadow-[0_0_35px_rgba(56,189,248,0.35)]">
                Твори с AI
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal">
              От идеи до работающего MVP. Научись создавать веб-приложения с помощью искусственного интеллекта, даже если раньше не писал код.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={onStartCreating}
                className="group relative inline-flex items-center justify-center px-7 py-4 rounded-xl text-sm font-bold text-slate-950 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl shadow-cyan-500/25 bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <span>Начать творить</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={onExploreCurriculum}
                className="inline-flex items-center justify-center px-6 py-4 rounded-xl text-sm font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-white/20 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <span>Программа курса</span>
              </button>

              <button
                type="button"
                onClick={onOpenGenerator}
                className="inline-flex items-center justify-center px-5 py-4 rounded-xl text-sm font-medium text-purple-300 bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                <span>AI-генератор MVP</span>
              </button>
            </div>

            {/* Result highlights */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-300">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">Практика на реальном проекте</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-purple-300">6–8</div>
                <div className="text-xs text-slate-400 mt-0.5">Недель от нуля до деплоя</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-300">1 MVP</div>
                <div className="text-xs text-slate-400 mt-0.5">Личный продукт в портфолио</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Vibe Coding Window */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Backlight */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-35 animate-pulse-glow" />

            <div className="relative rounded-2xl bg-[#0a0d16] border border-white/15 shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0d111d] border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    VibeForge Studio
                  </span>
                </div>

                {/* View Switcher Tabs */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('prompt')}
                    className={`flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded transition-colors ${
                      activeTab === 'prompt' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3 h-3" />
                    prompt.md
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('code')}
                    className={`flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded transition-colors ${
                      activeTab === 'code' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code2 className="w-3 h-3" />
                    App.tsx
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded transition-colors ${
                      activeTab === 'preview' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    Live App
                  </button>
                </div>
              </div>

              {/* Tab 1: Prompt View */}
              {activeTab === 'prompt' && (
                <div className="p-4 sm:p-5 font-mono text-xs text-slate-300 space-y-3 bg-[#07090f] min-h-[340px]">
                  <div className="text-slate-500 text-[11px] pb-1 border-b border-white/5 flex items-center justify-between">
                    <span>// ЧЕЛОВЕК УПРАВЛЯЕТ ЗАМЫСЛОМ И АРХИТЕКТУРОЙ</span>
                    <span className="text-cyan-400">AI Agent: Ready</span>
                  </div>
                  <p className="text-cyan-300">
                    &gt; &quot;Создай веб-сервис для совместного запуска MVP. Стек: React 19, Tailwind, Firebase Auth и серверный Gemini 3.8. Добавь темную неоновую тему и реактивный список задач.&quot;
                  </p>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 space-y-2 text-[11px] text-slate-300">
                    <div className="flex items-center gap-2 text-purple-400">
                      <Cpu className="w-3.5 h-3.5 animate-spin" />
                      <span>Gemini Synthesis Engine: декомпозиция на 3 слоя</span>
                    </div>
                    <p className="text-slate-400 pl-5">1. Сгенерирован компонент App.tsx с Tailwind</p>
                    <p className="text-slate-400 pl-5">2. Настроены правила Firestore Security Rules</p>
                    <p className="text-slate-400 pl-5">3. Готовность к развертыванию: 100%</p>
                  </div>
                  <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Синтез завершён за 2.4 сек. Переключитесь на вкладку Live App!
                  </div>
                </div>
              )}

              {/* Tab 2: Code View */}
              {activeTab === 'code' && (
                <div className="p-4 font-mono text-[11px] bg-[#07090f] overflow-x-auto min-h-[340px] text-slate-300 space-y-1">
                  <div className="text-slate-500">// App.tsx — чистый TypeScript + React 19</div>
                  <div className="text-purple-400">import <span className="text-slate-200">&#123; useState, useEffect &#125;</span> from <span className="text-emerald-300">&apos;react&apos;</span>;</div>
                  <div className="text-purple-400">import <span className="text-slate-200">&#123; db, auth &#125;</span> from <span className="text-emerald-300">&apos;./firebase&apos;</span>;</div>
                  <div className="py-1 text-slate-500">// Архитектурный контроль: данные типизированы</div>
                  <div>
                    <span className="text-sky-400">export default function</span> <span className="text-amber-300">MvpApp</span>() &#123;
                  </div>
                  <div className="pl-4 text-slate-300">
                    <span className="text-sky-400">const</span> [items, setItems] = <span className="text-amber-300">useState</span>([]);
                  </div>
                  <div className="pl-4 text-slate-300">
                    <span className="text-sky-400">const</span> [isVibeActive, setVibe] = <span className="text-amber-300">useState</span>(<span className="text-rose-400">true</span>);
                  </div>
                  <div className="pl-4 py-1 text-slate-500">// Реактивная подписка на Firestore:</div>
                  <div className="pl-4 text-slate-300">
                    <span className="text-amber-300">useEffect</span>(() =&gt; &#123;
                  </div>
                  <div className="pl-8 text-cyan-300">
                    const unsub = onSnapshot(collection(db, &apos;projects&apos;), snap =&gt; &#123;
                  </div>
                  <div className="pl-12 text-slate-300">
                    setItems(snap.docs.map(d =&gt; d.data()));
                  </div>
                  <div className="pl-8 text-cyan-300">&#125;);</div>
                  <div className="pl-8 text-purple-400">return () =&gt; unsub();</div>
                  <div className="pl-4 text-slate-300">&#125;, []);</div>
                  <div className="pl-4 text-sky-400">return &lt;<span className="text-rose-400">div</span> className=<span className="text-emerald-300">&quot;p-6 bg-slate-900&quot;</span>&gt;...&lt;/<span className="text-rose-400">div</span>&gt;;</div>
                  <div>&#125;</div>
                </div>
              )}

              {/* Tab 3: Interactive Live Preview */}
              {activeTab === 'preview' && (
                <div className="p-4 sm:p-5 bg-gradient-to-b from-[#090d18] to-[#07090e] min-h-[340px] flex flex-col justify-between">
                  <div>
                    {/* Simulated App Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                          ⚡
                        </div>
                        <span className="text-xs font-semibold text-white">Мой первый MVP: Запуск</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online в облаке
                      </span>
                    </div>

                    {/* Interactive Task List */}
                    <div className="space-y-2 mb-3">
                      {interactiveItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/5 hover:border-white/15 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 text-xs text-slate-200">
                            <CheckCircle2
                              className={`w-4 h-4 ${
                                item.status === 'done' ? 'text-emerald-400' : 'text-cyan-400 animate-spin'
                              }`}
                            />
                            <span>{item.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">
                            {item.status === 'done' ? 'Готово' : 'В процессе'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Input Form */}
                  <form onSubmit={handleAddItem} className="pt-2 border-t border-white/10">
                    <p className="text-[10px] text-slate-400 mb-1.5">
                      Попробуй интерактивность прямо сейчас:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Например: Добавить оплату Stripe"
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                      >
                        Добавить
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Status bar */}
              <div className="px-4 py-2 bg-[#06080e] border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Live Sync • 0 ошибок сборки
                </span>
                <span>Vibe Coding Stack 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
