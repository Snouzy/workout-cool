import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect } from "vitest";

import { Separator } from "./separator";

describe("Pruebas Unitarias - Componente Separator", () => {

  test("debe renderizar la orientación horizontal por defecto con sus estilos correspondientes", () => {
    const { container } = render(<Separator />);
    
    // Obtenemos el elemento raíz generado por Radix
    const separatorElement = container.firstChild;

    expect(separatorElement).toBeInTheDocument();
    // Valida las clases para la orientación horizontal (h-[1px] w-full)
    expect(separatorElement).toHaveClass("bg-border", "shrink-0", "h-[1px]", "w-full");
    // Valida que Radix inyecte el atributo de orientación nativo
    expect(separatorElement).toHaveAttribute("data-orientation", "horizontal");
  });

  test("debe cambiar de estilos estructurales cuando la orientación es vertical", () => {
    const { container } = render(<Separator orientation="vertical" />);
    const separatorElement = container.firstChild;

    expect(separatorElement).toBeInTheDocument();
    // Valida las clases para la orientación vertical (h-full w-[1px])
    expect(separatorElement).toHaveClass("bg-border", "shrink-0", "h-full", "w-[1px]");
    expect(separatorElement).toHaveAttribute("data-orientation", "vertical");
  });

  test("debe aplicar el atributo accesibilidad 'decorative' de manera correcta", () => {
    // 1. Cuando es decorativo (true por defecto), no debe tener rol de separador en el árbol de accesibilidad
    const { rerender, container } = render(<Separator decorative={true} />);
    expect(container.firstChild).not.toHaveAttribute("role", "separator");

    // 2. Cuando NO es puramente decorativo (decorative={false}), Radix le asigna explícitamente el rol estructural
    rerender(<Separator decorative={false} />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  test("debe concatenar clases personalizadas externas usando la función cn", () => {
    const { container } = render(<Separator className="my-custom-margin dark:bg-white/20" />);
    const separatorElement = container.firstChild;

    expect(separatorElement).toHaveClass("bg-border", "my-custom-margin", "dark:bg-white/20");
  });

  test("debe propagar propiedades y atributos HTML adicionales (...props)", () => {
    render(<Separator id="landing-divider" data-testid="test-separator" />);
    
    const separatorElement = screen.getByTestId("test-separator");
    expect(separatorElement).toBeInTheDocument();
    expect(separatorElement).toHaveAttribute("id", "landing-divider");
  });
});