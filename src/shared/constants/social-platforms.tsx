import {
  FaXTwitter,
  FaFacebook,
  FaEnvelope,
  FaWhatsapp,
  FaGlobe,
  FaPhone,
  FaYoutube,
  FaLinkedin,
  FaSnapchat,
  FaInstagram,
  FaTiktok,
  FaThreads,
} from "react-icons/fa6";
import { TFunction } from "locales/client";

export const SOCIAL_FIELD_PLACEHOLDERS: Record<string, string> = {
  x: "ex: johndoe",
  facebook: "ex: johndoe",
  instagram: "ex: johndoe",
  tiktok: "ex: johndoe",
  threads: "ex: johndoe",
  youtube: "ex: johndoe",
  linkedin: "ex: johndoe",
  snapchat: "ex: johndoe",
  twitch: "ex: johndoe",
  whatsapp: "ex: +33612345678",
  email: "ex: john@email.com",
  website: "ex: https://site.com",
  phone: "ex: +33612345678",
};

export const SOCIAL_FIELD_ICONS: Record<string, React.ReactNode> = {
  x: <FaXTwitter className="h-5 w-5 text-[#000]" />,
  facebook: <FaFacebook className="h-5 w-5 text-[#1877f3]" />,
  email: <FaEnvelope className="h-5 w-5 text-[#80b0f4]" />,
  whatsapp: <FaWhatsapp className="h-5 w-5 text-[#25d366]" />,
  website: <FaGlobe className="h-5 w-5 text-[#334155]" />,
  phone: <FaPhone className="h-5 w-5 text-[#66e534]" />,
  youtube: <FaYoutube className="h-5 w-5 text-[#ff0000]" />,
  linkedin: <FaLinkedin className="h-5 w-5 text-[#0077b5]" />,
  snapchat: <FaSnapchat className="h-5 w-5 text-[#fffc00]" />,
  instagram: <FaInstagram className="h-5 w-5 text-[#e1306c]" />,
  tiktok: <FaTiktok className="h-5 w-5 text-black" />,
  threads: <FaThreads className="h-5 w-5 text-black" />,
};

export const SOCIAL_PLATFORMS = (t: TFunction) =>
  [
    { value: "x", label: t("social_platforms.x"), icon: SOCIAL_FIELD_ICONS.x },
    { value: "facebook", label: t("social_platforms.facebook"), icon: SOCIAL_FIELD_ICONS.facebook },
    { value: "email", label: t("social_platforms.email"), icon: SOCIAL_FIELD_ICONS.email },
    { value: "whatsapp", label: t("social_platforms.whatsapp"), icon: SOCIAL_FIELD_ICONS.whatsapp },
    { value: "website", label: t("social_platforms.website"), icon: SOCIAL_FIELD_ICONS.website },
    { value: "phone", label: t("social_platforms.phone"), icon: SOCIAL_FIELD_ICONS.phone },
    { value: "youtube", label: t("social_platforms.youtube"), icon: SOCIAL_FIELD_ICONS.youtube },
    { value: "linkedin", label: t("social_platforms.linkedin"), icon: SOCIAL_FIELD_ICONS.linkedin },
    { value: "snapchat", label: t("social_platforms.snapchat"), icon: SOCIAL_FIELD_ICONS.snapchat },
    { value: "instagram", label: t("social_platforms.instagram"), icon: SOCIAL_FIELD_ICONS.instagram },
    { value: "tiktok", label: t("social_platforms.tiktok"), icon: SOCIAL_FIELD_ICONS.tiktok },
    { value: "threads", label: t("social_platforms.threads"), icon: SOCIAL_FIELD_ICONS.threads },
  ] as const;
