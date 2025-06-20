
import React, { useState, useEffect } from 'react';
import { formatCurrency, PricingConfig } from '../types/pricing';

interface BudgetSummaryExtendedProps {
  baseTotal: number;
  config: PricingConfig;
  productDetails: React.ReactNode;
  hasValidData: boolean;
  emptyMessage?: string;
}

const BudgetSummaryExtended: React.FC<BudgetSummaryExtendedProps> = ({
  baseTotal,
  config,
  productDetails,
  hasValidData,
  emptyMessage = "Preencha os dados para ver o orçamento"
}) => {
  const [notaFiscal, setNotaFiscal] = useState<boolean>(false);
  const [cartaoCredito, setCartaoCredito] = useState<string>('');
  const [instalacao, setInstalacao] = useState<string>('');
  const [finalTotal, setFinalTotal] = useState<number>(0);

  const instalacaoOptions = [
    { value: 'jacarei', label: 'Jacareí', price: config.instalacao.jacarei },
    { value: 'sjCampos', label: 'S.J.Campos', price: config.instalacao.sjCampos },
    { value: 'cacapavaTaubate', label: 'Caçapava/Taubaté', price: config.instalacao.cacapavaTaubate },
    { value: 'litoral', label: 'Litoral', price: config.instalacao.litoral },
    { value: 'guararemaSantaIsabel', label: 'Guararema/Sta Isabel', price: config.instalacao.guararemaSantaIsabel },
    { value: 'santaBranca', label: 'Sta Branca', price: config.instalacao.santaBranca },
  ];

  const cartaoOptions = [
    { value: '3x', label: '3x', taxa: config.cartaoCredito.taxa3x },
    { value: '6x', label: '6x', taxa: config.cartaoCredito.taxa6x },
    { value: '12x', label: '12x', taxa: config.cartaoCredito.taxa12x },
  ];

  useEffect(() => {
    let total = baseTotal;

    // Adicionar taxa de nota fiscal
    if (notaFiscal) {
      total += (baseTotal * config.notaFiscal.percentual) / 100;
    }

    // Adicionar taxa de cartão de crédito
    if (cartaoCredito) {
      const selectedCartao = cartaoOptions.find(option => option.value === cartaoCredito);
      if (selectedCartao) {
        total += (baseTotal * selectedCartao.taxa) / 100;
      }
    }

    // Adicionar custo de instalação
    if (instalacao) {
      const selectedInstalacao = instalacaoOptions.find(option => option.value === instalacao);
      if (selectedInstalacao) {
        total += selectedInstalacao.price;
      }
    }

    setFinalTotal(total);
  }, [baseTotal, notaFiscal, cartaoCredito, instalacao, config]);

  if (!hasValidData) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Orçamento</h3>
        <p className="text-gray-500 text-center py-8">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Orçamento</h3>
      
      <div className="space-y-3">
        {productDetails}
        
        <div className="flex justify-between text-sm">
          <span>Subtotal do Produto:</span>
          <span>{formatCurrency(baseTotal)}</span>
        </div>
        
        <hr className="my-3" />
        
        {/* Nota Fiscal */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notaFiscal"
              checked={notaFiscal}
              onChange={(e) => setNotaFiscal(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="notaFiscal" className="ml-2 text-sm font-medium text-gray-700">
              Nota Fiscal (+{config.notaFiscal.percentual}%)
            </label>
          </div>
          {notaFiscal && (
            <div className="flex justify-between text-sm text-blue-600 ml-6">
              <span>Taxa Nota Fiscal:</span>
              <span>+{formatCurrency((baseTotal * config.notaFiscal.percentual) / 100)}</span>
            </div>
          )}
        </div>

        {/* Cartão de Crédito */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Custos Cartão de Crédito:
          </label>
          <div className="space-y-1 ml-4">
            {cartaoOptions.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`cartao-${option.value}`}
                  name="cartaoCredito"
                  value={option.value}
                  checked={cartaoCredito === option.value}
                  onChange={(e) => setCartaoCredito(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor={`cartao-${option.value}`} className="ml-2 text-sm text-gray-700">
                  {option.label} (+{option.taxa}%)
                </label>
              </div>
            ))}
            <div className="flex items-center">
              <input
                type="radio"
                id="cartao-none"
                name="cartaoCredito"
                value=""
                checked={cartaoCredito === ''}
                onChange={(e) => setCartaoCredito(e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="cartao-none" className="ml-2 text-sm text-gray-700">
                Não aplicar
              </label>
            </div>
          </div>
          {cartaoCredito && (
            <div className="flex justify-between text-sm text-blue-600 ml-6">
              <span>Taxa Cartão {cartaoCredito}:</span>
              <span>+{formatCurrency((baseTotal * (cartaoOptions.find(o => o.value === cartaoCredito)?.taxa || 0)) / 100)}</span>
            </div>
          )}
        </div>

        {/* Instalação */}
        <div className="space-y-2">
          <label htmlFor="instalacao" className="block text-sm font-medium text-gray-700">
            Custo de Instalação:
          </label>
          <select
            id="instalacao"
            value={instalacao}
            onChange={(e) => setInstalacao(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecione a localidade</option>
            {instalacaoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} - {formatCurrency(option.price)}
              </option>
            ))}
          </select>
          {instalacao && (
            <div className="flex justify-between text-sm text-blue-600">
              <span>Instalação:</span>
              <span>+{formatCurrency(instalacaoOptions.find(o => o.value === instalacao)?.price || 0)}</span>
            </div>
          )}
        </div>
        
        <hr className="my-3" />
        <div className="flex justify-between text-lg font-bold text-blue-600">
          <span>Total:</span>
          <span>{formatCurrency(finalTotal)}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummaryExtended;
