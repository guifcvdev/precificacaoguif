import { PricingConfig } from '../../types/pricing';

const isPercentageField = (section: string, field: string) => {
  return (section === 'notaFiscal' && field === 'percentual') ||
         (section === 'cartaoCredito' && (field === 'taxa3x' || field === 'taxa6x' || field === 'taxa12x'));
};

const isMetricField = (section: string, field: string) => {
  return (section === 'fachada' && field === 'estruturaMetalica.comprimentoBarra') ||
         (section === 'luminoso' && field === 'estruturaMetalica.comprimentoBarra');
};

export const convertConfigToCurrency = (config: PricingConfig) => {
  const result: any = {};
  Object.keys(config).forEach(section => {
    result[section] = {};
    const sectionData = config[section as keyof PricingConfig] as any;
    Object.keys(sectionData).forEach(field => {
      const value = sectionData[field];
      if (typeof value === 'object' && value !== null) {
        // Handle nested objects like estruturaMetalica
        result[section][field] = {};
        Object.keys(value).forEach(nestedField => {
          const nestedValue = value[nestedField];
          if (isPercentageField(section, `${field}.${nestedField}`)) {
            result[section][field][nestedField] = nestedValue.toString();
          } else if (isMetricField(section, `${field}.${nestedField}`)) {
            result[section][field][nestedField] = nestedValue.toString();
          } else {
            result[section][field][nestedField] = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(nestedValue);
          }
        });
      } else {
        if (isPercentageField(section, field)) {
          result[section][field] = value.toString();
        } else {
          result[section][field] = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value);
        }
      }
    });
  });
  return result;
};

export const convertCurrencyToNumbers = (currencyConfig: any): PricingConfig => {
  const result: any = {};
  Object.keys(currencyConfig).forEach(section => {
    result[section] = {};
    Object.keys(currencyConfig[section]).forEach(field => {
      const fieldValue = currencyConfig[section][field];
      if (typeof fieldValue === 'object' && fieldValue !== null) {
        // Handle nested objects like estruturaMetalica
        result[section][field] = {};
        Object.keys(fieldValue).forEach(nestedField => {
          const value = fieldValue[nestedField];
          if (isPercentageField(section, `${field}.${nestedField}`)) {
            const numericValue = parseFloat(value) || 0;
            result[section][field][nestedField] = numericValue;
          } else if (isMetricField(section, `${field}.${nestedField}`)) {
            const numericValue = parseFloat(value) || 0;
            result[section][field][nestedField] = numericValue;
          } else {
            const cleanValue = value.replace(/[R$\s.]/g, '').replace(',', '.');
            const numericValue = parseFloat(cleanValue) || 0;
            result[section][field][nestedField] = numericValue;
          }
        });
      } else {
        if (isPercentageField(section, field)) {
          const numericValue = parseFloat(fieldValue) || 0;
          result[section][field] = numericValue;
        } else {
          const cleanValue = fieldValue.replace(/[R$\s.]/g, '').replace(',', '.');
          const numericValue = parseFloat(cleanValue) || 0;
          result[section][field] = numericValue;
        }
      }
    });
  });
  return result as PricingConfig;
};
