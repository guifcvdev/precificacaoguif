import { supabase } from '../lib/supabaseClient';
import { PricingConfig } from '../types/pricing';

export const configService = {
  async saveConfig(config: PricingConfig) {
    try {
      // Buscar configuração existente
      const { data: existingConfig, error: fetchError } = await supabase
        .from('pricing_configs')
        .select('*')
        .eq('is_default', true)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 é o código para "não encontrado"
        throw fetchError;
      }

      if (existingConfig) {
        // Atualizar configuração existente
        const { error } = await supabase
          .from('pricing_configs')
          .update({
            config_data: config,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConfig.id);

        if (error) throw error;
      } else {
        // Criar nova configuração
        const { error } = await supabase
          .from('pricing_configs')
          .insert({
            config_data: config,
            is_default: true
          });

        if (error) throw error;
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
        .eq('is_default', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // Não encontrado
          return null;
        }
        throw error;
      }

      return data?.config_data as PricingConfig || null;
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      return null;
    }
  }
};
