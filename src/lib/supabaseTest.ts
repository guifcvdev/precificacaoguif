import { supabase } from './supabaseClient';
import { defaultConfig } from '../types/pricing';

export const testSupabaseConnection = async () => {
  try {
    // Teste mais simples possível - apenas verificar se o Supabase responde
    const { data, error } = await supabase.from('pricing_configs').select('id').limit(1);
    
    if (error) {
      console.error('Erro ao conectar com o Supabase:', error);
      return { success: false, error };
    }
    
    console.log('Conexão com o Supabase bem-sucedida:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Exceção ao conectar com o Supabase:', error);
    return { success: false, error };
  }
};

export const createInitialConfig = async (config: any) => {
  try {
    // Abordagem mais simples: inserir diretamente sem tentar limpar antes
    const { data, error } = await supabase
      .from('pricing_configs')
      .insert({
        config_data: config,
        is_default: true
      });
    
    if (error) {
      console.error('Erro ao criar configuração inicial:', error);
      return { success: false, error };
    }
    
    console.log('Configuração inicial criada com sucesso:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Exceção ao criar configuração inicial:', error);
    return { success: false, error };
  }
}; 