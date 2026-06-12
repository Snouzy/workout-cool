import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";

// 1. Mockeamos lucide-react para controlar el elemento devuelto por Loader2
vi.mock("lucide-react", () => {
  return {
    // Simulamos el componente Loader2 devolviendo un svg o div plano con sus props
    Loader2: ({ className, size, ...props }: any) => (
      <div 
        data-testid="lucide-loader" 
        className={className} 
        style={size ? { width: size, height: size } : undefined}
        {...props} 
      />
    ),
  };
});

// 2. Importamos tu componente Loader original
import { Loader } from "./loader";

describe("Pruebas Unitarias - Componente Loader", () => {

  test("debe renderizar el elemento loader correctamente en el DOM", () => {
    render(<Loader />);
    
    const loaderElement = screen.getByTestId("lucide-loader");
    expect(loaderElement).toBeInTheDocument();
  });

  test("debe incluir obligatoriamente la clase 'animate-spin' por defecto", () => {
    render(<Loader />);
    
    const loaderElement = screen.getByTestId("lucide-loader");
    expect(loaderElement).toHaveClass("animate-spin");
  });

  test("debe concatenar clases personalizadas externas usando cn", () => {
    render(<Loader className="text-primary custom-spinner" />);
    
    const loaderElement = screen.getByTestId("lucide-loader");
    // Verifica que mantenga la animación interna y sume las clases que le envías
    expect(loaderElement).toHaveClass("animate-spin", "text-primary", "custom-spinner");
  });

  test("debe reenviar propiedades nativas de LucideProps (como size)", () => {
    render(<Loader size={40} />);
    
    const loaderElement = screen.getByTestId("lucide-loader");
    // Comprobamos que el mock recibió el size y lo aplicó al estilo según nuestra lógica del mock
    expect(loaderElement).toHaveStyle({
      width: "40px",
      height: "40px",
    });
  });

  test("debe transferir atributos adicionales mediante desestructuración (...props)", () => {
    render(<Loader data-custom-attribute="test-value" aria-label="Cargando contenido" />);
    
    const loaderElement = screen.getByTestId("lucide-loader");
    expect(loaderElement).toHaveAttribute("data-custom-attribute", "test-value");
    expect(loaderElement).toHaveAttribute("aria-label", "Cargando contenido");
  });
});