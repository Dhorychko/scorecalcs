import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Calculator from "@/components/Calculator";
import { Faq, Schema } from "@/components/Faq";
import { CALCS, CALC_BY_SLUG, CAT_BY_SLUG } from "@/lib/catalog";
import { CONTENT } from "@/lib/content";
import { metaDesc } from "@/lib/site";

const META: Record<string, string> = {
  "gpa-calculator": "Calculate your GPA for a semester or year: enter letter or percent grades, credits and class level to get weighted and unweighted GPA on the 4.0 scale.",
  "weighted-gpa-calculator": "Calculate your weighted GPA on a 5.0 scale. Honors classes add 0.5 and AP, IB or dual-enrollment classes add 1.0, and you can change the bonus to match your school.",
  "unweighted-gpa-calculator": "Calculate your unweighted GPA on the standard 4.0 scale from letter or percentage grades. Every class counts the same, whatever its level. Free, no sign-up.",
  "cumulative-gpa-calculator": "Find your new cumulative GPA after this semester: enter your GPA and credits so far plus this term's GPA and credits, and see how much your overall GPA moves.",
  "college-gpa-calculator": "Calculate your college semester GPA from letter grades and credit hours. See quality points and total credits, then combine the term with your cumulative GPA.",
  "weighted-grade-calculator": "Average grades that count for different amounts. Enter each grade with its weight (percent, points or credit hours) and get the weighted average and letter grade.",
  "semester-grade-calculator": "Combine two quarter grades and a semester exam into a semester grade. Uses the common 40/40/20 split by default, and you can change the weights to match your school.",
  "test-grade-calculator": "Turn the number of questions you got wrong into a test percentage and letter grade, with a chart showing your score for every number of wrong answers.",
  "gpa-scale-converter": "Convert a GPA between 4.0, 5.0, 10-point and 100-point scales. Compare a weighted 5.0 GPA with a 4.0 requirement or a GPA from another grading system.",
  "act-score-calculator": "Estimate your ACT section scores and composite from the questions you got right on English, Math, Reading and optional Science, updated for the enhanced ACT.",
  "uc-gpa-calculator": "Calculate your UC GPA: A–G courses from 10th–11th grade, no plus or minus, honors points capped at 8 semesters. Shows capped, fully weighted and unweighted GPA.",
  "lsac-gpa-calculator": "Calculate your LSAC GPA for law school applications on LSAC's 4.33 scale (A+ = 4.33). Includes the 2027–28 rule that excludes dual-enrollment courses.",
  "uf-gpa-calculator": "Estimate your University of Florida recalculated GPA: core courses only, +1.0 for AP, IB, AICE and dual enrollment, +0.5 for honors. UF admits average 4.5–4.7.",
  "ut-gpa-calculator": "UT GPA calculator: UT Austin college GPA on its plus/minus scale (no A+) and UT Knoxville's weighted core GPA for admission, with each school's official rules.",
  "asu-gpa-calculator": "Calculate your ASU GPA on Arizona State's plus/minus scale: A+ = 4.33 per course, cumulative GPA capped at 4.00, no C-, D+ or D-, and E for a failing grade.",
  "sat-score-calculator": "Estimate your digital SAT score from the questions you got right in Reading and Writing and in Math, adjusted for whether your second module was harder or easier.",
};

export const dynamicParams = false;
export function generateStaticParams() {
  return CALCS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = CALC_BY_SLUG[slug];
  if (!c) return {};
  return { title: c.title, description: META[slug] ?? metaDesc(CONTENT[slug].intro, "Free, no sign-up."), alternates: { canonical: `/${slug}/` } };
}

export default async function CalcPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = CALC_BY_SLUG[slug];
  const content = CONTENT[slug];
  if (!c || !content) notFound();
  const cat = CAT_BY_SLUG[c.category];
  const same = CALCS.filter((x) => x.category === c.category && x.slug !== slug);
  const related = content.related.map((s) => (s === "ap-score-calculator" ? { slug: s, title: "AP Score Calculator" } : CALC_BY_SLUG[s])).filter(Boolean);

  return (
    <>
      <Schema crumbs={[["Home", "/"], [cat.name, `/category/${cat.slug}/`], [c.title, `/${slug}/`]]} faq={content.faq} />
      <div className="hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href={`/category/${cat.slug}/`}>{cat.name}</Link></nav>
          <h1>{c.title}</h1>
          <p className="lede">{content.intro}</p>
          <Calculator slug={slug} />
        </div>
      </div>
      <div className="wrap article">
        <article className="prose">
          <h2>How to use it</h2>
          <ol>{content.steps.map((s) => <li key={s}>{s}</li>)}</ol>
          <h2>The formula</h2>
          <div className="formula">{content.formula.map((f) => <p key={f}>{f}</p>)}</div>
          {content.example && <p><b>Example:</b> {content.example}</p>}
          <h2>Good to know</h2>
          <ul>{content.tips.map((t) => <li key={t}>{t}</li>)}</ul>
          <Faq items={content.faq} />
        </article>
        <aside className="side">
          <h2>Related</h2>
          <ul>{related.map((r) => <li key={r!.slug}><Link href={`/${r!.slug}/`}>{r!.title}</Link></li>)}</ul>
          <h2>More {cat.name.toLowerCase()}</h2>
          <ul>{same.map((x) => <li key={x.slug}><Link href={`/${x.slug}/`}>{x.title}</Link></li>)}</ul>
        </aside>
      </div>
    </>
  );
}
