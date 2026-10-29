CREATE TABLE IF NOT EXISTS felicitaciones (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_felicitaciones_created_at
ON felicitaciones(created_at DESC);
