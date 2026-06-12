import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, useZodForm, useFormField } from "./form";

// Mockeamos la internacionalización de clientes
vi.mock("locales/client", () => ({
  useI18n: () => (key: string) => `[Translated: ${key}]`,
}));

// Mockeamos el subcomponente Label local si es que cuenta con un wrapper primitivo pesado
vi.mock("./label", () => ({
  Label: React.forwardRef<HTMLLabelElement, React.ComponentPropsWithoutRef<"label">>(
    ({ children, ...props }, ref) => <label ref={ref} {...props}>{children}</label>
  ),
}));

// Esquema de validación básico para testear flujos de error y envío exitoso
const testSchema = z.object({
  username: z.string().min(3, "errors.username_short"),
});

const TestFormWrapper = ({ onSubmitMock }: { onSubmitMock: any }) => {
  const form = useZodForm({
    schema: testSchema,
    defaultValues: { username: "" },
  });

  return (
    <Form form={form} onSubmit={onSubmitMock} data-testid="form-root">
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem data-testid="form-item-wrapper">
            <FormLabel>Nombre de Usuario</FormLabel>
            <FormControl>
              <input data-testid="username-input" {...field} />
            </FormControl>
            <FormDescription>Ingresa tu alias único.</FormDescription>
            <FormMessage data-testid="form-message" />
          </FormItem>
        )}
      />
      <button type="submit">Enviar</button>
    </Form>
  );
};

describe("Pruebas Unitarias e Integración - Componente Form", () => {
  test("debe renderizar la estructura inicial del formulario con sus atributos de accesibilidad", () => {
    render(<TestFormWrapper onSubmitMock={vi.fn()} />);

    expect(screen.getByTestId("form-root")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre de Usuario")).toBeInTheDocument();
    expect(screen.getByText("Ingresa tu alias único.")).toBeInTheDocument();
    
    const input = screen.getByTestId("username-input");
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  test("debe procesar exitosamente el callback de onSubmit al cumplir con las reglas del esquema Zod", async () => {
    const mockSubmit = vi.fn();
    render(<TestFormWrapper onSubmitMock={mockSubmit} />);

    const input = screen.getByTestId("username-input");
    fireEvent.change(input, { target: { value: "JeremyCool" } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1);
      expect(mockSubmit).toHaveBeenCalledWith(
        { username: "JeremyCool" },
        expect.anything()
      );
    });
  });

  test("debe renderizar y traducir los mensajes de error cuando falla la validación del esquema", async () => {
    render(<TestFormWrapper onSubmitMock={vi.fn()} />);

    // Intentamos enviar vacío para detonar la regla de Zod (mínimo 3 caracteres)
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    // El error asigne los atributos aria-invalid al input y monta el FormMessage
    const errorMsg = await screen.findByText("[Translated: errors.username_short]");
    expect(errorMsg).toBeInTheDocument();

    const input = screen.getByTestId("username-input");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  test("debe deshabilitar el fieldset contenedor cuando la prop disabled es enviada como verdadera", () => {
    const DummyForm = () => {
      const form = useZodForm({ schema: testSchema, defaultValues: { username: "" } });
      return (
        <Form form={form} onSubmit={vi.fn()} disabled={true}>
          <input data-testid="inner-input" />
        </Form>
      );
    };

    render(<DummyForm />);
    const fieldset = screen.getByTestId("inner-input").closest("fieldset");
    expect(fieldset).toBeDisabled();
  });

  test("debe lanzar un error explícito de protección si useFormField es consumido fuera de un FormField", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Componente de prueba que invoca al hook de forma aislada, pero sin el contexto de <FormField>
    const FaultyComponent = () => {
      useFormField();
      return null;
    };

    // Al renderizarlo directamente dentro de un FormProvider genérico para que no falle useFormContext,
    // pero rompiendo la jerarquía de FormField, forzamos la aserción de seguridad controlada.
    const Wrapper = () => {
      const form = useZodForm({ schema: testSchema, defaultValues: { username: "" } });
      return (
        <Form form={form} onSubmit={vi.fn()}>
          <FaultyComponent />
        </Form>
      );
    };

    expect(() => render(<Wrapper />)).toThrowError(
      "useFormField should be used within <FormField>"
    );

    consoleSpy.mockRestore();
  });
});