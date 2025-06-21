
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { useToast } from '../hooks/use-toast';
import { runMigrations } from '../lib/db/migrations';
import { db } from '../lib/db/connection';
import { sql } from 'drizzle-orm';

const DatabaseTestPanel: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('teste@exemplo.com');
  const [testName, setTestName] = useState('Usuário Teste');
  const { toast } = useToast();

  // Check if database is available
  const isDatabaseAvailable = !!db && !!import.meta.env.VITE_DATABASE_URL;

  const runMigrationsTest = async () => {
    if (!isDatabaseAvailable) {
      setTestResult('❌ Banco de dados não disponível. Configure VITE_DATABASE_URL.');
      return;
    }

    setIsLoading(true);
    setTestResult('');
    
    try {
      await runMigrations();
      setTestResult('✅ Migrações executadas com sucesso!');
      toast({
        title: "Sucesso",
        description: "Migrações do banco executadas com sucesso.",
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      setTestResult(`❌ Erro nas migrações: ${errorMsg}`);
      toast({
        title: "Erro",
        description: "Falha ao executar migrações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testDatabaseConnection = async () => {
    if (!isDatabaseAvailable) {
      setTestResult('❌ Banco de dados não disponível. Configure VITE_DATABASE_URL.');
      return;
    }

    setIsLoading(true);
    setTestResult('');
    
    try {
      // Teste simples de conexão
      const result = await db.execute(sql`SELECT NOW() as current_time`);
      setTestResult(`✅ Conexão testada com sucesso! Hora do servidor: ${new Date().toLocaleString()}`);
      toast({
        title: "Sucesso",
        description: "Conexão com banco testada com sucesso.",
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      setTestResult(`❌ Erro na conexão: ${errorMsg}`);
      toast({
        title: "Erro",
        description: "Falha ao testar conexão com banco.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testUserCreation = async () => {
    if (!isDatabaseAvailable) {
      setTestResult('❌ Banco de dados não disponível. Configure VITE_DATABASE_URL.');
      return;
    }

    setIsLoading(true);
    setTestResult('');
    
    try {
      // Teste de inserção de usuário
      await db.execute(sql`
        INSERT INTO users (email, name) 
        VALUES (${testEmail}, ${testName}) 
        ON CONFLICT (email) DO UPDATE SET name = ${testName}
      `);
      
      // Verificar se foi inserido
      const users = await db.execute(sql`SELECT COUNT(*) as count FROM users WHERE email = ${testEmail}`);
      const userCount = users.rows?.[0]?.count || 0;
      setTestResult(`✅ Usuário criado/atualizado com sucesso! Usuário encontrado: ${userCount > 0 ? 'Sim' : 'Não'}`);
      toast({
        title: "Sucesso",
        description: "Usuário de teste criado com sucesso.",
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      setTestResult(`❌ Erro ao criar usuário: ${errorMsg}`);
      toast({
        title: "Erro",
        description: "Falha ao criar usuário de teste.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const listTables = async () => {
    if (!isDatabaseAvailable) {
      setTestResult('❌ Banco de dados não disponível. Configure VITE_DATABASE_URL.');
      return;
    }

    setIsLoading(true);
    setTestResult('');
    
    try {
      const tables = await db.execute(sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      
      const tableNames = tables.rows?.map((table: any) => table.table_name).join(', ') || 'Nenhuma tabela encontrada';
      setTestResult(`✅ Tabelas encontradas: ${tableNames}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      setTestResult(`❌ Erro ao listar tabelas: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isDatabaseAvailable) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          <strong>Banco de dados não configurado</strong>
          <br />
          Configure a variável VITE_DATABASE_URL para usar as funcionalidades do banco de dados.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          onClick={testDatabaseConnection} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Testando...' : 'Testar Conexão'}
        </Button>
        
        <Button 
          onClick={runMigrationsTest} 
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? 'Executando...' : 'Executar Migrações'}
        </Button>
        
        <Button 
          onClick={listTables} 
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? 'Listando...' : 'Listar Tabelas'}
        </Button>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Teste de Criação de Usuário</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="test-email">Email de Teste</Label>
            <Input
              id="test-email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="email@teste.com"
            />
          </div>
          <div>
            <Label htmlFor="test-name">Nome de Teste</Label>
            <Input
              id="test-name"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="Nome do usuário"
            />
          </div>
        </div>
        <Button 
          onClick={testUserCreation} 
          disabled={isLoading || !testEmail || !testName}
          className="w-full"
        >
          {isLoading ? 'Criando...' : 'Criar Usuário Teste'}
        </Button>
      </div>

      {testResult && (
        <Alert className={testResult.includes('❌') ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <AlertDescription>
            <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DatabaseTestPanel;
