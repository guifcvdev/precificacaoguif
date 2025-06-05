
import React, { useState, useEffect } from 'react';
import { LetraCaixaConfig, formatCurrency, calculateMinimumCharge } from '../../types/pricing';

interface Props {
  config: LetraCaixaConfig;
}

const LetraCaixaCalculator: React.FC<Props> = ({ config }) => {
  const [area, setArea] = useState<number>(0);
  const [espessura, setEspessura] = useState<string>('');
  const [addOns, setAddOns] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);

  const espessuraOptions = [
    { id: '10mm', label: '10mm', price: config.espessura10mm },
    { id: '15mm', label: '15mm', price: config.espessura15mm },
    { id: '20mm', label: '20mm', price: config.espessura20mm },
  ];

  const addOnOptions = [
    { id: 'pinturaAutomotiva', label: 'Pintura Automotiva', price: config.pinturaAutomotiva },
    { id: 'fitaDuplaFace', label: 'Fita Dupla-Face', price: config.fitaDuplaFace },
  ];

  useEffect(() => {
    if (area > 0 && espessura) {
      const espessuraOption = espessuraOptions.find(opt => opt.id === espessura);
      let pricePerM2 = espessuraOption?.price || 0;
      
      // Add add-ons
      addOns.forEach(addOnId => {
        const addOn = addOnOptions.find(opt => opt.id === addOnId);
        if (addOn) {
          pricePerM2 += addOn.price;
        }
      });
      
      const calculatedTotal = calculateMinimumCharge(area * pricePerM2);
      setTotal(calculatedTotal);
    } else {
      setTotal(0);
    }
  }, [area, espessura, addOns, config]);

  const handleAddOnChange = (addOnId: string, checked: boolean) => {
    if (checked) {
      setAddOns([...addOns, addOnId]);
    } else {
      setAddOns(addOns.filter(id => id !== addOnId));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculadora de Letra Caixa em PVC</h2>
        <p className="text-gray-600">Configure a espessura e opcionais para calcular o preço por metro quadrado.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área (m²)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={area || ''}
              onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Espessura
            </label>
            <div className="space-y-2">
              {espessuraOptions.map((option) => (
                <div key={option.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={option.id}
                      name="espessura"
                      value={option.id}
                      checked={espessura === option.id}
                      onChange={(e) => setEspessura(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor={option.id} className="ml-3 text-sm font-medium text-gray-700">
                      {option.label}
                    </label>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatCurrency(option.price)}/m²
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Opcionais
            </label>
            <div className="space-y-3">
              {addOnOptions.map((option) => (
                <div key={option.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={option.id}
                      checked={addOns.includes(option.id)}
                      onChange={(e) => handleAddOnChange(option.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={option.id} className="ml-3 text-sm font-medium text-gray-700">
                      {option.label}
                    </label>
                  </div>
                  <span className="text-sm text-gray-500">
                    +{formatCurrency(option.price)}/m²
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Orçamento</h3>
          
          {area > 0 && espessura && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Área:</span>
                <span>{area.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Espessura:</span>
                <span>{espessura}</span>
              </div>
              {addOns.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Opcionais:</span>
                  <span>{addOns.length} item(s)</span>
                </div>
              )}
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold text-blue-600">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          {(area <= 0 || !espessura) && (
            <p className="text-gray-500 text-center py-8">
              Preencha a área e selecione a espessura para ver o orçamento
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LetraCaixaCalculator;
