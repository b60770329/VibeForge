import React, { useState } from 'react';
import { AuthProvider } from './firebase/authContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { ProjectShowcase } from './components/ProjectShowcase';
import { Curriculum } from './components/Curriculum';
import { VibeMethodology } from './components/VibeMethodology';
import { OutcomeSection } from './components/OutcomeSection';
import { VibeMvpGenerator } from './components/VibeMvpGenerator';
import { FaqSection } from './components/FaqSection';
import { ApplicationModal } from './components/ApplicationModal';
import { UserDrawer } from './components/UserDrawer';
import { AiMentorChat } from './components/AiMentorChat';
import { Footer } from './components/Footer';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [isApplicationModalOpen, setApplicationModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string>('Быстрый старт (с нуля)');
  const [isUserDrawerOpen, setUserDrawerOpen] = useState(false);

  const handleOpenApplication = (track?: string) => {
    if (track) setSelectedTrack(track);
    setApplicationModalOpen(true);
  };

  const scrollToCurriculum = () => {
    const el = document.getElementById('curriculum');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToGenerator = () => {
    const el = document.getElementById('generator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Header with ScrollSpy and Trunk Test Active State */}
        <Header
          onOpenApplication={() => handleOpenApplication()}
          onOpenUserDrawer={() => setUserDrawerOpen(true)}
        />

        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <Hero
            onStartCreating={() => handleOpenApplication()}
            onExploreCurriculum={scrollToCurriculum}
            onOpenGenerator={scrollToGenerator}
          />

          {/* Features Section («Почему Vibe Coding?») */}
          <Features />

          {/* Project Showcase Section (Раздел 6: 3 Обязательных проекта студента) */}
          <ProjectShowcase onStartCreating={handleOpenApplication} />

          {/* Curriculum Section («Программа курса: 6 модулей») */}
          <Curriculum />

          {/* Vibe Methodology Section (Разделы 7, 8, 10: 8 шагов с ИИ, 3 уровня проверки, безопасность) */}
          <VibeMethodology />

          {/* Outcome Section («Результат курса: 7 критериев MVP и архитектура») */}
          <OutcomeSection onStartCreating={() => handleOpenApplication()} />

          {/* Interactive AI Generator Section (Powered by Gemini) */}
          <VibeMvpGenerator />

          {/* FAQ Section (Часто задаваемые вопросы и снятие возражений) */}
          <FaqSection onOpenApplication={handleOpenApplication} />
        </main>

        {/* Footer */}
        <Footer />

        {/* Contextual AI Mentor Floating Assistant */}
        <AiMentorChat onOpenApplication={handleOpenApplication} />

        {/* Modals & Drawers */}
        <ApplicationModal
          isOpen={isApplicationModalOpen}
          onClose={() => setApplicationModalOpen(false)}
          initialTrack={selectedTrack}
        />

        <UserDrawer
          isOpen={isUserDrawerOpen}
          onClose={() => setUserDrawerOpen(false)}
        />

        {/* Sticky Mobile Quick-Action Floating CTA Bar */}
        <div className="fixed bottom-4 left-4 right-4 z-30 md:hidden">
          <div className="p-2 rounded-2xl bg-[#090d18]/90 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={scrollToGenerator}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Идея</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenApplication()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
            >
              <span>Начать творить</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
