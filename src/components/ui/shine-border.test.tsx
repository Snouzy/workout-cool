import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect } from "vitest";

import { ShineBorder } from "./shine-border";

describe("Pruebas Unitarias - Componente ShineBorder", () => {

  test("debe renderizar los elementos hijos y aplicar las variables CSS con los valores por defecto", () => {
    const { container } = render(
      <ShineBorder>
        <span data-testid="child-element">Contenido Protegido</span>
      </ShineBorder>
    );

    // 1. Validar que el hijo se encuentre en el DOM
    const child = screen.getByTestId("child-element");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Contenido Protegido");

    // 2. Validar que el contenedor principal aplique el border-radius por defecto (8px)
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass("min-h-[60px]", "w-fit", "bg-white", "dark:bg-black");
    expect(mainContainer.style.getPropertyValue("--border-radius")).toBe("8px");

    // 3. Validar las variables CSS por defecto en el contenedor interno del brillo (pseudo-elemento target)
    const shineEffectContainer = mainContainer.children[0] as HTMLElement;
    expect(shineEffectContainer.style.getPropertyValue("--border-width")).toBe("1px");
    expect(shineEffectContainer.style.getPropertyValue("--duration")).toBe("14s");
    expect(shineEffectContainer.style.getPropertyValue("--background-radial-gradient")).toContain("#000000");
  });

  test("debe configurar correctamente las variables de CSS cuando se pasan props personalizadas", () => {
    const { container } = render(
      <ShineBorder borderRadius={12} borderWidth={3} duration={8} color="#ff0000">
        <div>Card Premium</div>
      </ShineBorder>
    );

    const mainContainer = container.firstChild as HTMLElement;
    const shineEffectContainer = mainContainer.children[0] as HTMLElement;

    // Comprobar la mutación de las variables nativas inline
    expect(mainContainer.style.getPropertyValue("--border-radius")).toBe("12px");
    expect(shineEffectContainer.style.getPropertyValue("--border-width")).toBe("3px");
    expect(shineEffectContainer.style.getPropertyValue("--duration")).toBe("8s");
    expect(shineEffectContainer.style.getPropertyValue("--background-radial-gradient")).toContain("#ff0000");
  });

  test("debe procesar un arreglo de múltiples colores para crear un gradiente radial complejo", () => {
    const gradientColors = ["#ff0000", "#00ff00", "#0000ff"];
    const { container } = render(
      <ShineBorder color={gradientColors}>
        <div>Gradiente</div>
      </ShineBorder>
    );

    const mainContainer = container.firstChild as HTMLElement;
    const shineEffectContainer = mainContainer.children[0] as HTMLElement;

    const radialGradientValue = shineEffectContainer.style.getPropertyValue("--background-radial-gradient");
    
    // Verificamos que se unan los colores separados por comas dentro de la función radial-gradient
    expect(radialGradientValue).toContain("#ff0000,#00ff00,#0000ff");
  });

  test("debe concatenar clases CSS personalizadas en el contenedor principal usando la utilidad cn", () => {
    const { container } = render(
      <ShineBorder className="mx-auto shadow-2xl border-glowing">
        <div>Contenido</div>
      </ShineBorder>
    );

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass("min-h-[60px]", "mx-auto", "shadow-2xl", "border-glowing");
  });
});