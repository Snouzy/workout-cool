import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";

// 1. Mock de las dependencias de internacionalización
vi.mock("locales/client", () => ({
  useI18n: () => {
    return (key: string) => {
      const translations: Record<string, string> = {
        "premium.already_premium": "¡Ya eres un miembro Premium!",
        "donation_alert.title": "Apoya nuestro proyecto",
        "premium.no_ads": "Sin anuncios molestos",
        "premium.upgrade": "Mejorar ahora",
      };
      return translations[key] || key;
    };
  },
}));

// 2. Mock de lucide-react para los iconos
vi.mock("lucide-react", () => ({
  Sparkles: () => <span data-testid="icon-sparkles" />,
  Zap: () => <span data-testid="icon-zap" />,
  Ban: () => <span data-testid="icon-ban" />,
}));

// 3. Mock de los subcomponentes UI de la Alerta y Botón
vi.mock("@/components/ui/alert", () => ({
  Alert: ({ children, className }: any) => <div data-testid="alert-root" className={className}>{children}</div>,
  AlertDescription: ({ children, className }: any) => <div data-testid="alert-description" className={className}>{children}</div>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, className }: any) => <button className={className}>{children}</button>,
}));

// 4. Mock de Next.js Link
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href} data-testid="next-link">{children}</a>,
}));

// CLAVE DE LA CORRECCIÓN: Variable de control externa para cambiar el estado del AdWrapper
let shouldShowAdWrapperFallback = false;

vi.mock("@/components/ads", () => ({
  AdWrapper: ({ children, fallback }: any) => {
    // Retornamos el fallback o los hijos dependiendo de la variable del test
    return shouldShowAdWrapperFallback ? <>{fallback}</> : <>{children}</>;
  },
}));

import { PremiumUpsellAlert } from "./premium-upsell-alert";

describe("Pruebas Unitarias - PremiumUpsellAlert", () => {

  beforeEach(() => {
    // Por defecto, cada test inicia mostrando la oferta normal
    shouldShowAdWrapperFallback = false;
  });

  test("debe renderizar la oferta de actualización a Premium por defecto (cuando no aplica el fallback)", () => {
    render(<PremiumUpsellAlert />);

    expect(screen.getByText("Apoya nuestro proyecto")).toBeInTheDocument();
    expect(screen.getByText("Sin anuncios molestos")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mejorar ahora" })).toBeInTheDocument();

    // El estado de ya ser premium no debe existir
    expect(screen.queryByTestId("alert-root")).not.toBeInTheDocument();
  });

  test("debe renderizar el estado alternativo (fallback) de éxito si el usuario ya es premium", () => {
    // Cambiamos la variable de control antes de renderizar
    shouldShowAdWrapperFallback = true;

    render(<PremiumUpsellAlert />);

    // Ahora sí se encuentra el contenedor del fallback perfectamente
    expect(screen.getByTestId("alert-root")).toBeInTheDocument();
    expect(screen.getByText("¡Ya eres un miembro Premium!")).toBeInTheDocument();
    expect(screen.getByTestId("icon-sparkles")).toBeInTheDocument();

    // La oferta vieja ya no está
    expect(screen.queryByText("Apoya nuestro proyecto")).not.toBeInTheDocument();
  });

  test("debe concatenar la propiedad className en los contenedores principales de ambos estados", () => {
    const customClass = "my-custom-layout-spacing-class";

    // 1. Validar clase en estado de oferta normal
    const { rerender, container } = render(<PremiumUpsellAlert className={customClass} />);
    expect(container.firstChild).toHaveClass(customClass);

    // 2. Cambiamos el interruptor y validamos la clase en el estado fallback
    shouldShowAdWrapperFallback = true;
    rerender(<PremiumUpsellAlert className={customClass} />);
    
    expect(screen.getByTestId("alert-root")).toHaveClass(customClass);
  });
});