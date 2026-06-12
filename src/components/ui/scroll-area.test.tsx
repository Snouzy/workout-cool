import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

// Mock de ResizeObserver obligatorio para componentes Radix
beforeEach(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

import { ScrollArea, ScrollBar } from "./scroll-area";

describe("Pruebas Unitarias - Componente ScrollArea", () => {

  test("debe renderizar el contenedor principal e inyectar sus elementos hijos de forma correcta", () => {
    render(
      <ScrollArea data-testid="scroll-area-root">
        <div data-testid="scroll-content">Contenido de prueba largo...</div>
      </ScrollArea>
    );

    const rootElement = screen.getByTestId("scroll-area-root");
    expect(rootElement).toBeInTheDocument();
    expect(rootElement).toHaveClass("relative", "overflow-hidden", "bg-white");

    const childContent = screen.getByTestId("scroll-content");
    expect(childContent).toBeInTheDocument();
  });

  test("debe aplicar los estilos estructurales específicos según la orientación de la ScrollBar", () => {
    // Usamos data-testid directamente en la barra para evitar problemas de selectores con Radix en JSDOM
    const { rerender } = render(
      <ScrollArea type="always">
        <ScrollBar orientation="vertical" forceMount data-testid="my-scrollbar" />
      </ScrollArea>
    );
    
    let scrollbarThumb = screen.getByTestId("my-scrollbar");
    expect(scrollbarThumb).toBeInTheDocument();
    expect(scrollbarThumb).toHaveClass("h-full", "w-2.5");

    // Probamos la orientación horizontal
    rerender(
      <ScrollArea type="always">
        <ScrollBar orientation="horizontal" forceMount data-testid="my-scrollbar" />
      </ScrollArea>
    );
    
    scrollbarThumb = screen.getByTestId("my-scrollbar");
    expect(scrollbarThumb).toBeInTheDocument();
    expect(scrollbarThumb).toHaveClass("h-1.5", "flex-col");
  });

  test("debe concatenar clases CSS personalizadas tanto en ScrollArea como en ScrollBar usando cn", () => {
    const { container } = render(
      <ScrollArea className="custom-area-class" type="always">
        <ScrollBar className="custom-bar-class" orientation="vertical" forceMount data-testid="gated-bar" />
        <div>Contenido estático</div>
      </ScrollArea>
    );

    const rootElement = container.firstChild;
    expect(rootElement).toHaveClass("custom-area-class", "relative");

    const scrollbarElement = screen.getByTestId("gated-bar");
    expect(scrollbarElement).toBeInTheDocument();
    expect(scrollbarElement).toHaveClass("custom-bar-class", "mr-2", "flex");
  });

  test("debe heredar y propagar atributos HTML nativos adicionales (...props)", () => {
    render(
      <ScrollArea id="unique-scroll-id" aria-label="Contenedor con scroll">
        <div>Contenido</div>
      </ScrollArea>
    );

    const rootElement = screen.getByLabelText("Contenedor con scroll");
    expect(rootElement).toBeInTheDocument();
    expect(rootElement).toHaveAttribute("id", "unique-scroll-id");
  });
});