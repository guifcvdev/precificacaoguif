-- Script principal para configuração do banco de dados
-- Este script deve ser executado na interface do Supabase SQL Editor

-- 0. Fazer backup dos dados existentes
\i backup_data.sql

-- 1. Configuração inicial (schemas e extensões)
\i schema_setup.sql

-- 2. Tabelas de produtos e configurações
\i tables_products.sql

-- 3. Tabelas de dados de usuários
\i tables_user_data.sql

-- 4. Tabelas de orçamentos
\i tables_budgets.sql

-- 5. Políticas de segurança
\i policies.sql

-- 6. Funções auxiliares
\i functions.sql

-- 7. Dados iniciais
\i seed_initial_data.sql

-- Confirmação
SELECT 'Configuração do banco de dados concluída com sucesso!' AS message; 