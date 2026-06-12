import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";
import { DonationAlert } from "./donation-alert";

// 1. Mockeamos de forma estricta el módulo de idiomas antes de que se monte el componente
vi.mock("locales/client", () => {
  return {
    // Simulamos que useI18n devuelve una función 't' que simplemente retorna la clave de traducción
    useI18n: () => (key: string) => `[Traducción: ${key}]`,
  };
});

// Mockeamos el componente secundario Alert de Shadcn en caso de que requiera algún wrapper contextual complejo
vi.mock("@/components/ui/alert", () => {
  return {
    Alert: ({ children, className }: { children: React.ReactNode; className: string }) => (
      <div data-testid="alert-root" className={className}>{children}</div>
    ),
    AlertDescription: ({ children, className }: { children: React.ReactNode; className: string }) => (
      <div data-testid="alert-description" className={className}>{children}</div>
    ),
  };
});

describe("Pruebas Unitarias - Componente DonationAlert", () => {
  test("debe renderizar la traducción del título junto con los enlaces de soporte", () => {
    render(<DonationAlert />);

    // Comprobamos que el hook useI18n mockeado haya inyectado la clave simulada
    expect(screen.getByText(/donation_alert\.title/i)).toBeInTheDocument();

    // Validamos la existencia y atributos correctos del enlace a Ko-fi
    const kofiLink = screen.getByRole("link", { name: "Ko-fi" });
    expect(kofiLink).toBeInTheDocument();
    expect(kofiLink).toHaveAttribute("href", "https://ko-fi.com/workoutcool");
    expect(kofiLink).toHaveAttribute("target", "_blank");

    // Validamos la existencia y atributos correctos del enlace a GitHub Sponsors
    const githubLink = screen.getByRole("link", { name: "GitHub Sponsors" });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute("href", "https://github.com/sponsors/snouzy");
    expect(githubLink).toHaveAttribute("target", "_blank");
  });

  test("debe aplicar los estilos por defecto y concatenar las clases personalizadas por className", () => {
    render(<DonationAlert className="custom-donation-alert shadow-md" />);

    const alertRoot = screen.getByTestId("alert-root");
    
    // Verificamos que contenga tanto sus clases base de diseño como las inyectadas por props
    expect(alertRoot).toHaveClass(
      "flex", 
      "items-center", 
      "bg-gray-300", 
      "custom-donation-alert", 
      "shadow-md"
    );
  });
});