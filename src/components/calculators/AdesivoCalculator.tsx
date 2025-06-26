
import React, { useState, useEffect } from 'react';
import { AdesivoConfig, formatCurrency, calculateMinimumCharge, PricingConfig } from '../../types/pricing';
import BudgetSummaryExtended from '../BudgetSummaryExtended';

interface Props {
  config: AdesivoConfig;
  fullConfig: PricingConfig;
}

const AdesivoCalculator: React.FC<Props> = ({ config, fullConfig }) => {
  const [largura, setLargura] = useState<number>(0);
  const [altura, setAltura] = useState<number>(0);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);

  const area = largura * altura;
  const areaTotal = area * quantidade;

  // Reorganizado: "Só Refile" agora é a primeira opção
  const options = [
    {
      id: 'soRefile',
      label: 'Só Refile',
      price: config.soRefile
    },
    {
      id: 'corteEspecial',
      label: 'Corte Especial',
      price: config.corteEspecial
    },
    {
      id: 'laminado',
      label: 'Laminado',
      price: config.laminado
    },
    {
      id: 'adesivoPerfurado',
      label: 'Adesivo Perfurado',
      price: config.adesivoPerfurado
    },
    {
      id: 'imantado',
      label: 'Imantado',
      price: config.imantado
    },
    {
      id: 'jateado',
      label: 'Jateado',
      price: config.jateado
    },
    {
      id: 'recorte1Cor',
      label: 'Recorte 1 Cor',
      price: config.recorte1Cor
    },
    {
      id: 'recorte2Cores',
      label: 'Recorte 2 Cores',
      price: config.recorte2Cores
    },
    {
      id: 'transparente',
      label: 'Transparente',
      price: config.transparente
    },
    {
      id: 'translucido',
      label: 'Translúcido',
      price: config.translucido
    }
  ];

  useEffect(() => {
    if (area > 0 && selectedOptions.length > 0 && quantidade > 0) {
      const selectedPrices = selectedOptions.map(optionId => 
        options.find(opt => opt.id === optionId)?.price || 0
      );
      const pricePerM2 = Math.max(...selectedPrices);
      const unitTotal = calculateMinimumCharge(area * pricePerM2);
      setTotal(unitTotal * quantidade);
    } else {
      setTotal(0);
    }
  }, [largura, altura, quantidade, selectedOptions, config]);

  const handleOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, optionId]);
    } else {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId));
    }
  };

  const hasValidData = area > 0 && selectedOptions.length > 0 && quantidade > 0;

  const productDetails = (
    <>
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
        <span>Opções selecionadas:</span>
        <span>{selectedOptions.length}</span>
      </div>
    </>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculadora de Adesivos</h2>
        <p className="text-gray-600">Selecione as opções desejadas e informe as dimensões.</p>
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
              Opções de Adesivo
            </label>
            <div className="space-y-3">
              {options.map(option => (
                <div key={option.id} className="flex items-center justify-between p-3 border border-gray-200 hover:bg-gray-50 rounded-md">
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

        <BudgetSummaryExtended
          baseTotal={total}
          config={fullConfig}
          productDetails={productDetails}
          hasValidData={hasValidData}
          emptyMessage="Preencha as dimensões, quantidade e selecione pelo menos uma opção para ver o orçamento"
        />
      </div>
    </div>
  );
};

export default AdesivoCalculator;
