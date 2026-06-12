import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect } from 'vitest';
import { Badge } from './badge';

describe('Pruebas Unitarias - Componente Badge', () => {

  test('debe renderizar correctamente el contenido que tiene dentro', () => {
    render(<Badge>Nuevo</Badge>);
    
    const badgeElement = screen.getByText('Nuevo');
    expect(badgeElement).toBeInTheDocument();
  });

  test('debe aplicar la variante por defecto (bg-black) si no se especifica ninguna', () => {
    render(<Badge data-testid="badge-default">Texto</Badge>);
    
    const badgeElement = screen.getByTestId('badge-default');
    // Verificamos que tenga la clase de la variante 'default' configurada en el cva
    expect(badgeElement).toHaveClass('bg-black');
  });

  test('debe aplicar las clases CSS correspondientes según la variante seleccionada', () => {
    const { rerender } = render(<Badge variant="primary" data-testid="badge-variant">Primary</Badge>);
    let badgeElement = screen.getByTestId('badge-variant');
    expect(badgeElement).toHaveClass('bg-primary');

    rerender(<Badge variant="success" data-testid="badge-variant">Success</Badge>);
    expect(badgeElement).toHaveClass('bg-success');

    rerender(<Badge variant="danger" data-testid="badge-variant">Danger</Badge>);
    expect(badgeElement).toHaveClass('bg-danger');

    rerender(<Badge variant="purple" data-testid="badge-variant">Purple</Badge>);
    expect(badgeElement).toHaveClass('bg-light-purple');
  });

  test('debe cambiar sus dimensiones y padding de acuerdo al tamaño (size) provisto', () => {
    const { rerender } = render(<Badge size="large" data-testid="badge-size">Grande</Badge>);
    let badgeElement = screen.getByTestId('badge-size');
    expect(badgeElement).toHaveClass('px-2', 'py-2.5');

    rerender(<Badge size="small" data-testid="badge-size">Pequeño</Badge>);
    expect(badgeElement).toHaveClass('px-1.5', 'py-[3px]', 'rounded-full');

    rerender(<Badge size="number" data-testid="badge-size">99</Badge>);
    expect(badgeElement).toHaveClass('text-[10px]/[8px]', 'font-semibold');
  });

  test('debe permitir añadir clases CSS personalizadas mediante la prop className', () => {
    render(<Badge className="shadow-xl custom-badge-class" data-testid="badge-custom">Custom</Badge>);
    
    const badgeElement = screen.getByTestId('badge-custom');
    // Valida que el helper utility 'cn' combine los estilos base del CVA con los tuyos externos
    expect(badgeElement).toHaveClass('inline-flex', 'shadow-xl', 'custom-badge-class');
  });
});