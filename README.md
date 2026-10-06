# ScoreCalcs

Статический сайт студенческих калькуляторов (Next.js 16, `output: "export"`), домен scorecalcs.com.

- 21 калькулятор: GPA (8), оценки (6), SAT/ACT/PSAT (3), конвертации (4)
- 33 калькулятора баллов AP + хаб `/ap-score-calculator/`
- 21 страница «Is a X.X GPA good?» (`/gpa/2-0/` … `/gpa/4-0/`)
- Разделы, методика, about, sitemap.xml, robots.txt — всего 86 HTML-страниц

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

## Где что менять

| Что | Файл |
|---|---|
| Название, домен, год экзаменов | `lib/site.ts` |
| Список калькуляторов и разделов | `lib/catalog.ts` |
| Шкала GPA, проценты ↔ буквы, формулы оценок | `lib/gpa.ts` |
| Форматы экзаменов AP, веса, распределения баллов 2026, пороги (оценка) | `lib/ap.ts` |
| Кривые SAT/PSAT/ACT (оценка) | `lib/satact.ts` |
| Тексты страниц калькуляторов | `lib/content.ts` |
| Тексты страниц AP (генерируются из данных) | `lib/apContent.ts` |
| Дизайн | `app/globals.css` |

## Что обновлять каждый год

- **Июль:** новые распределения баллов AP (`dist2026` в `lib/ap.ts`) — College Board публикует их после выдачи результатов.
- **Когда College Board выпустит scoring guidelines 2027** для Statistics и языков (Spanish, French, German, Italian) — перевести эти экзамены на формат 2027 (сейчас на них стоит пометка).
- Пороги 1–5 — оценочные; College Board их не публикует.
