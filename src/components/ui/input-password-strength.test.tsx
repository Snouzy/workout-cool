import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";
import { InputPasswordStrength } from "./input-password-strength";

// Mock del componente de entrada base para aislar estilos o capas complejas
vi.mock("@/components/ui/input", () => ({
  Input: React.forwardRef<HTMLInputElement, any>(({ onChange, value, ...props }, ref) => (
    <input ref={ref} onChange={onChange} value={value} {...props} />
  )),
}));

describe("Pruebas Unitarias - InputPasswordStrength", () => {
  test("debe renderizar el estado inicial vacío correctamente", () => {
    render(<InputPasswordStrength value="" onChange={vi.fn()} />);

    // Comprobamos el texto informativo base
    expect(screen.getByText("Enter a password. Must contain:")).toBeInTheDocument();

    // Verificamos la barra de progreso en 0
    const progressBar = screen.getByRole("progressbar", { name: "Password strength" });
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute("aria-valuenow", "0");

    // CORREGIDO: Usamos expresiones regulares para evitar que el renderizado por segmentos rompa la coincidencia exacta
    const srOunces = screen.getAllByText(/Requirement not met/i);
    expect(srOunces).toHaveLength(4);
  });

  test("debe actualizar la puntuación y el indicador visual con una contraseña débil", () => {
    // Cumple solo con "At least 1 number" (score = 1)
    render(<InputPasswordStrength value="123" onChange={vi.fn()} />);

    expect(screen.getByText("Weak password. Must contain:")).toBeInTheDocument();

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "1");

    const input = screen.getByPlaceholderText("Password");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  test("debe alcanzar el estado máximo (fuerte) si cumple todas las expresiones regulares", () => {
    // Cumple los 4 requisitos de contraseña segura
    render(<InputPasswordStrength value="Password123!" onChange={vi.fn()} />);

    expect(screen.getByText("Strong password. Must contain:")).toBeInTheDocument();

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "4");

    const progressLine = progressBar.firstChild as HTMLElement;
    expect(progressLine).toHaveClass("bg-emerald-500");
    expect(progressLine.style.width).toBe("100%");

    const input = screen.getByPlaceholderText("Password");
    expect(input).toHaveAttribute("aria-invalid", "false");

    // CORREGIDO: Ajustado a expresión regular para tolerar la segmentación de nodos de texto de React
    const successLabels = screen.getAllByText(/Requirement met/i);
    expect(successLabels).toHaveLength(4);
  });

  test("debe disparar el callback onChange al escribir en el input", () => {
    const handleChange = vi.fn();
    render(<InputPasswordStrength value="" onChange={handleChange} />);

    const input = screen.getByPlaceholderText("Password");
    fireEvent.change(input, { target: { value: "A" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});