"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Menu, X, UserCog } from "lucide-react";

import Logo from "@public/logo.png";
import { PLACEHOLDERS } from "@/shared/constants/placeholders";
import { paths } from "@/shared/constants/paths";
import { useLogout } from "@/features/auth/model/useLogout";
import { displayFirstNameAndFirstLetterLastName } from "@/entities/user/lib/display-name";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import type { SessionUser } from "@/entities/user/types/session-user";

interface AdminHeaderProps {
  user: SessionUser;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const logout = useLogout(paths.root);

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        {/* Logo and title */}
        <div className="flex items-center space-x-4">
          <Button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} size="small" variant="ghost">
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <Link className="flex items-center space-x-3" href="/admin">
            <Image alt="WorkoutCool Logo" className="h-8 w-8" height={32} src={Logo} width={32} />
            <span className="hidden text-xl font-semibold text-gray-900 sm:block dark:text-white">Administration</span>
          </Link>
        </div>

        {/* User menu */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center space-x-2" size="small" variant="ghost">
                <div className="h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    alt="Profile"
                    className="h-full w-full object-cover"
                    height={32}
                    src={user.image || PLACEHOLDERS.PROFILE_IMAGE}
                    width={32}
                  />
                </div>
                <span className="hidden text-sm font-medium text-gray-700 sm:block dark:text-gray-300">
                  {displayFirstNameAndFirstLetterLastName(user)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link className="flex items-center space-x-2" href={`/${paths.profile}`}>
                  <UserCog className="h-4 w-4" />
                  <span>Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout.mutate()}>
                <div className="flex items-center space-x-2">
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
