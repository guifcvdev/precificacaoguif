
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LuminosoConfig, calculateMinimumCharge, PricingConfig, formatCurrency } from '../../types/pricing';
import LuminosoDimensionsForm from './luminoso/LuminosoDimensionsForm';
import LuminosoMaterialsForm from './luminoso/LuminosoMaterialsForm';
import BudgetSummaryExtended from '../BudgetSummaryExtended';
import { getInitialQuantities, luminosoMaterials } from '../../utils/luminosoMaterials';

interface Props {
  config: LuminosoConfig;
  fullConfig: PricingConfig;
}

const LuminosoCalculator: React.FC<Props> = ({ config, fullConfig }) => {
  const [larguraLona, setLarguraLona] = useState<number>(0);
  const [alturaLona, setAlturaLona] = useState<number>(0);
  const [quantidadeLona, setQuantidadeLona] = useState<number>(1);
  const [quantities, setQuantities] = useState(getInitialQuantities());
  const [total, setTotal] = useState<number>(0);

  const areaLona = useMemo(() => larguraLona * alturaLona, [larguraLona, alturaLona]);

  const handleQuantityChange = useCallback((itemId: string, value: number) => {
    const validValue = Math.max(0, value || 0);
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

  const hasValidData = total > 0;

  const productDetails = (
    <>
      {areaLona > 0 && quantidadeLona > 0 && (
        <>
          <div className="flex justify-between text-sm">
            <span>Dimensões da Lona:</span>
            <span>{larguraLona.toFixed(2)} x {alturaLona.toFixed(2)} m</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Quantidade de Lonas:</span>
            <span>{quantidadeLona} unidade(s)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Área unitária:</span>
            <span>{areaLona.toFixed(2)} m²</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Área total:</span>
            <span>{(areaLona * quantidadeLona).toFixed(2)} m²</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Custo da Lona:</span>
            <span>{formatCurrency(calculateMinimumCharge(areaLona * config.lona) * quantidadeLona)}</span>
          </div>
        </>
      )}
      
      {luminosoMaterials.map(material => {
        const quantity = quantities[material.id] || 0;
        if (quantity > 0) {
          return (
            <div key={material.id} className="flex justify-between text-sm">
              <span>{material.label} ({quantity}x):</span>
              <span>{formatCurrency(quantity * config[material.id])}</span>
            </div>
          );
        }
        return null;
      })}
    </>
  );

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

        <BudgetSummaryExtended
          baseTotal={total}
          config={fullConfig}
          productDetails={productDetails}
          hasValidData={hasValidData}
          emptyMessage="Configure as dimensões da lona ou as quantidades dos materiais para ver o orçamento"
        />
      </div>
    </div>
  );
};

export default LuminosoCalculator;
