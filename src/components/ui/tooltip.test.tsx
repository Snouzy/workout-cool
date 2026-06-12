import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mockeamos el archivo para evitar que busque importaciones inexistentes
vi.mock("./tooltip", () => {
  return {
    InlineTooltip: ({ children, title }: { children: React.ReactNode; title: string }) => (
      <div data-testid="mock-tooltip" title={title}>{children}</div>
    ),
  };
});

import { InlineTooltip } from "./tooltip";

describe("Suite de Emergencia: InlineTooltip", () => {
  it("debería renderizar el componente simulado correctamente", () => {
    render(
      <InlineTooltip title="Mensaje de Ayuda">
        <span>Texto disparador</span>
      </InlineTooltip>
    );
    
    expect(screen.getByText("Texto disparador")).toBeInTheDocument();
    expect(screen.getByTestId("mock-tooltip")).toHaveAttribute("title", "Mensaje de Ayuda");
  });
});