import { supabase } from '../supabaseClient';

// Função auxiliar para obter o usuário atual
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

// Exportar apenas o cliente Supabase
export { supabase as db };
export type Database = typeof supabase;
