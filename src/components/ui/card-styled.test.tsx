import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect } from 'vitest';
import { Card } from './card-styled';

describe('Pruebas Unitarias - Componente CardStyled', () => {

  test('debe renderizar el título y la descripción en texto plano correctamente', () => {
    render(
      <Card 
        title="Tarjeta de Prueba" 
        description="Esta es una descripción estándar en texto plano" 
      />
    );

    expect(screen.getByText('Tarjeta de Prueba')).toBeInTheDocument();
    expect(screen.getByText('Esta es una descripción estándar en texto plano')).toBeInTheDocument();
  });

  test('debe inyectar y renderizar HTML de forma segura si la prop isHtml es true', () => {
    const htmlSnippet = 'Clave <strong>Negrita</strong>';
    render(
      <Card 
        title="HTML Card" 
        description={htmlSnippet} 
        isHtml={true} 
      />
    );

    // Verificamos que el nodo strong se haya parseado y renderizado como HTML real
    const boldElement = screen.getByText('Negrita');
    expect(boldElement).toBeInTheDocument();
    expect(boldElement.tagName).toBe('STRONG');
  });

  test('debe renderizar los elementos hijos (children) adjuntos', () => {
    render(
      <Card title="Card Hijos">
        <button data-testid="btn-interno">Acción</button>
      </Card>
    );

    expect(screen.getByTestId('btn-interno')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Acción' })).toBeInTheDocument();
  });

  test('debe aplicar la variante por defecto y sus clases CSS correspondientes', () => {
    const { container } = render(<Card title="Default" />);
    
    const cardRoot = container.firstChild;
    // Valida que el helper cn asigne las clases estructurales base del CVA
    expect(cardRoot).toHaveClass('w-full', 'relative', 'border', 'rounded-lg');
  });

  test('debe estructurar el sub-DOM específico para la variante dots', () => {
    const { container } = render(<Card variant="dots" title="Puntos" />);
    
    const cardRoot = container.firstChild;
    expect(cardRoot).toHaveClass('relative', 'mx-auto', 'w-full');
    
    // Validamos que se inyecten las líneas horizontales decorativas de fondo
    const lineasDecorativas = container.querySelectorAll('.bg-zinc-400');
    expect(lineasDecorativas.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Puntos')).toBeInTheDocument();
  });

  test('debe estructurar el sub-DOM específico para la variante inner', () => {
    const { container } = render(<Card variant="inner" title="Interno" />);
    
    const cardRoot = container.firstChild;
    expect(cardRoot).toHaveClass('border-[0.5px]', 'rounded-sm', 'p-2');
    
    // Verificamos el contenedor con degradado interno único de esta variante
    const gradientContainer = container.querySelector('.bg-gradient-to-br');
    expect(gradientContainer).toBeInTheDocument();
  });

  test('debe estructurar el sub-DOM específico para la variante gradient', () => {
    const { container } = render(<Card variant="gradient" title="Degradado" />);
    
    // Validamos que se dibujen las líneas de degradado perimetrales (from-zinc-200)
    const lineasGradient = container.querySelectorAll('.bg-gradient-to-l, .bg-gradient-to-r, .bg-gradient-to-t');
    expect(lineasGradient.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Degradado')).toBeInTheDocument();
  });

  test('debe incrustar los 4 iconos vectoriales SVG al seleccionar la variante plus', () => {
    const { container } = render(<Card variant="plus" title="Cruces" />);
    
    const cardRoot = container.firstChild;
    expect(cardRoot).toHaveClass('border', 'border-dashed');
    
    // Esta variante añade 4 cruces SVG en las esquinas de la tarjeta
    const iconosPluses = container.querySelectorAll('svg');
    expect(iconosPluses.length).toBe(4);
  });

  test('debe incrustar los 4 esquineros div al seleccionar la variante corners', () => {
    const { container } = render(<Card variant="corners" title="Esquinas" />);
    
    // Esta variante añade 4 selectores absolutos para remarcar los bordes externos
    const esquineros = container.querySelectorAll('.size-6');
    expect(esquineros.length).toBe(4);
  });

  test('debe fusionar clases CSS adicionales a través de la prop className', () => {
    const { container } = render(<Card className="shadow-2xl custom-card" title="Custom" />);
    
    const cardRoot = container.firstChild;
    expect(cardRoot).toHaveClass('w-full', 'shadow-2xl', 'custom-card');
  });
});