import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi, beforeEach } from "vitest";

// 1. Mock de las dependencias de internacionalización
vi.mock("locales/client", () => ({
  useI18n: () => {
    return (key: string) => {
      const translations: Record<string, string> = {
        "premium.upgrade_to_access_feature": "Mejora tu cuenta para acceder a esta función",
        "premium.premium_feature": "Función Premium",
        "premium.unlock_all_features": "Desbloquea todas las funciones",
        "commons.upgrade_to_premium": "Pasar a Premium",
      };
      return translations[key] || key;
    };
  },
}));

// 2. Mock del hook de suscripción de usuario
const mockUseUserSubscription = vi.hoisted(() => vi.fn());
vi.mock("@/features/ads/hooks/useUserSubscription", () => ({
  useUserSubscription: mockUseUserSubscription,
}));

// 3. Mock de componentes UI simples/estructurales para evitar fallos de importación de shadcn
vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => <div data-testid="skeleton" className={className} />,
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: any) => <div className={className} data-testid="card">{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardTitle: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
  CardDescription: ({ children, className }: any) => <p className={className}>{children}</p>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, className, ...props }: any) => <button className={className} {...props}>{children}</button>,
}));

// 4. Mock de Next.js Link
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, onClick }: any) => (
    <a href={href} onClick={onClick} data-testid="next-link">
      {children}
    </a>
  ),
}));

import { PremiumGate, PremiumBadge, withPremiumGate } from "./premium-gate";

describe("Pruebas Unitarias - PremiumGate", () => {
  beforeEach(() => {
    mockUseUserSubscription.mockReset();
  });

  test("debe mostrar el estado de carga (Skeleton) mientras valida la suscripción", () => {
    mockUseUserSubscription.mockReturnValue({ isPremium: false, isPending: true });

    render(
      <PremiumGate>
        <div data-testid="protected-content">Contenido Secreto</div>
      </PremiumGate>
    );

    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  test("debe renderizar el contenido protegido de forma transparente si el usuario es Premium", () => {
    mockUseUserSubscription.mockReturnValue({ isPremium: true, isPending: false });

    render(
      <PremiumGate>
        <div data-testid="protected-content">Contenido Secreto</div>
      </PremiumGate>
    );

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    expect(screen.getByText("Contenido Secreto")).toBeInTheDocument();
    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
  });

  test("debe renderizar un elemento alternativo (fallback) personalizado si el usuario NO es premium y se proporciona", () => {
    mockUseUserSubscription.mockReturnValue({ isPremium: false, isPending: false });

    render(
      <PremiumGate fallback={<div data-testid="custom-fallback">No tienes acceso</div>}>
        <div data-testid="protected-content">Contenido Secreto</div>
      </PremiumGate>
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    expect(screen.queryByTestId("card")).not.toBeInTheDocument(); // No muestra el prompt estándar
  });

  test("debe mostrar el banner de actualización por defecto si el usuario no es premium y no hay fallback", () => {
    mockUseUserSubscription.mockReturnValue({ isPremium: false, isPending: false });

    render(
      <PremiumGate>
        <div data-testid="protected-content">Contenido Secreto</div>
      </PremiumGate>
    );

    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByText("Función Premium")).toBeInTheDocument();
    expect(screen.getByText("Mejora tu cuenta para acceder a esta función")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  test("debe ejecutar el callback onUpgradePress y simular analíticas al clickear el enlace de suscripción", () => {
    mockUseUserSubscription.mockReturnValue({ isPremium: false, isPending: false });
    const mockUpgradePress = vi.fn();
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(
      <PremiumGate feature="Generador IA" onUpgradePress={mockUpgradePress}>
        <div>Contenido</div>
      </PremiumGate>
    );

    const upgradeLink = screen.getByTestId("next-link");
    fireEvent.click(upgradeLink);

    expect(mockUpgradePress).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Premium gate viewed:", "Generador IA");
    
    consoleSpy.mockRestore();
  });

  test("debe retornar null si el usuario no es premium, showUpgradePrompt es false y no hay fallback", () => {
    mockUseUserSubscription.mockReturnValue({ isPremium: false, isPending: false });

    const { container } = render(
      <PremiumGate showUpgradePrompt={false}>
        <div>Contenido</div>
      </PremiumGate>
    );

    expect(container.firstChild).toBeNull();
  });
});

describe("Pruebas Unitarias - PremiumBadge", () => {
  test("debe renderizar el badge con el tamaño y las clases de gradiente correctas", () => {
    const { rerender } = render(<PremiumBadge size="small" className="extra-class" />);
    
    let badge = screen.getByText("PREMIUM");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("px-2", "py-0.5", "text-xs", "extra-class");

    rerender(<PremiumBadge size="large" />);
    badge = screen.getByText("PREMIUM");
    expect(badge).toHaveClass("px-4", "py-1.5", "text-base");
  });
});

describe("Pruebas Unitarias - HOC withPremiumGate", () => {
  test("debe envolver un componente y restringirlo según el estado de la suscripción", () => {
    mockUseUserSubscription.mockReturnValue({ isPremium: true, isPending: false });
    
    const MyComponent = () => <div data-testid="my-component">Componente Original</div>;
    const GatedComponent = withPremiumGate(MyComponent);

    render(<GatedComponent />);
    expect(screen.getByTestId("my-component")).toBeInTheDocument();
  });
});