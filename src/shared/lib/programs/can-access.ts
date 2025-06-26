import { ProgramSession, User } from "@prisma/client";

export function canAccessProgramSession(user: User & { isPremium: boolean | null }, programSession: ProgramSession) {
  if (!programSession.isPremium) {
    return true;
  }

  if (user.isPremium) {
    return true;
  }

  return false;
}
