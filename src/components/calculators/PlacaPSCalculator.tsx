import React, { useState, useEffect } from 'react';
import { PlacaPSConfig, formatCurrency, calculateMinimumCharge } from '../../types/pricing';

interface Props {
  config: PlacaPSConfig;
}

const PlacaPSCalculator: React.FC<Props> = ({ config }) => {
  const [largura, setLargura] = useState<number>(0);
  const [altura, setAltura] = useState<number>(0);
  const [espessura, setEspessura] = useState<string>('');
  const [tipo, setTipo] = useState<string>('');
  const [acabamento, setAcabamento] = useState<string>('');
  const [total, setTotal] = useState<number>(0);

  const area = largura * altura;

  useEffect(() => {
    if (area > 0 && espessura && tipo && acabamento) {
      let pricePerM2 = 0;
      
      // Base price according to thickness
      if (espessura === '1mm') {
        pricePerM2 = config.espessura1mm;
      } else if (espessura === '2mm') {
        pricePerM2 = config.espessura2mm;
      }
      
      // Add type price
      if (tipo === 'leitoso') {
        pricePerM2 += config.leitoso;
      }
      
      // Add finishing price
      if (acabamento === 'placaAdesivada') {
        pricePerM2 += config.placaAdesivada;
      }
      
      const calculatedTotal = calculateMinimumCharge(area * pricePerM2);
      setTotal(calculatedTotal);
    } else {
      setTotal(0);
    }
  }, [largura, altura, espessura, tipo, acabamento, config]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculadora de Placa em PS</h2>
        <p className="text-gray-600">Configure as especificações da placa e informe as dimensões.</p>
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
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="1mm"
                    name="espessura"
                    value="1mm"
                    checked={espessura === '1mm'}
                    onChange={(e) => setEspessura(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="1mm" className="ml-3 text-sm font-medium text-gray-700">
                    1mm
                  </label>
                </div>
                <span className="text-sm text-gray-500">
                  {formatCurrency(config.espessura1mm)}/m²
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="2mm"
                    name="espessura"
                    value="2mm"
                    checked={espessura === '2mm'}
                    onChange={(e) => setEspessura(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="2mm" className="ml-3 text-sm font-medium text-gray-700">
                    2mm
                  </label>
                </div>
                <span className="text-sm text-gray-500">
                  {formatCurrency(config.espessura2mm)}/m²
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Tipo
            </label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="transparente"
                    name="tipo"
                    value="transparente"
                    checked={tipo === 'transparente'}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="transparente" className="ml-3 text-sm font-medium text-gray-700">
                    Transparente
                  </label>
                </div>
                <span className="text-sm text-gray-500">
                  +{formatCurrency(config.transparente)}/m²
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="leitoso"
                    name="tipo"
                    value="leitoso"
                    checked={tipo === 'leitoso'}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="leitoso" className="ml-3 text-sm font-medium text-gray-700">
                    Leitoso
                  </label>
                </div>
                <span className="text-sm text-gray-500">
                  +{formatCurrency(config.leitoso)}/m²
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Acabamento
            </label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="somentePlaca"
                    name="acabamento"
                    value="somentePlaca"
                    checked={acabamento === 'somentePlaca'}
                    onChange={(e) => setAcabamento(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="somentePlaca" className="ml-3 text-sm font-medium text-gray-700">
                    Somente Placa
                  </label>
                </div>
                <span className="text-sm text-gray-500">
                  +{formatCurrency(config.somentePlaca)}/m²
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="placaAdesivada"
                    name="acabamento"
                    value="placaAdesivada"
                    checked={acabamento === 'placaAdesivada'}
                    onChange={(e) => setAcabamento(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="placaAdesivada" className="ml-3 text-sm font-medium text-gray-700">
                    Placa Adesivada
                  </label>
                </div>
                <span className="text-sm text-gray-500">
                  +{formatCurrency(config.placaAdesivada)}/m²
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Orçamento</h3>
          
          {area > 0 && espessura && tipo && acabamento && (
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
                <span>Tipo:</span>
                <span>{tipo === 'transparente' ? 'Transparente' : 'Leitoso'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Acabamento:</span>
                <span>{acabamento === 'somentePlaca' ? 'Somente Placa' : 'Placa Adesivada'}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold text-blue-600">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          {(area <= 0 || !espessura || !tipo || !acabamento) && (
            <p className="text-gray-500 text-center py-8">
              Preencha todos os campos para ver o orçamento
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacaPSCalculator;
