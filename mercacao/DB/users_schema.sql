
DO $$ BEGIN
    CREATE TYPE rol_usuario AS ENUM ('operador', 'admin', 'cliente', 'usuario');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPEs estado_lote AS ENUM ('pendiente', 'liberado', 'bloqueado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE tipo_etapa AS ENUM ('fermentado', 'secado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS perfiles (
    usuario_id TEXT PRIMARY KEY,
    rol rol_usuario NOT NULL DEFAULT 'operador'
);

CREATE TABLE IF NOT EXISTS lotes (
    id TEXT PRIMARY KEY,
    productor TEXT NOT NULL,
    origen TEXT NOT NULL,
    fecha TEXT NOT NULL,
    cantidad_recibida NUMERIC NOT NULL CHECK (cantidad_recibida > 0),
    unidad TEXT NOT NULL,
    disponible NUMERIC NOT NULL CHECK (disponible >= 0),
    estado estado_lote NOT NULL DEFAULT 'pendiente',
    motivo_estado TEXT
);

CREATE TABLE IF NOT EXISTS etapas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    responsable TEXT NOT NULL,
    fecha TEXT NOT NULL,
    tipo tipo_etapa NOT NULL,
    salida_kg NUMERIC CHECK (salida_kg >= 0),
    incidencias TEXT,
    justificacion TEXT,
    costo_total NUMERIC CHECK (costo_total >= 0),
    creado_por TEXT REFERENCES perfiles(usuario_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS etapa_entradas (
    etapa_id UUID REFERENCES etapas(id) ON DELETE CASCADE,
    lotes_id TEXT REFERENCES lotes(id) ON DELETE CASCADE,
    cantidad_consumida NUMERIC NOT NULL CHECK (cantidad_consumida > 0),
    PRIMARY KEY (etapa_id, lotes_id)
);

CREATE TABLE IF NOT EXISTS productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    etapa_id UUID REFERENCES etapas(id) ON DELETE CASCADE,
    estado estado_lote NOT NULL DEFAULT 'pendiente',
    precio NUMERIC CHECK (precio >= 0),
    motivo_estado TEXT
);

CREATE TABLE IF NOT EXISTS control_salida (
    clave TEXT PRIMARY KEY,
    etapa_id UUID REFERENCES etapas(id) ON DELETE CASCADE,
    resultados JSONB,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id TEXT REFERENCES perfiles(usuario_id) ON DELETE SET NULL,
    fecha TIMESTAMPTZ DEFAULT NOW(),
    tabla TEXT NOT NULL,
    registro_id TEXT,
    valor_anterior JSONB,
    valor_nuevo JSONB
);

CREATE INDEX IF NOT EXISTS idx_etapas_creado_por ON etapas(creado_por);
CREATE INDEX IF NOT EXISTS idx_etapas_entrada_lote ON etapa_entradas(lotes_id);
CREATE INDEX IF NOT EXISTS idx_productos_etapa ON productos(etapa_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria(usuario_id);