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
      
      // Primeiro, tentar encontrar uma configuração existente marcada como default
      const { data: existingConfig, error: findError } = await supabase
        .from('pricing_configs')
        .select('id')
        .eq('is_default', true)
        .maybeSingle();
      
      if (findError) {
        console.error('❌ [ConfigService] Erro ao buscar configuração existente:', findError);
        // Continuar mesmo com erro - pode ser que a tabela não exista ainda
      }
      
      console.log('🔧 [ConfigService] Configuração existente encontrada:', existingConfig);
      
      if (existingConfig) {
        console.log('🔧 [ConfigService] Atualizando configuração existente...');
        // Atualizar configuração existente
        const { error } = await supabase
          .from('pricing_configs')
          .update({
            config_data: config,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConfig.id);
          
        if (error) {
          console.error('❌ [ConfigService] Erro ao atualizar configurações:', error);
          return { success: false, error };
        }
        
        // Salvar o ID no localStorage para referência futura
        localStorage.setItem(CONFIG_ID_KEY, existingConfig.id);
        console.log('🔧 [ConfigService] ID salvo no localStorage:', existingConfig.id);
        
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
      
      // Estratégia 1: Buscar por configuração marcada como default
      console.log('📥 [ConfigService] Buscando configuração padrão (is_default=true)...');
      const { data: defaultConfig, error: defaultError } = await supabase
        .from('pricing_configs')
        .select('config_data, id')
        .eq('is_default', true)
        .maybeSingle();
      
      if (defaultError) {
        console.error('❌ [ConfigService] Erro ao buscar configuração padrão:', defaultError);
        // Continuar para próxima estratégia
      } else if (defaultConfig) {
        console.log('📥 [ConfigService] Configuração padrão encontrada:', defaultConfig);
        
        // Salvar ID no localStorage para referência futura
        if (defaultConfig.id) {
          localStorage.setItem(CONFIG_ID_KEY, defaultConfig.id);
          console.log('📥 [ConfigService] ID salvo no localStorage:', defaultConfig.id);
        }
        
        const configData = defaultConfig.config_data as PricingConfig;
        console.log('📥 [ConfigService] Config data extraído (default):', configData);
        return configData;
      }
      
      // Estratégia 2: Buscar por ID salvo no localStorage (se existir)
      const savedId = localStorage.getItem(CONFIG_ID_KEY);
      if (savedId) {
        console.log('📥 [ConfigService] Buscando por ID salvo no localStorage:', savedId);
        const { data: savedConfig, error: savedError } = await supabase
          .from('pricing_configs')
          .select('config_data, id')
          .eq('id', savedId)
          .maybeSingle();
        
        if (savedError) {
          console.error('❌ [ConfigService] Erro ao buscar por ID salvo:', savedError);
          // ID pode estar inválido, remover do localStorage
          localStorage.removeItem(CONFIG_ID_KEY);
        } else if (savedConfig) {
          console.log('📥 [ConfigService] Configuração encontrada por ID salvo:', savedConfig);
          const configData = savedConfig.config_data as PricingConfig;
          console.log('📥 [ConfigService] Config data extraído (by ID):', configData);
          return configData;
        }
      }
      
      // Estratégia 3: Buscar qualquer configuração disponível
      console.log('📥 [ConfigService] Buscando qualquer configuração disponível...');
      const { data: anyConfig, error: anyError } = await supabase
        .from('pricing_configs')
        .select('config_data, id')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (anyError) {
        console.error('❌ [ConfigService] Erro ao buscar qualquer configuração:', anyError);
        return null;
      }
      
      if (anyConfig) {
        console.log('📥 [ConfigService] Configuração encontrada (qualquer uma):', anyConfig);
        
        // Salvar ID no localStorage para referência futura
        if (anyConfig.id) {
          localStorage.setItem(CONFIG_ID_KEY, anyConfig.id);
          console.log('📥 [ConfigService] ID salvo no localStorage:', anyConfig.id);
        }
        
        const configData = anyConfig.config_data as PricingConfig;
        console.log('📥 [ConfigService] Config data extraído (any):', configData);
        return configData;
      }
      
      console.log('📥 [ConfigService] Nenhuma configuração encontrada no banco');
      return null;
    } catch (error) {
      console.error('❌ [ConfigService] Exceção ao carregar configurações:', error);
      return null;
    }
  },
  
  async saveBudgetObservations(observations: BudgetObservations) {
    try {
      console.log('🔧 [ConfigService] Salvando observações...', observations);
      
      // Verificar se existem dados de usuário atual ou usar acesso anônimo
      let user_id = null;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        user_id = user?.id;
      } catch (authError) {
        console.log('🔧 [ConfigService] Usuário não autenticado, usando acesso anônimo');
      }

      if (user_id) {
        // Usar tabela user_data.budget_settings para usuários autenticados
        console.log('🔧 [ConfigService] Usando user_data.budget_settings para usuário:', user_id);
        
        // Verificar se já existe configuração para o usuário
        const { data: existingSettings, error: checkError } = await supabase
          .from('budget_settings')
          .select('id')
          .eq('user_id', user_id)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('❌ [ConfigService] Erro ao verificar configurações existentes:', checkError);
          return { success: false, error: checkError };
        }

        if (existingSettings) {
          // Atualizar configuração existente
          console.log('🔧 [ConfigService] Atualizando configuração existente...');
          const { error } = await supabase
            .from('budget_settings')
            .update({
              payment_method: observations.paymentMethod,
              delivery_time: observations.deliveryTime,
              warranty: observations.warranty,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingSettings.id);

          if (error) {
            console.error('❌ [ConfigService] Erro ao atualizar configurações:', error);
            return { success: false, error };
          }
          
          console.log('✅ [ConfigService] Configurações atualizadas com sucesso!');
          return { success: true };
        } else {
          // Criar nova configuração
          console.log('🔧 [ConfigService] Criando nova configuração...');
          const { error } = await supabase
            .from('budget_settings')
            .insert({
              user_id: user_id,
              payment_method: observations.paymentMethod,
              delivery_time: observations.deliveryTime,
              warranty: observations.warranty
            });

          if (error) {
            console.error('❌ [ConfigService] Erro ao criar configurações:', error);
            return { success: false, error };
          }
          
          console.log('✅ [ConfigService] Nova configuração criada com sucesso!');
          return { success: true };
        }
      } else {
        // Fallback: usar tabela budget_observations no schema public para acesso anônimo
        console.log('🔧 [ConfigService] Usando fallback para public.budget_observations');
        
        // Verificar se já existe um ID salvo no localStorage
        const savedId = localStorage.getItem(OBSERVATIONS_ID_KEY);
        
        // Verificar se a tabela existe
        const { error: checkError } = await supabase
          .from('budget_observations')
          .select('id')
          .limit(1);
        
        // Se a tabela não existir, criar primeiro
        if (checkError && checkError.code === '42P01') {
          console.log('🔧 [ConfigService] Tabela não existe, criando...');
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
            console.error('❌ [ConfigService] Erro ao atualizar observações:', error);
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
            console.error('❌ [ConfigService] Erro ao salvar observações:', error);
            return { success: false, error };
          }
          
          // Salvar o ID no localStorage para futuras operações
          if (data && data.id) {
            localStorage.setItem(OBSERVATIONS_ID_KEY, data.id);
          }
          
          return { success: true };
        }
      }
    } catch (error) {
      console.error('❌ [ConfigService] Exceção ao salvar observações:', error);
      return { success: false, error };
    }
  },
  
  async loadBudgetObservations(): Promise<BudgetObservations | null> {
    try {
      console.log('📥 [ConfigService] Carregando observações...');
      
      // Verificar se existem dados de usuário atual ou usar acesso anônimo
      let user_id = null;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        user_id = user?.id;
      } catch (authError) {
        console.log('📥 [ConfigService] Usuário não autenticado, usando acesso anônimo');
      }

      if (user_id) {
        // Usar tabela user_data.budget_settings para usuários autenticados
        console.log('📥 [ConfigService] Buscando em user_data.budget_settings para usuário:', user_id);
        
        const { data, error } = await supabase
          .from('budget_settings')
          .select('payment_method, delivery_time, warranty')
          .eq('user_id', user_id)
          .maybeSingle();
        
        if (error) {
          console.error('❌ [ConfigService] Erro ao carregar configurações do usuário:', error);
          // Continuar para fallback
        } else if (data) {
          console.log('📥 [ConfigService] Configurações encontradas para usuário:', data);
          return {
            paymentMethod: data.payment_method || '',
            deliveryTime: data.delivery_time || '',
            warranty: data.warranty || ''
          };
        }
      }

      // Fallback: buscar na tabela budget_observations no schema public
      console.log('📥 [ConfigService] Usando fallback para public.budget_observations');
      
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
        console.error('❌ [ConfigService] Erro ao carregar observações do fallback:', error);
        return null;
      }
      
      // Se não encontrou dados, retornar null
      if (!data) {
        console.log('📥 [ConfigService] Nenhuma configuração encontrada');
        return null;
      }
      
      // Se encontrou dados e não tinha ID salvo, salvar o ID
      if (data.id && !savedId) {
        localStorage.setItem(OBSERVATIONS_ID_KEY, data.id);
      }
      
      console.log('📥 [ConfigService] Observações carregadas do fallback:', data);
      return {
        paymentMethod: data.payment_method || '',
        deliveryTime: data.delivery_time || '',
        warranty: data.warranty || ''
      };
    } catch (error) {
      console.error('❌ [ConfigService] Exceção ao carregar observações:', error);
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
