export type FrqItem = { label: string; max: number; weight: number }; // weight = share of the whole exam (0–1)
export type ApExam = {
  slug: string;
  name: string; // "AP Biology"
  short: string; // "AP Bio" — the way students search
  group: "STEM" | "English" | "History & Social Science" | "Arts" | "World Languages";
  mc: { count: number; weight: number; minutes: number; note?: string };
  frq: FrqItem[];
  frqMinutes: number;
  dist2026: { pass: number; five: number }; // % scoring 3+, % scoring 5
  cut: Cuts;
  formatYear: 2026 | 2027;
  note?: string; // shown on the page (format changes, unverified items)
  tips?: string[]; // overrides the group tips
  keyword: string; // main search phrase
};

export type Cuts = { five: number; four: number; three: number; two: number }; // share of composite (0–1)

