-- Script para limpar completamente o banco de dados Supabase
-- CUIDADO: Este script remove TODOS os dados existentes!

-- Desabilitar todas as políticas RLS primeiro (apenas em tabelas que podemos modificar)
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Desabilitar RLS apenas em tabelas personalizadas (evita tabelas do sistema)
    FOR r IN SELECT schemaname, tablename FROM pg_tables 
    WHERE schemaname IN ('public', 'config', 'user_data')
    AND tablename NOT LIKE 'pg_%'
    AND tablename NOT LIKE 'sql_%'
    LOOP
        BEGIN
            EXECUTE 'ALTER TABLE ' || quote_ident(r.schemaname) || '.' || quote_ident(r.tablename) || ' DISABLE ROW LEVEL SECURITY';
        EXCEPTION WHEN OTHERS THEN
            -- Ignora erros de permissão para tabelas do sistema
            RAISE NOTICE 'Não foi possível desabilitar RLS para %', r.schemaname || '.' || r.tablename;
        END;
    END LOOP;
END $$;

-- Remover triggers existentes (apenas em schemas personalizados)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT schemaname, tablename, triggername 
        FROM information_schema.triggers 
        WHERE schemaname IN ('public', 'config', 'user_data')
        AND triggername NOT LIKE 'pg_%'
        AND triggername NOT LIKE 'RI_%'
    LOOP
        BEGIN
            EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.triggername) || ' ON ' || quote_ident(r.schemaname) || '.' || quote_ident(r.tablename) || ' CASCADE';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Não foi possível remover trigger %', r.triggername;
        END;
    END LOOP;
END $$;

-- Remover funções personalizadas (apenas em schemas personalizados)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT n.nspname as schema_name, p.proname as function_name, oidvectortypes(p.proargtypes) as function_args
        FROM pg_proc p 
        LEFT JOIN pg_namespace n ON p.pronamespace = n.oid 
        WHERE n.nspname IN ('config', 'user_data')
        OR (n.nspname = 'public' AND p.proname IN (
            'update_updated_at_column',
            'initialize_user_prices',
            'initialize_budget_settings', 
            'initialize_credit_card_fees',
            'initialize_installation_fees',
            'initialize_user_data',
            'on_auth_user_created'
        ))
    LOOP
        BEGIN
            EXECUTE 'DROP FUNCTION IF EXISTS ' || quote_ident(r.schema_name) || '.' || quote_ident(r.function_name) || '(' || r.function_args || ') CASCADE';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Não foi possível remover função %', r.schema_name || '.' || r.function_name;
        END;
    END LOOP;
END $$;

-- Remover tabelas em public (exceto as do sistema Supabase)
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.pricing_configs CASCADE;
DROP TABLE IF EXISTS public.budget_observations CASCADE;

-- Remover schemas personalizados completamente
DROP SCHEMA IF EXISTS config CASCADE;
DROP SCHEMA IF EXISTS user_data CASCADE;

-- Remover funções que podem ter sobrado no schema public
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.initialize_user_prices(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.initialize_budget_settings(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.initialize_credit_card_fees(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.initialize_installation_fees(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.initialize_user_data(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.on_auth_user_created() CASCADE;

-- Remover extensões personalizadas (se não forem usadas pelo sistema)
-- Nota: uuid-ossp é geralmente seguro de manter
-- DROP EXTENSION IF EXISTS "uuid-ossp";

-- Limpar dados de usuários de teste (preserva apenas usuários do sistema)
-- CUIDADO: Isso remove todos os usuários cadastrados!
-- DELETE FROM auth.users WHERE email NOT LIKE '%@supabase.io' AND email NOT LIKE '%@admin.com';

-- Confirmar limpeza
SELECT 'Banco de dados limpo com sucesso! Execute main.sql para recriar a estrutura.' AS message; 