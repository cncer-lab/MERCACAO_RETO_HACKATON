import { describe, it, expect } from 'vitest';
import { aCSV, costoPorLote } from '../lib/exportacion.js';

describe('aCSV', () => {
  const columnas = [
    { titulo: 'id', campo: 'id' },
    { titulo: 'productor', campo: 'productor' },
  ];

  it('genera encabezado y filas', () => {
    const csv = aCSV([{ id: 'CAC001', productor: 'Productor A' }], columnas);
    expect(csv).toBe('id,productor\r\nCAC001,Productor A\r\n');
  });
  it('encierra entre comillas valores con coma y duplica comillas', () => {
    const csv = aCSV([{ id: 'X', productor: 'Finca "La Paz", Rivera' }], columnas);
    expect(csv).toContain('"Finca ""La Paz"", Rivera"');
  });
  it('neutraliza fórmulas de hoja de cálculo', () => {
    const csv = aCSV([{ id: 'X', productor: '=HYPERLINK("http://malo")' }], columnas);
    expect(csv).toContain("'=HYPERLINK");
  });
  it('no altera números negativos', () => {
    const csv = aCSV([{ id: -5, productor: 'A' }], columnas);
    expect(csv).toContain('-5,A');
  });
});

describe('costoPorLote', () => {
  it('reparte el costo de la etapa según los kg consumidos', () => {
    const entradas = [
      { etapa_id: 'e1', lotes_id: 'A', cantidad_consumida: 60, etapas: { costo_total: 1600000 } },
      { etapa_id: 'e1', lotes_id: 'B', cantidad_consumida: 20, etapas: { costo_total: 1600000 } },
    ];
    const r = costoPorLote(entradas);
    expect(r.A).toBeCloseTo(1200000);
    expect(r.B).toBeCloseTo(400000);
  });
  it('suma las etapas en las que participó un lote', () => {
    const entradas = [
      { etapa_id: 'e1', lotes_id: 'A', cantidad_consumida: 50, etapas: { costo_total: 100 } },
      { etapa_id: 'e2', lotes_id: 'A', cantidad_consumida: 30, etapas: { costo_total: 40 } },
    ];
    expect(costoPorLote(entradas).A).toBeCloseTo(140);
  });
  it('un lote sin etapas no aparece y una etapa sin costo suma 0', () => {
    expect(costoPorLote([])).toEqual({});
    const r = costoPorLote([{ etapa_id: 'e1', lotes_id: 'A', cantidad_consumida: 10, etapas: null }]);
    expect(r.A).toBe(0);
  });
});
