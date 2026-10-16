import { z } from 'zod';
import { exigirPermiso } from '@/lib/auth';
import { ok, error } from '@/lib/respuestas';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { esquemaFiltrosAuditoria } from '@/lib/validaciones/lote';

export async function GET(request) {
  const { falla } = await exigirPermiso('ver_auditoria');
  if (falla) return falla;

  const params = Object.fromEntries(new URL(request.url).searchParams);
  const filtros = esquemaFiltrosAuditoria.safeParse(params);
  if (!filtros.success) {
    return error('Filtros inválidos', 400, z.flattenError(filtros.error));
  }

  const { tabla, registro_id, limite, pagina } = filtros.data;
  const desde = (pagina - 1) * limite;

  let consulta = supabaseAdmin
    .from('auditoria')
    .select('*', { count: 'exact' })
    .order('fecha', { ascending: false })
    .range(desde, desde + limite - 1);
  if (tabla) consulta = consulta.eq('tabla', tabla);
  if (registro_id) consulta = consulta.eq('registro_id', registro_id);

  const { data, error: errorBd, count } = await consulta;
  if (errorBd) {
    console.error('Error al leer auditoría:', errorBd);
    return error('No se pudo consultar la auditoría', 500);
  }

  return ok({ total: count, pagina, limite, registros: data });
}
