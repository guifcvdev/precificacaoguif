export interface ConfigField {
  key: string;
  label: string;
  unit?: string;
}

export interface ConfigSectionData {
  title: string;
  section: string;
  fields: ConfigField[];
}

export const settingsConfig: ConfigSectionData[] = [
  {
    title: "Adesivo",
    section: "adesivo",
    fields: [
      { key: 'corteEspecial', label: 'Corte Especial', unit: 'm²' },
      { key: 'soRefile', label: 'Só Refile', unit: 'm²' },
      { key: 'laminado', label: 'Laminado', unit: 'm²' },
      { key: 'adesivoPerfurado', label: 'Adesivo Perfurado', unit: 'm²' },
      { key: 'imantado', label: 'Imantado', unit: 'm²' },
    ]
  },
  {
    title: "Lona",
    section: "lona",
    fields: [
      { key: 'bannerFaixa', label: 'Banner/Faixa', unit: 'm²' },
      { key: 'reforcoIlhos', label: 'Reforço e Ilhós', unit: 'm²' },
      { key: 'lonaBacklight', label: 'Lona Backlight', unit: 'm²' },
      { key: 'soRefile', label: 'Só Refile', unit: 'm²' },
    ]
  },
  {
    title: "Placa em PS",
    section: "placaPS",
    fields: [
      { key: 'espessura1mm', label: 'Espessura 1mm', unit: 'm²' },
      { key: 'espessura2mm', label: 'Espessura 2mm', unit: 'm²' },
    ]
  },
  {
    title: "Placa em ACM",
    section: "placaACM",
    fields: [
      { key: 'preco', label: 'Preço por m²', unit: 'm²' },
    ]
  },
  {
    title: "Fachada Simples",
    section: "fachada",
    fields: [
      { key: 'lona', label: 'Lona', unit: 'm²' },
      { key: 'metalon20x20', label: 'Metalon 20x20', unit: 'unid' },
      { key: 'metalon30x20', label: 'Metalon 30x20', unit: 'unid' },
      { key: 'acm122', label: 'ACM 1.22m', unit: 'unid' },
      { key: 'acm150', label: 'ACM 1.50m', unit: 'unid' },
      { key: 'cantoneira', label: 'Cantoneira 3/4', unit: 'unid' },
      { key: 'estruturaMetalica.precoPorBarra', label: 'Estrutura Metálica - Preço por Barra', unit: 'unid' },
      { key: 'estruturaMetalica.comprimentoBarra', label: 'Estrutura Metálica - Comprimento da Barra', unit: 'm' },
    ]
  },
  {
    title: "Letra Caixa em PVC",
    section: "letraCaixa",
    fields: [
      { key: 'espessura10mm', label: 'Espessura 10mm', unit: 'm²' },
      { key: 'espessura15mm', label: 'Espessura 15mm', unit: 'm²' },
      { key: 'espessura20mm', label: 'Espessura 20mm', unit: 'm²' },
      { key: 'pinturaAutomotiva', label: 'Pintura Automotiva (Opcional)', unit: 'm²' },
      { key: 'fitaDuplaFace', label: 'Fita Dupla-Face (Opcional)', unit: 'm²' },
    ]
  },
  {
    title: "Vidro Temperado",
    section: "vidro",
    fields: [
      { key: 'espessura6mm', label: 'Espessura 6mm', unit: 'm²' },
      { key: 'espessura8mm', label: 'Espessura 8mm', unit: 'm²' },
      { key: 'prolongadores', label: 'Prolongadores', unit: 'unid' },
    ]
  },
  {
    title: "Luminoso",
    section: "luminoso",
    fields: [
      { key: 'lona', label: 'Lona', unit: 'm²' },
      { key: 'metalon20x20', label: 'Metalon 20x20', unit: 'unid' },
      { key: 'acm122', label: 'ACM 1.22m', unit: 'unid' },
      { key: 'acm150', label: 'ACM 1.50m', unit: 'unid' },
      { key: 'lampadaTubular122', label: 'Lâmpada Tubular 1,22m', unit: 'unid' },
      { key: 'lampadaTubular60', label: 'Lâmpada Tubular 60cm', unit: 'unid' },
      { key: 'moduloLed17w', label: 'Módulo LED 1,7w Lente 160º', unit: 'unid' },
      { key: 'moduloLed15w', label: 'Módulo LED 1,5w Mega Lente', unit: 'unid' },
      { key: 'fonteChaveada5a', label: 'Fonte Chaveada 5a', unit: 'unid' },
      { key: 'fonteChaveada10a', label: 'Fonte Chaveada 10a', unit: 'unid' },
      { key: 'fonteChaveada15a', label: 'Fonte Chaveada 15a', unit: 'unid' },
      { key: 'fonteChaveada20a', label: 'Fonte Chaveada 20a', unit: 'unid' },
      { key: 'fonteChaveada30a', label: 'Fonte Chaveada 30a', unit: 'unid' },
      { key: 'luminosoRedondoOval', label: 'Luminoso Redondo ou Oval', unit: 'unid' },
    ]
  },
  {
    title: "Nota Fiscal",
    section: "notaFiscal",
    fields: [
      { key: 'percentual', label: 'Percentual da Nota Fiscal', unit: '%' },
    ]
  },
  {
    title: "Cartão de Crédito",
    section: "cartaoCredito",
    fields: [
      { key: 'taxa3x', label: 'Taxa 3x', unit: '%' },
      { key: 'taxa6x', label: 'Taxa 6x', unit: '%' },
      { key: 'taxa12x', label: 'Taxa 12x', unit: '%' },
    ]
  },
  {
    title: "Instalação por Localidade",
    section: "instalacao",
    fields: [
      { key: 'jacarei', label: 'Jacareí', unit: 'serviço' },
      { key: 'sjCampos', label: 'S.J.Campos', unit: 'serviço' },
      { key: 'cacapavaTaubate', label: 'Caçapava/Taubaté', unit: 'serviço' },
      { key: 'litoral', label: 'Litoral', unit: 'serviço' },
      { key: 'guararemaSantaIsabel', label: 'Guararema/Sta Isabel', unit: 'serviço' },
      { key: 'santaBranca', label: 'Sta Branca', unit: 'serviço' },
    ]
  }
];
