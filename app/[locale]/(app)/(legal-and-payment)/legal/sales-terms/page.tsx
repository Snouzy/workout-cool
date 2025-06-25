import { getLocalizedMdx } from "@/shared/lib/mdx/load-mdx";
import { Layout, LayoutContent } from "@/features/page/layout";
import { Typography } from "@/components/ui/typography";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SalesTermsPage({ params }: PageProps) {
  const { locale } = await params;
  const content = await getLocalizedMdx("sales-terms", locale);

  return (
    <div className="bg-muted/50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <header className="mb-10 text-center">
          <Typography className="mb-2 text-3xl md:text-4xl" variant="h1">
            {locale === "fr" ? "Conditions Générales de Vente" : "General Terms of Sale"}
          </Typography>
          <p className="text-muted-foreground text-base md:text-lg">
            {locale === "fr"
              ? "Les conditions qui régissent l’achat d’un abonnement Workout Cool."
              : "The terms governing the purchase of a Workout Cool subscription."}
          </p>
        </header>

        <Layout>
          <LayoutContent className="prose prose-neutral max-w-none dark:prose-invert">{content}</LayoutContent>
        </Layout>
      </div>
    </div>
  );
}
