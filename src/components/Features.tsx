import React, { useState } from 'react';
import { Zap, Sparkles, Network, ArrowUpRight, Check, Layers, Cpu, Compass } from 'lucide-react';
import { COURSE_FEATURES } from '../data/courseData';
import { FeatureItem } from '../types';

export const Features: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const getFeatureIcon = (id: string) => {
    switch (id) {
      case 'speed':
        return <Zap className="w-6 h-6 text-cyan-400" />;
      case 'no-routine':
        return <Sparkles className="w-6 h-6 text-purple-400" />;
      case 'architecture':
        return <Network className="w-6 h-6 text-sky-400" />;
      default:
        return <Cpu className="w-6 h-6 text-cyan-400" />;
    }
  };

  const getGlowColor = (color: FeatureItem['color']) => {
    switch (color) {
      case 'cyan':
        return 'group-hover:border-cyan-500/50 group-hover:shadow-[0_0_35px_-5px_rgba(6,182,212,0.25)]';
      case 'purple':
        return 'group-hover:border-purple-500/50 group-hover:shadow-[0_0_35px_-5px_rgba(168,85,247,0.25)]';
      case 'blue':
        return 'group-hover:border-sky-500/50 group-hover:shadow-[0_0_35px_-5px_rgba(56,189,248,0.25)]';
    }
  };

  return (
    <section id="features" className="relative py-24 md:py-32 bg-[#06080d] overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-cyan-400">
            <Compass className="w-3.5 h-3.5" />
            <span>Парадигма разработки нового времени</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Почему{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
              Vibe Coding?
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Вайб-кодинг меняет правила игры. Вместо заучивания синтаксиса и бесконечной рутины вы становитесь
            режиссёром собственного продукта, управляя искусственным интеллектом как старшим инженером.
          </p>
        </div>

        {/* 3 Main Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {COURSE_FEATURES.map((feature) => (
            <div
              key={feature.id}
              onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
              className={`group relative rounded-2xl bg-[#090d18] border border-white/10 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer ${getGlowColor(
                feature.color
              )} ${selectedFeature === feature.id ? 'ring-2 ring-cyan-400/60' : ''}`}
            >
              {/* Subtle grid in card */}
              <div className="absolute inset-0 bg-dots-cyber opacity-30 rounded-2xl pointer-events-none" />

              <div>
                {/* Card Top: Number & Tag */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-lg">
                    {getFeatureIcon(feature.id)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-400 group-hover:text-cyan-300 transition-colors">
                      {feature.tag}
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-500">
                      {feature.number}
                    </span>
                  </div>
                </div>

                {/* Card Title */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>

                {/* Card Description */}
                <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                  {feature.description}
                </p>

                {/* Feature Bullets */}
                <div className="space-y-2.5 pt-4 border-t border-white/5">
                  {feature.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Metric */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-300 font-semibold">
                  {feature.metrics}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 group-hover:text-white transition-colors">
                  <span>Подробнее</span>
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Comparison: Traditional vs Vibe Coding */}
        <div className="rounded-2xl bg-[#090c16] border border-white/10 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                Сравнение: Традиционный путь vs Vibe Coding
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Как искусственный интеллект устраняет барьер входа и сокращает цикл проверки идей
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-full">
              <span>Экономия времени: до 85%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {/* Traditional */}
            <div className="space-y-3 p-5 rounded-xl bg-white/[0.02] border border-rose-500/20">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono flex items-center justify-between">
                <span>Традиционная разработка</span>
                <span className="text-slate-500 text-[10px]">3–6 месяцев</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold">✕</span> Месяцы изучения синтаксиса и алгоритмов
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold">✕</span> Часы настройки бандлеров, конфигов и окружения
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold">✕</span> Медленный бойлерплейт и ручная верстка каждого элемента
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold">✕</span> Высокий риск бросить проект до первого релиза
                </li>
              </ul>
            </div>

            {/* Vibe Coding */}
            <div className="space-y-3 p-5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 shadow-lg shadow-cyan-950/20">
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono flex items-center justify-between">
                <span>Vibe Coding с VibeForge</span>
                <span className="text-cyan-400 text-[10px] font-bold">6–8 недель</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">✓</span> Фокус на логике и ценности продукта с первого дня
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">✓</span> AI пишет интерфейсы и функции под вашим контролем
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">✓</span> Понимание архитектуры, базы данных и безопасности
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">✓</span> Реально работающий, развернутый в облаке MVP
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
