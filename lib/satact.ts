// SAT, PSAT and ACT score estimates.
// The digital SAT/PSAT is adaptive: the same raw score converts differently depending on whether the
// second module was the harder or easier one, and conversion tables change from test to test. College Board
// does not publish a single table, so these curves are estimates shaped on official Bluebook practice tests.
// The enhanced ACT (2025+): English 50 Q, Math 45 Q, Reading 36 Q, optional Science 40 Q;
// Composite = average of English, Math and Reading. Conversion tables vary by form; ours is an estimate.

type Curve = [number, number][]; // [share correct 0–1, scaled score]

function interp(c: Curve, x: number): number {
  const v = Math.max(0, Math.min(1, x));
  for (let i = 1; i < c.length; i++) {
    const [x0, y0] = c[i - 1];
    const [x1, y1] = c[i];
    if (v <= x1) return y0 + ((v - x0) / (x1 - x0)) * (y1 - y0);
  }
  return c[c.length - 1][1];
}

export const SAT = {
  rw: { questions: 54, modules: "2 modules × 27 questions, 64 minutes" },
  math: { questions: 44, modules: "2 modules × 22 questions, 70 minutes" },
};

// Harder second module (the route to high scores).
const SAT_RW_HARD: Curve = [[0, 200], [0.1, 280], [0.2, 340], [0.3, 400], [0.4, 450], [0.5, 500], [0.6, 550], [0.7, 600], [0.8, 660], [0.9, 720], [0.95, 760], [1, 800]];
const SAT_M_HARD: Curve = [[0, 200], [0.1, 270], [0.2, 330], [0.3, 390], [0.4, 440], [0.5, 490], [0.6, 540], [0.7, 600], [0.8, 660], [0.9, 730], [0.95, 770], [1, 800]];
// Easier second module: scores flatten out and top out well below 800.
const SAT_RW_EASY: Curve = [[0, 200], [0.2, 300], [0.4, 380], [0.6, 450], [0.8, 520], [1, 600]];
const SAT_M_EASY: Curve = [[0, 200], [0.2, 290], [0.4, 370], [0.6, 440], [0.8, 520], [1, 610]];

const round10 = (n: number) => Math.round(n / 10) * 10;

export type Module2 = "harder" | "easier";

export function satSection(section: "rw" | "math", correct: number, module2: Module2): number {
  const q = section === "rw" ? SAT.rw.questions : SAT.math.questions;
  const curve = section === "rw" ? (module2 === "harder" ? SAT_RW_HARD : SAT_RW_EASY) : module2 === "harder" ? SAT_M_HARD : SAT_M_EASY;
  return round10(interp(curve, correct / q));
}

/** Rough ± range: one question on the digital SAT moves a section 10–30 points depending on the form. */
export const SAT_RANGE = 30;

/** PSAT/NMSQT: same question counts as the SAT, sections scored 160–760. */
export function psatSection(section: "rw" | "math", correct: number, module2: Module2): number {
  const sat = satSection(section, correct, module2);
  // Shift the SAT curve onto the PSAT scale (160–760) — the PSAT is calibrated to predict SAT performance.
  return Math.max(160, Math.min(760, round10(160 + ((sat - 200) / 600) * 600)));
}

/** National Merit Selection Index: 2 × (RW / 10) + (Math / 10). Range 48–228. */
export function selectionIndex(rw: number, math: number): number {
  return 2 * (rw / 10) + math / 10;
}

export const ACT = {
  english: { questions: 50, minutes: 35 },
  math: { questions: 45, minutes: 50 },
  reading: { questions: 36, minutes: 40 },
  science: { questions: 40, minutes: 40 },
};
const ACT_CURVE: Curve = [[0, 1], [0.1, 9], [0.2, 12], [0.3, 15], [0.4, 17], [0.5, 20], [0.6, 22], [0.7, 25], [0.8, 28], [0.9, 32], [0.95, 34], [1, 36]];

export function actSection(correct: number, questions: number): number {
  return Math.round(interp(ACT_CURVE, correct / questions));
}

/** Composite: English, Math, Reading averaged, rounded half up. */
export function actComposite(e: number, m: number, r: number): number {
  return Math.round((e + m + r) / 3);
}

export function actStem(m: number, s: number): number {
  return Math.round((m + s) / 2);
}
