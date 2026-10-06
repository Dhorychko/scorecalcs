// Institution-specific GPA rules. Each scheme cites the official page it follows (checked October 2026).

export type GradeOpt = { label: string; points: number };
export type LevelOpt = { value: string; label: string; bonus: number };
export type Scheme = {
  id: string;
  name: string; // shown in the mode switch
  resultLabel: string;
  grades: GradeOpt[];
  defaultGrade: string;
  credits: boolean;
  creditLabel?: string;
  levels?: LevelOpt[];
  bonusMinPoints?: number; // no level bonus below this grade value
  cap?: number; // cap on the final GPA (ASU caps cumulative GPA at 4.00)
  flag?: { label: string; help: string }; // per-row checkbox that excludes a course (LSAC dual enrollment)
  flagExcludes?: boolean;
  note: string;
  source: { label: string; url: string };
  presetRows: { name: string; grade: string; credits: string; level?: string; flag?: boolean }[];
};

const PM = (withAplus: number | null, dMinus = true, cMinus = true): GradeOpt[] => [
  ...(withAplus !== null ? [{ label: "A+", points: withAplus }] : []),
  { label: "A", points: 4.0 }, { label: "A-", points: 3.67 },
  { label: "B+", points: 3.33 }, { label: "B", points: 3.0 }, { label: "B-", points: 2.67 },
  { label: "C+", points: 2.33 }, { label: "C", points: 2.0 },
  ...(cMinus ? [{ label: "C-", points: 1.67 }, { label: "D+", points: 1.33 }] : []),
  { label: "D", points: 1.0 },
  ...(dMinus ? [{ label: "D-", points: 0.67 }] : []),
];

export const LSAC: Scheme = {
  id: "lsac", name: "LSAC", resultLabel: "LSAC cumulative GPA",
  grades: [...PM(4.33), { label: "F", points: 0 }], defaultGrade: "A",
  credits: true, creditLabel: "Credit hours",
  flag: { label: "Taken in high school (dual enrollment)", help: "Excluded from the LSAC GPA starting with the 2027–28 application cycle." },
  flagExcludes: true,
  note: "LSAC converts every graded undergraduate course taken before your first bachelor's degree to its 4.33 scale. Repeated courses count every time they appear on the transcript. Non-punitive W and pass grades are left out.",
  source: { label: "LSAC, transcript summarization", url: "https://lawhub.org/apply-to-law-school/how-do-i-apply/components-of-jd-application/cas/transcripts/transcript-summarization" },
  presetRows: [
    { name: "Intro to Political Science", grade: "A", credits: "3" }, { name: "Microeconomics", grade: "B+", credits: "3" },
    { name: "Calculus I", grade: "B", credits: "4" }, { name: "Ethics", grade: "A+", credits: "3" },
    { name: "English 101 (dual enrollment)", grade: "A", credits: "3", flag: true },
  ],
};

export const UF: Scheme = {
  id: "uf", name: "UF", resultLabel: "UF recalculated GPA",
  grades: [{ label: "A", points: 4 }, { label: "B", points: 3 }, { label: "C", points: 2 }, { label: "D", points: 1 }, { label: "F", points: 0 }],
  defaultGrade: "A", credits: true, creditLabel: "Credits",
  levels: [
    { value: "regular", label: "Regular", bonus: 0 },
    { value: "honors", label: "Honors / pre-AP / pre-IB / pre-AICE", bonus: 0.5 },
    { value: "ap", label: "AP / IB / AICE / dual enrollment", bonus: 1.0 },
  ],
  bonusMinPoints: 1,
  note: "UF recalculates a core, weighted GPA: English, math, science, history and foreign language, plus electives only if they are AP, IB or AICE. AP, IB, AICE and dual enrollment get +1.0 (an A is 5.0); honors and pre-AP/IB/AICE get +0.5. UF doesn't publish how it treats plus/minus grades, so enter whole letters.",
  source: { label: "UF Admissions, our decision process", url: "https://admissions.ufl.edu/apply/freshman/our-decision-process" },
  presetRows: [
    { name: "AP English Language", grade: "A", credits: "1", level: "ap" }, { name: "Precalculus Honors", grade: "B", credits: "1", level: "honors" },
    { name: "AP Biology", grade: "A", credits: "1", level: "ap" }, { name: "U.S. History", grade: "A", credits: "1", level: "regular" },
    { name: "Spanish III", grade: "B", credits: "1", level: "regular" },
  ],
};

export const UT_AUSTIN: Scheme = {
  id: "ut-austin", name: "UT Austin (college GPA)", resultLabel: "UT Austin GPA",
  grades: [...PM(null), { label: "F", points: 0 }], defaultGrade: "A",
  credits: true, creditLabel: "Credit hours",
  note: "UT Austin's catalog scale: A = 4.00, A- = 3.67, B+ = 3.33 and so on, with no A+. Courses graded I, Q, W, X, S, U or CR (including credit by exam) don't count.",
  source: { label: "UT Austin catalog, computation of the GPA", url: "https://catalog.utexas.edu/general-information/academic-policies-and-procedures/computation-of-the-grade-point-average/" },
  presetRows: [
    { name: "RHE 306", grade: "A-", credits: "3" }, { name: "M 408C", grade: "B+", credits: "4" },
    { name: "GOV 310L", grade: "A", credits: "3" }, { name: "CH 301", grade: "B", credits: "3" },
  ],
};

