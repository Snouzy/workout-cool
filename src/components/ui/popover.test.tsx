import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

// 1. Mock de ResizeObserver para evitar que colapsen las dimensiones calculadas por Radix UI
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

import { Popover, PopoverTrigger, PopoverContent } from "./popover";

describe("Pruebas Unitarias - Componente Popover", () => {

  const renderPopover = (props = {}) => {
    return render(
      <Popover>
        <PopoverTrigger data-testid="popover-trigger">
          Abrir Opciones
        </PopoverTrigger>
        <PopoverContent data-testid="popover-content" {...props}>
          <div data-testid="popover-inner-content">Contenido del Popover</div>
        </PopoverContent>
      </Popover>
    );
  };

  test("debe renderizar el disparador (trigger) correctamente en el DOM", () => {
    renderPopover();
    
    const trigger = screen.getByTestId("popover-trigger");
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent("Abrir Opciones");
  });

  test("debe desplegar el contenido oculto al hacer clic en el disparador", () => {
    renderPopover();

    const trigger = screen.getByTestId("popover-trigger");
    
    // Al principio, debido al comportamiento de Radix, el contenido flotante no está visible/montado
    expect(screen.queryByTestId("popover-inner-content")).not.toBeInTheDocument();

    // Ejecutamos el clic para disparar la acción de apertura
    fireEvent.click(trigger);

    // Validamos que cambie el estado de Radix a abierto
    expect(trigger).toHaveAttribute("data-state", "open");

    // El contenido inyectado por el Portal ahora debe estar en el DOM
    const innerContent = screen.getByTestId("popover-inner-content");
    expect(innerContent).toBeInTheDocument();
    expect(innerContent).toHaveTextContent("Contenido del Popover");
  });

  test("debe pasar y aplicar correctamente los valores de alineación (align) por defecto u opcionales", () => {
    renderPopover({ align: "end" });

    const trigger = screen.getByTestId("popover-trigger");
    fireEvent.click(trigger);

    const content = screen.getByTestId("popover-content");
    // Verificamos que Radix reciba la propiedad de alineación configurada
    expect(content).toHaveAttribute("data-align", "end");
  });

  test("debe fusionar clases personalizadas externas utilizando la función cn", () => {
    renderPopover({ className: "custom-popover-styles bg-red-100" });

    const trigger = screen.getByTestId("popover-trigger");
    fireEvent.click(trigger);

    const content = screen.getByTestId("popover-content");
    // Verifica que mantenga las clases base del layout junto a las inyectadas por props
    expect(content).toHaveClass("z-50", "w-[250px]", "custom-popover-styles", "bg-red-100");
  });
});