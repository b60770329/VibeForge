import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, ArrowUpRight, User as UserIcon, LogOut, Bookmark, FolderCode, Layers } from 'lucide-react';
import { useAuth } from '../firebase/authContext';

interface HeaderProps {
  onOpenApplication: (track?: string) => void;
  onOpenUserDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenApplication, onOpenUserDrawer }) => {
  const { user, signInWithGoogle, logout, applications, savedModuleIds, savedProjects } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Курс', href: '#hero' },
    { name: 'Преимущества', href: '#features' },
    { name: 'Программа', href: '#curriculum' },
    { name: 'Результат', href: '#outcome' },
    { name: 'AI Генератор', href: '#generator' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07090e]/85 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-cyan-950/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#090b14] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 transition-transform group-hover:rotate-12 duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-mono">
                Vibe<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">Forge</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 -mt-1 font-semibold">
                Твори с AI
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-full transition-colors duration-200 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-expanded={userDropdownOpen}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Пользователь'}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-cyan-400/50"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-xs">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-xs font-medium text-slate-200 max-w-[110px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  {(applications.length > 0 || savedProjects.length > 0) && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </button>

                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0c101c] border border-white/15 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="text-xs text-slate-400">Вы вошли как</p>
                        <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenUserDrawer();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-cyan-400" />
                          Мой кабинет
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          {applications.length > 0 && <span className="bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded font-mono">{applications.length} заявка</span>}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenUserDrawer();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Bookmark className="w-4 h-4 text-purple-400" />
                          Сохранённые модули
                        </span>
                        <span className="text-[10px] text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded font-mono">
                          {savedModuleIds.length}/6
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenUserDrawer();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <FolderCode className="w-4 h-4 text-emerald-400" />
                          Проекты MVP
                        </span>
                        <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded font-mono">
                          {savedProjects.length}
                        </span>
                      </button>

                      <div className="h-px bg-white/10 my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Выйти
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Войти через Google</span>
              </button>
            )}

            {/* Primary CTA */}
            <button
              type="button"
              onClick={() => onOpenApplication()}
              className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-xs transition-transform duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 rounded-xl transition-all duration-300 group-hover:opacity-100 opacity-90" />
              <div className="relative flex items-center gap-1.5 px-4 py-2.5 rounded-[11px] bg-[#080b13] transition-colors duration-200 group-hover:bg-[#080b13]/80">
                <span className="text-white font-medium">Начать творить</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-cyan-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <button
                type="button"
                onClick={onOpenUserDrawer}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-cyan-400"
                aria-label="Личный кабинет"
              >
                <Layers className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#07090e]/95 backdrop-blur-xl border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 text-base font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/10">
                <div className="flex items-center gap-2.5">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-cyan-900 text-cyan-300 flex items-center justify-center text-xs font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">{user.displayName || user.email?.split('@')[0]}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[180px]">{user.email}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-400"
                  aria-label="Выйти"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  signInWithGoogle();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-sm font-medium text-white"
              >
                <UserIcon className="w-4 h-4 text-cyan-400" />
                Войти через Google
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenApplication();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20"
            >
              Начать творить
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
