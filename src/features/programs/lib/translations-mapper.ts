import { Program } from "@prisma/client";

import { Locale } from "locales/types";
import { PublicProgram } from "@/features/programs/actions/get-public-programs.action";

const genericTitleMapper = (locale: Locale, program: PublicProgram | Program) => {
  switch (locale) {
    case "en":
      return program.titleEn;
    case "fr":
      return program.title;
    case "es":
      return program.titleEs;
    case "zh-CN":
      return program.titleZhCn;
    case "ru":
      return program.titleRu;
    case "pt":
      return program.titlePt;
  }
};

const genericDescriptionMapper = (locale: Locale, program: PublicProgram | Program) => {
  console.log("program:", program);
  console.log("locale:", locale);
  switch (locale) {
    case "en":
      return program.descriptionEn;
    case "fr":
      return program.description;
    case "es":
      return program.descriptionEs;
    case "zh-CN":
      return program.descriptionZhCn;
    case "ru":
      return program.descriptionRu;
    case "pt":
      return program.descriptionPt;
  }
};

export const getPublicProgramTitle = (locale: Locale, program: PublicProgram) => {
  return genericTitleMapper(locale, program);
};

export const getPublicProgramDescription = (locale: Locale, program: PublicProgram) => {
  return genericDescriptionMapper(locale, program);
};

export const getDetailProgramTitle = (locale: Locale, program: Program) => {
  return genericTitleMapper(locale, program);
};

export const getDetailProgramDescription = (locale: Locale, program: Program) => {
  return genericDescriptionMapper(locale, program);
};
