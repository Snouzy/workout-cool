import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';
import { BentoGrid, BentoGridItem } from './Bento';

// Simulamos el componente Typography para que el test unitario dependa puramente de Bento
vi.mock('./typography', () => ({
  Typography: ({ children, variant }: { children: React.ReactNode; variant: string }) => (
    <span data-testid={`typography-${variant}`}>{children}</span>
  ),
}));

describe('Pruebas Unitarias - Componentes Bento (Grid e Item)', () => {

  describe('BentoGrid', () => {
    test('debe renderizar el contenedor del grid con sus hijos', () => {
      const { container } = render(
        <BentoGrid>
          <div data-testid="hijo-1">Tarjeta 1</div>
          <div data-testid="hijo-2">Tarjeta 2</div>
        </BentoGrid>
      );

      // Capturamos el nodo HTML raíz generado por el componente BentoGrid
      const grid = container.firstChild;
      expect(grid).toBeInTheDocument();
      expect(screen.getByTestId('hijo-1')).toBeInTheDocument();
      expect(screen.getByTestId('hijo-2')).toBeInTheDocument();
      
      // Validamos las clases de diseño estructurales
      expect(grid).toHaveClass('grid', 'md:grid-cols-3');
    });

    test('debe permitir concatenar clases adicionales mediante la prop className', () => {
      const { container } = render(<BentoGrid className="extra-class-grid" />);
      
      const grid = container.firstChild;
      expect(grid).toHaveClass('mx-auto', 'grid', 'extra-class-grid');
    });
  });

  describe('BentoGridItem', () => {
    test('debe renderizar correctamente todos los elementos del item (header, icon, title, description)', () => {
      render(
        <BentoGridItem
          header={<div data-testid="item-header">Header Visual</div>}
          icon={<span data-testid="item-icon">🚀</span>}
          title="Título Bento"
          description="Descripción detallada de la tarjeta"
        />
      );

      // Verificar que los nodos inyectados existan
      expect(screen.getByTestId('item-header')).toBeInTheDocument();
      expect(screen.getByTestId('item-icon')).toBeInTheDocument();

      // Verificar los textos procesados a través del simulador de Typography
      const titleElement = screen.getByTestId('typography-large');
      const descElement = screen.getByTestId('typography-muted');

      expect(titleElement).toHaveTextContent('Título Bento');
      expect(descElement).toHaveTextContent('Descripción detallada de la tarjeta');
    });

    test('debe renderizar e interactuar correctamente si el título o la descripción son elementos JSX complejos', () => {
      render(
        <BentoGridItem
          title={<strong data-testid="custom-title">Título custom</strong>}
          description={<em data-testid="custom-desc">Desc custom</em>}
        />
      );

      expect(screen.getByTestId('custom-title')).toBeInTheDocument();
      expect(screen.getByTestId('custom-desc')).toBeInTheDocument();
    });

    test('debe fusionar las clases CSS personalizadas pasadas por la prop className', () => {
      const { container } = render(
        <BentoGridItem className="col-span-2 custom-bg" title="Test" />
      );

      const itemContainer = container.firstChild;
      // Validamos la integración de estilos del helper cn
      expect(itemContainer).toHaveClass('group/bento', 'border', 'col-span-2', 'custom-bg');
    });
  });
});