// AP exam formats and composite-score model.
// Formats: College Board course "Assessment" pages and 2026 scoring guidelines, checked October 2026.
// Where the May 2027 exam changes and the new structure is published, the 2027 structure is used.
// Score distributions: College Board, May 2026 (apstudents.collegeboard.org/about-ap-scores/score-distributions).
// Cutoffs: College Board does not publish them. Ours are estimates (see CUTS) and are labelled as such.

export type FrqItem = { label: string; max: number; weight: number }; // weight = share of the whole exam (0–1)
export type ApExam = {
  slug: string;
  name: string; // "AP Biology"
  short: string; // "AP Bio" — the way students search
  group: "STEM" | "English" | "History & Social Science" | "Arts" | "World Languages";
  mc: { count: number; weight: number; minutes: number; note?: string };
  frq: FrqItem[];
  frqMinutes: number;
  dist2026: { pass: number; five: number }; // % scoring 3+, % scoring 5
  cut: Cuts;
  formatYear: 2026 | 2027;
  note?: string; // shown on the page (format changes, unverified items)
  keyword: string; // main search phrase
};

export type Cuts = { five: number; four: number; three: number; two: number }; // share of composite (0–1)

// Estimated curves. Calculus AB uses widely cited 108-point composite ranges (5 ≈ 69+, 4 ≈ 57+, 3 ≈ 45+, 2 ≈ 37+);
// Calculus BC uses the released 2012 exam ranges. Others are grouped by how generous the exam's
// actual score distribution is: these are estimates, not College Board numbers.
const GENEROUS: Cuts = { five: 0.66, four: 0.52, three: 0.38, two: 0.26 };
const STANDARD: Cuts = { five: 0.7, four: 0.56, three: 0.42, two: 0.28 };
const TOUGH: Cuts = { five: 0.72, four: 0.59, three: 0.46, two: 0.31 };
const CALC_AB: Cuts = { five: 69 / 108, four: 57 / 108, three: 45 / 108, two: 37 / 108 };
const CALC_BC: Cuts = { five: 68 / 108, four: 53 / 108, three: 40 / 108, two: 30 / 108 };

function curveFor(pass: number): Cuts {
  if (pass >= 80) return GENEROUS;
  if (pass >= 70) return STANDARD;
  return TOUGH;
}

/** Split a section weight over items in proportion to their points (used where College Board doesn't weight items separately). */
function byPoints(items: [string, number][], sectionWeight: number): FrqItem[] {
  const total = items.reduce((a, [, m]) => a + m, 0);
  return items.map(([label, max]) => ({ label, max, weight: (max / total) * sectionWeight }));
}
function equal(items: [string, number][], sectionWeight: number): FrqItem[] {
  return items.map(([label, max]) => ({ label, max, weight: sectionWeight / items.length }));
}
const reps = (label: string, n: number, max: number): [string, number][] =>
  Array.from({ length: n }, (_, i) => [`${label} ${i + 1}`, max] as [string, number]);

const HISTORY_FRQ: FrqItem[] = [
  ...equal(reps("Short answer", 3, 3), 0.2),
  { label: "Document-based question (DBQ)", max: 7, weight: 0.25 },
  { label: "Long essay (LEQ)", max: 6, weight: 0.15 },
];
const HISTORY_NOTE =
  "May 2027 change: all three short-answer questions become required and the LEQ has a single prompt. Rubric points and section weights stay the same, so the calculator already matches the 2027 exam.";
const PHYSICS_FRQ: FrqItem[] = equal(
  [["Mathematical routines", 10], ["Translation between representations", 12], ["Experimental design and analysis", 10], ["Qualitative/quantitative translation", 8]],
  0.5,
);
const PHYSICS_NOTE = "Uses the May 2027 format: 42 multiple-choice questions (up from 40) and the four free-response question types introduced in 2025.";
const LANG_FRQ = (pts = 5): FrqItem[] =>
  equal([["Email reply", pts], ["Argumentative essay", pts], ["Conversation", pts], ["Cultural comparison", pts]], 0.5);
const LANG_NOTE =
  "College Board is redesigning the world language exams for May 2027 (a course project replaces part of the free response). This calculator uses the 2026 structure until 2027 scoring guidelines are released.";

type Raw = Omit<ApExam, "cut" | "formatYear"> & { cut?: Cuts; formatYear?: 2026 | 2027 };

