-- Tabelas para categorias de produtos e produtos
-- Categorias de produtos
CREATE TABLE IF NOT EXISTS config.product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Produtos/serviços disponíveis
CREATE TABLE IF NOT EXISTS config.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES config.product_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  unit TEXT NOT NULL, -- m², unid, etc.
  has_minimum_price BOOLEAN DEFAULT FALSE,
  minimum_price DECIMAL(10,2) DEFAULT 0,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opções/variações de produtos
CREATE TABLE IF NOT EXISTS config.product_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES config.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, name)
);

-- Preços base definidos pelo sistema (valores padrão)
CREATE TABLE IF NOT EXISTS config.base_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_option_id UUID NOT NULL REFERENCES config.product_options(id) ON DELETE CASCADE,
  base_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_option_id)
);

-- Triggers para atualização automática do campo updated_at
CREATE TRIGGER update_product_categories_updated_at
BEFORE UPDATE ON config.product_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON config.products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_options_updated_at
BEFORE UPDATE ON config.product_options
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_base_prices_updated_at
BEFORE UPDATE ON config.base_prices
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 