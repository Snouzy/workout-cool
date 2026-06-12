import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";

// 1. Mock de lucide-react para los iconos de flechas
vi.mock("lucide-react", () => ({
  ChevronLeft: ({ className }: { className?: string }) => (
    <span data-testid="chevron-left" className={className}>◀</span>
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <span data-testid="chevron-right" className={className}>▶</span>
  ),
}));

// 2. Mock preventivo de buttonVariants por si acaso tu componente UI lo requiere
vi.mock("@/components/ui/button", () => ({
  buttonVariants: () => "mocked-button-variant-class",
}));

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "./pagination";

describe("Pruebas Unitarias - Componente Pagination", () => {

  test("debe renderizar la estructura semántica de navegación correctamente", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="?page=1">1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    // Verifica que el contenedor principal sea un <nav> con el rol y aria-label correctos
    const navElement = screen.getByRole("navigation", { name: /pagination/i });
    expect(navElement).toBeInTheDocument();

    // Verifica que la lista sea un elemento <ul>
    const listElement = screen.getByRole("list");
    expect(listElement).toBeInTheDocument();

    // Verifica que el item de la lista sea un <li>
    const listItemElement = screen.getByRole("listitem");
    expect(listItemElement).toBeInTheDocument();
  });

  test("debe aplicar el atributo aria-current='page' e incluir estilos específicos si el link está activo", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="?page=2" isActive>
              2
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const activeLink = screen.getByRole("link", { name: "2" });
    expect(activeLink).toBeInTheDocument();
    expect(activeLink).toHaveAttribute("aria-current", "page");
    expect(activeLink).toHaveClass("bg-[#F7F7F8]", "text-black");
  });

  test("debe renderizar el botón 'PaginationPrevious' con las etiquetas de accesibilidad e iconos correctos", () => {
    render(<PaginationPrevious href="?page=1" />);

    const prevLink = screen.getByRole("link", { name: /go to previous page/i });
    expect(prevLink).toBeInTheDocument();
    expect(prevLink).toHaveAttribute("href", "?page=1");
    expect(prevLink).toHaveClass("rounded-l-lg");

    const leftChevron = screen.getByTestId("chevron-left");
    expect(leftChevron).toBeInTheDocument();
  });

  test("debe renderizar el botón 'PaginationNext' con las etiquetas de accesibilidad e iconos correctos", () => {
    render(<PaginationNext href="?page=3" />);

    const nextLink = screen.getByRole("link", { name: /go to next page/i });
    expect(nextLink).toBeInTheDocument();
    expect(nextLink).toHaveAttribute("href", "?page=3");
    expect(nextLink).toHaveClass("rounded-r-lg");

    const rightChevron = screen.getByTestId("chevron-right");
    expect(rightChevron).toBeInTheDocument();
  });

  test("debe deshabilitar la interacción y aplicar opacidad en 'PaginationPrevious' y 'PaginationNext' si se pasa la propiedad disabled", () => {
    const { rerender } = render(<PaginationPrevious href="?page=1" disabled />);

    let prevLink = screen.getByRole("link", { name: /go to previous page/i });
    expect(prevLink).toHaveClass("pointer-events-none", "cursor-not-allowed", "opacity-50");

    rerender(<PaginationNext href="?page=3" disabled />);
    
    let nextLink = screen.getByRole("link", { name: /go to next page/i });
    expect(nextLink).toHaveClass("pointer-events-none", "cursor-not-allowed", "opacity-50");
  });

  test("debe concatenar clases personalizadas externas en todos los subcomponentes", () => {
    render(
      <Pagination className="custom-nav">
        <PaginationContent className="custom-ul">
          <PaginationItem className="custom-li">
            <PaginationLink href="#" className="custom-a" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByRole("navigation")).toHaveClass("custom-nav");
    expect(screen.getByRole("list")).toHaveClass("custom-ul");
    expect(screen.getByRole("listitem")).toHaveClass("custom-li");
    expect(screen.getByRole("link")).toHaveClass("custom-a");
  });
});