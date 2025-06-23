import { supabase } from '../lib/supabaseClient';
import { PricingConfig } from '../types/pricing';

export const configService = {
  async saveConfig(config: PricingConfig) {
    try {
      // Primeiro, vamos buscar o registro existente
      const { data: existingConfig, error: fetchError } = await supabase
        .from('config_fields')
        .select('*');

      if (fetchError) throw fetchError;

      // Para cada seção no config
      for (const [sectionKey, sectionData] of Object.entries(config)) {
        for (const [fieldKey, value] of Object.entries(sectionData)) {
          const { error } = await supabase
            .from('config_fields')
            .upsert({
              section_key: sectionKey,
              field_key: fieldKey,
              value: value,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'section_key,field_key'
            });

          if (error) throw error;
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
        .from('config_fields')
        .select('*');

      if (error) throw error;

      if (!data || data.length === 0) return null;

      // Converter os dados do formato do banco para o formato do PricingConfig
      const config: PricingConfig = {};
      
      data.forEach(item => {
        if (!config[item.section_key]) {
          config[item.section_key] = {};
        }
        config[item.section_key][item.field_key] = item.value;
      });

      return config;
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      return null;
    }
  }
};
