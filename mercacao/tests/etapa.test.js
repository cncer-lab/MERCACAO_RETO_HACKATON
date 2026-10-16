import { describe, it, expect } from 'vitest';
import { esquemaEtapa } from '../lib/validaciones/etapa.js';

const valida = {
  clave: 'op-12345678',
  tipo: 'fermentado',
  responsable: 'Operador 1',
  fecha: '2026-10-16',
  salida_kg: '80',
  costo_total: '1600000',
  entradas: [{ lote_id: 'CAC001', cantidad: '100' }],
};

describe('esquemaEtapa', () => {
  it('acepta una etapa válida y convierte textos a números', () => {
    const r = esquemaEtapa.safeParse(valida);
    expect(r.success).toBe(true);
    expect(r.data.salida_kg).toBe(80);
    expect(r.data.entradas[0].cantidad).toBe(100);
  });
  it('rechaza una etapa sin entradas', () => {
    expect(esquemaEtapa.safeParse({ ...valida, entradas: [] }).success).toBe(false);
  });
  it('rechaza cantidades consumidas no positivas', () => {
    const e = [{ lote_id: 'CAC001', cantidad: -3 }];
    expect(esquemaEtapa.safeParse({ ...valida, entradas: e }).success).toBe(false);
  });
  it('rechaza lotes repetidos en las entradas', () => {
    const e = [
      { lote_id: 'CAC001', cantidad: 10 },
      { lote_id: 'CAC001', cantidad: 20 },
    ];
    expect(esquemaEtapa.safeParse({ ...valida, entradas: e }).success).toBe(false);
  });
  it('rechaza tipo desconocido, salida negativa y clave corta', () => {
    expect(esquemaEtapa.safeParse({ ...valida, tipo: 'tostado' }).success).toBe(false);
    expect(esquemaEtapa.safeParse({ ...valida, salida_kg: -1 }).success).toBe(false);
    expect(esquemaEtapa.safeParse({ ...valida, clave: 'abc' }).success).toBe(false);
  });
  it('acepta salida 0 (el cálculo de costo la maneja aparte)', () => {
    expect(esquemaEtapa.safeParse({ ...valida, salida_kg: 0 }).success).toBe(true);
  });
});
