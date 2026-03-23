/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable max-len */
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1472px",
    },
    fontFamily: {
      sans: ["var(--font-sans)"],
      "permanent-marker": ["var(--font-permanent-marker)"],
    },
    extend: {
      backgroundImage: {
        "hero-light": `
          radial-gradient(circle at 82% 60%, rgba(59, 59, 59, 0.06) 0%, rgba(59, 59, 59, 0.06) 69%, transparent 69%, transparent 100%),
          radial-gradient(circle at 36% 0%, rgba(185, 185, 185, 0.06) 0%, rgba(185, 185, 185, 0.06) 59%, transparent 59%, transparent 100%),
          radial-gradient(circle at 58% 82%, rgba(183, 183, 183, 0.06) 0%, rgba(183, 183, 183, 0.06) 17%, transparent 17%, transparent 100%),
          radial-gradient(circle at 71% 32%, rgba(19, 19, 19, 0.06) 0%, rgba(19, 19, 19, 0.06) 40%, transparent 40%, transparent 100%),
          radial-gradient(circle at 77% 5%, rgba(31, 31, 31, 0.06) 0%, rgba(31, 31, 31, 0.06) 52%, transparent 52%, transparent 100%),
          radial-gradient(circle at 96% 80%, rgba(11, 11, 11, 0.06) 0%, rgba(11, 11, 11, 0.06) 73%, transparent 73%, transparent 100%),
          radial-gradient(circle at 91% 59%, rgba(252, 252, 252, 0.06) 0%, rgba(252, 252, 252, 0.06) 44%, transparent 44%, transparent 100%),
          radial-gradient(circle at 52% 82%, rgba(223, 223, 223, 0.06) 0%, rgba(223, 223, 223, 0.06) 87%, transparent 87%, transparent 100%),
          radial-gradient(circle at 84% 89%, rgba(160, 160, 160, 0.06) 0%, rgba(160, 160, 160, 0.06) 57%, transparent 57%, transparent 100%),
          linear-gradient(90deg, #fef2a4, #a6ffed)
        `,
        "hero-dark": `
          radial-gradient(circle at 82% 60%, rgba(200, 200, 200, 0.04) 0%, rgba(200, 200, 200, 0.04) 69%, transparent 69%, transparent 100%),
          radial-gradient(circle at 36% 0%, rgba(150, 150, 150, 0.04) 0%, rgba(150, 150, 150, 0.04) 59%, transparent 59%, transparent 100%),
          radial-gradient(circle at 58% 82%, rgba(130, 130, 130, 0.04) 0%, rgba(130, 130, 130, 0.04) 17%, transparent 17%, transparent 100%),
          radial-gradient(circle at 71% 32%, rgba(90, 90, 90, 0.05) 0%, rgba(90, 90, 90, 0.05) 40%, transparent 40%, transparent 100%),
          radial-gradient(circle at 77% 5%, rgba(70, 70, 70, 0.05) 0%, rgba(70, 70, 70, 0.05) 52%, transparent 52%, transparent 100%),
          radial-gradient(circle at 96% 80%, rgba(50, 50, 50, 0.05) 0%, rgba(50, 50, 50, 0.05) 73%, transparent 73%, transparent 100%),
          radial-gradient(circle at 91% 59%, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.03) 44%, transparent 44%, transparent 100%),
          radial-gradient(circle at 52% 82%, rgba(180, 180, 180, 0.03) 0%, rgba(180, 180, 180, 0.03) 87%, transparent 87%, transparent 100%),
          radial-gradient(circle at 84% 89%, rgba(160, 160, 160, 0.03) 0%, rgba(160, 160, 160, 0.03) 57%, transparent 57%, transparent 100%),
          linear-gradient(90deg, #16161a, #121826)
        `,
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      fontSize: {
        "1sm": "0.80rem",
      },
      colors: {
        popover: {
          DEFAULT: "#FFF",
          dark: "#232324",
          foreground: "#000",
        },
        transparent: "transparent",
        current: "currentColor",
        white: "#FFFFFF",
        black: {
          DEFAULT: "#171718",
          dark: "#232324",
        },
        primary: "#238BE6",
        green: {
          "100": "#DCFCE7",
          "200": "#D9F9EB",
          "300": "#BDF4E0",
          "400": "#93E6C2",
          "500": "#50C890",
          "600": "#339E6E",
          "700": "#227C54",
          "800": "#1C6444",
          DEFAULT: "#22C55E",
        },
        gray: {
          "100": "#FAFBFC",
          "200": "#F9FAFB",
          "300": "#F1F3F5",
          "400": "#E5E8EB",
          "500": "#B9BEC6",
          "600": "#9CA3AF",
          "700": "#6B7280",
          DEFAULT: "#525866",
        },
        orange: {
          "100": "#FEF3C7",
          "200": "#fdc88a",
          "300": "#FFA270",
          "400": "#FF6F37",
          "500": "#FF5722",
          "600": "#E64A19",
          "700": "#D84315",
          "800": "#9E1A0E",
          "900": "#450805",
          DEFAULT: "#FF5722",
        },
        amber: {
          "100": "#FEF3C7",
          "200": "#FDE68A",
          "300": "#FCD34D",
          "400": "#FBBF24",
          "500": "#F59E0B",
          "600": "#D97706",
          "700": "#B45309",
          "800": "#92400E",
          "900": "#7A3207",
          DEFAULT: "#F59E0B",
        },
        danger: {
          DEFAULT: "#EF4444",
          light: "#FEE2E2",
        },
        success: {
          DEFAULT: "#22C55E",
          light: "#DCFCE7",
        },
        warning: "#EAB308",
        "light-theme": "#F4F7FF",
        "light-orange": "#FFEDD5",
        "light-blue": "#E0F2FE",
        "light-purple": "#F3E8FF",
      },
      boxShadow: {
        "3xl": "0 1px 2px 0 rgba(95,74,46,0.08), 0 0 0 1px rgba(227,225,222,0.4)",
        sm: "0 1px 2px 0 rgba(113,116,152,0.1)",
      },
      keyframes: {
        shine: {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          to: {
            "background-position": "0% 0%",
          },
        },
        breath: {
          "0%, 100%": {
            transform: "scale(0.95)",
            opacity: "0.3",
          },
          "50%": {
            transform: "scale(1.15)",
            opacity: "1",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "caret-blink": {
          "0%,70%,100%": {
            opacity: "1",
          },
          "20%,50%": {
            opacity: "0",
          },
        },
        marquee: {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-50%)",
          },
        },
      },
      animation: {
        shine: "shine var(--duration) infinite linear",
        "accordion-down": "accordion-down 0.3s ease-out",
        "accordion-up": "accordion-up 0.3s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        marquee: "marquee 100s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography"), require("daisyui")],
};
export default config;
