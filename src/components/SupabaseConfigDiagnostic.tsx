import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export const SupabaseConfigDiagnostic: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: DiagnosticResult[] = [];

    // Teste 1: Verificar variáveis de ambiente
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || supabaseUrl === 'https://seu-projeto-id.supabase.co') {
      results.push({
        test: 'Variável VITE_SUPABASE_URL',
        status: 'error',
        message: 'URL do Supabase não configurada ou usando valor de exemplo',
        details: 'Configure VITE_SUPABASE_URL no arquivo .env.local'
      });
    } else if (!supabaseUrl.includes('supabase.co')) {
      results.push({
        test: 'Variável VITE_SUPABASE_URL',
        status: 'warning',
        message: 'URL do Supabase parece incorreta',
        details: `URL atual: ${supabaseUrl}`
      });
    } else {
      results.push({
        test: 'Variável VITE_SUPABASE_URL',
        status: 'success',
        message: 'URL do Supabase configurada corretamente',
        details: `URL: ${supabaseUrl}`
      });
    }

    if (!supabaseKey || supabaseKey === 'sua-chave-anonima-aqui') {
      results.push({
        test: 'Variável VITE_SUPABASE_ANON_KEY',
        status: 'error',
        message: 'Chave anônima do Supabase não configurada ou usando valor de exemplo',
        details: 'Configure VITE_SUPABASE_ANON_KEY no arquivo .env.local'
      });
    } else if (!supabaseKey.startsWith('eyJ')) {
      results.push({
        test: 'Variável VITE_SUPABASE_ANON_KEY',
        status: 'warning',
        message: 'Chave anônima parece incorreta',
        details: 'A chave deve começar com "eyJ"'
      });
    } else {
      results.push({
        test: 'Variável VITE_SUPABASE_ANON_KEY',
        status: 'success',
        message: 'Chave anônima configurada corretamente',
        details: `Chave: ${supabaseKey.substring(0, 20)}...`
      });
    }

    // Teste 2: Tentar conectar ao Supabase
    if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://seu-projeto-id.supabase.co') {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });

        if (response.ok) {
          results.push({
            test: 'Conexão com Supabase',
            status: 'success',
            message: 'Conexão estabelecida com sucesso',
            details: `Status: ${response.status}`
          });
        } else {
          results.push({
            test: 'Conexão com Supabase',
            status: 'error',
            message: 'Falha na conexão',
            details: `Status: ${response.status} - ${response.statusText}`
          });
        }
      } catch (error: any) {
        results.push({
          test: 'Conexão com Supabase',
          status: 'error',
          message: 'Erro de conectividade',
          details: error.message || 'Erro desconhecido'
        });
      }
    } else {
      results.push({
        test: 'Conexão com Supabase',
        status: 'error',
        message: 'Impossível testar conexão',
        details: 'Variáveis de ambiente não configuradas'
      });
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const hasErrors = diagnostics.some(d => d.status === 'error');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Diagnóstico de Configuração do Supabase
          <Button
            variant="outline"
            size="sm"
            onClick={runDiagnostics}
            disabled={isRunning}
          >
            <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Verificando...' : 'Atualizar'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasErrors && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Ação necessária:</strong> Configure as variáveis de ambiente no arquivo <code>.env.local</code>.
              Consulte o arquivo <code>README-SUPABASE-CONFIG.md</code> para instruções detalhadas.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {diagnostics.map((diagnostic, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${getStatusColor(diagnostic.status)}`}
            >
              <div className="flex items-start gap-3">
                {getIcon(diagnostic.status)}
                <div className="flex-1">
                  <div className="font-medium text-sm">{diagnostic.test}</div>
                  <div className="text-sm text-gray-600">{diagnostic.message}</div>
                  {diagnostic.details && (
                    <div className="text-xs text-gray-500 mt-1 font-mono">
                      {diagnostic.details}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!hasErrors && diagnostics.length > 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Configuração OK!</strong> O Supabase está configurado corretamente.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}; 