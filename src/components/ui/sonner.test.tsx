import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";

// 1. Mock de next-themes para controlar el hook useTheme
const mockUseTheme = vi.fn();
vi.mock("next-themes", () => ({
  useTheme: () => mockUseTheme(),
}));

// 2. Mock de sonner ajustado para capturar las propiedades exactas que tu test evalúa
vi.mock("sonner", () => ({
  Toaster: ({ className, theme, toastOptions, position, expand, id }: any) => (
    <div 
      data-testid="sonner-toaster-mock" 
      className={className} 
      data-theme={theme}
      // Forzamos el mapeo a string para que Jest-DOM/Vitest puedan leer los atributos
      position={position}
      expand={expand ? String(expand) : undefined}
      id={id}
    >
      <div data-testid="toast-classes">{toastOptions?.classNames?.toast}</div>
      <div data-testid="close-classes">{toastOptions?.classNames?.closeButton}</div>
    </div>
  ),
}));

import { ToastSonner } from "./sonner";

describe("Pruebas Unitarias - Componente ToastSonner", () => {
  
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("debe renderizar el Toaster aplicando el tema por defecto ('system') si useTheme devuelve vacío", () => {
    mockUseTheme.mockReturnValue({ theme: undefined });
    render(<ToastSonner />);

    const toaster = screen.getByTestId("sonner-toaster-mock");
    expect(toaster).toBeInTheDocument();
    expect(toaster).toHaveAttribute("data-theme", "system");
  });

  test("debe adaptar dinámicamente el atributo theme según el estado activo de next-themes", () => {
    mockUseTheme.mockReturnValue({ theme: "dark" });
    const { rerender } = render(<ToastSonner />);
    expect(screen.getByTestId("sonner-toaster-mock")).toHaveAttribute("data-theme", "dark");

    mockUseTheme.mockReturnValue({ theme: "light" });
    rerender(<ToastSonner />);
    expect(screen.getByTestId("sonner-toaster-mock")).toHaveAttribute("data-theme", "light");
  });

  test("debe inyectar adecuadamente las clases personalizadas para los contenedores y el botón de aspa (closeButton)", () => {
    mockUseTheme.mockReturnValue({ theme: "system" });
    render(<ToastSonner />);

    expect(screen.getByTestId("toast-classes")).toHaveTextContent("group-[.toaster]:bg-white");
    expect(screen.getByTestId("close-classes")).toHaveTextContent("text-black dark:text-white");
  });

  test("debe propagar propiedades HTML y configuraciones nativas adicionales (...props)", () => {
    mockUseTheme.mockReturnValue({ theme: "system" });
    
    render(
      <ToastSonner 
        position="top-right" 
        expand={true}
        id="app-global-toaster"
      />
    );

    const toaster = screen.getByTestId("sonner-toaster-mock");
    
    // Ahora estas aserciones pasarán perfectamente gracias al mapeo explícito en el Mock
    expect(toaster).toHaveAttribute("position", "top-right");
    expect(toaster).toHaveAttribute("expand", "true");
    expect(toaster).toHaveAttribute("id", "app-global-toaster");
  });
});