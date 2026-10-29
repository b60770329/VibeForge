import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isActionable?: boolean;
}

interface AiMentorChatProps {
  onOpenApplication: (track?: string) => void;
}

export const AiMentorChat: React.FC<AiMentorChatProps> = ({ onOpenApplication }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulseActive, setPulseActive] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Turn off initial pulse after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setPulseActive(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard Escape listener to close chat and auto-focus on open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const presetChips = [
    'Что я создам на курсе?',
    'Мне нужно уметь кодить?',
    'Какой график обучения?',
  ];

  const handleOpen = () => {
    setIsOpen(true);
    setHasInteracted(true);
    setPulseActive(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: query.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages.slice(-4).map((m) => ({
        role: m.sender === 'ai' ? 'model' : 'user',
        text: m.text,
      }));

      const res = await fetch('/api/gemini/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          history,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      const aiReply = data.reply || 'Курс ориентирован на практику: ИИ пишет код, а вы учитесь управлять процессом и создаете свой MVP.';

      const aiMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        isActionable: true,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.warn('AI Mentor request error:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'ai',
        text: 'Сейчас я обновляю свои знания. Оставьте заявку, и куратор команды ответит на любые ваши вопросы лично!',
        isActionable: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside aria-label="ИИ-наставник VibeForge">
      {/* Floating Action Button (FAB) */}
      {!isOpen && (
        <div className="fixed bottom-20 md:bottom-7 right-5 md:right-7 z-40 flex items-center gap-3">
          {/* Tooltip on hover/initial */}
          <div
            className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0b0e1b] border border-cyan-500/30 text-xs font-medium text-slate-200 shadow-xl shadow-cyan-950/40 backdrop-blur-md transition-opacity duration-200 ${
              showTooltip || (!hasInteracted && pulseActive) ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Задай вопрос по курсу</span>
          </div>

          <button
            type="button"
            onClick={handleOpen}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            aria-label="Открыть чат с ИИ-наставником по курсу"
            className={`relative group w-14 h-14 rounded-2xl flex items-center justify-center p-[2px] transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              pulseActive ? 'animate-pulse' : ''
            }`}
          >
            {/* Outer gradient glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 blur-md opacity-80 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative w-full h-full rounded-[14px] bg-[#080b14] flex items-center justify-center border border-white/20 group-hover:border-white/40 shadow-2xl">
              <Sparkles className="w-6 h-6 text-cyan-300 transition-transform group-hover:rotate-12 duration-300" />
              {/* Online pulse dot */}
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-[#080b14]" />
            </div>
          </button>
        </div>
      )}

      {/* Chat Window Widget */}
      {isOpen && (
        <div className="fixed bottom-4 md:bottom-7 right-4 md:right-7 z-50 w-[calc(100vw-32px)] sm:w-[410px] h-[540px] max-h-[85vh] rounded-3xl bg-[#090d18] border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 flex flex-col justify-between overflow-hidden backdrop-blur-2xl animate-in slide-in-from-bottom-5 duration-250">
          {/* Widget Header */}
          <div className="px-5 py-4 bg-[#07090e] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 p-[1.5px] shadow-md shadow-purple-500/20">
                <div className="w-full h-full bg-[#080a13] rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white">ИИ-наставник VibeForge</h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  База знаний программы курса
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Закрыть чат (Esc)"
              title="Закрыть (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#07090e]/60">
            {/* Empty State / Welcome Screen */}
            {messages.length === 0 && (
              <div className="space-y-4 pt-1">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Привет! Я ИИ-наставник курса</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    Знаю всё о программе курса, трёх проектных этапах, учебной нагрузке и том, как вайб-кодинг помогает создать первый MVP.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-slate-400 block px-1">
                    Частые вопросы студентов:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {presetChips.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(chip)}
                        className="text-left px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 text-xs text-slate-200 hover:text-cyan-300 transition-all flex items-center justify-between group"
                      >
                        <span>{chip}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-cyan-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Rendered Messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col space-y-2 ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white rounded-tr-none shadow-md shadow-cyan-950/30 font-medium'
                      : 'bg-[#0f1424] border border-white/10 text-slate-100 rounded-tl-none shadow-md font-normal'
                  }`}
                >
                  {msg.text}
                </div>

                {/* In-chat Next Step CTA after AI answers */}
                {msg.sender === 'ai' && msg.isActionable && (
                  <div className="max-w-[88%] p-3 rounded-xl bg-gradient-to-r from-purple-950/40 to-cyan-950/40 border border-cyan-500/30 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-white block">
                        Готовы начать творить?
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Бронируйте место на потоке
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onOpenApplication();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-[11px] shrink-0 transition-colors"
                    >
                      Записаться
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Loading / Typing Indicator with 3 dots */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="p-3.5 rounded-2xl bg-[#0f1424] border border-white/10 text-slate-300 rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[#07090e] border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Спроси о программе, проектах или сроках..."
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-slate-950 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Отправить вопрос"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="text-[10px] text-slate-500 font-mono mt-1.5 text-center">
              Отвечает строго на основе утверждённой программы курса
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
