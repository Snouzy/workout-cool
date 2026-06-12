import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";

// 1. Mockeamos el hook de internacionalización useI18n
vi.mock("locales/client", () => ({
  useI18n: () => {
    return (key: string) => {
      const translations: Record<string, string> = {
        "profile.alert.title": "¡Atención!",
        "profile.alert.create_account": "Crea una cuenta",
        "commons.or": "O",
        "profile.alert.log_in": "Inicia sesión",
        "profile.alert.to_ensure_it_is_not_getting_lost": " para no perder tus datos.",
      };
      return translations[key] || key;
    };
  },
}));

// 2. Mockeamos 'next/link' para que renderice una etiqueta <a> estándar
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// 3. Mockeamos los subcomponentes de Alert
vi.mock("@/components/ui/alert", () => ({
  Alert: ({ children, className, variant }: any) => (
    <div data-testid="alert-root" data-variant={variant} className={className}>
      {children}
    </div>
  ),
  AlertDescription: ({ children, className }: any) => (
    <div data-testid="alert-description" className={className}>
      {children}
    </div>
  ),
}));

// 4. Mockeamos las constantes de rutas
vi.mock("@/shared/constants/paths", () => ({
  paths: {
    signUp: "/sign-up-route",
    signIn: "/sign-in-route",
  },
}));

import { LocalAlert } from "./local-alert";

describe("Pruebas Unitarias - Componente LocalAlert", () => {

  test("debe renderizar el contenedor de alerta con las clases base y la variante 'info'", () => {
    render(<LocalAlert />);

    const alertRoot = screen.getByTestId("alert-root");
    expect(alertRoot).toBeInTheDocument();
    expect(alertRoot).toHaveAttribute("data-variant", "info");
    expect(alertRoot).toHaveClass("bg-blue-100", "border-0", "text-black");
  });

  test("debe renderizar todos los textos traducidos correctamente", () => {
    render(<LocalAlert />);

    // Obtenemos el contenedor de la descripción completa de la alerta
    const descriptionElement = screen.getByTestId("alert-description");
    expect(descriptionElement).toBeInTheDocument();

    // Verificamos que el texto completo acumulado dentro del contenedor incluya todas las partes clave
    const fullText = descriptionElement.textContent;
    
    expect(fullText).toContain("¡Atención!");
    expect(fullText).toContain("o"); // Aquí validamos la 'o' minúscula integrada de forma segura
    expect(fullText).toContain("para no perder tus datos.");
  });

  test("debe renderizar los enlaces con las rutas y estilos correspondientes", () => {
    render(<LocalAlert />);

    const signUpLink = screen.getByRole("link", { name: "Crea una cuenta" });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute("href", "/sign-up-route");
    expect(signUpLink).toHaveClass("text-blue-700", "underline");

    const signInLink = screen.getByRole("link", { name: "Inicia sesión" });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute("href", "/sign-in-route");
    expect(signInLink).toHaveClass("text-purple-700", "underline");
  });

  test("debe concatenar clases personalizadas externas en el contenedor raíz", () => {
    render(<LocalAlert className="my-custom-alert-class" />);

    const alertRoot = screen.getByTestId("alert-root");
    expect(alertRoot).toHaveClass("bg-blue-100", "my-custom-alert-class");
  });
});