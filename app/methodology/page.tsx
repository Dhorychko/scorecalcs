import type { Metadata } from "next";
import Link from "next/link";
import { LETTERS } from "@/lib/gpa";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "How We Calculate",
  description: "The GPA scale, percent-to-letter table, AP composite model, SAT/ACT estimates and the sources behind every ScoreCalcs calculator.",
  alternates: { canonical: "/methodology/" },
};

export default function Methodology() {
  return (
    <div className="wrap" style={{ paddingBlock: "24px 48px" }}>
      <article className="prose">
        <h1>How we calculate</h1>
        <p className="lede">Every number on {SITE.name} comes from a formula on this page. Where an exam board doesn&apos;t publish the conversion, we say the result is an estimate.</p>
        <h2>GPA</h2>
        <p>We use the standard U.S. 4.0 scale. Percentages convert to letters with the College Board&apos;s table. Weighted GPA adds a bonus to the grade points of honors (default +0.5) and AP, IB or dual-enrollment classes (default +1.0), with no bonus on an F. GPA is the credit-weighted average of grade points.</p>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Letter</th><th className="r">Percent</th><th className="r">Points</th></tr></thead>
            <tbody>{LETTERS.map((l) => <tr key={l.letter}><td>{l.letter}</td><td className="r">{l.letter === "F" ? "below 65" : l.letter === "D-" ? "—" : `${l.min}–${l.max}`}</td><td className="r">{l.points.toFixed(1)}</td></tr>)}</tbody>
          </table>
        </div>
        <h2>AP scores</h2>
        <p>Each AP calculator uses that exam&apos;s format from College Board&apos;s course pages and scoring guidelines: the number of multiple-choice questions, the points for each free-response question and each section&apos;s weight. Where the May {SITE.examYear} exam changes and the new structure is published (Calculus, Precalculus and Physics), we use the {SITE.examYear} format; otherwise the page says which year&apos;s format it uses.</p>
        <p>The composite is the weighted sum of each section&apos;s share of points. College Board doesn&apos;t publish the composite cutoffs for scores 1–5. For Calculus AB and BC we use widely cited ranges from released exams. For other exams we use three estimated curves, chosen by how generous the exam&apos;s actual 2026 score distribution was. Treat predicted scores as estimates.</p>
        <h2>SAT, PSAT and ACT</h2>
        <p>The digital SAT and PSAT are adaptive and every test form has its own conversion. Our curves are estimates shaped on official Bluebook practice tests, with separate curves for the harder and easier second module. ACT estimates use a single conversion curve for the enhanced ACT (English 50, Math 45, Reading 36, optional Science 40 questions); the composite averages English, Math and Reading.</p>
        <h2>Sources</h2>
        <ul>
          <li>College Board, AP course and exam pages and 2026 scoring guidelines — <a href="https://apcentral.collegeboard.org/">apcentral.collegeboard.org</a></li>
          <li>College Board, AP score distributions 2026 — <a href="https://apstudents.collegeboard.org/about-ap-scores/score-distributions">apstudents.collegeboard.org</a></li>
          <li>College Board, how to convert your GPA to a 4.0 scale — <a href="https://bigfuture.collegeboard.org/plan-for-college/college-prep/academics/how-to-convert-gpa-4.0-scale">bigfuture.collegeboard.org</a></li>
          <li>ACT, the enhanced ACT — <a href="https://www.act.org/">act.org</a></li>
          <li>U.S. Department of Education, NCES High School Transcript Study 2019 (average GPA ≈ 3.11) — <a href="https://nces.ed.gov/nationsreportcard/hsts/">nces.ed.gov</a></li>
        </ul>
        <p>Found a mistake? Let us know through the <Link href="/about/">about page</Link>.</p>
      </article>
    </div>
  );
}
