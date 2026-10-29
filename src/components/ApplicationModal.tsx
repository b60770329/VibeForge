import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Sparkles, Send, User, Mail, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../firebase/authContext';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrack?: string;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  initialTrack = 'Быстрый старт (с нуля)',
}) => {
  const { user, signInWithGoogle, submitApplication } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [track, setTrack] = useState(initialTrack);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.displayName && !name) setName(user.displayName);
      if (user.email && !email) setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (initialTrack) setTrack(initialTrack);
  }, [initialTrack]);

  if (!isOpen) return null;

  const tracks = [
    {
      id: 'Быстрый старт (с нуля)',
      title: 'Быстрый старт (с нуля)',
      desc: 'Для тех, кто никогда не писал код и хочет создать первый продукт с AI',
    },
    {
      id: 'Для фаундеров и дизайнеров',
      title: 'Для фаундеров и дизайнеров',
      desc: 'Для проверки бизнес-гипотез и превращения макетов в рабочий софт',
    },
    {
      id: 'Для разработчиков (Level Up)',
      title: 'Для разработчиков (Level Up)',
      desc: 'Для ускорения разработки в 10 раз и внедрения AI в ежедневный стек',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Пожалуйста, укажите ваше имя');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Пожалуйста, укажите корректный email');
      return;
    }

    if (!user) {
      try {
        await signInWithGoogle();
      } catch (err: any) {
        setErrorMessage('Для подтверждения заявки необходимо авторизоваться через Google');
        return;
      }
    }

    setSubmitting(true);
    try {
      const appId = await submitApplication({
        name,
        email,
        track,
        comment,
      });
      setSubmittedAppId(appId);
    } catch (err: any) {
      setErrorMessage(err.message || 'Ошибка сохранения заявки в Firestore');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedAppId(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#04060a]/80 backdrop-blur-md transition-opacity"
        onClick={resetForm}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-3xl bg-[#090d19] border border-white/15 p-6 sm:p-8 shadow-2xl z-10 my-8 overflow-hidden">
        {/* Top ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[90px] pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          onClick={resetForm}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          aria-label="Закрыть модальное окно"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedAppId ? (
          /* Success Screen */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white">Заявка успешно принята!</h3>

            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Мы сохранили вашу заявку в базе данных курса. Данные привязаны к вашему профилю Google: <strong className="text-white">{user?.email}</strong>.
            </p>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 font-mono text-xs text-slate-300 max-w-sm mx-auto space-y-1">
              <div className="text-slate-400">Номер заявки:</div>
              <div className="font-bold text-cyan-400">{submittedAppId}</div>
              <div className="text-[11px] text-slate-400 pt-1">Выбранный трек: {track}</div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Вернуться к сайту
              </button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <div className="space-y-6">
            <div className="space-y-1 pr-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-semibold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Запись на обучение Vibe Coding</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Начни творить с AI</h3>
              <p className="text-xs sm:text-sm text-slate-300 font-normal">
                Заполните форму, чтобы забронировать место на потоке курса (6–8 недель практики).
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Track Selection */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2 font-semibold">
                  Выберите трек обучения:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {tracks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setTrack(t.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        track === t.id
                          ? 'bg-cyan-950/40 border-cyan-400/80 shadow-md shadow-cyan-950/20'
                          : 'bg-white/[0.03] border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${track === t.id ? 'text-cyan-300' : 'text-white'}`}>
                          {t.title}
                        </span>
                        <input
                          type="radio"
                          name="track"
                          checked={track === t.id}
                          onChange={() => setTrack(t.id)}
                          className="accent-cyan-400"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="name-input" className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                    Ваше имя:
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      id="name-input"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Алексей"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06080e] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email-input" className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                    Email для связи:
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      id="email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06080e] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes-input" className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                  Есть ли идея для MVP? (необязательно)
                </label>
                <textarea
                  id="notes-input"
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Опишите в 1–2 предложениях, что хотите создать на курсе..."
                  className="w-full px-3 py-2.5 rounded-xl bg-[#06080e] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Сохранение в Firestore...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{user ? 'Отправить заявку' : 'Войти через Google и отправить'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Данные защищены Firebase Auth & Security Rules</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
