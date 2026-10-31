import React from 'react';
import { Sparkles, Send, Youtube, Github, Linkedin, Twitter, ArrowUp, Compass, Heart } from 'lucide-react';
import { SOCIAL_LINKS } from '../data/courseData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (id: string) => {
    switch (id) {
      case 'telegram':
        return <Send className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'x':
        return <Twitter className="w-4 h-4" />;
      default:
        return <Compass className="w-4 h-4" />;
    }
  };

  const navLinks = [
    { name: 'Курс', href: '#hero' },
    { name: 'Преимущества', href: '#features' },
    { name: '3 Проекта', href: '#projects' },
    { name: 'Программа', href: '#curriculum' },
    { name: 'Методика', href: '#methodology' },
    { name: 'Результат', href: '#outcome' },
    { name: 'AI Генератор', href: '#generator' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <footer className="relative bg-[#05070b] border-t border-white/10 pt-16 pb-12 overflow-hidden text-slate-300 text-xs">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#080a13] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-xl font-bold font-mono text-white">
                Vibe<span className="text-cyan-400">Forge</span>
              </span>
            </div>

            <p className="text-sm text-slate-300 max-w-sm leading-relaxed font-normal">
              VibeForge — «Твори с AI». Практический образовательный курс по вайб-кодингу, разработке веб-приложений
              и созданию полноценных MVP с помощью современных инструментов искусственного интеллекта.
            </p>

            <div className="pt-2 text-xs font-mono text-slate-400">
              Продолжительность: 6–8 недель интенсивной практики
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Разделы лендинга
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-cyan-300 transition-colors inline-block py-0.5"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links & Community */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Сообщество и контакты
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Присоединяйтесь к сообществу вайб-кодеров, делитесь идеями и следите за обновлениями инструментов:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all text-xs font-mono"
                  title={`${item.name} (${item.username})`}
                >
                  {getSocialIcon(item.id)}
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Educational Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-mono">
          <div className="text-center sm:text-left space-y-1">
            <p>© {new Date().getFullYear()} VibeForge. «Твори с AI». Все права защищены.</p>
            <p className="text-slate-400">
              Учебные цели курса направлены на освоение практических навыков создания MVP.
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <span>Наверх</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
