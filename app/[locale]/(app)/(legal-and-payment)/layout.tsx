import { LayoutParams } from "@/shared/types/next";

type LocaleParams = Record<string, string> & {
  locale: string;
};

export default function RouteLayout({ children, params: _ }: LayoutParams<LocaleParams>) {
  return (
    <div className="bg-muted/30 text-foreground flex min-h-screen flex-col">
      {/* Fixe l'espace sous le header flottant */}
      <div className="h-16" />

      {/* Contenu principal centré avec marge */}
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto w-full max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
