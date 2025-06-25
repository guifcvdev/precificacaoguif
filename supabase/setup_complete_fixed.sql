-- Script completo para configuração do banco de dados Supabase
-- Execute este script no SQL Editor do Supabase após limpar o banco com cleanup_database_safe.sql

-- =============================================
-- 1. CONFIGURAÇÃO INICIAL (schema_setup.sql)
-- =============================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schemas para organização lógica
CREATE SCHEMA IF NOT EXISTS config;      -- Configurações do sistema
CREATE SCHEMA IF NOT EXISTS user_data;   -- Dados específicos de usuários

-- Função para atualizar o timestamp 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 2. TABELAS DE PRODUTOS (tables_products.sql)
-- =============================================

-- Categorias de produtos
CREATE TABLE IF NOT EXISTS config.product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Produtos/serviços disponíveis
CREATE TABLE IF NOT EXISTS config.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES config.product_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  unit TEXT NOT NULL, -- m², unid, etc.
  has_minimum_price BOOLEAN DEFAULT FALSE,
  minimum_price DECIMAL(10,2) DEFAULT 0,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opções/variações de produtos
CREATE TABLE IF NOT EXISTS config.product_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES config.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, name)
);

-- Preços base definidos pelo sistema (valores padrão)
CREATE TABLE IF NOT EXISTS config.base_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_option_id UUID NOT NULL REFERENCES config.product_options(id) ON DELETE CASCADE,
  base_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_option_id)
);

-- Triggers para tabelas de produtos
CREATE TRIGGER update_product_categories_updated_at
BEFORE UPDATE ON config.product_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON config.products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_options_updated_at
BEFORE UPDATE ON config.product_options
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_base_prices_updated_at
BEFORE UPDATE ON config.base_prices
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 3. TABELAS DE DADOS DE USUÁRIOS (tables_user_data.sql)
-- =============================================

-- Perfis de usuário com informações adicionais
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  company TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Preços personalizados por usuário
CREATE TABLE IF NOT EXISTS user_data.user_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_option_id UUID NOT NULL REFERENCES config.product_options(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_option_id)
);

-- Configurações de orçamento por usuário
CREATE TABLE IF NOT EXISTS user_data.budget_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_method TEXT,
  delivery_time TEXT,
  warranty TEXT,
  tax_percentage DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Configurações de taxas de cartão
CREATE TABLE IF NOT EXISTS user_data.credit_card_fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  installments INTEGER NOT NULL,
  fee_percentage DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, installments)
);

-- Configurações de serviço de instalação por localidade
CREATE TABLE IF NOT EXISTS user_data.installation_fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  fee DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, location)
);

-- Triggers para tabelas de usuários
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_prices_updated_at
BEFORE UPDATE ON user_data.user_prices
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_settings_updated_at
BEFORE UPDATE ON user_data.budget_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_card_fees_updated_at
BEFORE UPDATE ON user_data.credit_card_fees
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_installation_fees_updated_at
BEFORE UPDATE ON user_data.installation_fees
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 4. TABELAS DE ORÇAMENTOS (tables_budgets.sql)
-- =============================================

-- Tabela de orçamentos
CREATE TABLE IF NOT EXISTS user_data.budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_company TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, sent, approved, rejected, completed
  budget_number TEXT,
  budget_date DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_percentage DECIMAL(5,2),
  tax_value DECIMAL(10,2),
  discount_percentage DECIMAL(5,2),
  discount_value DECIMAL(10,2),
  total_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  delivery_time TEXT,
  warranty TEXT,
  notes TEXT,
  installation_location TEXT,
  installation_fee DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de itens de orçamento
CREATE TABLE IF NOT EXISTS user_data.budget_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID NOT NULL REFERENCES user_data.budgets(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES config.products(id),
  product_option_id UUID REFERENCES config.product_options(id),
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  width DECIMAL(10,2),
  height DECIMAL(10,2),
  area DECIMAL(10,2),
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para observações de orçamento
CREATE TABLE IF NOT EXISTS user_data.budget_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers para tabelas de orçamentos
CREATE TRIGGER update_budgets_updated_at
BEFORE UPDATE ON user_data.budgets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_items_updated_at
BEFORE UPDATE ON user_data.budget_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_observations_updated_at
BEFORE UPDATE ON user_data.budget_observations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 5. POLÍTICAS DE SEGURANÇA (policies.sql)
-- =============================================

-- Perfis: usuários podem ver/editar apenas seu próprio perfil
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Administradores podem ver todos os perfis
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  ));

