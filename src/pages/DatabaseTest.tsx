import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database } from 'lucide-react';
import { Button } from '../components/ui/button';
import DatabaseStatus from '../components/DatabaseStatus';
import DatabaseTestPanel from '../components/DatabaseTestPanel';

const DatabaseTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          
          <div className="flex items-center space-x-3 mb-6">
            <Database className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Teste do Banco de Dados
              </h1>
              <p className="text-gray-600">
                Verificação e teste da conexão com Supabase
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Status da Conexão</h2>
            <DatabaseStatus />
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Testes do Banco de Dados</h2>
            <DatabaseTestPanel />
          </div>

          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Configuração do Supabase
            </h3>
            <p className="text-blue-800 text-sm mb-3">
              O banco de dados está configurado para usar Supabase com as seguintes credenciais:
            </p>
            <div className="space-y-2">
              <code className="block bg-blue-100 text-blue-900 p-3 rounded text-sm font-mono">
                SUPABASE_URL: https://xhtnzcvdstrtwicxdacl.supabase.co
              </code>
              <code className="block bg-blue-100 text-blue-900 p-3 rounded text-sm font-mono">
                SUPABASE_ANON_KEY: [Configurado]
              </code>
            </div>
            <p className="text-blue-700 text-xs mt-2">
              Para uma nova configuração, execute os scripts SQL no painel do Supabase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest;
