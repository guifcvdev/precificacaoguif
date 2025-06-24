import { supabase } from "../lib/supabaseClient";
import { getCurrentUser } from "../lib/db/connection";

// Tipos para os dados
export interface BudgetSettings {
  id: string;
  userId: string;
  paymentMethod?: string;
  deliveryTime?: string;
  warranty?: string;
  taxPercentage?: number;
}

export interface CreditCardFee {
  id: string;
  userId: string;
  installments: number;
  feePercentage: number;
}

export interface InstallationFee {
  id: string;
  userId: string;
  location: string;
  fee: number;
}

export interface BudgetObservation {
  id: string;
  userId: string;
  title: string;
  content: string;
  displayOrder?: number;
}

// Serviço de configurações de orçamento
export const budgetSettingsService = {
  // Configurações básicas
  async getBudgetSettings(): Promise<BudgetSettings | null> {
    try {
      const user = await getCurrentUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('budget_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar configurações de orçamento:', error);
      return null;
    }
  },

  async updateBudgetSettings(settings: Partial<BudgetSettings>): Promise<boolean> {
    try {
      const user = await getCurrentUser();
      if (!user) return false;

      // Verifica se já existem configurações
      const { data: existingSettings, error: checkError } = await supabase
        .from('budget_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingSettings) {
        // Atualiza as configurações existentes
        const { error } = await supabase
          .from('budget_settings')
          .update(settings)
          .eq('id', existingSettings.id);

        if (error) throw error;
      } else {
        // Insere novas configurações
        const { error } = await supabase
          .from('budget_settings')
          .insert({
            user_id: user.id,
            ...settings
          });

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar configurações de orçamento:', error);
      return false;
    }
  },

  // Taxas de cartão de crédito
  async getCreditCardFees(): Promise<CreditCardFee[]> {
    try {
      const user = await getCurrentUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('credit_card_fees')
        .select('*')
        .eq('user_id', user.id)
        .order('installments');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar taxas de cartão de crédito:', error);
      return [];
    }
  },

  async updateCreditCardFee(fee: Omit<CreditCardFee, 'userId'>): Promise<boolean> {
    try {
      const user = await getCurrentUser();
      if (!user) return false;

      // Verifica se já existe uma taxa para este número de parcelas
      const { data: existingFee, error: checkError } = await supabase
        .from('credit_card_fees')
        .select('id')
        .eq('user_id', user.id)
        .eq('installments', fee.installments)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingFee) {
        // Atualiza a taxa existente
        const { error } = await supabase
          .from('credit_card_fees')
          .update({ fee_percentage: fee.feePercentage })
          .eq('id', existingFee.id);

        if (error) throw error;
      } else {
        // Insere uma nova taxa
        const { error } = await supabase
          .from('credit_card_fees')
          .insert({
            user_id: user.id,
            installments: fee.installments,
            fee_percentage: fee.feePercentage
          });

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar taxa de cartão de crédito:', error);
      return false;
    }
  },

  async deleteCreditCardFee(installments: number): Promise<boolean> {
    try {
      const user = await getCurrentUser();
      if (!user) return false;

      const { error } = await supabase
        .from('credit_card_fees')
        .delete()
        .eq('user_id', user.id)
        .eq('installments', installments);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao excluir taxa de cartão de crédito:', error);
      return false;
    }
  },

  // Taxas de instalação
  async getInstallationFees(): Promise<InstallationFee[]> {
    try {
      const user = await getCurrentUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('installation_fees')
        .select('*')
        .eq('user_id', user.id)
        .order('location');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar taxas de instalação:', error);
      return [];
    }
  },

  async updateInstallationFee(fee: Omit<InstallationFee, 'userId'>): Promise<boolean> {
    try {
      const user = await getCurrentUser();
      if (!user) return false;

      // Verifica se já existe uma taxa para esta localidade
      const { data: existingFee, error: checkError } = await supabase
        .from('installation_fees')
        .select('id')
        .eq('user_id', user.id)
        .eq('location', fee.location)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingFee) {
        // Atualiza a taxa existente
        const { error } = await supabase
          .from('installation_fees')
          .update({ fee: fee.fee })
          .eq('id', existingFee.id);

        if (error) throw error;
      } else {
        // Insere uma nova taxa
        const { error } = await supabase
          .from('installation_fees')
          .insert({
            user_id: user.id,
            location: fee.location,
            fee: fee.fee
          });

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar taxa de instalação:', error);
      return false;
    }
  },

  async deleteInstallationFee(location: string): Promise<boolean> {
    try {
      const user = await getCurrentUser();
      if (!user) return false;

      const { error } = await supabase
        .from('installation_fees')
        .delete()
        .eq('user_id', user.id)
        .eq('location', location);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao excluir taxa de instalação:', error);
      return false;
    }
  },

  // Observações de orçamento
  async getBudgetObservations(): Promise<BudgetObservation[]> {
    try {
      const user = await getCurrentUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('budget_observations')
        .select('*')
        .eq('user_id', user.id)
        .order('display_order');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar observações de orçamento:', error);
      return [];
    }
  },

  async createBudgetObservation(observation: Omit<BudgetObservation, 'id' | 'userId'>): Promise<string | null> {
    try {
      const user = await getCurrentUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('budget_observations')
        .insert({
          user_id: user.id,
          title: observation.title,
          content: observation.content,
          display_order: observation.displayOrder
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Erro ao criar observação de orçamento:', error);
      return null;
    }
  },

  async updateBudgetObservation(id: string, observation: Partial<BudgetObservation>): Promise<boolean> {
    try {
      const user = await getCurrentUser();
      if (!user) return false;

      const { error } = await supabase
        .from('budget_observations')
        .update(observation)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atualizar observação de orçamento:', error);
      return false;
    }
  },

  async deleteBudgetObservation(id: string): Promise<boolean> {
    try {
      const user = await getCurrentUser();
      if (!user) return false;

      const { error } = await supabase
        .from('budget_observations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao excluir observação de orçamento:', error);
      return false;
    }
  }
}; 