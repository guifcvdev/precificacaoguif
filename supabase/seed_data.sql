-- Script para inserir dados iniciais no banco de dados

-- Inserir categorias de produtos
INSERT INTO config.product_categories (name, slug, display_order)
VALUES 
  ('Adesivo', 'adesivo', 1),
  ('Lona', 'lona', 2),
  ('Placa em PS', 'placa-ps', 3),
  ('Placa em ACM', 'placa-acm', 4),
  ('Fachada Simples', 'fachada-simples', 5),
  ('Letra Caixa em PVC', 'letra-caixa-pvc', 6),
  ('Vidro Temperado', 'vidro-temperado', 7),
  ('Luminoso', 'luminoso', 8);

-- Inserir produtos e opções para cada categoria
-- Adesivo
INSERT INTO config.products (category_id, name, slug, unit, has_minimum_price, minimum_price, display_order)
VALUES (
  (SELECT id FROM config.product_categories WHERE slug = 'adesivo'),
  'Adesivo', 'adesivo', 'm²', TRUE, 20.00, 1
);

-- Opções para Adesivo
INSERT INTO config.product_options (product_id, name, unit, display_order)
VALUES
  ((SELECT id FROM config.products WHERE slug = 'adesivo'), 'Só Refil', 'm²', 1),
  ((SELECT id FROM config.products WHERE slug = 'adesivo'), 'Corte Especial', 'm²', 2),
  ((SELECT id FROM config.products WHERE slug = 'adesivo'), 'Laminado', 'm²', 3),
  ((SELECT id FROM config.products WHERE slug = 'adesivo'), 'Adesivo Perfurado', 'm²', 4),
  ((SELECT id FROM config.products WHERE slug = 'adesivo'), 'Imantado', 'm²', 5);

-- Preços base para Adesivo
INSERT INTO config.base_prices (product_option_id, base_price)
VALUES
  ((SELECT id FROM config.product_options WHERE name = 'Só Refil' AND product_id = (SELECT id FROM config.products WHERE slug = 'adesivo')), 15.00),
  ((SELECT id FROM config.product_options WHERE name = 'Corte Especial' AND product_id = (SELECT id FROM config.products WHERE slug = 'adesivo')), 25.00),
  ((SELECT id FROM config.product_options WHERE name = 'Laminado' AND product_id = (SELECT id FROM config.products WHERE slug = 'adesivo')), 35.00),
  ((SELECT id FROM config.product_options WHERE name = 'Adesivo Perfurado' AND product_id = (SELECT id FROM config.products WHERE slug = 'adesivo')), 30.00),
  ((SELECT id FROM config.product_options WHERE name = 'Imantado' AND product_id = (SELECT id FROM config.products WHERE slug = 'adesivo')), 40.00);

-- Lona
INSERT INTO config.products (category_id, name, slug, unit, has_minimum_price, minimum_price, display_order)
VALUES (
  (SELECT id FROM config.product_categories WHERE slug = 'lona'),
  'Lona', 'lona', 'm²', TRUE, 20.00, 1
);

-- Opções para Lona
INSERT INTO config.product_options (product_id, name, unit, display_order)
VALUES
  ((SELECT id FROM config.products WHERE slug = 'lona'), 'Banner/Faixa', 'm²', 1),
  ((SELECT id FROM config.products WHERE slug = 'lona'), 'Reforço e Ilhós', 'm²', 2),
  ((SELECT id FROM config.products WHERE slug = 'lona'), 'Lona Backlight', 'm²', 3),
  ((SELECT id FROM config.products WHERE slug = 'lona'), 'Só Refil', 'm²', 4);

