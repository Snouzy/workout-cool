import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';
import {
  DialogStack,
  DialogStackTrigger,
  DialogStackOverlay,
  DialogStackBody,
  DialogStackContent,
  DialogStackHeader,
  DialogStackTitle,
  DialogStackDescription,
  DialogStackFooter,
  DialogStackNext,
  DialogStackPrevious,
} from './dialog-stack';

// Helper para renderizar un stack de diálogos completo para las pruebas de integración
const RenderFullDialogStack = ({ open = false, clickable = false, onOpenChange }: { open?: boolean; clickable?: boolean; onOpenChange?: (open: boolean) => void }) => {
  return (
    <DialogStack open={open} clickable={clickable} onOpenChange={onOpenChange}>
      <DialogStackTrigger data-testid="trigger-global">Abrir Stack</DialogStackTrigger>
      <DialogStackOverlay data-testid="overlay-global" />
      <DialogStackBody data-testid="body-global">
        <DialogStackContent data-testid="content-0">
          <DialogStackHeader>
            <DialogStackTitle>Diálogo Paso 1</DialogStackTitle>
            <DialogStackDescription>Descripción del paso 1</DialogStackDescription>
          </DialogStackHeader>
          <DialogStackFooter>
            <DialogStackNext data-testid="next-btn">Siguiente</DialogStackNext>
          </DialogStackFooter>
        </DialogStackContent>

        <DialogStackContent data-testid="content-1">
          <DialogStackHeader>
            <DialogStackTitle>Diálogo Paso 2</DialogStackTitle>
          </DialogStackHeader>
          <DialogStackFooter>
            <DialogStackPrevious data-testid="prev-btn">Atrás</DialogStackPrevious>
            <DialogStackNext data-testid="next-btn-final">Finalizar</DialogStackNext>
          </DialogStackFooter>
        </DialogStackContent>
      </DialogStackBody>
    </DialogStack>
  );
};

describe('Pruebas Unitarias e Integración - DialogStack', () => {

  test('no debe mostrar el cuerpo ni el overlay si open es false por defecto', () => {
    render(<RenderFullDialogStack open={false} />);
    
    expect(screen.getByTestId('trigger-global')).toBeInTheDocument();
    expect(screen.queryByTestId('overlay-global')).not.toBeInTheDocument();
    expect(screen.queryByText('Diálogo Paso 1')).not.toBeInTheDocument();
  });

  test('debe abrirse y mostrar el primer diálogo al hacer clic en el disparador', () => {
    const mockOpenChange = vi.fn();
    render(<RenderFullDialogStack open={false} onOpenChange={mockOpenChange} />);

    const trigger = screen.getByTestId('trigger-global');
    fireEvent.click(trigger);

    expect(screen.getByTestId('overlay-global')).toBeInTheDocument();
    expect(screen.getByText('Diálogo Paso 1')).toBeInTheDocument();
    expect(mockOpenChange).toHaveBeenCalledWith(true);
  });

  test('debe transicionar hacia el paso siguiente y regresar usando los botones de navegación', () => {
    render(<RenderFullDialogStack open={true} />);

    // Comprobamos el estado inicial (Paso 1 visible, Paso 2 oculto mediante opacidad del CSS)
    expect(screen.getByText('Diálogo Paso 1')).toBeInTheDocument();
    
    const content0 = screen.getByTestId('content-0');
    const content1 = screen.getByTestId('content-1');
    expect(content0.style.opacity).not.toBe('0');
    expect(content1.style.opacity).toBe('0'); // distanceFromActive > 0 -> opacity: 0

    // Clic en Siguiente
    const nextBtn = screen.getByTestId('next-btn');
    fireEvent.click(nextBtn);

    // Ahora el Paso 2 debe estar visible y el paso 1 oculto/clonado
    expect(screen.getByText('Diálogo Paso 2')).toBeInTheDocument();

    // Regresar al paso anterior
    const prevBtn = screen.getByTestId('prev-btn');
    fireEvent.click(prevBtn);
    expect(content0.style.opacity).not.toBe('0');
  });

  test('debe cerrar el stack completo al hacer clic en el componente overlay', () => {
    render(<RenderFullDialogStack open={true} />);

    const overlay = screen.getByTestId('overlay-global');
    fireEvent.click(overlay);

    // Al cerrar, el overlay y los contenidos desaparecen del DOM condicionalmente
    expect(screen.queryByTestId('overlay-global')).not.toBeInTheDocument();
    expect(screen.queryByText('Diálogo Paso 1')).not.toBeInTheDocument();
  });

  test('debe permitir navegar hacia atrás al hacer clic directo en una card anterior si clickable es true', () => {
    render(<RenderFullDialogStack open={true} clickable={true} />);

    // Avanzamos al paso 2
    fireEvent.click(screen.getByTestId('next-btn'));
    
    // Al estar en el paso 2, hacemos clic directo en el contenedor de la card 0 para volver
    const content0 = screen.getByTestId('content-0');
    fireEvent.click(content0);

    // Validamos que se reseteó el índice activo y vuelve a ser el paso principal
    expect(content0.style.opacity).not.toBe('0');
  });
});