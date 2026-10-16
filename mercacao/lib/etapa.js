import {
  calcularMerma,
  calcularCostoUnitario,
  calcularMargen,
} from './calculos.js';

// Evalúa una etapa ya validada. No toca la base de datos.
// precio es opcional: sin precio no se calcula margen.
export function evaluarEtapa({ entradas, salida_kg, costo_total, justificacion, precio }) {
  const entradaTotal = entradas.reduce((suma, e) => suma + Number(e.cantidad), 0);

  const merma = calcularMerma(entradaTotal, salida_kg, justificacion);
  if (!merma.ok) return { ok: false, campo: 'salida_kg', mensaje: merma.mensaje };

  const costo = calcularCostoUnitario(costo_total, salida_kg);
  const resultado = {
    ok: true,
    entrada_total: entradaTotal,
    merma: merma.merma,
    alerta: merma.alerta,
    explicacion_merma: merma.explicacion,
    costo_unitario: null,
    margen: null,
    aviso_costo: null,
    aviso_margen: null,
  };

  if (!costo.ok) {
    resultado.aviso_costo = costo.mensaje;
    return resultado;
  }
  resultado.costo_unitario = costo.costoUnitario;

  if (precio !== undefined && precio !== null) {
    const margen = calcularMargen(Number(precio), costo.costoUnitario);
    if (margen.ok) resultado.margen = margen.margen;
    else resultado.aviso_margen = margen.mensaje;
  }
  return resultado;
}
