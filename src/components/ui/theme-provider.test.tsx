import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";

// Mock de next-themes para verificar que el ThemeProvider real propague las propiedades adecuadamente
vi.mock("next-themes", () => {
  return {
    ThemeProvider: ({ children, attribute, defaultTheme }: any) => (
      <div 
        data-testid="next-themes-provider-mock" 
        data-attribute={attribute} 
        data-default-theme={defaultTheme}
      >
        {children}
      </div>
    ),
  };
});

import { ThemeProvider } from "./theme-provider";

describe("Pruebas Unitarias - Componente ThemeProvider", () => {

  test("debe renderizar correctamente los elementos hijos (children)", () => {
    render(
      <ThemeProvider>
        <div data-testid="theme-child-element">Contenido Protegido por Tema</div>
      </ThemeProvider>
    );

    const child = screen.getByTestId("theme-child-element");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Contenido Protegido por Tema");
  });

  test("debe propagar limpiamente todas las propiedades de configuración (...props) hacia next-themes", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <div>App</div>
      </ThemeProvider>
    );

    const providerMock = screen.getByTestId("next-themes-provider-mock");
    
    // Verificamos que las configuraciones de inicialización de next-themes se hereden bien
    expect(providerMock).toHaveAttribute("data-attribute", "class");
    expect(providerMock).toHaveAttribute("data-default-theme", "dark");
  });
});