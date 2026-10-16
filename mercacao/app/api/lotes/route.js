import { z } from 'zod';
import { exigirPermiso } from '@/lib/auth';
import { ok, error } from '@/lib/respuestas';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { esquemaLote } from '@/lib/validaciones/lote';

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
