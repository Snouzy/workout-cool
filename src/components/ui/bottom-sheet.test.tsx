import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { BottomSheet } from './bottom-sheet';

describe('Pruebas Unitarias - Componente BottomSheet', () => {
  const containerId = 'phone-preview-container';
  let mockContainer: HTMLDivElement;
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Creamos y acoplamos el contenedor simulado al body global para que el Portal funcione
    mockContainer = document.createElement('div');
    mockContainer.setAttribute('id', containerId);
    
    // Le añadimos dimensiones básicas simuladas para los cálculos de scroll
    Object.defineProperty(mockContainer, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(mockContainer, 'clientHeight', { value: 800, writable: true });
    document.body.appendChild(mockContainer);
  });

  afterEach(() => {
    // Limpieza estricta del DOM tras cada test
    if (document.getElementById(containerId)) {
      document.body.removeChild(mockContainer);
    }
  });

  test('no debe renderizar nada si isOpen es false', () => {
    render(
      <BottomSheet isOpen={false} onCloseAction={mockOnClose} title="Mi Drawer">
        <div>Contenido del Drawer</div>
      </BottomSheet>
    );

    const titulo = screen.queryByText('Mi Drawer');
    const contenido = screen.queryByText('Contenido del Drawer');

    expect(titulo).not.toBeInTheDocument();
    expect(contenido).not.toBeInTheDocument();
  });

  test('debe renderizar el título y su contenido a través del Portal si isOpen es true', () => {
    render(
      <BottomSheet isOpen={true} onCloseAction={mockOnClose} title="Mi Drawer">
        <div>Contenido del Drawer</div>
      </BottomSheet>
    );

    const titulo = screen.getByText('Mi Drawer');
    const contenido = screen.getByText('Contenido del Drawer');
    const textoCerrarAccesible = screen.getByText('Fermer'); 

    expect(titulo).toBeInTheDocument();
    expect(contenido).toBeInTheDocument();
    expect(textoCerrarAccesible).toBeInTheDocument();
  });

  test('debe bloquear el scroll aplicando overflow hidden al body y al contenedor cuando se abre', () => {
    render(
      <BottomSheet isOpen={true} onCloseAction={mockOnClose} title="Test Scroll">
        <div>Contenido</div>
      </BottomSheet>
    );

    expect(document.body.style.overflow).toBe('hidden');
    expect(mockContainer.style.overflow).toBe('hidden');
  });

  test('debe llamar a onCloseAction al hacer click en el botón de cerrar del header', () => {
    render(
      <BottomSheet isOpen={true} onCloseAction={mockOnClose} title="Test Accion">
        <div>Contenido</div>
      </BottomSheet>
    );

    const botonCerrar = screen.getByRole('button', { name: 'Fermer' });
    fireEvent.click(botonCerrar);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('debe llamar a onCloseAction al hacer click en el fondo oscuro (backdrop overlay)', () => {
    render(
      <BottomSheet isOpen={true} onCloseAction={mockOnClose} title="Test Backdrop">
        <div>Contenido</div>
      </BottomSheet>
    );

    const backdrop = mockContainer.querySelector('.bg-black\\/40');
    expect(backdrop).toBeInTheDocument();

    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });
});