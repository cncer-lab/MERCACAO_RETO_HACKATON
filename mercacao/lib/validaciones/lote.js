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

export const esquemaFiltrosLote = z.object({
  origen: z
    .string()
    .trim()
    .max(60, { error: 'El origen es muy largo (máximo 60)' })
    .optional()
    .transform((v) => (v ? v : undefined)),
  estado: z
    .enum(['pendiente', 'liberado', 'bloqueado'], {
      error: 'El estado debe ser pendiente, liberado o bloqueado',
    })
    .optional(),
});

export const esquemaFiltrosAuditoria = z.object({
  tabla: z.enum(['lotes', 'etapas', 'productos']).optional(),
  registro_id: z.string().trim().max(60).optional(),
  limite: z.coerce.number().int().min(1).max(200).default(50),
  pagina: z.coerce.number().int().min(1).default(1),
});
