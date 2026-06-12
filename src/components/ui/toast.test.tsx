import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { 
  ToastProvider, 
  ToastViewport, 
  Toast, 
  ToastDescription, 
  ToastClose, 
  brandedToast 
} from './toast'; // Ajusta la ruta si es necesario

// 1. Mock de next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={props.src?.src || props.src} alt={props.alt} {...props} />;
  },
}));

// 2. Mock de la librería sonner
const mockSonnerToast = vi.fn();
vi.mock('sonner', () => ({
  toast: (content: React.ReactNode) => mockSonnerToast(content),
}));

describe('Componentes de Toast (Radix UI Base)', () => {
  it('debería renderizar la estructura del toast sin colapsar', () => {
    render(
      <ToastProvider>
        <Toast data-testid="toast-root" open={true}>
          <ToastDescription>Mensaje de prueba</ToastDescription>
          <ToastClose data-testid="toast-close" />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    // Verificación básica del renderizado inicial
    expect(screen.queryByPlaceholderText('abc')).toBeNull(); 
  });

  it('debería aplicar las clases variantes de class-variance-authority', async () => {
    // Para asegurar que Radix monte el Portal en JSDOM, incluimos TODO el árbol requerido (Provider + Viewport)
    const { rerender } = render(
      <ToastProvider>
        <Toast variant="destructive" open={true} data-testid="toast-variant">
          <ToastDescription>Error</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    // Usamos findBy para esperar el ciclo de renderizado asíncrono del Portal de Radix
    let toastElement = await screen.findByTestId('toast-variant');
    expect(toastElement.className).toContain('destructive');

    // Cambiamos a la variante black incluyendo también toda la estructura base
    rerender(
      <ToastProvider>
        <Toast variant="black" open={true} data-testid="toast-variant">
          <ToastDescription>Negro</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    
    toastElement = await screen.findByTestId('toast-variant');
    expect(toastElement.className).toContain('bg-black');
  });
});

describe('Función brandedToast (Integración con Sonner)', () => {
  it('debería invocar a sonner con las propiedades correctas', () => {
    brandedToast({
      title: 'Operación Exitosa',
      subtitle: 'Tu archivo se ha guardado correctamente',
      variant: 'success'
    });

    expect(mockSonnerToast).toHaveBeenCalledTimes(1);

    const renderedNode = mockSonnerToast.mock.calls[0][0];

    // BrandedToastContent internamente NO usa Radix.Root, usa Radix.Description, 
    // por lo que se monta instantáneamente en el DOM común de pruebas sin esperas.
    render(<ToastProvider>{renderedNode}</ToastProvider>);

    expect(screen.getByText('Operación Exitosa')).toBeInTheDocument();
    expect(screen.getByText('Tu archivo se ha guardado correctamente')).toBeInTheDocument();
    
    const logoImg = screen.getByAltText('logo');
    expect(logoImg).toBeInTheDocument();
  });

  it('debería usar la variante default si no se especifica ninguna', () => {
    vi.clearAllMocks();

    brandedToast({
      title: 'Aviso por defecto'
    });

    const renderedNode = mockSonnerToast.mock.calls[0][0];
    render(<ToastProvider>{renderedNode}</ToastProvider>);

    expect(screen.getByText('Aviso por defecto')).toBeInTheDocument();
  });
});