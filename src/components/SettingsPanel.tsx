import React, { useState } from 'react';
import { ArrowDown, Settings, Save, X } from 'lucide-react';
import { PricingConfig, formatCurrency } from '../types/pricing';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ThemeToggle from './ThemeToggle';

interface Props {
  config: PricingConfig;
  onSave: (config: PricingConfig) => void;
  onClose: () => void;
}

interface ConfigSectionProps {
  title: string;
  section: string;
  fields: Array<{key: string, label: string, unit?: string}>;
  editConfig: any;
  updateConfig: (section: string, field: string, value: string) => void;
}

const ConfigSection = React.memo<ConfigSectionProps>(({ title, section, fields, editConfig, updateConfig }) => (
  <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
    <CardHeader className="pb-4">
      <CardTitle className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(field => (
          <div key={`${section}-${field.key}`} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.label} {field.unit && `(${field.unit})`}
            </label>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-medium">
                R$
              </span>
              <input
                type="text"
                value={editConfig[section]?.[field.key] || ''}
                onChange={(e) => updateConfig(section, field.key, e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 placeholder:text-muted-foreground hover:bg-background/70"
                placeholder="0,00"
              />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
));

ConfigSection.displayName = 'ConfigSection';

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
    const cleanValue = value.replace(/[^0-9,]/g, '');
    
    setEditConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: cleanValue
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Configurações de Preços
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl">
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg backdrop-blur-sm">
          <p className="text-blue-800 dark:text-blue-200">
            <strong>Importante:</strong> Todos os produtos que utilizam cálculo por m² têm um valor mínimo de R$ 20,00 automaticamente aplicado.
          </p>
        </div>

        <div className="space-y-6">
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
            editConfig={editConfig}
            updateConfig={updateConfig}
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
            editConfig={editConfig}
            updateConfig={updateConfig}
          />

          <ConfigSection
            title="Placa em PS"
            section="placaPS"
            fields={[
              { key: 'transparente1mm', label: 'Transparente 1mm', unit: 'm²' },
              { key: 'leitoso1mm', label: 'Leitoso 1mm', unit: 'm²' },
              { key: 'brancoPreto1mm', label: 'Branco/Preto 1mm', unit: 'm²' },
              { key: 'transparente1mmAdesivada', label: 'Transparente 1mm Adesivada', unit: 'm²' },
              { key: 'leitoso1mmAdesivada', label: 'Leitoso 1mm Adesivada', unit: 'm²' },
              { key: 'brancoPreto1mmAdesivada', label: 'Branco/Preto 1mm Adesivada', unit: 'm²' },
              { key: 'transparente2mm', label: 'Transparente 2mm', unit: 'm²' },
              { key: 'leitoso2mm', label: 'Leitoso 2mm', unit: 'm²' },
              { key: 'brancoPreto2mm', label: 'Branco/Preto 2mm', unit: 'm²' },
              { key: 'transparente2mmAdesivada', label: 'Transparente 2mm Adesivada', unit: 'm²' },
              { key: 'leitoso2mmAdesivada', label: 'Leitoso 2mm Adesivada', unit: 'm²' },
              { key: 'brancoPreto2mmAdesivada', label: 'Branco/Preto 2mm Adesivada', unit: 'm²' },
            ]}
            editConfig={editConfig}
            updateConfig={updateConfig}
          />

          <ConfigSection
            title="Placa em ACM"
            section="placaACM"
            fields={[
              { key: 'preco', label: 'Preço por m²', unit: 'm²' },
            ]}
            editConfig={editConfig}
            updateConfig={updateConfig}
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
            editConfig={editConfig}
            updateConfig={updateConfig}
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
            editConfig={editConfig}
            updateConfig={updateConfig}
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
            editConfig={editConfig}
            updateConfig={updateConfig}
          />
        </div>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  );
};

export default SettingsPanel;
