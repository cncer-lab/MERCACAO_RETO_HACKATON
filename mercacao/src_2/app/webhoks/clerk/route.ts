import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Inicializamos Supabase usando la Service Role Key para tener permisos de escritura (bypass de seguridad)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  // 1. Obtener el secreto del webhook desde las variables de entorno
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Por favor agrega CLERK_WEBHOOK_SECRET en tu .env.local');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Faltan los headers de svix', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verificando el webhook:', err);
    return new Response('Error interno', { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const correo = email_addresses[0]?.email_address;
    const nombreCompleto = `${first_name || ''} ${last_name || ''}`.trim();

    const { error } = await supabase.from('perfiles').insert({
      id: id, 
      nombre: nombreCompleto || 'Usuario Nuevo',
      email: correo,
      rol: 'cliente' 
    });

    if (error) {
      console.error('Error insertando en Supabase:', error);
      return new Response('Error guardando en base de datos', { status: 500 });
    }
    
    console.log(`Usuario ${id} creado exitosamente en Supabase`);
  }

  return new Response('', { status: 200 });
}