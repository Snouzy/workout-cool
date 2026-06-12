import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect } from "vitest";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible"; // Ajusta a "collapside" si no renombraste el archivo original

describe("Pruebas Unitarias - Componente Collapsible", () => {
  test("debe renderizar el disparador y ocultar el contenido por defecto", () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Ver más</CollapsibleTrigger>
        <CollapsibleContent data-testid="collapsible-content">
          Contenido oculto desplegable
        </CollapsibleContent>
      </Collapsible>
    );

    // El disparador siempre debe estar visible
    const trigger = screen.getByRole("button", { name: "Ver más" });
    expect(trigger).toBeInTheDocument();

    // Radix UI maneja la visibilidad mediante el atributo nativo 'hidden' o estilos cuando está cerrado
    const content = screen.getByTestId("collapsible-content");
    expect(content).not.toBeVisible();
  });

  test("debe mostrar el contenido inmediatamente si recibe la propiedad defaultOpen", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Colapsar</CollapsibleTrigger>
        <CollapsibleContent data-testid="collapsible-content">
          Contenido abierto por defecto
        </CollapsibleContent>
      </Collapsible>
    );

    const content = screen.getByTestId("collapsible-content");
    expect(content).toBeVisible();
  });

  test("debe alternar la visibilidad del contenido al hacer clic en el CollapsibleTrigger", async () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Interactuar</CollapsibleTrigger>
        <CollapsibleContent data-testid="collapsible-content">
          Sección Dinámica
        </CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole("button", { name: "Interactuar" });
    const content = screen.getByTestId("collapsible-content");

    // Inicialmente oculto
    expect(content).not.toBeVisible();

    // Primer clic: Abre el panel
    fireEvent.click(trigger);
    expect(content).toBeVisible();

    // Segundo clic: Vuelve a colapsar el panel
    fireEvent.click(trigger);
    expect(content).not.toBeVisible();
  });

  test("debe pasar y respetar las propiedades HTML nativas adicionales", () => {
    render(
      <Collapsible data-testid="collapsible-root" className="custom-wrapper">
        <CollapsibleTrigger className="btn-trigger">Trigger</CollapsibleTrigger>
        <CollapsibleContent className="panel-content">Content</CollapsibleContent>
      </Collapsible>
    );

    const root = screen.getByTestId("collapsible-root");
    const trigger = screen.getByRole("button", { name: "Trigger" });

    expect(root).toHaveClass("custom-wrapper");
    expect(trigger).toHaveClass("btn-trigger");
  });
});