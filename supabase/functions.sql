-- Funções auxiliares para o banco de dados

-- Função para copiar preços base para um novo usuário
CREATE OR REPLACE FUNCTION initialize_user_prices(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_data.user_prices (user_id, product_option_id, price)
  SELECT user_uuid, bp.product_option_id, bp.base_price
  FROM config.base_prices bp;
END;
$$ LANGUAGE plpgsql;

-- Função para inicializar configurações de orçamento para um novo usuário
CREATE OR REPLACE FUNCTION initialize_budget_settings(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_data.budget_settings (
    user_id, 
    payment_method, 
    delivery_time, 
    warranty, 
    tax_percentage
  ) VALUES (
    user_uuid,
    '- Entrada de 50% do valor e restante na retirada.
- Parcelado no cartão a combinar.',
    '- Entrega do pedido em 7 úteis após a aprovação de arte e pagamento.',
    '*GARANTIA DE 3 MESES PARA O SERVIÇO ENTREGUE CONFORME A LEI Nº 8.078, DE 11 DE SETEMBRO DE 1990. Art. 26.',
    15.0
  );
END;
$$ LANGUAGE plpgsql;

-- Função para inicializar taxas de cartão de crédito para um novo usuário
CREATE OR REPLACE FUNCTION initialize_credit_card_fees(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_data.credit_card_fees (user_id, installments, fee_percentage)
  VALUES
    (user_uuid, 3, 5.0),
    (user_uuid, 6, 8.0),
    (user_uuid, 12, 12.0);
END;
$$ LANGUAGE plpgsql;

-- Função para inicializar taxas de instalação para um novo usuário
CREATE OR REPLACE FUNCTION initialize_installation_fees(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_data.installation_fees (user_id, location, fee)
  VALUES
    (user_uuid, 'Jacareí', 100.00),
    (user_uuid, 'São José dos Campos', 120.00),
    (user_uuid, 'Caçapava/Taubaté', 150.00),
    (user_uuid, 'Litoral', 200.00),
    (user_uuid, 'Guararema/Santa Isabel', 180.00),
    (user_uuid, 'Santa Branca', 160.00),
    (user_uuid, 'São Paulo', 250.00);
END;
$$ LANGUAGE plpgsql;

-- Função para inicializar todos os dados para um novo usuário
CREATE OR REPLACE FUNCTION initialize_user_data(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  -- Criar perfil do usuário
  INSERT INTO public.profiles (id, name, company, is_admin)
  VALUES (user_uuid, NULL, NULL, FALSE)
  ON CONFLICT (id) DO NOTHING;
  
  -- Inicializar preços
  PERFORM initialize_user_prices(user_uuid);
  
  -- Inicializar configurações de orçamento
  PERFORM initialize_budget_settings(user_uuid);
  
  -- Inicializar taxas de cartão
  PERFORM initialize_credit_card_fees(user_uuid);
  
  -- Inicializar taxas de instalação
  PERFORM initialize_installation_fees(user_uuid);
END;
$$ LANGUAGE plpgsql;

-- Trigger para inicializar dados quando um novo usuário é criado
CREATE OR REPLACE FUNCTION on_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM initialize_user_data(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar o trigger na tabela auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION on_auth_user_created(); 