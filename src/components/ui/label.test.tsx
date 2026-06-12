import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";

// 1. Mockeamos @radix-ui/react-label para que devuelva una etiqueta <label> nativa de HTML
vi.mock("@radix-ui/react-label", () => {
  return {
    Root: React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
      ({ children, className, ...props }, ref) => (
        <label ref={ref} className={className} {...props}>
          {children}
        </label>
      )
    ),
  };
});

// 2. Importamos tu componente Label original
import { Label } from "./label";

describe("Pruebas Unitarias - Componente Label", () => {
  
  test("debe renderizar el texto del label correctamente", () => {
    render(<Label>Nombre de usuario</Label>);
    
    const labelElement = screen.getByText("Nombre de usuario");
    expect(labelElement).toBeInTheDocument();
    expect(labelElement.tagName).toBe("LABEL");
  });

  test("debe aplicar las clases base predeterminadas de cva", () => {
    render(<Label>Clases Base</Label>);
    
    const labelElement = screen.getByText("Clases Base");
    // Verificamos que tenga las clases que definiste en labelVariants
    expect(labelElement).toHaveClass("text-sm", "font-medium", "leading-none");
  });

  test("debe concatenar clases personalizadas pasadas por propiedad", () => {
    render(<Label className="text-red-500 custom-class">Label Rojo</Label>);
    
    const labelElement = screen.getByText("Label Rojo");
    // Verifica que mantenga las originales y sume las nuevas gracias a cn()
    expect(labelElement).toHaveClass("text-sm", "text-red-500", "custom-class");
  });

  test("debe reenviar atributos HTML estándar (como htmlFor)", () => {
    render(<Label htmlFor="input-id">Etiqueta de Input</Label>);
    
    const labelElement = screen.getByText("Etiqueta de Input");
    expect(labelElement).toHaveAttribute("for", "input-id");
  });

  test("debe mantener la referencia (ref) correctamente", () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Label con Ref</Label>);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("LABEL");
    expect(ref.current?.textContent).toBe("Label con Ref");
  });
});