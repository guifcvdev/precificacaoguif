
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const saved = localStorage.getItem('budgetObservations');
    if (saved) {
      try {
        setObservations(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading budget observations:', error);
      }
    }
  }, []);

  const saveObservations = (newObservations: BudgetObservations) => {
    setObservations(newObservations);
    localStorage.setItem('budgetObservations', JSON.stringify(newObservations));
  };

  const formatBudgetText = (quantity: string | number, total: number, deliveryDays?: string) => {
    const deliveryText = deliveryDays 
      ? `- Entrega do pedido em ${deliveryDays} dias úteis após a aprovação de arte e pagamento.`
      : observations.deliveryTime;

    return `Título: Orçamento
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
    formatBudgetText
  };
};