-- Preços base para Lona
INSERT INTO config.base_prices (product_option_id, base_price)
VALUES
  ((SELECT id FROM config.product_options WHERE name = 'Banner/Faixa' AND product_id = (SELECT id FROM config.products WHERE slug = 'lona')), 20.00),
  ((SELECT id FROM config.product_options WHERE name = 'Reforço e Ilhós' AND product_id = (SELECT id FROM config.products WHERE slug = 'lona')), 25.00),
  ((SELECT id FROM config.product_options WHERE name = 'Lona Backlight' AND product_id = (SELECT id FROM config.products WHERE slug = 'lona')), 30.00),
  ((SELECT id FROM config.product_options WHERE name = 'Só Refil' AND product_id = (SELECT id FROM config.products WHERE slug = 'lona')), 15.00);

-- Placa em PS
INSERT INTO config.products (category_id, name, slug, unit, has_minimum_price, minimum_price, display_order)
VALUES (
  (SELECT id FROM config.product_categories WHERE slug = 'placa-ps'),
  'Placa em PS', 'placa-ps', 'm²', TRUE, 20.00, 1
);

-- Opções para Placa em PS
INSERT INTO config.product_options (product_id, name, unit, display_order)
VALUES
  ((SELECT id FROM config.products WHERE slug = 'placa-ps'), 'Espessura 1mm', 'm²', 1),
  ((SELECT id FROM config.products WHERE slug = 'placa-ps'), 'Espessura 2mm', 'm²', 2);

-- Preços base para Placa em PS
INSERT INTO config.base_prices (product_option_id, base_price)
VALUES
  ((SELECT id FROM config.product_options WHERE name = 'Espessura 1mm' AND product_id = (SELECT id FROM config.products WHERE slug = 'placa-ps')), 30.00),
  ((SELECT id FROM config.product_options WHERE name = 'Espessura 2mm' AND product_id = (SELECT id FROM config.products WHERE slug = 'placa-ps')), 35.00);

-- Placa em ACM
INSERT INTO config.products (category_id, name, slug, unit, has_minimum_price, minimum_price, display_order)
VALUES (
  (SELECT id FROM config.product_categories WHERE slug = 'placa-acm'),
  'Placa em ACM', 'placa-acm', 'm²', TRUE, 20.00, 1
);

-- Opções para Placa em ACM
INSERT INTO config.product_options (product_id, name, unit, display_order)
VALUES
  ((SELECT id FROM config.products WHERE slug = 'placa-acm'), 'Preço por m²', 'm²', 1);

-- Preços base para Placa em ACM
INSERT INTO config.base_prices (product_option_id, base_price)
VALUES
  ((SELECT id FROM config.product_options WHERE name = 'Preço por m²' AND product_id = (SELECT id FROM config.products WHERE slug = 'placa-acm')), 45.00);

-- Fachada Simples
INSERT INTO config.products (category_id, name, slug, unit, has_minimum_price, minimum_price, display_order)
VALUES (
  (SELECT id FROM config.product_categories WHERE slug = 'fachada-simples'),
  'Fachada Simples', 'fachada-simples', 'm²', TRUE, 20.00, 1
);

-- Opções para Fachada Simples
INSERT INTO config.product_options (product_id, name, unit, display_order)
VALUES
  ((SELECT id FROM config.products WHERE slug = 'fachada-simples'), 'Lona', 'm²', 1),
  ((SELECT id FROM config.products WHERE slug = 'fachada-simples'), 'ACM 1.22m', 'unid', 2),
  ((SELECT id FROM config.products WHERE slug = 'fachada-simples'), 'ACM 1.50m', 'unid', 3),
  ((SELECT id FROM config.products WHERE slug = 'fachada-simples'), 'Cantoneira 3/4', 'unid', 4),
  ((SELECT id FROM config.products WHERE slug = 'fachada-simples'), 'Ilhós', 'unid', 5),
  ((SELECT id FROM config.products WHERE slug = 'fachada-simples'), 'Fita Nylon', 'unid', 6),
  ((SELECT id FROM config.products WHERE slug = 'fachada-simples'), 'Estrutura Metálica - Preço por Barra', 'unid', 7),
  ((SELECT id FROM config.products WHERE slug = 'fachada-simples'), 'Estrutura Metálica - Comprimento da Barra', 'm', 8);

