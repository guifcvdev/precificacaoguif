import { supabase } from '../lib/supabaseClient';
import { PricingConfig } from '../types/pricing';
import { BudgetObservations } from '../hooks/useBudgetSettings';

export const configService = {
  async saveConfig(config: PricingConfig) {
    try {
      // Abordagem mais simples: apenas inserir sem tentar deletar
      const { error } = await supabase
        .from('pricing_configs')
        .upsert({
          id: 1,
          config_data: config,
          is_default: true
        });

      if (error) {
        console.error('Erro ao salvar configurações:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return { success: false, error };
    }
  },

  async loadConfig(): Promise<PricingConfig | null> {
    try {
      // Consulta mais simples possível
      const { data, error } = await supabase
        .from('pricing_configs')
        .select('config_data')
        .eq('id', 1)
        .limit(1);

      if (error) {
        console.error('Erro ao carregar configurações:', error);
        return null;
      }

      if (!data || data.length === 0) return null;

      return data[0].config_data as PricingConfig;
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      return null;
    }
  },
  
  async saveBudgetObservations(observations: BudgetObservations) {
    try {
      // Verificar se a tabela existe
      const { error: checkError } = await supabase
        .from('budget_observations')
        .select('id')
        .limit(1);
      
      // Se a tabela não existir, criar primeiro
      if (checkError && checkError.code === '42P01') {
        await this.createBudgetObservationsTable();
      }
      
      // Agora inserir/atualizar os dados
      const { error } = await supabase
        .from('budget_observations')
        .upsert({
          id: 1,
          payment_method: observations.paymentMethod,
          delivery_time: observations.deliveryTime,
          warranty: observations.warranty
        });
      
      if (error) {
        console.error('Erro ao salvar observações:', error);
        return { success: false, error };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar observações:', error);
      return { success: false, error };
    }
  },
  
  async loadBudgetObservations(): Promise<BudgetObservations | null> {
    try {
      const { data, error } = await supabase
        .from('budget_observations')
        .select('*')
        .eq('id', 1)
        .limit(1);
      
      if (error) {
        console.error('Erro ao carregar observações:', error);
        return null;
      }
      
      if (!data || data.length === 0) return null;
      
      return {
        paymentMethod: data[0].payment_method,
        deliveryTime: data[0].delivery_time,
        warranty: data[0].warranty
      };
    } catch (error) {
      console.error('Erro ao carregar observações:', error);
      return null;
    }
  },
  
  async createBudgetObservationsTable() {
    try {
      // Script SQL direto para criar a tabela
      const sql = `
      CREATE TABLE IF NOT EXISTS budget_observations (
        id SERIAL PRIMARY KEY,
        payment_method TEXT,
        delivery_time TEXT,
        warranty TEXT
      );
      `;
      
      // Tenta executar o SQL
      const { error } = await supabase.rpc('execute_sql', { sql_query: sql });
      
      if (error) {
        console.error('Erro ao criar tabela de observações:', error);
        return { success: false, error };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao criar tabela de observações:', error);
      return { success: false, error };
    }
  }
};
