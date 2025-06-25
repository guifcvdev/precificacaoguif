-- Script de limpeza SEGURO para o banco de dados Supabase
-- Este script evita modificar tabelas e schemas do sistema Supabase

-- =============================================
-- LIMPEZA SEGURA - APENAS DADOS PERSONALIZADOS
-- =============================================

-- 1. Remover triggers personalizados específicos
DROP TRIGGER IF EXISTS update_product_categories_updated_at ON config.product_categories;
DROP TRIGGER IF EXISTS update_products_updated_at ON config.products;
DROP TRIGGER IF EXISTS update_product_options_updated_at ON config.product_options;
DROP TRIGGER IF EXISTS update_base_prices_updated_at ON config.base_prices;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_user_prices_updated_at ON user_data.user_prices;
DROP TRIGGER IF EXISTS update_budget_settings_updated_at ON user_data.budget_settings;
DROP TRIGGER IF EXISTS update_credit_card_fees_updated_at ON user_data.credit_card_fees;
DROP TRIGGER IF EXISTS update_installation_fees_updated_at ON user_data.installation_fees;
DROP TRIGGER IF EXISTS update_budgets_updated_at ON user_data.budgets;
DROP TRIGGER IF EXISTS update_budget_items_updated_at ON user_data.budget_items;
DROP TRIGGER IF EXISTS update_budget_observations_updated_at ON user_data.budget_observations;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Remover políticas RLS específicas (apenas nossas políticas)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can read product categories" ON config.product_categories;
DROP POLICY IF EXISTS "Anyone can read products" ON config.products;
DROP POLICY IF EXISTS "Anyone can read product options" ON config.product_options;
DROP POLICY IF EXISTS "Anyone can read base prices" ON config.base_prices;
DROP POLICY IF EXISTS "Admins can manage product categories" ON config.product_categories;
DROP POLICY IF EXISTS "Admins can manage products" ON config.products;
DROP POLICY IF EXISTS "Admins can manage product options" ON config.product_options;
DROP POLICY IF EXISTS "Admins can manage base prices" ON config.base_prices;
DROP POLICY IF EXISTS "Users can manage their own prices" ON user_data.user_prices;
DROP POLICY IF EXISTS "Admins can manage all user prices" ON user_data.user_prices;
DROP POLICY IF EXISTS "Users can manage their own budget settings" ON user_data.budget_settings;
DROP POLICY IF EXISTS "Users can manage their own credit card fees" ON user_data.credit_card_fees;
DROP POLICY IF EXISTS "Users can manage their own installation fees" ON user_data.installation_fees;
DROP POLICY IF EXISTS "Admins can manage all budget settings" ON user_data.budget_settings;
DROP POLICY IF EXISTS "Admins can manage all credit card fees" ON user_data.credit_card_fees;
DROP POLICY IF EXISTS "Admins can manage all installation fees" ON user_data.installation_fees;
DROP POLICY IF EXISTS "Users can manage their own budgets" ON user_data.budgets;
DROP POLICY IF EXISTS "Users can manage their own budget items" ON user_data.budget_items;
DROP POLICY IF EXISTS "Users can manage their own budget observations" ON user_data.budget_observations;
DROP POLICY IF EXISTS "Admins can manage all budgets" ON user_data.budgets;
DROP POLICY IF EXISTS "Admins can manage all budget items" ON user_data.budget_items;
DROP POLICY IF EXISTS "Admins can manage all budget observations" ON user_data.budget_observations;

-- 3. Remover tabelas personalizadas em ordem (FK constraints)
DROP TABLE IF EXISTS user_data.budget_items CASCADE;
DROP TABLE IF EXISTS user_data.budgets CASCADE;
DROP TABLE IF EXISTS user_data.budget_observations CASCADE;
DROP TABLE IF EXISTS user_data.installation_fees CASCADE;
DROP TABLE IF EXISTS user_data.credit_card_fees CASCADE;
DROP TABLE IF EXISTS user_data.budget_settings CASCADE;
DROP TABLE IF EXISTS user_data.user_prices CASCADE;

DROP TABLE IF EXISTS config.base_prices CASCADE;
DROP TABLE IF EXISTS config.product_options CASCADE;
DROP TABLE IF EXISTS config.products CASCADE;
DROP TABLE IF EXISTS config.product_categories CASCADE;

-- Remover apenas a tabela profiles personalizada (não a do sistema)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Remover tabelas antigas que podem existir
DROP TABLE IF EXISTS public.pricing_configs CASCADE;
DROP TABLE IF EXISTS public.budget_observations CASCADE;

-- 4. Remover schemas personalizados
DROP SCHEMA IF EXISTS config CASCADE;
DROP SCHEMA IF EXISTS user_data CASCADE;

-- 5. Remover funções personalizadas específicas
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.initialize_user_prices(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.initialize_budget_settings(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.initialize_credit_card_fees(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.initialize_installation_fees(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.initialize_user_data(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.on_auth_user_created() CASCADE;

-- 6. Limpar dados de usuários de teste (OPCIONAL - descomente se necessário)
-- CUIDADO: Isso remove todos os usuários cadastrados exceto admin!
-- DELETE FROM auth.users WHERE email NOT LIKE '%@admin.com' AND email NOT LIKE '%@supabase.io';

-- 7. Confirmar limpeza
SELECT 'Banco de dados limpo com sucesso! Execute setup_complete.sql para recriar a estrutura.' AS message;

-- 8. Verificar o que sobrou
SELECT 'Verificando schemas restantes...' AS info;
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname IN ('public', 'config', 'user_data')
ORDER BY schemaname, tablename; 