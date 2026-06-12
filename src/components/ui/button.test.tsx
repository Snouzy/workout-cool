import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';
import { Button } from './button'; 

describe('Pruebas Unitarias - Componente Button', () => {

  test('debe renderizar el botón correctamente con su texto interno', () => {
    render(<Button>Hacer Click</Button>);
    
    const boton = screen.getByRole('button', { name: 'Hacer Click' });
    expect(boton).toBeInTheDocument();
  });

  test('debe disparar el evento onClick al hacer click sobre él', () => {
    const funcionEspia = vi.fn();
    render(<Button onClick={funcionEspia}>Click Me</Button>);

    const boton = screen.getByRole('button', { name: 'Click Me' });
    fireEvent.click(boton);

    expect(funcionEspia).toHaveBeenCalledTimes(1);
  });

  test('debe aplicar los estilos correctos cuando se le pasa la propiedad variant', () => {
    const { container } = render(<Button variant="destructive">Eliminar</Button>);
    
    const boton = container.firstChild;
    // CORREGIDO: Evaluamos con 'bg-red-600' que es el color real mapeado en tu variante
    expect(boton).toHaveClass('bg-red-600');
  });

  test('debe deshabilitar el elemento si se le pasa la propiedad disabled', () => {
    render(<Button disabled>No Clickeable</Button>);
    
    const boton = screen.getByRole('button', { name: 'No Clickeable' });
    expect(boton).toBeDisabled();
  });
});