-- Script para criar as tabelas necessárias no schema public do Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Habilitar extensão UUID (se ainda não estiver habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Criar tabela pricing_configs
-- Esta tabela armazena as configurações de preços em formato JSONB
CREATE TABLE IF NOT EXISTS public.pricing_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_data JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Criar tabela budget_observations  
-- Esta tabela armazena as observações padrão dos orçamentos
CREATE TABLE IF NOT EXISTS public.budget_observations (
    id SERIAL PRIMARY KEY,
    payment_method TEXT,
    delivery_time TEXT,
    warranty TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Configurar Row Level Security (RLS) e políticas para acesso anônimo
-- Isso permite que a aplicação acesse as tabelas sem autenticação

-- Habilitar RLS
ALTER TABLE public.pricing_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_observations ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver conflito
DROP POLICY IF EXISTS "Allow anonymous select" ON public.pricing_configs;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.pricing_configs;
DROP POLICY IF EXISTS "Allow anonymous update" ON public.pricing_configs;
DROP POLICY IF EXISTS "Allow anonymous delete" ON public.pricing_configs;

DROP POLICY IF EXISTS "Allow anonymous select" ON public.budget_observations;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.budget_observations;
DROP POLICY IF EXISTS "Allow anonymous update" ON public.budget_observations;
DROP POLICY IF EXISTS "Allow anonymous delete" ON public.budget_observations;

-- Criar políticas para pricing_configs
CREATE POLICY "Allow anonymous select" ON public.pricing_configs FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON public.pricing_configs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON public.pricing_configs FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete" ON public.pricing_configs FOR DELETE USING (true);

-- Criar políticas para budget_observations
CREATE POLICY "Allow anonymous select" ON public.budget_observations FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON public.budget_observations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON public.budget_observations FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete" ON public.budget_observations FOR DELETE USING (true);

-- 5. Inserir dados padrão em budget_observations (se a tabela estiver vazia)
INSERT INTO public.budget_observations (id, payment_method, delivery_time, warranty)
VALUES (
    1,
    '- Entrada de 50% do valor e restante na retirada.
- Parcelado no cartão a combinar.',
    '- Entrega do pedido em 7 úteis após a aprovação de arte e pagamento.',
    '*GARANTIA DE 3 MESES PARA O SERVIÇO ENTREGUE CONFORME A LEI Nº 8.078, DE 11 DE SETEMBRO DE 1990. Art. 26.'
)
ON CONFLICT (id) DO NOTHING;

-- 6. Verificar se as tabelas foram criadas corretamente
SELECT 'Verificação das tabelas criadas:' as status;
SELECT 
    table_name, 
    CASE 
        WHEN table_name IN ('pricing_configs', 'budget_observations') THEN '✅ Criada'
        ELSE '❌ Não encontrada'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('pricing_configs', 'budget_observations');

-- Sucesso!
SELECT '🎉 Script executado com sucesso! As tabelas necessárias foram criadas.' as resultado; 