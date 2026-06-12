import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Typography } from "./typography"; // Ajusta la ruta de importación según tu estructura

describe("Componente Typography (Polimórfico)", () => {
  it("debería renderizar la variante 'base' por defecto usando una etiqueta de párrafo <p>", () => {
    const { container } = render(
      <Typography>Texto por defecto</Typography>
    );

    const element = screen.getByText("Texto por defecto");
    
    expect(element).toBeInTheDocument();
    // Validamos que el tag HTML subyacente sea un párrafo
    expect(element.tagName.toLowerCase()).toBe("p");
  });

  it("debería mapear correctamente las variantes a sus respectivas etiquetas HTML por defecto", () => {
    // 1. Validamos variante h1 -> etiqueta <h1> y sus clases de CVA
    const { rerender } = render(
      <Typography variant="h1">Encabezado 1</Typography>
    );
    let element = screen.getByText("Encabezado 1");
    expect(element.tagName.toLowerCase()).toBe("h1");
    expect(element.className).toContain("font-caption");
    expect(element.className).toContain("text-4xl");

    // 2. Validamos variante quote -> etiqueta <blockquote|p> según tu mapping
    rerender(<Typography variant="quote">Cita textual</Typography>);
    element = screen.getByText("Cita textual");
    expect(element.className).toContain("citation");

    // 3. Validamos variante link -> etiqueta <a>
    rerender(<Typography variant="link">Haz click aquí</Typography>);
    element = screen.getByText("Haz click aquí");
    expect(element.tagName.toLowerCase()).toBe("a");
    expect(element.className).toContain("text-primary");
  });

  it("debería respetar la propiedad 'as' cuando se fuerza un cambio de elemento (Polimorfismo)", () => {
    // Forzamos que una variante 'h1' se renderice estructuralmente como un 'span'
    render(
      <Typography variant="h1" as="span">
        H1 encubierto en un span
      </Typography>
    );

    const element = screen.getByText("H1 encubierto en un span");
    
    // El elemento debe ser un SPAN, pero conservando los estilos estéticos de un H1
    expect(element.tagName.toLowerCase()).toBe("span");
    expect(element.className).toContain("text-4xl");
  });

  it("debería transferir propiedades HTML nativas adicionales de forma segura (...restProps)", () => {
    // Pasamos un atributo nativo como 'href' e 'id' para comprobar que se propagan al DOM
    render(
      <Typography variant="link" href="https://google.com" id="mi-link-test">
        Ir a Google
      </Typography>
    );

    const element = screen.getByText("Ir a Google") as HTMLAnchorElement;
    
    expect(element).toBeInTheDocument();
    expect(element.getAttribute("href")).toBe("https://google.com");
    expect(element.getAttribute("id")).toBe("mi-link-test");
  });

  it("debería combinar clases personalizadas inyectadas mediante la prop 'className'", () => {
    render(
      <Typography variant="muted" className="text-red-500 font-bold">
        Texto Muted Rojo
      </Typography>
    );

    const element = screen.getByText("Texto Muted Rojo");
    
    // Verificamos que conserve las clases de la variante que no entran en conflicto (como el tamaño)
    expect(element.className).toContain("text-sm");
    
    // Verificamos que las clases personalizadas inyectadas hayan pisado con éxito al color original
    expect(element.className).toContain("text-red-500");
    expect(element.className).toContain("font-bold");
    
    // El color original "text-muted-foreground" fue removido correctamente por tu función cn() debido al conflicto
    expect(element.className).not.toContain("text-muted-foreground");
  });
});