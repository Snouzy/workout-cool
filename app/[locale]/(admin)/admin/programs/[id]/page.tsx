import { notFound } from "next/navigation";

import { ProgramBuilder } from "@/features/admin/programs/ui/program-builder";
import { getProgramById } from "@/features/admin/programs/actions/get-programs.action";

interface ProgramDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { id } = await params;

  const program = await getProgramById(id);

  if (!program) {
    notFound();
  }

  return <ProgramBuilder program={program} />;
}
