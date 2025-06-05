
import React, { useState, useEffect } from 'react';
import { Check, Calculator } from 'lucide-react';
import { AdesivoConfig, formatCurrency, calculateMinimumCharge } from '../../types/pricing';

interface Props {
  config: AdesivoConfig;
}

const AdesivoCalculator: React.FC<Props> = ({ config }) => {
  const [largura, setLargura] = useState<number>(0);
  const [altura, setAltura] = useState<number>(0);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);

  const area = largura * altura;
  const areaTotal = area * quantidade;

  const options = [
    { id: 'corteEspecial', label: 'Corte Especial', price: config.corteEspecial, color: 'from-blue-500 to-cyan-500' },
    { id: 'soRefile', label: 'Só Refile', price: config.soRefile, color: 'from-green-500 to-emerald-500' },
    { id: 'laminado', label: 'Laminado', price: config.laminado, color: 'from-purple-500 to-pink-500' },
    { id: 'adesivoPerfurado', label: 'Adesivo Perfurado', price: config.adesivoPerfurado, color: 'from-orange-500 to-red-500' },
    { id: 'imantado', label: 'Imantado', price: config.imantado, color: 'from-teal-500 to-green-500' },
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

  return (
    <div className="p-8">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Calculadora de Adesivo
          </h2>
        </div>
        <p className="text-muted-foreground text-lg">Selecione as opções desejadas e informe as dimensões para calcular o orçamento.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Dimensões */}
          <div className="modern-card p-6 animate-scale-in">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full mr-3"></div>
              Dimensões do Produto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Largura <span className="text-muted-foreground">(metros)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={largura || ''}
                  onChange={(e) => setLargura(parseFloat(e.target.value) || 0)}
                  className="modern-input"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Altura <span className="text-muted-foreground">(metros)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={altura || ''}
                  onChange={(e) => setAltura(parseFloat(e.target.value) || 0)}
                  className="modern-input"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  Quantidade <span className="text-muted-foreground">(unidades)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantidade || ''}
                  onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                  className="modern-input"
                  placeholder="1"
                />
              </div>
            </div>
            {area > 0 && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-200 font-medium">
                  📐 Área unitária: <span className="font-bold">{area.toFixed(2)} m²</span> | 
                  Área total: <span className="font-bold">{areaTotal.toFixed(2)} m²</span>
                </p>
              </div>
            )}
          </div>

          {/* Opções */}
          <div className="modern-card p-6 animate-scale-in">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
              Opções de Adesivo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((option) => (
                <div 
                  key={option.id} 
                  className={`relative p-4 border-2 rounded-xl transition-all duration-300 cursor-pointer group hover:shadow-lg ${
                    selectedOptions.includes(option.id)
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/30 bg-card'
                  }`}
                  onClick={() => handleOptionChange(option.id, !selectedOptions.includes(option.id))}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`relative w-5 h-5 rounded border-2 transition-all duration-200 ${
                        selectedOptions.includes(option.id)
                          ? 'border-primary bg-primary'
                          : 'border-border bg-background'
                      }`}>
                        {selectedOptions.includes(option.id) && (
                          <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-foreground cursor-pointer">
                          {option.label}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(option.price)}/m²
                        </p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${option.color}`}></div>
                  </div>
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumo do Orçamento */}
        <div className="modern-card p-6 h-fit sticky top-8 animate-scale-in">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Resumo do Orçamento</h3>
          </div>
          
          {area > 0 && selectedOptions.length > 0 && quantidade > 0 ? (
            <div className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dimensões:</span>
                  <span className="font-medium">{largura.toFixed(2)} × {altura.toFixed(2)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantidade:</span>
                  <span className="font-medium">{quantidade} unidade(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Área unitária:</span>
                  <span className="font-medium">{area.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Área total:</span>
                  <span className="font-medium">{areaTotal.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Opções selecionadas:</span>
                  <span className="font-medium">{selectedOptions.length}</span>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-800 dark:text-emerald-200 font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-muted/30 rounded-xl mb-4">
                <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Preencha as dimensões, quantidade e selecione pelo menos uma opção para ver o orçamento
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdesivoCalculator;
