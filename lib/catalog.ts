import { AP_EXAMS } from "./ap.ts";

export type CategorySlug = "gpa" | "grades" | "ap" | "sat-act" | "conversions" | "schools";
export type Category = { slug: CategorySlug; name: string; blurb: string };

export const CATEGORIES: Category[] = [
  { slug: "gpa", name: "GPA calculators", blurb: "Semester, cumulative, weighted and college GPA, and what it takes to raise it." },
  { slug: "grades", name: "Grade calculators", blurb: "Class grades, weighted categories, test scores and the final exam grade you need." },
  { slug: "ap", name: "AP score calculators", blurb: `Predict your 1–5 score on ${AP_EXAMS.length} AP exams from your multiple-choice and free-response points.` },
  { slug: "sat-act", name: "SAT, ACT & PSAT", blurb: "Turn correct answers into estimated section, total and composite scores." },
  { slug: "schools", name: "College & law school GPA", blurb: "How UC, UF, UT, ASU and LSAC calculate your GPA — each with its own scale and rules." },
  { slug: "conversions", name: "Grade conversions", blurb: "Percent to GPA, letter to GPA, 4.0 to 5.0 scale, and what any GPA means." },
];

export type Kind =
  | "gpa" | "cumulative" | "raise"
  | "weighted" | "final" | "test" | "average" | "semester"
  | "sat" | "act" | "psat"
  | "pct2gpa" | "gpa2pct" | "letter2gpa" | "scale"
  | "school" | "uc";

export type GpaVariant = "general" | "college" | "high-school" | "middle-school" | "weighted" | "unweighted";

export type Calc = {
  slug: string;
  category: CategorySlug;
  title: string; // H1 and <title>
  short: string; // index listing
  kind: Kind;
  variant?: GpaVariant;
  set?: "lsac" | "uf" | "ut" | "asu";
  keyword: string;
};

