import 'server-only'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from './supabase-admin'
import { puedeRealizar } from './permisos'
import { error } from './respuestas'

export async function exigirPermiso(accion) {
  const { userId } = await auth()
  if (!userId) return { falla: error('Debes iniciar sesión', 401) }

  const { data: perfil } = await supabaseAdmin
    .from('perfiles')
    .select('rol')
    .eq('id', userId)
    .single()

  if (!perfil || !puedeRealizar(perfil.rol, accion)) {
    return { falla: error('No tienes permiso para esta acción', 403) }
  }
  return { userId, rol: perfil.rol }
}
