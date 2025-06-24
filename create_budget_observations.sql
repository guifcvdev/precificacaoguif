-- Criar tabela para as observações do orçamento
CREATE TABLE IF NOT EXISTS budget_observations (
  id SERIAL PRIMARY KEY,
  payment_method TEXT,
  delivery_time TEXT,
  warranty TEXT
); 