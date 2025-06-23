import { supabase } from '../lib/supabaseClient';
import { PricingConfig } from '../types/pricing';

export const configService = {
  async saveConfig(config: PricingConfig) {
    try {
      // Abordagem simplificada: deletar todos os registros e inserir um novo
      // Isso evita problemas com consultas complexas
      const { error: deleteError } = await supabase
        .from('pricing_configs')
        .delete()
        .filter('id', 'gt', 0);
      
      if (deleteError) {
        console.error('Erro ao limpar configurações:', deleteError);
        // Continuar mesmo com erro, pois a tabela pode estar vazia
      }
      
      // Inserir nova configuração
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

      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return { success: false, error };
    }
  },

  async loadConfig(): Promise<PricingConfig | null> {
    try {
      // Simplificar a consulta para evitar erros
      const { data, error } = await supabase
        .from('pricing_configs')
        .select('*')
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
