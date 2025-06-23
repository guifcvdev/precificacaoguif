import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CurrencyInput } from '../ui/currency-input';
import { PercentageInput } from '../ui/percentage-input';
import { configService } from '../../services/configService';
import { useToast } from '../../hooks/use-toast';

interface ConfigSectionProps {
  title: string;
  section: string;
  fields: Array<{key: string, label: string, unit?: string}>;
  editConfig: any;
  updateConfig: (section: string, field: string, value: string) => void;
}

const ConfigSection = React.memo<ConfigSectionProps>(({ title, section, fields, editConfig, updateConfig }) => {
  const { toast } = useToast();

  const getFieldValue = (field: string) => {
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.');
      return editConfig[section]?.[parentField]?.[childField] || '';
    }
    return editConfig[section]?.[field] || '';
  };

  const handleFieldChange = async (field: string, value: string) => {
    try {
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        // Create nested object update
        const currentParent = editConfig[section]?.[parentField] || {};
        const updatedParent = { ...currentParent, [childField]: value };
        updateConfig(section, parentField, updatedParent);
      } else {
        updateConfig(section, field, value);
      }

      // Salvar no Supabase
      const { success, error } = await configService.saveConfig({
        ...editConfig,
        [section]: {
          ...editConfig[section],
          [field]: value
        }
      });

      if (!success && error) {
        throw error;
      }
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a configuração.",
        variant: "destructive"
      });
    }
  };

  const isPercentageField = (sectionName: string, fieldKey: string) => {
    return (sectionName === 'notaFiscal' && fieldKey === 'percentual') ||
           (sectionName === 'cartaoCredito' && (fieldKey === 'taxa3x' || fieldKey === 'taxa6x' || fieldKey === 'taxa12x'));
  };

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
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
              {isPercentageField(section, field.key) ? (
                <PercentageInput
                  value={getFieldValue(field.key)}
                  onChange={(value) => handleFieldChange(field.key, value)}
                  className="hover:bg-background/70"
                />
              ) : (
                <CurrencyInput
                  value={getFieldValue(field.key)}
                  onChange={(value) => handleFieldChange(field.key, value)}
                  placeholder="R$ 0,00"
                  className="hover:bg-background/70"
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

ConfigSection.displayName = 'ConfigSection';

export default ConfigSection;
