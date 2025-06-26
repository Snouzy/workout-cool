import { Locale } from "locales/types";
import { ProgramSessionDetail } from "app/[locale]/(app)/programs/[slug]/session/[sessionSlug]/ProgramSessionClient";
import { SessionDetail } from "@/features/programs/actions/get-session-by-slug.action";
import { PublicProgram } from "@/features/programs/actions/get-public-programs.action";
import { ProgramDetail } from "@/features/programs/actions/get-program-by-slug.action";

const genericTitleMapper = (locale: Locale, program: PublicProgram | ProgramDetail) => {
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

const genericDescriptionMapper = (locale: Locale, program: PublicProgram | ProgramDetail) => {
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

const genericSlugMapper = (locale: Locale, program: PublicProgram | ProgramDetail) => {
  switch (locale) {
    case "en":
      return program.slugEn;
    case "fr":
      return program.slug;
    case "es":
      return program.slugEs;
    case "zh-CN":
      return program.slugZhCn;
    case "ru":
      return program.slugRu;
    case "pt":
      return program.slugPt;
  }
};

export const getDetailProgramSessionDescription = (locale: Locale, session: ProgramSessionDetail | null) => {
  if (!session) return "";

  switch (locale) {
    case "en":
      return session.descriptionEn;
    case "fr":
      return session.description;
    case "es":
      return session.descriptionEs;
    case "zh-CN":
      return session.descriptionZhCn;
    case "ru":
      return session.descriptionRu;
    case "pt":
      return session.descriptionPt;
  }
};

export const getDetailProgramSessionTitle = (locale: Locale, session: ProgramSessionDetail | null) => {
  if (!session) return "";

  switch (locale) {
    case "en":
      return session.titleEn;
    case "fr":
      return session.title;
    case "es":
      return session.titleEs;
    case "zh-CN":
      return session.titleZhCn;
    case "ru":
      return session.titleRu;
    case "pt":
      return session.titlePt;
  }
};

export const getPublicProgramTitle = (locale: Locale, program: PublicProgram) => {
  return genericTitleMapper(locale, program);
};

export const getPublicProgramDescription = (locale: Locale, program: PublicProgram) => {
  return genericDescriptionMapper(locale, program);
};

export const getDetailProgramTitle = (locale: Locale, program: ProgramDetail) => {
  return genericTitleMapper(locale, program);
};

export const getDetailProgramDescription = (locale: Locale, program: ProgramDetail) => {
  return genericDescriptionMapper(locale, program);
};

export const getPublicProgramSlug = (locale: Locale, program: PublicProgram) => {
  return genericSlugMapper(locale, program);
};

export const getDetailProgramSlug = (locale: Locale, program: ProgramDetail) => {
  return genericSlugMapper(locale, program);
};

export const getSessionProgramTitle = (locale: Locale, program: SessionDetail["program"]) => {
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

export const getSessionProgramSlug = (locale: Locale, program: SessionDetail["program"]) => {
  switch (locale) {
    case "en":
      return program.slugEn;
    case "fr":
      return program.slug;
    case "es":
      return program.slugEs;
    case "zh-CN":
      return program.slugZhCn;
    case "ru":
      return program.slugRu;
    case "pt":
      return program.slugPt;
  }
};
