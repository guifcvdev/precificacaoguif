
import React, { useState } from 'react';
import { ArrowLeft, Settings, Save, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { PricingConfig, formatCurrency } from '../types/pricing';

interface Props {
  config: PricingConfig;
  onSave: (config: PricingConfig) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<Props> = ({ config, onSave, onClose }) => {
  const { theme } = useTheme();
  
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
    <div className="modern-card p-8 mb-8 animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map(field => (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">
              {field.label}
              {field.unit && <span className="text-muted-foreground ml-1">({field.unit})</span>}
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">
                R$
              </span>
              <input
                type="text"
                value={formatInputValue(editConfig[section]?.[field.key] || '')}
                onChange={(e) => updateConfig(section, field.key, e.target.value)}
                className="modern-input pl-12 group-hover:border-primary/30 focus:border-primary"
                placeholder="0,00"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen gradient-bg theme-transition">
      {/* Header */}
      <div className="header-gradient border-b border-border shadow-xl theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4 animate-fade-in">
              <button
                onClick={onClose}
                className="p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-200 border border-border"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Configurações de Preços
                </h1>
                <p className="text-sm text-muted-foreground">Gerencie os valores de todos os produtos</p>
              </div>
            </div>
            
            <div className="flex space-x-3 animate-fade-in">
              <button
                onClick={onClose}
                className="modern-button-secondary flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
              <button
                onClick={handleSave}
                className="modern-button-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl animate-fade-in">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Importante</h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                Todos os produtos que utilizam cálculo por m² têm um valor mínimo de R$ 20,00 automaticamente aplicado.
                Use vírgula (,) como separador decimal.
              </p>
            </div>
          </div>
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
