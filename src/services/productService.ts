import { supabase } from "../lib/supabaseClient";
import { db, getCurrentUser } from "../lib/db/connection";
import { 
  productCategories, 
  products, 
  productOptions, 
  basePrices, 
  userPrices 
} from "../lib/db/schema";
import { eq } from "drizzle-orm";

// Tipos para os dados
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder?: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  unit: string;
  hasMinimumPrice: boolean;
  minimumPrice: number;
  displayOrder?: number;
}

export interface ProductOption {
  id: string;
  productId: string;
  name: string;
  description?: string;
  unit: string;
  displayOrder?: number;
}

export interface Price {
  id: string;
  productOptionId: string;
  price: number;
}

// Serviço de produtos
export const productService = {
  // Categorias de produtos
  async getCategories(): Promise<ProductCategory[]> {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('display_order');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  },

  // Produtos
  async getProducts(categoryId?: string): Promise<Product[]> {
    try {
      let query = supabase.from('products').select('*').order('display_order');
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  },

  // Opções de produtos
  async getProductOptions(productId: string): Promise<ProductOption[]> {
    try {
      const { data, error } = await supabase
        .from('product_options')
        .select('*')
        .eq('product_id', productId)
        .order('display_order');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar opções de produto:', error);
      return [];
    }
  },

  // Preços
  async getUserPrices(productOptionId: string): Promise<Price | null> {
    try {
      const user = await getCurrentUser();
      if (!user) return null;

      // Primeiro, tenta obter o preço personalizado do usuário
      const { data: userPrice, error: userPriceError } = await supabase
        .from('user_prices')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_option_id', productOptionId)
        .single();

      if (userPriceError && userPriceError.code !== 'PGRST116') {
        throw userPriceError;
      }

      // Se encontrou um preço personalizado, retorna
      if (userPrice) {
        return {
          id: userPrice.id,
          productOptionId: userPrice.product_option_id,
          price: userPrice.price
        };
      }

      // Caso contrário, busca o preço base
      const { data: basePrice, error: basePriceError } = await supabase
        .from('base_prices')
        .select('*')
        .eq('product_option_id', productOptionId)
        .single();

      if (basePriceError) throw basePriceError;

      return {
        id: basePrice.id,
        productOptionId: basePrice.product_option_id,
        price: basePrice.base_price
      };
    } catch (error) {
      console.error('Erro ao buscar preços:', error);
      return null;
    }
  },

  // Atualizar preço personalizado
  async updateUserPrice(productOptionId: string, price: number): Promise<boolean> {
    try {
      const user = await getCurrentUser();
      if (!user) return false;

      // Verifica se já existe um preço personalizado
      const { data: existingPrice, error: checkError } = await supabase
        .from('user_prices')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_option_id', productOptionId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingPrice) {
        // Atualiza o preço existente
        const { error } = await supabase
          .from('user_prices')
          .update({ price })
          .eq('id', existingPrice.id);

        if (error) throw error;
      } else {
        // Insere um novo preço
        const { error } = await supabase
          .from('user_prices')
          .insert({
            user_id: user.id,
            product_option_id: productOptionId,
            price
          });

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar preço:', error);
      return false;
    }
  },

  // Resetar preço para o valor padrão
  async resetUserPrice(productOptionId: string): Promise<boolean> {
    try {
      const user = await getCurrentUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_prices')
        .delete()
        .eq('user_id', user.id)
        .eq('product_option_id', productOptionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao resetar preço:', error);
      return false;
    }
  }
}; 