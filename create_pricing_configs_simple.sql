-- Criar tabela de configurações
CREATE TABLE IF NOT EXISTS pricing_configs (
  id SERIAL PRIMARY KEY,
  config_data JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Desabilitar RLS temporariamente para facilitar o acesso
ALTER TABLE pricing_configs DISABLE ROW LEVEL SECURITY; 