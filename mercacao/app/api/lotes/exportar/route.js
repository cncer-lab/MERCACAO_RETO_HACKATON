import { z } from 'zod';
import { exigirPermiso } from '@/lib/auth';
import { error } from '@/lib/respuestas';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { esquemaFiltrosLote } from '@/lib/validaciones/lote';
import { aCSV, costoPorLote } from '@/lib/exportacion';

const COLUMNAS = [
  { titulo: 'id', campo: 'id' },
  { titulo: 'origen', campo: 'origen' },
  { titulo: 'cantidad_recibida_kg', campo: 'cantidad_recibida' },
  { titulo: 'consumido_kg', campo: 'consumido' },
  { titulo: 'disponible_kg', campo: 'disponible' },
  { titulo: 'estado', campo: 'estado' },
  { titulo: 'costo_total_cop', campo: 'costo_total' },
];

export async function GET(request) {
  const { falla } = await exigirPermiso('exportar_csv');
  if (falla) return falla;

  const params = Object.fromEntries(new URL(request.url).searchParams);
  const filtros = esquemaFiltrosLote.safeParse(params);
  if (!filtros.success) {
    return error('Filtros inválidos', 400, z.flattenError(filtros.error));
  }

  const { origen, estado } = filtros.data;
  let consulta = supabaseAdmin.from('lotes').select('*').order('id');
  if (origen) {
    const seguro = origen.replace(/[\\%_]/g, '\\$&');
    consulta = consulta.ilike('origen', seguro);
  }
  if (estado) consulta = consulta.eq('estado', estado);

  const { data: lotes, error: errLotes } = await consulta;
  if (errLotes) {
    console.error('Error al exportar lotes:', errLotes);
    return error('No se pudieron consultar los lotes', 500);
  }

  const { data: entradas, error: errEntradas } = await supabaseAdmin
    .from('etapa_entradas')
    .select('etapa_id, lotes_id, cantidad_consumida, etapas(costo_total)');
  if (errEntradas) {
    console.error('Error al leer costos:', errEntradas);
    return error('No se pudieron calcular los costos', 500);
  }

  const costos = costoPorLote(entradas);
  const filas = lotes.map((l) => ({
    ...l,
    consumido: Number(l.cantidad_recibida) - Number(l.disponible),
    costo_total: Math.round((costos[l.id] ?? 0) * 100) / 100,
  }));

  const csv = '\uFEFF' + aCSV(filas, COLUMNAS);
  const fecha = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="lotes_${fecha}.csv"`,
    },
  });
}
