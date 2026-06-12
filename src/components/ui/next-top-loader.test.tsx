import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import * as NProgress from "nprogress";

// 1. Mockeamos por completo la librería externa nprogress
vi.mock("nprogress", () => ({
  configure: vi.fn(),
  start: vi.fn(),
  done: vi.fn(),
}));

import { NextTopLoader } from "./next-top-loader";

describe("Pruebas Unitarias - Componente NextTopLoader", () => {
  let originalLocation: string;
  let originalPushState: typeof window.history.pushState;

  beforeEach(() => {
    vi.useFakeTimers(); // Usamos temporizadores simulados para controlar los setTimeout del componente
    originalLocation = window.location.href;
    originalPushState = window.history.pushState;

    // Reseteamos el estado de los mocks de NProgress antes de cada test
    vi.mocked(NProgress.configure).mockReset();
    vi.mocked(NProgress.start).mockReset();
    vi.mocked(NProgress.done).mockReset();

    // Mock básico de window.location.href mutable si fuese necesario
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "http://localhost/" },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    window.history.pushState = originalPushState;
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: originalLocation },
    });
  });

  test("debe configurar NProgress con los valores por defecto al renderizar", () => {
    render(<NextTopLoader />);

    expect(NProgress.configure).toHaveBeenCalledWith({
      showSpinner: true,
      trickle: true,
      trickleSpeed: 200,
      minimum: 0.08,
      easing: "ease",
      speed: 200,
    });
  });

  test("debe configurar NProgress con propiedades personalizadas pasadas por props", () => {
    render(
      <NextTopLoader
        showSpinner={false}
        crawl={false}
        crawlSpeed={500}
        initialPosition={0.2}
        easing="linear"
        speed={400}
      />
    );

    expect(NProgress.configure).toHaveBeenCalledWith({
      showSpinner: false,
      trickle: false,
      trickleSpeed: 500,
      minimum: 0.2,
      easing: "linear",
      speed: 400,
    });
  });

  test("debe inyectar la etiqueta <style> con las variables CSS correctas de color y altura", () => {
    const { container } = render(<NextTopLoader color="#FF0000" height={5} />);
    
    const styleElement = container.querySelector("style");
    expect(styleElement).toBeInTheDocument();
    
    const styleContent = styleElement?.innerHTML;
    expect(styleContent).toContain("background:#FF0000");
    expect(styleContent).toContain("height:5px");
  });

  test("debe disparar NProgress rápido (start y done) al clickear un enlace externo o ancla de la misma URL", () => {
    render(<NextTopLoader delay={0} />);

    // Creamos un enlace de ancla simulado dentro del mismo path
    const anchor = document.createElement("a");
    anchor.href = "http://localhost/#seccion-contacto";
    document.body.appendChild(anchor);

    fireEvent.click(anchor);

    expect(NProgress.start).toHaveBeenCalled();
    expect(NProgress.done).toHaveBeenCalled();

    document.body.removeChild
    });
});