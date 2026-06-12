import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";

// Mock obligatorio para primitivas estructurales de Radix UI en entornos JSDOM
beforeEach(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

import { Switch, SwitchOutline } from "./switch";

describe("Pruebas Unitarias - Componentes Switch y SwitchOutline", () => {

  describe("Componente <Switch /> (Variantes CVA)", () => {
    
    test("debe renderizar con el estado estructural y clases por defecto", () => {
      render(<Switch data-testid="switch-base" />);
      
      const switchRoot = screen.getByTestId("switch-base");
      expect(switchRoot).toBeInTheDocument();
      // Verifica que posea las clases CVA por defecto (h-4 w-7 rounded-full)
      expect(switchRoot).toHaveClass("inline-flex", "h-4", "w-7", "rounded-full");
      expect(switchRoot).toHaveAttribute("data-state", "unchecked");
    });

    test("debe disparar la función onCheckedChange al hacer clic para alternar el estado", () => {
      const handleCheckedChange = vi.fn();
      render(<Switch data-testid="switch-toggle" onCheckedChange={handleCheckedChange} />);
      
      const switchRoot = screen.getByTestId("switch-toggle");
      
      // Simular cambio a activo
      fireEvent.click(switchRoot);
      expect(handleCheckedChange).toHaveBeenCalledTimes(1);
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });

    test("debe respetar la propiedad disabled bloqueando las interacciones físicas", () => {
      const handleCheckedChange = vi.fn();
      render(<Switch data-testid="switch-disabled" disabled onCheckedChange={handleCheckedChange} />);
      
      const switchRoot = screen.getByTestId("switch-disabled");
      expect(switchRoot).toBeDisabled();
      expect(switchRoot).toHaveClass("disabled:cursor-not-allowed", "disabled:opacity-50");
      
      fireEvent.click(switchRoot);
      expect(handleCheckedChange).not.toHaveBeenCalled();
    });

    test("debe aplicar correctamente las clases de la variante de tamaño 'large' y el color 'success'", () => {
      render(<Switch data-testid="switch-variant" variant="large" color="success" />);
      
      const switchRoot = screen.getByTestId("switch-variant");
      // Verifica la mutación de tamaño (h-6 w-12) y el color CVA (data-[state=checked]:bg-success)
      expect(switchRoot).toHaveClass("h-6", "w-12", "data-[state=checked]:bg-success");
    });

    test("debe permitir fusionar clases externas mediante la función cn", () => {
      render(<Switch data-testid="switch-cn" className="custom-switch-margin shadow-md" />);
      
      const switchRoot = screen.getByTestId("switch-cn");
      expect(switchRoot).toHaveClass("custom-switch-margin", "shadow-md", "peer");
    });
  });

  describe("Componente <SwitchOutline />", () => {

    test("debe renderizar con sus dimensiones de borde y estilos estáticos", () => {
      render(<SwitchOutline data-testid="switch-outline" />);
      
      const switchOutlineRoot = screen.getByTestId("switch-outline");
      expect(switchOutlineRoot).toBeInTheDocument();
      // Verifica las clases nativas fijas de SwitchOutline (h-7 w-[50px] border-gray-300)
      expect(switchOutlineRoot).toHaveClass("h-7", "w-[50px]", "border", "border-gray-300");
    });

    test("debe propagar interacciones de estado y cambiar el atributo data-state", () => {
      const handleCheckedChange = vi.fn();
      render(<SwitchOutline data-testid="switch-outline-click" onCheckedChange={handleCheckedChange} />);
      
      const switchOutlineRoot = screen.getByTestId("switch-outline-click");
      
      fireEvent.click(switchOutlineRoot);
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });

    test("debe inyectar clases de personalización externas en el contenedor raíz", () => {
      render(<SwitchOutline data-testid="switch-outline-cn" className="border-red-500 opacity-90" />);
      
      const switchOutlineRoot = screen.getByTestId("switch-outline-cn");
      expect(switchOutlineRoot).toHaveClass("border-red-500", "opacity-90", "inline-flex");
    });
  });
});