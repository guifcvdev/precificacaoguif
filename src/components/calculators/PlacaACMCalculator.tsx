
import React, { useState, useEffect } from 'react';
import { PlacaACMConfig, formatCurrency, calculateMinimumCharge } from '../../types/pricing';

interface Props {
  config: PlacaACMConfig;
}

const PlacaACMCalculator: React.FC<Props> = ({ config }) => {
  const [largura, setLargura] = useState<number>(0);
  const [altura, setAltura] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const area = largura * altura;

  useEffect(() => {
    if (area > 0) {
      const calculatedTotal = calculateMinimumCharge(area * config.preco);
      setTotal(calculatedTotal);
    } else {
      setTotal(0);
    }
  }, [largura, altura, config]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculadora de Placa em ACM</h2>
        <p className="text-gray-600">Informe as dimensões para calcular o preço.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Dimensões
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Largura (m)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={largura || ''}
                  onChange={(e) => setLargura(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Altura (m)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={altura || ''}
                  onChange={(e) => setAltura(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
            {area > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Área calculada: {area.toFixed(2)} m²
              </p>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Preço Atual</h4>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(config.preco)}/m²
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Valor configurável nas configurações do sistema
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Orçamento</h3>
          
          {area > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Dimensões:</span>
                <span>{largura.toFixed(2)} x {altura.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Área:</span>
                <span>{area.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Preço/m²:</span>
                <span>{formatCurrency(config.preco)}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold text-blue-600">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              {total === 20.00 && area * config.preco < 20.00 && (
                <p className="text-xs text-orange-600 mt-2">
                  * Valor mínimo de R$ 20,00 aplicado
                </p>
              )}
            </div>
          )}

          {area <= 0 && (
            <p className="text-gray-500 text-center py-8">
              Informe as dimensões para ver o orçamento
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacaACMCalculator;
