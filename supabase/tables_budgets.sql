-- Tabelas para orçamentos e itens de orçamento

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

-- Triggers para atualização automática do campo updated_at
CREATE TRIGGER update_budgets_updated_at
BEFORE UPDATE ON user_data.budgets
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_items_updated_at
BEFORE UPDATE ON user_data.budget_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_observations_updated_at
BEFORE UPDATE ON user_data.budget_observations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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