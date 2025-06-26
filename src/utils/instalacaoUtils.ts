import { PricingConfig } from '../types/pricing';

export interface InstalacaoOption {
  value: string;
  label: string;
  price: number;
}

export const getInstalacaoOptions = (config: PricingConfig): InstalacaoOption[] => {
  if (!config?.instalacao) {
    console.error('Config de instalação não encontrado:', config);
    return [];
  }

  const options = [
    { value: 'jacarei', label: 'Jacareí', price: config.instalacao.jacarei || 0 },
    { value: 'sjCampos', label: 'S.J.Campos', price: config.instalacao.sjCampos || 0 },
    { value: 'cacapavaTaubate', label: 'Caçapava/Taubaté', price: config.instalacao.cacapavaTaubate || 0 },
    { value: 'litoral', label: 'Litoral', price: config.instalacao.litoral || 0 },
    { value: 'guararemaSantaIsabel', label: 'Guararema/Sta Isabel', price: config.instalacao.guararemaSantaIsabel || 0 },
    { value: 'santaBranca', label: 'Sta Branca', price: config.instalacao.santaBranca || 0 },
    { value: 'saoPaulo', label: 'São Paulo', price: config.instalacao.saoPaulo || 0 },
  ];

  // Validação - todos os preços devem ser números válidos
  const hasInvalidPrices = options.some(option => isNaN(option.price) || option.price < 0);
  if (hasInvalidPrices) {
    console.warn('Algumas opções de instalação têm preços inválidos:', options);
  }

  return options;
}; 