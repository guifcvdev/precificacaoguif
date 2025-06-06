
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
  metalon20x20: number;
  metalon30x20: number;
  acm122: number;
  acm150: number;
  cantoneira: number;
}

export interface LetraCaixaConfig {
  base: number;
  espessura10mm: number;
  espessura15mm: number;
  espessura20mm: number;
  pinturaAutomotiva: number;
  fitaDuplaFace: number;
}

export interface VidroConfig {
  base: number;
  espessura6mm: number;
  espessura8mm: number;
  prolongadores: number;
}

export interface PricingConfig {
  adesivo: AdesivoConfig;
  lona: LonaConfig;
  placaPS: PlacaPSConfig;
  placaACM: PlacaACMConfig;
  fachada: FachadaConfig;
  letraCaixa: LetraCaixaConfig;
  vidro: VidroConfig;
}

export const defaultConfig: PricingConfig = {
  adesivo: {
    corteEspecial: 25.00,
    soRefile: 15.00,
    laminado: 35.00,
    adesivoPerfurado: 30.00,
    imantado: 40.00,
  },
  lona: {
    bannerFaixa: 20.00,
    reforcoIlhos: 25.00,
    lonaBacklight: 30.00,
    soRefile: 15.00,
  },
  placaPS: {
    espessura1mm: 30.00,
    espessura2mm: 35.00,
  },
  placaACM: {
    preco: 45.00,
  },
  fachada: {
    lona: 20.00,
    metalon20x20: 15.00,
    metalon30x20: 18.00,
    acm122: 120.00,
    acm150: 150.00,
    cantoneira: 8.00,
  },
  letraCaixa: {
    base: 40.00,
    espessura10mm: 10.00,
    espessura15mm: 20.00,
    espessura20mm: 30.00,
    pinturaAutomotiva: 15.00,
    fitaDuplaFace: 5.00,
  },
  vidro: {
    base: 50.00,
    espessura6mm: 10.00,
    espessura8mm: 20.00,
    prolongadores: 25.00,
  },
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const calculateMinimumCharge = (value: number): number => {
  return Math.max(value, 20.00);
};
