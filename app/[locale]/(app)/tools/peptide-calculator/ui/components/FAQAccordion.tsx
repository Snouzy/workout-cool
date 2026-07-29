import { PeptideFAQ } from "../../seo/page-content";

export function FAQAccordion({ items, lead, title }: { items: PeptideFAQ[]; lead?: string; title: string }) {
  return (
    <section className="mt-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-base-content">{title}</h2>
        {lead ? <p className="mt-3 font-medium text-base-content/70">{lead}</p> : null}
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <details className="rounded-2xl border border-base-content/10 bg-base-100 p-5" key={item.question}>
            <summary className="cursor-pointer text-base font-semibold text-base-content">{item.question}</summary>
            <p className="mt-3 text-base-content/70">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