-- Preços base para Fachada Simples
INSERT INTO config.base_prices (product_option_id, base_price)
VALUES
  ((SELECT id FROM config.product_options WHERE name = 'Lona' AND product_id = (SELECT id FROM config.products WHERE slug = 'fachada-simples')), 20.00),
  ((SELECT id FROM config.product_options WHERE name = 'ACM 1.22m' AND product_id = (SELECT id FROM config.products WHERE slug = 'fachada-simples')), 120.00),
  ((SELECT id FROM config.product_options WHERE name = 'ACM 1.50m' AND product_id = (SELECT id FROM config.products WHERE slug = 'fachada-simples')), 150.00),
  ((SELECT id FROM config.product_options WHERE name = 'Cantoneira 3/4' AND product_id = (SELECT id FROM config.products WHERE slug = 'fachada-simples')), 8.00),
  ((SELECT id FROM config.product_options WHERE name = 'Ilhós' AND product_id = (SELECT id FROM config.products WHERE slug = 'fachada-simples')), 3.00),
  ((SELECT id FROM config.product_options WHERE name = 'Fita Nylon' AND product_id = (SELECT id FROM config.products WHERE slug = 'fachada-simples')), 2.50),
  ((SELECT id FROM config.product_options WHERE name = 'Estrutura Metálica - Preço por Barra' AND product_id = (SELECT id FROM config.products WHERE slug = 'fachada-simples')), 34.00),
  ((SELECT id FROM config.product_options WHERE name = 'Estrutura Metálica - Comprimento da Barra' AND product_id = (SELECT id FROM config.products WHERE slug = 'fachada-simples')), 6.00);

-- Letra Caixa em PVC
INSERT INTO config.products (category_id, name, slug, unit, has_minimum_price, minimum_price, display_order)
VALUES (
  (SELECT id FROM config.product_categories WHERE slug = 'letra-caixa-pvc'),
  'Letra Caixa em PVC', 'letra-caixa-pvc', 'm²', TRUE, 20.00, 1
);

-- Opções para Letra Caixa em PVC
INSERT INTO config.product_options (product_id, name, unit, display_order)
VALUES
  ((SELECT id FROM config.products WHERE slug = 'letra-caixa-pvc'), 'Espessura 10mm', 'm²', 1),
  ((SELECT id FROM config.products WHERE slug = 'letra-caixa-pvc'), 'Espessura 15mm', 'm²', 2),
  ((SELECT id FROM config.products WHERE slug = 'letra-caixa-pvc'), 'Espessura 20mm', 'm²', 3),
  ((SELECT id FROM config.products WHERE slug = 'letra-caixa-pvc'), 'Pintura Automotiva (Opcional)', 'm²', 4),
  ((SELECT id FROM config.products WHERE slug = 'letra-caixa-pvc'), 'Fita Dupla-Face (Opcional)', 'm²', 5);

-- Preços base para Letra Caixa em PVC
INSERT INTO config.base_prices (product_option_id, base_price)
VALUES
  ((SELECT id FROM config.product_options WHERE name = 'Espessura 10mm' AND product_id = (SELECT id FROM config.products WHERE slug = 'letra-caixa-pvc')), 50.00),
  ((SELECT id FROM config.product_options WHERE name = 'Espessura 15mm' AND product_id = (SELECT id FROM config.products WHERE slug = 'letra-caixa-pvc')), 60.00),
  ((SELECT id FROM config.product_options WHERE name = 'Espessura 20mm' AND product_id = (SELECT id FROM config.products WHERE slug = 'letra-caixa-pvc')), 70.00),
  ((SELECT id FROM config.product_options WHERE name = 'Pintura Automotiva (Opcional)' AND product_id = (SELECT id FROM config.products WHERE slug = 'letra-caixa-pvc')), 15.00),
  ((SELECT id FROM config.product_options WHERE name = 'Fita Dupla-Face (Opcional)' AND product_id = (SELECT id FROM config.products WHERE slug = 'letra-caixa-pvc')), 5.00);

