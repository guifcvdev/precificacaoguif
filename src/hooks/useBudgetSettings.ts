import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    loadObservations();
  }, []);

  const loadObservations = async () => {
    try {
      const { data, error } = await supabase
        .from('budget_observations')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setObservations({
          paymentMethod: data.payment_method || defaultObservations.paymentMethod,
          deliveryTime: data.delivery_time || defaultObservations.deliveryTime,
          warranty: data.warranty || defaultObservations.warranty
        });
      }
    } catch (error) {
      console.error('Erro ao carregar observações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as observações do orçamento.",
        variant: "destructive"
      });
    }
  };

  const saveObservations = async (newObservations: BudgetObservations) => {
    try {
      const { error } = await supabase
        .from('budget_observations')
        .upsert({
          id: 1, // Usando um ID fixo já que só teremos um registro
          payment_method: newObservations.paymentMethod,
          delivery_time: newObservations.deliveryTime,
          warranty: newObservations.warranty,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      setObservations(newObservations);
      toast({
        title: "Sucesso",
        description: "Observações do orçamento salvas com sucesso."
      });
    } catch (error) {
      console.error('Erro ao salvar observações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as observações do orçamento.",
        variant: "destructive"
      });
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
    formatBudgetText
  };
};
