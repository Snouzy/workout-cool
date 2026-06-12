import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect } from 'vitest';
import { AspectRatio } from './aspect-ratio';

describe('Pruebas Unitarias - Componente AspectRatio', () => {
  
  test('debe renderizar correctamente el contenido hijo', () => {
    render(
      <AspectRatio ratio={16 / 9}>
        <img src="https://example.com/image.jpg" alt="Imagen de prueba" data-testid="aspect-img" />
      </AspectRatio>
    );

    // Verificamos que el hijo exista dentro del DOM
    const imagen = screen.getByTestId('aspect-img');
    expect(imagen).toBeInTheDocument();
    expect(imagen).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  test('debe transferir las propiedades de estilo de Radix para mantener la proporción', () => {
    const { container } = render(
      <AspectRatio ratio={1 / 1}>
        <div data-testid="contenido">Contenido Cuadrado</div>
      </AspectRatio>
    );

    // Radix UI inyecta estilos inline en el contenedor (como padding-bottom o aspectos calculados)
    // Nos aseguramos de que el contenedor de Radix esté presente envolviendo al hijo
    const contenedorRadix = container.firstChild;
    expect(contenedorRadix).toBeInTheDocument();
    
    // Verificamos que contenga estilos o la estructura base que maneja la primitiva
    expect(contenedorRadix).toHaveStyle({
      position: 'relative',
    });
  });
});