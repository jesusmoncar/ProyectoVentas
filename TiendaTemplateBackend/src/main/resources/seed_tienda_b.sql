-- =============================================
-- SEED 30 PRODUCTOS - TIENDA_B (Streetwear & Sport Masculino)
-- =============================================
-- Ejecutar en PostgreSQL. Usa bloques DO para
-- manejar IDs autogenerados de forma segura.
-- =============================================

DO $$
DECLARE p_id BIGINT;
BEGIN

  -- 1. Sudadera Hoodie Premium
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Sudadera Hoodie Premium', 'Hoodie de felpa francesa 380g con capucha doble capa, bolsillo canguro y puños acanalados.', 55.00, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=800&fit=crop', 'hoodie_premium.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-HP-BK-S',  '#1A1A1A', 'S',  15, NULL, p_id),
  ('TB-HP-BK-M',  '#1A1A1A', 'M',  20, NULL, p_id),
  ('TB-HP-BK-L',  '#1A1A1A', 'L',  18, NULL, p_id),
  ('TB-HP-BK-XL', '#1A1A1A', 'XL', 12, NULL, p_id),
  ('TB-HP-GR-M',  '#808080', 'M',  16, NULL, p_id),
  ('TB-HP-GR-L',  '#808080', 'L',  14, NULL, p_id);

  -- 2. Camiseta Gráfica Vintage
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Camiseta Gráfica Vintage', 'Camiseta de algodón lavado con estampado gráfico vintage, cuello redondo y corte regular fit.', 24.90, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop', 'camiseta_grafica.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-CG-WH-S',  '#F5F5F5', 'S',  18, NULL, p_id),
  ('TB-CG-WH-M',  '#F5F5F5', 'M',  22, NULL, p_id),
  ('TB-CG-WH-L',  '#F5F5F5', 'L',  20, NULL, p_id),
  ('TB-CG-BK-M',  '#1A1A1A', 'M',  15, NULL, p_id),
  ('TB-CG-BK-L',  '#1A1A1A', 'L',  12, NULL, p_id);

  -- 3. Pantalón Cargo Táctico
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Pantalón Cargo Táctico', 'Cargo de algodón ripstop con 6 bolsillos con solapa, cintura elástica y bajos ajustables.', 59.00, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop', 'cargo_tactico.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-PC-KK-S',  '#6B6B3A', 'S',  8,  NULL, p_id),
  ('TB-PC-KK-M',  '#6B6B3A', 'M',  12, NULL, p_id),
  ('TB-PC-KK-L',  '#6B6B3A', 'L',  10, NULL, p_id),
  ('TB-PC-KK-XL', '#6B6B3A', 'XL', 6,  NULL, p_id),
  ('TB-PC-BK-M',  '#1A1A1A', 'M',  10, NULL, p_id),
  ('TB-PC-BK-L',  '#1A1A1A', 'L',  8,  NULL, p_id);

  -- 4. Chaqueta Bomber Nylon
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Chaqueta Bomber Nylon', 'Bomber de nylon ligero con forro de punto a rayas, bolsillos laterales y cuello elástico.', 79.00, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=800&fit=crop', 'bomber_nylon.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-CB-BK-S',  '#1A1A1A', 'S',  7,  NULL, p_id),
  ('TB-CB-BK-M',  '#1A1A1A', 'M',  10, NULL, p_id),
  ('TB-CB-BK-L',  '#1A1A1A', 'L',  8,  NULL, p_id),
  ('TB-CB-OL-M',  '#556B2F', 'M',  8,  NULL, p_id),
  ('TB-CB-OL-L',  '#556B2F', 'L',  6,  NULL, p_id);

  -- 5. Vaquero Slim Stretch
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Vaquero Slim Stretch', 'Jeans slim fit con tejido denim elástico 2% elastano, lavado oscuro y 5 bolsillos clásicos.', 64.90, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop', 'vaquero_slim.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-VS-DB-28', '#1C2D4A', '28', 8,  NULL, p_id),
  ('TB-VS-DB-30', '#1C2D4A', '30', 12, NULL, p_id),
  ('TB-VS-DB-32', '#1C2D4A', '32', 15, NULL, p_id),
  ('TB-VS-DB-34', '#1C2D4A', '34', 10, NULL, p_id),
  ('TB-VS-LB-30', '#4A6FA5', '30', 8,  NULL, p_id),
  ('TB-VS-LB-32', '#4A6FA5', '32', 10, NULL, p_id);

  -- 6. Chándal Completo
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Chándal Completo Tech', 'Set chaqueta + pantalón en tejido técnico moisture-wicking, bolsillos con cremallera y corte slim.', 89.00, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&h=800&fit=crop', 'chandal_completo.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-CH-BK-S',  '#1A1A1A', 'S',  8,  NULL, p_id),
  ('TB-CH-BK-M',  '#1A1A1A', 'M',  12, NULL, p_id),
  ('TB-CH-BK-L',  '#1A1A1A', 'L',  10, NULL, p_id),
  ('TB-CH-NV-M',  '#1C3B6E', 'M',  9,  NULL, p_id),
  ('TB-CH-NV-L',  '#1C3B6E', 'L',  7,  NULL, p_id);

  -- 7. Polo Piqué Classic
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Polo Piqué Classic', 'Polo de piqué 100% algodón peinado, cuello y bocamangas acanalados, botones nácar. Corte regular.', 34.90, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&h=800&fit=crop', 'polo_pique.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-PP-WH-S',  '#FFFFFF', 'S',  15, NULL, p_id),
  ('TB-PP-WH-M',  '#FFFFFF', 'M',  20, NULL, p_id),
  ('TB-PP-WH-L',  '#FFFFFF', 'L',  16, NULL, p_id),
  ('TB-PP-NV-M',  '#1C3B6E', 'M',  14, NULL, p_id),
  ('TB-PP-NV-L',  '#1C3B6E', 'L',  12, NULL, p_id),
  ('TB-PP-RD-M',  '#8B0000', 'M',  10, NULL, p_id);

  -- 8. Camisa Franela Cuadros
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Camisa Franela Cuadros', 'Camisa de franela de algodón con estampado de cuadros, doble bolsillo y cierre de botones.', 42.00, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&h=800&fit=crop', 'camisa_franela.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-CF-RD-S',  '#8B0000', 'S',  10, NULL, p_id),
  ('TB-CF-RD-M',  '#8B0000', 'M',  14, NULL, p_id),
  ('TB-CF-RD-L',  '#8B0000', 'L',  12, NULL, p_id),
  ('TB-CF-BL-M',  '#1C3B6E', 'M',  11, NULL, p_id),
  ('TB-CF-BL-L',  '#1C3B6E', 'L',  9,  NULL, p_id);

  -- 9. Bermudas Surf Quick-Dry
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Bermudas Surf Quick-Dry', 'Bermudas de surf en tejido quick-dry con cordón ajustable, bolsillo trasero y largo hasta la rodilla.', 29.90, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop', 'bermudas_surf.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-BS-BL-S',  '#1C3B6E', 'S',  12, NULL, p_id),
  ('TB-BS-BL-M',  '#1C3B6E', 'M',  15, NULL, p_id),
  ('TB-BS-BL-L',  '#1C3B6E', 'L',  10, NULL, p_id),
  ('TB-BS-BL-XL', '#1C3B6E', 'XL', 7,  NULL, p_id),
  ('TB-BS-TR-M',  '#40E0D0', 'M',  10, NULL, p_id);

  -- 10. Cazadora Cuero Sintético
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Cazadora Cuero Sintético', 'Cazadora biker de cuero vegano con cremallera asimétrica, bolsillos laterales y forro interior.', 99.00, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop', 'cazadora_cuero.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-CC-BK-S',  '#1A1A1A', 'S',  6,  NULL, p_id),
  ('TB-CC-BK-M',  '#1A1A1A', 'M',  8,  NULL, p_id),
  ('TB-CC-BK-L',  '#1A1A1A', 'L',  7,  NULL, p_id),
  ('TB-CC-BK-XL', '#1A1A1A', 'XL', 4,  NULL, p_id),
  ('TB-CC-BR-M',  '#4A2C0A', 'M',  6,  NULL, p_id);

  -- 11. Abrigo Overcoat Premium
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Abrigo Overcoat Premium', 'Overcoat de mezcla lana-cachemira, corte recto, solapa de pico, dos botones y bolsillos de vivo.', 139.00, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop', 'overcoat_premium.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-AO-CM-S',  '#C19A6B', 'S',  4,  NULL, p_id),
  ('TB-AO-CM-M',  '#C19A6B', 'M',  6,  NULL, p_id),
  ('TB-AO-CM-L',  '#C19A6B', 'L',  5,  NULL, p_id),
  ('TB-AO-BK-M',  '#1A1A1A', 'M',  5,  NULL, p_id),
  ('TB-AO-BK-L',  '#1A1A1A', 'L',  4,  NULL, p_id);

  -- 12. Pack Camisetas Básicas
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Pack Camisetas Básicas x3', 'Pack de 3 camisetas de algodón 180g, cuello redondo sin costuras laterales. Colores surtidos.', 34.90, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop', 'pack_camisetas.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-PB-MX-S',  '#808080', 'S',  20, NULL, p_id),
  ('TB-PB-MX-M',  '#808080', 'M',  25, NULL, p_id),
  ('TB-PB-MX-L',  '#808080', 'L',  20, NULL, p_id),
  ('TB-PB-MX-XL', '#808080', 'XL', 12, NULL, p_id);

  -- 13. Pantalón Chino Slim
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Pantalón Chino Slim', 'Chino de algodón con mínimo de elastano, corte slim tapered, cintura plana y bajos sin rematar.', 49.00, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop', 'chino_slim.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-CS-KK-30', '#C3A882', '30', 8,  NULL, p_id),
  ('TB-CS-KK-32', '#C3A882', '32', 12, NULL, p_id),
  ('TB-CS-KK-34', '#C3A882', '34', 10, NULL, p_id),
  ('TB-CS-NV-30', '#1C3B6E', '30', 7,  NULL, p_id),
  ('TB-CS-NV-32', '#1C3B6E', '32', 10, NULL, p_id),
  ('TB-CS-OL-32', '#556B2F', '32', 8,  NULL, p_id);

  -- 14. Camisa Oxford Slim Fit
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Camisa Oxford Slim Fit', 'Camisa de tejido Oxford de algodón con cuello button-down, manga larga y corte slim. Fácil plancha.', 44.90, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&h=800&fit=crop', 'camisa_oxford.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-CO-WH-S',  '#FFFFFF', 'S',  10, NULL, p_id),
  ('TB-CO-WH-M',  '#FFFFFF', 'M',  14, NULL, p_id),
  ('TB-CO-WH-L',  '#FFFFFF', 'L',  12, NULL, p_id),
  ('TB-CO-BL-M',  '#4682B4', 'M',  10, NULL, p_id),
  ('TB-CO-BL-L',  '#4682B4', 'L',  8,  NULL, p_id);

  -- 15. Sweatshirt Vintage Faded
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Sweatshirt Vintage Faded', 'Sudadera sin capucha de felpa francesa con lavado faded, costuras en contraste y logo bordado.', 49.00, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop', 'sweatshirt_vintage.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-SV-GR-S',  '#696969', 'S',  12, NULL, p_id),
  ('TB-SV-GR-M',  '#696969', 'M',  16, NULL, p_id),
  ('TB-SV-GR-L',  '#696969', 'L',  14, NULL, p_id),
  ('TB-SV-GR-XL', '#696969', 'XL', 8,  NULL, p_id),
  ('TB-SV-EC-M',  '#F5F5DC', 'M',  10, NULL, p_id);

  -- 16. Parka Técnica Impermeable
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Parka Técnica Impermeable', 'Parka con costuras selladas, membrana 10k/10k, capucha con visera, bolsillos sellados y forro polar.', 119.00, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop', 'parka_tecnica.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-PT-BK-S',  '#1A1A1A', 'S',  5,  NULL, p_id),
  ('TB-PT-BK-M',  '#1A1A1A', 'M',  7,  NULL, p_id),
  ('TB-PT-BK-L',  '#1A1A1A', 'L',  6,  NULL, p_id),
  ('TB-PT-OL-M',  '#556B2F', 'M',  6,  NULL, p_id),
  ('TB-PT-OL-L',  '#556B2F', 'L',  5,  NULL, p_id);

  -- 17. Chaleco Acolchado Ligero
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Chaleco Acolchado Ligero', 'Chaleco con relleno de plumón sintético 80g, cuello alto, bolsillos con cremallera y comprimible.', 59.00, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop', 'chaleco_acolchado.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-CA-BK-S',  '#1A1A1A', 'S',  8,  NULL, p_id),
  ('TB-CA-BK-M',  '#1A1A1A', 'M',  10, NULL, p_id),
  ('TB-CA-BK-L',  '#1A1A1A', 'L',  9,  NULL, p_id),
  ('TB-CA-NV-M',  '#1C3B6E', 'M',  8,  NULL, p_id),
  ('TB-CA-GN-M',  '#2E8B57', 'M',  6,  NULL, p_id);

  -- 18. Jersey Punto Grueso Ochos
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Jersey Punto Grueso Ochos', 'Jersey de punto cable-knit en lana merino, cuello redondo, manga larga y textura en relieve.', 62.00, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop', 'jersey_ochos.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-JO-EC-S',  '#F5F5DC', 'S',  7,  NULL, p_id),
  ('TB-JO-EC-M',  '#F5F5DC', 'M',  9,  NULL, p_id),
  ('TB-JO-EC-L',  '#F5F5DC', 'L',  7,  NULL, p_id),
  ('TB-JO-GR-M',  '#808080', 'M',  8,  NULL, p_id),
  ('TB-JO-NV-M',  '#1C3B6E', 'M',  7,  NULL, p_id);

  -- 19. Camisa Hawaiana Resort
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Camisa Hawaiana Resort', 'Camisa de corte resort en viscosa con estampado tropical, botones de coco y manga corta.', 38.90, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&h=800&fit=crop', 'camisa_hawaiana.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-CH-TR-S',  '#40E0D0', 'S',  12, NULL, p_id),
  ('TB-CH-TR-M',  '#40E0D0', 'M',  15, NULL, p_id),
  ('TB-CH-TR-L',  '#40E0D0', 'L',  10, NULL, p_id),
  ('TB-CH-OR-M',  '#FF6600', 'M',  10, NULL, p_id),
  ('TB-CH-OR-L',  '#FF6600', 'L',  8,  NULL, p_id);

  -- 20. Short Deportivo Pro
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Short Deportivo Pro', 'Short de running en tejido técnico 4-way stretch, forro interior, bolsillo trasero con cremallera.', 24.90, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop', 'short_deportivo.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-SD-BK-S',  '#1A1A1A', 'S',  20, NULL, p_id),
  ('TB-SD-BK-M',  '#1A1A1A', 'M',  25, NULL, p_id),
  ('TB-SD-BK-L',  '#1A1A1A', 'L',  20, NULL, p_id),
  ('TB-SD-NV-M',  '#1C3B6E', 'M',  15, NULL, p_id),
  ('TB-SD-GN-M',  '#2E8B57', 'M',  12, NULL, p_id);

  -- 21. Zapatillas Running Urban
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Zapatillas Running Urban', 'Zapatillas con upper de mesh transpirable, suela de EVA ligera y amortiguación de impacto.', 89.00, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop', 'zapatillas_running.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-ZR-WH-40', '#FFFFFF', '40', 6,  NULL, p_id),
  ('TB-ZR-WH-41', '#FFFFFF', '41', 8,  NULL, p_id),
  ('TB-ZR-WH-42', '#FFFFFF', '42', 10, NULL, p_id),
  ('TB-ZR-WH-43', '#FFFFFF', '43', 8,  NULL, p_id),
  ('TB-ZR-WH-44', '#FFFFFF', '44', 6,  NULL, p_id),
  ('TB-ZR-BK-42', '#1A1A1A', '42', 7,  NULL, p_id);

  -- 22. Mochila Técnica 30L
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Mochila Técnica 30L', 'Mochila de 30L con compartimento para portátil 15", panel trasero acolchado y correas ergonómicas.', 75.00, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop', 'mochila_tecnica.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-MT-BK-U',  '#1A1A1A', 'Única', 15, NULL, p_id),
  ('TB-MT-GR-U',  '#808080', 'Única', 10, NULL, p_id),
  ('TB-MT-NV-U',  '#1C3B6E', 'Única', 8,  NULL, p_id);

  -- 23. Gorra Dad Hat Vintage
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Gorra Dad Hat Vintage', 'Gorra dad hat de algodón no estructurado con cierre de hebilla metálica y bordado minimalista.', 22.90, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=800&fit=crop', 'gorra_dad_hat.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-GD-BK-U',  '#1A1A1A', 'Única', 25, NULL, p_id),
  ('TB-GD-WH-U',  '#FFFFFF', 'Única', 20, NULL, p_id),
  ('TB-GD-KK-U',  '#C3A882', 'Única', 18, NULL, p_id),
  ('TB-GD-NV-U',  '#1C3B6E', 'Única', 15, NULL, p_id);

  -- 24. Pack Calcetines Sport
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Pack Calcetines Sport x6', 'Pack de 6 pares de calcetines de running con acolchado en planta, arco de sujeción y talla única.', 19.90, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&h=800&fit=crop', 'calcetines_sport.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-KC-MX-S',  '#808080', 'S (36-40)', 30, NULL, p_id),
  ('TB-KC-MX-L',  '#808080', 'L (41-46)', 28, NULL, p_id),
  ('TB-KC-BK-S',  '#1A1A1A', 'S (36-40)', 22, NULL, p_id),
  ('TB-KC-BK-L',  '#1A1A1A', 'L (41-46)', 20, NULL, p_id);

  -- 25. Cinturón Cuero Hebilla
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Cinturón Cuero Hebilla Box', 'Cinturón de cuero plena flor con hebilla box metálica plateada, 3.5 cm de ancho.', 29.90, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop', 'cinturon_cuero.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-CIN-BK-S',  '#1A1A1A', 'S (80-90cm)', 15, NULL, p_id),
  ('TB-CIN-BK-M',  '#1A1A1A', 'M (90-100cm)', 20, NULL, p_id),
  ('TB-CIN-BK-L',  '#1A1A1A', 'L (100-110cm)', 12, NULL, p_id),
  ('TB-CIN-BR-M',  '#4A2C0A', 'M (90-100cm)', 15, NULL, p_id);

  -- 26. Riñonera Urbana Waterproof
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Riñonera Urbana Waterproof', 'Riñonera de nylon waterproof con compartimento principal y frontal, correa ajustable y uso cruzado.', 34.90, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop', 'rinonera_urbana.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-RU-BK-U',  '#1A1A1A', 'Única', 20, NULL, p_id),
  ('TB-RU-GR-U',  '#808080', 'Única', 15, NULL, p_id),
  ('TB-RU-OL-U',  '#556B2F', 'Única', 10, NULL, p_id);

  -- 27. Gafas Deportivas UV400
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Gafas Deportivas UV400', 'Gafas de sol deportivas con montura TR90 ultraligera, lentes polarizadas intercambiables y goma antideslizante.', 44.90, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop', 'gafas_sport.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-GAF-BK-U',  '#1A1A1A', 'Única', 18, NULL, p_id),
  ('TB-GAF-RD-U',  '#8B0000', 'Única', 12, NULL, p_id),
  ('TB-GAF-BL-U',  '#1C3B6E', 'Única', 10, NULL, p_id);

  -- 28. Guantes Cuero Lined
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Guantes Cuero Forrado', 'Guantes de napa de cordero con forro de seda interior, costuras invisibles y elástico en la muñeca.', 38.00, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop', 'guantes_cuero.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-GC-BK-S',  '#1A1A1A', 'S (7)', 8,  NULL, p_id),
  ('TB-GC-BK-M',  '#1A1A1A', 'M (8)', 12, NULL, p_id),
  ('TB-GC-BK-L',  '#1A1A1A', 'L (9)', 8,  NULL, p_id),
  ('TB-GC-BR-M',  '#4A2C0A', 'M (8)', 7,  NULL, p_id);

  -- 29. Bufanda Lana Merino
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Bufanda Lana Merino', 'Bufanda de lana merino extrafina, tejido liso reversible, sin costuras y acabado preshrunk. 200x30 cm.', 45.00, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=800&fit=crop', 'bufanda_merino.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-BM-GR-U',  '#808080', 'Única', 12, NULL, p_id),
  ('TB-BM-NV-U',  '#1C3B6E', 'Única', 10, NULL, p_id),
  ('TB-BM-BK-U',  '#1A1A1A', 'Única', 8,  NULL, p_id),
  ('TB-BM-CM-U',  '#C19A6B', 'Única', 7,  NULL, p_id);

  -- 30. Bandana Técnica
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Bandana Técnica Multifunción', 'Braga cuello de microfibra multifunción (12 usos), tejido UPF50+, transpirable y secado rápido.', 14.90, 'tienda_b')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?w=600&h=800&fit=crop', 'bandana_tecnica.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TB-BT-BK-U',  '#1A1A1A', 'Única', 30, NULL, p_id),
  ('TB-BT-GR-U',  '#808080', 'Única', 25, NULL, p_id),
  ('TB-BT-BL-U',  '#1C3B6E', 'Única', 20, NULL, p_id),
  ('TB-BT-OL-U',  '#556B2F', 'Única', 15, NULL, p_id);

END $$;