// AP composite math — kept separate from the exam data so the calculator bundle stays small.
import type { ApExam, Cuts } from "./apTypes.ts";

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
