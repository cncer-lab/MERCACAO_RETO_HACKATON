import { describe, it, expect } from 'vitest'
import { puedeRealizar } from '../lib/permisos.js'

describe('puedeRealizar', () => {
  it('operador puede recibir lotes y registrar etapas', () => {
    expect(puedeRealizar('operador', 'recibir_lote')).toBe(true)
    expect(puedeRealizar('operador', 'registrar_etapa')).toBe(true)
  })
  it('operador NO puede liberar ni bloquear (caso 403)', () => {
    expect(puedeRealizar('operador', 'cambiar_estado')).toBe(false)
  })
  it('operador NO ve costos, auditoría ni exporta', () => {
    expect(puedeRealizar('operador', 'ver_costos')).toBe(false)
    expect(puedeRealizar('operador', 'ver_auditoria')).toBe(false)
    expect(puedeRealizar('operador', 'exportar_csv')).toBe(false)
  })
  it('admin puede cambiar estado, ver costos y exportar', () => {
    expect(puedeRealizar('admin', 'cambiar_estado')).toBe(true)
    expect(puedeRealizar('admin', 'ver_costos')).toBe(true)
    expect(puedeRealizar('admin', 'exportar_csv')).toBe(true)
  })
  it('rol o acción desconocidos se deniegan', () => {
    expect(puedeRealizar('invitado', 'recibir_lote')).toBe(false)
    expect(puedeRealizar(undefined, 'recibir_lote')).toBe(false)
    expect(puedeRealizar('admin', 'accion_inventada')).toBe(false)
  })
})
