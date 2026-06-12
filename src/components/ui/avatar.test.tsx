import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach } from 'vitest';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';

describe('Pruebas Unitarias - Componente Avatar', () => {

  beforeEach(() => {
    // Hack para entornos virtuales (JSDOM): Le decimos a la imagen global que simule cargarse de inmediato
    // Esto evita que Radix oculte la etiqueta de la imagen asumiendo un fallo de red.
    Object.defineProperty(global.Image.prototype, 'src', {
      set(src) {
        if (src) {
          setTimeout(() => {
            fireEvent(this, new Event('load'));
          }, 0);
        }
      },
    });
  });

  test('debe renderizar la imagen correctamente cuando logra cargar', async () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="User Avatar" data-testid="avatar-image" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );

    // Al usar findByTestId, esperamos asíncronamente a que el minitimer de beforeEach dispare el evento 'load'
    const image = await screen.findByTestId('avatar-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  test('debe mostrar el contenido del fallback (iniciales) correctamente', () => {
    render(
      <Avatar>
        <AvatarFallback>UA</AvatarFallback>
      </Avatar>
    );

    const fallbackText = screen.getByText('UA');
    expect(fallbackText).toBeInTheDocument();
  });

  test('aplica las clases de estilo por defecto de Radix en el contenedor raíz', () => {
    render(
      <Avatar data-testid="avatar-style-root">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );

    const root = screen.getByTestId('avatar-style-root');
    expect(root).toHaveClass('relative', 'flex', 'rounded-full');
  });
});