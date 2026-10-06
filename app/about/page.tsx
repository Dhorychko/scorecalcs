import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${SITE.name} makes free GPA, grade and test-score calculators for students. Who we are, how the calculators are checked and how to report an error.`,
  alternates: { canonical: "/about/" },
};

export default function About() {
  return (
    <div className="wrap" style={{ paddingBlock: "24px 48px" }}>
      <article className="prose">
        <h1>About {SITE.name}</h1>
        <p className="lede">Free calculators for the numbers students worry about: GPA, the grade you need on a final, and what your practice test means for the real AP, SAT or ACT.</p>
        <p>Everything runs in your browser. We don&apos;t ask for an account, and the grades you type aren&apos;t sent anywhere.</p>
        <p>Formulas and sources are listed on <Link href="/methodology/">How we calculate</Link>. Exam formats were last checked in {SITE.updated}; we update them when College Board or ACT publishes changes.</p>
        <p>{SITE.name} is independent. AP®, SAT® and PSAT/NMSQT® are trademarks of the College Board; ACT® is a trademark of ACT, Inc. Neither is affiliated with or endorses this site.</p>
      </article>
    </div>
  );
}
