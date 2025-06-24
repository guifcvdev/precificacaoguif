-- Script para fazer backup dos dados existentes antes de executar os novos scripts

-- Criar schema de backup
CREATE SCHEMA IF NOT EXISTS backup;

-- Backup das tabelas de configuração existentes
DO $$
BEGIN
    -- Verificar se a tabela pricing_configs existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'pricing_configs') THEN
        -- Criar tabela de backup
        CREATE TABLE IF NOT EXISTS backup.pricing_configs AS
        SELECT * FROM pricing_configs;
        
        RAISE NOTICE 'Backup da tabela pricing_configs criado com sucesso.';
    END IF;
    
    -- Verificar se a tabela budget_settings existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'budget_settings') THEN
        -- Criar tabela de backup
        CREATE TABLE IF NOT EXISTS backup.budget_settings AS
        SELECT * FROM budget_settings;
        
        RAISE NOTICE 'Backup da tabela budget_settings criado com sucesso.';
    END IF;
    
    -- Verificar se a tabela budget_observations existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'budget_observations') THEN
        -- Criar tabela de backup
        CREATE TABLE IF NOT EXISTS backup.budget_observations AS
        SELECT * FROM budget_observations;
        
        RAISE NOTICE 'Backup da tabela budget_observations criado com sucesso.';
    END IF;
    
    -- Verificar se a tabela budgets existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'budgets') THEN
        -- Criar tabela de backup
        CREATE TABLE IF NOT EXISTS backup.budgets AS
        SELECT * FROM budgets;
        
        RAISE NOTICE 'Backup da tabela budgets criado com sucesso.';
    END IF;
    
    -- Verificar se a tabela budget_items existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'budget_items') THEN
        -- Criar tabela de backup
        CREATE TABLE IF NOT EXISTS backup.budget_items AS
        SELECT * FROM budget_items;
        
        RAISE NOTICE 'Backup da tabela budget_items criado com sucesso.';
    END IF;
    
    -- Verificar se a tabela budget_calculations existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'budget_calculations') THEN
        -- Criar tabela de backup
        CREATE TABLE IF NOT EXISTS backup.budget_calculations AS
        SELECT * FROM budget_calculations;
        
        RAISE NOTICE 'Backup da tabela budget_calculations criado com sucesso.';
    END IF;
    
    -- Verificar se a tabela users existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        -- Criar tabela de backup
        CREATE TABLE IF NOT EXISTS backup.users AS
        SELECT * FROM users;
        
        RAISE NOTICE 'Backup da tabela users criado com sucesso.';
    END IF;
END $$;

-- Criar uma visão com informações sobre as tabelas de backup
CREATE OR REPLACE VIEW backup.backup_info AS
SELECT 
    table_name,
    (SELECT COUNT(*) FROM backup.pricing_configs) AS row_count
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'backup' 
    AND table_name = 'pricing_configs'
UNION ALL
SELECT 
    table_name,
    (SELECT COUNT(*) FROM backup.budget_settings) AS row_count
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'backup' 
    AND table_name = 'budget_settings'
UNION ALL
SELECT 
    table_name,
    (SELECT COUNT(*) FROM backup.budget_observations) AS row_count
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'backup' 
    AND table_name = 'budget_observations'
UNION ALL
SELECT 
    table_name,
    (SELECT COUNT(*) FROM backup.budgets) AS row_count
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'backup' 
    AND table_name = 'budgets'
UNION ALL
SELECT 
    table_name,
    (SELECT COUNT(*) FROM backup.budget_items) AS row_count
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'backup' 
    AND table_name = 'budget_items'
UNION ALL
SELECT 
    table_name,
    (SELECT COUNT(*) FROM backup.budget_calculations) AS row_count
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'backup' 
    AND table_name = 'budget_calculations'
UNION ALL
SELECT 
    table_name,
    (SELECT COUNT(*) FROM backup.users) AS row_count
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'backup' 
    AND table_name = 'users';

-- Mostrar informações sobre o backup
SELECT * FROM backup.backup_info; 