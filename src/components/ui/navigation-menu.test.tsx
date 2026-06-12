import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

// 1. CORRECCIÓN CLAVE: Mockeamos ResizeObserver usando una estructura de clase real para soportar "new"
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

// 2. Mock de lucide-react para los iconos
vi.mock("lucide-react", () => ({
  ChevronDown: ({ className }: { className?: string }) => (
    <span data-testid="chevron-down" className={className}>▼</span>
  ),
}));

// 3. Importación de los componentes locales
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "./navigation-menu";

describe("Pruebas Unitarias - NavigationMenu Component", () => {
  
  const renderMenu = () => {
    return render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Productos</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/items">Todos los Items</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  };

  test("debe renderizar el disparador del menú con su icono Chevron por defecto", () => {
    renderMenu();
    
    const trigger = screen.getByRole("button", { name: /productos/i });
    expect(trigger).toBeInTheDocument();
    
    const chevron = screen.getByTestId("chevron-down");
    expect(chevron).toBeInTheDocument();
  });

  test("debe abrir el contenido del menú al interactuar con el disparador", async () => {
    renderMenu();

    const trigger = screen.getByRole("button", { name: /productos/i });
    
    // Ahora que ResizeObserver es una clase instanciable con "new", este click pasará limpio
    fireEvent.click(trigger);

    // Verificamos que cambie el estado de Radix a open
    expect(trigger).toHaveAttribute("data-state", "open");

    // Buscamos el contenido que se despliega
    const contentLink = screen.getByRole("link", { name: /todos los items/i });
    expect(contentLink).toBeInTheDocument();
  });

  test("debe aplicar clases personalizadas externas a los subcomponentes", () => {
    render(
      <NavigationMenu className="custom-menu">
        <NavigationMenuList className="custom-list">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="custom-trigger">Item</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const navElement = screen.getByRole("navigation");
    expect(navElement).toHaveClass("custom-menu");

    const listElement = screen.getByRole("list");
    expect(listElement).toHaveClass("custom-list");

    const triggerElement = screen.getByRole("button");
    expect(triggerElement).toHaveClass("custom-trigger");
  });

  test("debe soportar la inhabilitación del disparador mediante propiedades heredadas", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger disabled>Deshabilitado</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const trigger = screen.getByRole("button", { name: /deshabilitado/i });
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveClass("disabled:opacity-50");
  });
});