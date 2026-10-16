import { z } from 'zod';

const texto = (campo) =>
  z
    .string({ error: `${campo} es obligatorio` })
    .trim()
    .min(1, { error: `${campo} es obligatorio` });

export const esquemaLote = z.object({
  id: texto('El identificador')
    .max(30, { error: 'El identificador es muy largo (máximo 30)' })
    .regex(/^[A-Za-z0-9_-]+$/, {
      error: 'El identificador solo admite letras, números, guion y guion bajo',
    }),
  productor: texto('El productor'),
  origen: texto('El origen'),
  fecha: z.iso.date({ error: 'La fecha debe tener formato AAAA-MM-DD' }),
  cantidad: z.coerce
    .number({ error: 'La cantidad debe ser un número' })
    .positive({ error: 'La cantidad debe ser mayor que cero' }),
  unidad: texto('La unidad'),
});
