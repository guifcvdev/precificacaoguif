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

/**
 * VidroConfig: Preço de cada espessura por m² (como Placa PS), prolongadores por unidade.
 */
export interface VidroConfig {
  espessura6mm: number;  // preço unitário por m²
  espessura8mm: number;  // preço unitário por m² (ATUALIZADO de 9mm para 8mm)
  prolongadores: number; // preço por unidade
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
    espessura6mm: 60.0,
    espessura8mm: 80.0, // ATUALIZADO de 9mm para 8mm
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
