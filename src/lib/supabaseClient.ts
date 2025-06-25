import { createClient } from '@supabase/supabase-js';

// Obtém as variáveis de ambiente do Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação das variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: Variáveis de ambiente do Supabase não configuradas!');
  console.error('Por favor, configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.local');
  console.error('Exemplo:');
  console.error('VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co');
  console.error('VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui');
}

// Verifica se as URLs são válidas
if (supabaseUrl && !supabaseUrl.includes('supabase.co')) {
  console.warn('⚠️ Aviso: URL do Supabase parece estar incorreta. Verifique se está no formato: https://seu-projeto-id.supabase.co');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
); 