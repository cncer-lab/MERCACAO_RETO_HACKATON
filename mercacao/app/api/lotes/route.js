import { z } from 'zod';
import { exigirPermiso } from '@/lib/auth';
import { ok, error } from '@/lib/respuestas';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { esquemaLote, esquemaFiltrosLote } from '@/lib/validaciones/lote';

export async function POST(request) {
  const { falla } = await exigirPermiso('recibir_lote');
  if (falla) return falla;

  let cuerpo;
  try {
    cuerpo = await request.json();
  } catch {
    return error('El cuerpo de la petición debe ser JSON válido', 400);
  }

  const resultado = esquemaLote.safeParse(cuerpo);
  if (!resultado.success) {
    return error('Datos inválidos', 400, z.flattenError(resultado.error));
  }

  const datos = resultado.data;
  const { data, error: errorBd } = await supabaseAdmin
    .from('lotes')
    .insert({ ...datos, disponible: datos.cantidad })
    .select()
    .single();

  if (errorBd) {
    if (errorBd.code === '23505') {
      return error(`Ya existe un lote con el identificador ${datos.id}`, 409);
    }
    console.error('Error al crear lote:', errorBd);
    return error('No se pudo guardar el lote', 500);
  }

  return ok(data, 201);
}

export async function GET(request) {
  const { falla } = await exigirPermiso('ver_lotes');
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

  const { data, error: errorBd } = await consulta;
  if (errorBd) {
    console.error('Error al listar lotes:', errorBd);
    return error('No se pudieron consultar los lotes', 500);
  }

  return ok(data);
}
