import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { supabase } from '../supabaseClient';

// Função para obter a URL do banco de dados
const getDatabaseUrl = () => {
  // Primeiro tenta localStorage (configuração do usuário)
  const localConfig = localStorage.getItem('databaseConnectionString');
  if (localConfig) {
    return localConfig;
  }
  
  // Fallback para variável de ambiente
  return import.meta.env.VITE_DATABASE_URL;
};

// Obter URL do banco de dados
const databaseUrl = getDatabaseUrl();

// Criar conexão apenas se a URL for fornecida
let client: any = null;
let db: any = null;

if (databaseUrl) {
  try {
    client = postgres(databaseUrl);
    db = drizzle(client, { schema });
  } catch (error) {
    console.error('Falha ao inicializar a conexão com o banco de dados:', error);
  }
}

// Função auxiliar para obter o usuário atual
const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export { db, client, getCurrentUser };
export type Database = typeof db;
