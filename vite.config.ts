import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
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
