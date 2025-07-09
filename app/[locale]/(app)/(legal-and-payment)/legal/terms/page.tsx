import { getLocalizedMdx } from "@/shared/lib/mdx/load-mdx";
import { Layout, LayoutContent } from "@/features/page/layout";
import { Typography } from "@/components/ui/typography";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  const content = await getLocalizedMdx("terms", locale);

  return (
    <div className="bg-muted/50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <header className="mb-10 text-center">
          <Typography className="mb-2 text-3xl md:text-4xl" variant="h1">
            {locale === "fr" ? "Conditions Générales d’Utilisation" : "Terms of Use"}
          </Typography>
          <p className="text-muted-foreground text-base md:text-lg">
            {locale === "fr"
              ? "Merci de lire attentivement ces conditions avant d’utiliser nos services."
              : "Please read these terms carefully before using our services."}
          </p>
        </header>

        <Layout>
          <LayoutContent className="prose prose-neutral max-w-none dark:prose-invert">{content}</LayoutContent>
        </Layout>
      </div>
    </div>
  );
}
