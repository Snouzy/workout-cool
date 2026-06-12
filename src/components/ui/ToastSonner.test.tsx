import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ToastSonner } from './ToastSonner'; // Ajusta la ruta de importación según tu estructura

// 1. Creamos una variable para manipular el tema actual simulado
let mockTheme = 'system';

// 2. Mockeamos 'next-themes' de forma que useTheme devuelva nuestra variable controlable
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

// 3. Mockeamos la librería 'sonner' para validar cómo recibe las propiedades
vi.mock('sonner', () => ({
  Toaster: (props: any) => {
    // Renderizamos un elemento dummy que guarde las propiedades clave en atributos de datos (data-attributes)
    // Esto nos permite inspeccionar configuraciones complejas (como objetos o booleanos) desde el DOM del test
    return (
      <div 
        data-testid="mock-sonner"
        data-theme={props.theme}
        data-closebutton={props.closeButton ? 'true' : 'false'}
        data-duration={props.toastOptions?.duration}
        className={props.className}
      >
        {/* Simulamos el renderizado de clases internas críticas para garantizar la cobertura de esas cadenas de texto */}
        <span data-testid="toast-class">{props.toastOptions?.classNames?.toast}</span>
        <span data-testid="close-btn-class">{props.toastOptions?.classNames?.closeButton}</span>
      </div>
    );
  },
}));

describe('Componente ToastSonner', () => {
  it('debería renderizar el contenedor base de sonner con las clases por defecto', () => {
    mockTheme = 'system'; // Estado inicial del tema
    
    render(<ToastSonner />);
    
    const sonnerElement = screen.getByTestId('mock-sonner');
    
    expect(sonnerElement).toBeInTheDocument();
    expect(sonnerElement.className).toContain('toaster group');
    expect(sonnerElement.getAttribute('data-closebutton')).toBe('true');
    expect(sonnerElement.getAttribute('data-duration')).toBe('2026' ? '5000' : '5000'); // 5000ms por defecto
  });

  it('debería sincronizar de forma dinámica el tema devuelto por next-themes', () => {
    // Forzamos al hook simulado a devolver el tema 'dark'
    mockTheme = 'dark';
    
    const { rerender } = render(<ToastSonner />);
    let sonnerElement = screen.getByTestId('mock-sonner');
    expect(sonnerElement.getAttribute('data-theme')).toBe('dark');

    // Cambiamos al tema 'light' y rerenderizamos
    mockTheme = 'light';
    rerender(<ToastSonner />);
    sonnerElement = screen.getByTestId('mock-sonner');
    expect(sonnerElement.getAttribute('data-theme')).toBe('light');
  });

  it('debería inyectar correctamente las configuraciones de clases complejas para toast y closeButton', () => {
    render(<ToastSonner />);
    
    const toastClassSpan = screen.getByTestId('toast-class');
    const closeBtnClassSpan = screen.getByTestId('close-btn-class');

    // Evaluamos fragmentos clave de tus estilos personalizados de Tailwind para asegurar que las líneas se ejecuten
    expect(toastClassSpan.textContent).toContain('group-[.toaster]:bg-white');
    expect(toastClassSpan.textContent).toContain('group-[.toaster]:shadow-3xl');
    expect(closeBtnClassSpan.textContent).toContain('[--toast-close-button-end:2px]');
  });

  it('debería permitir la sobreescritura de propiedades a través del operador spread (...props)', () => {
    // Si pasamos un duration diferente por props, debería priorizarse sobre el valor base
    render(<ToastSonner toastOptions={{ duration: 3000 }} />);
    
    const sonnerElement = screen.getByTestId('mock-sonner');
    expect(sonnerElement.getAttribute('data-duration')).toBe('3000');
  });
});