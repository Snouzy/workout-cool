import Link from "next/link";
import { getI18n } from "locales/server";

import { buttonVariants } from "@/components/ui/button";

export async function Page404() {
  const t = await getI18n();

  return (
    <section className="font-serif flex min-h-screen items-center justify-center bg-white">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full text-center sm:w-10/12 md:w-8/12">
            <div
              aria-hidden="true"
              className="h-[250px] bg-[url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)] bg-contain bg-center bg-no-repeat sm:h-[350px] md:h-[400px]"
            >
              <h1 className="pt-6 text-center text-6xl text-black sm:pt-8 sm:text-7xl md:text-8xl">404</h1>
            </div>

            <div className="mt-[-50px]">
              <h3 className="mb-4 text-2xl font-bold text-black sm:text-3xl">{t("commons.looks_like_you_are_lost")}</h3>
              <p className="mb-6 text-black sm:mb-5">{t("commons.the_page_you_are_looking_for_is_not_available")}</p>

              <Link className={buttonVariants({ variant: "black" })} href="/">
                {t("commons.go_back")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
