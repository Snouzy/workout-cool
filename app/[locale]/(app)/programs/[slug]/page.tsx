import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";

import { auth } from "@/features/auth/lib/better-auth";

import { ProgramDetailClient } from "./ProgramDetailClient";
import { getProgramData } from "./getProgramData";

interface ProgramDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: ProgramDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramData(slug);

  if (!program) {
    return { title: "Programme non trouvé" };
  }

  return {
    title: `${program.title} - Programme`,
    description: program.description,
    openGraph: {
      title: `${program.title} - Programme`,
      description: program.description,
      images: [
        {
          url: program.image, // TODO: specific opengraaph image for each program
          width: 400,
          height: 600,
          alt: program.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${program.title} - Programme`,
      description: program.description,
      images: [program.image],
    },
  };
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { slug } = await params;
  const program = await getProgramData(slug);

  if (!program) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <ProgramDetailClient isAuthenticated={!!session} program={program} />;
}
