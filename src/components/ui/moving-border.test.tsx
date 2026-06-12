import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";

// 1. Mockeamos Framer Motion para simplificar los hooks de animación en JSDOM
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    useAnimationFrame: () => {},
    useMotionTemplate: () => "translateX(10px) translateY(10px) translateX(-50%) translateY(-50%)",
    useTransform: (_value: any, transformer: (val: any) => any) => transformer(0),
    useMotionValue: (initial: any) => ({
      get: () => initial,
      set: vi.fn(),
    }),
    motion: {
      div: ({ children, style, ...props }: any) => (
        <div style={style} {...props} data-testid="motion-div">
          {children}
        </div>
      ),
    },
  };
});

import { Button } from "./moving-border";

describe("Pruebas Unitarias - Componente Button con MovingBorder", () => {
  
  beforeEach(() => {
    // 3. Añadimos mocks de métodos SVG al prototipo para evitar que rompan en JSDOM
    SVGElement.prototype.getTotalLength = vi.fn(() => 100);
    // @ts-ignore
    SVGElement.prototype.getPointAtLength = vi.fn(() => ({ x: 10, y: 10 }));
  });

  test("debe renderizar el botón utilizando el elemento HTML por defecto ('button')", () => {
    render(<Button>Click aquí</Button>);
    
    const buttonElement = screen.getByRole("button", { name: "Click aquí" });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.tagName).toBe("BUTTON");
  });

  test("debe renderizar utilizando un componente o etiqueta personalizada mediante la propiedad 'as'", () => {
    render(<Button as="a" href="/profile">Enlace Polimórfico</Button>);
    
    const linkElement = screen.getByRole("link", { name: "Enlace Polimórfico" });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe("A");
    expect(linkElement).toHaveAttribute("href", "/profile");
  });

  test("debe aplicar el borderRadius personalizado al contenedor y escalarlo en el contenido interno", () => {
    const customRadius = "2rem";
    render(<Button borderRadius={customRadius}>Bordes Redondos</Button>);
    
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toHaveStyle({ borderRadius: customRadius });

    const contentDiv = screen.getByText("Bordes Redondos");
    expect(contentDiv).toHaveStyle({ borderRadius: `calc(${customRadius} * 0.96)` });
  });

  test("debe renderizar el SVG y el elemento de animación MovingBorder correctamente", () => {
    render(<Button>Borde Animado</Button>);
    
    const svgElement = document.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass("absolute h-full w-full");

    const rectElement = document.querySelector("rect");
    expect(rectElement).toBeInTheDocument();
    expect(rectElement).toHaveAttribute("rx", "30%");
    expect(rectElement).toHaveAttribute("ry", "30%");

    const motionDiv = screen.getByTestId("motion-div");
    expect(motionDiv).toBeInTheDocument();
  });

  test("debe concatenar clases personalizadas externas (containerClassName, borderClassName y className)", () => {
    render(
      <Button 
        containerClassName="bg-red-500" 
        borderClassName="custom-border-gradient"
        className="text-yellow-400"
      >
        Clases mixtas
      </Button>
    );
    
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toHaveClass("bg-red-500", "relative");

    const borderGradientDiv = document.querySelector(".custom-border-gradient");
    expect(borderGradientDiv).toBeInTheDocument();

    const contentDiv = screen.getByText("Clases mixtas");
    expect(contentDiv).toHaveClass("text-yellow-400", "border-orange-800");
  });
});