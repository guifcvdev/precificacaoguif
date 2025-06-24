import { supabase } from "../lib/supabaseClient";
import { getCurrentUser } from "../lib/db/connection";

// Tipos para os dados
export interface Budget {
  id: string;
  userId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCompany?: string;
  status: string;
  budgetNumber?: string;
  budgetDate?: Date;
  validUntil?: Date;
  subtotal: number;
  taxPercentage?: number;
  taxValue?: number;
  discountPercentage?: number;
  discountValue?: number;
  totalValue: number;
  paymentMethod?: string;
  deliveryTime?: string;
  warranty?: string;
  notes?: string;
  installationLocation?: string;
  installationFee?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetItem {
  id: string;
  budgetId: string;
  productId: string;
  productOptionId?: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  width?: number;
  height?: number;
  area?: number;
  displayOrder?: number;
}

export interface BudgetSummary {
  id: string;
  clientName: string;
  status: string;
  totalValue: number;
  createdAt: Date;
  updatedAt: Date;
}

// Serviço de orçamentos
export const budgetManagementService = {
  // Listar orçamentos (resumo)
  async getBudgetSummaries(): Promise<BudgetSummary[]> {
    try {
      const user = await getCurrentUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('budgets')
        .select('id, client_name, status, total_value, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data.map(item => ({
        id: item.id,
        clientName: item.client_name,
        status: item.status,
        totalValue: item.total_value,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      }));
    } catch (error) {
      console.error('Erro ao buscar resumos de orçamentos:', error);
      return [];
    }
  },

  // Obter orçamento completo
  async getBudget(id: string): Promise<{ budget: Budget, items: BudgetItem[] } | null> {
    try {
      const user = await getCurrentUser();
      if (!user) return null;

      // Buscar o orçamento
      const { data: budgetData, error: budgetError } = await supabase
        .from('budgets')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (budgetError) throw budgetError;

      // Buscar os itens do orçamento
      const { data: itemsData, error: itemsError } = await supabase
        .from('budget_items')
        .select('*')
        .eq('budget_id', id)
        .order('display_order');

      if (itemsError) throw itemsError;

      // Converter datas e valores numéricos
      const budget: Budget = {
        ...budgetData,
        budgetDate: budgetData.budget_date ? new Date(budgetData.budget_date) : undefined,
        validUntil: budgetData.valid_until ? new Date(budgetData.valid_until) : undefined,
        subtotal: parseFloat(budgetData.subtotal),
        taxPercentage: budgetData.tax_percentage ? parseFloat(budgetData.tax_percentage) : undefined,
        taxValue: budgetData.tax_value ? parseFloat(budgetData.tax_value) : undefined,
        discountPercentage: budgetData.discount_percentage ? parseFloat(budgetData.discount_percentage) : undefined,
        discountValue: budgetData.discount_value ? parseFloat(budgetData.discount_value) : undefined,
        totalValue: parseFloat(budgetData.total_value),
        installationFee: budgetData.installation_fee ? parseFloat(budgetData.installation_fee) : undefined,
        createdAt: new Date(budgetData.created_at),
        updatedAt: new Date(budgetData.updated_at)
      };

      // Converter valores numéricos dos itens
      const items: BudgetItem[] = itemsData.map(item => ({
        ...item,
        quantity: parseFloat(item.quantity),
        unitPrice: parseFloat(item.unit_price),
        totalPrice: parseFloat(item.total_price),
        width: item.width ? parseFloat(item.width) : undefined,
        height: item.height ? parseFloat(item.height) : undefined,
        area: item.area ? parseFloat(item.area) : undefined
      }));

      return { budget, items };
    } catch (error) {
      console.error('Erro ao buscar orçamento:', error);
      return null;
    }
  },

  // Criar orçamento
  async createBudget(budgetData: Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const user = await getCurrentUser();
      if (!user) return null;

      // Gerar número sequencial para o orçamento (opcional)
      let budgetNumber = budgetData.budgetNumber;
      if (!budgetNumber) {
        const { count, error: countError } = await supabase
          .from('budgets')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (countError) throw countError;
        
        const nextNumber = (count || 0) + 1;
        const date = new Date();
        budgetNumber = `${date.getFullYear()}-${String(nextNumber).padStart(3, '0')}`;
      }

      // Inserir orçamento
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          user_id: user.id,
          client_name: budgetData.clientName,
          client_email: budgetData.clientEmail,
          client_phone: budgetData.clientPhone,
          client_company: budgetData.clientCompany,
          status: budgetData.status || 'draft',
          budget_number: budgetNumber,
          budget_date: budgetData.budgetDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          valid_until: budgetData.validUntil?.toISOString().split('T')[0],
          subtotal: budgetData.subtotal,
          tax_percentage: budgetData.taxPercentage,
          tax_value: budgetData.taxValue,
          discount_percentage: budgetData.discountPercentage,
          discount_value: budgetData.discountValue,
          total_value: budgetData.totalValue,
          payment_method: budgetData.paymentMethod,
          delivery_time: budgetData.deliveryTime,
          warranty: budgetData.warranty,
          notes: budgetData.notes,
          installation_location: budgetData.installationLocation,
          installation_fee: budgetData.installationFee
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Erro ao criar orçamento:', error);
      return null;
    }
  },

  // Atualizar orçamento
  async updateBudget(id: string, budgetData: Partial<Budget>): Promise<boolean> {
    try {
      const user = await getCurrentUser();
      if (!user) return false;

      // Converter datas para formato ISO
      const updateData: any = { ...budgetData };
      if (updateData.budgetDate instanceof Date) {
        updateData.budget_date = updateData.budgetDate.toISOString().split('T')[0];
        delete updateData.budgetDate;
      }
      if (updateData.validUntil instanceof Date) {
        updateData.valid_until = updateData.validUntil.toISOString().split('T')[0];
        delete updateData.validUntil;
      }

      // Converter nomes de propriedades para snake_case
      if (updateData.clientName !== undefined) {
        updateData.client_name = updateData.clientName;
        delete updateData.clientName;
      }
      if (updateData.clientEmail !== undefined) {
        updateData.client_email = updateData.clientEmail;
        delete updateData.clientEmail;
      }
      if (updateData.clientPhone !== undefined) {
        updateData.client_phone = updateData.clientPhone;
        delete updateData.clientPhone;
      }
      if (updateData.clientCompany !== undefined) {
        updateData.client_company = updateData.clientCompany;
        delete updateData.clientCompany;
      }
      if (updateData.budgetNumber !== undefined) {
        updateData.budget_number = updateData.budgetNumber;
        delete updateData.budgetNumber;
      }
      if (updateData.taxPercentage !== undefined) {
        updateData.tax_percentage = updateData.taxPercentage;
        delete updateData.taxPercentage;
      }
      if (updateData.taxValue !== undefined) {
        updateData.tax_value = updateData.taxValue;
        delete updateData.taxValue;
      }
      if (updateData.discountPercentage !== undefined) {
        updateData.discount_percentage = updateData.discountPercentage;
        delete updateData.discountPercentage;
      }
      if (updateData.discountValue !== undefined) {
        updateData.discount_value = updateData.discountValue;
        delete updateData.discountValue;
      }
      if (updateData.totalValue !== undefined) {
        updateData.total_value = updateData.totalValue;
        delete updateData.totalValue;
      }
      if (updateData.paymentMethod !== undefined) {
        updateData.payment_method = updateData.paymentMethod;
        delete updateData.paymentMethod;
      }
      if (updateData.deliveryTime !== undefined) {
        updateData.delivery_time = updateData.deliveryTime;
        delete updateData.deliveryTime;
      }
      if (updateData.installationLocation !== undefined) {
        updateData.installation_location = updateData.installationLocation;
        delete updateData.installationLocation;
      }
      if (updateData.installationFee !== undefined) {
        updateData.installation_fee = updateData.installationFee;
        delete updateData.installationFee;
      }

      // Atualizar orçamento
      const { error } = await supabase
        .from('budgets')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      return false;
    }
  },

  // Excluir orçamento
  async deleteBudget(id: string): Promise<boolean> {
    try {
      const user = await getCurrentUser();
      if (!user) return false;

      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error);
      return false;
    }
  },

  // Adicionar item ao orçamento
  async addBudgetItem(budgetId: string, item: Omit<BudgetItem, 'id' | 'budgetId'>): Promise<string | null> {
    try {
      const user = await getCurrentUser();
      if (!user) return null;

      // Verificar se o orçamento pertence ao usuário
      const { data: budgetCheck, error: checkError } = await supabase
        .from('budgets')
        .select('id')
        .eq('id', budgetId)
        .eq('user_id', user.id)
        .single();

      if (checkError) throw checkError;
      if (!budgetCheck) return null;

      // Adicionar item
      const { data, error } = await supabase
        .from('budget_items')
        .insert({
          budget_id: budgetId,
          product_id: item.productId,
          product_option_id: item.productOptionId,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unitPrice,
          total_price: item.totalPrice,
          width: item.width,
          height: item.height,
          area: item.area,
          display_order: item.displayOrder
        })
        .select('id')
        .single();

      if (error) throw error;
      
      // Atualizar o subtotal e total do orçamento
      await this.recalculateBudgetTotal(budgetId);
      
      return data.id;
    } catch (error) {
      console.error('Erro ao adicionar item ao orçamento:', error);
      return null;
    }
  },

  // Atualizar item do orçamento
  async updateBudgetItem(id: string, budgetId: string, item: Partial<BudgetItem>): Promise<boolean> {
    try {
      const user = await getCurrentUser();
      if (!user) return false;

      // Verificar se o orçamento pertence ao usuário
      const { data: budgetCheck, error: checkError } = await supabase
        .from('budgets')
        .select('id')
        .eq('id', budgetId)
        .eq('user_id', user.id)
        .single();

      if (checkError) throw checkError;
      if (!budgetCheck) return false;

      // Converter nomes de propriedades para snake_case
      const updateData: any = { ...item };
      if (updateData.productId !== undefined) {
        updateData.product_id = updateData.productId;
        delete updateData.productId;
      }
      if (updateData.productOptionId !== undefined) {
        updateData.product_option_id = updateData.productOptionId;
        delete updateData.productOptionId;
      }
      if (updateData.unitPrice !== undefined) {
        updateData.unit_price = updateData.unitPrice;
        delete updateData.unitPrice;
      }
      if (updateData.totalPrice !== undefined) {
        updateData.total_price = updateData.totalPrice;
        delete updateData.totalPrice;
      }
      if (updateData.displayOrder !== undefined) {
        updateData.display_order = updateData.displayOrder;
        delete updateData.displayOrder;
      }

      // Atualizar item
      const { error } = await supabase
        .from('budget_items')
        .update(updateData)
        .eq('id', id)
        .eq('budget_id', budgetId);

      if (error) throw error;
      
      // Atualizar o subtotal e total do orçamento
      await this.recalculateBudgetTotal(budgetId);
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar item do orçamento:', error);
      return false;
    }
  },

  // Excluir item do orçamento
  async deleteBudgetItem(id: string, budgetId: string): Promise<boolean> {
    try {
      const user = await getCurrentUser();
      if (!user) return false;

      // Verificar se o orçamento pertence ao usuário
      const { data: budgetCheck, error: checkError } = await supabase
        .from('budgets')
        .select('id')
        .eq('id', budgetId)
        .eq('user_id', user.id)
        .single();

      if (checkError) throw checkError;
      if (!budgetCheck) return false;

      // Excluir item
      const { error } = await supabase
        .from('budget_items')
        .delete()
        .eq('id', id)
        .eq('budget_id', budgetId);

      if (error) throw error;
      
      // Atualizar o subtotal e total do orçamento
      await this.recalculateBudgetTotal(budgetId);
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir item do orçamento:', error);
      return false;
    }
  },

  // Recalcular o total do orçamento
  async recalculateBudgetTotal(budgetId: string): Promise<boolean> {
    try {
      // Buscar todos os itens do orçamento
      const { data: items, error: itemsError } = await supabase
        .from('budget_items')
        .select('total_price')
        .eq('budget_id', budgetId);

      if (itemsError) throw itemsError;

      // Calcular o subtotal
      const subtotal = items.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

      // Buscar o orçamento atual
      const { data: budget, error: budgetError } = await supabase
        .from('budgets')
        .select('tax_percentage, discount_percentage, installation_fee')
        .eq('id', budgetId)
        .single();

      if (budgetError) throw budgetError;

      // Calcular taxas e descontos
      let totalValue = subtotal;
      let taxValue = 0;
      let discountValue = 0;

      if (budget.tax_percentage) {
        taxValue = subtotal * (parseFloat(budget.tax_percentage) / 100);
        totalValue += taxValue;
      }

      if (budget.discount_percentage) {
        discountValue = subtotal * (parseFloat(budget.discount_percentage) / 100);
        totalValue -= discountValue;
      }

      if (budget.installation_fee) {
        totalValue += parseFloat(budget.installation_fee);
      }

      // Atualizar o orçamento
      const { error: updateError } = await supabase
        .from('budgets')
        .update({
          subtotal,
          tax_value: taxValue,
          discount_value: discountValue,
          total_value: totalValue
        })
        .eq('id', budgetId);

      if (updateError) throw updateError;
      return true;
    } catch (error) {
      console.error('Erro ao recalcular total do orçamento:', error);
      return false;
    }
  }
}; 