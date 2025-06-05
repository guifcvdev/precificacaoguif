import React, { useState } from 'react';
import { ArrowDown, Settings } from 'lucide-react';
import { PricingConfig, formatCurrency } from '../types/pricing';

interface Props {
  config: PricingConfig;
  onSave: (config: PricingConfig) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<Props> = ({ config, onSave, onClose }) => {
  // Convert numbers to strings for editing
  const convertConfigToStrings = (config: PricingConfig) => {
    const result: any = {};
    Object.keys(config).forEach(section => {
      result[section] = {};
      Object.keys(config[section as keyof PricingConfig] as any).forEach(field => {
        const value = (config[section as keyof PricingConfig] as any)[field];
        result[section][field] = value.toString().replace('.', ',');
      });
    });
    return result;
  };

  // Convert strings back to numbers for saving
  const convertStringsToNumbers = (stringConfig: any): PricingConfig => {
    const result: any = {};
    Object.keys(stringConfig).forEach(section => {
      result[section] = {};
      Object.keys(stringConfig[section]).forEach(field => {
        const stringValue = stringConfig[section][field];
        const numericValue = parseFloat(stringValue.replace(',', '.')) || 0;
        result[section][field] = numericValue;
      });
    });
    return result as PricingConfig;
  };

  const [editConfig, setEditConfig] = useState(convertConfigToStrings(config));

  const handleSave = () => {
    const numericConfig = convertStringsToNumbers(editConfig);
    onSave(numericConfig);
    onClose();
  };

  const updateConfig = (section: string, field: string, value: string) => {
    // Allow numbers, comma, and dot
    const cleanValue = value.replace(/[^0-9,]/g, '');
    
    setEditConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: cleanValue
      }
    }));
  };

  const formatInputValue = (value: string) => {
    // Ensure we have a string
    return value || '';
  };

  const ConfigSection = ({ title, section, fields }: { title: string; section: string; fields: Array<{key: string, label: string, unit?: string}> }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(field => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label} {field.unit && `(${field.unit})`}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
              <input
                type="text"
                value={formatInputValue(editConfig[section]?.[field.key] || '')}
                onChange={(e) => updateConfig(section, field.key, e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0,00"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Settings className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Configurações de Preços</h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            <strong>Importante:</strong> Todos os produtos que utilizam cálculo por m² têm um valor mínimo de R$ 20,00 automaticamente aplicado.
          </p>
        </div>

        <ConfigSection
          title="Adesivo"
          section="adesivo"
          fields={[
            { key: 'corteEspecial', label: 'Corte Especial', unit: 'm²' },
            { key: 'soRefile', label: 'Só Refile', unit: 'm²' },
            { key: 'laminado', label: 'Laminado', unit: 'm²' },
            { key: 'adesivoPerfurado', label: 'Adesivo Perfurado', unit: 'm²' },
            { key: 'imantado', label: 'Imantado', unit: 'm²' },
          ]}
        />

        <ConfigSection
          title="Lona"
          section="lona"
          fields={[
            { key: 'bannerFaixa', label: 'Banner/Faixa', unit: 'm²' },
            { key: 'reforcoIlhos', label: 'Reforço e Ilhós', unit: 'm²' },
            { key: 'lonaBacklight', label: 'Lona Backlight', unit: 'm²' },
            { key: 'soRefile', label: 'Só Refile', unit: 'm²' },
          ]}
        />

        <ConfigSection
          title="Placa em PS"
          section="placaPS"
          fields={[
            { key: 'base', label: 'Preço Base', unit: 'm²' },
            { key: 'espessura1mm', label: 'Adicional Espessura 1mm', unit: 'm²' },
            { key: 'espessura2mm', label: 'Adicional Espessura 2mm', unit: 'm²' },
            { key: 'transparente', label: 'Adicional Transparente', unit: 'm²' },
            { key: 'leitoso', label: 'Adicional Leitoso', unit: 'm²' },
            { key: 'brancoPreto', label: 'Adicional Branco/Preto', unit: 'm²' },
            { key: 'somentePlaca', label: 'Adicional Somente Placa', unit: 'm²' },
            { key: 'placaAdesivada', label: 'Adicional Placa Adesivada', unit: 'm²' },
          ]}
        />

        <ConfigSection
          title="Placa em ACM"
          section="placaACM"
          fields={[
            { key: 'preco', label: 'Preço por m²', unit: 'm²' },
          ]}
        />

        <ConfigSection
          title="Fachada Simples"
          section="fachada"
          fields={[
            { key: 'lona', label: 'Lona', unit: 'm²' },
            { key: 'metalon20x20', label: 'Metalon 20x20', unit: 'unid' },
            { key: 'metalon30x20', label: 'Metalon 30x20', unit: 'unid' },
            { key: 'acm122', label: 'ACM 1.22m', unit: 'unid' },
            { key: 'acm150', label: 'ACM 1.50m', unit: 'unid' },
            { key: 'cantoneira', label: 'Cantoneira 3/4', unit: 'unid' },
          ]}
        />

        <ConfigSection
          title="Letra Caixa em PVC"
          section="letraCaixa"
          fields={[
            { key: 'base', label: 'Preço Base', unit: 'm²' },
            { key: 'espessura10mm', label: 'Adicional Espessura 10mm', unit: 'm²' },
            { key: 'espessura15mm', label: 'Adicional Espessura 15mm', unit: 'm²' },
            { key: 'espessura20mm', label: 'Adicional Espessura 20mm', unit: 'm²' },
            { key: 'pinturaAutomotiva', label: 'Adicional Pintura Automotiva', unit: 'm²' },
            { key: 'fitaDuplaFace', label: 'Adicional Fita Dupla-Face', unit: 'm²' },
          ]}
        />

        <ConfigSection
          title="Vidro Temperado"
          section="vidro"
          fields={[
            { key: 'base', label: 'Preço Base', unit: 'm²' },
            { key: 'espessura6mm', label: 'Adicional Espessura 6mm', unit: 'm²' },
            { key: 'espessura8mm', label: 'Adicional Espessura 8mm', unit: 'm²' },
            { key: 'prolongadores', label: 'Prolongadores', unit: 'unid' },
          ]}
        />
      </div>
    </div>
  );
};

export default SettingsPanel;
