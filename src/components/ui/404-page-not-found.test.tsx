import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { NotFoundPage } from './404-page-not-found';
import router from 'next/router';

/**
 * SIMULACIONES (MOCKS)
 * Cambiamos la estructura del mock para que 'router.push' exista directamente 
 * en el objeto principal importado por el componente.
 */
vi.mock('next/router', () => {
  const mockRouter = {
    push: vi.fn(),
  };
  return {
    default: mockRouter,
    ...mockRouter,
  };
});

vi.mock('@/locales/client', () => ({
  useI18n: () => (key: string) => key,
}));

describe('Pruebas Unitarias - NotFoundPage', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('debe renderizar el encabezado principal con el numero 404', () => {
    render(<NotFoundPage />);
    
    // Usamos un query de texto directo o por contenedor, ya que el aria-hidden u otros estilos pueden alterar el rol accesible
    const titulo404 = screen.getByText('404');
    expect(titulo404).toBeInTheDocument();
  });

  test('debe mostrar los textos de error mapeados con el hook de traduccion', () => {
    render(<NotFoundPage />);
    
    const subtitulo = screen.getByRole('heading', { level: 3, name: 'commons.looks_like_you_are_lost' });
    const parrafo = screen.getByText('commons.the_page_you_are_looking_for_is_not_available');
    
    expect(subtitulo).toBeInTheDocument();
    expect(parrafo).toBeInTheDocument();
  });

  test('debe redirigir a la ruta raiz "/" al hacer click en el boton', () => {
    render(<NotFoundPage />);
    
    const botonHome = screen.getByRole('button', { name: 'commons.go_to_home' });
    expect(botonHome).toBeInTheDocument();

    fireEvent.click(botonHome);

    // Evaluamos la simulación directamente sobre el método de la importación
    expect(router.push).toHaveBeenCalledWith('/');
    expect(router.push).toHaveBeenCalledTimes(1);
  });
});