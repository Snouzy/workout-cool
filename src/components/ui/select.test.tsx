import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

// 1. Instanciación robusta de ResizeObserver para componentes interactivos de Radix
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

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "./select";

describe("Pruebas Unitarias - Componente Select", () => {
  
  const renderSelect = (props = {}, triggerProps = {}) => {
    return render(
      <Select defaultValue="opcion-1" {...props}>
        <SelectTrigger data-testid="select-trigger" {...triggerProps}>
          <SelectValue placeholder="Selecciona un rol" />
        </SelectTrigger>
        <SelectContent data-testid="select-content">
          <SelectGroup>
            <SelectLabel data-testid="select-label">Roles disponibles</SelectLabel>
            <SelectItem value="opcion-1" data-testid="item-1">Administrador</SelectItem>
            <SelectItem value="opcion-2" data-testid="item-2">Editor</SelectItem>
            <SelectSeparator data-testid="select-separator" />
            <SelectItem value="opcion-3" data-testid="item-3" disabled>Invitado</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  };

  test("debe renderizar el disparador del select mostrando el valor por defecto", () => {
    renderSelect();
    
    const trigger = screen.getByTestId("select-trigger");
    expect(trigger).toBeInTheDocument();
    // Verifica que el valor asociado al 'defaultValue' se muestre en pantalla
    expect(trigger).toHaveTextContent("Administrador");
  });

  test("debe desplegar las opciones al hacer clic en el disparador", async () => {
    renderSelect();

    const trigger = screen.getByTestId("select-trigger");
    
    // El contenido del dropdown (Portal) inicia fuera del DOM
    expect(screen.queryByTestId("select-content")).not.toBeInTheDocument();

    // Abrimos el menú desplegable
    fireEvent.click(trigger);

    // Validamos que el dropdown y los ítems se monten correctamente en el DOM virtual
    expect(screen.getByTestId("select-content")).toBeInTheDocument();
    expect(screen.getByTestId("select-label")).toHaveTextContent("Roles disponibles");
    expect(screen.getByTestId("item-1")).toBeInTheDocument();
    expect(screen.getByTestId("item-2")).toBeInTheDocument();
    expect(screen.getByTestId("select-separator")).toBeInTheDocument();
  });

  test("debe permitir cambiar la selección al hacer clic sobre una opción activa", async () => {
    renderSelect();

    const trigger = screen.getByTestId("select-trigger");
    fireEvent.click(trigger);

    const opcionEditor = screen.getByTestId("item-2");
    // Seleccionamos la nueva opción
    fireEvent.click(opcionEditor);

    // Debido al ciclo de renderizado de Radix, esperamos que el trigger actualice su texto
    await waitFor(() => {
      expect(trigger).toHaveTextContent("Editor");
    });
  });

  test("debe respetar las opciones con la propiedad disabled bloqueando su selección", () => {
    renderSelect();

    const trigger = screen.getByTestId("select-trigger");
    fireEvent.click(trigger);

    const opcionDeshabilitada = screen.getByTestId("item-3");
    
    // Valida que Radix inyecte el atributo de deshabilitado
    expect(opcionDeshabilitada).toHaveAttribute("data-disabled");
    
    // Intentamos hacer clic en el elemento bloqueado
    fireEvent.click(opcionDeshabilitada);

    // El valor del select debe permanecer intacto con la opción inicial
    expect(trigger).toHaveTextContent("Administrador");
  });

  test("debe renderizar el icono adecuado si se configura la propiedad icons como shorting", () => {
    renderSelect({}, { icons: "shorting" });

    const trigger = screen.getByTestId("select-trigger");
    // Buscamos el SVG que Lucide-react inyecta para ChevronsUpDown
    const icon = trigger.querySelector("svg");
    
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("!rotate-0");
  });

  test("debe concatenar clases personalizadas externas en el Trigger e Item usando cn", () => {
    renderSelect({}, { className: "custom-trigger-layout" });

    const trigger = screen.getByTestId("select-trigger");
    expect(trigger).toHaveClass("flex", "w-full", "custom-trigger-layout");
  });
});