import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect } from "vitest";

import { TitleWithDot } from "./title-with-dot";

describe("Pruebas Unitarias - Componente TitleWithDot", () => {

  test("debe renderizar el título proporcionado y la estructura semántica correcta", () => {
    render(<TitleWithDot title="Panel de Control" />);

    // Verificar que el encabezado h3 tenga el texto exacto
    const heading = screen.getByRole("heading", { level: 3, name: "Panel de Control" });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("text-base", "font-semibold", "text-gray-900");
  });

  test("debe incluir el punto decorativo con sus estilos de degradado CSS", () => {
    const { container } = render(<TitleWithDot title="Test Dot" />);

    // Buscamos el elemento span que actúa como el punto decorativo
    const dot = container.querySelector("span");
    
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass("inline-block", "h-2", "w-2", "rounded-full", "bg-gradient-to-r");
  });

  test("debe combinar limpiamente las clases externas en el contenedor principal usando cn", () => {
    render(<TitleWithDot title="Custom Classes" className="mt-10 max-w-xl" data-testid="title-wrapper" />);

    // Seleccionamos el wrapper por medio del text-id temporal o buscando el contenedor del h3
    const wrapper = screen.getByRole("heading", { name: "Custom Classes" }).parentElement;

    expect(wrapper).toBeInTheDocument();
    // Verifica que mantenga las clases base (mb-5 flex) y adicione las nuevas externas
    expect(wrapper).toHaveClass("mb-5", "flex", "items-center", "gap-2", "mt-10", "max-w-xl");
  });
});