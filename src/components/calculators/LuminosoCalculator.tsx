
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LuminosoConfig, calculateMinimumCharge } from '../../types/pricing';
import LuminosoDimensionsForm from './luminoso/LuminosoDimensionsForm';
import LuminosoMaterialsForm from './luminoso/LuminosoMaterialsForm';
import LuminosoSummary from './luminoso/LuminosoSummary';
import { getInitialQuantities, luminosoMaterials } from '../../utils/luminosoMaterials';

interface Props {
  config: LuminosoConfig;
}

const LuminosoCalculator: React.FC<Props> = ({ config }) => {
  const [larguraLona, setLarguraLona] = useState<number>(0);
  const [alturaLona, setAlturaLona] = useState<number>(0);
  const [quantidadeLona, setQuantidadeLona] = useState<number>(1);
  const [quantities, setQuantities] = useState(getInitialQuantities());
  const [total, setTotal] = useState<number>(0);

  const areaLona = useMemo(() => larguraLona * alturaLona, [larguraLona, alturaLona]);

  const handleQuantityChange = useCallback((itemId: string, value: number) => {
    const validValue = Math.max(0, value || 0); // Validação para não aceitar valores negativos
    setQuantities(prev => ({
      ...prev,
      [itemId]: validValue
    }));
  }, []);

  useEffect(() => {
    let totalValue = 0;
    
    // Calculate lona cost
    if (areaLona > 0 && quantidadeLona > 0) {
      const unitLonaTotal = calculateMinimumCharge(areaLona * config.lona);
      totalValue += unitLonaTotal * quantidadeLona;
    }
    
    // Calculate unit items cost using centralized materials
    luminosoMaterials.forEach(material => {
      const quantity = quantities[material.id] || 0;
      if (quantity > 0) {
        totalValue += quantity * config[material.id];
      }
    });
    
    setTotal(totalValue);
  }, [areaLona, quantidadeLona, quantities, config]);

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
