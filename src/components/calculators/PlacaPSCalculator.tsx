
import React, { useState, useEffect } from 'react';
import { PlacaPSConfig, formatCurrency, calculateMinimumCharge } from '../../types/pricing';

interface Props {
  config: PlacaPSConfig;
}

const PlacaPSCalculator: React.FC<Props> = ({ config }) => {
  const [largura, setLargura] = useState<number>(0);
  const [altura, setAltura] = useState<number>(0);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [total, setTotal] = useState<number>(0);

  const area = largura * altura;
  const areaTotal = area * quantidade;

  const options = [
    { id: 'transparente1mm', label: 'Transparente 1mm', price: config.transparente1mm },
    { id: 'leitoso1mm', label: 'Leitoso 1mm', price: config.leitoso1mm },
    { id: 'brancoPreto1mm', label: 'Branco/Preto 1mm', price: config.brancoPreto1mm },
    { id: 'transparente1mmAdesivada', label: 'Transparente 1mm Adesivada', price: config.transparente1mmAdesivada },
    { id: 'leitoso1mmAdesivada', label: 'Leitoso 1mm Adesivada', price: config.leitoso1mmAdesivada },
    { id: 'brancoPreto1mmAdesivada', label: 'Branco/Preto 1mm Adesivada', price: config.brancoPreto1mmAdesivada },
    { id: 'transparente2mm', label: 'Transparente 2mm', price: config.transparente2mm },
    { id: 'leitoso2mm', label: 'Leitoso 2mm', price: config.leitoso2mm },
    { id: 'brancoPreto2mm', label: 'Branco/Preto 2mm', price: config.brancoPreto2mm },
    { id: 'transparente2mmAdesivada', label: 'Transparente 2mm Adesivada', price: config.transparente2mmAdesivada },
    { id: 'leitoso2mmAdesivada', label: 'Leitoso 2mm Adesivada', price: config.leitoso2mmAdesivada },
    { id: 'brancoPreto2mmAdesivada', label: 'Branco/Preto 2mm Adesivada', price: config.brancoPreto2mmAdesivada },
  ];

  useEffect(() => {
    if (area > 0 && selectedOption && quantidade > 0) {
      const option = options.find(opt => opt.id === selectedOption);
      if (option) {
        const unitTotal = calculateMinimumCharge(area * option.price);
        setTotal(unitTotal * quantidade);
      }
    } else {
      setTotal(0);
    }
  }, [largura, altura, quantidade, selectedOption, config]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculadora de Placa em PS</h2>
        <p className="text-gray-600">Selecione o tipo de placa e informe as dimensões.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Dimensões
            </label>
            <div className="grid grid-cols-3 gap-4">
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
              <div>
                <label className="block text-xs text-gray-500 mb-1">Quantidade</label>
                <input
                  type="number"
                  min="1"
                  value={quantidade || ''}
                  onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1"
                />
              </div>
            </div>
            {area > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Área unitária: {area.toFixed(2)} m² | Área total: {areaTotal.toFixed(2)} m²
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Tipo de Placa em PS
            </label>
            <div className="space-y-2">
              {options.map((option) => (
                <div key={option.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={option.id}
                      name="placaPSType"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={(e) => setSelectedOption(e.target.value)}
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
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Orçamento</h3>
          
          {area > 0 && selectedOption && quantidade > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Dimensões:</span>
                <span>{largura.toFixed(2)} x {altura.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Quantidade:</span>
                <span>{quantidade} unidade(s)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Área unitária:</span>
                <span>{area.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Área total:</span>
                <span>{areaTotal.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tipo:</span>
                <span>{options.find(opt => opt.id === selectedOption)?.label}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold text-blue-600">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          {(area <= 0 || !selectedOption || quantidade <= 0) && (
            <p className="text-gray-500 text-center py-8">
              Preencha as dimensões, quantidade e selecione o tipo de placa para ver o orçamento
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacaPSCalculator;
