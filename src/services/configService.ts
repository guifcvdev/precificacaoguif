import { supabase } from '../lib/supabaseClient';
import { PricingConfig } from '../types/pricing';

export const configService = {
  async saveConfig(config: PricingConfig) {
    try {
      // Abordagem mais simples: apenas inserir sem tentar deletar
      const { error } = await supabase
        .from('pricing_configs')
        .insert({
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
  }
};
