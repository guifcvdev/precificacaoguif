
import React, { useState, useEffect } from 'react';
import { VidroConfig, formatCurrency, calculateMinimumCharge } from '../../types/pricing';

interface Props {
  config: VidroConfig;
}

const VidroCalculator: React.FC<Props> = ({ config }) => {
  const [largura, setLargura] = useState<number>(0);
  const [altura, setAltura] = useState<number>(0);
  const [espessura, setEspessura] = useState<string>('');
  const [prolongadores, setProlongadores] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const area = largura * altura;

  const espessuraOptions = [
    { id: '6mm', label: '6mm', price: config.espessura6mm },
    { id: '8mm', label: '8mm', price: config.espessura8mm },
  ];

  useEffect(() => {
    if (area > 0 && espessura) {
      const espessuraOption = espessuraOptions.find(opt => opt.id === espessura);
      const areaTotal = calculateMinimumCharge(area * (espessuraOption?.price || 0));
      const prolongadoresTotal = prolongadores * config.prolongadores;
      
      setTotal(areaTotal + prolongadoresTotal);
    } else {
      setTotal(0);
    }
  }, [largura, altura, espessura, prolongadores, config]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculadora de Vidro Temperado</h2>
        <p className="text-gray-600">Configure a espessura do vidro e quantidade de prolongadores necessários.</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prolongadores (quantidade)
            </label>
            <input
              type="number"
              min="0"
              value={prolongadores || ''}
              onChange={(e) => setProlongadores(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Preço: {formatCurrency(config.prolongadores)}/unidade
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Orçamento</h3>
          
          {area > 0 && espessura && (
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
                <span>Espessura:</span>
                <span>{espessura}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Vidro:</span>
                <span>{formatCurrency(calculateMinimumCharge(area * (espessuraOptions.find(opt => opt.id === espessura)?.price || 0)))}</span>
              </div>
              {prolongadores > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Prolongadores ({prolongadores}x):</span>
                  <span>{formatCurrency(prolongadores * config.prolongadores)}</span>
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
              Preencha as dimensões e selecione a espessura para ver o orçamento
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VidroCalculator;
