# ScoreCalcs

Статический сайт студенческих калькуляторов (Next.js 16, `output: "export"`), домен scorecalcs.com.

- 26 калькуляторов: GPA (8), оценки (6), SAT/ACT/PSAT (3), конвертации (4), правила вузов (5: UC, UF, UT, ASU, LSAC)
- 36 калькуляторов баллов AP + хаб `/ap-score-calculator/`
- 26 страниц «Is a X.X GPA good?» (`/gpa/2-0/` … `/gpa/4-5/`, выше 4.0 — взвешенный GPA)
- Разделы, методика, about, sitemap.xml, robots.txt — всего 100 HTML-страниц

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # проверки формул (12 тестов, в т.ч. веса всех экзаменов AP = 100%)
npm run build    # статическая сборка в out/
```

## Деплой на Vercel

1. Новый GitHub-репозиторий → залить файлы → Vercel → Add New Project → импортировать (Framework: Next.js).
2. Settings → Domains → добавить `scorecalcs.com` (и www с редиректом), прописать DNS у регистратора.
3. Адрес в canonical/sitemap уже `https://scorecalcs.com` (меняется в `lib/site.ts` или переменной `SITE_URL`).

## Переменные окружения в Vercel (Settings → Environment Variables)

| Переменная | Зачем |
|---|---|
| `NEXT_PUBLIC_GA_ID` | ID Google Analytics 4 (G-XXXXXXX). Без неё аналитика не грузится |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Код подтверждения Google Search Console (способ «HTML-тег», только значение content) |
| `SITE_URL` | Адрес сайта для canonical/sitemap, если он не https://scorecalcs.com |

После изменения переменных — Redeploy.

## Где что менять

| Что | Файл |
|---|---|
| Название, домен, год экзаменов | `lib/site.ts` |
| Список калькуляторов и разделов | `lib/catalog.ts` |
| Шкала GPA, проценты ↔ буквы, формулы оценок | `lib/gpa.ts` |
| Форматы экзаменов AP, веса, распределения баллов 2026, пороги (оценка) | `lib/ap.ts` (расчёт — `lib/apMath.ts`) |
| Кривые SAT/PSAT/ACT (оценка) | `lib/satact.ts` |
| Тексты страниц калькуляторов | `lib/content.ts` |
| Правила GPA вузов (UC, UF, UT, ASU, LSAC) | `lib/schools.ts` |
| Тексты страниц AP (генерируются из данных) | `lib/apContent.ts` |
| Дизайн | `app/globals.css`, шрифты — `app/fonts.ts` |

## Что обновлять каждый год

- **Июль:** новые распределения баллов AP (`dist2026` в `lib/ap.ts`) — College Board публикует их после выдачи результатов.
- **Когда College Board выпустит scoring guidelines 2027** для Statistics и языков (Spanish, French, German, Italian) — перевести эти экзамены на формат 2027; для Chinese и Japanese (уже формат 2027) — заменить ввод «% от рубрики» на баллы рубрик.
- **LSAC:** с цикла 2027–28 dual enrollment не считается — переключатель уже есть, после начала цикла сделать его единственным вариантом.
- Пороги 1–5 — оценочные; College Board их не публикует.
