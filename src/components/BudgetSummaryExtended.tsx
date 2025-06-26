
import React, { useState, useEffect } from 'react';
import { formatCurrency, PricingConfig } from '../types/pricing';
import { useBudgetSettings } from '../hooks/useBudgetSettings';
import { useToast } from '../hooks/use-toast';
import BudgetHeader from './budget/BudgetHeader';
import ProductDetails from './budget/ProductDetails';
import NotaFiscalSection from './budget/NotaFiscalSection';
import PaymentAndDeliverySection from './budget/PaymentAndDeliverySection';
import InstallationSection from './budget/InstallationSection';
import BudgetTotal from './budget/BudgetTotal';
import { getInstalacaoOptions } from '../utils/instalacaoUtils';

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

  // Safety checks for config properties
  const instalacaoOptions = getInstalacaoOptions(config || {} as PricingConfig);

  const cartaoOptions = [
    { value: '3x', label: '3x', taxa: config?.cartaoCredito?.taxa3x || 0 },
    { value: '6x', label: '6x', taxa: config?.cartaoCredito?.taxa6x || 0 },
    { value: '12x', label: '12x', taxa: config?.cartaoCredito?.taxa12x || 0 },
  ];

  // Validar estado de instalação quando a configuração muda
  useEffect(() => {
    if (instalacao && instalacaoOptions.length > 0) {
      const instalacaoExists = instalacaoOptions.some(option => option.value === instalacao);
      if (!instalacaoExists) {
        console.warn('Instalação selecionada não existe na nova configuração:', instalacao);
        setInstalacao(''); // Resetar se a opção não existe mais
      }
    }
  }, [config, instalacao, instalacaoOptions]);

  useEffect(() => {
    let total = baseTotal;

    // Adicionar taxa de nota fiscal
    if (notaFiscal && config?.notaFiscal?.percentual) {
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
      const toastInstance = toast({
        title: "Orçamento copiado",
        description: "O orçamento foi copiado para a área de transferência.",
      });
      
      // Fechar automaticamente após 3 segundos
      setTimeout(() => {
        toastInstance.dismiss();
      }, 3000);
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

  // Add safety check for config
  if (!config) {
    return (
      <div className="summary-box">
        <h3 className="section-header">Resumo do Orçamento</h3>
        <p className="text-caption text-center py-8">Configuração não carregada</p>
      </div>
    );
  }

  return (
    <div className="summary-box">
      <BudgetHeader onCopyBudget={handleCopyBudget} />
      
      <div className="space-y-4">
        <ProductDetails productDetails={productDetails} baseTotal={baseTotal} />
        
        <NotaFiscalSection
          notaFiscal={notaFiscal}
          onNotaFiscalChange={handleNotaFiscalChange}
          config={config}
          baseTotal={baseTotal}
        />

        <PaymentAndDeliverySection
          cartaoCredito={cartaoCredito}
          setCartaoCredito={setCartaoCredito}
          prazoEntrega={prazoEntrega}
          setPrazoEntrega={setPrazoEntrega}
          config={config}
          baseTotal={baseTotal}
        />

        <InstallationSection
          instalacao={instalacao}
          setInstalacao={setInstalacao}
          config={config}
        />
        
        <BudgetTotal finalTotal={finalTotal} />
      </div>
    </div>
  );
};

export default BudgetSummaryExtended;
