export const PERMISOS = {
  recibir_lote: ['operador', 'admin'],
  registrar_etapa: ['operador', 'admin'],
  ver_costos: ['admin'],
  cambiar_estado: ['admin'],
  ver_auditoria: ['admin'],
  exportar_csv: ['admin'],
}

export function puedeRealizar(rol, accion) {
  const permitidos = PERMISOS[accion]
  if (!permitidos) return false
  return permitidos.includes(rol)
}
