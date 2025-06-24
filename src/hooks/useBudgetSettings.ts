import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { configService } from '../services/configService';

export interface BudgetObservations {
  paymentMethod: string;
  deliveryTime: string;
  warranty: string;
}

const defaultObservations: BudgetObservations = {
  paymentMethod: "- Entrada de 50% do valor e restante na retirada.\n- Parcelado no cartão a combinar.",
  deliveryTime: "- Entrega do pedido em 7 úteis após a aprovação de arte e pagamento.",
  warranty: "*GARANTIA DE 3 MESES PARA O SERVIÇO ENTREGUE CONFORME A LEI Nº 8.078, DE 11 DE SETEMBRO DE 1990. Art. 26."
};

export const useBudgetSettings = () => {
  const [observations, setObservations] = useState<BudgetObservations>(defaultObservations);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadObservations();
  }, []);

  const loadObservations = async () => {
    setIsLoading(true);
    try {
      const data = await configService.loadBudgetObservations();
      
      if (data) {
        setObservations(data);
      } else {
        // Se não encontrar dados, usar os valores padrão
        setObservations(defaultObservations);
      }
    } catch (error) {
      console.error('Exceção ao carregar observações:', error);
      // Usar os valores padrão em caso de exceção
      setObservations(defaultObservations);
    } finally {
      setIsLoading(false);
    }
  };

  const saveObservations = async (newObservations: BudgetObservations) => {
    setIsLoading(true);
    try {
      const result = await configService.saveBudgetObservations(newObservations);
      
      if (!result.success) {
        throw result.error;
      }

      setObservations(newObservations);
      toast({
        title: "Sucesso",
        description: "Observações do orçamento salvas com sucesso."
      });
    } catch (error) {
      console.error('Exceção ao salvar observações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as observações do orçamento.",
        variant: "destructive"
      });
      // Manter os valores atuais mesmo em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  const formatBudgetText = (quantity: string | number, total: number, deliveryDays?: string) => {
    const deliveryText = deliveryDays 
      ? `- Entrega do pedido em ${deliveryDays} dias úteis após a aprovação de arte e pagamento.`
      : observations.deliveryTime;

    return `Orçamento
Quantidade: ${quantity}
Total: R$ ${total.toFixed(2).replace('.', ',')}

Observações:
Forma de Pagamento
${observations.paymentMethod}

Prazo de Entrega
${deliveryText}

${observations.warranty}`;
  };

  return {
    observations,
    saveObservations,
    formatBudgetText,
    isLoading
  };
};
