import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect } from "vitest";
import { Divider } from "./divider";

describe("Pruebas Unitarias - Componente Divider", () => {
  test("debe renderizar el componente correctamente junto con su texto interno", () => {
    render(<Divider>O BIEN</Divider>);

    const textoInterno = screen.getByText("O BIEN");
    expect(textoInterno).toBeInTheDocument();
    
    // Validamos que el texto interno esté protegido con las clases de estilo semánticas
    expect(textoInterno).toHaveClass("bg-muted", "z-10", "text-center", "text-xs");
  });

  test("debe aplicar las clases CSS estructurales base en el nodo raíz", () => {
    const { container } = render(<Divider>Continuar</Divider>);
    
    const rootElement = container.firstChild;
    // Comprobamos que el elemento contenedor de tipo span tenga las propiedades de centrado
    expect(rootElement).toHaveClass("relative", "flex", "justify-center");
  });

  test("debe contener la línea decorativa absoluta con el degradado de fondo", () => {
    const { container } = render(<Divider />);

    // Buscamos la línea interna divisoria mediante sus clases de gradiente exclusivas
    const lineaDecorativa = container.querySelector(".bg-gradient-to-r");
    
    expect(lineaDecorativa).toBeInTheDocument();
    expect(lineaDecorativa).toHaveClass("absolute", "inset-x-0", "top-1/2", "h-px", "-translate-y-1/2");
  });

  test("debe concatenar clases CSS adicionales pasadas a través de la propiedad className", () => {
    const { container } = render(<Divider className="my-8 custom-divider" />);
    
    const rootElement = container.firstChild;
    expect(rootElement).toHaveClass("relative", "flex", "my-8", "custom-divider");
  });

  test("debe propagar atributos HTML nativos adicionales mediante spread operator (...props)", () => {
    render(<Divider data-testid="divisor-prueba" aria-label="Separador de contenido" />);
    
    const rootElement = screen.getByTestId("divisor-prueba");
    expect(rootElement).toBeInTheDocument();
    expect(rootElement).toHaveAttribute("aria-label", "Separador de contenido");
  });
});