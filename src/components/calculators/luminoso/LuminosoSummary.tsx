
import React from 'react';
import { LuminosoConfig, formatCurrency, calculateMinimumCharge } from '../../../types/pricing';
import { luminosoMaterials } from '../../../utils/luminosoMaterials';

interface Props {
  larguraLona: number;
  alturaLona: number;
  quantidadeLona: number;
  quantities: Record<string, number>;
  config: LuminosoConfig;
  total: number;
}

const LuminosoSummary: React.FC<Props> = ({
  larguraLona,
  alturaLona,
  quantidadeLona,
  quantities,
  config,
  total,
}) => {
  const areaLona = larguraLona * alturaLona;
  const areaLonaTotal = areaLona * quantidadeLona;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Orçamento</h3>
      
      <div className="space-y-3">
        {areaLona > 0 && quantidadeLona > 0 && (
          <>
            <div className="flex justify-between text-sm">
              <span>Dimensões da Lona Backlight:</span>
              <span>{larguraLona.toFixed(2)} x {alturaLona.toFixed(2)} m</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Quantidade de Lonas Backlight:</span>
              <span>{quantidadeLona} unidade(s)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Área unitária backlight:</span>
              <span>{areaLona.toFixed(2)} m²</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Área total backlight:</span>
              <span>{areaLonaTotal.toFixed(2)} m²</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Custo da Lona Backlight:</span>
              <span>{formatCurrency(calculateMinimumCharge(areaLona * config.lona) * quantidadeLona)}</span>
            </div>
          </>
        )}
        
        {luminosoMaterials.map((material) => {
          const quantity = quantities[material.id];
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
        
        {total > 0 && (
          <>
            <hr className="my-3" />
            <div className="flex justify-between text-lg font-bold text-blue-600">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </>
        )}
      </div>

      {total === 0 && (
        <p className="text-gray-500 text-center py-8">
          Preencha as dimensões da lona backlight ou as quantidades dos materiais para ver o orçamento
        </p>
      )}
    </div>
  );
};

export default LuminosoSummary;
