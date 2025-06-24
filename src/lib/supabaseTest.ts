import { supabase } from './supabaseClient';
import { defaultConfig } from '../types/pricing';
import { PricingConfig } from '../types/pricing';

export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('pricing_configs').select('*').limit(1);
    
    if (error) {
      console.error("Erro ao testar conexão:", error);
      return {
        success: false,
        message: `Erro na conexão: ${error.message}`,
        details: error
      };
    }
    
    return {
      success: true,
      message: "Conexão com o Supabase bem-sucedida!",
      data
    };
  } catch (error) {
    console.error("Exceção ao testar conexão:", error);
    return {
      success: false,
      message: `Exceção: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      details: error
    };
  }
};

export const checkBudgetObservationsTable = async () => {
  try {
    // Tenta realizar uma consulta simples para verificar se a tabela existe
    const { data, error } = await supabase
      .from('budget_observations')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') { // Código para "tabela não existe"
        return {
          success: false,
          message: "Tabela budget_observations não existe",
          error
        };
      }
      
      return {
        success: false,
        message: `Erro ao verificar tabela: ${error.message}`,
        error
      };
    }
    
    return {
      success: true,
      message: "Tabela budget_observations existe",
      hasData: data && data.length > 0
    };
  } catch (error) {
    return {
      success: false,
      message: `Exceção ao verificar tabela: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      error
    };
  }
};

export const initializeBudgetObservations = async () => {
  try {
    // Tenta inicializar a tabela
    const { error } = await supabase.rpc('create_budget_observations_table');
    
    if (error) {
      return {
        success: false,
        message: `Erro ao inicializar tabela: ${error.message}`,
        error
      };
    }
    
    // Inserir dados padrão
    const defaultObservations = {
      id: 1,
      payment_method: "- Entrada de 50% do valor e restante na retirada.\n- Parcelado no cartão a combinar.",
      delivery_time: "- Entrega do pedido em 7 úteis após a aprovação de arte e pagamento.",
      warranty: "*GARANTIA DE 3 MESES PARA O SERVIÇO ENTREGUE CONFORME A LEI Nº 8.078, DE 11 DE SETEMBRO DE 1990. Art. 26."
    };
    
    const { error: insertError } = await supabase
      .from('budget_observations')
      .upsert(defaultObservations);
    
    if (insertError) {
      return {
        success: false,
        message: `Erro ao inserir dados padrão: ${insertError.message}`,
        error: insertError
      };
    }
    
    return {
      success: true,
      message: "Tabela budget_observations inicializada com sucesso!"
    };
  } catch (error) {
    return {
      success: false,
      message: `Exceção ao inicializar tabela: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      error
    };
  }
};

export const executeSimpleQuery = async () => {
  try {
    // Script SQL simples para criar a tabela diretamente
    const sql = `
    CREATE TABLE IF NOT EXISTS budget_observations (
      id SERIAL PRIMARY KEY,
      payment_method TEXT,
      delivery_time TEXT,
      warranty TEXT
    );
    `;
    
    const { error } = await supabase.rpc('execute_sql', { sql_query: sql });
    
    if (error) {
      return {
        success: false,
        message: `Erro ao executar SQL: ${error.message}`,
        error
      };
    }
    
    return {
      success: true,
      message: "SQL executado com sucesso!"
    };
  } catch (error) {
    return {
      success: false,
      message: `Exceção ao executar SQL: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      error
    };
  }
};

export const createInitialConfig = async (config: PricingConfig) => {
  try {
    const { error } = await supabase
      .from('pricing_configs')
      .upsert({
        id: 1,
        config: config
      });
    
    if (error) {
      console.error("Erro ao criar configuração inicial:", error);
      return {
        success: false,
        message: `Erro ao criar configuração inicial: ${error.message}`,
        error
      };
    }
    
    return {
      success: true,
      message: "Configuração inicial criada com sucesso!"
    };
  } catch (error) {
    console.error("Exceção ao criar configuração inicial:", error);
    return {
      success: false,
      message: `Exceção ao criar configuração inicial: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      error
    };
  }
};

export const createBudgetObservationsTable = async () => {
  try {
    // Verificar se a tabela já existe
    const checkResult = await checkBudgetObservationsTable();
    
    if (checkResult.success) {
      return {
        success: true,
        message: "Tabela budget_observations já existe",
        hasData: checkResult.hasData
      };
    }
    
    // Criar tabela com SQL simples
    const sql = `
    CREATE TABLE IF NOT EXISTS budget_observations (
      id SERIAL PRIMARY KEY,
      payment_method TEXT,
      delivery_time TEXT,
      warranty TEXT
    );
    
    -- Habilitar RLS
    ALTER TABLE budget_observations ENABLE ROW LEVEL SECURITY;
    
    -- Permitir acesso anônimo
    CREATE POLICY "Allow anonymous select" ON budget_observations FOR SELECT USING (true);
    CREATE POLICY "Allow anonymous insert" ON budget_observations FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow anonymous update" ON budget_observations FOR UPDATE USING (true);
    CREATE POLICY "Allow anonymous delete" ON budget_observations FOR DELETE USING (true);
    `;
    
    // Executar SQL para criar tabela
    const createResult = await supabase.rpc('execute_sql', { sql_query: sql });
    
    if (createResult.error) {
      // Se falhar, tentar uma abordagem mais simples
      const simpleCreateResult = await supabase.rpc('execute_sql', {
        sql_query: `CREATE TABLE IF NOT EXISTS budget_observations (
          id SERIAL PRIMARY KEY,
          payment_method TEXT,
          delivery_time TEXT,
          warranty TEXT
        );`
      });
      
      if (simpleCreateResult.error) {
        return {
          success: false,
          message: `Erro ao criar tabela: ${simpleCreateResult.error.message}`,
          error: simpleCreateResult.error
        };
      }
    }
    
    // Inserir dados padrão
    const defaultObservations = {
      id: 1,
      payment_method: "- Entrada de 50% do valor e restante na retirada.\n- Parcelado no cartão a combinar.",
      delivery_time: "- Entrega do pedido em 7 úteis após a aprovação de arte e pagamento.",
      warranty: "*GARANTIA DE 3 MESES PARA O SERVIÇO ENTREGUE CONFORME A LEI Nº 8.078, DE 11 DE SETEMBRO DE 1990. Art. 26."
    };
    
    const { error: insertError } = await supabase
      .from('budget_observations')
      .insert([defaultObservations]);
    
    if (insertError) {
      return {
        success: false,
        message: `Erro ao inserir dados padrão: ${insertError.message}`,
        error: insertError
      };
    }
    
    return {
      success: true,
      message: "Tabela budget_observations criada e inicializada com sucesso!"
    };
  } catch (error) {
    return {
      success: false,
      message: `Exceção ao criar tabela budget_observations: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      error
    };
  }
}; 