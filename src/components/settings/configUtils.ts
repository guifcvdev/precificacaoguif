
import { PricingConfig } from '../../types/pricing';

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
          result[section][field][nestedField] = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(nestedValue);
        });
      } else {
        result[section][field] = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
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
          const currencyValue = fieldValue[nestedField];
          const cleanValue = currencyValue.replace(/[R$\s.]/g, '').replace(',', '.');
          const numericValue = parseFloat(cleanValue) || 0;
          result[section][field][nestedField] = numericValue;
        });
      } else {
        const currencyValue = fieldValue;
        const cleanValue = currencyValue.replace(/[R$\s.]/g, '').replace(',', '.');
        const numericValue = parseFloat(cleanValue) || 0;
        result[section][field] = numericValue;
      }
    });
  });
  return result as PricingConfig;
};