const RAW: Raw[] = [
  // ---------- STEM ----------
  { slug: "biology", name: "AP Biology", short: "AP Bio", group: "STEM", keyword: "ap bio score calculator",
    mc: { count: 60, weight: 0.5, minutes: 90 }, frqMinutes: 90,
    frq: byPoints([["Long FRQ 1", 9], ["Long FRQ 2", 9], ["Short FRQ 3", 4], ["Short FRQ 4", 4], ["Short FRQ 5", 4], ["Short FRQ 6", 4]], 0.5),
    dist2026: { pass: 71, five: 15 } },
  { slug: "calculus-ab", name: "AP Calculus AB", short: "AP Calc AB", group: "STEM", keyword: "ap calc ab score calculator", formatYear: 2027, cut: CALC_AB,
    mc: { count: 42, weight: 0.5, minutes: 100, note: "Part A: 29 questions without a calculator; Part B: 13 with a calculator" }, frqMinutes: 90,
    frq: equal(reps("FRQ", 6, 9), 0.5), dist2026: { pass: 65, five: 20 },
    note: "Uses the May 2027 format: 42 multiple-choice questions (29 + 13) instead of 45. Free response is unchanged: six questions worth 9 points each." },
  { slug: "calculus-bc", name: "AP Calculus BC", short: "AP Calc BC", group: "STEM", keyword: "ap calc bc score calculator", formatYear: 2027, cut: CALC_BC,
    mc: { count: 42, weight: 0.5, minutes: 100, note: "Part A: 29 questions without a calculator; Part B: 13 with a calculator" }, frqMinutes: 90,
    frq: equal(reps("FRQ", 6, 9), 0.5), dist2026: { pass: 82, five: 46 },
    note: "Uses the May 2027 format: 42 multiple-choice questions instead of 45. Your report also includes an AB subscore." },
  { slug: "chemistry", name: "AP Chemistry", short: "AP Chem", group: "STEM", keyword: "ap chem score calculator",
    mc: { count: 60, weight: 0.5, minutes: 90 }, frqMinutes: 105,
    frq: byPoints([["Long FRQ 1", 10], ["Long FRQ 2", 10], ["Long FRQ 3", 10], ["Short FRQ 4", 4], ["Short FRQ 5", 4], ["Short FRQ 6", 4], ["Short FRQ 7", 4]], 0.5),
    dist2026: { pass: 75, five: 15 } },
  { slug: "physics-1", name: "AP Physics 1", short: "AP Physics 1", group: "STEM", keyword: "ap physics 1 score calculator", formatYear: 2027,
    mc: { count: 42, weight: 0.5, minutes: 85 }, frqMinutes: 95, frq: PHYSICS_FRQ, dist2026: { pass: 68, five: 19 }, note: PHYSICS_NOTE },
  { slug: "physics-2", name: "AP Physics 2", short: "AP Physics 2", group: "STEM", keyword: "ap physics 2 score calculator", formatYear: 2027,
    mc: { count: 42, weight: 0.5, minutes: 85 }, frqMinutes: 95, frq: PHYSICS_FRQ, dist2026: { pass: 72, five: 20 }, note: PHYSICS_NOTE },
  { slug: "physics-c-mechanics", name: "AP Physics C: Mechanics", short: "AP Physics C Mech", group: "STEM", keyword: "ap physics c mechanics score calculator", formatYear: 2027,
    mc: { count: 42, weight: 0.5, minutes: 85 }, frqMinutes: 95, frq: PHYSICS_FRQ, dist2026: { pass: 72, five: 20 },
    note: PHYSICS_NOTE + " Point values per question follow Physics 1 and 2; check them against your teacher's rubric." },
  { slug: "physics-c-em", name: "AP Physics C: Electricity and Magnetism", short: "AP Physics C E&M", group: "STEM", keyword: "ap physics c e&m score calculator", formatYear: 2027,
    mc: { count: 42, weight: 0.5, minutes: 85 }, frqMinutes: 95, frq: PHYSICS_FRQ, dist2026: { pass: 75, five: 24 },
    note: PHYSICS_NOTE + " Point values per question follow Physics 1 and 2; check them against your teacher's rubric." },
  { slug: "environmental-science", name: "AP Environmental Science", short: "APES", group: "STEM", keyword: "apes score calculator",
    mc: { count: 80, weight: 0.6, minutes: 90 }, frqMinutes: 70, frq: equal(reps("FRQ", 3, 10), 0.4), dist2026: { pass: 69, five: 13 } },
  { slug: "statistics", name: "AP Statistics", short: "AP Stats", group: "STEM", keyword: "ap stats score calculator",
    mc: { count: 40, weight: 0.5, minutes: 90 }, frqMinutes: 90,
    frq: [...reps("FRQ", 5, 4).map(([l, m]) => ({ label: l, max: m, weight: 0.075 })), { label: "Investigative task (FRQ 6)", max: 4, weight: 0.125 }],
    dist2026: { pass: 62, five: 17 },
    note: "AP Statistics is redesigned for May 2027 (42 multiple-choice questions, four longer free-response questions, fully digital). Until College Board publishes 2027 scoring guidelines, this calculator uses the 2026 structure." },
  { slug: "precalculus", name: "AP Precalculus", short: "AP Precalc", group: "STEM", keyword: "ap precalc score calculator", formatYear: 2027,
    mc: { count: 42, weight: 0.625, minutes: 120, note: "Part A: 29 without a calculator; Part B: 13 with a graphing calculator" }, frqMinutes: 60,
    frq: equal(reps("FRQ", 4, 6), 0.375), dist2026: { pass: 82, five: 29 },
    note: "Uses the May 2027 format: 42 multiple-choice questions instead of 40." },
  { slug: "computer-science-a", name: "AP Computer Science A", short: "AP CSA", group: "STEM", keyword: "ap csa score calculator",
    mc: { count: 42, weight: 0.55, minutes: 90 }, frqMinutes: 90,
    frq: byPoints([["Methods and control structures", 7], ["Class design", 7], ["ArrayList", 5], ["2D array", 6]], 0.45),
    dist2026: { pass: 66, five: 25 }, note: "Uses the digital format introduced in 2026: code is typed in Bluebook and the four free-response questions are worth 25 points in total." },
  { slug: "computer-science-principles", name: "AP Computer Science Principles", short: "AP CSP", group: "STEM", keyword: "ap csp score calculator",
    mc: { count: 70, weight: 0.7, minutes: 120 }, frqMinutes: 60,
    frq: [{ label: "Create performance task (video, program, written responses)", max: 6, weight: 0.3 }],
    dist2026: { pass: 63, five: 10 }, note: "The Create task is scored on a 6-point rubric: program video, program requirements and four written responses answered on exam day." },
  // ---------- English ----------
  { slug: "english-language", name: "AP English Language and Composition", short: "AP Lang", group: "English", keyword: "ap lang score calculator",
    mc: { count: 45, weight: 0.45, minutes: 60 }, frqMinutes: 135,
    frq: equal([["Synthesis essay", 6], ["Rhetorical analysis essay", 6], ["Argument essay", 6]], 0.55), dist2026: { pass: 75, five: 15 } },
  { slug: "english-literature", name: "AP English Literature and Composition", short: "AP Lit", group: "English", keyword: "ap lit score calculator",
    mc: { count: 55, weight: 0.45, minutes: 60 }, frqMinutes: 120,
    frq: equal([["Poetry analysis", 6], ["Prose fiction analysis", 6], ["Literary argument", 6]], 0.55), dist2026: { pass: 73, five: 16 } },
  { slug: "seminar", name: "AP Seminar", short: "AP Seminar", group: "English", keyword: "ap seminar score calculator",
    mc: { count: 0, weight: 0, minutes: 0 }, frqMinutes: 120,
    frq: [
      { label: "Team project and presentation (as % of rubric)", max: 100, weight: 0.2 },
      { label: "Individual research report and presentation (as % of rubric)", max: 100, weight: 0.35 },
      { label: "End-of-course exam (as % of rubric)", max: 100, weight: 0.45 },
    ],
    dist2026: { pass: 88, five: 10 },
    note: "AP Seminar has no multiple-choice section: 55% of the score comes from performance tasks done during the year, 45% from the end-of-course exam. Enter each part as the share of rubric points you expect." },
  // ---------- History & Social Science ----------
  { slug: "us-history", name: "AP United States History", short: "APUSH", group: "History & Social Science", keyword: "apush score calculator",
    mc: { count: 55, weight: 0.4, minutes: 55 }, frqMinutes: 140, frq: HISTORY_FRQ, dist2026: { pass: 74, five: 14 }, note: HISTORY_NOTE },
  { slug: "world-history", name: "AP World History: Modern", short: "AP World", group: "History & Social Science", keyword: "ap world score calculator",
    mc: { count: 55, weight: 0.4, minutes: 55 }, frqMinutes: 140, frq: HISTORY_FRQ, dist2026: { pass: 66, five: 14 }, note: HISTORY_NOTE },
  { slug: "european-history", name: "AP European History", short: "AP Euro", group: "History & Social Science", keyword: "ap euro score calculator",
    mc: { count: 55, weight: 0.4, minutes: 55 }, frqMinutes: 140, frq: HISTORY_FRQ, dist2026: { pass: 74, five: 16 }, note: HISTORY_NOTE },
  { slug: "us-government", name: "AP United States Government and Politics", short: "AP Gov", group: "History & Social Science", keyword: "ap gov score calculator",
    mc: { count: 55, weight: 0.5, minutes: 80 }, frqMinutes: 100,
    frq: equal([["Concept application", 3], ["Quantitative analysis", 4], ["SCOTUS comparison", 4], ["Argument essay", 6]], 0.5), dist2026: { pass: 76, five: 23 } },
  { slug: "comparative-government", name: "AP Comparative Government and Politics", short: "AP Comp Gov", group: "History & Social Science", keyword: "ap comparative government score calculator",
    mc: { count: 55, weight: 0.5, minutes: 60 }, frqMinutes: 90,
    frq: equal([["Conceptual analysis", 4], ["Quantitative analysis", 5], ["Comparative analysis", 5], ["Argument essay", 5]], 0.5), dist2026: { pass: 70, five: 15 },
    note: "Free-response point values (4, 5, 5, 5) follow recent scoring guidelines; check them against your teacher's rubric." },
  { slug: "human-geography", name: "AP Human Geography", short: "APHG", group: "History & Social Science", keyword: "ap human geography score calculator",
    mc: { count: 60, weight: 0.5, minutes: 60 }, frqMinutes: 75,
    frq: equal([["FRQ 1 (no stimulus)", 7], ["FRQ 2 (one stimulus)", 7], ["FRQ 3 (two stimuli)", 7]], 0.5), dist2026: { pass: 66, five: 19 } },
  { slug: "psychology", name: "AP Psychology", short: "AP Psych", group: "History & Social Science", keyword: "ap psych score calculator",
    mc: { count: 75, weight: 2 / 3, minutes: 90 }, frqMinutes: 70,
    frq: equal([["Article analysis question (AAQ)", 7], ["Evidence-based question (EBQ)", 7]], 1 / 3), dist2026: { pass: 74, five: 15 },
    note: "Uses the format introduced in 2025: 75 multiple-choice questions and two 7-point free-response questions." },
  { slug: "macroeconomics", name: "AP Macroeconomics", short: "AP Macro", group: "History & Social Science", keyword: "ap macro score calculator",
    mc: { count: 60, weight: 2 / 3, minutes: 70 }, frqMinutes: 60,
    frq: [{ label: "Long FRQ 1", max: 10, weight: 1 / 6 }, { label: "Short FRQ 2", max: 5, weight: 1 / 12 }, { label: "Short FRQ 3", max: 5, weight: 1 / 12 }],
    dist2026: { pass: 66, five: 19 } },
  { slug: "microeconomics", name: "AP Microeconomics", short: "AP Micro", group: "History & Social Science", keyword: "ap micro score calculator",
    mc: { count: 60, weight: 2 / 3, minutes: 70 }, frqMinutes: 60,
    frq: [{ label: "Long FRQ 1", max: 10, weight: 1 / 6 }, { label: "Short FRQ 2", max: 5, weight: 1 / 12 }, { label: "Short FRQ 3", max: 5, weight: 1 / 12 }],
    dist2026: { pass: 68, five: 19 } },
  { slug: "african-american-studies", name: "AP African American Studies", short: "AP AAS", group: "History & Social Science", keyword: "ap african american studies score calculator",
    mc: { count: 60, weight: 0.6, minutes: 70 }, frqMinutes: 95,
    frq: [
      { label: "Short answer: text source", max: 4, weight: 0.06 },
      { label: "Short answer: visual source", max: 3, weight: 0.06 },
      { label: "Short answer: thematic", max: 3, weight: 0.06 },
      { label: "Document-based question", max: 7, weight: 0.12 },
      { label: "Exam-day project question", max: 2, weight: 0.015 },
      { label: "Individual student project (as % of rubric)", max: 100, weight: 0.085 },
    ],
    dist2026: { pass: 77, five: 20 } },
  // ---------- Arts ----------
  { slug: "art-history", name: "AP Art History", short: "AP Art History", group: "Arts", keyword: "ap art history score calculator",
    mc: { count: 80, weight: 0.5, minutes: 60 }, frqMinutes: 120,
    frq: byPoints([["Long essay: comparison", 8], ["Long essay: visual/contextual", 6], ["Short essay 3", 5], ["Short essay 4", 5], ["Short essay 5", 5], ["Short essay 6", 5]], 0.5),
    dist2026: { pass: 67, five: 15 } },
  // ---------- World Languages ----------
  { slug: "spanish-language", name: "AP Spanish Language and Culture", short: "AP Spanish", group: "World Languages", keyword: "ap spanish score calculator",
    mc: { count: 65, weight: 0.5, minutes: 95, note: "Part A: 30 reading questions; Part B: 35 questions with audio" }, frqMinutes: 85,
    frq: LANG_FRQ(), dist2026: { pass: 83, five: 21 }, note: LANG_NOTE },
  { slug: "spanish-literature", name: "AP Spanish Literature and Culture", short: "AP Spanish Lit", group: "World Languages", keyword: "ap spanish literature score calculator",
    mc: { count: 65, weight: 0.5, minutes: 80 }, frqMinutes: 100,
    frq: byPoints([["Short answer 1", 6], ["Short answer 2", 6], ["Essay: text analysis", 10], ["Essay: text comparison", 10]], 0.5), dist2026: { pass: 71, five: 20 } },
  { slug: "french-language", name: "AP French Language and Culture", short: "AP French", group: "World Languages", keyword: "ap french score calculator",
    mc: { count: 65, weight: 0.5, minutes: 95 }, frqMinutes: 85, frq: LANG_FRQ(), dist2026: { pass: 71, five: 15 }, note: LANG_NOTE },
  { slug: "german-language", name: "AP German Language and Culture", short: "AP German", group: "World Languages", keyword: "ap german score calculator",
    mc: { count: 65, weight: 0.5, minutes: 95 }, frqMinutes: 85, frq: LANG_FRQ(), dist2026: { pass: 68, five: 24 }, note: LANG_NOTE },
  { slug: "italian-language", name: "AP Italian Language and Culture", short: "AP Italian", group: "World Languages", keyword: "ap italian score calculator",
    mc: { count: 65, weight: 0.5, minutes: 95 }, frqMinutes: 85, frq: LANG_FRQ(), dist2026: { pass: 69, five: 19 }, note: LANG_NOTE },
  { slug: "latin", name: "AP Latin", short: "AP Latin", group: "World Languages", keyword: "ap latin score calculator",
    mc: { count: 52, weight: 0.5, minutes: 65 }, frqMinutes: 115,
    frq: byPoints([["Short answer", 8], ["Translation", 15], ["Short essay", 8], ["Project essay: prose", 11], ["Project essay: poetry", 11]], 0.5),
    dist2026: { pass: 73, five: 20 }, note: "Uses the revised 2025–26 course (Pliny replaces Caesar). The small in-class project checkpoint share is not included." },
];

