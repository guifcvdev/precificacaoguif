export interface AdesivoConfig {
  corteEspecial: number;
  soRefile: number;
  laminado: number;
  adesivoPerfurado: number;
  imantado: number;
}

export interface LonaConfig {
  bannerFaixa: number;
  reforcoIlhos: number;
  lonaBacklight: number;
  soRefile: number;
}

export interface PlacaPSConfig {
  espessura1mm: number;
  espessura2mm: number;
}

export interface PlacaACMConfig {
  preco: number;
}

export interface FachadaConfig {
  lona: number;
  acm122: number;
  acm150: number;
  cantoneira: number;
  // Novos parâmetros para estrutura metálica
  estruturaMetalica: {
    precoPorBarra: number;
    comprimentoBarra: number;
  };
}

export interface LetraCaixaConfig {
  espessura10mm: number;
  espessura15mm: number;
  espessura20mm: number;
  pinturaAutomotiva: number;
  fitaDuplaFace: number;
}

export interface VidroConfig {
  espessura6mm: number;
  espessura8mm: number;
  prolongadores: number;
}

export interface LuminosoConfig {
  lona: number;
  metalon20x20: number;
  acm122: number;
  acm150: number;
  lampadaTubular122: number;
  lampadaTubular60: number;
  moduloLed17w: number;
  moduloLed15w: number;
  fonteChaveada5a: number;
  fonteChaveada10a: number;
  fonteChaveada15a: number;
  fonteChaveada20a: number;
  fonteChaveada30a: number;
  luminosoRedondoOval: number;
  // Novos parâmetros para estrutura metálica
  estruturaMetalica: {
    precoPorBarra: number;
    comprimentoBarra: number;
  };
}

// Novas configurações solicitadas
export interface NotaFiscalConfig {
  percentual: number;
}

export interface CartaoCreditoConfig {
  taxa3x: number;
  taxa6x: number;
  taxa12x: number;
}

export interface InstalacaoConfig {
  jacarei: number;
  sjCampos: number;
  cacapavaTaubate: number;
  litoral: number;
  guararemaSantaIsabel: number;
  santaBranca: number;
  saoPaulo: number;
}

export interface PricingConfig {
  adesivo: AdesivoConfig;
  lona: LonaConfig;
  placaPS: PlacaPSConfig;
  placaACM: PlacaACMConfig;
  fachada: FachadaConfig;
  letraCaixa: LetraCaixaConfig;
  vidro: VidroConfig;
  luminoso: LuminosoConfig;
  notaFiscal: NotaFiscalConfig;
  cartaoCredito: CartaoCreditoConfig;
  instalacao: InstalacaoConfig;
}

export const defaultConfig: PricingConfig = {
  adesivo: {
    corteEspecial: 25.0,
    soRefile: 15.0,
    laminado: 35.0,
    adesivoPerfurado: 30.0,
    imantado: 40.0,
  },
  lona: {
    bannerFaixa: 20.0,
    reforcoIlhos: 25.0,
    lonaBacklight: 30.0,
    soRefile: 15.0,
  },
  placaPS: {
    espessura1mm: 30.0,
    espessura2mm: 35.0,
  },
  placaACM: {
    preco: 45.0,
  },
  fachada: {
    lona: 20.0,
    acm122: 120.0,
    acm150: 150.0,
    cantoneira: 8.0,
    estruturaMetalica: {
      precoPorBarra: 34.0,
      comprimentoBarra: 6.0,
    },
  },
  letraCaixa: {
    espessura10mm: 50.0,
    espessura15mm: 60.0,
    espessura20mm: 70.0,
    pinturaAutomotiva: 15.0,
    fitaDuplaFace: 5.0,
  },
  vidro: {
    espessura6mm: 60.0,
    espessura8mm: 80.0,
    prolongadores: 25.0,
  },
  luminoso: {
    lona: 20.0,
    metalon20x20: 15.0,
    acm122: 120.0,
    acm150: 150.0,
    lampadaTubular122: 25.0,
    lampadaTubular60: 15.0,
    moduloLed17w: 8.0,
    moduloLed15w: 7.0,
    fonteChaveada5a: 45.0,
    fonteChaveada10a: 65.0,
    fonteChaveada15a: 85.0,
    fonteChaveada20a: 105.0,
    fonteChaveada30a: 145.0,
    luminosoRedondoOval: 200.0,
    estruturaMetalica: {
      precoPorBarra: 34.0,
      comprimentoBarra: 6.0,
    },
  },
  notaFiscal: {
    percentual: 15.0,
  },
  cartaoCredito: {
    taxa3x: 5.0,
    taxa6x: 8.0,
    taxa12x: 12.0,
  },
  instalacao: {
    jacarei: 100.0,
    sjCampos: 120.0,
    cacapavaTaubate: 150.0,
    litoral: 200.0,
    guararemaSantaIsabel: 180.0,
    santaBranca: 160.0,
    saoPaulo: 250.0,
  },
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const calculateMinimumCharge = (value: number): number => {
  return Math.max(value, 20.0);
};
