import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";
import JsonLd from "@/components/JsonLd";
import { AP_EXAMS } from "@/lib/ap";
import { CALCS, CATEGORIES, GPA_VALUES, gpaSlug } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: `${SITE.url}/`, description: SITE.description },
        { "@context": "https://schema.org", "@type": "Organization", name: SITE.name, url: `${SITE.url}/`, logo: `${SITE.url}/icon.svg` },
      ]} />
      <div className="hero">
        <div className="wrap">
          <h1 style={{ marginTop: 24 }}>Your GPA, grades and test scores, worked out.</h1>
          <p className="lede">Free calculators for students: GPA, the grade you need on a final, and predicted AP, SAT and ACT scores. Start with your GPA:</p>
          <Calculator slug="gpa-calculator" />
        </div>
      </div>
      <div className="wrap" style={{ paddingBlock: "24px 8px" }}>
        <div className="index">
          {CATEGORIES.filter((c) => c.slug !== "ap").map((cat) => (
            <section key={cat.slug}>
              <h2><Link href={`/category/${cat.slug}/`} style={{ color: "inherit", textDecoration: "none" }}>{cat.name}</Link></h2>
              <p className="blurb">{cat.blurb}</p>
              <ul>{CALCS.filter((c) => c.category === cat.slug).map((c) => <li key={c.slug}><Link href={`/${c.slug}/`}><span>{c.title}</span><span>{c.short}</span></Link></li>)}</ul>
            </section>
          ))}
        </div>
        <section style={{ paddingBlock: 16 }}>
          <h2><Link href="/ap-score-calculator/" style={{ color: "inherit", textDecoration: "none" }}>AP score calculators</Link></h2>
          <p className="blurb muted">{CATEGORIES.find((c) => c.slug === "ap")!.blurb}</p>
          <ul className="ap-grid">{AP_EXAMS.map((e) => <li key={e.slug}><Link href={`/ap/${e.slug}/`}>{e.short}<span>{e.dist2026.five}% got a 5</span></Link></li>)}</ul>
        </section>
        <section style={{ paddingBlock: 16 }}>
          <h2>What does my GPA mean?</h2>
          <p className="muted">
            {GPA_VALUES.slice().reverse().map((g, i) => <span key={g}>{i > 0 && ", "}<Link href={`/gpa/${gpaSlug(g)}/`}>{g.toFixed(1)}</Link></span>)}
          </p>
        </section>
      </div>
    </>
  );
}