export const AP_EXAMS: ApExam[] = RAW.map((r) => ({ ...r, cut: r.cut ?? curveFor(r.dist2026.pass), formatYear: r.formatYear ?? 2026 }));
export const AP_BY_SLUG: Record<string, ApExam> = Object.fromEntries(AP_EXAMS.map((e) => [e.slug, e]));
export const AP_GROUPS = ["STEM", "English", "History & Social Science", "Arts", "World Languages"] as const;

export function totalWeight(e: ApExam): number {
  return e.mc.weight + e.frq.reduce((a, f) => a + f.weight, 0);
}

/** Composite as a share (0–1) of the maximum. */
export function composite(e: ApExam, mcCorrect: number, frqPoints: number[]): number {
  const mc = e.mc.count ? (Math.min(Math.max(mcCorrect, 0), e.mc.count) / e.mc.count) * e.mc.weight : 0;
  const fr = e.frq.reduce((a, f, i) => a + (Math.min(Math.max(frqPoints[i] ?? 0, 0), f.max) / f.max) * f.weight, 0);
  return (mc + fr) / totalWeight(e);
}

export function apScore(share: number, c: Cuts): 1 | 2 | 3 | 4 | 5 {
  if (share >= c.five) return 5;
  if (share >= c.four) return 4;
  if (share >= c.three) return 3;
  if (share >= c.two) return 2;
  return 1;
}

/** Multiple-choice correct answers needed for a target score, given FRQ points. Returns null if impossible. */
export function mcNeeded(e: ApExam, target: number, frqPoints: number[]): number | null {
  const cut = target === 5 ? e.cut.five : target === 4 ? e.cut.four : target === 3 ? e.cut.three : e.cut.two;
  for (let k = 0; k <= e.mc.count; k++) if (composite(e, k, frqPoints) >= cut) return k;
  return null;
}

/** Default inputs: a solid "about a 4" student — 70% of MC, 60% of FRQ points. */
export function defaults(e: ApExam): { mc: number; frq: number[] } {
  return { mc: Math.round(e.mc.count * 0.7), frq: e.frq.map((f) => Math.round(f.max * 0.6)) };
}
