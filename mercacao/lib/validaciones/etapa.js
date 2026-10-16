import { z } from 'zod';

const textoObligatorio = (campo) =>
  z
    .string({ error: `${campo} es obligatorio` })
    .trim()
    .min(1, { error: `${campo} es obligatorio` });

const entrada = z.object({
  lote_id: textoObligatorio('El lote'),
  cantidad: z.coerce
    .number({ error: 'La cantidad consumida debe ser un número' })
    .positive({ error: 'La cantidad consumida debe ser mayor que cero' }),
});

export const esquemaEtapa = z.object({
  clave: z
    .string({ error: 'La clave de operación es obligatoria' })
    .trim()
    .min(8, { error: 'La clave de operación es muy corta (mínimo 8)' })
    .max(100),
  tipo: z.enum(['fermentado', 'secado'], {
    error: 'El tipo debe ser fermentado o secado',
  }),
  responsable: textoObligatorio('El responsable'),
  fecha: z.iso.date({ error: 'La fecha debe tener formato AAAA-MM-DD' }),
  salida_kg: z.coerce
    .number({ error: 'La salida debe ser un número' })
    .min(0, { error: 'La salida no puede ser negativa' }),
  costo_total: z.coerce
    .number({ error: 'El costo debe ser un número' })
    .min(0, { error: 'El costo no puede ser negativo' }),
  incidencias: z.string().trim().max(500).optional(),
  justificacion: z.string().trim().max(500).optional(),
  entradas: z
    .array(entrada, { error: 'Debes indicar al menos un lote de entrada' })
    .min(1, { error: 'Debes indicar al menos un lote de entrada' })
    .refine((lista) => new Set(lista.map((e) => e.lote_id)).size === lista.length, {
      error: 'No repitas el mismo lote en las entradas',
    }),
});
