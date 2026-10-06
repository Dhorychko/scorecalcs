// Brand settings — change these to rebrand the whole site.
export const SITE = {
  name: "ScoreCalcs",
  domain: "scorecalcs.com",
  url: siteUrl(),
  tagline: "GPA, grade and AP score calculators",
  description:
    "Free GPA, grade and AP score calculators. Enter your grades or practice-test points to see your GPA, the final exam grade you need, or your AP, SAT or ACT score.",
  updated: "October 2026",
  examYear: 2027,
};

function siteUrl(): string {
  const explicit = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  return (explicit || "https://scorecalcs.com").replace(/\/$/, "");
}

/** Build a meta description from whole sentences, never cut mid-word. */
export function metaDesc(text: string, tail = "", max = 158): string {
  // Split only where a sentence really ends (punctuation, space, capital) — not inside "5.0" or "U.S. schools".
  const sentences = text.replace(/\s+/g, " ").trim().split(/(?<=[a-z0-9)%][.!?])\s+(?=[A-Z])/);
  let out = "";
  for (const s of sentences) {
    if ((out + s).trim().length > max) break;
    out = (out + s).trim() + " ";
  }
  out = out.trim() || text.slice(0, max);
  if (tail && (out + " " + tail).length <= max) out += " " + tail;
  return out;
}
