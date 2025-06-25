import { supabase } from '../lib/supabaseClient';
import { PricingConfig } from '../types/pricing';
import { BudgetObservations } from '../hooks/useBudgetSettings';

// Armazenar IDs persistentes para as configurações
const CONFIG_ID_KEY = 'pricing_config_id';
const OBSERVATIONS_ID_KEY = 'budget_observations_id';

export const configService = {
  async saveConfig(config: PricingConfig) {
    try {
      console.log('🔧 [ConfigService] Iniciando saveConfig...', { config });
      
      // Verificar se já existe um ID salvo no localStorage
      const savedId = localStorage.getItem(CONFIG_ID_KEY);
      console.log('🔧 [ConfigService] ID salvo no localStorage:', savedId);
      
      if (savedId) {
        console.log('🔧 [ConfigService] Atualizando configuração existente...');
        // Atualizar configuração existente
        const { error } = await supabase
          .from('pricing_configs')
          .update({
            config_data: config,
            is_default: true
          })
          .eq('id', savedId);
          
        if (error) {
          console.error('❌ [ConfigService] Erro ao atualizar configurações:', error);
          return { success: false, error };
        }
        
        console.log('✅ [ConfigService] Configuração atualizada com sucesso!');
        return { success: true };
      } else {
        console.log('🔧 [ConfigService] Criando nova configuração...');
        // Criar nova configuração
        const { data, error } = await supabase
          .from('pricing_configs')
          .insert({
            config_data: config,
            is_default: true
          })
          .select('id')
          .single();
          
        if (error) {
          console.error('❌ [ConfigService] Erro ao salvar configurações:', error);
          return { success: false, error };
        }
        
        // Salvar o ID no localStorage para futuras operações
        if (data && data.id) {
          localStorage.setItem(CONFIG_ID_KEY, data.id);
          console.log('🔧 [ConfigService] ID salvo no localStorage:', data.id);
        }
        
        console.log('✅ [ConfigService] Nova configuração criada com sucesso!');
        return { success: true };
      }
    } catch (error) {
      console.error('❌ [ConfigService] Exceção ao salvar configurações:', error);
      return { success: false, error };
    }
  },

  async loadConfig(): Promise<PricingConfig | null> {
    try {
      console.log('📥 [ConfigService] Iniciando loadConfig...');
      
      // Verificar se existe um ID salvo no localStorage
      const savedId = localStorage.getItem(CONFIG_ID_KEY);
      console.log('📥 [ConfigService] ID salvo no localStorage:', savedId);
      
      let query = supabase
        .from('pricing_configs')
        .select('config_data, id');
      
      if (savedId) {
        // Se tiver ID salvo, buscar por esse ID específico
        console.log('📥 [ConfigService] Buscando por ID específico...');
        query = query.eq('id', savedId);
      } else {
        // Caso contrário, buscar qualquer configuração (limitando a 1)
        console.log('📥 [ConfigService] Buscando qualquer configuração...');
        query = query.limit(1);
      }
      
      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error('❌ [ConfigService] Erro ao carregar configurações:', error);
        return null;
      }
      
      console.log('📥 [ConfigService] Dados recebidos do Supabase:', data);
      
      // Se encontrou dados e não tinha ID salvo, salvar o ID
      if (data && data.id && !savedId) {
        localStorage.setItem(CONFIG_ID_KEY, data.id);
        console.log('📥 [ConfigService] ID salvo no localStorage:', data.id);
      }

      const configData = data?.config_data as PricingConfig;
      console.log('📥 [ConfigService] Config data extraído:', configData);
      
      return configData;
    } catch (error) {
      console.error('❌ [ConfigService] Exceção ao carregar configurações:', error);
      return null;
    }
  },
  
  async saveBudgetObservations(observations: BudgetObservations) {
    try {
      // Verificar se já existe um ID salvo no localStorage
      const savedId = localStorage.getItem(OBSERVATIONS_ID_KEY);
      
      // Verificar se a tabela existe
      const { error: checkError } = await supabase
        .from('budget_observations')
        .select('id')
        .limit(1);
      
      // Se a tabela não existir, criar primeiro
      if (checkError && checkError.code === '42P01') {
        await this.createBudgetObservationsTable();
      }
      
      if (savedId) {
        // Atualizar registro existente
        const { error } = await supabase
          .from('budget_observations')
          .update({
            payment_method: observations.paymentMethod,
            delivery_time: observations.deliveryTime,
            warranty: observations.warranty
          })
          .eq('id', savedId);
        
        if (error) {
          console.error('Erro ao atualizar observações:', error);
          return { success: false, error };
        }
        
        return { success: true };
      } else {
        // Criar novo registro
        const { data, error } = await supabase
          .from('budget_observations')
          .insert({
            payment_method: observations.paymentMethod,
            delivery_time: observations.deliveryTime,
            warranty: observations.warranty
          })
          .select('id')
          .single();
        
        if (error) {
          console.error('Erro ao salvar observações:', error);
          return { success: false, error };
        }
        
        // Salvar o ID no localStorage para futuras operações
        if (data && data.id) {
          localStorage.setItem(OBSERVATIONS_ID_KEY, data.id);
        }
        
        return { success: true };
      }
    } catch (error) {
      console.error('Erro ao salvar observações:', error);
      return { success: false, error };
    }
  },
  
  async loadBudgetObservations(): Promise<BudgetObservations | null> {
    try {
      // Verificar se existe um ID salvo no localStorage
      const savedId = localStorage.getItem(OBSERVATIONS_ID_KEY);
      
      let query = supabase
        .from('budget_observations')
        .select('*, id');
      
      if (savedId) {
        // Se tiver ID salvo, buscar por esse ID específico
        query = query.eq('id', savedId);
      } else {
        // Caso contrário, buscar qualquer registro (limitando a 1)
        query = query.limit(1);
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) {
        console.error('Erro ao carregar observações:', error);
        return null;
      }
      
      // Se não encontrou dados, retornar null
      if (!data) {
        return null;
      }
      
      // Se encontrou dados e não tinha ID salvo, salvar o ID
      if (data.id && !savedId) {
        localStorage.setItem(OBSERVATIONS_ID_KEY, data.id);
      }
      
      return {
        paymentMethod: data.payment_method || '',
        deliveryTime: data.delivery_time || '',
        warranty: data.warranty || ''
      };
    } catch (error) {
      console.error('Erro ao carregar observações:', error);
      return null;
    }
  },
  
  async createBudgetObservationsTable() {
    try {
      // Script SQL direto para criar a tabela com UUID
      const sql = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS budget_observations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        payment_method TEXT,
        delivery_time TEXT,
        warranty TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      -- Habilitar RLS (se for executar no Supabase)
      ALTER TABLE budget_observations ENABLE ROW LEVEL SECURITY;
      
      -- Permitir acesso anônimo
      CREATE POLICY "Allow anonymous select" ON budget_observations FOR SELECT USING (true);
      CREATE POLICY "Allow anonymous insert" ON budget_observations FOR INSERT WITH CHECK (true);
      CREATE POLICY "Allow anonymous update" ON budget_observations FOR UPDATE USING (true);
      CREATE POLICY "Allow anonymous delete" ON budget_observations FOR DELETE USING (true);
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
