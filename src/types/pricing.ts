
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

/**
 * LetraCaixaConfig: Agora o preço é por espessura (por m²), não mais preço base + adicional.
 * Opcionais permanecem.
 */
export interface LetraCaixaConfig {
  espessura10mm: number; // preço unitário por m²
  espessura15mm: number; // preço unitário por m²
  espessura20mm: number; // preço unitário por m²
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
    metalon20x20: 15.0,
    metalon30x20: 18.0,
    acm122: 120.0,
    acm150: 150.0,
    cantoneira: 8.0,
  },
  letraCaixa: {
    espessura10mm: 50.0, // 40+10
    espessura15mm: 60.0, // 40+20
    espessura20mm: 70.0, // 40+30
    pinturaAutomotiva: 15.0,
    fitaDuplaFace: 5.0,
  },
  vidro: {
    base: 50.0,
    espessura6mm: 10.0,
    espessura8mm: 20.0,
    prolongadores: 25.0,
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
