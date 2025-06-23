import { supabase } from './supabaseClient';

export const testSupabaseConnection = async () => {
  try {
    // Teste simples para verificar se o Supabase está respondendo
    // Usar uma consulta mais simples que não depende de tabelas específicas
    const { data, error } = await supabase.rpc('get_server_version');
    
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
    // Limpar tabela existente - usar uma abordagem mais segura
    const { error: deleteError } = await supabase
      .from('pricing_configs')
      .delete()
      .filter('id', 'gt', 0);
    
    if (deleteError) {
      console.error('Erro ao limpar configurações existentes:', deleteError);
      // Continuar mesmo com erro, pois a tabela pode estar vazia
    }
    
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