-- Vidro Temperado
INSERT INTO config.products (category_id, name, slug, unit, has_minimum_price, minimum_price, display_order)
VALUES (
  (SELECT id FROM config.product_categories WHERE slug = 'vidro-temperado'),
  'Vidro Temperado', 'vidro-temperado', 'm²', TRUE, 20.00, 1
);

-- Opções para Vidro Temperado
INSERT INTO config.product_options (product_id, name, unit, display_order)
VALUES
  ((SELECT id FROM config.products WHERE slug = 'vidro-temperado'), 'Espessura 6mm', 'm²', 1),
  ((SELECT id FROM config.products WHERE slug = 'vidro-temperado'), 'Espessura 8mm', 'm²', 2),
  ((SELECT id FROM config.products WHERE slug = 'vidro-temperado'), 'Prolongadores', 'unid', 3);

-- Preços base para Vidro Temperado
INSERT INTO config.base_prices (product_option_id, base_price)
VALUES
  ((SELECT id FROM config.product_options WHERE name = 'Espessura 6mm' AND product_id = (SELECT id FROM config.products WHERE slug = 'vidro-temperado')), 60.00),
  ((SELECT id FROM config.product_options WHERE name = 'Espessura 8mm' AND product_id = (SELECT id FROM config.products WHERE slug = 'vidro-temperado')), 80.00),
  ((SELECT id FROM config.product_options WHERE name = 'Prolongadores' AND product_id = (SELECT id FROM config.products WHERE slug = 'vidro-temperado')), 25.00);

-- Luminoso
INSERT INTO config.products (category_id, name, slug, unit, has_minimum_price, minimum_price, display_order)
VALUES (
  (SELECT id FROM config.product_categories WHERE slug = 'luminoso'),
  'Luminoso', 'luminoso', 'm²', TRUE, 20.00, 1
);

-- Opções para Luminoso
INSERT INTO config.product_options (product_id, name, unit, display_order)
VALUES
  ((SELECT id FROM config.products WHERE slug = 'luminoso'), 'Lona', 'm²', 1),
  ((SELECT id FROM config.products WHERE slug = 'luminoso'), 'Metalon 20x20', 'unid', 2),
  ((SELECT id FROM config.products WHERE slug = 'luminoso'), 'ACM 1.22m', 'unid', 3),
  ((SELECT id FROM config.products WHERE slug = 'luminoso'), 'ACM 1.50m', 'unid', 4),
  ((SELECT id FROM config.products WHERE slug = 'luminoso'), 'Lâmpada Tubular 1,22m', 'unid', 5),
  ((SELECT id FROM config.products WHERE slug = 'luminoso'), 'Lâmpada Tubular 60cm', 'unid', 6),
  ((SELECT id FROM config.products WHERE slug = 'luminoso'), 'Módulo LED 1,7w Lente 160°', 'unid', 7),
  ((SELECT id FROM config.products WHERE slug = 'luminoso'), 'Módulo LED 1,5w Mega Lente', 'unid', 8),
  ((SELECT id FROM config.products WHERE slug = 'luminoso'), 'Fonte Chaveada 5a', 'unid', 9),
  ((SELECT id FROM config.products WHERE slug = 'luminoso'), 'Fonte Chaveada 10a', 'unid', 10),
  ((SELECT id FROM config.products WHERE slug = 'luminoso'), 'Fonte Chaveada 15a', 'unid', 11),
  ((SELECT id FROM config.products WHERE slug = 'luminoso'), 'Fonte Chaveada 20a', 'unid', 12),
  ((SELECT id FROM config.products WHERE slug = 'luminoso'), 'Fonte Chaveada 30a', 'unid', 13),
  ((SELECT id FROM config.products WHERE slug = 'luminoso'), 'Luminoso Redondo ou Oval', 'unid', 14),
  ((SELECT id FROM config.products WHERE slug = 'luminoso'), 'Estrutura Metálica - Preço por Barra', 'unid', 15),
  ((SELECT id FROM config.products WHERE slug = 'luminoso'), 'Estrutura Metálica - Comprimento da Barra', 'm', 16);

