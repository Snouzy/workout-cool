import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";

import { Textarea } from "./textarea";

describe("Pruebas Unitarias - Componente Textarea", () => {

  test("debe renderizar el elemento textarea en el DOM correctamente", () => {
    render(<Textarea data-testid="textarea-base" placeholder="Escribe aquí..." />);
    
    const textarea = screen.getByTestId("textarea-base");
    
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveAttribute("placeholder", "Escribe aquí...");
  });

  test("debe permitir la entrada de texto de forma interactiva y disparar el evento onChange", () => {
    const handleChange = vi.fn();
    render(<Textarea data-testid="textarea-typing" onChange={handleChange} />);
    
    const textarea = screen.getByTestId("textarea-typing");
    
    // Simulamos la escritura del usuario
    fireEvent.change(textarea, { target: { value: "Hola mundo, esto es una prueba" } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect((textarea as HTMLTextAreaElement).value).toBe("Hola mundo, esto es una prueba");
  });

  test("debe aplicar los atributos de bloqueo e inhabilitar interacciones cuando disabled es true", () => {
    render(<Textarea data-testid="textarea-disabled" disabled />);
    
    const textarea = screen.getByTestId("textarea-disabled");
    
    expect(textarea).toBeDisabled();
    // Verifica que existan las clases condicionales de Tailwind para estados deshabilitados
    expect(textarea).toHaveClass("disabled:cursor-not-allowed", "disabled:opacity-50");
  });

  test("debe concatenar clases CSS externas personalizadas usando la utilidad cn", () => {
    render(<Textarea data-testid="textarea-cn" className="resize-none border-red-500 p-8" />);
    
    const textarea = screen.getByTestId("textarea-cn");
    
    // Verifica que mantenga sus estilos base estructurales y adicione las clases pasadas por prop
    expect(textarea).toHaveClass("min-h-24", "w-full", "resize-none", "border-red-500", "p-8");
  });

  test("debe reenviar la referencia (ref) correctamente al elemento textarea nativo", () => {
    const textareaRef = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={textareaRef} />);
    
    expect(textareaRef.current).not.toBeNull();
    expect(textareaRef.current?.tagName).toBe("TEXTAREA");
  });

  test("debe propagar atributos HTML nativos adicionales del elemento (...props)", () => {
    render(
      <Textarea 
        maxLength={100} 
        rows={4} 
        id="custom-textarea-id" 
        readOnly 
      />
    );
    
    const textarea = screen.getByRole("textbox");
    
    expect(textarea).toHaveAttribute("maxlength", "100");
    expect(textarea).toHaveAttribute("rows", "4");
    expect(textarea).toHaveAttribute("id", "custom-textarea-id");
    expect(textarea).toHaveAttribute("readonly");
  });
});