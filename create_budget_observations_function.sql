-- Função para criar a tabela budget_observations se não existir
CREATE OR REPLACE FUNCTION create_budget_observations_table()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verifica se a tabela já existe
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'budget_observations'
  ) THEN
    -- Cria a tabela se não existir
    CREATE TABLE public.budget_observations (
      id SERIAL PRIMARY KEY,
      payment_method TEXT,
      delivery_time TEXT,
      warranty TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    -- Adiciona permissões RLS
    ALTER TABLE public.budget_observations ENABLE ROW LEVEL SECURITY;
    
    -- Cria política para permitir leitura anônima
    CREATE POLICY "Allow anonymous select" ON public.budget_observations
      FOR SELECT USING (true);
    
    -- Cria política para permitir inserção anônima
    CREATE POLICY "Allow anonymous insert" ON public.budget_observations
      FOR INSERT WITH CHECK (true);
    
    -- Cria política para permitir atualização anônima
    CREATE POLICY "Allow anonymous update" ON public.budget_observations
      FOR UPDATE USING (true);
    
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$; 