-- Preços base para Luminoso
INSERT INTO config.base_prices (product_option_id, base_price)
VALUES
  ((SELECT id FROM config.product_options WHERE name = 'Lona' AND product_id = (SELECT id FROM config.products WHERE slug = 'luminoso')), 20.00),
  ((SELECT id FROM config.product_options WHERE name = 'Metalon 20x20' AND product_id = (SELECT id FROM config.products WHERE slug = 'luminoso')), 15.00),
  ((SELECT id FROM config.product_options WHERE name = 'ACM 1.22m' AND product_id = (SELECT id FROM config.products WHERE slug = 'luminoso')), 120.00),
  ((SELECT id FROM config.product_options WHERE name = 'ACM 1.50m' AND product_id = (SELECT id FROM config.products WHERE slug = 'luminoso')), 150.00),
  ((SELECT id FROM config.product_options WHERE name = 'Lâmpada Tubular 1,22m' AND product_id = (SELECT id FROM config.products WHERE slug = 'luminoso')), 25.00),
  ((SELECT id FROM config.product_options WHERE name = 'Lâmpada Tubular 60cm' AND product_id = (SELECT id FROM config.products WHERE slug = 'luminoso')), 15.00),
  ((SELECT id FROM config.product_options WHERE name = 'Módulo LED 1,7w Lente 160°' AND product_id = (SELECT id FROM config.products WHERE slug = 'luminoso')), 8.00),
  ((SELECT id FROM config.product_options WHERE name = 'Módulo LED 1,5w Mega Lente' AND product_id = (SELECT id FROM config.products WHERE slug = 'luminoso')), 7.00),
  ((SELECT id FROM config.product_options WHERE name = 'Fonte Chaveada 5a' AND product_id = (SELECT id FROM config.products WHERE slug = 'luminoso')), 45.00),
  ((SELECT id FROM config.product_options WHERE name = 'Fonte Chaveada 10a' AND product_id = (SELECT id FROM config.products WHERE slug = 'luminoso')), 65.00),
  ((SELECT id FROM config.product_options WHERE name = 'Fonte Chaveada 15a' AND product_id = (SELECT id FROM config.products WHERE slug = 'luminoso')), 85.00),
  ((SELECT id FROM config.product_options WHERE name = 'Fonte Chaveada 20a' AND product_id = (SELECT id FROM config.products WHERE slug = 'luminoso')), 105.00),
  ((SELECT id FROM config.product_options WHERE name = 'Fonte Chaveada 30a' AND product_id = (SELECT id FROM config.products WHERE slug = 'luminoso')), 145.00),
  ((SELECT id FROM config.product_options WHERE name = 'Luminoso Redondo ou Oval' AND product_id = (SELECT id FROM config.products WHERE slug = 'luminoso')), 200.00),
  ((SELECT id FROM config.product_options WHERE name = 'Estrutura Metálica - Preço por Barra' AND product_id = (SELECT id FROM config.products WHERE slug = 'luminoso')), 34.00),
  ((SELECT id FROM config.product_options WHERE name = 'Estrutura Metálica - Comprimento da Barra' AND product_id = (SELECT id FROM config.products WHERE slug = 'luminoso')), 6.00);

-- Criar um usuário administrador inicial (se necessário)
-- Substitua 'ID_DO_USUARIO_ADMIN' pelo UUID do usuário administrador
-- INSERT INTO public.profiles (id, name, company, is_admin)
-- VALUES ('ID_DO_USUARIO_ADMIN', 'Administrador', 'Empresa', TRUE)
-- ON CONFLICT (id) DO UPDATE SET is_admin = TRUE; 