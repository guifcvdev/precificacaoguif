-- Script para migrar dados das tabelas antigas para as novas
-- Este script deve ser executado após a criação das novas tabelas

-- Migrar dados de pricing_configs para as novas tabelas
DO $$
DECLARE
    config_record RECORD;
    user_id UUID;
    product_option_id UUID;
    price_data JSONB;
    price_value DECIMAL(10,2);
    option_name TEXT;
    product_name TEXT;
    product_id UUID;
    category_id UUID;
BEGIN
    -- Verificar se a tabela de backup existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'backup' AND table_name = 'pricing_configs') THEN
        -- Obter categoria para produtos personalizados
        SELECT id INTO category_id FROM config.product_categories WHERE slug = 'adesivo' LIMIT 1;
        
        -- Se não encontrou categoria, criar uma
        IF category_id IS NULL THEN
            INSERT INTO config.product_categories (name, slug, display_order)
            VALUES ('Migrados', 'migrados', 999)
            RETURNING id INTO category_id;
        END IF;
        
        -- Processar cada registro de pricing_configs
        FOR config_record IN SELECT * FROM backup.pricing_configs LOOP
            -- Obter ID do usuário
            user_id := config_record.user_id;
            
            -- Processar dados de configuração
            price_data := config_record.config_data;
            
            -- Processar cada chave no JSONB (cada tipo de produto)
            FOR product_name IN SELECT jsonb_object_keys(price_data) LOOP
                -- Verificar se o produto já existe
                SELECT id INTO product_id FROM config.products WHERE slug = LOWER(REPLACE(product_name, ' ', '-')) LIMIT 1;
                
                -- Se não existir, criar o produto
                IF product_id IS NULL THEN
                    INSERT INTO config.products (category_id, name, slug, unit, has_minimum_price, minimum_price, display_order)
                    VALUES (category_id, product_name, LOWER(REPLACE(product_name, ' ', '-')), 'm²', false, 0, 999)
                    RETURNING id INTO product_id;
                END IF;
                
                -- Processar cada opção dentro do produto
                IF jsonb_typeof(price_data->product_name) = 'object' THEN
                    FOR option_name IN SELECT jsonb_object_keys(price_data->product_name) LOOP
                        -- Obter valor do preço
                        price_value := (price_data->product_name->option_name)::DECIMAL;
                        
                        -- Verificar se a opção já existe
                        SELECT id INTO product_option_id FROM config.product_options 
                        WHERE product_id = product_id AND name = option_name LIMIT 1;
                        
                        -- Se não existir, criar a opção
                        IF product_option_id IS NULL THEN
                            INSERT INTO config.product_options (product_id, name, unit, display_order)
                            VALUES (product_id, option_name, 'm²', 999)
                            RETURNING id INTO product_option_id;
                            
                            -- Criar preço base
                            INSERT INTO config.base_prices (product_option_id, base_price)
                            VALUES (product_option_id, price_value);
                        END IF;
                        
                        -- Inserir preço personalizado do usuário
                        INSERT INTO user_data.user_prices (user_id, product_option_id, price)
                        VALUES (user_id, product_option_id, price_value)
                        ON CONFLICT (user_id, product_option_id) 
                        DO UPDATE SET price = EXCLUDED.price;
                    END LOOP;
                ELSIF jsonb_typeof(price_data->product_name) = 'number' THEN
                    -- Caso seja um preço direto sem opções
                    price_value := (price_data->product_name)::DECIMAL;
                    
                    -- Criar opção padrão
                    option_name := 'Preço por m²';
                    
                    -- Verificar se a opção já existe
                    SELECT id INTO product_option_id FROM config.product_options 
                    WHERE product_id = product_id AND name = option_name LIMIT 1;
                    
                    -- Se não existir, criar a opção
                    IF product_option_id IS NULL THEN
                        INSERT INTO config.product_options (product_id, name, unit, display_order)
                        VALUES (product_id, option_name, 'm²', 1)
                        RETURNING id INTO product_option_id;
                        
                        -- Criar preço base
                        INSERT INTO config.base_prices (product_option_id, base_price)
                        VALUES (product_option_id, price_value);
                    END IF;
                    
                    -- Inserir preço personalizado do usuário
                    INSERT INTO user_data.user_prices (user_id, product_option_id, price)
                    VALUES (user_id, product_option_id, price_value)
                    ON CONFLICT (user_id, product_option_id) 
                    DO UPDATE SET price = EXCLUDED.price;
                END IF;
            END LOOP;
        END LOOP;
        
        RAISE NOTICE 'Migração de pricing_configs concluída com sucesso.';
    ELSE
        RAISE NOTICE 'Tabela backup.pricing_configs não encontrada. Nada a migrar.';
    END IF;
    
    -- Migrar configurações de orçamento
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'backup' AND table_name = 'budget_settings') THEN
        INSERT INTO user_data.budget_settings (user_id, payment_method, delivery_time, warranty)
        SELECT user_id, payment_method, delivery_time, warranty 
        FROM backup.budget_settings
        ON CONFLICT (user_id) DO UPDATE 
        SET payment_method = EXCLUDED.payment_method,
            delivery_time = EXCLUDED.delivery_time,
            warranty = EXCLUDED.warranty;
            
        RAISE NOTICE 'Migração de budget_settings concluída com sucesso.';
    ELSE
        RAISE NOTICE 'Tabela backup.budget_settings não encontrada. Nada a migrar.';
    END IF;
    
    -- Migrar observações de orçamento
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'backup' AND table_name = 'budget_observations') THEN
        INSERT INTO user_data.budget_observations (user_id, title, content, display_order)
        SELECT user_id, 'Observação migrada', content, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY id)
        FROM backup.budget_observations;
            
        RAISE NOTICE 'Migração de budget_observations concluída com sucesso.';
    ELSE
        RAISE NOTICE 'Tabela backup.budget_observations não encontrada. Nada a migrar.';
    END IF;
    
END $$;

-- Verificar resultados da migração
SELECT 'Migração de dados concluída com sucesso!' AS message;

-- Mostrar estatísticas das tabelas migradas
SELECT 'Estatísticas de Migração' AS title;
SELECT 'Categorias de Produtos' AS table_name, COUNT(*) AS count FROM config.product_categories;
SELECT 'Produtos' AS table_name, COUNT(*) AS count FROM config.products;
SELECT 'Opções de Produtos' AS table_name, COUNT(*) AS count FROM config.product_options;
SELECT 'Preços Base' AS table_name, COUNT(*) AS count FROM config.base_prices;
SELECT 'Preços Personalizados' AS table_name, COUNT(*) AS count FROM user_data.user_prices;
SELECT 'Configurações de Orçamento' AS table_name, COUNT(*) AS count FROM user_data.budget_settings;
SELECT 'Observações de Orçamento' AS table_name, COUNT(*) AS count FROM user_data.budget_observations; 