import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

// Authoritative knowledge base from ПРОГРАММА.md
const COURSE_KNOWLEDGE_BASE = `
Паспорт курса «Вайб-кодинг: от идеи до работающего MVP»:
- Назначение: Практический курс для новичков, предпринимателей и специалистов без предварительного опыта программирования.
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
  5. Авторизация и внешние API (Google Auth, сессии, REST API / Gemini API, обработка лимитов).
  6. Тестирование, деплой и защита (E2E сценарии, автоматические проверки, Cloud Run / Vercel, чек-лист).
- Тарифы и условия: Базовый сценарий строится на бесплатных тарифах сервисов. Модель оплаты курса — платная (ценовой сегмент уточняется). Решение о сертификации пока обсуждается.
`;

function getFallbackMentorAnswer(query: string): string {
  const q = (query || '').toLowerCase().trim();

  // 1. Greetings
  if (
    /^(привет|здравствуй|добрый день|добрый вечер|доброе утро|хай|салют)/iu.test(q) ||
    q === 'привет' ||
    q === 'здравствуйте'
  ) {
    return 'Здравствуйте! Я ИИ-наставник курса VibeForge («Вайб-кодинг: от идеи до работающего MVP»). Готов ответить на любые вопросы о программе, трёх проектах, графике или формате обучения. Что вас интересует?';
  }

  // 2. Off-topic questions (geopolitics, weather, countries, cooking, celebrities, current events)
  const offTopicTriggers = [
    'погод', 'москв', 'питер', 'эквадор', 'росси', 'сша', 'америк', 'европ', 'кита',
    'дожд', 'градус', 'температур', 'солнц', 'прогноз', 'происходит в', 'случилось в',
    'анекдот', 'шутк', 'рецепт', 'борщ', 'еда', 'кулинар', 'доллар', 'евро', 'курс валют',
    'биткоин', 'крипт', 'футбол', 'хоккей', 'спорт', 'политик', 'президент', 'выборы',
    'фильм', 'кино', 'сериал', 'песн', 'музык', 'стих', 'столиц', 'кто ты такой',
    'расскажи сказку', 'сказк', 'сколько сейчас времени', 'который час', 'какой сегодня день', 'какое число'
  ];
  if (offTopicTriggers.some(t => q.includes(t))) {
    return 'Я — ИИ-наставник курса VibeForge и консультирую исключительно по вопросам программы обучения, вайб-кодингу и созданию MVP. О новостях, странах, погоде или посторонних темах я рассказать не смогу. Спросите меня о 3 проектах курса, формате обучения или графике занятий!';
  }

  // 3. Direct code generation attempts
  if (
    q.includes('напиши код') ||
    q.includes('напиши скрипт') ||
    q.includes('напиши функцию') ||
    q.includes('напиши программу') ||
    q.includes('сгенерируй код') ||
    q.includes('создай мне сайт') ||
    q.includes('сделай сайт')
  ) {
    return 'На курсе вы научитесь самостоятельно управлять ИИ в Cursor и AI Studio для генерации чистого кода и запуска проектов. Однако здесь, в роли пресейл-наставника, я отвечаю на вопросы о программе, формате и этапах обучения. Нажмите «Записаться», чтобы освоить этот навык на практике!';
  }

  // 4. Duration, schedule, workload ("сколько длится", "срок", "недели", "часы", "график")
  const isDurationQuery = (
    /\b(длит\w*|продлит\w*|продолжительност\w*)\b/iu.test(q) ||
    /\b(график\w*|расписани\w*)\b/iu.test(q) ||
    /\b(скольк\w*)\s+(длит\w*|ид[её]т|занимает|недел\w*|времени|часов)/iu.test(q) ||
    /\b(сколько\s+часов\s+в\s+неделю)\b/iu.test(q) ||
    /\b(нагрузк\w*|интенсивност\w*)\s+(в\s+неделю|обучени\w*|на\s+курсе)/iu.test(q) ||
    /\b(срок\w*|период)\s+(обучени\w*|курса)/iu.test(q) ||
    /\b(когда\s+(старт\w*|начало|начинается|поток|набор))/iu.test(q) ||
    (q.includes('недел') && (q.includes('курс') || q.includes('обучен') || q.includes('скольк') || q.includes('длит')))
  );

  if (isDurationQuery) {
    return 'Продолжительность курса — 6–8 недель при самостоятельной нагрузке 4–6 часов в неделю (всего 24–48 часов практики). Обучение проходит в удобном темпе, вы сможете комфортно совмещать его с работой или бизнесом.';
  }

  // 5. Price & tuition ("сколько стоит", "цена", "оплата", "стоимость")
  const isPriceQuery = (
    q.includes('цен') ||
    q.includes('стоимост') ||
    q.includes('стоить') ||
    q.includes('плат') ||
    q.includes('оплат') ||
    q.includes('рубл') ||
    q.includes('деньг') ||
    q.includes('прайс') ||
    q.includes('тариф') ||
    q.includes('рассрочк') ||
    (q.includes('скольк') && (q.includes('стоит') || q.includes('отдать')))
  );

  if (isPriceQuery) {
    return 'Курс планируется платным, точная стоимость и тарифные сетки сейчас финализируются перед стартом набора. При этом все учебные проекты строятся на бесплатных тарифах AI-сервисов и облачных провайдеров, поэтому дополнительных расходов на инфраструктуру не потребуется.';
  }

  // 6. Projects and MVP outcome ("что я создам", "проекты", "mvp")
  if (
    q.includes('создам') ||
    q.includes('проект') ||
    q.includes('mvp') ||
    q.includes('итог') ||
    q.includes('результат') ||
    q.includes('что получ') ||
    q.includes('продукт')
  ) {
    return 'На курсе вы создадите 3 проекта:\n• 1. Мини-проект — быстрый рабочий прототип с одним сценарием и публикацией;\n• 2. Приложение с данными — веб-сервис с базой данных, авторизацией и внешним API;\n• 3. Итоговый MVP — полноценный продукт по вашей собственной идее, развёрнутый по публичной ссылке в интернете.';
  }

  // 7. Coding experience & prerequisites ("нужно ли уметь кодить", "новичок", "с нуля")
  if (
    q.includes('кодить') ||
    q.includes('опыт') ||
    q.includes('новичок') ||
    q.includes('с нуля') ||
    q.includes('программирован') ||
    q.includes('сложно') ||
    q.includes('знать') ||
    q.includes('язык') ||
    q.includes('гуманитар') ||
    q.includes('базов')
  ) {
    return 'Предварительный опыт программирования не требуется! Курс рассчитан на новичков, предпринимателей и специалистов. Главный принцип вайб-кодинга: ИИ генерирует код, а вы учитесь правильно ставить задачи, проверять результат и управлять архитектурой проекта.';
  }

  // 8. Certificate
  if (q.includes('сертифик') || q.includes('диплом') || q.includes('документ') || q.includes('аттестат')) {
    return 'Решение о сертификации в текущей версии программы ещё не принято. Главным подтверждением ваших навыков станет не бумажный сертификат, а работающий опубликованный веб-сервис (MVP) и репозиторий в вашем портфолио.';
  }

  // 9. Technology stack & tools
  if (
    q.includes('стек') ||
    q.includes('технолог') ||
    q.includes('инструмент') ||
    q.includes('cursor') ||
    q.includes('react') ||
    q.includes('typescript') ||
    q.includes('firebase') ||
    q.includes('баз')
  ) {
    return 'В процессе обучения вы освоите:\n• AI-конструкторы и AI IDE (Cursor, Claude, Google AI Studio);\n• Фронтенд на React 19, TypeScript и Tailwind CSS;\n• Облачную базу данных Firestore и авторизацию Google Auth;\n• Интеграцию внешних интеллектуальных API (Gemini Flash);\n• Публичный деплой на Vercel или Google Cloud Run.';
  }

  // 10. Security & API keys
  if (q.includes('безопасн') || q.includes('парол') || q.includes('ключ') || q.includes('секрет')) {
    return 'Курс обучает строгим правилам безопасности: хранению секретов в переменных окружения, разделению тестовых и рабочих данных, защите правил доступа к БД (Firestore Security Rules) и проверке сгенерированного кода на уязвимости.';
  }

  // 11. Testing & Review
  if (q.includes('проверк') || q.includes('тест') || q.includes('куратор') || q.includes('оценк') || q.includes('сдач')) {
    return 'Оценка проекта проходит на 3 уровнях:\n• 1. Автоматические тесты (работоспособность сценариев и сохранение данных);\n• 2. Анализ ИИ (соответствие ТЗ, архитектура и обработка ошибок);\n• 3. Технический чек-лист перед публичным развёртыванием.';
  }

  // 12. Format & Support
  if (q.includes('формат') || q.includes('поддержк') || q.includes('наставник') || q.includes('сообществ') || q.includes('чат')) {
    return 'Обучение проходит в самостоятельном онлайн-формате: практические видеоуроки, интерактивные тренажеры, ИИ-наставник для разбора ошибок и закрытое сообщество студентов для обмена опытом.';
  }

  // 13. Enrollment & How to start
  if (q.includes('записат') || q.includes('поступ') || q.includes('начать') || q.includes('заявк') || q.includes('купить')) {
    return 'Чтобы записаться на курс, нажмите кнопку «Записаться» прямо здесь в чате или «Начать творить» в шапке сайта, выберите подходящий трек и отправьте заявку. Место будет закреплено за вами!';
  }

  // 15. Check if query is completely unrelated to course topics
  const hasCourseRelation = [
    'курс', 'обучен', 'программ', 'модул', 'урок', 'заняти', 'практик', 'домашк', 'лекци',
    'вайб', 'vibe', 'кодинг', 'код', 'программир', 'разработк', 'разработчик',
    'mvp', 'проект', 'стартап', 'сервис', 'приложен', 'сайт',
    'ии', 'ai', 'нейросет', 'промпт', 'prompt', 'cursor', 'gemini', 'chatgpt', 'gpt', 'claude',
    'react', 'typescript', 'frontend', 'фронтенд', 'бэкенд', 'backend', 'firestore', 'баз', 'бд', 'auth', 'авториз',
    'сертифик', 'диплом', 'документ', 'стоимост', 'цен', 'оплат', 'тариф', 'платн', 'бесплатн', 'рассрочк',
    'длит', 'недел', 'график', 'нагрузк', 'расписан', 'старт', 'поток', 'записат', 'поступ', 'заявк',
    'новичок', 'с нуля', 'опыт', 'сложно', 'гуманитар', 'стек', 'технолог', 'деплой', 'тест'
  ].some(k => q.includes(k));

  if (!hasCourseRelation && q.length > 5) {
    return 'Я — ИИ-наставник курса VibeForge («Вайб-кодинг: от идеи до работающего MVP»). Я консультирую исключительно по вопросам программы обучения, созданию MVP и инструментам вайб-кодинга. О посторонних темах рассказать не смогу. Задайте вопрос о программе, проектах или графике занятий!';
  }

  return 'Курс «Вайб-кодинг: от идеи до работающего MVP» длится 6–8 недель (4–6 ч/нед) и учит создавать веб-приложения с ИИ даже с нуля. За время курса вы создадите 3 проекта, включая собственный опубликованный MVP с базой данных и авторизацией. Спросите меня о 3 проектах курса, графике или требованиях к опыту!';
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

              if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
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
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                  responseMimeType: 'application/json',
                },
              });

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(response.text || '{}');
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                error: err?.message || 'Ошибка генерации спецификации MVP через Gemini'
              }));
            }
          });
          return;
        }

        // Endpoint 2: AI Mentor Consultant
        if (req.url === '/api/gemini/chat-assistant' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            let messageText = '';
            try {
              const parsed = JSON.parse(body || '{}');
              messageText = (parsed.message || '').trim();
              const apiKey = process.env.GEMINI_API_KEY;

              // Check if query is an immediate deterministic match (off-topic refusal, duration, price, greetings)
              const q = messageText.toLowerCase();
              const hasOffTopic = [
                'погод', 'москв', 'питер', 'эквадор', 'росси', 'сша', 'америк', 'европ', 'кита',
                'дожд', 'градус', 'температур', 'солнц', 'прогноз', 'происходит в', 'случилось в',
                'анекдот', 'шутк', 'рецепт', 'борщ', 'еда', 'кулинар', 'доллар', 'евро', 'курс валют',
                'биткоин', 'крипт', 'футбол', 'хоккей', 'спорт', 'политик', 'президент', 'выборы',
                'фильм', 'кино', 'сериал', 'песн', 'музык', 'стих', 'столиц', 'кто ты такой',
                'расскажи сказку', 'сказк', 'сколько сейчас времени', 'который час', 'какой сегодня день', 'какое число'
              ].some(t => q.includes(t));

              const isDurationQuery = (
                /\b(длит\w*|продлит\w*|продолжительност\w*)\b/iu.test(q) ||
                /\b(график\w*|расписани\w*)\b/iu.test(q) ||
                /\b(скольк\w*)\s+(длит\w*|ид[её]т|занимает|недел\w*|времени|часов)/iu.test(q) ||
                /\b(сколько\s+часов\s+в\s+неделю)\b/iu.test(q) ||
                /\b(нагрузк\w*|интенсивност\w*)\s+(в\s+неделю|обучени\w*|на\s+курсе)/iu.test(q) ||
                /\b(срок\w*|период)\s+(обучени\w*|курса)/iu.test(q) ||
                /\b(когда\s+(старт\w*|начало|начинается|поток|набор))/iu.test(q) ||
                (q.includes('недел') && (q.includes('курс') || q.includes('обучен') || q.includes('скольк') || q.includes('длит')))
              );

              const hasCourseWords = [
                'курс', 'обучен', 'программ', 'модул', 'урок', 'заняти', 'практик', 'домашк', 'лекци',
                'вайб', 'vibe', 'кодинг', 'код', 'программир', 'разработк', 'разработчик',
                'mvp', 'проект', 'стартап', 'сервис', 'приложен', 'сайт',
                'ии', 'ai', 'нейросет', 'промпт', 'prompt', 'cursor', 'gemini', 'chatgpt', 'gpt', 'claude',
                'react', 'typescript', 'frontend', 'фронтенд', 'бэкенд', 'backend', 'firestore', 'баз', 'бд', 'auth', 'авториз',
                'сертифик', 'диплом', 'документ', 'стоимост', 'цен', 'оплат', 'тариф', 'платн', 'бесплатн', 'рассрочк',
                'длит', 'недел', 'график', 'нагрузк', 'расписан', 'старт', 'поток', 'записат', 'поступ', 'заявк',
                'новичок', 'с нуля', 'опыт', 'сложно', 'гуманитар', 'стек', 'технолог', 'деплой', 'тест'
              ].some(k => q.includes(k));

              const isGreeting = /^(привет|здравствуй|добрый день|добрый вечер|доброе утро|хай|салют)/iu.test(q);

              // If it's a clear off-topic, not related to course, duration or greeting, answer accurately
              if (hasOffTopic || (!hasCourseWords && !isGreeting && q.length > 5) || isDurationQuery) {
                const reply = getFallbackMentorAnswer(messageText);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ reply }));
                return;
              }

              if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
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

              const userPrompt = `Ты — AI-наставник курса VibeForge («Вайб-кодинг: от идеи до работающего MVP»). Твоя задача — отвечать на вопросы потенциальных студентов ТОЛЬКО на основе предоставленной базы знаний программы курса.

База знаний программы курса:
${COURSE_KNOWLEDGE_BASE}

Вопрос студента: "${messageText}"

Критические правила:
1. Если вопрос НЕ относится к курсу (например: страны, Эквадор, Москва, мировые события, новости, что где происходит, погода, рецепты, курсы валют, анекдоты, посторонние темы) — ВЕЖЛИВО ОТКАЖИ: объясни, что ты ИИ-наставник VibeForge и консультируешь только по вопросам обучения вайб-кодингу, программе курса и созданию MVP, и предложи задать вопрос о программе, 3 проектах или графике.
2. Если спрашивают "сколько длится курс", о графике, времени, неделях или часах занятий — отвечай строго про ДЛИТЕЛЬНОСТЬ: 6–8 недель (4–6 часов в неделю, всего 24–48 часов практики). НЕ путай со словом "сейчас" в вопросах об окружающем мире!
3. Если спрашивают про цену или стоимость — отвечай: курс планируется платным, точная цена финализируется, а все инструменты курса работают на бесплатных тарифах.
4. Отвечай кратко, доброжелательно и по делу (3-4 ёмких предложения, при необходимости списки).`;

              const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userPrompt,
              });

              const text = response.text || getFallbackMentorAnswer(messageText);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ reply: text }));
            } catch (err: any) {
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
