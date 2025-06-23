import { supabase } from './supabaseClient';

export const testSupabaseConnection = async () => {
  try {
    // Teste simples para verificar se o Supabase está respondendo
    const { data, error } = await supabase.from('pricing_configs').select('count(*)');
    
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
    // Limpar tabela existente
    await supabase.from('pricing_configs').delete().neq('id', 0);
    
    // Inserir configuração inicial
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