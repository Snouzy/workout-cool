import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { HelpCircle } from "lucide-react";

// Simulamos lucide-react para poder rastrear e identificar qué icono específico se está renderizando por variante
vi.mock("lucide-react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("lucide-react")>();
  return {
    ...actual,
    XCircle: (props: any) => <svg data-testid="icon-error" {...props} />,
    AlertTriangle: (props: any) => <svg data-testid="icon-warning" {...props} />,
    CheckCircle2: (props: any) => <svg data-testid="icon-success" {...props} />,
    Info: (props: any) => <svg data-testid="icon-info" {...props} />,
    AlertCircle: (props: any) => <svg data-testid="icon-default" {...props} />,
    HelpCircle: (props: any) => <svg data-testid="icon-custom" {...props} />,
  };
});

describe("Pruebas Unitarias - Componente Alert", () => {
  
  test("debe renderizar el título, la descripción y poseer el rol accesible alert", () => {
    render(
      <Alert>
        <AlertTitle>Atención</AlertTitle>
        <AlertDescription>Este es un mensaje de alerta del sistema.</AlertDescription>
      </Alert>
    );

    const contenedorAlert = screen.getByRole("alert");
    const titulo = screen.getByRole("heading", { level: 5, name: "Atención" });
    const descripcion = screen.getByText("Este es un mensaje de alerta del sistema.");

    expect(contenedorAlert).toBeInTheDocument();
    expect(titulo).toBeInTheDocument();
    expect(descripcion).toBeInTheDocument();
  });

  test("debe renderizar el icono por defecto cuando no se define una variante", () => {
    render(
      <Alert>
        <AlertTitle>Default</AlertTitle>
      </Alert>
    );

    // Debe cargar AlertCircle según el mapa interno para 'default'
    expect(screen.getByTestId("icon-default")).toBeInTheDocument();
  });

  test("debe cambiar al icono correcto según la variante provista", () => {
    const { rerender } = render(
      <Alert variant="error">
        <AlertTitle>Error</AlertTitle>
      </Alert>
    );
    expect(screen.getByTestId("icon-error")).toBeInTheDocument();

    rerender(
      <Alert variant="warning">
        <AlertTitle>Warning</AlertTitle>
      </Alert>
    );
    expect(screen.getByTestId("icon-warning")).toBeInTheDocument();

    rerender(
      <Alert variant="success">
        <AlertTitle>Success</AlertTitle>
      </Alert>
    );
    expect(screen.getByTestId("icon-success")).toBeInTheDocument();

    rerender(
      <Alert variant="info">
        <AlertTitle>Info</AlertTitle>
      </Alert>
    );
    expect(screen.getByTestId("icon-info")).toBeInTheDocument();
  });

  test("debe priorizar y renderizar un icono personalizado si se pasa por prop", () => {
    render(
      <Alert variant="success" icon={HelpCircle}>
        <AlertTitle>Personalizado</AlertTitle>
      </Alert>
    );

    // Aunque la variante es 'success', la prop 'icon' debe sobreescribir el icono predeterminado
    expect(screen.queryByTestId("icon-success")).not.toBeInTheDocument();
    expect(screen.getByTestId("icon-custom")).toBeInTheDocument();
  });
});