import React, { useState } from 'react';
import { PricingConfig } from '../types/pricing';
import SettingsLayout from './settings/SettingsLayout';
import SettingsHeader from './settings/SettingsHeader';
import ConfigSection from './settings/ConfigSection';
import BudgetObservationsSettings from './settings/BudgetObservationsSettings';
import DatabaseStatus from './DatabaseStatus';
import DatabaseTestPanel from './DatabaseTestPanel';
import { settingsConfig } from './settings/settingsConfig';
import { convertConfigToCurrency, convertCurrencyToNumbers } from './settings/configUtils';

interface Props {
  config: PricingConfig;
  onSave: (config: PricingConfig) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<Props> = ({ config, onSave, onClose }) => {
  const [editConfig, setEditConfig] = useState(convertConfigToCurrency(config));

  const handleSave = () => {
    const numericConfig = convertCurrencyToNumbers(editConfig);
    onSave(numericConfig);
    onClose();
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
          {/* Status e Testes do Banco de Dados */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Status e Verificações do Banco de Dados</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Status da Conexão</h3>
                <DatabaseStatus />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Testes e Verificações</h3>
                <DatabaseTestPanel />
              </div>
            </div>
          </div>

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
