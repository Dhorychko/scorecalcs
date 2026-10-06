import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Schema } from "@/components/Faq";
import { AP_EXAMS } from "@/lib/ap";
import { CALCS, CATEGORIES, CAT_BY_SLUG, GPA_VALUES, gpaSlug } from "@/lib/catalog";
import { metaDesc } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ cat: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ cat: string }> }): Promise<Metadata> {
  const { cat } = await params;
  const c = CAT_BY_SLUG[cat];
  if (!c) return {};
  return { title: c.name.replace(/^./, (x) => x.toUpperCase()), description: metaDesc(`Free ${c.name.toLowerCase()} for students. ${c.blurb}`, "No sign-up, works on your phone."), alternates: { canonical: cat === "ap" ? "/ap-score-calculator/" : `/category/${cat}/` } };
}

export default async function CategoryPage({ params }: { params: Promise<{ cat: string }> }) {
  const { cat } = await params;
  const c = CAT_BY_SLUG[cat];
  if (!c) notFound();
  const calcs = CALCS.filter((x) => x.category === cat);
  return (
    <>
      <Schema crumbs={[["Home", "/"], [c.name, `/category/${cat}/`]]} />
      <div className="hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link></nav>
          <h1>{c.name.replace(/^./, (x) => x.toUpperCase())}</h1>
          <p className="lede">{c.blurb}</p>
          <div className="index">
            <section>
              <ul>
                {cat === "ap" && <li><Link href="/ap-score-calculator/"><span>All AP score calculators</span><span>{AP_EXAMS.length} exams</span></Link></li>}
                {calcs.map((x) => <li key={x.slug}><Link href={`/${x.slug}/`}><span>{x.title}</span><span>{x.short}</span></Link></li>)}
                {cat === "ap" && AP_EXAMS.map((e) => <li key={e.slug}><Link href={`/ap/${e.slug}/`}><span>{e.short} score calculator</span><span>{e.dist2026.five}% got a 5</span></Link></li>)}
              </ul>
            </section>
            {cat === "conversions" && (
              <section>
                <h2>What a GPA means</h2>
                <ul>{GPA_VALUES.slice().reverse().map((g) => <li key={g}><Link href={`/gpa/${gpaSlug(g)}/`}><span>Is a {g.toFixed(1)} GPA good?</span><span>letter, percent</span></Link></li>)}</ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
