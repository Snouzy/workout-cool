import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect } from "vitest";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";

describe("Pruebas Unitarias - Componente Dialog (Radix Primitive)", () => {
  test("no debe renderizar el contenido del modal por defecto si open es falso", () => {
    render(
      <Dialog>
        <DialogTrigger>Abrir Modal</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Título Interno</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByRole("button", { name: "Abrir Modal" })).toBeInTheDocument();
    // El contenido no debe existir en el DOM aún
    expect(screen.queryByText("Título Interno")).not.toBeInTheDocument();
  });

  test("debe renderizar el contenido del modal inmediatamente usando la propiedad open", () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Título Modal Abierto</DialogTitle>
            <DialogDescription>Esta es una descripción corta</DialogDescription>
          </DialogHeader>
          <div>Contenido Principal</div>
          <DialogFooter>
            <button data-testid="btn-footer">Acción</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // Al usar Portals de Radix, los buscamos globalmente mediante screen
    expect(screen.getByText("Título Modal Abierto")).toBeInTheDocument();
    expect(screen.getByText("Esta es una descripción corta")).toBeInTheDocument();
    expect(screen.getByText("Contenido Principal")).toBeInTheDocument();
    expect(screen.getByTestId("btn-footer")).toBeInTheDocument();
    
    // Validamos que el botón de cierre integrado de Lucide ("Close") esté disponible
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  test("debe abrir el diálogo al hacer clic en el DialogTrigger", async () => {
    render(
      <Dialog>
        <DialogTrigger data-testid="trigger-click">Desplegar Ventana</DialogTrigger>
        <DialogContent>
          <p>Mensaje secreto expuesto</p>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByText("Mensaje secreto expuesto")).not.toBeInTheDocument();

    // Simulamos la apertura
    fireEvent.click(screen.getByTestId("trigger-click"));

    // Ahora sí debe montarse en el DOM asíncronamente
    expect(await screen.findByText("Mensaje secreto expuesto")).toBeInTheDocument();
  });

  test("debe propagar clases personalizadas (className) en sus subcomponentes decorativos", () => {
    render(
      <Dialog open={true}>
        <DialogContent className="custom-content-class">
          <DialogHeader className="custom-header-class" data-testid="header-node" />
          <DialogFooter className="custom-footer-class" data-testid="footer-node" />
        </DialogContent>
      </Dialog>
    );

    // Para DialogContent, verificamos la clase sobre su nodo contenedor en el body
    const contentContainer = document.body.querySelector(".custom-content-class");
    expect(contentContainer).toBeInTheDocument();

    // Cabecera y Pie de página
    expect(screen.getByTestId("header-node")).toHaveClass("custom-header-class", "flex-col");
    expect(screen.getByTestId("footer-node")).toHaveClass("custom-footer-class", "flex-col-reverse");
  });
});