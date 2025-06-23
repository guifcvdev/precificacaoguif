import React, { useState, useEffect } from 'react';
import { PricingConfig } from '../types/pricing';
import SettingsLayout from './settings/SettingsLayout';
import SettingsHeader from './settings/SettingsHeader';
import ConfigSection from './settings/ConfigSection';
import BudgetObservationsSettings from './settings/BudgetObservationsSettings';
import { settingsConfig } from './settings/settingsConfig';
import { convertConfigToCurrency, convertCurrencyToNumbers } from './settings/configUtils';
import { configService } from '../services/configService';
import { useToast } from '../hooks/use-toast';

interface Props {
  config: PricingConfig;
  onSave: (config: PricingConfig) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<Props> = ({ config, onSave, onClose }) => {
  const [editConfig, setEditConfig] = useState(convertConfigToCurrency(config));
  const { toast } = useToast();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
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
    }
  };

  const handleSave = async () => {
    try {
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
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg backdrop-blur-sm">
          <p className="text-blue-800">
            <strong>Importante:</strong> Todos os produtos que utilizam cálculo por m² têm um valor mínimo de R$ 20,00 automaticamente aplicado.
          </p>
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
