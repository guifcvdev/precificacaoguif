-- Script para criar/migrar tabela budget_settings no schema public para compatibilidade com o Supabase JavaScript client
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Criar a tabela budget_settings no schema public se não existir
CREATE TABLE IF NOT EXISTS public.budget_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    payment_method TEXT,
    delivery_time TEXT,
    warranty TEXT,
    tax_percentage DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_budget_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_budget_settings_updated_at_trigger ON public.budget_settings;
CREATE TRIGGER update_budget_settings_updated_at_trigger
    BEFORE UPDATE ON public.budget_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_budget_settings_updated_at();

-- 3. Habilitar RLS (Row Level Security) para acesso público controlado
ALTER TABLE public.budget_settings ENABLE ROW LEVEL SECURITY;

-- 4. Remover políticas existentes se houverem conflitos
DROP POLICY IF EXISTS "Budget settings public access" ON public.budget_settings;
DROP POLICY IF EXISTS "Allow anonymous select" ON public.budget_settings;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.budget_settings;
DROP POLICY IF EXISTS "Allow anonymous update" ON public.budget_settings;
DROP POLICY IF EXISTS "Allow anonymous delete" ON public.budget_settings;

-- 5. Criar políticas para permitir acesso anônimo (para desenvolvimento)
CREATE POLICY "Allow anonymous select" ON public.budget_settings FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON public.budget_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON public.budget_settings FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete" ON public.budget_settings FOR DELETE USING (true);

-- 6. Migrar dados existentes de user_data.budget_settings para public.budget_settings (se existir)
DO $$
BEGIN
    -- Verificar se a tabela user_data.budget_settings existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'user_data' AND table_name = 'budget_settings') THEN
        -- Migrar dados se a tabela public.budget_settings estiver vazia
        INSERT INTO public.budget_settings (user_id, payment_method, delivery_time, warranty, tax_percentage, created_at, updated_at)
        SELECT user_id, payment_method, delivery_time, warranty, tax_percentage, created_at, updated_at
        FROM user_data.budget_settings
        WHERE NOT EXISTS (SELECT 1 FROM public.budget_settings LIMIT 1);
        
        RAISE NOTICE 'Dados migrados de user_data.budget_settings para public.budget_settings';
    ELSE
        RAISE NOTICE 'Tabela user_data.budget_settings não encontrada, nenhuma migração necessária';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Erro durante migração: %', SQLERRM;
END $$;

-- 7. Inserir dados padrão se a tabela estiver vazia
INSERT INTO public.budget_settings (payment_method, delivery_time, warranty)
SELECT 
    '- Entrada de 50% do valor e restante na retirada.
- Parcelado no cartão a combinar.',
    '- Entrega do pedido em 7 úteis após a aprovação de arte e pagamento.',
    '*GARANTIA DE 3 MESES PARA O SERVIÇO ENTREGUE CONFORME A LEI Nº 8.078, DE 11 DE SETEMBRO DE 1990. Art. 26.'
WHERE NOT EXISTS (SELECT 1 FROM public.budget_settings);

-- 8. Verificar se a tabela foi criada corretamente
SELECT 'Verificação da tabela budget_settings:' as status;
SELECT 
    table_name, 
    CASE 
        WHEN table_name = 'budget_settings' THEN '✅ Criada no schema public'
        ELSE '❌ Não encontrada'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'budget_settings';

-- 9. Mostrar dados existentes
SELECT 'Dados existentes na tabela:' as info;
SELECT COUNT(*) as total_records FROM public.budget_settings;

-- Sucesso!
SELECT '🎉 Tabela budget_settings configurada com sucesso no schema public!' as resultado; 