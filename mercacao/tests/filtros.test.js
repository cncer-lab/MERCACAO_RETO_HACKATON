import { describe, it, expect } from 'vitest';
import { esquemaFiltrosLote } from '../lib/validaciones/lote.js';
import { puedeRealizar } from '../lib/permisos.js';

describe('esquemaFiltrosLote', () => {
  it('acepta filtros vacíos', () => {
    expect(esquemaFiltrosLote.safeParse({}).success).toBe(true);
  });
  it('trata un origen vacío como sin filtro', () => {
    const r = esquemaFiltrosLote.safeParse({ origen: '' });
    expect(r.success).toBe(true);
    expect(r.data.origen).toBeUndefined();
  });
  it('acepta un estado válido y rechaza uno inventado', () => {
    expect(esquemaFiltrosLote.safeParse({ estado: 'bloqueado' }).success).toBe(true);
    expect(esquemaFiltrosLote.safeParse({ estado: 'xyz' }).success).toBe(false);
  });
});

describe('permiso ver_lotes', () => {
  it('lo tienen operador y admin', () => {
    expect(puedeRealizar('operador', 'ver_lotes')).toBe(true);
    expect(puedeRealizar('admin', 'ver_lotes')).toBe(true);
  });
  it('se deniega a un rol desconocido', () => {
    expect(puedeRealizar('comprador', 'ver_lotes')).toBe(false);
  });
});
