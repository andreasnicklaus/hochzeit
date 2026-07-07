CREATE TABLE IF NOT EXISTS rsvps (
  id                SERIAL PRIMARY KEY,
  name              VARCHAR(200) NOT NULL,
  attending         BOOLEAN NOT NULL,
  food_preference   TEXT DEFAULT '',
  additional_guests JSONB DEFAULT '[]'::jsonb,
  message           TEXT DEFAULT '',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  ignored           BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps (created_at DESC);
