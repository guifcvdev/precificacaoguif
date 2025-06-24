-- Configuração inicial do banco de dados
-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schemas para organização lógica
-- auth já é gerenciado pelo Supabase
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