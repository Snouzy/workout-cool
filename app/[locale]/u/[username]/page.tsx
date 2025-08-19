import { notFound } from "next/navigation";

import { UserProfilePage } from "@/features/profile/ui/user-profile-page";
import { getUserProfileAction } from "@/features/profile/actions/get-user-profile.action";

// Type guard to check if profile is valid
function isValidProfile(profile: any): profile is NonNullable<Awaited<ReturnType<typeof getUserProfileAction>>> & { error?: never } {
  return profile && !profile.error;
}

interface PageProps {
  params: {
    username: string;
    locale: string;
  };
}

export default async function UserProfile({ params }: PageProps) {
  const { username } = params;

  const profile = await getUserProfileAction(username);

  if (!isValidProfile(profile)) {
    notFound();
  }

  return <UserProfilePage profile={profile} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = params;

  const profile = await getUserProfileAction(username);

  if (!profile || profile.error) {
    return {
      title: "User not found - Workout.cool",
    };
  }

  return {
    title: `${profile.name || profile.username} - Workout.cool`,
    description: `Check out ${profile.name || profile.username}'s workout profile on Workout.cool`,
  };
}
