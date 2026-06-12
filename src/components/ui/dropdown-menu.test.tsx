import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect } from "vitest";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "./dropdown-menu";

describe("Pruebas Unitarias - DropdownMenu (Radix Primitives)", () => {
  test("no debe renderizar el contenido del menú desplegable por defecto", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="trigger">Opciones</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
          <DropdownMenuItem>Perfil</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByTestId("trigger")).toBeInTheDocument();
    // El contenido debe permanecer oculto y fuera del DOM inicialmente
    expect(screen.queryByText("Mi Cuenta")).not.toBeInTheDocument();
  });

  test("debe renderizar todos los subcomponentes dentro del Portal cuando el menú está abierto", () => {
    // CORREGIDO: Forzamos de forma controlada open={true} para garantizar que Radix monte el Portal 
    // en JSDOM sin depender del disparo físico del puntero de mouse.
    render(
      <DropdownMenu open={true}>
        <DropdownMenuTrigger data-testid="trigger-click">Abrir menú</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Configuración</DropdownMenuLabel>
          <DropdownMenuSeparator data-testid="separator" />
          <DropdownMenuItem>Editar Ajustes</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // Al estar forzado el estado abierto, los elementos ya deben encontrarse síncronamente en el DOM global
    expect(screen.getByText("Configuración")).toBeInTheDocument();
    expect(screen.getByText("Editar Ajustes")).toBeInTheDocument();

    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass("mx-3", "h-px", "bg-gray-300");
  });

  test("debe renderizar el estado marcado correctamente en un DropdownMenuCheckboxItem", async () => {
    render(
      <DropdownMenu open={true}>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={true} data-testid="checkbox-item">
            Activar Notificaciones
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const checkboxItem = screen.getByTestId("checkbox-item");
    expect(checkboxItem).toBeInTheDocument();
    
    // Verificamos que Radix asigne el atributo de accesibilidad correcto para componentes marcados
    expect(checkboxItem).toHaveAttribute("aria-checked", "true");
    expect(checkboxItem).toHaveAttribute("data-state", "checked");
  });

  test("debe permitir concatenar clases CSS personalizadas vía className", () => {
    render(
      <DropdownMenu open={true}>
        <DropdownMenuContent className="custom-dropdown-content">
          <DropdownMenuItem className="custom-item-class" data-testid="item-node">
            Elemento
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // Como el contenido está inyectado mediante un Portal al body, lo interceptamos usando document.body
    const content = document.body.querySelector(".custom-dropdown-content");
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass("z-50", "min-w-[300px]", "bg-white");

    // Para el ítem individual interno
    const itemNode = screen.getByTestId("item-node");
    expect(itemNode).toHaveClass("custom-item-class", "cursor-pointer", "rounded-lg");
  });
});