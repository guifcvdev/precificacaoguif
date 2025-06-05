
import React, { useState, useEffect } from 'react';
import { AdesivoConfig, formatCurrency, calculateMinimumCharge } from '../../types/pricing';

interface Props {
  config: AdesivoConfig;
}

const AdesivoCalculator: React.FC<Props> = ({ config }) => {
  const [area, setArea] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);

  const options = [
    { id: 'corteEspecial', label: 'Corte Especial', price: config.corteEspecial },
    { id: 'soRefile', label: 'Só Refile', price: config.soRefile },
    { id: 'laminado', label: 'Laminado', price: config.laminado },
    { id: 'adesivoPerfurado', label: 'Adesivo Perfurado', price: config.adesivoPerfurado },
    { id: 'imantado', label: 'Imantado', price: config.imantado },
  ];

  useEffect(() => {
    if (area > 0 && selectedOptions.length > 0) {
      const selectedPrices = selectedOptions.map(optionId => 
        options.find(opt => opt.id === optionId)?.price || 0
      );
      const pricePerM2 = Math.max(...selectedPrices);
      const calculatedTotal = calculateMinimumCharge(area * pricePerM2);
      setTotal(calculatedTotal);
    } else {
      setTotal(0);
    }
  }, [area, selectedOptions, config]);

  const handleOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, optionId]);
    } else {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculadora de Adesivo</h2>
        <p className="text-gray-600">Selecione as opções desejadas e informe a área em metros quadrados.</p>
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
              Opções de Adesivo
            </label>
            <div className="space-y-3">
              {options.map((option) => (
                <div key={option.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={option.id}
                      checked={selectedOptions.includes(option.id)}
                      onChange={(e) => handleOptionChange(option.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Orçamento</h3>
          
          {area > 0 && selectedOptions.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Área:</span>
                <span>{area.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Opções selecionadas:</span>
                <span>{selectedOptions.length}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold text-blue-600">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              {total === 20.00 && area * Math.max(...selectedOptions.map(optionId => 
                options.find(opt => opt.id === optionId)?.price || 0
              )) < 20.00 && (
                <p className="text-xs text-orange-600 mt-2">
                  * Valor mínimo de R$ 20,00 aplicado
                </p>
              )}
            </div>
          )}

          {(area <= 0 || selectedOptions.length === 0) && (
            <p className="text-gray-500 text-center py-8">
              Preencha a área e selecione pelo menos uma opção para ver o orçamento
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdesivoCalculator;
