import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabaseClient';
import { 
  testSupabaseConnection, 
  checkBudgetObservationsTable, 
  initializeBudgetObservations
} from '../../lib/supabaseTest';

const BudgetObservationsTest: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  
  const testConnection = async () => {
    setIsLoading(true);
    setStatus('Testando conexão...');
    
    try {
      const result = await testSupabaseConnection();
      setResult(result);
      setStatus(result.success ? 'Conexão com sucesso!' : 'Falha na conexão');
    } catch (error) {
      setStatus('Erro ao testar conexão');
      setResult(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkTable = async () => {
    setIsLoading(true);
    setStatus('Verificando tabela...');
    
    try {
      const result = await checkBudgetObservationsTable();
      setResult(result);
      setStatus(result.message);
    } catch (error) {
      setStatus('Erro ao verificar tabela');
      setResult(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const initializeTable = async () => {
    setIsLoading(true);
    setStatus('Inicializando tabela...');
    
    try {
      const result = await initializeBudgetObservations();
      setResult(result);
      setStatus(result.message);
    } catch (error) {
      setStatus('Erro ao inicializar tabela');
      setResult(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const createDirectly = async () => {
    setIsLoading(true);
    setStatus('Criando tabela diretamente...');
    
    try {
      // Criação direta da tabela via SQL
      const { error } = await supabase.from('budget_observations').select('*').limit(1);
      
      if (error && error.code === '42P01') {
        // Tabela não existe, vamos criar
        const createResult = await supabase.rpc('execute_sql', {
          sql_query: `
          CREATE TABLE IF NOT EXISTS budget_observations (
            id SERIAL PRIMARY KEY,
            payment_method TEXT,
            delivery_time TEXT,
            warranty TEXT
          );
          
          ALTER TABLE budget_observations ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Allow anonymous select" ON budget_observations FOR SELECT USING (true);
          CREATE POLICY "Allow anonymous insert" ON budget_observations FOR INSERT WITH CHECK (true);
          CREATE POLICY "Allow anonymous update" ON budget_observations FOR UPDATE USING (true);
          `
        });
        
        if (createResult.error) {
          setResult(createResult);
          setStatus(`Erro ao criar tabela: ${createResult.error.message}`);
          setIsLoading(false);
          return;
        }
        
        // Inserir dados padrão
        const insertResult = await supabase
          .from('budget_observations')
          .insert({
            id: 1,
            payment_method: "- Entrada de 50% do valor e restante na retirada.\n- Parcelado no cartão a combinar.",
            delivery_time: "- Entrega do pedido em 7 úteis após a aprovação de arte e pagamento.",
            warranty: "*GARANTIA DE 3 MESES PARA O SERVIÇO ENTREGUE CONFORME A LEI Nº 8.078, DE 11 DE SETEMBRO DE 1990. Art. 26."
          });
        
        setResult(insertResult);
        setStatus(insertResult.error 
          ? `Erro ao inserir dados: ${insertResult.error.message}` 
          : 'Tabela criada e dados inseridos com sucesso!');
      } else if (error) {
        setResult({ error });
        setStatus(`Erro ao verificar tabela: ${error.message}`);
      } else {
        setResult({ success: true });
        setStatus('Tabela já existe');
      }
    } catch (error) {
      setStatus('Erro ao criar tabela diretamente');
      setResult(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const insertData = async () => {
    setIsLoading(true);
    setStatus('Inserindo dados...');
    
    try {
      const { error } = await supabase
        .from('budget_observations')
        .upsert({
          id: 1,
          payment_method: "- Entrada de 50% do valor e restante na retirada.\n- Parcelado no cartão a combinar.",
          delivery_time: "- Entrega do pedido em 7 úteis após a aprovação de arte e pagamento.",
          warranty: "*GARANTIA DE 3 MESES PARA O SERVIÇO ENTREGUE CONFORME A LEI Nº 8.078, DE 11 DE SETEMBRO DE 1990. Art. 26."
        });
      
      setResult({ error });
      setStatus(error 
        ? `Erro ao inserir dados: ${error.message}` 
        : 'Dados inseridos com sucesso!');
    } catch (error) {
      setStatus('Erro ao inserir dados');
      setResult(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle>Teste de Tabela de Observações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={testConnection} disabled={isLoading}>
              Testar Conexão
            </Button>
            <Button onClick={checkTable} disabled={isLoading}>
              Verificar Tabela
            </Button>
            <Button onClick={initializeTable} disabled={isLoading}>
              Inicializar Tabela
            </Button>
            <Button onClick={createDirectly} disabled={isLoading}>
              Criar Diretamente
            </Button>
            <Button onClick={insertData} disabled={isLoading}>
              Inserir Dados
            </Button>
          </div>
          
          <div className="mt-4">
            <div className="font-medium">Status:</div>
            <div className={`p-2 rounded ${status.includes('sucesso') || status.includes('Conexão com sucesso') ? 'bg-green-100' : status.includes('Erro') || status.includes('Falha') ? 'bg-red-100' : 'bg-blue-100'}`}>
              {status || 'Nenhuma operação realizada'}
            </div>
          </div>
          
          {result && (
            <div className="mt-4">
              <div className="font-medium">Resultado:</div>
              <pre className="p-2 bg-gray-100 rounded overflow-auto max-h-64 text-xs">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetObservationsTest; 