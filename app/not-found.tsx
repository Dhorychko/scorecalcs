import Link from "next/link";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="wrap" style={{ paddingBlock: "40px 56px" }}>
      <h1>That page isn&apos;t here</h1>
      <p className="lede">The link may be old or mistyped. These are the calculators people use most:</p>
      <div className="index">
        <section>
          <ul>
            <li><Link href="/gpa-calculator/"><span>GPA Calculator</span><span>weighted and unweighted</span></Link></li>
            <li><Link href="/final-grade-calculator/"><span>Final Grade Calculator</span><span>what you need on the final</span></Link></li>
            <li><Link href="/grade-calculator/"><span>Grade Calculator</span><span>weighted categories</span></Link></li>
            <li><Link href="/ap-score-calculator/"><span>AP Score Calculators</span><span>33 exams</span></Link></li>
            <li><Link href="/sat-score-calculator/"><span>SAT Score Calculator</span><span>digital SAT estimate</span></Link></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
