"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  ChevronRight,
  ClipboardType,
  Component,
  FileType,
  Fingerprint,
  Gauge,
  Gem,
  LogOut,
  Menu,
  MessageSquareText,
  PanelLeftDashed,
  Phone,
  PieChart,
  RectangleEllipsis,
  ScrollText,
  Settings,
  Sheet,
  SquareKanban,
  TableProperties,
  UserCog,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { useI18n } from "locales/client";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/workoutcool/components/ui/hover-card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/workoutcool/components/ui/dropdown-menu";
import { Button } from "@/workoutcool/components/ui/button";
import { LanguageSelector } from "@/widgets/language-selector/language-selector";
import { PLACEHOLDERS } from "@/shared/constants/placeholders";
import { paths } from "@/shared/constants/paths";
import { useSidebarToggle } from "@/features/layout/useSidebarToggle";
import NavLink from "@/features/layout/nav-link";
import { ContactFeedbackPopover } from "@/features/contact-feedback/ui/contact-feedback-popover";
import { useLogout } from "@/features/auth/model/useLogout";
import { authClient, useSession } from "@/features/auth/lib/auth-client";
import { useCurrentUser } from "@/entities/user/model/useCurrentUser";
import { displayFirstNameAndFirstLetterLastName } from "@/entities/user/lib/display-name";
import { brandedToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoSvg } from "@/components/svg/LogoSvg";

interface UploadProfileImageParams {
  file: File;
}

interface UploadProfileImageResult {
  url: string;
}

export function useProfileImageUpload() {
  const t = useI18n();

  return useMutation<UploadProfileImageResult, Error, UploadProfileImageParams>({
    mutationFn: async ({ file }) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();

        if (res.status === 415) {
          brandedToast({ title: t("backend_errors.INVALID_FILE_TYPE"), variant: "error" });
        }

        if (res.status === 413) {
          brandedToast({ title: t("backend_errors.FILE_TOO_LARGE"), variant: "error" });
        }

        if (res.status === 400) {
          brandedToast({ title: t("backend_errors.NO_FILE_UPLOADED"), variant: "error" });
        }

        if (res.status === 500) {
          brandedToast({ title: t("backend_errors.IMAGE_PROCESSING_ERROR"), variant: "error" });
        }

        throw new Error(data.error || t("error.upload_failed"));
      }

      return res.json();
    },
  });
}

