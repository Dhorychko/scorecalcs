import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ApCalc from "@/components/ApCalc";
import { Faq, Schema } from "@/components/Faq";
import { AP_BY_SLUG, AP_EXAMS } from "@/lib/ap";
import { apFaq, apFormatRows, apIntro, apRelated, apTips } from "@/lib/apContent";

export const dynamicParams = false;
export function generateStaticParams() {
  return AP_EXAMS.map((e) => ({ exam: e.slug }));
}

const title = (e: (typeof AP_EXAMS)[number]) => `${e.short} Score Calculator (${e.formatYear === 2027 ? "2027" : "2026–27"})`;

export async function generateMetadata({ params }: { params: Promise<{ exam: string }> }): Promise<Metadata> {
  const { exam } = await params;
  const e = AP_BY_SLUG[exam];
  if (!e) return {};
  return {
    title: title(e),
    description: `Predict your ${e.short} score: enter your multiple-choice and free-response points for a 1–5 estimate on the ${e.name.replace("AP ", "AP ")} exam. ${e.dist2026.five}% scored a 5 in 2026.`.length <= 160
      ? `Predict your ${e.short} score: enter your multiple-choice and free-response points for a 1–5 estimate on the ${e.name} exam. ${e.dist2026.five}% scored a 5 in 2026.`
      : `Predict your ${e.short} score from your multiple-choice and free-response points. Real exam format, section weights and 2026 results: ${e.dist2026.five}% scored a 5.`,
    alternates: { canonical: `/ap/${exam}/` },
  };
}

export default async function ApPage({ params }: { params: Promise<{ exam: string }> }) {
  const { exam } = await params;
  const e = AP_BY_SLUG[exam];
  if (!e) notFound();
  const faq = apFaq(e);
  const cuts = [
    { s: 5, from: e.cut.five, to: 1 },
    { s: 4, from: e.cut.four, to: e.cut.five },
    { s: 3, from: e.cut.three, to: e.cut.four },
    { s: 2, from: e.cut.two, to: e.cut.three },
    { s: 1, from: 0, to: e.cut.two },
  ];
  return (
    <>
      <Schema crumbs={[["Home", "/"], ["AP score calculators", "/ap-score-calculator/"], [`${e.short} score calculator`, `/ap/${e.slug}/`]]} faq={faq} />
      <div className="hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/ap-score-calculator/">AP score calculators</Link></nav>
          <h1>{e.name} Score Calculator</h1>
          <p className="lede">{apIntro(e)}</p>
          <ApCalc exam={e} />
        </div>
      </div>
      <div className="wrap article">
        <article className="prose">
          {e.note && <div className="callout"><b>Exam format.</b> {e.note}</div>}
          <h2>The {e.short} exam format</h2>
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Section</th><th>What&apos;s in it</th><th className="r">Time</th><th className="r">Weight</th></tr></thead>
              <tbody>{apFormatRows(e).map((r) => <tr key={r.section}><td>{r.section}</td><td>{r.detail}</td><td className="r">{r.time}</td><td className="r">{r.weight}</td></tr>)}</tbody>
            </table>
          </div>
          <h2>How your score is calculated</h2>
          <div className="formula">
            {e.mc.count > 0 && <p>Multiple choice: right answers ÷ {e.mc.count} × {Math.round(e.mc.weight * 1000) / 10}%</p>}
            <p>{e.mc.count > 0 ? "Free response" : "Each part"}: your points ÷ maximum points × that part&apos;s weight</p>
            <p>Composite = the sum, as a percentage of the maximum. The composite then maps to a 1–5 score.</p>
          </div>
          <h3>Estimated score ranges</h3>
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>AP score</th><th className="r">Composite (estimate)</th></tr></thead>
              <tbody>{cuts.map((c) => <tr key={c.s}><td>{c.s}</td><td className="r">{c.s === 5 ? `${Math.round(c.from * 100)}% and up` : c.s === 1 ? `below ${Math.round(c.to * 100)}%` : `${Math.round(c.from * 100)}–${Math.round(c.to * 100) - 1}%`}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="small muted">College Board doesn&apos;t publish cutoffs. These are estimates; real cutoffs shift a few points from year to year.</p>
          <h2>How students scored in 2026</h2>
          <p>{e.dist2026.pass}% of students who took {e.name} in May 2026 earned a 3 or higher, and {e.dist2026.five}% earned a 5 (College Board score distributions).</p>
          <h2>Tips for more points</h2>
          <ul>{apTips(e).map((t) => <li key={t}>{t}</li>)}</ul>
          <Faq items={faq} />
        </article>
        <aside className="side">
          <h2>More {e.group} AP calculators</h2>
          <ul>{apRelated(e).map((x) => <li key={x.slug}><Link href={`/ap/${x.slug}/`}>{x.short} score calculator</Link></li>)}</ul>
          <h2>Also useful</h2>
          <ul>
            <li><Link href="/ap-score-calculator/">All AP score calculators</Link></li>
            <li><Link href="/weighted-gpa-calculator/">Weighted GPA calculator</Link></li>
            <li><Link href="/sat-score-calculator/">SAT score calculator</Link></li>
          </ul>
        </aside>
      </div>
    </>
  );
}
