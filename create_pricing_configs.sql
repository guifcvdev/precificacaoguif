CREATE TABLE IF NOT EXISTS pricing_configs (
  id SERIAL PRIMARY KEY,
  config_data JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Remover política existente se já existir
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'pricing_configs' 
    AND policyname = 'pricing_configs_anon_access'
  ) THEN
    DROP POLICY pricing_configs_anon_access ON pricing_configs;
  END IF;
END
$$;

-- Criar política de segurança para permitir acesso anônimo (temporariamente)
CREATE POLICY pricing_configs_anon_access ON pricing_configs
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Habilitar RLS na tabela
ALTER TABLE pricing_configs ENABLE ROW LEVEL SECURITY;