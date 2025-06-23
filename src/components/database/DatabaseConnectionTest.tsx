import React from 'react';
import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../lib/supabaseClient';

interface Props {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setTestResult: (result: string) => void;
}

const DatabaseConnectionTest: React.FC<Props> = ({
  isLoading,
  setIsLoading,
  setTestResult
}) => {
  const { toast } = useToast();

  const testDatabaseConnection = async () => {
    setIsLoading(true);
    setTestResult('');
    
    try {
      const { data, error } = await supabase.from('config_sections').select('count');
      
      if (error) throw error;
      
      setTestResult(`✅ Conexão com Supabase testada com sucesso! ${new Date().toLocaleString()}`);
      toast({
        title: "Sucesso",
        description: "Conexão com Supabase testada com sucesso.",
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      setTestResult(`❌ Erro na conexão: ${errorMsg}`);
      toast({
        title: "Erro",
        description: "Falha ao testar conexão com Supabase.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={testDatabaseConnection} 
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? 'Testando...' : 'Testar Conexão com Supabase'}
    </Button>
  );
};

export default DatabaseConnectionTest;
