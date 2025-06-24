-- Script SQL simples para criar a tabela budget_observations
CREATE TABLE IF NOT EXISTS budget_observations (
  id SERIAL PRIMARY KEY,
  payment_method TEXT,
  delivery_time TEXT,
  warranty TEXT
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE budget_observations ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir acesso anônimo
CREATE POLICY "Allow anonymous select" ON budget_observations FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON budget_observations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON budget_observations FOR UPDATE USING (true);

-- Inserir dados padrão se a tabela estiver vazia
INSERT INTO budget_observations (id, payment_method, delivery_time, warranty)
SELECT 1, 
       '- Entrada de 50% do valor e restante na retirada.
- Parcelado no cartão a combinar.', 
       '- Entrega do pedido em 7 úteis após a aprovação de arte e pagamento.', 
       '*GARANTIA DE 3 MESES PARA O SERVIÇO ENTREGUE CONFORME A LEI Nº 8.078, DE 11 DE SETEMBRO DE 1990. Art. 26.'
WHERE NOT EXISTS (SELECT 1 FROM budget_observations WHERE id = 1); 