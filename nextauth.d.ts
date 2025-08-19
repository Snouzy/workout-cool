import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      email: string;
      username?: string;
      isProfilePublic?: boolean;
      name?: string;
      image?: string;
    };
  }
}
