import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect } from 'vitest';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from './card';

describe('Pruebas Unitarias - Estructura Modular de Card', () => {

  test('debe renderizar todos los subcomponentes juntos formando la estructura de la tarjeta', () => {
    render(
      <Card data-testid="card-root">
        <CardHeader data-testid="card-header">
          <CardTitle>Título del Reporte</CardTitle>
          <CardDescription>Resumen mensual de actividades</CardDescription>
        </CardHeader>
        <CardContent data-testid="card-content">
          <p>Este es el cuerpo principal de la tarjeta con la información.</p>
        </CardContent>
        <CardFooter data-testid="card-footer">
          <button>Entendido</button>
        </CardFooter>
      </Card>
    );

    // 1. Validar presencia en el DOM
    expect(screen.getByTestId('card-root')).toBeInTheDocument();
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
    expect(screen.getByTestId('card-footer')).toBeInTheDocument();

    // 2. Validar etiquetas semánticas correctas
    const title = screen.getByText('Título del Reporte');
    const description = screen.getByText('Resumen mensual de actividades');
    
    expect(title.tagName).toBe('H3');
    expect(description.tagName).toBe('P');
  });

  test('debe aplicar las clases CSS estructurales y de tema por defecto', () => {
    render(<Card data-testid="card-theme">Contenido</Card>);
    
    const cardElement = screen.getByTestId('card-theme');
    // Valida las clases Tailwind configuradas para fondo, bordes y sombras
    expect(cardElement).toHaveClass('rounded-lg', 'bg-white', 'shadow-3xl', 'dark:bg-black-dark');
  });

  test('CardTitle debe conservar sus clases de tipografía por defecto', () => {
    render(<CardTitle>Texto Importante</CardTitle>);
    
    const titleElement = screen.getByText('Texto Importante');
    expect(titleElement).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight');
  });

  test('todos los subcomponentes deben permitir la inyección de clases personalizadas mediante className', () => {
    render(
      <Card className="custom-card-root" data-testid="c-root">
        <CardHeader className="custom-header" data-testid="c-header" />
        <CardTitle className="custom-title">Title</CardTitle>
        <CardDescription className="custom-desc">Desc</CardDescription>
        <CardContent className="custom-content" data-testid="c-content" />
        <CardFooter className="custom-footer" data-testid="c-footer" />
      </Card>
    );

    expect(screen.getByTestId('c-root')).toHaveClass('custom-card-root', 'rounded-lg');
    expect(screen.getByTestId('c-header')).toHaveClass('custom-header');
    expect(screen.getByText('Title')).toHaveClass('custom-title', 'text-2xl');
    expect(screen.getByText('Desc')).toHaveClass('custom-desc');
    expect(screen.getByTestId('c-content')).toHaveClass('custom-content');
    expect(screen.getByTestId('c-footer')).toHaveClass('custom-footer');
  });

  test('debe pasar correctamente las referencias de React (forwardRef) a los elementos del DOM', () => {
    const cardRef = React.createRef<HTMLDivElement>();
    const titleRef = React.createRef<HTMLHeadingElement>();

    render(
      <Card ref={cardRef}>
        <CardTitle ref={titleRef}>Ref Title</CardTitle>
      </Card>
    );

    // Verificamos que las referencias apunten a los nodos reales del DOM virtual
    expect(cardRef.current).toBeInstanceOf(HTMLDivElement);
    expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement);
    expect(titleRef.current?.tagName).toBe('H3');
  });
});