export const UT_KNOXVILLE: Scheme = {
  id: "utk", name: "UT Knoxville (admissions core GPA)", resultLabel: "UT core GPA",
  grades: [{ label: "A", points: 4 }, { label: "B", points: 3 }, { label: "C", points: 2 }, { label: "D", points: 1 }, { label: "F", points: 0 }],
  defaultGrade: "A", credits: true, creditLabel: "Credits",
  levels: [
    { value: "regular", label: "Regular", bonus: 0 },
    { value: "honors", label: "Honors", bonus: 0.5 },
    { value: "ap", label: "AP / IB / Cambridge / dual enrollment", bonus: 1.0 },
  ],
  note: "The University of Tennessee recalculates a weighted core GPA from 16 core courses (4 English, 4 math, 3 science, 1 U.S. history, 1 world/European history, 2 of one foreign language, 1 visual or performing arts): +0.5 for honors, +1.0 for AP, IB, Cambridge and dual enrollment. A 4.0+ core GPA is one route to guaranteed admission for Tennessee students.",
  source: { label: "UT Knoxville, first-year admission", url: "https://admissions.utk.edu/undergraduate-application/first-year-information/" },
  presetRows: [
    { name: "English III Honors", grade: "A", credits: "1", level: "honors" }, { name: "AP Calculus AB", grade: "B", credits: "1", level: "ap" },
    { name: "Chemistry", grade: "A", credits: "1", level: "regular" }, { name: "U.S. History", grade: "A", credits: "1", level: "regular" },
  ],
};

export const ASU: Scheme = {
  id: "asu", name: "ASU", resultLabel: "ASU GPA",
  grades: [...PM(4.33, false, false), { label: "E", points: 0 }], defaultGrade: "A",
  credits: true, creditLabel: "Credit hours", cap: 4.0,
  note: "ASU's scale has an A+ worth 4.33 but caps the cumulative GPA at 4.00. There are no C-, D+ or D- grades, and a failing grade is an E. W, X, Y and similar grades don't count.",
  source: { label: "ASU Registrar, GPA calculator", url: "https://registrar.asu.edu/gpa-calculator" },
  presetRows: [
    { name: "ENG 101", grade: "A", credits: "3" }, { name: "MAT 265", grade: "B+", credits: "4" },
    { name: "PSY 101", grade: "A+", credits: "3" }, { name: "CHM 113", grade: "B-", credits: "4" },
  ],
};

export type Row = { grade: string; credits: number; level?: string; flag?: boolean };

export function schemeGpa(s: Scheme, rows: Row[], excludeFlagged = true) {
  let cr = 0, qp = 0, wqp = 0;
  for (const r of rows) {
    const g = s.grades.find((x) => x.label === r.grade);
    if (!g || !(r.credits > 0)) continue;
    if (s.flag && s.flagExcludes && excludeFlagged && r.flag) continue;
    const bonus = s.levels && g.points >= (s.bonusMinPoints ?? 0.01) ? s.levels.find((l) => l.value === r.level)?.bonus ?? 0 : 0;
    cr += r.credits;
    qp += g.points * r.credits;
    wqp += (g.points + bonus) * r.credits;
  }
  const raw = cr ? (s.levels ? wqp : qp) / cr : 0;
  return { gpa: s.cap ? Math.min(s.cap, raw) : raw, uncapped: raw, unweighted: cr ? qp / cr : 0, credits: cr };
}

// ----- University of California -----
// A-G courses from the summer after 9th grade through the summer after 11th grade. A=4 … F=0, no plus/minus.
// +1 for each semester of a UC-approved honors, AP, IB or college course with a C or better.
// Capped GPA: at most 8 honors semester points, no more than 4 of them from 10th grade.
export type UcRow = { grade: "A" | "B" | "C" | "D" | "F"; year: "10" | "11"; honors: boolean };
const UC_POINTS = { A: 4, B: 3, C: 2, D: 1, F: 0 } as const;

export function ucGpa(rows: UcRow[]) {
  const n = rows.length;
  if (!n) return { unweighted: 0, capped: 0, fully: 0, honorsUsed: 0, honorsEarned: 0, grades: 0 };
  const base = rows.reduce((a, r) => a + UC_POINTS[r.grade], 0);
  const eligible = rows.filter((r) => r.honors && UC_POINTS[r.grade] >= 2);
  const tenth = eligible.filter((r) => r.year === "10").length;
  const eleventh = eligible.length - tenth;
  const usedTenth = Math.min(4, tenth);
  const used = Math.min(8, usedTenth + eleventh);
  return {
    unweighted: base / n,
    capped: (base + used) / n,
    fully: (base + eligible.length) / n,
    honorsUsed: used,
    honorsEarned: eligible.length,
    grades: n,
  };
}
