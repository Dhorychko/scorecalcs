import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { CALCS, CATEGORIES, GPA_VALUES, gpaSlug } from "@/lib/catalog";
import { AP_EXAMS } from "@/lib/ap";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${SITE.url}${p}`;
  const now = new Date("2026-10-04");
  return [
    { url: u("/"), lastModified: now },
    ...CALCS.map((c) => ({ url: u(`/${c.slug}/`), lastModified: now })),
    { url: u("/ap-score-calculator/"), lastModified: now },
    ...AP_EXAMS.map((e) => ({ url: u(`/ap/${e.slug}/`), lastModified: now })),
    ...GPA_VALUES.map((g) => ({ url: u(`/gpa/${gpaSlug(g)}/`), lastModified: now })),
    ...CATEGORIES.filter((c) => c.slug !== "ap").map((c) => ({ url: u(`/category/${c.slug}/`), lastModified: now })),
    { url: u("/methodology/"), lastModified: now },
    { url: u("/about/"), lastModified: now },
  ];
}
