import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect } from "vitest";

import { Skeleton } from "./skeleton";

describe("Pruebas Unitarias - Componente Skeleton", () => {

  test("debe renderizar con los estilos y clases estructurales por defecto", () => {
    const { container } = render(<Skeleton data-testid="skeleton-element" />);
    
    const skeleton = screen.getByTestId("skeleton-element");
    
    expect(skeleton).toBeInTheDocument();
    // Verifica las clases de animación base y el redondeado por defecto ("rounded")
    expect(skeleton).toHaveClass("animate-pulse", "bg-gray-200", "dark:bg-gray-700", "rounded");
    
    // Al no pasar width ni height por props, el estilo inline debe estar vacío por defecto
    expect(skeleton.style.width).toBe("");
    expect(skeleton.style.height).toBe("");
  });

  test("debe aplicar correctamente los estilos dinámicos de ancho (width) y alto (height)", () => {
    render(
      <Skeleton 
        data-testid="skeleton-custom-size" 
        width="200px" 
        height="50px" 
      />
    );
    
    const skeleton = screen.getByTestId("skeleton-custom-size");
    
    // Verifica que se inyecten los estilos inline correspondientes en el DOM virtual
    expect(skeleton.style.width).toBe("200px");
    expect(skeleton.style.height).toBe("50px");
  });

  test("debe aceptar valores numéricos para width y height e inyectarlos de forma correcta", () => {
    render(
      <Skeleton 
        data-testid="skeleton-numeric-size" 
        width={100} 
        height={40} 
      />
    );
    
    const skeleton = screen.getByTestId("skeleton-numeric-size");
    
    // React convierte automáticamente los valores numéricos simples de style a píxeles ("100px")
    expect(skeleton.style.width).toBe("100px");
    expect(skeleton.style.height).toBe("40px");
  });

  test("debe permitir modificar la propiedad estructural de bordes redondeados (rounded)", () => {
    render(<Skeleton data-testid="skeleton-full-round" rounded="rounded-full" />);
    
    const skeleton = screen.getByTestId("skeleton-full-round");
    
    // Verifica que no tenga la clase 'rounded' estándar y use 'rounded-full' en su lugar
    expect(skeleton).toHaveClass("rounded-full");
    expect(skeleton).not.toHaveClass("rounded-sm");
  });

  test("debe concatenar clases CSS externas personalizadas mediante la función cn", () => {
    render(<Skeleton data-testid="skeleton-classes" className="mb-4 representation-card" />);
    
    const skeleton = screen.getByTestId("skeleton-classes");
    
    expect(skeleton).toHaveClass("animate-pulse", "mb-4", "representation-card");
  });

  test("debe propagar atributos HTML nativos adicionales y combinar estilos inline custom (...props)", () => {
    render(
      <Skeleton 
        data-testid="skeleton-props" 
        id="global-loading-skeleton"
        style={{ opacity: 0.5, marginTop: "10px", width: "100%" }}
      />
    );
    
    const skeleton = screen.getByTestId("skeleton-props");
    
    expect(skeleton).toHaveAttribute("id", "global-loading-skeleton");
    expect(skeleton.style.width).toBe("100%");
    expect(skeleton.style.opacity).toBe("0.5");
    expect(skeleton.style.marginTop).toBe("10px");
  });
});