import React, { useState, useEffect } from 'react';
import { PricingConfig, defaultConfig } from '../types/pricing';
import SettingsLayout from './settings/SettingsLayout';
import SettingsHeader from './settings/SettingsHeader';
import ConfigSection from './settings/ConfigSection';
import BudgetObservationsSettings from './settings/BudgetObservationsSettings';
import { settingsConfig } from './settings/settingsConfig';
import { convertConfigToCurrency, convertCurrencyToNumbers } from './settings/configUtils';
import { configService } from '../services/configService';
import { useToast } from '../hooks/use-toast';
import { Button } from './ui/button';
import { testSupabaseConnection, createInitialConfig, createPricingConfigsTable } from '../lib/supabaseTest';
import { SupabaseConfigDiagnostic } from './SupabaseConfigDiagnostic';

interface Props {
  config: PricingConfig;
  onSave: (config: PricingConfig) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<Props> = ({ config, onSave, onClose }) => {
  const [editConfig, setEditConfig] = useState(convertConfigToCurrency(config));
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadConfig();
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const result = await testSupabaseConnection();
    setConnectionStatus(result.success ? 'Conectado' : 'Erro de conexão');
    
    if (!result.success) {
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao Supabase. Verifique o console para mais detalhes.",
        variant: "destructive"
      });
    }
  };

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      const savedConfig = await configService.loadConfig();
      if (savedConfig) {
        setEditConfig(convertConfigToCurrency(savedConfig));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const numericConfig = convertCurrencyToNumbers(editConfig);
      const { success, error } = await configService.saveConfig(numericConfig);
      
      if (!success && error) {
        throw error;
      }

      onSave(numericConfig);
      onClose();
      
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso."
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeConfig = async () => {
    try {
      setIsLoading(true);
      
      // Primeiro, criar a tabela se não existir
      const tableResult = await createPricingConfigsTable();
      if (!tableResult.success) {
        console.error('Erro ao criar tabela pricing_configs:', tableResult.error);
        // Continuar mesmo com erro, pois pode ser que a tabela já exista
      }
      
      // Agora inserir a configuração inicial
      const result = await createInitialConfig(defaultConfig);
      
      if (!result.success) {
        throw result.error;
      }
      
      setEditConfig(convertConfigToCurrency(defaultConfig));
      
      toast({
        title: "Sucesso",
        description: "Configurações inicializadas com sucesso."
      });
    } catch (error) {
      console.error('Erro ao inicializar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível inicializar as configurações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const initializeTables = async () => {
    try {
      setIsLoading(true);
      
      // Criar tabela pricing_configs
      const pricingTableResult = await createPricingConfigsTable();
      if (!pricingTableResult.success) {
        console.error('Erro ao criar tabela pricing_configs:', pricingTableResult.error);
      }
      
      // Criar tabela budget_observations
      const observationsTableResult = await configService.createBudgetObservationsTable();
      if (!observationsTableResult.success) {
        console.error('Erro ao criar tabela budget_observations:', observationsTableResult.error);
      }
      
      // Se ambas as operações falharem, lançar erro
      if (!pricingTableResult.success && !observationsTableResult.success) {
        throw new Error('Falha ao criar as tabelas no banco de dados');
      }
      
      toast({
        title: "Sucesso",
        description: "Tabelas do banco de dados inicializadas com sucesso."
      });
    } catch (error) {
      console.error('Erro ao inicializar tabelas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível inicializar todas as tabelas do banco de dados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = (section: string, field: string, value: string | object) => {
    setEditConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <SettingsLayout>
      <SettingsHeader onSave={handleSave} onClose={onClose} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Diagnóstico de Configuração do Supabase */}
        <div className="mb-6">
          <SupabaseConfigDiagnostic />
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg backdrop-blur-sm">
          <p className="text-blue-800">
            <strong>Importante:</strong> Todos os produtos que utilizam cálculo por m² têm um valor mínimo de R$ 20,00 automaticamente aplicado.
          </p>
          
          {connectionStatus && (
            <div className={`mt-2 p-2 rounded ${connectionStatus === 'Conectado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              Status da conexão: {connectionStatus}
            </div>
          )}
          
          <div className="mt-4 flex flex-wrap gap-3">
            <Button 
              onClick={initializeConfig} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? 'Processando...' : 'Inicializar Configurações'}
            </Button>
            
            <Button 
              onClick={checkConnection} 
              disabled={isLoading}
              variant="outline"
            >
              Testar Conexão
            </Button>
            
            <Button 
              onClick={initializeTables} 
              disabled={isLoading}
              variant="outline"
            >
              Inicializar Tabelas
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Configurações das Observações do Orçamento */}
          <BudgetObservationsSettings />

          {/* Configurações de Preços */}
          {settingsConfig.map((sectionConfig) => (
            <ConfigSection
              key={sectionConfig.section}
              title={sectionConfig.title}
              section={sectionConfig.section}
              fields={sectionConfig.fields}
              editConfig={editConfig}
              updateConfig={updateConfig}
            />
          ))}
        </div>
      </div>
    </SettingsLayout>
  );
};

export default SettingsPanel;
