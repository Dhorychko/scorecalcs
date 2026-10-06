import type { Metadata } from "next";
import Link from "next/link";
import { Faq, Schema } from "@/components/Faq";
import { AP_EXAMS, AP_GROUPS } from "@/lib/ap";
import { SITE } from "@/lib/site";

const INTRO = `Pick your exam to predict your AP score. Each calculator uses that exam's real format — number of multiple-choice questions, free-response point values and section weights — and an estimated curve to turn your points into a 1–5 score. ${AP_EXAMS.length} exams, updated for May ${SITE.examYear}.`;

export const metadata: Metadata = {
  title: `AP Score Calculator for Every Exam (${SITE.examYear})`,
  description: `Predict your 1–5 AP score on ${AP_EXAMS.length} exams, from APUSH and AP Lang to Calculus and Physics. Real exam formats, section weights and 2026 score distributions.`,
  alternates: { canonical: "/ap-score-calculator/" },
};

const FAQ = [
  { q: "How are AP scores calculated?", a: "Your multiple-choice and free-response points are each converted to a share of their section, multiplied by the section's weight, and added into a composite score. College Board then sets cutoffs that turn composite ranges into scores from 1 to 5." },
  { q: "What AP score do colleges accept for credit?", a: "Most colleges give credit for a 3 or higher, but many selective universities require a 4 or 5, and some only use AP scores for placement. Check each college's AP credit policy page." },
  { q: "Is a 3 a passing AP score?", a: "College Board calls a 3 'qualified', and it's the usual minimum for college credit. A 4 is 'well qualified' and a 5 'extremely well qualified'." },
  { q: "How accurate is an AP score calculator?", a: "It's as accurate as your point estimates and the curve. Free-response scores are the biggest unknown; score your practice answers with the official rubric for the most realistic prediction." },
];

export default function ApHub() {
  const sorted = [...AP_EXAMS].sort((a, b) => b.dist2026.five - a.dist2026.five);
  return (
    <>
      <Schema crumbs={[["Home", "/"], ["AP score calculators", "/ap-score-calculator/"]]} faq={FAQ} />
      <div className="hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link></nav>
          <h1>AP Score Calculator</h1>
          <p className="lede">{INTRO}</p>
          {AP_GROUPS.map((g) => {
            const list = AP_EXAMS.filter((e) => e.group === g);
            if (!list.length) return null;
            return (
              <section key={g}>
                <h2 style={{ marginTop: "1.2em" }}>{g}</h2>
                <ul className="ap-grid">
                  {list.map((e) => (
                    <li key={e.slug}><Link href={`/ap/${e.slug}/`}>{e.name.replace("AP ", "")}<span>{e.dist2026.five}% got a 5</span></Link></li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
      <div className="wrap article">
        <article className="prose">
          <h2>How AP scores are calculated</h2>
          <p>Every AP exam with a written exam has two parts. Multiple choice is scored by machine with no penalty for wrong answers. Free-response answers are scored by AP readers against a published rubric. Each section is converted to a weighted composite, and College Board sets the composite ranges for 1 to 5 each year after scoring — those ranges aren&apos;t published, which is why every AP calculator, ours included, uses estimates.</p>
          <h2>2026 score distributions</h2>
          <p>Share of students scoring a 5 and a 3 or higher in May 2026, from the exams with the most 5s to the fewest.</p>
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Exam</th><th className="r">Scored 5</th><th className="r">Scored 3+</th></tr></thead>
              <tbody>{sorted.map((e) => <tr key={e.slug}><td><Link href={`/ap/${e.slug}/`}>{e.name}</Link></td><td className="r">{e.dist2026.five}%</td><td className="r">{e.dist2026.pass}%</td></tr>)}</tbody>
            </table>
          </div>
          <p className="small muted">Source: College Board, AP score distributions, 2026. AP Research and the AP Art and Design portfolios have no exam, so there&apos;s no calculator for them.</p>
          <Faq items={FAQ} />
        </article>
        <aside className="side">
          <h2>Most searched</h2>
          <ul>
            {["us-history", "english-language", "biology", "calculus-ab", "world-history", "chemistry", "statistics", "psychology"].map((s) => {
              const e = AP_EXAMS.find((x) => x.slug === s)!;
              return <li key={s}><Link href={`/ap/${s}/`}>{e.short} score calculator</Link></li>;
            })}
          </ul>
        </aside>
      </div>
    </>
  );
}
