import { supabase } from './supabaseClient';
import { PricingConfig } from '../types/pricing';

export const testSupabaseConnection = async () => {
  try {
    // Teste mais simples - apenas verificar se o Supabase responde
    const { data, error } = await supabase.from('pricing_configs').select('id').limit(1);
    
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
      .select('id')
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
      hasData: data && data.length > 0,
      data
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
    // Inserir nova configuração
    const { data, error } = await supabase
      .from('pricing_configs')
      .insert({
        config_data: config,
        is_default: true
      })
      .select('id')
      .single();
    
    if (error) {
      console.error("Erro ao criar configuração inicial:", error);
      return {
        success: false,
        message: `Erro ao criar configuração inicial: ${error.message}`,
        error
      };
    }
    
    // Salvar o ID no localStorage
    if (data && data.id) {
      localStorage.setItem('pricing_config_id', data.id);
    }
    
    return {
      success: true,
      message: "Configuração inicial criada com sucesso!",
      data
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

export const createPricingConfigsTable = async () => {
  try {
    // Script SQL para criar a tabela
    const sql = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    CREATE TABLE IF NOT EXISTS pricing_configs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      config_data JSONB NOT NULL,
      is_default BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    -- Habilitar RLS
    ALTER TABLE pricing_configs ENABLE ROW LEVEL SECURITY;
    
    -- Permitir acesso anônimo
    CREATE POLICY "Allow anonymous select" ON pricing_configs FOR SELECT USING (true);
    CREATE POLICY "Allow anonymous insert" ON pricing_configs FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow anonymous update" ON pricing_configs FOR UPDATE USING (true);
    CREATE POLICY "Allow anonymous delete" ON pricing_configs FOR DELETE USING (true);
    `;
    
    const { error } = await supabase.rpc('execute_sql', { sql_query: sql });
    
    if (error) {
      console.error("Erro ao criar tabela pricing_configs:", error);
      return {
        success: false,
        message: `Erro ao criar tabela pricing_configs: ${error.message}`,
        error
      };
    }
    
    return {
      success: true,
      message: "Tabela pricing_configs criada com sucesso!"
    };
  } catch (error) {
    console.error("Exceção ao criar tabela pricing_configs:", error);
    return {
      success: false,
      message: `Exceção ao criar tabela pricing_configs: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      error
    };
  }
}; 