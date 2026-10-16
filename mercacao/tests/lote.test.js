import { describe, it, expect } from 'vitest';
import { esquemaLote } from '../lib/validaciones/lote.js';

const valido = {
  id: 'CAC001', productor: 'Productor A', origen: 'Rivera',
  fecha: '2026-10-15', cantidad: '100', unidad: 'kg',
};

describe('esquemaLote', () => {
  it('acepta un lote válido y convierte la cantidad a número', () => {
    const r = esquemaLote.safeParse(valido);
    expect(r.success).toBe(true);
    expect(r.data.cantidad).toBe(100);
  });
  it('rechaza cantidad negativa o cero', () => {
    expect(esquemaLote.safeParse({ ...valido, cantidad: -5 }).success).toBe(false);
    expect(esquemaLote.safeParse({ ...valido, cantidad: 0 }).success).toBe(false);
  });
  it('rechaza un campo obligatorio vacío', () => {
    expect(esquemaLote.safeParse({ ...valido, origen: '  ' }).success).toBe(false);
  });
});
