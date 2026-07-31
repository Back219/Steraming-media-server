-- SQLite schema for a simple media index.
CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  title TEXT,
  file_path TEXT NOT NULL,
  extension TEXT,
  size INTEGER,
  mtime INTEGER,
  tmdb_id INTEGER,
  metadata_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_media_title ON media(title);
CREATE INDEX IF NOT EXISTS idx_media_mtime ON media(mtime);
