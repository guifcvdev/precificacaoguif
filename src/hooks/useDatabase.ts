import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './use-toast';

export const useDatabase = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const initializeDatabase = async () => {
    if (isInitializing || isInitialized) return;

    setIsInitializing(true);
    setError(null);

    try {
      // Testar conexão com Supabase
      const { data, error: connectionError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (connectionError && connectionError.code !== 'PGRST116') {
        throw connectionError;
      }

      setIsInitialized(true);
      toast({
        title: "Banco de dados conectado",
        description: "Conexão com Supabase estabelecida com sucesso.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: "Erro na conexão",
        description: "Falha ao conectar com o banco de dados Supabase.",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // Função para verificar se o usuário está autenticado
  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (err) {
      console.error('Erro na autenticação:', err);
      return null;
    }
  };

  useEffect(() => {
    initializeDatabase();
  }, []);

  return {
    isInitialized,
    isInitializing,
    error,
    initializeDatabase,
    checkAuth,
  };
};
