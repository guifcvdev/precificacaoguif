import React, { useState, useEffect } from 'react';
import { formatCurrency, PricingConfig } from '../types/pricing';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';
import { useBudgetSettings } from '../hooks/useBudgetSettings';
import { useToast } from '../hooks/use-toast';

interface BudgetSummaryExtendedProps {
  baseTotal: number;
  config: PricingConfig;
  productDetails: React.ReactNode;
  hasValidData: boolean;
  emptyMessage?: string;
  quantity?: string | number;
}

const BudgetSummaryExtended: React.FC<BudgetSummaryExtendedProps> = ({
  baseTotal,
  config,
  productDetails,
  hasValidData,
  emptyMessage = "Preencha os dados para ver o orçamento",
  quantity = "1"
}) => {
  const [notaFiscal, setNotaFiscal] = useState<boolean>(false);
  const [cartaoCredito, setCartaoCredito] = useState<string>('');
  const [instalacao, setInstalacao] = useState<string>('');
  const [prazoEntrega, setPrazoEntrega] = useState<string>('7');
  const [finalTotal, setFinalTotal] = useState<number>(0);
  const { formatBudgetText } = useBudgetSettings();
  const { toast } = useToast();

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

  const prazoOptions = [
    { value: '3', label: '3 dias úteis' },
    { value: '7', label: '7 dias úteis' },
    { value: '15', label: '15 dias úteis' },
    { value: '30', label: '30 dias úteis' },
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

  const handleNotaFiscalChange = (checked: boolean | "indeterminate") => {
    setNotaFiscal(checked === true);
  };

  const handleCopyBudget = async () => {
    const budgetText = formatBudgetText(quantity, finalTotal, prazoEntrega);
    
    try {
      await navigator.clipboard.writeText(budgetText);
      toast({
        title: "Orçamento copiado",
        description: "O orçamento foi copiado para a área de transferência.",
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o orçamento.",
        variant: "destructive",
      });
    }
  };

  if (!hasValidData) {
    return (
      <div className="summary-box">
        <h3 className="section-header">Resumo do Orçamento</h3>
        <p className="text-caption text-center py-8">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="summary-box">
      <div className="flex justify-between items-center mb-4">
        <h3 className="section-header mb-0">Resumo do Orçamento</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyBudget}
          className="flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copiar
        </Button>
      </div>
      
      <div className="space-y-4">
        {productDetails}
        
        <div className="flex justify-between text-body text-sm">
          <span>Subtotal do Produto:</span>
          <span className="currency-value">{formatCurrency(baseTotal)}</span>
        </div>
        
        <Separator className="separator-enhanced" />
        
        {/* Nota Fiscal */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="notaFiscal"
              checked={notaFiscal}
              onCheckedChange={handleNotaFiscalChange}
              className="checkbox-enhanced"
            />
            <Label htmlFor="notaFiscal" className="form-label">
              Nota Fiscal (+{config.notaFiscal.percentual}%)
            </Label>
          </div>
          {notaFiscal && (
            <div className="flex justify-between text-sm text-primary ml-6">
              <span>Taxa Nota Fiscal:</span>
              <span className="currency-value">+{formatCurrency((baseTotal * config.notaFiscal.percentual) / 100)}</span>
            </div>
          )}
        </div>

        {/* Two-column layout for Cartão de Crédito and Prazo de Entrega */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cartão de Crédito */}
          <div className="space-y-3">
            <Label className="form-label">
              Custos Cartão de Crédito:
            </Label>
            <RadioGroup value={cartaoCredito} onValueChange={setCartaoCredito} className="ml-4">
              {cartaoOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.value} 
                    id={`cartao-${option.value}`}
                    className="checkbox-enhanced"
                  />
                  <Label htmlFor={`cartao-${option.value}`} className="text-body text-sm">
                    {option.label} (+{option.taxa}%)
                  </Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="" 
                  id="cartao-none"
                  className="checkbox-enhanced"
                />
                <Label htmlFor="cartao-none" className="text-body text-sm">
                  Não aplicar
                </Label>
              </div>
            </RadioGroup>
            {cartaoCredito && (
              <div className="flex justify-between text-sm text-primary ml-6">
                <span>Taxa Cartão {cartaoCredito}:</span>
                <span className="currency-value">+{formatCurrency((baseTotal * (cartaoOptions.find(o => o.value === cartaoCredito)?.taxa || 0)) / 100)}</span>
              </div>
            )}
          </div>

          {/* Prazo de Entrega */}
          <div className="space-y-3">
            <Label className="form-label">
              Prazo de Entrega:
            </Label>
            <RadioGroup value={prazoEntrega} onValueChange={setPrazoEntrega} className="ml-4">
              {prazoOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.value} 
                    id={`prazo-${option.value}`}
                    className="checkbox-enhanced"
                  />
                  <Label htmlFor={`prazo-${option.value}`} className="text-body text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* Instalação */}
        <div className="space-y-3">
          <Label htmlFor="instalacao" className="form-label">
            Custo de Instalação:
          </Label>
          <select
            id="instalacao"
            value={instalacao}
            onChange={(e) => setInstalacao(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-transparent input-enhanced"
          >
            <option value="">Selecione a localidade</option>
            {instalacaoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} - {formatCurrency(option.price)}
              </option>
            ))}
          </select>
          {instalacao && (
            <div className="flex justify-between text-sm text-primary">
              <span>Instalação:</span>
              <span className="currency-value">+{formatCurrency(instalacaoOptions.find(o => o.value === instalacao)?.price || 0)}</span>
            </div>
          )}
        </div>
        
        <Separator className="separator-enhanced" />
        <div className="flex justify-between text-lg font-bold">
          <span className="text-title">Total:</span>
          <span className="currency-value text-lg">{formatCurrency(finalTotal)}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummaryExtended;
