import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect } from "vitest";

import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table";

describe("Pruebas Unitarias - Componentes de Tabla", () => {

  test("debe renderizar una estructura de tabla HTML semántica completa con todos sus subcomponentes", () => {
    render(
      <Table data-testid="table-root">
        <TableCaption>Lista de Usuarios Activos</TableCaption>
        <TableHeader data-testid="table-header">
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Rol</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data-testid="table-body">
          <TableRow data-testid="table-row">
            <TableCell>Jenzo</TableCell>
            <TableCell>Developer</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter data-testid="table-footer">
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>1 Usuario</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    // 1. Validar la envoltura responsiva y la etiqueta table nativa
    const tableRoot = screen.getByTestId("table-root");
    expect(tableRoot).toBeInTheDocument();
    expect(tableRoot.tagName).toBe("TABLE");
    // Verifica que el contenedor wrapper superior (parent) tenga overflow-auto para layouts responsivos
    expect(tableRoot.parentElement).toHaveClass("relative", "w-full", "overflow-auto");

    // 2. Validar las secciones semánticas de la estructura
    expect(screen.getByTestId("table-header").tagName).toBe("THEAD");
    expect(screen.getByTestId("table-body").tagName).toBe("TBODY");
    expect(screen.getByTestId("table-footer").tagName).toBe("TFOOT");

    // 3. Validar las celdas y el contenido
    expect(screen.getByText("Lista de Usuarios Activos").tagName).toBe("CAPTION");
    expect(screen.getByText("Nombre").tagName).toBe("TH");
    expect(screen.getByText("Jenzo").tagName).toBe("TD");
  });

  test("debe aplicar adecuadamente las clases estéticas por defecto de Tailwind y CVA", () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Encabezado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Celda</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const th = container.querySelector("th");
    const td = container.querySelector("td");
    const tr = container.querySelector("tbody tr");

    // Validamos selectores específicos incrustados en las clases
    expect(th).toHaveClass("whitespace-nowrap", "p-4", "align-middle", "text-xs/tight");
    expect(td).toHaveClass("whitespace-nowrap", "px-4", "py-3.5", "text-black", "dark:text-white");
    expect(tr).toHaveClass("bg-white", "transition-colors", "hover:bg-gray-200");
  });

  test("debe permitir inyectar clases de personalización externas en cualquier subcomponente usando cn", () => {
    render(
      <Table className="custom-table">
        <TableBody className="custom-body">
          <TableRow className="custom-row">
            <TableCell className="custom-cell">Contenido</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(screen.getByRole("table")).toHaveClass("custom-table");
    expect(screen.toDataId ? "" : screen.getByText("Contenido")).toHaveClass("custom-cell");
    expect(screen.getByText("Contenido").closest("tr")).toHaveClass("custom-row");
    expect(screen.getByText("Contenido").closest("tbody")).toHaveClass("custom-body");
  });

  test("debe propagar los atributos HTML nativos adicionales y estados personalizados de selección (...props)", () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-testid="row-selected" data-state="selected" id="row-prime">
            <TableCell colSpan={2}>Celda Expandida</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const row = screen.getByTestId("row-selected");
    const cell = screen.getByText("Celda Expandida");

    // Valida que el TableRow reaccione al estado de selección inyectando la clase hover adaptativa
    expect(row).toHaveAttribute("data-state", "selected");
    expect(row).toHaveAttribute("id", "row-prime");
    expect(row).toHaveClass("data-[state=selected]:bg-gray-200");

    // Valida atributos nativos específicos de celdas HTML
    expect(cell).toHaveAttribute("colSpan", "2");
  });
});