import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Endpoint 1: MVP project architecture generator
        if (req.url === '/api/gemini/generate-mvp' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { idea, track } = JSON.parse(body || '{}');
              const apiKey = process.env.GEMINI_API_KEY;

              if (!apiKey) {
                res.statusCode = 503;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ 
                  error: 'GEMINI_API_KEY is not configured in the environment.',
                  isMockAllowed: true 
                }));
                return;
              }

              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build',
                  },
                },
              });

              const prompt = `Ты — ведущий эксперт по Vibe Coding и архитектор стартапов платформы VibeForge.
Пользователь описывает идею для создания MVP с помощью AI:
Идея: "${idea || 'Интерактивное веб-приложение для командной работы'}"
Выбранный трек/опыт: "${track || 'С нуля'}"

Сгенерируй профессиональный технический проект MVP в строгом JSON-формате:
{
  "title": "Креативное и технологичное название проекта (на английском или латинице)",
  "tagline": "Ёмкий слоган проекта на русском языке",
  "problemStatement": "Какую реальную проблему решает продукт (1-2 предложения)",
  "targetAudience": "Кто ключевой пользователь MVP",
  "techStack": {
    "frontend": "React 19 + TypeScript + Tailwind CSS + Lucide Icons",
    "backend": "Firebase Firestore & Firebase Auth (Google Sign-In)",
    "aiEngine": "Gemini 3.8 Flash (Server-Side Proxy)",
    "hosting": "Google Cloud Run / Vercel"
  },
  "databaseSchema": [
    { "collection": "users", "description": "Профили пользователей и метаданные" },
    { "collection": "projects", "description": "Основная бизнес-сущность приложения" },
    { "collection": "activity_logs", "description": "Лог действий и аналитика" }
  ],
  "starterPrompt": "Детальный мастер-промпт на русском языке для AI-ассистента в Cursor / AI Studio с указанием архитектуры, стилей Tailwind и ключевых компонентов...",
  "curriculumSteps": [
    { "step": 1, "moduleTitle": "Идея и планирование", "action": "Четко зафиксировать User Story Map и ключевую ценность MVP" },
    { "step": 2, "moduleTitle": "AI-инструменты и окружение", "action": "Сконфигурировать проект в Vite + TypeScript и подключить правила генерации" },
    { "step": 3, "moduleTitle": "Интерфейс и логика", "action": "Сгенерировать адаптивный интерфейс с темной темой и стейт-менеджментом" },
    { "step": 4, "moduleTitle": "База данных и авторизация", "action": "Подключить Firebase Auth и настроить правила безопасности Firestore" },
    { "step": 5, "moduleTitle": "Интеграция и тестирование", "action": "Связать фронтенд с Gemini API и протестировать граничные сценарии" },
    { "step": 6, "moduleTitle": "Деплой и запуск", "action": "Развернуть приложение в облаке и провести первый пользовательский тест" }
  ]
}

Верни ТОЛЬКО валидный JSON без кавычек markdown.`;

              const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: prompt,
                config: {
                  responseMimeType: 'application/json',
                },
              });

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(response.text || '{}');
            } catch (err: any) {
              console.error('Gemini Generation Error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                error: err.message || 'Ошибка генерации спецификации MVP через Gemini'
              }));
            }
          });
          return;
        }

        // Endpoint 2: AI Mentor Consultant based on ПРОГРАММА.md
        if (req.url === '/api/gemini/chat-assistant' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { message, history } = JSON.parse(body || '{}');

              // Load program markdown knowledge
              const programPath = path.resolve(__dirname, 'public/assets/aistudio/__________6d627d73.md');
              let programContent = '';
              try {
                if (fs.existsSync(programPath)) {
                  programContent = fs.readFileSync(programPath, 'utf-8');
                }
              } catch (readErr) {
                console.warn('Could not read program markdown file, proceeding with embedded summary:', readErr);
              }

              const apiKey = process.env.GEMINI_API_KEY;

              if (!apiKey) {
                // Graceful fallback for chat assistant
                const reply = getFallbackMentorAnswer(message);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ reply }));
                return;
              }

              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build',
                  },
                },
              });

              const systemInstruction = `Ты — AI-наставник курса VibeForge («Вайб-кодинг: от идеи до работающего MVP»). Твоя задача — отвечать на вопросы потенциальных студентов ТОЛЬКО на основе предоставленной базы знаний программы курса.

База знаний программы:
${programContent || `
Курс: "Вайб-кодинг: от идеи до работающего MVP"
Формат: 6-8 недель, нагрузка 4-6 часов в неделю, 24-48 часов практики.
Аудитория: новички, предприниматели, специалисты без опыта кодинга.
Ключевой результат: собственный опубликованный MVP с интерфейсом, логикой, базой данных, авторизацией и внешним API.
3 обязательных проекта:
1. Мини-проект (короткий цикл разработки, интерфейс, 1 сценарий, публикация).
2. Приложение с данными (интерфейс, БД с сохранением/чтением, авторизация, внешний API).
3. Итоговый MVP (проблема, аудитория, главный сквозной сценарий, БД, Auth, API, прохождение тестов, публичный адрес).
Принцип: ИИ пишет код, а студент учится проверять результат и управлять процессом.
Модель оплаты: платный курс, ценовой сегмент и точная стоимость ещё не утверждены.
Сертификация: решение пока не принято.
Бесплатный сценарий: базовый процесс строится на бесплатных тарифах сервисов.
`}

Правила:
1. Отвечай кратко, до 3-4 предложений. Используй маркированные списки, если перечисляешь пункты.
2. Подчёркивай, что курс ориентирован на практику: ИИ пишет код, а студент учится проверять и управлять процессом.
3. Если спрашивают про проекты, обязательно упомяни 3 этапа: мини-проект, приложение с БД, итоговый MVP.
4. Если вопрос выходит за рамки курса (например, "напиши мне код прямо сейчас", нерелевантные темы) — вежливо отказывай и возвращай к темам и программе курса.
5. Соблюдай точность: не обещай золотые горы, придерживайся программы. Отвечай дружелюбно и профессионально на русском языке.`;

              // Format conversation contents
              const contents: any[] = [];
              if (Array.isArray(history) && history.length > 0) {
                for (const turn of history.slice(-6)) {
                  contents.push({
                    role: turn.role === 'model' ? 'model' : 'user',
                    parts: [{ text: turn.text || '' }],
                  });
                }
              }
              contents.push({
                role: 'user',
                parts: [{ text: message || 'Расскажи о курсе' }],
              });

              const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents,
                config: {
                  systemInstruction,
                },
              });

              const text = response.text || 'Курс обучает полному циклу создания MVP с помощью AI за 6–8 недель практики.';
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ reply: text }));
            } catch (err: any) {
              console.error('Gemini Chat Assistant Error:', err);
              // Fallback answer based on keywords
              const bodyParsed = JSON.parse(body || '{}');
              const reply = getFallbackMentorAnswer(bodyParsed.message || '');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ reply }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

