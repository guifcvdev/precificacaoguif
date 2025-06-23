-- Criar tabela de configurações com estrutura mínima
CREATE TABLE IF NOT EXISTS pricing_configs (
  id SERIAL PRIMARY KEY,
  config_data JSONB,
  is_default BOOLEAN DEFAULT false
); 