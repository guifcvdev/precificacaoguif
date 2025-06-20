
import { PricingConfig } from '../../types/pricing';

export const convertConfigToCurrency = (config: PricingConfig) => {
  const result: any = {};
  Object.keys(config).forEach(section => {
    result[section] = {};
    Object.keys(config[section as keyof PricingConfig] as any).forEach(field => {
      const value = (config[section as keyof PricingConfig] as any)[field];
      result[section][field] = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    });
  });
  return result;
};

export const convertCurrencyToNumbers = (currencyConfig: any): PricingConfig => {
  const result: any = {};
  Object.keys(currencyConfig).forEach(section => {
    result[section] = {};
    Object.keys(currencyConfig[section]).forEach(field => {
      const currencyValue = currencyConfig[section][field];
      // Remove R$, pontos e substitui vírgula por ponto para parseFloat
      const cleanValue = currencyValue.replace(/[R$\s.]/g, '').replace(',', '.');
      const numericValue = parseFloat(cleanValue) || 0;
      result[section][field] = numericValue;
    });
  });
  return result as PricingConfig;
};
