import { PeptideFAQ } from "../../seo/page-content";

export function FAQAccordion({ items, title }: { items: PeptideFAQ[]; title: string }) {
  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-base-content">{title}</h2>
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
