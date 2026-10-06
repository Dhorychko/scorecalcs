import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@/lib/site";
import { CATEGORIES } from "@/lib/catalog";
import { body, display } from "./fonts";
import Analytics from "@/components/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: GPA, Grade & AP Score Calculators`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  openGraph: { siteName: SITE.name, type: "website", locale: "en_US", images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }] },
  twitter: { card: "summary_large_image" },
  // Set NEXT_PUBLIC_GSC_VERIFICATION in Vercel to the code from Google Search Console (HTML tag method).
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>
        <header className="site-head">
          <div className="wrap">
            <Link href="/" className="logo">
              Sc<span className="dot" aria-hidden="true" /><span className="sr-only">o</span>reCalcs
            </Link>
            <nav className="site-nav" aria-label="Main">
              <Link href="/gpa-calculator/">GPA</Link>
              <Link href="/grade-calculator/">Grades</Link>
              <Link href="/final-grade-calculator/">Final grade</Link>
              <Link href="/ap-score-calculator/">AP scores</Link>
              <Link href="/sat-score-calculator/">SAT</Link>
              <Link href="/act-score-calculator/">ACT</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-foot">
          <div className="wrap">
            <div>
              <h2>{SITE.name}</h2>
              <p className="small">Free calculators for students. Results are estimates: your school, college or the exam board has the final word.</p>
            </div>
            <div>
              <h2>Calculators</h2>
              <ul>
                {CATEGORIES.map((c) => (
                  <li key={c.slug}><Link href={c.slug === "ap" ? "/ap-score-calculator/" : `/category/${c.slug}/`}>{c.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Popular</h2>
              <ul>
                <li><Link href="/ap/us-history/">APUSH score calculator</Link></li>
                <li><Link href="/ap/english-language/">AP Lang score calculator</Link></li>
                <li><Link href="/cumulative-gpa-calculator/">Cumulative GPA</Link></li>
                <li><Link href="/gpa/3-5/">What is a 3.5 GPA?</Link></li>
              </ul>
            </div>
            <div>
              <h2>About</h2>
              <ul>
                <li><Link href="/methodology/">How we calculate</Link></li>
                <li><Link href="/about/">About {SITE.name}</Link></li>
              </ul>
              <p className="small muted">Updated {SITE.updated}. AP® is a trademark of the College Board, which is not affiliated with this site. ACT® is a trademark of ACT, Inc.</p>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
