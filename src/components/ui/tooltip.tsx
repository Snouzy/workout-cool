import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
// Importamos únicamente el componente que está expuesto en tu archivo real
import { InlineTooltip } from "./tooltip"; 

describe("Suite Avanzada: InlineTooltip", () => {
  it("debería renderizar el disparador y ser accesible en el DOM", () => {
    render(
      <InlineTooltip title="Información importante" delayDuration={0}>
        <span>Texto del Trigger</span>
      </InlineTooltip>
    );
    
    const trigger = screen.getByText("Texto del Trigger");
    expect(trigger).toBeInTheDocument();
  });

  it("debería admitir la propiedad asChild y renderizar el componente hijo directamente", () => {
    render(
      <InlineTooltip title="Información de botón" delayDuration={0}>
        <button data-testid="custom-button">Mi Botón Personalizado</button>
      </InlineTooltip>
    );

    const button = screen.getByTestId("custom-button");
    expect(button).toBeInTheDocument();
    expect(button.tagName.toLowerCase()).toBe("button");
  });

  it("debería abrir el contenido del tooltip interactivo tras los eventos de puntero y enfoque", async () => {
    render(
      <InlineTooltip title="Este es el secreto del tooltip" delayDuration={0}>
        <span data-testid="tooltip-trigger">Pasa el cursor aquí</span>
      </InlineTooltip>
    );

    // 1. Al principio el contenido flotante no debe existir en el documento
    expect(screen.queryByText("Este es el secreto del tooltip")).not.toBeInTheDocument();

    const trigger = screen.getByTestId("tooltip-trigger");

    // 2. Simulamos la secuencia exacta de eventos de interacción que espera Radix
    fireEvent.pointerEnter(trigger);
    fireEvent.focus(trigger);

    // 3. Esperamos a que el Portal de Radix inyecte el contenido de forma asíncrona
    await waitFor(async () => {
      // Usamos findAllByText en caso de que Radix clone el nodo en el árbol virtual
      const elements = await screen.findAllByText("Este es el secreto del tooltip");
      expect(elements[0]).toBeInTheDocument();
      // Validamos que tenga estilos funcionales del diseño (centrado)
      expect(elements[0].className).toContain("text-center");
    });
  });
});
