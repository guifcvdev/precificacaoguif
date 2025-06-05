
import React, { useState, useEffect } from 'react';
import { Calculator, Check } from 'lucide-react';
import { LonaConfig, formatCurrency, calculateMinimumCharge } from '../../types/pricing';

interface Props {
  config: LonaConfig;
}

const LonaCalculator: React.FC<Props> = ({ config }) => {
  const [largura, setLargura] = useState<number>(0);
  const [altura, setAltura] = useState<number>(0);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [total, setTotal] = useState<number>(0);

  const area = largura * altura;
  const areaTotal = area * quantidade;

  const options = [
    { id: 'bannerFaixa', label: 'Banner/Faixa', price: config.bannerFaixa, description: 'Ideal para publicidade externa', color: 'from-blue-500 to-cyan-500' },
    { id: 'reforcoIlhos', label: 'Reforço e Ilhós', price: config.reforcoIlhos, description: 'Com reforço nas bordas e ilhós', color: 'from-green-500 to-emerald-500' },
    { id: 'lonaBacklight', label: 'Lona Backlight', price: config.lonaBacklight, description: 'Para iluminação traseira', color: 'from-yellow-500 to-orange-500' },
    { id: 'soRefile', label: 'Só Refile', price: config.soRefile, description: 'Apenas corte e acabamento', color: 'from-purple-500 to-pink-500' },
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
    <div className="p-8">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
            Calculadora de Lona
          </h2>
        </div>
        <p className="text-muted-foreground text-lg">Selecione o tipo de lona e informe as dimensões para calcular o orçamento.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Dimensões */}
          <div className="modern-card p-6 animate-scale-in">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full mr-3"></div>
              Dimensões da Lona
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
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800">
                <p className="text-green-800 dark:text-green-200 font-medium">
                  📐 Área unitária: <span className="font-bold">{area.toFixed(2)} m²</span> | 
                  Área total: <span className="font-bold">{areaTotal.toFixed(2)} m²</span>
                </p>
              </div>
            )}
          </div>

          {/* Tipos de Lona */}
          <div className="modern-card p-6 animate-scale-in">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
              Tipo de Lona
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((option) => (
                <div
                  key={option.id}
                  className={`relative p-5 border-2 rounded-xl transition-all duration-300 cursor-pointer group hover:shadow-lg ${
                    selectedOption === option.id
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/30 bg-card'
                  }`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`relative w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                        selectedOption === option.id
                          ? 'border-primary bg-primary'
                          : 'border-border bg-background'
                      }`}>
                        {selectedOption === option.id && (
                          <div className="w-2 h-2 bg-white rounded-full absolute top-0.5 left-0.5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-base">{option.label}</h4>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${option.color}`}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(option.price)}/m²
                    </span>
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
          
          {area > 0 && selectedOption && quantidade > 0 ? (
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
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="font-medium">{options.find(opt => opt.id === selectedOption)?.label}</span>
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
                  Preencha as dimensões, quantidade e selecione o tipo de lona para ver o orçamento
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LonaCalculator;
