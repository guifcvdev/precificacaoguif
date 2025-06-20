
import React, { useState, useEffect } from 'react';
import { LuminosoConfig, calculateMinimumCharge } from '../../types/pricing';
import LuminosoDimensionsForm from './luminoso/LuminosoDimensionsForm';
import LuminosoMaterialsForm from './luminoso/LuminosoMaterialsForm';
import LuminosoSummary from './luminoso/LuminosoSummary';

interface Props {
  config: LuminosoConfig;
}

const LuminosoCalculator: React.FC<Props> = ({ config }) => {
  const [larguraLona, setLarguraLona] = useState<number>(0);
  const [alturaLona, setAlturaLona] = useState<number>(0);
  const [quantidadeLona, setQuantidadeLona] = useState<number>(1);
  const [quantities, setQuantities] = useState({
    metalon20x20: 0,
    acm122: 0,
    acm150: 0,
    lampadaTubular122: 0,
    lampadaTubular60: 0,
    moduloLed17w: 0,
    moduloLed15w: 0,
    fonteChaveada5a: 0,
    fonteChaveada10a: 0,
    fonteChaveada15a: 0,
    fonteChaveada20a: 0,
    fonteChaveada30a: 0,
    luminosoRedondoOval: 0,
  });
  const [total, setTotal] = useState<number>(0);

  const areaLona = larguraLona * alturaLona;

  const items = [
    { id: 'metalon20x20', label: 'Metalon 20x20', price: config.metalon20x20, unit: 'unid' },
    { id: 'acm122', label: 'ACM 1.22m', price: config.acm122, unit: 'unid' },
    { id: 'acm150', label: 'ACM 1.50m', price: config.acm150, unit: 'unid' },
    { id: 'lampadaTubular122', label: 'Lâmpada Tubular 1,22m', price: config.lampadaTubular122, unit: 'unid' },
    { id: 'lampadaTubular60', label: 'Lâmpada Tubular 60cm', price: config.lampadaTubular60, unit: 'unid' },
    { id: 'moduloLed17w', label: 'Módulo LED 1,7w Lente 160º', price: config.moduloLed17w, unit: 'unid' },
    { id: 'moduloLed15w', label: 'Módulo LED 1,5w Mega Lente', price: config.moduloLed15w, unit: 'unid' },
    { id: 'fonteChaveada5a', label: 'Fonte Chaveada 5a', price: config.fonteChaveada5a, unit: 'unid' },
    { id: 'fonteChaveada10a', label: 'Fonte Chaveada 10a', price: config.fonteChaveada10a, unit: 'unid' },
    { id: 'fonteChaveada15a', label: 'Fonte Chaveada 15a', price: config.fonteChaveada15a, unit: 'unid' },
    { id: 'fonteChaveada20a', label: 'Fonte Chaveada 20a', price: config.fonteChaveada20a, unit: 'unid' },
    { id: 'fonteChaveada30a', label: 'Fonte Chaveada 30a', price: config.fonteChaveada30a, unit: 'unid' },
    { id: 'luminosoRedondoOval', label: 'Luminoso Redondo ou Oval', price: config.luminosoRedondoOval, unit: 'unid' },
  ];

  useEffect(() => {
    let totalValue = 0;
    
    // Calculate lona cost
    if (areaLona > 0 && quantidadeLona > 0) {
      const unitLonaTotal = calculateMinimumCharge(areaLona * config.lona);
      totalValue += unitLonaTotal * quantidadeLona;
    }
    
    // Calculate unit items cost
    Object.entries(quantities).forEach(([key, quantity]) => {
      if (quantity > 0) {
        const item = items.find(item => item.id === key);
        if (item) {
          totalValue += quantity * item.price;
        }
      }
    });
    
    setTotal(totalValue);
  }, [larguraLona, alturaLona, quantidadeLona, quantities, config]);

  const handleQuantityChange = (itemId: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculadora de Luminoso</h2>
        <p className="text-gray-600">Configure as dimensões da lona backlight e as quantidades dos materiais necessários.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <LuminosoDimensionsForm
            larguraLona={larguraLona}
            alturaLona={alturaLona}
            quantidadeLona={quantidadeLona}
            config={config}
            onLarguraChange={setLarguraLona}
            onAlturaChange={setAlturaLona}
            onQuantidadeChange={setQuantidadeLona}
          />

          <LuminosoMaterialsForm
            config={config}
            quantities={quantities}
            onQuantityChange={handleQuantityChange}
          />
        </div>

        <LuminosoSummary
          larguraLona={larguraLona}
          alturaLona={alturaLona}
          quantidadeLona={quantidadeLona}
          quantities={quantities}
          config={config}
          total={total}
        />
      </div>
    </div>
  );
};

export default LuminosoCalculator;
