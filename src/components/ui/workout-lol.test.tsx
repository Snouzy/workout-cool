import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { WorkoutLol, WorkoutLolMuted } from "./workout-lol"; // Ajusta la ruta si es necesario

describe("Componente WorkoutLol", () => {
  it("debería renderizar con el texto 'workout.lol' por defecto si no se pasan hijos", () => {
    render(<WorkoutLol />);
    
    const element = screen.getByText("workout.lol");
    expect(element).toBeInTheDocument();
    
    // Validamos que se apliquen las clases base y la variante 'default' (colores rojos)
    expect(element.className).toContain("inline-flex");
    expect(element.className).toContain("bg-red-50");
    expect(element.className).toContain("text-red-600");
  });

  it("debería renderizar el contenido personalizado pasado en la prop children", () => {
    render(<WorkoutLol>Mi texto personalizado</WorkoutLol>); 
    
    // Validamos que el texto alternativo por defecto YA NO esté
    expect(screen.queryByText("workout.lol")).not.toBeInTheDocument();
    
    // Validamos que esté el hijo personalizado
    expect(screen.getByText("Mi texto personalizado")).toBeInTheDocument();
  });

  it("debería aplicar las clases correctas cuando se usa la variante 'muted'", () => {
    render(<WorkoutLol variant="muted">Badge Muted</WorkoutLol>);
    
    const element = screen.getByText("Badge Muted");
    
    // Validamos que use los colores grises/pizarra (slate) en vez de los rojos
    expect(element.className).toContain("bg-slate-100");
    expect(element.className).toContain("text-slate-600");
    expect(element.className).not.toContain("bg-red-50");
  });

  it("debería combinar clases adicionales inyectadas a través de 'className'", () => {
    render(<WorkoutLol className="mt-4 shadow-md">Clase Extra</WorkoutLol>);
    
    const element = screen.getByText("Clase Extra");
    
    expect(element.className).toContain("bg-red-50"); // Variante por defecto
    expect(element.className).toContain("mt-4");     // Inyectada por prop
    expect(element.className).toContain("shadow-md"); // Inyectada por prop
  });
});

describe("Componente WorkoutLolMuted", () => {
  it("debería comportarse como un WorkoutLol preconfigurado con la variante 'muted'", () => {
    render(<WorkoutLolMuted>Texto Amortiguado</WorkoutLolMuted>);
    
    const element = screen.getByText("Texto Amortiguado");
    
    expect(element).toBeInTheDocument();
    // Verificamos que contenga los estilos slate debido a que WorkoutLolMuted fuerza variant="muted"
    expect(element.className).toContain("bg-slate-100");
    expect(element.className).toContain("text-slate-600");
  });
});