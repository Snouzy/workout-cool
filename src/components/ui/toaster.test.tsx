import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Toaster } from './toaster'; // Ajusta la ruta relativa según corresponda

// 1. Guardamos una variable de referencia para poder cambiar los toasts simulados en cada test
let mockToasts: any[] = [];

// 2. Mockeamos de forma dinámica el hook useToast antes de que sea importado por el componente
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toasts: mockToasts,
  }),
}));

describe('Componente Toaster', () => {
  it('no debería renderizar nada si la lista de toasts está vacía', () => {
    mockToasts = []; // Simulamos que no hay notificaciones activas

    const { container } = render(<Toaster />);
    
    // Verificamos que el contenedor no inyecte elementos hijo inesperados
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('debería renderizar correctamente múltiples toasts con sus títulos y descripciones', async () => {
    // Simulamos dos toasts activos en el estado del hook
    mockToasts = [
      {
        id: 'toast-1',
        title: 'Primer Toast',
        description: <span data-testid="desc-1">Descripción Uno</span>,
        open: true,
      },
      {
        id: 'toast-2',
        title: 'Segundo Toast',
        description: <span data-testid="desc-2">Descripción Dos</span>,
        open: true,
      }
    ];

    render(<Toaster />);

    // Al usar Radix Toast, esperamos asíncronamente que se inyecten a través del Viewport
    expect(await screen.findByText('Primer Toast')).toBeInTheDocument();
    expect(screen.getByTestId('desc-1')).toBeInTheDocument();
    
    expect(screen.getByText('Segundo Toast')).toBeInTheDocument();
    expect(screen.getByTestId('desc-2')).toBeInTheDocument();
  });

  it('debería aplicar clases condicionales y padding cero cuando viene una propiedad "image"', async () => {
    mockToasts = [
      {
        id: 'toast-image',
        title: 'Toast con Imagen',
        image: <div data-testid="mock-image">Imagen Dummy</div>,
        open: true,
        className: 'mi-clase-personalizada'
      }
    ];

    render(<Toaster />);

    // Buscamos el nodo raíz del Toast que contiene la clase personalizada
    // Nota: Radix asigna por defecto el rol 'status' o 'log' a sus raíces de Toast
    const toastRoot = await screen.findByText('Toast con Imagen');
    
    // Subimos en el árbol hasta encontrar el elemento contenedor del Toast mapeado
    const toastContainer = toastRoot.closest('.mi-clase-personalizada');
    
    expect(toastContainer).toBeInTheDocument();
    // Validamos que se aplique la clase condicional 'p-0' debido a que "!!image" es true
    expect(toastContainer?.className).toContain('p-0');
    expect(screen.getByTestId('mock-image')).toBeInTheDocument();
  });

  it('debería renderizar los elementos opcionales: icon, action y close', async () => {
    mockToasts = [
      {
        id: 'toast-opcionales',
        title: 'Componentes Extra',
        icon: <span data-testid="mock-icon">😎</span>,
        action: <button data-testid="mock-action">Deshacer</button>,
        close: <button data-testid="mock-close">X</button>,
        open: true,
      }
    ];

    render(<Toaster />);

    expect(await screen.findByText('Componentes Extra')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByTestId('mock-action')).toBeInTheDocument();
    expect(screen.getByTestId('mock-close')).toBeInTheDocument();
  });
});