-- Políticas de segurança (RLS) para as tabelas

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