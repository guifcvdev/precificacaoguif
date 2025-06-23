import React from 'react';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabaseClient';

interface Props {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setTestResult: (result: string) => void;
}

const DatabaseTableList: React.FC<Props> = ({
  isLoading,
  setIsLoading,
  setTestResult
}) => {
  const listTables = async () => {
    setIsLoading(true);
    setTestResult('');
    
    try {
      const { data, error } = await supabase
        .from('config_sections')
        .select('title')
        .order('title');

      if (error) throw error;
      
      const tableNames = data.map(section => section.title).join(', ') || 'Nenhuma seção encontrada';
      setTestResult(`✅ Seções configuradas: ${tableNames}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      setTestResult(`❌ Erro ao listar seções: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={listTables} 
      disabled={isLoading}
      variant="outline"
      className="w-full"
    >
      {isLoading ? 'Listando...' : 'Listar Seções'}
    </Button>
  );
};

export default DatabaseTableList;
