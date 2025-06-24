-- Criar tabela budget_observations com UUID como primary key
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS budget_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_method TEXT,
  delivery_time TEXT,
  warranty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar função para atualizar o timestamp 'updated_at' (se ainda não existir)
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar o timestamp 'updated_at'
DROP TRIGGER IF EXISTS update_budget_observations_updated_at ON budget_observations;
CREATE TRIGGER update_budget_observations_updated_at
BEFORE UPDATE ON budget_observations
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE budget_observations ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir acesso anônimo (para testes)
CREATE POLICY "Allow anonymous select" ON budget_observations FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON budget_observations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON budget_observations FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete" ON budget_observations FOR DELETE USING (true); 