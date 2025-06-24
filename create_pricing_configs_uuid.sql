-- Criar tabela pricing_configs com UUID como primary key
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS pricing_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_data JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar função para atualizar o timestamp 'updated_at'
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar o timestamp 'updated_at'
DROP TRIGGER IF EXISTS update_pricing_configs_updated_at ON pricing_configs;
CREATE TRIGGER update_pricing_configs_updated_at
BEFORE UPDATE ON pricing_configs
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE pricing_configs ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir acesso anônimo (para testes)
CREATE POLICY "Allow anonymous select" ON pricing_configs FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON pricing_configs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON pricing_configs FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete" ON pricing_configs FOR DELETE USING (true); 