import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

// 1. Configuración de mocks del entorno virtual (JSDOM)
beforeEach(() => {
  // Mock obligatorio de ResizeObserver para componentes de Radix UI
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // SOLUCIÓN: Mock para métodos de captura de puntero ausentes en JSDOM
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

import { Slider } from "./slider";

describe("Pruebas Unitarias - Componente Slider", () => {

  test("debe renderizar el control deslizante (Track y Range) con sus estilos base por defecto", () => {
    const { container } = render(<Slider defaultValue={[50]} data-testid="slider-root" />);
    
    const sliderRoot = screen.getByTestId("slider-root");
    expect(sliderRoot).toBeInTheDocument();
    expect(sliderRoot).toHaveClass("relative", "flex", "w-full", "touch-none");

    // Verifica que se dibuje el número correcto de controladores (Thumbs)
    const thumbs = container.querySelectorAll('[class*="cursor-ew-resize"]');
    expect(thumbs.length).toBe(1);
  });

  test("debe permitir múltiples thumbs si se inicializa con un arreglo de varios valores", () => {
    const { container } = render(<Slider defaultValue={[20, 80]} />);
    
    const thumbs = container.querySelectorAll('[class*="cursor-ew-resize"]');
    expect(thumbs.length).toBe(2);
  });

  test("debe disparar la función callback onValueChange cuando se altera el rango del control", () => {
    const handleValueChange = vi.fn();
    const { container } = render(<Slider defaultValue={[40]} onValueChange={handleValueChange} />);
    
    const sliderRoot = container.querySelector('[class*="touch-none"]');
    expect(sliderRoot).toBeInTheDocument();

    if (sliderRoot) {
      fireEvent.keyDown(sliderRoot, { key: "ArrowRight", code: "ArrowRight" });
    }

    expect(handleValueChange).toHaveBeenCalled();
  });

  test("debe mostrar y ocultar el Tooltip al presionar y soltar el Thumb cuando showTooltip está activo", async () => {
    render(
      <Slider 
        defaultValue={[75]} 
        showTooltip={true} 
        tooltipContent={(val) => `Progreso: ${val}%`} 
      />
    );

    // Inicialmente el texto no debe estar visible de manera directa en pantalla
    expect(screen.queryByText("Progreso: 75%")).not.toBeInTheDocument();

    // Buscamos el control deslizante por su rol
    const thumb = screen.getByRole("slider");
    
    // 1. Presionar el control
    fireEvent.pointerDown(thumb);
    
    // SOLUCIÓN: Buscamos usando queryAll o filtrando para asegurar que al menos un elemento tenga el texto
    const tooltips = screen.getAllByText("Progreso: 75%");
    expect(tooltips[0]).toBeInTheDocument();

    // 2. Soltar el control en el documento
    fireEvent.pointerUp(document);

    // Validamos que se limpie o cierre
    await waitFor(() => {
      expect(screen.queryByText("Progreso: 75%")).not.toBeInTheDocument();
    });
  });

  test("debe adaptar la orientación del tooltip en base a la propiedad 'orientation'", () => {
    render(
      <Slider 
        defaultValue={[30]} 
        showTooltip={true} 
        orientation="vertical"
      />
    );

    const thumb = screen.getByRole("slider");
    fireEvent.pointerDown(thumb);

    // SOLUCIÓN: Obtenemos el primer elemento coincidente y verificamos su contenedor de Radix
    const tooltipTextElement = screen.getAllByText("30")[0];
    const tooltipContent = tooltipTextElement.closest("[data-side]");
    
    expect(tooltipContent).toHaveAttribute("data-side", "right");
  });

  test("debe concatenar clases personalizadas externas usando la utilidad cn", () => {
    render(<Slider defaultValue={[10]} className="custom-slider-layout mt-10" data-testid="styled-slider" />);
    
    const sliderRoot = screen.getByTestId("styled-slider");
    expect(sliderRoot).toHaveClass("custom-slider-layout", "mt-10", "relative");
  });
});