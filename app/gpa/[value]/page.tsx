import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RaiseCalc } from "@/components/GpaCalc";
import { Faq, Schema } from "@/components/Faq";
import { GPA_VALUES, gpaFromSlug, gpaSlug } from "@/lib/catalog";
import { convertScale, pointsToLetter, pointsToPercent, requiredGpa } from "@/lib/gpa";

export const dynamicParams = false;
export function generateStaticParams() {
  return GPA_VALUES.map((g) => ({ value: gpaSlug(g) }));
}

function verdict(g: number): { label: string; text: string } {
  if (g >= 3.8) return { label: "excellent", text: "It's in the range typical of students admitted to the most selective colleges, where most admits have unweighted GPAs of 3.8 or higher." };
  if (g >= 3.5) return { label: "very good", text: "It's well above the U.S. average and meets the 3.5 bar many colleges use for the Dean's List and for merit scholarships." };
  if (g >= 3.0) return { label: "good", text: "It's around or above the national average — U.S. high school graduates averaged about 3.1 in the Department of Education's most recent transcript study — and it meets the 3.0 minimum many scholarships and graduate programs set." };
  if (g >= 2.5) return { label: "fair", text: "It's below the national average of about 3.1. It meets the minimum for admission at many four-year colleges, but a lot of scholarships ask for 3.0." };
  return { label: "below average", text: "It's a C average. A 2.0 is the usual minimum for good academic standing in college; NCAA rules require a 2.3 core-course GPA to compete in Division I as a freshman and 2.2 in Division II." };
}

export async function generateMetadata({ params }: { params: Promise<{ value: string }> }): Promise<Metadata> {
  const { value } = await params;
  const g = gpaFromSlug(value);
  if (!GPA_VALUES.includes(g)) return {};
  const v = verdict(g);
  return {
    title: `Is a ${g.toFixed(1)} GPA Good? Letter Grade and Percentage`,
    description: `A ${g.toFixed(1)} GPA is ${/^[AEF]/.test(pointsToLetter(g)) ? "an" : "a"} ${pointsToLetter(g)} average, about ${Math.round(pointsToPercent(g))}% — ${v.label} for high school or college. See how it compares with the U.S. average and what it takes to raise it.`,
    alternates: { canonical: `/gpa/${value}/` },
  };
}

export default async function GpaValue({ params }: { params: Promise<{ value: string }> }) {
  const { value } = await params;
  const g = gpaFromSlug(value);
  if (!GPA_VALUES.includes(g)) notFound();
  const letter = pointsToLetter(g);
  const pctv = Math.round(pointsToPercent(g));
  const v = verdict(g);
  const art = /^[AEF]/.test(letter) ? "an" : "a";
  const target = g >= 3.8 ? 4 : Math.round((g + 0.2) * 10) / 10;
  const scenarios = [15, 30, 60, 90].map((done) => ({ done, need: requiredGpa(g, done, target, 15) }));
  const neighbors = GPA_VALUES.filter((x) => Math.abs(x - g) > 0.01 && Math.abs(x - g) <= 0.31);
  const faq = [
    { q: `What letter grade is a ${g.toFixed(1)} GPA?`, a: `A ${g.toFixed(1)} GPA works out to ${art} ${letter} average on the standard 4.0 scale.` },
    { q: `What percentage is a ${g.toFixed(1)} GPA?`, a: `About ${pctv}%, using the College Board's letter-grade bands. There's no single official conversion, so schools may differ by a point or two.` },
    { q: `Is a ${g.toFixed(1)} GPA good?`, a: `It's ${v.label}. ${v.text}` },
    { q: `What is a ${g.toFixed(1)} GPA on a 5.0 scale?`, a: `Proportionally it's ${convertScale(g, 4, 5).toFixed(2)} out of 5.0. A real weighted GPA depends on which classes were honors or AP, so recalculate from your grades for an exact number.` },
  ];

  return (
    <>
      <Schema crumbs={[["Home", "/"], ["Grade conversions", "/category/conversions/"], [`${g.toFixed(1)} GPA`, `/gpa/${value}/`]]} faq={faq} />
      <div className="hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/category/conversions/">Grade conversions</Link></nav>
          <h1>Is a {g.toFixed(1)} GPA good?</h1>
          <p className="lede">A {g.toFixed(1)} GPA is {art} <b>{letter}</b> average, or about <b>{pctv}%</b>. It&apos;s {v.label}. {v.text}</p>
          {g < 4 ? <>
            <h2 style={{ marginTop: "1.2em" }}>Raise it from {g.toFixed(1)}</h2>
            <RaiseCalc preset={g} />
          </> : <p className="callout">A 4.0 is the top of the unweighted scale: every grade so far is an A. To stand out further, colleges look at course rigor — a weighted GPA with honors and AP classes can go above 4.0. <Link href="/weighted-gpa-calculator/">Calculate your weighted GPA</Link>.</p>}
        </div>
      </div>
      <div className="wrap article">
        <article className="prose">
          <h2>{g.toFixed(1)} GPA at a glance</h2>
          <div className="table-wrap">
            <table className="data">
              <tbody>
                <tr><td>Letter grade</td><td className="r">{letter}</td></tr>
                <tr><td>Percentage</td><td className="r">≈{pctv}%</td></tr>
                <tr><td>On a 5.0 scale (proportional)</td><td className="r">{convertScale(g, 4, 5).toFixed(2)}</td></tr>
                <tr><td>On a 100-point scale (proportional)</td><td className="r">{convertScale(g, 4, 100).toFixed(1)}</td></tr>
              </tbody>
            </table>
          </div>
          {g < 4 && <>
            <h2>What it takes to get to {target.toFixed(1)}</h2>
            <p>GPA needed over your next 15 credits (one full college semester) to move from {g.toFixed(1)} to {target.toFixed(1)}, depending on how many credits you&apos;ve already completed:</p>
            <div className="table-wrap">
              <table className="data">
                <thead><tr><th>Credits completed</th><th className="r">GPA needed next semester</th></tr></thead>
                <tbody>{scenarios.map((s) => <tr key={s.done}><td>{s.done}</td><td className="r">{s.need > 4 ? "not possible in one semester" : s.need.toFixed(2)}</td></tr>)}</tbody>
              </table>
            </div>
            <p>The earlier you are in school, the faster your GPA moves. Use the calculator above with your own numbers.</p>
          </>}
          <Faq items={faq} />
        </article>
        <aside className="side">
          <h2>Nearby GPAs</h2>
          <ul>{neighbors.map((n) => <li key={n}><Link href={`/gpa/${gpaSlug(n)}/`}>Is a {n.toFixed(1)} GPA good?</Link></li>)}</ul>
          <h2>Calculators</h2>
          <ul>
            <li><Link href="/gpa-calculator/">GPA calculator</Link></li>
            <li><Link href="/cumulative-gpa-calculator/">Cumulative GPA calculator</Link></li>
            <li><Link href="/gpa-to-percentage-calculator/">GPA to percentage</Link></li>
          </ul>
        </aside>
      </div>
    </>
  );
}
