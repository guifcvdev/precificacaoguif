
import React, { useState, useEffect } from 'react';
import { Calculator, Square } from 'lucide-react';
import { PlacaACMConfig, formatCurrency, calculateMinimumCharge } from '../../types/pricing';

interface Props {
  config: PlacaACMConfig;
}

const PlacaACMCalculator: React.FC<Props> = ({ config }) => {
  const [largura, setLargura] = useState<number>(0);
  const [altura, setAltura] = useState<number>(0);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const area = largura * altura;
  const areaTotal = area * quantidade;

  useEffect(() => {
    if (area > 0 && quantidade > 0) {
      const unitTotal = calculateMinimumCharge(area * config.preco);
      setTotal(unitTotal * quantidade);
    } else {
      setTotal(0);
    }
  }, [largura, altura, quantidade, config]);

  return (
    <div className="p-8">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
            <Square className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
            Calculadora de Placa em ACM
          </h2>
        </div>
        <p className="text-muted-foreground text-lg">Informe as dimensões para calcular o preço da placa em ACM.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Dimensões */}
          <div className="modern-card p-6 animate-scale-in">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full mr-3"></div>
              Dimensões da Placa
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
              <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl border border-orange-200 dark:border-orange-800">
                <p className="text-orange-800 dark:text-orange-200 font-medium">
                  📐 Área unitária: <span className="font-bold">{area.toFixed(2)} m²</span> | 
                  Área total: <span className="font-bold">{areaTotal.toFixed(2)} m²</span>
                </p>
              </div>
            )}
          </div>

          {/* Informações sobre ACM */}
          <div className="modern-card p-6 animate-scale-in">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full mr-3"></div>
              Sobre Placas em ACM
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Características</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Material composto de alumínio</li>
                  <li>• Alta durabilidade</li>
                  <li>• Resistente a intempéries</li>
                  <li>• Acabamento premium</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Preço Atual</h4>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(config.preco)}/m²
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                  Valor configurável nas configurações do sistema
                </p>
              </div>
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
          
          {area > 0 && quantidade > 0 ? (
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
                  <span className="text-muted-foreground">Preço/m²:</span>
                  <span className="font-medium">{formatCurrency(config.preco)}</span>
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
                <Square className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Informe as dimensões e quantidade para ver o orçamento
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacaACMCalculator;
