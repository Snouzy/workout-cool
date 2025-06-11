"use client";

import Image from "next/image";
import { LogIn, UserPlus, LogOut, User } from "lucide-react";

import { useI18n } from "locales/client";
import Logo from "@public/logo.png";
import { ReleaseNotesDialog } from "@/features/release-notes";
import { useLogout } from "@/features/auth/model/useLogout";
import { useSession } from "@/features/auth/lib/auth-client";
import { Link } from "@/components/ui/link";

export const Header = () => {
  const session = useSession();
  const logout = useLogout();
  const t = useI18n();

  // Get user initials for avatar
  const userAvatar = session.data?.user?.email?.substring(0, 2).toUpperCase() || "";

  const handleSignOut = () => {
    logout.mutate();
  };

  return (
    <div className="navbar bg-base-100 px-4">
      {/* Logo and Title */}
      <div className="navbar-start">
        <Link className="group flex items-center space-x-3 rounded-xl bg-gradient-to-r px-4 py-2 transition-all duration-200 " href="/">
          <div className="relative">
            <Image
              alt="workout cool logo"
              className="h-8 w-8 transition-transform duration-200 group-hover:rotate-[20deg] group-hover:scale-110"
              height={32}
              src={Logo}
              width={32}
            />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold transition-colors duration-200 group-hover:text-blue-400">Workout.cool</span>
          </div>
        </Link>
      </div>

      {/* User Menu */}
      <div className="navbar-end">
        <ReleaseNotesDialog />
        <div className="dropdown dropdown-end">
          <div className="btn btn-ghost btn-circle avatar" role="button" tabIndex={0}>
            <div className="w-8 rounded-full bg-primary text-primary-content !flex items-center justify-center text-sm font-medium">
              {userAvatar || <User className="w-4 h-4" />}
            </div>
          </div>

          <ul className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52" tabIndex={0}>
            <li>
              <Link href="/profile" size="base" variant="nav">
                {t("commons.profile")}
              </Link>
            </li>

            <hr className="my-1" />

            {!session.data ? (
              <>
                <li>
                  <Link href="/auth/signin" size="base" variant="nav">
                    <LogIn className="w-4 h-4" />
                    {t("commons.login")}
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" size="base" variant="nav">
                    <UserPlus className="w-4 h-4" />
                    {t("commons.register")}
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button className="flex items-center gap-2 text-base" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                  {t("commons.logout")}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
