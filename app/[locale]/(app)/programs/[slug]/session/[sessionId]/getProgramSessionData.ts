import { prisma } from "@/shared/lib/prisma";

export async function getProgramSessionData(programSlug: string, sessionId: string) {
  // Get program with session
  const program = await prisma.program.findUnique({
    where: { slug: programSlug },
    include: {
      weeks: {
        include: {
          sessions: {
            where: { id: sessionId },
            include: {
              exercises: {
                include: {
                  exercise: {
                    include: {
                      attributes: {
                        include: {
                          attributeName: true,
                          attributeValue: true,
                        },
                      },
                    },
                  },
                  suggestedSets: {
                    orderBy: { setIndex: "asc" },
                  },
                },
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!program) {
    return null;
  }

  // Find the session
  let foundSession = null;
  let foundWeek = null;

  for (const week of program.weeks) {
    const targetSession = week.sessions.find(s => s.id === sessionId);
    if (targetSession) {
      foundSession = targetSession;
      foundWeek = week;
      break;
    }
  }

  if (!foundSession) {
    return null;
  }

  if (!foundWeek) {
    return null;
  }

  return {
    program: {
      id: program.id,
      title: program.title,
      slug: program.slug,
    },
    week: {
      id: foundWeek.id,
      weekNumber: foundWeek.weekNumber,
      title: foundWeek.title,
    },
    session: {
      id: foundSession.id,
      sessionNumber: foundSession.sessionNumber,
      title: foundSession.title,
      description: foundSession.description,
      exercises: foundSession.exercises,
    },
  };
}
