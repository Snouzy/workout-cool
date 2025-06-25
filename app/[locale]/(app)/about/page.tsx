import { getLocalizedMdx } from "@/shared/lib/mdx/load-mdx";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const content = await getLocalizedMdx("about", locale);

  return (
    <div className="bg-muted/50 py-12 min-h-screen">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="prose prose-neutral max-w-none dark:prose-invert">{content}</div>
      </div>
    </div>
  );
}
