import { describe, it, expect } from 'vitest';
import { esquemaFiltrosAuditoria } from '../lib/validaciones/lote.js';
import { puedeRealizar } from '../lib/permisos.js';

describe('esquemaFiltrosAuditoria', () => {
  it('aplica valores por defecto', () => {
    const r = esquemaFiltrosAuditoria.safeParse({});
    expect(r.success).toBe(true);
    expect(r.data.limite).toBe(50);
    expect(r.data.pagina).toBe(1);
  });
  it('rechaza tabla desconocida y límite excesivo', () => {
    expect(esquemaFiltrosAuditoria.safeParse({ tabla: 'perfiles' }).success).toBe(false);
    expect(esquemaFiltrosAuditoria.safeParse({ limite: 5000 }).success).toBe(false);
  });
});

describe('permiso ver_auditoria', () => {
  it('solo el admin', () => {
    expect(puedeRealizar('admin', 'ver_auditoria')).toBe(true);
    expect(puedeRealizar('operador', 'ver_auditoria')).toBe(false);
  });
});
