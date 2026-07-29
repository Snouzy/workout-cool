import Link from "next/link";

export interface RelatedTool {
  href: string;
  label: string;
}

export function RelatedTools({ heading, tools }: { heading: string; tools: RelatedTool[] }) {
  return (
    <nav aria-label={heading} className="mt-12 rounded-2xl border border-base-content/10 bg-base-100 p-6">
      <h2 className="mb-4 text-lg font-bold text-base-content">{heading}</h2>
      <ul className="flex flex-wrap gap-3">
        {tools.map((tool) => (
          <li key={tool.href}>
            <Link className="link link-primary text-sm font-medium" href={tool.href}>
              {tool.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
