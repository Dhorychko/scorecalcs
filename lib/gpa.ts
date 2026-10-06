// GPA and grade conversion logic. Pure functions, no React.

export type Letter = "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D+" | "D" | "D-" | "F";

/** Standard 4.0 scale. A+ counts as 4.0 (most U.S. high schools and colleges). */
export const LETTERS: { letter: Letter; points: number; min: number; max: number }[] = [
  // Percent bands follow the College Board's grade-conversion table (A+ 97–100 … F below 65).
  { letter: "A+", points: 4.0, min: 97, max: 100 },
  { letter: "A", points: 4.0, min: 93, max: 96 },
  { letter: "A-", points: 3.7, min: 90, max: 92 },
  { letter: "B+", points: 3.3, min: 87, max: 89 },
  { letter: "B", points: 3.0, min: 83, max: 86 },
  { letter: "B-", points: 2.7, min: 80, max: 82 },
  { letter: "C+", points: 2.3, min: 77, max: 79 },
  { letter: "C", points: 2.0, min: 73, max: 76 },
  { letter: "C-", points: 1.7, min: 70, max: 72 },
  { letter: "D+", points: 1.3, min: 67, max: 69 },
  { letter: "D", points: 1.0, min: 65, max: 66 },
  // D- has no band in the College Board table (everything under 65 is F); it is kept for letter input.
  { letter: "D-", points: 0.7, min: 65, max: 65 },
  { letter: "F", points: 0.0, min: 0, max: 64 },
];

export const LETTER_POINTS: Record<string, number> = Object.fromEntries(LETTERS.map((l) => [l.letter, l.points]));

export type Level = "regular" | "honors" | "ap";
/** Weighted GPA bonus most U.S. high schools use. Some schools differ — the UI lets users change it. */
export const LEVEL_BONUS: Record<Level, number> = { regular: 0, honors: 0.5, ap: 1.0 };

export function percentToLetter(pct: number): Letter {
  const p = Math.round(pct);
  for (const l of LETTERS) if (l.letter !== "D-" && p >= l.min) return l.letter;
  return "F";
}

export function percentToPoints(pct: number): number {
  return LETTER_POINTS[percentToLetter(pct)];
}

/** Grade-point value → nearest letter (for "what letter is a 3.4 GPA"). */
export function pointsToLetter(gpa: number): Letter {
  if (gpa >= 3.85) return "A";
  if (gpa >= 3.5) return "A-";
  if (gpa >= 3.15) return "B+";
  if (gpa >= 2.85) return "B";
  if (gpa >= 2.5) return "B-";
  if (gpa >= 2.15) return "C+";
  if (gpa >= 1.85) return "C";
  if (gpa >= 1.5) return "C-";
  if (gpa >= 1.15) return "D+";
  if (gpa >= 0.85) return "D";
  if (gpa >= 0.5) return "D-";
  return "F";
}

/** GPA → approximate percentage, interpolating between letter-grade band midpoints. */
export function pointsToPercent(gpa: number): number {
  const anchors: [number, number][] = [
    [0, 50], [1.0, 65.5], [1.3, 68], [1.7, 71], [2.0, 74.5], [2.3, 78],
    [2.7, 81], [3.0, 84.5], [3.3, 88], [3.7, 91], [4.0, 96],
  ];
  const g = Math.max(0, Math.min(4, gpa));
  for (let i = 1; i < anchors.length; i++) {
    const [g0, p0] = anchors[i - 1];
    const [g1, p1] = anchors[i];
    if (g <= g1) return p0 + ((g - g0) / (g1 - g0)) * (p1 - p0);
  }
  return 96;
}

export type Course = { grade: string; credits: number; level: Level };

/** Grade input may be a letter ("B+") or a percent ("88"). */
export function gradeToPoints(grade: string): number | null {
  const g = grade.trim().toUpperCase();
  if (g in LETTER_POINTS) return LETTER_POINTS[g];
  const n = parseFloat(g);
  if (!isNaN(n) && n >= 0 && n <= 110) return percentToPoints(n);
  return null;
}

export type GpaResult = { unweighted: number; weighted: number; credits: number; qualityPoints: number };

export function computeGpa(courses: Course[], bonus: Record<Level, number> = LEVEL_BONUS, capWeighted = 5): GpaResult {
  let credits = 0, qp = 0, wqp = 0;
  for (const c of courses) {
    const pts = gradeToPoints(c.grade);
    if (pts === null || !(c.credits > 0)) continue;
    credits += c.credits;
    qp += pts * c.credits;
    // No weighting bonus on a failing grade.
    const w = pts > 0 ? Math.min(capWeighted, pts + bonus[c.level]) : 0;
    wqp += w * c.credits;
  }
  return {
    unweighted: credits ? qp / credits : 0,
    weighted: credits ? wqp / credits : 0,
    credits,
    qualityPoints: qp,
  };
}

/** Combine a prior cumulative GPA with new-term work. */
export function cumulativeGpa(priorGpa: number, priorCredits: number, termGpa: number, termCredits: number): number {
  const total = priorCredits + termCredits;
  return total ? (priorGpa * priorCredits + termGpa * termCredits) / total : 0;
}

/** GPA needed on the next `nextCredits` to reach `target`. */
export function requiredGpa(current: number, creditsDone: number, target: number, nextCredits: number): number {
  if (nextCredits <= 0) return NaN;
  return (target * (creditsDone + nextCredits) - current * creditsDone) / nextCredits;
}

/** Highest cumulative GPA reachable with straight A's over `nextCredits`. */
export function maxReachable(current: number, creditsDone: number, nextCredits: number, top = 4): number {
  return cumulativeGpa(current, creditsDone, top, nextCredits);
}

// ----- Grades -----

export type Assignment = { score: number; weight: number };

/** Weighted average of category/assignment percentages. Weights need not sum to 100. */
export function weightedGrade(items: Assignment[]): { grade: number; weightUsed: number } {
  let sw = 0, s = 0;
  for (const it of items) {
    if (!(it.weight > 0) || isNaN(it.score)) continue;
    sw += it.weight;
    s += it.score * it.weight;
  }
  return { grade: sw ? s / sw : 0, weightUsed: sw };
}

/** Score needed on a final worth `finalWeight` % to finish with `target` %. */
export function finalNeeded(current: number, target: number, finalWeight: number): number {
  const w = finalWeight / 100;
  if (w <= 0) return NaN;
  return (target - current * (1 - w)) / w;
}

/** Overall grade after a final exam. */
export function gradeAfterFinal(current: number, finalScore: number, finalWeight: number): number {
  const w = finalWeight / 100;
  return current * (1 - w) + finalScore * w;
}

export function testGrade(total: number, wrong: number): number {
  if (!(total > 0)) return 0;
  return Math.max(0, ((total - wrong) / total) * 100);
}

/** Convert a GPA between scales (e.g. 4.0 → 5.0 or 100-point). Linear, as most converters do. */
export function convertScale(gpa: number, from: number, to: number): number {
  return from > 0 ? (gpa / from) * to : 0;
}
