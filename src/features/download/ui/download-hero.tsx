import Image from "next/image";
import { Locale } from "locales/types";

import type { DownloadCopy } from "../copy";

import { Link } from "@/components/ui/link";


type DownloadHeroProps = {
  locale: Locale;
  copy: DownloadCopy;
  source: string;
  appStoreUrl: string;
  playStoreUrl: string;
};

// Official badges live in public/images/stores. Google has no zh-CN web badge, so Chinese falls back to English.
const googleBadgeLocale = (locale: Locale) => (locale === "zh-CN" ? "en" : locale);

export function DownloadHero({ locale, copy, source, appStoreUrl, playStoreUrl }: DownloadHeroProps) {
  return (
    <section className="flex flex-1 flex-col items-center px-6 py-12 text-center sm:py-16">
      <Image
        alt=""
        className="size-24 rounded-[22%] shadow-lg ring-1 ring-black/5 dark:ring-white/10"
        height={96}
        priority
        src="/apple-touch-icon.png"
        width={96}
      />

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{copy.title}</h1>
      <p className="mt-3 max-w-md text-base text-gray-600 dark:text-gray-300">{copy.subtitle}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a className="transition hover:scale-[1.03]" data-source={source} data-store="app_store" data-track="download_click" href={appStoreUrl}>
          <Image alt={copy.appStore} height={60} src={`/images/stores/app-store-${locale}.svg`} unoptimized width={180} />
        </a>
        <a className="transition hover:scale-[1.03]" data-source={source} data-store="google_play" data-track="download_click" href={playStoreUrl}>
          <Image alt={copy.googlePlay} height={76} src={`/images/stores/google-play-${googleBadgeLocale(locale)}.png`} width={196} />
        </a>
      </div>

      <div className="mt-10 hidden items-center gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-left dark:border-gray-700 dark:bg-gray-900 sm:flex">
        <Image alt="" className="size-28 rounded-lg bg-white p-1" height={112} src="/images/stores/qr-download.svg" unoptimized width={112} />
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{copy.qrTitle}</p>
          <p className="mt-1 max-w-xs text-sm text-gray-600 dark:text-gray-300">{copy.qrHint}</p>
        </div>
      </div>

      <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        {copy.webHint}{" "}
        <Link className="font-medium text-primary underline-offset-4 hover:underline" href={`/${locale}`}>
          {copy.webLink}
        </Link>
      </p>
    </section>
  );
}
