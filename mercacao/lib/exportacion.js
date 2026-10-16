const PELIGROSOS = /^[=+\-@\t\r]/;

function celda(valor) {
  if (valor === null || valor === undefined) return '';
  let texto = String(valor);
  if (typeof valor === 'string' && PELIGROSOS.test(texto)) texto = `'${texto}`;
  if (/[",\n\r]/.test(texto)) texto = `"${texto.replace(/"/g, '""')}"`;
  return texto;
}

export function aCSV(filas, columnas) {
  const encabezado = columnas.map((c) => celda(c.titulo)).join(',');
  const cuerpo = filas.map((f) => columnas.map((c) => celda(f[c.campo])).join(','));
  return [encabezado, ...cuerpo].join('\r\n') + '\r\n';
}

export function costoPorLote(entradas) {
  const totalPorEtapa = {};
  for (const e of entradas) {
    totalPorEtapa[e.etapa_id] =
      (totalPorEtapa[e.etapa_id] ?? 0) + Number(e.cantidad_consumida);
  }
  const costos = {};
  for (const e of entradas) {
    const costoEtapa = Number(e.etapas?.costo_total ?? 0);
    const total = totalPorEtapa[e.etapa_id];
    const parte = total > 0 ? (Number(e.cantidad_consumida) / total) * costoEtapa : 0;
    costos[e.lotes_id] = (costos[e.lotes_id] ?? 0) + parte;
  }
  return costos;
}
