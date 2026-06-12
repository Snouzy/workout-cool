import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";

// Mock de lucide-react para inspeccionar las clases aplicadas al icono Star
vi.mock("lucide-react", () => ({
  Star: ({ className }: { className: string }) => (
    <span data-testid="star-icon" className={className} />
  ),
}));

import { StarButton } from "./star-button";

describe("Pruebas Unitarias - Componente StarButton", () => {

  test("debe renderizar el botón con sus hijos y el icono en estado inactivo", () => {
    render(
      <StarButton isActive={false} isLoading={false}>
        Favorito
      </StarButton>
    );

    const button = screen.getByRole("button", { name: /favorito/i });
    const icon = screen.getByTestId("star-icon");

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass("text-yellow-500", "btn", "btn-neutral");
    
    // Verificamos que al estar inactivo tenga la clase 'fill-none' y no parpadee
    expect(icon).toHaveClass("fill-none");
    expect(icon).not.toHaveClass("fill-current", "animate-pulse");
  });

  test("debe aplicar la clase de relleno correcto cuando isActive es true", () => {
    render(<StarButton isActive={true} isLoading={false} />);

    const icon = screen.getByTestId("star-icon");
    
    // Al estar activo, el icono debe llenarse con el color de texto actual
    expect(icon).toHaveClass("fill-current");
    expect(icon).not.toHaveClass("fill-none");
  });

  test("debe deshabilitar el botón y aplicar animación pulsante al icono cuando isLoading es true", () => {
    const handleClick = vi.fn();
    render(<StarButton isActive={false} isLoading={true} onClick={handleClick} />);

    const button = screen.getByRole("button");
    const icon = screen.getByTestId("star-icon");

    // Validamos el estado bloqueado
    expect(button).toBeDisabled();
    expect(icon).toHaveClass("animate-pulse");

    // Intentamos hacer clic para asegurar que no propague eventos
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test("debe disparar la función onClick de forma correcta al interactuar con el botón activo", () => {
    const handleClick = vi.fn();
    render(<StarButton isActive={false} isLoading={false} onClick={handleClick}>Click Me</StarButton>);

    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("debe fusionar limpiamente clases CSS externas mediante la utilidad cn", () => {
    render(<StarButton isActive={false} isLoading={false} className="extra-class-glowing m-4" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-yellow-500", "extra-class-glowing", "m-4");
  });
});