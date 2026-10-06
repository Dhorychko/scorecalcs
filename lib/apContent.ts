import { AP_EXAMS, type ApExam, mcNeeded } from "./ap.ts";

const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;

const GROUP_TIPS: Record<ApExam["group"], string[]> = {
  STEM: [
    "Free-response rubrics give points for setup and reasoning, not just the final answer — show the equation before the number.",
    "Answer every multiple-choice question: there's no penalty for guessing.",
    "Practise with released free-response questions from AP Central and score yourself against the official scoring guidelines.",
  ],
  English: [
    "Each essay is scored on a 6-point rubric: up to 1 point for the thesis, 4 for evidence and commentary, 1 for sophistication.",
    "The sophistication point is the hardest to earn; a clear thesis and well-explained evidence get you to 5 of 6.",
    "Multiple choice carries 45% of the score, so steady practice on passages pays off as much as essay drills.",
  ],
  "History & Social Science": [
    "Rubric points are awarded for specific skills (thesis, evidence, contextualization, analysis) — learn the rubric, not just the content.",
    "Answer every multiple-choice question: wrong answers cost nothing.",
    "Score your practice essays with the official College Board rubric to see where points slip away.",
  ],
  Arts: [
    "Learn the required image set well: questions can ask about any work in the course framework.",
    "Free-response answers earn points for identifying the work, then for analysis supported by visual and contextual evidence.",
  ],
  "World Languages": [
    "Speaking and writing tasks are scored holistically on a 0–5 scale; addressing every part of the prompt matters more than flawless grammar.",
    "Practise the cultural comparison with a structure you can reuse: your community, the target culture, a clear comparison.",
  ],
};

export function apIntro(e: ApExam): string {
  if (e.mc.count === 0)
    return `Predict your ${e.short} score. Enter the share of rubric points you expect on each scored part and see your estimated 1–5 AP score for May ${e.formatYear}.`;
  return `Predict your ${e.short} score. Enter how many of the ${e.mc.count} multiple-choice questions you got right and your points on each free-response question to see your estimated 1–5 score on the ${e.name} exam.`;
}

export function apFaq(e: ApExam): { q: string; a: string }[] {
  const frq70 = e.frq.map((f) => f.max * 0.7);
  const frq50 = e.frq.map((f) => f.max * 0.5);
  const for5 = mcNeeded(e, 5, frq70);
  const for3 = mcNeeded(e, 3, frq50);
  const out: { q: string; a: string }[] = [
    {
      q: `What percentage of students get a 5 on ${e.short}?`,
      a: `In May 2026, ${e.dist2026.five}% of students scored a 5 on ${e.name}, and ${e.dist2026.pass}% scored 3 or higher (College Board score distributions).`,
    },
  ];
  if (e.mc.count > 0) {
    out.push({
      q: `How many multiple-choice questions can I miss and still get a 5?`,
      a: for5 === null
        ? `With about 70% of the free-response points, a 5 is out of reach on our estimated curve — you'd need stronger free response too.`
        : `With about 70% of the free-response points, our estimated curve puts a 5 at roughly ${for5} of ${e.mc.count} multiple-choice questions right — so you could miss about ${e.mc.count - for5}. The real cutoff moves a little each year.`,
    });
    out.push({
      q: `What do I need to pass ${e.short} (score a 3)?`,
      a: for3 === null
        ? `With half the free-response points a 3 needs more multiple-choice points than the section offers on our curve; aim higher on free response.`
        : `With about half the free-response points, you'd need around ${for3} of ${e.mc.count} multiple-choice questions right for a 3 on our estimated curve — roughly ${Math.round((for3 / e.mc.count) * 100)}% of the section.`,
    });
  }
  out.push(
    { q: "Are these the official cutoffs?", a: "No. College Board sets the composite cutoffs for each score after the exam is graded and doesn't publish them. We use estimates based on released scoring worksheets and how generous each exam's score distribution is." },
    { q: "When do AP scores come out?", a: "AP scores are released in early July in the College Board student account. Colleges you chose to send scores to receive them at the same time." },
  );
  return out;
}

export function apTips(e: ApExam): string[] {
  return GROUP_TIPS[e.group];
}

export function apFormatRows(e: ApExam): { section: string; detail: string; time: string; weight: string }[] {
  const rows: { section: string; detail: string; time: string; weight: string }[] = [];
  if (e.mc.count > 0) rows.push({ section: "Multiple choice", detail: `${e.mc.count} questions`, time: `${e.mc.minutes} min`, weight: pct(e.mc.weight) });
  rows.push({
    section: e.mc.count > 0 ? "Free response" : "Performance tasks and exam",
    detail: e.frq.map((f) => (f.max === 100 ? f.label.replace(" (as % of rubric)", "") : `${f.label} (${f.max} pts)`)).join("; "),
    time: e.frqMinutes ? `${e.frqMinutes} min` : "—",
    weight: pct(1 - e.mc.weight),
  });
  return rows;
}

export function apRelated(e: ApExam): ApExam[] {
  return AP_EXAMS.filter((x) => x.group === e.group && x.slug !== e.slug).slice(0, 8);
}