export const AuthenticatedHeader = () => {
  const t = useI18n();
  const pathName = usePathname();
  const user = useCurrentUser();
  const { data: sessionData, isPending: isSessionLoading } = useSession();
  const { toggleSidebar } = useSidebarToggle();
  const logout = useLogout();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStopImpersonating = async () => {
    try {
      await authClient.admin.stopImpersonating();
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de l'arrêt de l'impersonnalisation:", error);
      brandedToast({
        title: t("error.generic_error"),
        variant: "error",
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const isImpersonating = mounted && !isSessionLoading && !!sessionData?.session.impersonatedBy;

  return (
    <header className="fixed top-0 z-30 w-full bg-white shadow-sm dark:bg-black-dark">
      <div className="flex items-center justify-between gap-5 px-4 py-[15px] lg:px-5">
        <Link className="inline-block shrink-0 lg:ltr:ml-2.5 lg:rtl:mr-2.5" href="/">
          <LogoSvg className="w-24" />
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="order-2 inline-flex lg:order-none">
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ContactFeedbackPopover>
                <Button size="small" variant="outline">
                  Feedback
                </Button>
              </ContactFeedbackPopover>
            </div>
          </div>
          <div className="hidden lg:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="group flex cursor-pointer items-center gap-2.5 rounded-lg [&[data-state=open]>button>svg]:rotate-180">
                  <div className="size-8 shrink-0 overflow-hidden rounded-full">
                    <Image
                      alt="Profile Img"
                      className="h-full w-full object-cover"
                      height={32}
                      src={user?.image || PLACEHOLDERS.PROFILE_IMAGE}
                      width={32}
                    />
                  </div>
                  <div className="hidden min-w-[80px] space-y-1 lg:block">
                    {!mounted ? (
                      <>
                        <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                      </>
                    ) : user ? (
                      <>
                        <h5 className="line-clamp-1 text-[10px]/3 font-semibold dark:text-gray-500">
                          {isImpersonating ? t("commons.impersonating_user_label") : t("commons.re_hello")}
                        </h5>
                        <h2 className="line-clamp-1 text-xs font-bold text-black dark:text-white">
                          {displayFirstNameAndFirstLetterLastName(user)}
                        </h2>
                      </>
                    ) : (
                      <>
                        <Skeleton height="0.75rem" width="4rem" />
                        <Skeleton height="1rem" width="5rem" />
                      </>
                    )}
                  </div>
                  <button
                    className="mt-auto text-black transition group-hover:opacity-70 ltr:-ml-1 rtl:-mr-1 dark:text-white"
                    type="button"
                  >
                    <ChevronDown className="h-4 w-4 shrink-0 duration-300" />
                  </button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[200px] space-y-1 rounded-lg p-1.5 text-sm font-medium" sideOffset={12}>
                {isImpersonating && (
                  <DropdownMenuItem className="p-0 focus:bg-yellow-100 dark:focus:bg-yellow-700/50">
                    <Button
                      className="flex w-full cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-yellow-700 hover:bg-yellow-100/50 dark:text-yellow-400 dark:hover:bg-yellow-600/30"
                      onClick={handleStopImpersonating}
                      size="small"
                      variant="ghost"
                    >
                      <LogOut className="size-[18px] shrink-0" />
                      {t("commons.stop_impersonation_button")}
                    </Button>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="p-0">
                  <Link
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 ${pathName === `/${paths.profile}` && "!bg-gray-400 !text-black dark:!bg-white/5 dark:!text-white"}`}
                    href={`/${paths.profile}`}
                  >
                    <UserCog className="size-[18px] shrink-0" />
                    {t("commons.profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <Button
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 ${pathName === "/login" && "!bg-gray-400 !text-black dark:!bg-white/5 dark:!text-white"}`}
                    onClick={() => logout.mutateAsync()}
                    variant={null}
                  >
                    <LogOut className="size-[18px] shrink-0" />
                    {t("commons.logout")}
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <button className="order-3 duration-300 hover:opacity-80 lg:hidden dark:text-white" onClick={toggleSidebar} type="button">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Horizontal sidebar */}
      <div className="sidebar hidden items-center gap-4 overflow-y-auto border-t border-gray-300 px-6 py-2.5 dark:border-gray-700/70">
        <HoverCard openDelay={0}>
          <HoverCardTrigger asChild>
            <button
              className="nav-link rounded-lg !px-2.5 hover:bg-gray-400 data-[state=open]:bg-gray-400 data-[state=open]:text-black dark:hover:bg-white/10 dark:data-[state=open]:bg-white/10 dark:data-[state=open]:text-white"
              type="button"
            >
              <Gauge className="size-[18px] shrink-0" />
              <span>Dashboard</span>
              <ChevronDown className="size-4 shrink-0" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="h-full max-h-96 min-w-40 overflow-y-auto p-1.5">
            <ul className="submenu space-y-1">
              <li>
                <NavLink href="/">Sales</NavLink>
              </li>
              <li>
                <NavLink href="/crypto-dashboard">Crypto</NavLink>
              </li>
              <li>
                <NavLink href="/analytics-dashboard">Analytics</NavLink>
              </li>
              <li>
                <NavLink href="/crm-dashboard">CRM</NavLink>
              </li>
              <li>
                <NavLink href="/projects-dashboard">Projects</NavLink>
              </li>
              <li>
                <NavLink href="/hospitality-dashboard">Hospitality</NavLink>
              </li>
              <li>
                <HoverCard openDelay={0}>
                  <HoverCardTrigger asChild>
                    <button
                      className="dark: flex w-full items-center rounded-lg px-2 py-1 font-medium text-gray-700 transition hover:bg-light-theme hover:text-primary dark:text-gray-600 dark:hover:bg-[#818CF8]/[6%] dark:hover:text-[#6683F8]"
                      type="button"
                    >
                      eCommerce
                      <ChevronRight className="ml-auto size-3.5 shrink-0" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent align="start" className="max-h-96 min-w-40 overflow-y-auto p-1.5" side="right">
                    <ul className="submenu space-y-1">
                      <li>
                        <NavLink href="/product-card">Product list</NavLink>
                      </li>
                      <li>
                        <NavLink href="/add-product">Add new product</NavLink>
                      </li>
                      <li>
                        <NavLink href="/product-details">Product Details</NavLink>
                      </li>
                      <li>
                        <NavLink href="/product-checkout">Product Checkout</NavLink>
                      </li>
                    </ul>
                  </HoverCardContent>
                </HoverCard>
              </li>
            </ul>
          </HoverCardContent>
        </HoverCard>
        <NavLink
          className={`nav-link rounded-lg !px-2.5 hover:bg-gray-400 dark:hover:bg-white/10 ${pathName === "/chat" && "!bg-gray-400 !text-black dark:!bg-white/10"}`}
          href="/chat"
        >
          <MessageSquareText className="size-[18px] shrink-0" />
          <span>Chat</span>
        </NavLink>

        <NavLink
          className={`nav-link rounded-lg !px-2.5 hover:bg-gray-400 dark:hover:bg-white/10 ${pathName === "/scrumboard" && "!bg-gray-400 !text-black dark:!bg-white/10"}`}
          href="/scrumboard"
        >
          <SquareKanban className="size-[18px] shrink-0" />
          <span>Scrumboard</span>
        </NavLink>

        <HoverCard openDelay={0}>
          <HoverCardTrigger asChild>
            <button
              className="nav-link rounded-lg !px-2.5 hover:bg-gray-400 data-[state=open]:bg-gray-400 data-[state=open]:text-black dark:hover:bg-white/10 dark:data-[state=open]:bg-white/10 dark:data-[state=open]:text-white"
              type="button"
            >
              <SquareKanban className="size-[18px] shrink-0 -rotate-90" />
              <span>Blog</span>
              <ChevronDown className="size-4 shrink-0" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="h-full max-h-96 min-w-40 overflow-y-auto p-1.5">
            <ul className="submenu space-y-1">
              <li>
                <NavLink href="/blog-list">Blog-list</NavLink>
              </li>
              <li>
                <NavLink href="/blog-details">Blog details</NavLink>
              </li>
              <li>
                <NavLink href="/add-blog">Add New Blog</NavLink>
              </li>
            </ul>
          </HoverCardContent>
        </HoverCard>

        <HoverCard openDelay={0}>
          <HoverCardTrigger asChild>
            <button
              className="nav-link rounded-lg !px-2.5 hover:bg-gray-400 data-[state=open]:bg-gray-400 data-[state=open]:text-black dark:hover:bg-white/10 dark:data-[state=open]:bg-white/10 dark:data-[state=open]:text-white"
              type="button"
            >
              <ScrollText className="size-[18px] shrink-0" />
              <span>Invoice</span>
              <ChevronDown className="size-4 shrink-0" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="h-full max-h-96 min-w-40 overflow-y-auto p-1.5">
            <ul className="submenu space-y-1">
              <li>
                <NavLink href="/invoice">Invoice</NavLink>
              </li>
              <li>
                <NavLink href="/invoice-details">Invoice details</NavLink>
              </li>
              <li>
                <NavLink href="/create-invoice">Create Invoice</NavLink>
              </li>
            </ul>
          </HoverCardContent>
        </HoverCard>

        <HoverCard openDelay={0}>
          <HoverCardTrigger asChild>
            <button
              className="nav-link rounded-lg !px-2.5 hover:bg-gray-400 data-[state=open]:bg-gray-400 data-[state=open]:text-black dark:hover:bg-white/10 dark:data-[state=open]:bg-white/10 dark:data-[state=open]:text-white"
              type="button"
            >
              <Component className="size-[18px] shrink-0" />
              <span>Components</span>
              <ChevronDown className="size-4 shrink-0" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="h-full max-h-96 min-w-40 overflow-y-auto">
            <ul className="submenu space-y-1">
              <li>
                <NavLink href="/accordion-page">Accordion</NavLink>
              </li>
              <li>
                <NavLink href="/alert">Alert</NavLink>
              </li>
              <li>
                <NavLink href="/alert-dialog">Alert Dialog</NavLink>
              </li>
              <li>
                <NavLink href="/avatar">Avatar</NavLink>
              </li>
              <li>
                <NavLink href="/breadcrumbs">Breadcrumb</NavLink>
              </li>
              <li>
                <NavLink href="/buttons">Button</NavLink>
              </li>
              <li>
                <NavLink href="/card-page">Cards</NavLink>
              </li>
              <li>
                <NavLink href="/carousel">Carousel</NavLink>
              </li>
              <li>
                <NavLink href="/dropdown">Dropdown Menu</NavLink>
              </li>
              <li>
                <NavLink href="/empty-stats">Empty Stats</NavLink>
              </li>
              <li>
                <NavLink href="/hover-card">Hover Card</NavLink>
              </li>
              <li>
                <NavLink href="/modal">Modals</NavLink>
              </li>
              <li>
                <NavLink href="/popover">Popover</NavLink>
              </li>
              <li>
                <NavLink href="/scroll-area">Scroll Area</NavLink>
              </li>

              <li>
                <NavLink href="/sonner">Sonner</NavLink>
              </li>
              <li>
                <NavLink href="/tabs">Tab</NavLink>
              </li>

              <li>
                <NavLink href="/tag">Tag</NavLink>
              </li>

              <li>
                <NavLink href="/toasts">Toasts</NavLink>
              </li>
              <li>
                <NavLink href="/toggle-group">Toggle Group</NavLink>
              </li>
              <li>
                <NavLink href="/tooltip">Tooltip</NavLink>
              </li>
            </ul>
          </HoverCardContent>
        </HoverCard>

        <NavLink
          className={`nav-link rounded-lg !px-2.5 hover:bg-gray-400 dark:hover:bg-white/10 ${pathName === "/chart" && "!bg-gray-400 !text-black dark:!bg-white/10"}`}
          href="/chart"
        >
          <PieChart className="size-[18px] shrink-0" />
          <span>Charts</span>
        </NavLink>

        <NavLink
          className={`nav-link rounded-lg !px-2.5 hover:bg-gray-400 dark:hover:bg-white/10 ${pathName === "/typography" && "!bg-gray-400 !text-black dark:!bg-white/10"}`}
          href="/typography"
        >
          <FileType className="size-[18px] shrink-0" />
          <span>Typography</span>
        </NavLink>
        <NavLink
          className={`nav-link rounded-lg !px-2.5 hover:bg-gray-400 dark:hover:bg-white/10 ${pathName === "/sidebar-page" && "!bg-gray-400 !text-black dark:!bg-white/10"}`}
          href="/sidebar-page"
        >
          <PanelLeftDashed className="size-[18px] shrink-0" />
          <span>Sidebar</span>
        </NavLink>
        <NavLink
          className={`nav-link rounded-lg !px-2.5 hover:bg-gray-400 dark:hover:bg-white/10 ${pathName === "/sheet-page" && "!bg-gray-400 !text-black dark:!bg-white/10"}`}
          href="/sheet-page"
        >
          <Sheet className="size-[18px] shrink-0" />
          <span>Sheet</span>
        </NavLink>
        <NavLink
          className={`nav-link rounded-lg !px-2.5 hover:bg-gray-400 dark:hover:bg-white/10 ${pathName === "/navigation-menu" && "!bg-gray-400 !text-black dark:!bg-white/10"}`}
          href="/navigation-menu"
        >
          <RectangleEllipsis className="size-[18px] shrink-0" />
          <span>Navigation Menu</span>
        </NavLink>
        <NavLink
          className={`nav-link rounded-lg !px-2.5 hover:bg-gray-400 dark:hover:bg-white/10 ${pathName === "/pricing-plan" && "!bg-gray-400 !text-black dark:!bg-white/10"}`}
          href="/pricing-plan"
        >
          <Gem className="size-[18px] shrink-0" />
          <span>Pricing</span>
        </NavLink>

        <NavLink
          className={`nav-link rounded-lg !px-2.5 hover:bg-gray-400 dark:hover:bg-white/10 ${pathName === "/table" && "!bg-gray-400 !text-black dark:!bg-white/10"}`}
          href="/table"
        >
          <TableProperties className="size-[18px] shrink-0" />
          <span>Table</span>
        </NavLink>

        <HoverCard openDelay={0}>
          <HoverCardTrigger asChild>
            <button
              className="nav-link rounded-lg !px-2.5 hover:bg-gray-400 data-[state=open]:bg-gray-400 data-[state=open]:text-black dark:hover:bg-white/10 dark:data-[state=open]:bg-white/10 dark:data-[state=open]:text-white"
              type="button"
            >
              <ClipboardType className="size-[18px] shrink-0" />
              <span>Forms</span>
              <ChevronDown className="size-4 shrink-0" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="h-full max-h-96 min-w-40 overflow-y-auto p-1.5">
            <ul className="submenu space-y-1">
              <li>
                <NavLink href="/checkbox">Check Box & Radio</NavLink>
              </li>
              <li>
                <NavLink href="/combobox">Combobox</NavLink>
              </li>

              <li>
                <NavLink href="/command">Command</NavLink>
              </li>
              <li>
                <NavLink href="/form">Form</NavLink>
              </li>
              <li>
                <NavLink href="/inputs">Input</NavLink>
              </li>

              <li>
                <NavLink href="/input-otp">Input OTP</NavLink>
              </li>
            </ul>
          </HoverCardContent>
        </HoverCard>

        <NavLink
          className={`nav-link rounded-lg !px-2.5 hover:bg-gray-400 dark:hover:bg-white/10 ${pathName === "/settings" && "!bg-gray-400 !text-black dark:!bg-white/10"}`}
          href="/settings"
        >
          <Settings className="size-[18px] shrink-0" />
          <span>Settings</span>
        </NavLink>

        <HoverCard openDelay={0}>
          <HoverCardTrigger asChild>
            <button
              className="nav-link rounded-lg !px-2.5 hover:bg-gray-400 data-[state=open]:bg-gray-400 data-[state=open]:text-black dark:hover:bg-white/10 dark:data-[state=open]:bg-white/10 dark:data-[state=open]:text-white"
              type="button"
            >
              <Fingerprint className="size-[18px] shrink-0" />
              <span>Authentication</span>
              <ChevronDown className="size-4 shrink-0" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="h-full max-h-96 min-w-40 overflow-y-auto p-1.5">
            <ul className="submenu space-y-1">
              <li>
                <NavLink href="/login" target="_blank">
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink href="/register" target="_blank">
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink href="/forgot" target="_blank">
                  Forgot
                </NavLink>
              </li>
              <li>
                <NavLink href="/password" target="_blank">
                  Password
                </NavLink>
              </li>
            </ul>
          </HoverCardContent>
        </HoverCard>

        <NavLink
          className={`nav-link rounded-lg !px-2.5 hover:bg-gray-400 dark:hover:bg-white/10 ${pathName === "/contact-us" && "!bg-gray-400 !text-black dark:!bg-white/10"}`}
          href="/contact-us"
        >
          <Phone className="size-[18px] shrink-0" />
          <span>Contact Us</span>
        </NavLink>
      </div>
    </header>
  );
};
