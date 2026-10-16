import { describe, it, expect } from 'vitest';
import { evaluarEtapa } from '../lib/etapa.js';

const base = {
  entradas: [{ lote_id: 'CAC001', cantidad: 100 }],
  salida_kg: 80,
  costo_total: 1600000,
};

describe('evaluarEtapa', () => {
  it('100 -> 80 kg: merma 20 %, alerta y costo 20.000', () => {
    const r = evaluarEtapa(base);
    expect(r.ok).toBe(true);
    expect(r.merma).toBe(20);
    expect(r.alerta).toBe(true);
    expect(r.costo_unitario).toBe(20000);
  });
  it('100 -> 90 kg: merma 10 % sin alerta (el jurado cambia valores)', () => {
    const r = evaluarEtapa({ ...base, salida_kg: 90 });
    expect(r.merma).toBe(10);
    expect(r.alerta).toBe(false);
  });
  it('precio 25.000 con costo 20.000: margen 20 %', () => {
    expect(evaluarEtapa({ ...base, precio: 25000 }).margen).toBe(20);
  });
  it('salida 0: no divide, explica y marca merma 100 %', () => {
    const r = evaluarEtapa({ ...base, salida_kg: 0 });
    expect(r.ok).toBe(true);
    expect(r.costo_unitario).toBeNull();
    expect(r.aviso_costo).toMatch(/0 kg/);
    expect(r.merma).toBe(100);
  });
  it('mezcla de lotes suma las entradas', () => {
    const r = evaluarEtapa({
      ...base,
      entradas: [
        { lote_id: 'CAC001', cantidad: 60 },
        { lote_id: 'CAC002', cantidad: 40 },
      ],
    });
    expect(r.entrada_total).toBe(100);
    expect(r.merma).toBe(20);
  });
  it('salida mayor que la entrada exige justificación', () => {
    expect(evaluarEtapa({ ...base, salida_kg: 120 }).ok).toBe(false);
    const r = evaluarEtapa({ ...base, salida_kg: 120, justificacion: 'Se añadieron insumos' });
    expect(r.ok).toBe(true);
    expect(r.alerta).toBe(false);
  });
});
