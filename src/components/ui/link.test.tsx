import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";

// 1. Mockeamos 'next/link' para que renderice un elemento <a> ordinario
vi.mock("next/link", () => {
  return {
    __esModule: true,
    default: React.forwardRef<HTMLAnchorElement, any>(
      ({ children, className, href, ...props }, ref) => (
        <a ref={ref} className={className} href={href} {...props}>
          {children}
        </a>
      )
    ),
  };
});

// 2. Importamos tu componente Link
import { Link } from "./link";

describe("Pruebas Unitarias - Componente Link", () => {

  test("debe renderizar el texto del enlace y el atributo href correctamente", () => {
    render(<Link href="/dashboard">Ir al Dashboard</Link>);

    const linkElement = screen.getByRole("link", { name: "Ir al Dashboard" });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/dashboard");
  });

  test("debe aplicar las clases por defecto (variant='default' y size='base')", () => {
    render(<Link href="/home">Inicio</Link>);

    const linkElement = screen.getByRole("link", { name: "Inicio" });
    // Variantes por defecto
    expect(linkElement).toHaveClass("link", "text-base-content", "text-base");
  });

  test("debe aplicar correctamente las diferentes variantes de diseño", () => {
    const { rerender } = render(<Link href="/nav" variant="nav">Nav Link</Link>);
    let linkElement = screen.getByRole("link", { name: "Nav Link" });
    expect(linkElement).toHaveClass("text-base-content/80");

    rerender(<Link href="/footer" variant="footer">Footer Link</Link>);
    linkElement = screen.getByRole("link", { name: "Footer Link" });
    expect(linkElement).toHaveClass("text-base-content/70");

    rerender(<Link href="/btn" variant="button">Button Link</Link>);
    linkElement = screen.getByRole("link", { name: "Button Link" });
    expect(linkElement).toHaveClass("btn", "btn-link", "no-underline");
  });

  test("debe aplicar correctamente los diferentes tamaños", () => {
    const { rerender } = render(<Link href="/sm" size="sm">Small</Link>);
    let linkElement = screen.getByRole("link", { name: "Small" });
    expect(linkElement).toHaveClass("text-sm");

    rerender(<Link href="/lg" size="lg">Large</Link>);
    linkElement = screen.getByRole("link", { name: "Large" });
    expect(linkElement).toHaveClass("text-lg");
  });

  test("debe concatenar clases personalizadas externas usando cn", () => {
    render(<Link href="/custom" className="font-bold my-custom-class">Custom</Link>);

    const linkElement = screen.getByRole("link", { name: "Custom" });
    expect(linkElement).toHaveClass("link", "text-base", "font-bold", "my-custom-class");
  });

  test("debe reenviar la referencia (ref) correctamente al elemento ancla", () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(<Link href="/ref" ref={ref}>Ref Link</Link>);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("A");
    expect(ref.current).toHaveAttribute("href", "/ref");
  });
});