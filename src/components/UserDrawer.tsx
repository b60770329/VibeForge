import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  LogOut,
  Bookmark,
  FolderCode,
  FileText,
  Clock,
  Trash2,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../firebase/authContext';
import { CURRICULUM_MODULES } from '../data/courseData';

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserDrawer: React.FC<UserDrawerProps> = ({ isOpen, onClose }) => {
  const {
    user,
    logout,
    applications,
    savedModuleIds,
    savedProjects,
    deleteMvpProject,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'applications' | 'modules' | 'projects'>('applications');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#04060a]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-md bg-[#090d18] border-l border-white/15 h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        <div>
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#07090e]">
            <div className="flex items-center gap-3">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Профиль'}
                  className="w-10 h-10 rounded-full ring-2 ring-cyan-500/40 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-sm">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-white truncate max-w-[200px]">
                  {user?.displayName || 'Пользователь VibeForge'}
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-[200px] font-mono">
                  {user?.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Закрыть кабинет"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 p-2 bg-[#06080e] border-b border-white/5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('applications')}
              className={`py-2 px-1 rounded-lg text-center transition-colors ${
                activeTab === 'applications'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Заявки ({applications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('modules')}
              className={`py-2 px-1 rounded-lg text-center transition-colors ${
                activeTab === 'modules'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              План ({savedModuleIds.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className={`py-2 px-1 rounded-lg text-center transition-colors ${
                activeTab === 'projects'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MVP ({savedProjects.length})
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-4">
            {/* Tab 1: Applications */}
            {activeTab === 'applications' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>ВАШИ ЗАЯВКИ НА КУРС</span>
                  <span>{applications.length} шт.</span>
                </div>

                {applications.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-2">
                    <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">У вас пока нет отправленных заявок.</p>
                    <p className="text-[11px] text-slate-500">
                      Нажмите «Начать творить», чтобы отправить заявку на выбранный трек.
                    </p>
                  </div>
                ) : (
                  applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{app.track}</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          {app.status === 'new' ? 'Получено' : app.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        ID: {app.id}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(app.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: Saved Modules */}
            {activeTab === 'modules' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>СОХРАНЁННЫЕ МОДУЛИ ПРОГРАММЫ</span>
                  <span>{savedModuleIds.length}/6</span>
                </div>

                {savedModuleIds.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-2">
                    <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">Вы пока не сохранили ни одного модуля.</p>
                    <p className="text-[11px] text-slate-500">
                      Отмечайте модули иконкой закладки в разделе «Программа».
                    </p>
                  </div>
                ) : (
                  savedModuleIds.map((modId) => {
                    const mod = CURRICULUM_MODULES.find((m) => m.id === modId);
                    if (!mod) return null;
                    return (
                      <div
                        key={mod.id}
                        className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-purple-400">
                            Модуль {mod.id} • {mod.durationLabel}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white">{mod.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{mod.shortDesc}</p>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Tab 3: Saved Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>СОХРАНЁННЫЕ MVP СПЕЦИФИКАЦИИ</span>
                  <span>{savedProjects.length} шт.</span>
                </div>

                {savedProjects.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-2">
                    <FolderCode className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">Нет сохранённых проектов.</p>
                    <p className="text-[11px] text-slate-500">
                      Сгенерируйте идею в блоке «AI Генератор» и сохраните её в профиль.
                    </p>
                  </div>
                ) : (
                  savedProjects.map((prj) => (
                    <div
                      key={prj.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-white">{prj.title}</h4>
                          <p className="text-[11px] text-slate-400">{prj.tagline}</p>
                        </div>
                        {prj.id && (
                          <button
                            type="button"
                            onClick={() => deleteMvpProject(prj.id!)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Удалить проект"
                            aria-label="Удалить"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 p-2 rounded-lg border border-cyan-500/20">
                        {prj.techStack?.frontend || 'React 19 + TypeScript'}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => prj.id && handleCopyPrompt(prj.id, prj.starterPrompt)}
                          className="flex items-center gap-1 text-[11px] font-mono text-slate-300 hover:text-white"
                        >
                          {copiedId === prj.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Скопировано</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-cyan-400" />
                              <span>Копировать промпт</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-white/10 bg-[#07090e]">
          <button
            type="button"
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/30 text-rose-300 font-medium text-xs transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
};
