import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from './alert-dialog';

// Simulamos los estilos de los botones para que el test no dependa del archivo de botones real
vi.mock('@/components/ui/button', () => ({
  buttonVariants: () => 'mocked-button-styles',
}));

describe('Pruebas Unitarias - Componente AlertDialog', () => {
  
  // Componente de prueba reutilizable con espías (mocks) para las acciones
  const RenderAlertDialog = ({ onActionClick }: { onActionClick?: () => void }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button data-testid="trigger-btn">Abrir Alerta</button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onActionClick}>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  test('el contenido del modal no debe estar visible en el renderizado inicial', () => {
    render(<RenderAlertDialog />);
    
    // El título y la descripción no deberían existir en el DOM interactivo aún
    const titulo = screen.queryByText('¿Estás completamente seguro?');
    expect(titulo).not.toBeInTheDocument();
  });

  test('debe abrir el diálogo y mostrar el contenido al hacer click en el disparador', async () => {
    render(<RenderAlertDialog />);
    
    const botonDisparador = screen.getByTestId('trigger-btn');
    
    // Hacemos click para abrir la alerta
    fireEvent.click(botonDisparador);

    // Ahora los textos accesibles y roles estructurales deben estar en pantalla
    const titulo = await screen.findByText('¿Estás completamente seguro?');
    const descripcion = screen.getByText(/Esta acción no se puede deshacer/i);
    
    expect(titulo).toBeInTheDocument();
    expect(descripcion).toBeInTheDocument();
  });

  test('debe llamar a la función de acción al hacer click en Continuar', async () => {
    const fnAccionEspia = vi.fn();
    render(<RenderAlertDialog onActionClick={fnAccionEspia} />);
    
    // Abrimos el modal
    fireEvent.click(screen.getByTestId('trigger-btn'));

    // Buscamos el botón de acción por su rol accesible
    const botonContinuar = screen.getByRole('button', { name: 'Continuar' });
    fireEvent.click(botonContinuar);

    // Validamos que se haya ejecutado el callback correspondiente
    expect(fnAccionEspia).toHaveBeenCalledTimes(1);
  });

  test('debe cerrar el diálogo al hacer click en Cancelar', async () => {
    render(<RenderAlertDialog />);
    
    // Abrimos el modal
    fireEvent.click(screen.getByTestId('trigger-btn'));
    
    const tituloAntes = screen.getByText('¿Estás completamente seguro?');
    expect(tituloAntes).toBeInTheDocument();

    // Buscamos y hacemos click en Cancelar
    const botonCancelar = screen.getByRole('button', { name: 'Cancelar' });
    fireEvent.click(botonCancelar);

    // Radix desmonatará el contenido tras completar la animación de salida de forma asíncrona
    // Evaluamos que el elemento ya no sea visible de manera interactiva
    expect(tituloAntes).not.toBeVisible();
  });
});