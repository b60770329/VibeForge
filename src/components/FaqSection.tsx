import React, { useState } from 'react';
import { COURSE_FAQS } from '../data/courseData';
import { HelpCircle, ChevronDown, Sparkles, MessageSquare, ArrowUpRight } from 'lucide-react';

interface FaqSectionProps {
  onOpenApplication: (track?: string) => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenApplication }) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(COURSE_FAQS[0].id);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Все вопросы' },
    { id: 'about', label: 'О курсе и опыте' },
    { id: 'tech', label: 'Технологии и стек' },
    { id: 'process', label: 'График и поддержка' },
    { id: 'price', label: 'Оплата и тарифы' },
  ];

  const filteredFaqs = activeCategory === 'all'
    ? COURSE_FAQS
    : COURSE_FAQS.filter((f) => f.category === activeCategory);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="relative py-24 sm:py-32 bg-[#07090e] border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-600/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono font-medium text-cyan-300">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Часто задаваемые вопросы</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Ответы на все{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-cyan-200">
              ключевые вопросы
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Всё, что вам нужно знать о формате обучения, предварительных требованиях,
            инструментах и результатах курса VibeForge.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/15 font-semibold'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#0a0e1c] border-cyan-500/30 shadow-xl shadow-cyan-950/20'
                    : 'bg-[#080b13]/60 border-white/5 hover:border-white/15'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <span className="text-sm sm:text-base font-bold text-white leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'rotate-180 bg-cyan-500/20 text-cyan-400'
                        : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-white/5">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Fast Action Card below FAQ */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#0a0d18] to-cyan-950/40 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Остались вопросы по программе?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Задайте любой специфический вопрос нашему ИИ-наставнику прямо в чате на сайте!
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenApplication()}
            className="flex-shrink-0 flex items-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 hover:opacity-95 transition-all duration-200"
          >
            <span>Подать заявку на курс</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
