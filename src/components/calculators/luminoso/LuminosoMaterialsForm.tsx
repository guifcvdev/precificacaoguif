
import React from 'react';
import { LuminosoConfig, formatCurrency } from '../../../types/pricing';

interface MaterialItem {
  id: string;
  label: string;
  price: number;
  unit: string;
}

interface Props {
  config: LuminosoConfig;
  quantities: Record<string, number>;
  onQuantityChange: (itemId: string, value: number) => void;
}

const LuminosoMaterialsForm: React.FC<Props> = ({
  config,
  quantities,
  onQuantityChange,
}) => {
  const items: MaterialItem[] = [
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
                value={quantities[item.id] || ''}
                onChange={(e) => onQuantityChange(item.id, parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                placeholder="0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LuminosoMaterialsForm;
