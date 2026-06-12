import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

// 1. Mock preventivo de ResizeObserver para evitar colapsos por dependencias de Radix UI
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

// 2. Mock de lucide-react para el icono Circle
vi.mock("lucide-react", () => ({
  Circle: ({ className }: { className?: string }) => (
    <span data-testid="lucide-circle" className={className} />
  ),
}));

// 3. Mock del icono SVG personalizado
vi.mock("@/components/svg/IconCheckboxCheck", () => ({
  __esModule: true,
  default: ({ className }: { className?: string }) => (
    <span data-testid="custom-check-icon" className={className} />
  ),
}));

import { RadioGroup, RadioGroupItem, RadioGroupCheck } from "./radio-group";

describe("Pruebas Unitarias - Componente RadioGroup", () => {
  
  test("debe renderizar la lista de opciones y permitir cambiar la selección mediante clics", () => {
    render(
      <RadioGroup defaultValue="opcion-1">
        <RadioGroupItem value="opcion-1" data-testid="item-1" />
        <RadioGroupItem value="opcion-2" data-testid="item-2" />
      </RadioGroup>
    );

    const item1 = screen.getByTestId("item-1");
    const item2 = screen.getByTestId("item-2");

    // Verificar estado inicial basado en defaultValue
    expect(item1).toHaveAttribute("data-state", "checked");
    expect(item2).toHaveAttribute("data-state", "unchecked");

    // Simular cambio de opción haciendo clic en la segunda alternativa
    fireEvent.click(item2);

    expect(item1).toHaveAttribute("data-state", "unchecked");
    expect(item2).toHaveAttribute("data-state", "checked");
  });

  test("debe aplicar correctamente las variantes de CVA (variant y color) a RadioGroupItem", () => {
    render(
      <RadioGroup defaultValue="danger-opt">
        <RadioGroupItem 
          value="danger-opt" 
          variant="outline" 
          color="danger" 
          data-testid="item-danger" 
        />
      </RadioGroup>
    );

    const item = screen.getByTestId("item-danger");
    
    // Validamos que se inyecten las clases de variante definidas en el CVA del archivo original
    expect(item).toHaveClass("data-[state=checked]:!bg-white");
    expect(item).toHaveClass("data-[state=checked]:ring-danger");
  });

  test("debe renderizar la variante alternativa RadioGroupCheck con su icono SVG personalizado", () => {
    render(
      <RadioGroup defaultValue="check-1">
        <RadioGroupCheck value="check-1" data-testid="radio-check" />
      </RadioGroup>
    );

    const radioCheck = screen.getByTestId("radio-check");
    expect(radioCheck).toBeInTheDocument();
    
    // Verificamos las clases estáticas específicas definidas en RadioGroupCheck
    expect(radioCheck).toHaveClass("data-[state=checked]:bg-black", "border-gray-300");

    // Al estar seleccionado, el Indicator debe renderizar nuestro componente SVG personalizado
    const customIcon = screen.getByTestId("custom-check-icon");
    expect(customIcon).toBeInTheDocument();
    expect(customIcon).toHaveClass("size-1.5");
  });

  test("debe respetar el estado deshabilitado (disabled) impidiendo interactividad y aplicando opacidad", () => {
    render(
      <RadioGroup defaultValue="1">
        <RadioGroupItem value="1" data-testid="active-item" />
        <RadioGroupItem value="2" disabled data-testid="disabled-item" />
      </RadioGroup>
    );

    const activeItem = screen.getByTestId("active-item");
    const disabledItem = screen.getByTestId("disabled-item");

    expect(disabledItem).toBeDisabled();
    expect(disabledItem).toHaveClass("disabled:cursor-not-allowed", "disabled:opacity-40");

    // Intentamos hacer clic en la opción deshabilitada
    fireEvent.click(disabledItem);

    // El foco y la selección no deben cambiar debido al bloqueo nativo
    expect(activeItem).toHaveAttribute("data-state", "checked");
    expect(disabledItem).toHaveAttribute("data-state", "unchecked");
  });

  test("debe concatenar clases personalizadas externas utilizando la función cn", () => {
    render(
      <RadioGroup className="custom-group-layout">
        <RadioGroupItem value="1" className="custom-item-style" data-testid="item" />
      </RadioGroup>
    );

    expect(screen.getByRole("radiogroup")).toHaveClass("grid", "gap-4", "custom-group-layout");
    expect(screen.getByTestId("item")).toHaveClass("custom-item-style");
  });
});