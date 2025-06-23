import { supabase } from '../lib/supabaseClient';
import { PricingConfig } from '../types/pricing';

export const configService = {
  async saveConfig(config: PricingConfig) {
    try {
      // Buscar configuração existente
      const { data: existingConfigs, error: fetchError } = await supabase
        .from('pricing_configs')
        .select('*')
        .eq('is_default', true);

      if (fetchError) {
        console.error('Erro ao buscar configurações:', fetchError);
        return { success: false, error: fetchError };
      }

      if (existingConfigs && existingConfigs.length > 0) {
        // Atualizar configuração existente
        const { error } = await supabase
          .from('pricing_configs')
          .update({
            config_data: config,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConfigs[0].id);

        if (error) {
          console.error('Erro ao atualizar configurações:', error);
          return { success: false, error };
        }
      } else {
        // Criar nova configuração
        const { error } = await supabase
          .from('pricing_configs')
          .insert({
            config_data: config,
            is_default: true
          });

        if (error) {
          console.error('Erro ao inserir configurações:', error);
          return { success: false, error };
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return { success: false, error };
    }
  },

  async loadConfig(): Promise<PricingConfig | null> {
    try {
      const { data, error } = await supabase
        .from('pricing_configs')
        .select('config_data')
        .eq('is_default', true);

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
  }
};
