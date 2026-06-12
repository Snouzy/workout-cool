import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect } from 'vitest';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';

describe('Pruebas Unitarias - Componente Accordion', () => {
  
  // Un componente básico reutilizable para las pruebas
  const RenderAccordion = ({ type = 'single', collapsible = true }: { type?: 'single' | 'multiple', collapsible?: boolean }) => (
    <Accordion type={type} collapsible={collapsible}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Título Item 1</AccordionTrigger>
        <AccordionContent>Contenido Oculto 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Título Item 2</AccordionTrigger>
        <AccordionContent>Contenido Oculto 2</AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  test('debe renderizar los disparadores correctamente', () => {
    render(<RenderAccordion />);
    
    const trigger1 = screen.getByRole('button', { name: 'Título Item 1' });
    const trigger2 = screen.getByRole('button', { name: 'Título Item 2' });

    expect(trigger1).toBeInTheDocument();
    expect(trigger2).toBeInTheDocument();
  });

  test('el contenido debe estar cerrado o colapsado por defecto', () => {
    render(<RenderAccordion />);
    
    const trigger = screen.getByRole('button', { name: 'Título Item 1' });
    
    // Radix maneja la visibilidad con aria-expanded y data-state
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('data-state', 'closed');
  });

  test('debe expandir el contenido al hacer click en el disparador', async () => {
    render(<RenderAccordion />);
    
    const trigger = screen.getByRole('button', { name: 'Título Item 1' });
    
    // Simulamos el click para abrirlo
    fireEvent.click(trigger);

    // Verificamos que cambien sus atributos de estado a abierto
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('data-state', 'open');
    
    // El texto interno del contenido ahora debería ser visible/identificable
    const contenido = screen.getByText('Contenido Oculto 1');
    expect(contenido).toBeInTheDocument();
  });

  test('debe cerrar el ítem abierto si se vuelve a hacer click (collapsible)', () => {
    render(<RenderAccordion type="single" collapsible={true} />);
    
    const trigger = screen.getByRole('button', { name: 'Título Item 1' });
    
    // Primer click: Abre
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // Segundo click: Cierra
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('data-state', 'closed');
  });

  test('en modo single, abrir un ítem debe cerrar el otro', () => {
    render(<RenderAccordion type="single" />);
    
    const trigger1 = screen.getByRole('button', { name: 'Título Item 1' });
    const trigger2 = screen.getByRole('button', { name: 'Título Item 2' });

    // Abrimos el primer ítem
    fireEvent.click(trigger1);
    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(trigger2).toHaveAttribute('aria-expanded', 'false');

    // Al hacer click en el segundo, se debería cerrar el primero
    fireEvent.click(trigger2);
    expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    expect(trigger2).toHaveAttribute('aria-expanded', 'true');
  });
});