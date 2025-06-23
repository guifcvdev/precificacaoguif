import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../lib/supabaseClient';

interface Props {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setTestResult: (result: string) => void;
}

const DatabaseUserTest: React.FC<Props> = ({
  isLoading,
  setIsLoading,
  setTestResult
}) => {
  const [testEmail, setTestEmail] = useState('teste@exemplo.com');
  const [testName, setTestName] = useState('Usuário Teste');
  const { toast } = useToast();

  const testUserCreation = async () => {
    setIsLoading(true);
    setTestResult('');
    
    try {
      const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('id')
        .eq('email', testEmail)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }

      if (existingUser) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ name: testName })
          .eq('id', existingUser.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ email: testEmail, name: testName }]);

        if (insertError) throw insertError;
      }
      
      setTestResult(`✅ Usuário ${existingUser ? 'atualizado' : 'criado'} com sucesso!`);
      toast({
        title: "Sucesso",
        description: `Usuário de teste ${existingUser ? 'atualizado' : 'criado'} com sucesso.`,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      setTestResult(`❌ Erro ao manipular usuário: ${errorMsg}`);
      toast({
        title: "Erro",
        description: "Falha ao manipular usuário de teste.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        {isLoading ? 'Processando...' : 'Criar/Atualizar Usuário Teste'}
      </Button>
    </div>
  );
};

export default DatabaseUserTest;
