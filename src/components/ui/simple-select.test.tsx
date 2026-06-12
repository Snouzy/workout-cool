import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

// 1. Mock obligatorio de ResizeObserver para componentes interactivos de Radix UI
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

import { SimpleSelect, SelectOption } from "./simple-select";

describe("Pruebas Unitarias - Componente SimpleSelect", () => {
  const mockOptions: SelectOption[] = [
    { value: "apple", label: "Manzana" },
    { value: "banana", label: "Plátano" },
    { value: "orange", label: "Naranja" },
  ];

  test("debe renderizar el placeholder de forma correcta si no se pasa un valor inicial", () => {
    render(
      <SimpleSelect
        value=""
        onValueChange={vi.fn()}
        options={mockOptions}
        placeholder="Selecciona una fruta"
      />
    );

    // Validamos que el texto del placeholder esté presente en el disparador
    expect(screen.getByText("Selecciona una fruta")).toBeInTheDocument();
  });

  test("debe mostrar la etiqueta (label) de la opción seleccionada por defecto", () => {
    render(
      <SimpleSelect
        value="banana"
        onValueChange={vi.fn()}
        options={mockOptions}
        placeholder="Selecciona una fruta"
      />
    );

    // Valida que muestre el 'label' ("Plátano") asociado al 'value' ("banana")
    expect(screen.getByText("Plátano")).toBeInTheDocument();
    expect(screen.queryByText("Selecciona una fruta")).not.toBeInTheDocument();
  });

  test("debe desplegar la lista de opciones e interactuar disparando onValueChange al hacer clic", async () => {
    const handleValueChange = vi.fn();
    
    render(
      <SimpleSelect
        value="apple"
        onValueChange={handleValueChange}
        options={mockOptions}
        aria-label="Selector de frutas"
      />
    );

    // Buscamos el combobox o disparador por su propiedad de accesibilidad
    const trigger = screen.getByRole("combobox", { name: /selector de frutas/i });
    expect(trigger).toBeInTheDocument();

    // Desplegamos el menú flotante
    fireEvent.click(trigger);

    // Comprobamos que las opciones se monten en el árbol DOM virtual de Radix
    const opcionNaranja = screen.getByText("Naranja");
    expect(opcionNaranja).toBeInTheDocument();

    // Seleccionamos una nueva opción
    fireEvent.click(opcionNaranja);

    // Validamos que el callback externo se haya gatillado con el value correspondiente
    expect(handleValueChange).toHaveBeenCalledTimes(1);
    expect(handleValueChange).toHaveBeenCalledWith("orange");
  });

  test("debe respetar la propiedad disabled bloqueando las interacciones del componente", () => {
    const handleValueChange = vi.fn();

    render(
      <SimpleSelect
        value="apple"
        onValueChange={handleValueChange}
        options={mockOptions}
        disabled={true}
        aria-label="Selector Deshabilitado"
      />
    );

    const trigger = screen.getByRole("combobox", { name: /selector deshabilitado/i });
    
    // Verificamos el estado bloqueado nativo de HTML / Radix
    expect(trigger).toBeDisabled();
    
    // Intentamos forzar el clic
    fireEvent.click(trigger);

    // El portal de opciones no debe aparecer y el callback nunca debió ejecutarse
    expect(screen.queryByText("Naranja")).not.toBeInTheDocument();
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  test("debe concatenar clases CSS externas personalizadas en el Trigger usando la utilidad cn", () => {
    render(
      <SimpleSelect
        value="apple"
        onValueChange={vi.fn()}
        options={mockOptions}
        className="custom-border-test bg-red-500"
        aria-label="Selector Estilos"
      />
    );

    const trigger = screen.getByRole("combobox", { name: /selector estilos/i });
    
    // Valida que mezcle las clases base junto a las inyectadas por props
    expect(trigger).toHaveClass("w-full", "custom-border-test", "bg-red-500");
  });
});