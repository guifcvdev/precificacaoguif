
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CurrencyInput } from '../ui/currency-input';

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
            <CurrencyInput
              value={editConfig[section]?.[field.key] || ''}
              onChange={(value) => updateConfig(section, field.key, value)}
              placeholder="R$ 0,00"
              className="hover:bg-background/70"
            />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
));

ConfigSection.displayName = 'ConfigSection';

export default ConfigSection;
