import { PASSWORD_REGEX } from "@/shared/constants/regexs";

export const validatePassword = (password: string) => {
  return PASSWORD_REGEX.test(password);
};
