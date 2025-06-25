import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";

import { getI18n } from "locales/server";
import { ProgramDetailPage } from "@/features/programs/ui/program-detail-page";
import { getProgramBySlug } from "@/features/programs/actions/get-program-by-slug.action";
import { auth } from "@/features/auth/lib/better-auth";

interface ProgramDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: ProgramDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = await getI18n();
  const program = await getProgramBySlug(slug);

  if (!program) {
    return { title: t("programs.not_found") };
  }

  return {
    title: `${program.title} - ${t("programs.program")}`,
    description: program.description,
    openGraph: {
      title: `${program.title} - ${t("programs.program")}`,
      description: program.description,
      images: [
        {
          url: program.image, // TODO: specific opengraph image for each program (upload admin side)
          width: 400,
          height: 600,
          alt: program.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${program.title} - ${t("programs.program")}`,
      description: program.description,
      images: [program.image],
    },
  };
}

export default async function ProgramDetailPageRoute({ params }: ProgramDetailPageProps) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <ProgramDetailPage isAuthenticated={!!session} program={program} />;
}