-- Configurações de produtos: apenas leitura para usuários comuns
ALTER TABLE config.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE config.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE config.product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE config.base_prices ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura de configurações de produtos
CREATE POLICY "Anyone can read product categories" 
  ON config.product_categories FOR SELECT
  USING (TRUE);

CREATE POLICY "Anyone can read products" 
  ON config.products FOR SELECT
  USING (TRUE);

CREATE POLICY "Anyone can read product options" 
  ON config.product_options FOR SELECT
  USING (TRUE);

CREATE POLICY "Anyone can read base prices" 
  ON config.base_prices FOR SELECT
  USING (TRUE);

-- Políticas para administradores editarem configurações de produtos
CREATE POLICY "Admins can manage product categories" 
  ON config.product_categories FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Admins can manage products" 
  ON config.products FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Admins can manage product options" 
  ON config.product_options FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Admins can manage base prices" 
  ON config.base_prices FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  ));

-- Preços personalizados: usuários podem gerenciar apenas seus próprios preços
ALTER TABLE user_data.user_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own prices" 
  ON user_data.user_prices FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user prices" 
  ON user_data.user_prices FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  ));

-- Configurações de orçamento: usuários podem gerenciar apenas suas próprias configurações
ALTER TABLE user_data.budget_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_data.credit_card_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_data.installation_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own budget settings" 
  ON user_data.budget_settings FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own credit card fees" 
  ON user_data.credit_card_fees FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own installation fees" 
  ON user_data.installation_fees FOR ALL
  USING (auth.uid() = user_id);

-- Políticas para administradores
CREATE POLICY "Admins can manage all budget settings" 
  ON user_data.budget_settings FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Admins can manage all credit card fees" 
  ON user_data.credit_card_fees FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Admins can manage all installation fees" 
  ON user_data.installation_fees FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  ));

-- Políticas de segurança para orçamentos
ALTER TABLE user_data.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_data.budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_data.budget_observations ENABLE ROW LEVEL SECURITY;

-- Usuários podem gerenciar apenas seus próprios orçamentos
CREATE POLICY "Users can manage their own budgets" 
  ON user_data.budgets FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own budget items" 
  ON user_data.budget_items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_data.budgets
    WHERE user_data.budgets.id = user_data.budget_items.budget_id
    AND user_data.budgets.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their own budget observations" 
  ON user_data.budget_observations FOR ALL
  USING (auth.uid() = user_id);

-- Administradores podem gerenciar todos os orçamentos
CREATE POLICY "Admins can manage all budgets" 
  ON user_data.budgets FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Admins can manage all budget items" 
  ON user_data.budget_items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Admins can manage all budget observations" 
  ON user_data.budget_observations FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  ));

-- =============================================
-- 6. FUNÇÕES AUXILIARES (functions.sql)
-- =============================================

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

-- =============================================
-- 7. DADOS INICIAIS SIMPLIFICADOS
-- =============================================

-- Inserir categorias de produtos
INSERT INTO config.product_categories (name, slug, description, display_order) VALUES
  ('Fachada', 'fachada', 'Produtos e serviços para fachadas', 1),
  ('Luminoso', 'luminoso', 'Letreiros e elementos luminosos', 2),
  ('Diversos', 'diversos', 'Outros produtos e serviços', 3)
ON CONFLICT (slug) DO NOTHING;

-- Inserir produtos básicos
DO $$
DECLARE
    fachada_id UUID;
    luminoso_id UUID;
    diversos_id UUID;
    acm_id UUID;
    acrilico_id UUID;
