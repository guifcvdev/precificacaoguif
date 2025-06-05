
import React, { useState, useEffect } from 'react';
import { FachadaConfig, formatCurrency, calculateMinimumCharge } from '../../types/pricing';

interface Props {
  config: FachadaConfig;
}

const FachadaCalculator: React.FC<Props> = ({ config }) => {
  const [areaLona, setAreaLona] = useState<number>(0);
  const [quantities, setQuantities] = useState({
    metalon20x20: 0,
    metalon30x20: 0,
    acm122: 0,
    acm150: 0,
    cantoneira: 0,
  });
  const [total, setTotal] = useState<number>(0);

  const items = [
    { id: 'metalon20x20', label: 'Metalon 20x20', price: config.metalon20x20, unit: 'unid' },
    { id: 'metalon30x20', label: 'Metalon 30x20', price: config.metalon30x20, unit: 'unid' },
    { id: 'acm122', label: 'ACM 1.22m', price: config.acm122, unit: 'unid' },
    { id: 'acm150', label: 'ACM 1.50m', price: config.acm150, unit: 'unid' },
    { id: 'cantoneira', label: 'Cantoneira 3/4', price: config.cantoneira, unit: 'unid' },
  ];

  useEffect(() => {
    let totalValue = 0;
    
    // Calculate lona cost
    if (areaLona > 0) {
      totalValue += calculateMinimumCharge(areaLona * config.lona);
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
  }, [areaLona, quantities, config]);

  const handleQuantityChange = (itemId: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculadora de Fachada Simples</h2>
        <p className="text-gray-600">Configure a área da lona e as quantidades dos materiais necessários.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área da Lona (m²)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={areaLona || ''}
              onChange={(e) => setAreaLona(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Preço: {formatCurrency(config.lona)}/m²
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Materiais Adicionais
            </label>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {item.label}
                    </label>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.price)}/{item.unit}
                    </p>
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      min="0"
                      value={quantities[item.id as keyof typeof quantities] || ''}
                      onChange={(e) => handleQuantityChange(item.id, parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Orçamento</h3>
          
          <div className="space-y-3">
            {areaLona > 0 && (
              <div className="flex justify-between text-sm">
                <span>Lona ({areaLona.toFixed(2)} m²):</span>
                <span>{formatCurrency(calculateMinimumCharge(areaLona * config.lona))}</span>
              </div>
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
              Preencha a área da lona ou as quantidades dos materiais para ver o orçamento
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FachadaCalculator;
