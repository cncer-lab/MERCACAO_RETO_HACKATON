const UMBRAL_MERMA = 15

export function calcularMerma(entrada, salida, justificacion = '') {
  if (!Number.isFinite(entrada) || entrada <= 0) {
    return { ok: false, mensaje: 'La entrada debe ser mayor que 0' }
  }
  if (!Number.isFinite(salida) || salida < 0) {
    return { ok: false, mensaje: 'La salida no puede ser negativa' }
  }
  if (salida > entrada && !String(justificacion).trim()) {
    return { ok: false, mensaje: 'Una salida mayor que la entrada requiere una justificación' }
  }
  const merma = ((entrada - salida) * 100) / entrada
  const alerta = merma > UMBRAL_MERMA
  return {
    ok: true,
    merma,
    alerta,
    explicacion: alerta
      ? `La merma es ${merma}%, mayor que el límite de ${UMBRAL_MERMA}%.`
      : `La merma es ${merma}%, dentro del límite de ${UMBRAL_MERMA}%.`,
  }
}

export function calcularCostoUnitario(costoTotal, salidaVendible) {
  if (!Number.isFinite(costoTotal) || costoTotal < 0) {
    return { ok: false, mensaje: 'El costo total no puede ser negativo' }
  }
  if (!Number.isFinite(salidaVendible) || salidaVendible <= 0) {
    return { ok: false, mensaje: 'No se puede calcular el costo unitario con salida de 0 kg' }
  }
  return { ok: true, costoUnitario: costoTotal / salidaVendible }
}

export function calcularMargen(precio, costoUnitario) {
  if (!Number.isFinite(precio) || precio <= 0) {
    return { ok: false, mensaje: 'El precio debe ser mayor que 0' }
  }
  if (!Number.isFinite(costoUnitario) || costoUnitario < 0) {
    return { ok: false, mensaje: 'El costo unitario no puede ser negativo' }
  }
  return { ok: true, margen: ((precio - costoUnitario) * 100) / precio }
}