BEGIN
    -- Obter IDs das categorias
    SELECT id INTO fachada_id FROM config.product_categories WHERE slug = 'fachada';
    SELECT id INTO luminoso_id FROM config.product_categories WHERE slug = 'luminoso';
    SELECT id INTO diversos_id FROM config.product_categories WHERE slug = 'diversos';
    
    -- Inserir produtos de Fachada
    INSERT INTO config.products (category_id, name, slug, description, unit, has_minimum_price, minimum_price, display_order) VALUES
      (fachada_id, 'ACM', 'acm', 'Alumínio Composto', 'm²', true, 120.00, 1),
      (fachada_id, 'Acrílico', 'acrilico', 'Placas de acrílico', 'm²', true, 80.00, 2),
      (fachada_id, 'Estrutura Metálica', 'estrutura-metalica', 'Estruturas metálicas para fixação', 'kg', true, 8.00, 3)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Inserir produtos de Luminoso
    INSERT INTO config.products (category_id, name, slug, description, unit, has_minimum_price, minimum_price, display_order) VALUES
      (luminoso_id, 'LED', 'led', 'Iluminação LED para letreiros', 'm', true, 15.00, 1),
      (luminoso_id, 'Caixa de Luz', 'caixa-de-luz', 'Caixas de luz para sinalização', 'm²', true, 200.00, 2),
      (luminoso_id, 'Neon Flex', 'neon-flex', 'Fitas de LED Neon Flex', 'm', true, 25.00, 3)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Inserir produtos Diversos
    INSERT INTO config.products (category_id, name, slug, description, unit, has_minimum_price, minimum_price, display_order) VALUES
      (diversos_id, 'Plotagem', 'plotagem', 'Impressão e plotagem de adesivos', 'm²', true, 35.00, 1),
      (diversos_id, 'Instalação', 'instalacao', 'Serviços de instalação', 'unid', true, 150.00, 2),
      (diversos_id, 'Projeto', 'projeto', 'Desenvolvimento de projetos', 'unid', true, 300.00, 3)
    ON CONFLICT (slug) DO NOTHING;
    
    -- Obter IDs dos produtos ACM e Acrílico
    SELECT id INTO acm_id FROM config.products WHERE slug = 'acm';
    SELECT id INTO acrilico_id FROM config.products WHERE slug = 'acrilico';
    
    -- Inserir opções para ACM
    INSERT INTO config.product_options (product_id, name, description, unit, display_order) VALUES
      (acm_id, 'ACM 3mm', 'ACM espessura 3mm', 'm²', 1),
      (acm_id, 'ACM 4mm', 'ACM espessura 4mm', 'm²', 2),
      (acm_id, 'ACM 6mm', 'ACM espessura 6mm', 'm²', 3)
    ON CONFLICT (product_id, name) DO NOTHING;
    
    -- Inserir opções para Acrílico
    INSERT INTO config.product_options (product_id, name, description, unit, display_order) VALUES
      (acrilico_id, 'Acrílico 3mm', 'Acrílico cristal 3mm', 'm²', 1),
      (acrilico_id, 'Acrílico 5mm', 'Acrílico cristal 5mm', 'm²', 2),
      (acrilico_id, 'Acrílico 8mm', 'Acrílico cristal 8mm', 'm²', 3),
      (acrilico_id, 'Acrílico Colorido', 'Acrílico colorido diversas cores', 'm²', 4)
    ON CONFLICT (product_id, name) DO NOTHING;
    
    -- Inserir preços base para ACM
    INSERT INTO config.base_prices (product_option_id, base_price)
    SELECT po.id, 
           CASE po.name
               WHEN 'ACM 3mm' THEN 120.00
               WHEN 'ACM 4mm' THEN 140.00
               WHEN 'ACM 6mm' THEN 180.00
           END
    FROM config.product_options po
    JOIN config.products p ON p.id = po.product_id
    WHERE p.slug = 'acm'
    ON CONFLICT (product_option_id) DO NOTHING;
    
    -- Inserir preços base para Acrílico
    INSERT INTO config.base_prices (product_option_id, base_price)
    SELECT po.id, 
           CASE po.name
               WHEN 'Acrílico 3mm' THEN 80.00
               WHEN 'Acrílico 5mm' THEN 100.00
               WHEN 'Acrílico 8mm' THEN 130.00
               WHEN 'Acrílico Colorido' THEN 95.00
           END
    FROM config.product_options po
    JOIN config.products p ON p.id = po.product_id
    WHERE p.slug = 'acrilico'
    ON CONFLICT (product_option_id) DO NOTHING;
    
END $$;

-- Confirmação
SELECT 'Configuração do banco de dados concluída com sucesso!' AS message; 