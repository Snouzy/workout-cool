import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";

import { auth } from "@/features/auth/lib/better-auth";

import { ProgramSessionClient } from "./ProgramSessionClient";
import { getProgramSessionData } from "./getProgramSessionData";

interface ProgramSessionPageProps {
  params: Promise<{
    slug: string;
    sessionId: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ProgramSessionPageProps): Promise<Metadata> {
  const { slug, sessionId } = await params;
  const data = await getProgramSessionData(slug, sessionId);

  if (!data) {
    return { title: "Séance non trouvée" };
  }

  return {
    title: `${data.session.title} - ${data.program.title}`,
    description: data.session.description || `Séance ${data.session.sessionNumber} du programme ${data.program.title}`,
  };
}

export default async function ProgramSessionPage({ params }: ProgramSessionPageProps) {
  const { slug, sessionId } = await params;

  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    // Redirect to login
    return notFound();
  }

  const data = await getProgramSessionData(slug, sessionId);

  if (!data) {
    notFound();
  }

  return <ProgramSessionClient {...data} userId={session.user?.id ?? ""} />;
}
