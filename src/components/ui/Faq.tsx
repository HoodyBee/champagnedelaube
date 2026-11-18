/** Questions fréquentes en accordéon (sans JavaScript) + données structurées FAQPage pour Google. */
export function Faq({ items }: { items: { question: string; reponse: string }[] }) {
  if (!items.length) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.reponse },
    })),
  };
  return (
    <div className="mx-auto max-w-3xl divide-y divide-filet border-y border-filet">
      {items.map((q) => (
        <details key={q.question} className="group py-space-2">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-space-2 text-[1.125rem] font-bold [&::-webkit-details-marker]:hidden">
            {q.question}
            <span aria-hidden="true" className="text-bronze transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-space-1 whitespace-pre-line pb-space-1 text-gris-chaud">{q.reponse}</p>
        </details>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
