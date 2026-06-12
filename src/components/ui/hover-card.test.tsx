import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect } from "vitest";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./hover-card";

describe("Pruebas Unitarias - HoverCard (Radix Primitives)", () => {
  test("no debe renderizar el contenido de la tarjeta flotante por defecto", () => {
    render(
      <HoverCard>
        <HoverCardTrigger>Pasa el mouse aquí</HoverCardTrigger>
        <HoverCardContent>
          <p>Información del Perfil del Usuario</p>
        </HoverCardContent>
      </HoverCard>
    );

    expect(screen.getByText("Pasa el mouse aquí")).toBeInTheDocument();
    // El contenido extendido debe permanecer desmontado inicialmente
    expect(screen.queryByText("Información del Perfil del Usuario")).not.toBeInTheDocument();
  });

  test("debe renderizar el contenido inmediatamente si se fuerza el estado abierto de forma controlada", () => {
    // Solución blindada contra JSDOM: forzamos open={true} para inyectar el Portal síncronamente
    render(
      <HoverCard open={true}>
        <HoverCardTrigger>Usuario</HoverCardTrigger>
        <HoverCardContent data-testid="hover-content">
          <p>Detalles del desarrollador</p>
        </HoverCardContent>
      </HoverCard>
    );

    // Verificamos que el Portal asiente el nodo correctamente en la pantalla global
    expect(screen.getByText("Detalles del desarrollador")).toBeInTheDocument();
    
    const content = screen.getByTestId("hover-content");
    expect(content).toBeInTheDocument();
    // Validamos las clases estructurales base aplicadas por defecto
    expect(content).toHaveClass("z-50", "max-w-80", "rounded-lg", "bg-white");
  });

  test("debe concatenar clases CSS personalizadas pasadas a través de la propiedad className", () => {
    render(
      <HoverCard open={true}>
        <HoverCardTrigger>Trigger</HoverCardTrigger>
        <HoverCardContent className="w-[350px] custom-hover-card" data-testid="custom-content">
          <p>Contenido con clases extra</p>
        </HoverCardContent>
      </HoverCard>
    );

    const content = screen.getByTestId("custom-content");
    // Comprobamos la fusión exitosa mediante el utilitario 'cn'
    expect(content).toHaveClass("w-[350px]", "custom-hover-card", "z-50", "bg-white");
  });

  test("debe propagar propiedades HTML nativas adicionales mediante spread operator (...props)", () => {
    render(
      <HoverCard open={true}>
        <HoverCardTrigger>Trigger</HoverCardTrigger>
        <HoverCardContent aria-label="Tarjeta de resumen" data-testid="props-content">
          <p>Accesibilidad</p>
        </HoverCardContent>
      </HoverCard>
    );

    const content = screen.getByTestId("props-content");
    expect(content).toHaveAttribute("aria-label", "Tarjeta de resumen");
  });
});