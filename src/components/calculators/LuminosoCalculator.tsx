
import React, { useState, useEffect } from 'react';
import { LuminosoConfig, formatCurrency, calculateMinimumCharge } from '../../types/pricing';

interface Props {
  config: LuminosoConfig;
}

const LuminosoCalculator: React.FC<Props> = ({ config }) => {
  const [larguraLona, setLarguraLona] = useState<number>(0);
  const [alturaLona, setAlturaLona] = useState<number>(0);
  const [quantidadeLona, setQuantidadeLona] = useState<number>(1);
  const [quantities, setQuantities] = useState({
    metalon20x20: 0,
    acm122: 0,
    acm150: 0,
    lampadaTubular122: 0,
    lampadaTubular60: 0,
    moduloLed17w: 0,
    moduloLed15w: 0,
    fonteChaveada5a: 0,
    fonteChaveada10a: 0,
    fonteChaveada15a: 0,
    fonteChaveada20a: 0,
    fonteChaveada30a: 0,
    luminosoRedondoOval: 0,
  });
  const [total, setTotal] = useState<number>(0);

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

  useEffect(() => {
    let totalValue = 0;
    
    // Calculate lona cost
    if (areaLona > 0 && quantidadeLona > 0) {
      const unitLonaTotal = calculateMinimumCharge(areaLona * config.lona);
      totalValue += unitLonaTotal * quantidadeLona;
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
  }, [larguraLona, alturaLona, quantidadeLona, quantities, config]);

  const handleQuantityChange = (itemId: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculadora de Luminoso</h2>
        <p className="text-gray-600">Configure as dimensões da lona backlight e as quantidades dos materiais necessários.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Dimensões da Lona Backlight
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Largura backlight (m)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={larguraLona || ''}
                  onChange={(e) => setLarguraLona(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Altura backlight (m)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={alturaLona || ''}
                  onChange={(e) => setAlturaLona(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Quantidade</label>
                <input
                  type="number"
                  min="1"
                  value={quantidadeLona || ''}
                  onChange={(e) => setQuantidadeLona(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1"
                />
              </div>
            </div>
            {areaLona > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Área unitária backlight: {areaLona.toFixed(2)} m² | Área total backlight: {areaLonaTotal.toFixed(2)} m² - Preço: {formatCurrency(config.lona)}/m²
              </p>
            )}
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
      </div>
    </div>
  );
};

export default LuminosoCalculator;
