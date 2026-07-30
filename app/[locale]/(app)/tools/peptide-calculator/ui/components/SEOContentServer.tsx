import { PeptidePageContent, PeptideTable } from "../../seo/page-content";
import { FAQAccordion } from "./FAQAccordion";

function ContentTable({ table }: { table: PeptideTable }) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="table w-full">
        <caption className="mb-2 text-left text-sm font-semibold text-base-content/70">{table.caption}</caption>
        <thead>
          <tr>
            {table.headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell) => (
                <td key={cell}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ section }: { section: PeptidePageContent["sections"][number] }) {
  return (
    <section>
      <h2>{section.heading}</h2>
      <p className="font-medium">{section.lead}</p>
      {section.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </section>
  );
}

export function SEOContentServer({ content }: { content: PeptidePageContent }) {
  return (
    <article className="prose prose-lg mt-16 max-w-none dark:prose-invert">
      {content.sections.map((section) => {
        if (section.id === "faq") {
          return <FAQAccordion items={content.faq} key={section.id} lead={section.lead} title={section.heading} />;
        }

        return (
          // `id` is what the widget's "how it works" link scrolls to; `scroll-mt` keeps the
          // heading clear of the sticky header once it lands.
          <div className="scroll-mt-20" id={section.id} key={section.id}>
            <Section section={section} />
            {section.id === "chart" && <ContentTable table={content.reconstitutionTable} />}
            {section.id === "conversion" && <ContentTable table={content.conversionTable} />}
          </div>
        );
      })}

      <p className="mt-10 rounded-2xl bg-base-200 p-5 text-sm text-base-content/70">{content.disclaimer}</p>
    </article>
  );
}
