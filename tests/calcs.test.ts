import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeGpa, cumulativeGpa, requiredGpa, finalNeeded, gradeAfterFinal, weightedGrade, testGrade,
  percentToLetter, percentToPoints, pointsToLetter, pointsToPercent, gradeToPoints, convertScale,
} from "../lib/gpa.ts";
import { AP_EXAMS, AP_BY_SLUG, composite, apScore, mcNeeded, totalWeight, defaults } from "../lib/ap.ts";
import { satSection, psatSection, selectionIndex, actSection, actComposite } from "../lib/satact.ts";
import { CALCS, GPA_VALUES, gpaSlug } from "../lib/catalog.ts";

const close = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} ≉ ${b}`);

test("College Board percent bands", () => {
  assert.equal(percentToLetter(97), "A+");
  assert.equal(percentToLetter(93), "A");
  assert.equal(percentToLetter(92), "A-");
  assert.equal(percentToLetter(89.4), "B+");
  assert.equal(percentToLetter(65), "D");
  assert.equal(percentToLetter(64), "F");
  assert.equal(percentToPoints(85), 3.0);
});

test("unweighted and weighted GPA", () => {
  const r = computeGpa([
    { grade: "A", credits: 1, level: "ap" },
    { grade: "B+", credits: 1, level: "honors" },
    { grade: "B", credits: 1, level: "regular" },
    { grade: "F", credits: 1, level: "ap" },
  ]);
  close(r.unweighted, (4 + 3.3 + 3 + 0) / 4);
  close(r.weighted, (5 + 3.8 + 3 + 0) / 4); // no bonus on F
  assert.equal(r.credits, 4);
});

test("credit-weighted college GPA and percent input", () => {
  const r = computeGpa([
    { grade: "A-", credits: 4, level: "regular" },
    { grade: "85", credits: 3, level: "regular" },
  ]);
  close(r.unweighted, (3.7 * 4 + 3 * 3) / 7);
  assert.equal(gradeToPoints("zz"), null);
});

test("cumulative and required GPA", () => {
  close(cumulativeGpa(3.2, 60, 3.8, 15), (3.2 * 60 + 3.8 * 15) / 75);
  const need = requiredGpa(3.2, 60, 3.4, 30);
  close(need, (3.4 * 90 - 3.2 * 60) / 30); // 3.8
  close(need, 3.8);
});

test("grades", () => {
  close(finalNeeded(85, 90, 20), 110); // needs 110% — impossible, UI flags it
  close(finalNeeded(88, 85, 25), 76);
  close(gradeAfterFinal(88, 76, 25), 85);
  close(weightedGrade([{ score: 90, weight: 40 }, { score: 80, weight: 60 }]).grade, 84);
  close(testGrade(25, 3), 88);
});

test("GPA ↔ percent and letter", () => {
  assert.equal(pointsToLetter(3.5), "A-");
  assert.equal(pointsToLetter(3.4), "B+");
  assert.equal(pointsToLetter(3.0), "B");
  assert.ok(pointsToPercent(3.0) > 83 && pointsToPercent(3.0) < 87);
  assert.ok(pointsToPercent(4.0) >= 93);
  close(convertScale(3.6, 4, 5), 4.5);
});

test("every AP exam's weights sum to 100%", () => {
  for (const e of AP_EXAMS) close(totalWeight(e), 1, 1e-9);
});

test("AP composites stay in [0,1] and perfect = 5", () => {
  for (const e of AP_EXAMS) {
    assert.equal(apScore(composite(e, e.mc.count, e.frq.map((f) => f.max)), e.cut), 5, e.slug);
    assert.equal(apScore(composite(e, 0, e.frq.map(() => 0)), e.cut), 1, e.slug);
    const d = defaults(e);
    const c = composite(e, d.mc, d.frq);
    assert.ok(c > 0.5 && c < 0.75, `${e.slug} default composite ${c}`);
    assert.ok(e.cut.five > e.cut.four && e.cut.four > e.cut.three && e.cut.three > e.cut.two);
  }
});

test("APUSH composite by hand", () => {
  const e = AP_BY_SLUG["us-history"];
  // 40/55 MC, SAQ 2+3+2, DBQ 5, LEQ 4
  const c = composite(e, 40, [2, 3, 2, 5, 4]);
  const expected = (40 / 55) * 0.4 + (2 / 3 + 3 / 3 + 2 / 3) * (0.2 / 3) + (5 / 7) * 0.25 + (4 / 6) * 0.15;
  close(c, expected);
  assert.equal(apScore(c, e.cut), 5); // ≈72.5% of composite
});

test("Calc AB cutoffs map to 108-point composite", () => {
  const e = AP_BY_SLUG["calculus-ab"];
  // composite 69/108 → 5
  assert.equal(apScore(69 / 108, e.cut), 5);
  assert.equal(apScore(56 / 108, e.cut), 3);
  const need = mcNeeded(e, 5, [9, 9, 9, 9, 9, 9]);
  assert.ok(need !== null && need < 20);
});

test("SAT/PSAT/ACT estimates", () => {
  assert.equal(satSection("rw", 54, "harder"), 800);
  assert.equal(satSection("math", 0, "harder"), 200);
  assert.ok(satSection("math", 44, "easier") <= 620);
  assert.ok(satSection("rw", 27, "harder") === 500);
  assert.equal(psatSection("rw", 54, "harder"), 760);
  assert.equal(psatSection("math", 0, "easier"), 160);
  assert.equal(selectionIndex(760, 760), 228);
  assert.equal(selectionIndex(160, 160), 48);
  assert.equal(actSection(50, 50), 36);
  assert.equal(actSection(0, 45), 1);
  assert.equal(actComposite(30, 31, 32), 31);
});

test("catalog sanity", () => {
  const slugs = new Set(CALCS.map((c) => c.slug));
  assert.equal(slugs.size, CALCS.length);
  assert.equal(GPA_VALUES.length, 21);
  assert.equal(gpaSlug(3.5), "3-5");
  assert.equal(AP_EXAMS.length, 33);
});
