'use server';

import { supabase } from '@/lib/supabase';

export async function verificarConexion() {

  const { data, error } = await supabase.from('lotes').select('*').limit(5);

  if (error) {
    return { exito: false, mensaje: error.message };
  }

  return { exito: true, datos: data };
}