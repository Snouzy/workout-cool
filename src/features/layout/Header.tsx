"use client";

import Image from "next/image";
import { Home, LogIn, UserPlus, LogOut, User } from "lucide-react";

import { useI18n } from "locales/client";
import Logo from "@public/logo.png";
import { LanguageSelector } from "@/widgets/language-selector/language-selector";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
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
    <div className="navbar bg-base-100 dark:bg-black dark:text-gray-200 px-4 rounded-tl-lg rounded-tr-lg">
      {/* Logo and Title */}
      <div className="navbar-start flex items-center gap-2">
        <Link
          className="group flex items-center space-x-3 rounded-xl bg-gradient-to-r px-2 sm:px-4 py-2 transition-all duration-200 dark:text-gray-200 dark:bg-gray-800"
          href="/"
        >
          <div className="relative flex-none">
            <Image
              alt="workout cool logo"
              className="h-10 w-10 sm:h-8 sm:w-8 transition-transform duration-200 group-hover:rotate-[20deg] group-hover:scale-110"
              height={32}
              src={Logo}
              width={32}
            />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
          </div>
          <div className="flex-col hidden sm:flex">
            <span className="font-bold transition-colors duration-200 group-hover:text-blue-400">Workout.cool</span>
          </div>
        </Link>
      </div>

      {/* User Menu */}
      <div className="navbar-end">
        <div className="tooltip tooltip-bottom" data-tip={t("commons.home")}>
          <Link
            aria-label={t("commons.home")}
            className="hover:bg-slate-200 dark:hover:bg-gray-800 rounded-full p-2 transition flex"
            href="/"
          >
            <Home className="w-6 h-6 text-blue-500 dark:text-blue-400" />
          </Link>
        </div>

        <ReleaseNotesDialog />

        <ThemeToggle />
        <LanguageSelector />

        <div className="dropdown dropdown-end ml-1">
          <div className="btn btn-ghost btn-circle avatar" role="button" tabIndex={0}>
            <div className="w-8 rounded-full bg-primary text-primary-content !flex items-center justify-center text-sm font-medium">
              {userAvatar || <User className="w-4 h-4" />}
            </div>
          </div>

          <ul
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 dark:bg-black dark:text-gray-200 rounded-box w-52 border border-slate-200 dark:border-gray-800"
            tabIndex={0}
          >
            <li>
              <Link className="!no-underline" href="/profile" size="base" variant="nav">
                {t("commons.profile")}
              </Link>
            </li>

            <hr className="my-1 border-slate-200 dark:border-gray-800" />

            {!session.data && !session.isPending ? (
              <>
                <li>
                  <Link className="!no-underline" href="/auth/signin" size="base" variant="nav">
                    <LogIn className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    {t("commons.login")}
                  </Link>
                </li>
                <li>
                  <Link className="!no-underline" href="/auth/signup" size="base" variant="nav">
                    <UserPlus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    {t("commons.register")}
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  className="flex items-center gap-2 text-base text-gray-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors"
                  onClick={handleSignOut}
                >
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