function getFallbackMentorAnswer(query: string): string {
  const q = (query || '').toLowerCase();
  if (q.includes('создам') || q.includes('проект') || q.includes('mvp') || q.includes('результат')) {
    return 'На курсе вы пройдете через 3 проектных этапа:\n• Мини-проект: первый рабочий интерфейс и сценарий;\n• Приложение с данными: подключение базы данных, авторизации и внешнего API;\n• Итоговый MVP: полноценный веб-продукт по вашей идее, развёрнутый по публичной ссылке.';
  }
  if (q.includes('кодить') || q.includes('опыт') || q.includes('новичок') || q.includes('программирован')) {
    return 'Предварительный опыт программирования не требуется! Курс построен на принципах вайб-кодинга: ИИ генерирует код, а вы учитесь формулировать задачи, проверять результаты и управлять архитектурой.';
  }
  if (q.includes('график') || q.includes('срок') || q.includes('длительн') || q.includes('недел') || q.includes('время') || q.includes('часов')) {
    return 'Курс рассчитан на 6–8 недель самостоятельного прохождения с рекомендуемой нагрузкой 4–6 часов в неделю (всего 24–48 часов практики). Вы можете учиться в удобном для вас темпе.';
  }
  return 'Курс VibeForge обучает созданию полноценных веб-приложений и MVP с помощью AI за 6–8 недель практики. Вы научитесь управлять искусственным интеллектом, проектировать базы данных и развертывать готовые продукты.';
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
