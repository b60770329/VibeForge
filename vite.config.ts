import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

// Clean, compact, authoritative knowledge base from ПРОГРАММА.md
const COURSE_KNOWLEDGE_BASE = `
Паспорт курса «Вайб-кодинг: от идеи до работающего MVP»:
- Назначение: Практический курс для новичков, предпринимателей и специалистов без опыта кодинга.
- Главная цель: Самостоятельно создать и опубликовать рабочий MVP по собственной идее (интерфейс, бизнес-логика, база данных, авторизация, внешний API, тесты, публичный URL).
- Ключевой принцип: «ИИ пишет код, студент отвечает за результат». Практика важнее теории, переносимые навыки, проверяемый результат.
- Параметры: Продолжительность 6–8 недель, нагрузка 4–6 часов в неделю, общий объем 24–48 часов практики.
- 3 обязательных проектных этапа:
  1. Мини-проект: освоение короткого цикла разработки с ИИ, простой интерфейс, 1 рабочий сценарий, проверка и публикация.
  2. Приложение с данными: интеграция основных компонентов (интерфейс, БД с сохранением/чтением, авторизация, внешний API).
  3. Итоговый MVP: продукт по собственной идее (четкая проблема и ЦА, один сквозной сценарий от начала до конца, БД, Auth, API, проверка тестами, публичный деплой).
- 6 модулей программы:
  1. Вайб-кодинг и подготовка среды (идея, PRD, User Story Map, безопасная работа с данными).
  2. Постановка задач ИИ и первый мини-проект (декомпозиция, генерация интерфейса, итерации).
  3. Основы кода и отладка (структура приложения, чтение изменений, исправление ошибок малыми шагами).
  4. Проектирование приложения с данными (модели данных, NoSQL/Firestore, CRUD операции, валидация).
  5. Авторизация и внешние API (Google Auth, сессии, REST API / Gemini API, обработка ошибок).
  6. Тестирование, деплой и защита (E2E сценарии, автоматические проверки, Cloud Run / Vercel, чек-лист).
- Тарифы и условия: Базовый сценарий строится на бесплатных тарифах сервисов. Модель оплаты курса — платная (ценовой сегмент уточняется). Решение о сертификации пока обсуждается.
`;

async function callWithRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 300): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

function getFallbackMentorAnswer(query: string): string {
  const q = (query || '').toLowerCase();
  if (q.includes('создам') || q.includes('проект') || q.includes('mvp') || q.includes('результат')) {
    return 'На курсе вы создадите 3 проекта:\n• Мини-проект: первый рабочий интерфейс и сценарий;\n• Приложение с данными: подключение базы данных, авторизации и внешнего API;\n• Итоговый MVP: полноценный веб-продукт по вашей идее, развёрнутый по публичной ссылке.';
  }
  if (q.includes('кодить') || q.includes('опыт') || q.includes('новичок') || q.includes('программирован') || q.includes('сложно')) {
    return 'Предварительный опыт программирования не нужен! Курс построен на принципах вайб-кодинга: ИИ генерирует код, а вы учитесь формулировать задачи, проверять результаты и управлять архитектурой.';
  }
  if (q.includes('график') || q.includes('срок') || q.includes('длительн') || q.includes('недел') || q.includes('время') || q.includes('часов') || q.includes('нагрузк')) {
    return 'Курс рассчитан на 6–8 недель самостоятельного прохождения с рекомендуемой нагрузкой 4–6 часов в неделю (всего 24–48 часов практики). Вы можете учиться в удобном для вас темпе.';
  }
  if (q.includes('цен') || q.includes('стоимост') || q.includes('скольк') || q.includes('плат')) {
    return 'Курс планируется платным, точный ценовой сегмент сейчас финализируется. При этом сам учебный процесс строится на бесплатных тарифах AI-сервисов и облачных платформ.';
  }
  if (q.includes('сертифик')) {
    return 'Решение о сертификации в текущей версии программы ещё не утверждено: главный акцент сделан на реальный осязаемый результат — работающий и опубликованный MVP в вашем портфолио.';
  }
  return 'Курс VibeForge обучает созданию полноценных веб-приложений и MVP с помощью AI за 6–8 недель практики. Вы научитесь управлять искусственным интеллектом, проектировать базы данных и развертывать готовые продукты.';
}

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

              const response = await callWithRetry(() =>
                ai.models.generateContent({
                  model: 'gemini-3.8-flash',
                  contents: prompt,
                  config: {
                    responseMimeType: 'application/json',
                  },
                })
              );

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(response.text || '{}');
            } catch (err: any) {
              console.warn('Gemini Generation transient fallback:', err?.message);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                error: err?.message || 'Ошибка генерации спецификации MVP через Gemini'
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
            let messageText = '';
            try {
              const parsed = JSON.parse(body || '{}');
              messageText = parsed.message || '';
              const history = parsed.history;
              const apiKey = process.env.GEMINI_API_KEY;

              if (!apiKey) {
                const reply = getFallbackMentorAnswer(messageText);
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
${COURSE_KNOWLEDGE_BASE}

Правила:
1. Отвечай кратко, до 3-4 предложений. Используй маркированные списки, если перечисляешь пункты.
2. Подчёркивай, что курс ориентирован на практику: ИИ пишет код, а студент учится проверять и управлять процессом.
3. Если спрашивают про проекты, обязательно упомяни 3 этапа: мини-проект, приложение с БД, итоговый MVP.
4. Если вопрос выходит за рамки курса (например, "напиши мне код прямо сейчас", нерелевантные темы) — вежливо отказывай и возвращай к темам и программе курса.
5. Соблюдай точность: не обещай золотые горы, придерживайся программы. Отвечай дружелюбно и профессионально на русском языке.`;

              const contents: any[] = [];
              if (Array.isArray(history) && history.length > 0) {
                for (const turn of history.slice(-4)) {
                  contents.push({
                    role: turn.role === 'model' ? 'model' : 'user',
                    parts: [{ text: turn.text || '' }],
                  });
                }
              }
              contents.push({
                role: 'user',
                parts: [{ text: messageText || 'Расскажи о курсе' }],
              });

              const response = await callWithRetry(() =>
                ai.models.generateContent({
                  model: 'gemini-3.8-flash',
                  contents,
                  config: {
                    systemInstruction,
                  },
                })
              );

              const text = response.text || getFallbackMentorAnswer(messageText);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ reply: text }));
            } catch (err: any) {
              console.warn('Gemini chat assistant fallback applied due to network state:', err?.message);
              const reply = getFallbackMentorAnswer(messageText);
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