export const CALCS: Calc[] = [
  // GPA
  { slug: "gpa-calculator", category: "gpa", title: "GPA Calculator", short: "Weighted and unweighted GPA for any term", kind: "gpa", variant: "general", keyword: "gpa calculator" },
  { slug: "college-gpa-calculator", category: "gpa", title: "College GPA Calculator", short: "Semester GPA from credit hours", kind: "gpa", variant: "college", keyword: "college gpa calculator" },
  { slug: "high-school-gpa-calculator", category: "gpa", title: "High School GPA Calculator", short: "Honors and AP weighting included", kind: "gpa", variant: "high-school", keyword: "high school gpa calculator" },
  { slug: "middle-school-gpa-calculator", category: "gpa", title: "Middle School GPA Calculator", short: "Simple GPA from letter grades", kind: "gpa", variant: "middle-school", keyword: "middle school gpa calculator" },
  { slug: "cumulative-gpa-calculator", category: "gpa", title: "Cumulative GPA Calculator", short: "Add this term to your overall GPA", kind: "cumulative", keyword: "cumulative gpa calculator" },
  { slug: "weighted-gpa-calculator", category: "gpa", title: "Weighted GPA Calculator", short: "5.0 scale with honors and AP bonus", kind: "gpa", variant: "weighted", keyword: "weighted gpa calculator" },
  { slug: "unweighted-gpa-calculator", category: "gpa", title: "Unweighted GPA Calculator", short: "Plain 4.0 scale GPA", kind: "gpa", variant: "unweighted", keyword: "unweighted gpa calculator" },
  { slug: "raise-gpa-calculator", category: "gpa", title: "Raise GPA Calculator", short: "Grades needed to reach a target GPA", kind: "raise", keyword: "raise gpa calculator" },
  // Grades
  { slug: "grade-calculator", category: "grades", title: "Grade Calculator", short: "Class grade from weighted categories", kind: "weighted", keyword: "grade calculator" },
  { slug: "final-grade-calculator", category: "grades", title: "Final Grade Calculator", short: "Score you need on the final exam", kind: "final", keyword: "final grade calculator" },
  { slug: "weighted-grade-calculator", category: "grades", title: "Weighted Grade Calculator", short: "Average grades with different weights", kind: "weighted", keyword: "weighted grade calculator" },
  { slug: "test-grade-calculator", category: "grades", title: "Test Grade Calculator", short: "Percent and letter from questions wrong", kind: "test", keyword: "test grade calculator" },
  { slug: "average-grade-calculator", category: "grades", title: "Average Grade Calculator", short: "Average of equally weighted grades", kind: "average", keyword: "grade average calculator" },
  { slug: "semester-grade-calculator", category: "grades", title: "Semester Grade Calculator", short: "Two quarters plus a final exam", kind: "semester", keyword: "semester grade calculator" },
  // Tests
  { slug: "sat-score-calculator", category: "sat-act", title: "SAT Score Calculator", short: "Digital SAT estimate from correct answers", kind: "sat", keyword: "sat score calculator" },
  { slug: "act-score-calculator", category: "sat-act", title: "ACT Score Calculator", short: "Section scores and composite", kind: "act", keyword: "act score calculator" },
  { slug: "psat-score-calculator", category: "sat-act", title: "PSAT Score Calculator", short: "PSAT/NMSQT score and Selection Index", kind: "psat", keyword: "psat score calculator" },
  // Institution rules
  { slug: "uc-gpa-calculator", category: "schools", title: "UC GPA Calculator", short: "University of California capped and weighted GPA", kind: "uc", keyword: "uc gpa calculator" },
  { slug: "uf-gpa-calculator", category: "schools", title: "UF GPA Calculator", short: "University of Florida recalculated core GPA", kind: "school", set: "uf", keyword: "uf gpa calculator" },
  { slug: "ut-gpa-calculator", category: "schools", title: "UT GPA Calculator", short: "UT Austin college GPA and UT Knoxville core GPA", kind: "school", set: "ut", keyword: "ut gpa calculator" },
  { slug: "asu-gpa-calculator", category: "schools", title: "ASU GPA Calculator", short: "Arizona State plus/minus scale, capped at 4.00", kind: "school", set: "asu", keyword: "asu gpa calculator" },
  { slug: "lsac-gpa-calculator", category: "schools", title: "LSAC GPA Calculator", short: "Law school GPA on the 4.33 scale", kind: "school", set: "lsac", keyword: "lsac gpa calculator" },
  // Conversions
  { slug: "percentage-to-gpa-calculator", category: "conversions", title: "Percentage to GPA Calculator", short: "Percent grade to 4.0 scale", kind: "pct2gpa", keyword: "percentage to gpa" },
  { slug: "gpa-to-percentage-calculator", category: "conversions", title: "GPA to Percentage Calculator", short: "4.0 GPA to an approximate percent", kind: "gpa2pct", keyword: "gpa to percentage" },
  { slug: "letter-grade-to-gpa-calculator", category: "conversions", title: "Letter Grade to GPA Calculator", short: "Letter grades to grade points", kind: "letter2gpa", keyword: "letter grade to gpa" },
  { slug: "gpa-scale-converter", category: "conversions", title: "GPA Scale Converter", short: "4.0, 5.0, 10-point and 100-point scales", kind: "scale", keyword: "gpa scale converter" },
];

export const CALC_BY_SLUG: Record<string, Calc> = Object.fromEntries(CALCS.map((c) => [c.slug, c]));
export const CAT_BY_SLUG: Record<string, Category> = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));

/** GPA values that get their own "what does a X GPA mean" page: 2.0 to 4.5 in 0.1 steps (above 4.0 = weighted). */
export const GPA_VALUES: number[] = Array.from({ length: 26 }, (_, i) => Math.round((2 + i * 0.1) * 10) / 10);
export const gpaSlug = (g: number) => g.toFixed(1).replace(".", "-");
export const gpaFromSlug = (s: string) => parseFloat(s.replace("-", "."));
