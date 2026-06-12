import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect } from "vitest";

import { PhoneFramePreview } from "./phone-frame-preview";

describe("Pruebas Unitarias - Componente PhoneFramePreview", () => {
  
  test("debe renderizar correctamente los elementos hijos (children)", () => {
    render(
      <PhoneFramePreview>
        <div data-testid="mock-screen-content">Contenido de la App</div>
      </PhoneFramePreview>
    );

    // Validamos que el hijo inyectado esté presente en el DOM
    const childElement = screen.getByTestId("mock-screen-content");
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent("Contenido de la App");
  });

  test("debe renderizar los elementos de hardware simulados (Notch y Home Indicator)", () => {
    const { container } = render(
      <PhoneFramePreview>
        <div>Pantalla</div>
      </PhoneFramePreview>
    );

    // Validamos la existencia de la clase del Notch superior
    const notch = container.querySelector(".bg-black.rounded-b-lg");
    expect(notch).toBeInTheDocument();
    expect(notch).toHaveClass("absolute", "left-1/2", "top-0");

    // Validamos la existencia de la barra inferior (Home Indicator)
    const homeIndicator = container.querySelector(".bg-gray-400.rounded-full");
    expect(homeIndicator).toBeInTheDocument();
    expect(homeIndicator).toHaveClass("absolute", "bottom-2", "left-1/2");
  });

  test("debe fusionar y aplicar las clases CSS personalizadas pasadas por props", () => {
    const { container } = render(
      <PhoneFramePreview className="border-red-500 shadow-2xl">
        <div>Pantalla</div>
      </PhoneFramePreview>
    );

    // El primer div es el marco principal del teléfono
    const mainWrapper = container.firstChild;
    
    // Verificamos que tenga tanto las clases base como las añadidas mediante cn()
    expect(mainWrapper).toHaveClass("relative", "mx-auto", "aspect-[9/18]", "border-red-500", "shadow-2xl");
  });

  test("debe propagar atributos HTML adicionales (...props) al contenedor raíz", () => {
    render(
      <PhoneFramePreview data-testid="phone-wrapper" aria-label="Vista previa móvil" id="mobile-frame-id">
        <div>Pantalla</div>
      </PhoneFramePreview>
    );

    const mainWrapper = screen.getByTestId("phone-wrapper");
    expect(mainWrapper).toBeInTheDocument();
    expect(mainWrapper).toHaveAttribute("aria-label", "Vista previa móvil");
    expect(mainWrapper).toHaveAttribute("id", "mobile-frame-id");
  });
});