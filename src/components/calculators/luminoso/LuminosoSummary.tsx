
import React from 'react';
import { LuminosoConfig, formatCurrency, calculateMinimumCharge } from '../../../types/pricing';

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
        
        {Object.entries(quantities).map(([key, quantity]) => {
          if (quantity > 0) {
            const item = items.find(item => item.id === key);
            if (item) {
              return (
                <div key={key} className="flex justify-between text-sm">
                  <span>{item.label} ({quantity}x):</span>
                  <span>{formatCurrency(quantity * item.price)}</span>
                </div>
              );
            }
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
