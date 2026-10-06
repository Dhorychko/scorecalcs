import JsonLd from "./JsonLd";
import { SITE } from "@/lib/site";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <>
      <h2>Questions</h2>
      {items.map((f) => (
        <details className="faq" key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </>
  );
}

export function Schema({ crumbs, faq }: { crumbs: [string, string][]; faq?: { q: string; a: string }[] }) {
  const data: unknown[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE.url}${path}` })),
    },
  ];
  if (faq?.length)
    data.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  return <JsonLd data={data} />;
}
