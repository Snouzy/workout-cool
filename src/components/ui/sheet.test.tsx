import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

// Mock de ResizeObserver obligatorio para evitar excepciones estructurales con Radix UI
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

// Mock de lucide-react para aislar el icono de cierre
vi.mock("lucide-react", () => ({
  X: () => <span data-testid="close-icon-svg" />,
}));

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "./sheet";

describe("Pruebas Unitarias - Componente Sheet (Sidebar/Modal)", () => {

  const renderSheet = (contentProps = {}) => {
    return render(
      <Sheet>
        <SheetTrigger data-testid="sheet-trigger">Abrir Panel</SheetTrigger>
        <SheetContent data-testid="sheet-content" {...contentProps}>
          <SheetHeader data-testid="sheet-header">
            <SheetTitle data-testid="sheet-title">Configuraciones de Cuenta</SheetTitle>
            <SheetDescription data-testid="sheet-desc">Modifica tus opciones generales</SheetDescription>
          </SheetHeader>
          <div data-testid="sheet-body">Contenido interno del formulario</div>
          <SheetFooter data-testid="sheet-footer">
            <SheetClose data-testid="sheet-close-action">Cancelar</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  };

  test("debe renderizar únicamente el disparador (Trigger) inicialmente", () => {
    renderSheet();

    expect(screen.getByTestId("sheet-trigger")).toBeInTheDocument();
    expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument();
  });

  test("debe desplegar el panel lateral con toda su estructura al hacer clic en el disparador", () => {
    renderSheet();

    const trigger = screen.getByTestId("sheet-trigger");
    fireEvent.click(trigger);

    expect(screen.getByTestId("sheet-content")).toBeInTheDocument();
    expect(screen.getByTestId("sheet-header")).toBeInTheDocument();
    expect(screen.getByTestId("sheet-title")).toHaveTextContent("Configuraciones de Cuenta");
    expect(screen.getByTestId("sheet-desc")).toHaveTextContent("Modifica tus opciones generales");
    expect(screen.getByTestId("sheet-body")).toBeInTheDocument();
    expect(screen.getByTestId("sheet-footer")).toBeInTheDocument();
  });

  test("debe aplicar las variantes CSS estructurales de CVA correctas según la propiedad 'side'", () => {
    const { rerender } = renderSheet({ side: "left" });
    
    fireEvent.click(screen.getByTestId("sheet-trigger"));
    
    let content = screen.getByTestId("sheet-content");
    expect(content).toHaveClass("inset-y-0", "left-0", "h-full", "w-3/4");

    rerender(
      <Sheet defaultOpen>
        <SheetContent data-testid="sheet-content" side="right">
          <div>Contenido</div>
        </SheetContent>
      </Sheet>
    );
    
    content = screen.getByTestId("sheet-content");
    expect(content).toHaveClass("inset-y-0", "right-0", "h-full", "w-3/4");
  });

 test("debe permitir cerrar el panel lateral usando el botón de aspa nativo integrado", () => {
    renderSheet();
    
    // 1. Abrimos el panel
    fireEvent.click(screen.getByTestId("sheet-trigger"));
    expect(screen.getByTestId("sheet-content")).toBeInTheDocument();

    // 2. Buscamos el botón de cerrar integrado por Radix (que tiene el aria-label "Close")
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(screen.queryByTestId("sheet-content")).not.toBeInTheDocument();
  });

  test("debe concatenar clases CSS externas en las secciones estructurales mediante cn", () => {
    // CORRECCIÓN: Usamos data-testid explícitos en los subcomponentes bajo prueba
    render(
      <Sheet defaultOpen>
        <SheetContent className="custom-panel-style" data-testid="custom-content">
          <SheetHeader className="custom-header-style" data-testid="custom-header">Header</SheetHeader>
          <SheetFooter className="custom-footer-style" data-testid="custom-footer">Footer</SheetFooter>
        </SheetContent>
      </Sheet>
    );

    // Evaluamos las clases apuntando directamente a los contenedores correspondientes sin usar parentElement
    expect(screen.getByTestId("custom-content")).toHaveClass("custom-panel-style");
    expect(screen.getByTestId("custom-header")).toHaveClass("custom-header-style");
    expect(screen.getByTestId("custom-footer")).toHaveClass("custom-footer-style");
  });
});