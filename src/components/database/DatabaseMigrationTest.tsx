import React from 'react';
import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../lib/supabaseClient';

interface Props {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setTestResult: (result: string) => void;
}

const DatabaseMigrationTest: React.FC<Props> = ({
  isLoading,
  setIsLoading,
  setTestResult
}) => {
  const { toast } = useToast();

  const runMigrationsTest = async () => {
    setIsLoading(true);
    setTestResult('');
    
    try {
      // Aqui você pode adicionar a lógica específica para migrações do Supabase
      const { data, error } = await supabase.from('config_sections').select('count');
      
      if (error) throw error;
      
      setTestResult('✅ Verificação de tabelas concluída com sucesso!');
      toast({
        title: "Sucesso",
        description: "Verificação de tabelas concluída com sucesso.",
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      setTestResult(`❌ Erro na verificação: ${errorMsg}`);
      toast({
        title: "Erro",
        description: "Falha ao verificar tabelas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={runMigrationsTest} 
      disabled={isLoading}
      variant="outline"
      className="w-full"
    >
      {isLoading ? 'Verificando...' : 'Verificar Tabelas'}
    </Button>
  );
};

export default DatabaseMigrationTest;
