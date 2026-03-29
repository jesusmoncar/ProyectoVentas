-- =============================================
-- SEED 30 PRODUCTOS - TIENDA_A (Moda Femenina)
-- =============================================
-- Ejecutar en PostgreSQL. Usa bloques DO para
-- manejar IDs autogenerados de forma segura.
-- =============================================

DO $$
DECLARE p_id BIGINT;
BEGIN

  -- 1. Vestido Bohemio Verano
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Vestido Bohemio Verano', 'Vestido largo con bordados florales, manga campana y escote en V. Tejido ligero 100% viscosa.', 49.90, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop', 'vestido_bohemio.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-VB-WH-S', '#FFFAF0', 'S', 12, NULL, p_id),
  ('TA-VB-WH-M', '#FFFAF0', 'M', 18, NULL, p_id),
  ('TA-VB-WH-L', '#FFFAF0', 'L', 10, NULL, p_id),
  ('TA-VB-TQ-S', '#48D1CC', 'S', 8,  NULL, p_id),
  ('TA-VB-TQ-M', '#48D1CC', 'M', 14, NULL, p_id);

  -- 2. Blusa Seda Floral
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Blusa Seda Floral', 'Blusa de seda natural con estampado floral exclusivo, lazo al cuello y manga 3/4.', 35.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop', 'blusa_seda.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-BS-PK-XS', '#FFB6C1', 'XS', 10, NULL, p_id),
  ('TA-BS-PK-S',  '#FFB6C1', 'S',  15, NULL, p_id),
  ('TA-BS-PK-M',  '#FFB6C1', 'M',  12, NULL, p_id),
  ('TA-BS-BL-S',  '#4169E1', 'S',  8,  NULL, p_id),
  ('TA-BS-BL-M',  '#4169E1', 'M',  10, NULL, p_id);

  -- 3. Falda Midi Plisada
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Falda Midi Plisada', 'Falda midi con pliegues permanentes, cintura elástica y caída perfecta. Tejido satinado.', 42.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=800&fit=crop', 'falda_midi.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-FM-BG-S',  '#F5F5DC', 'S',  14, NULL, p_id),
  ('TA-FM-BG-M',  '#F5F5DC', 'M',  18, NULL, p_id),
  ('TA-FM-BG-L',  '#F5F5DC', 'L',  10, NULL, p_id),
  ('TA-FM-BK-S',  '#1A1A1A', 'S',  16, NULL, p_id),
  ('TA-FM-BK-M',  '#1A1A1A', 'M',  20, NULL, p_id),
  ('TA-FM-BK-L',  '#1A1A1A', 'L',  12, NULL, p_id);

  -- 4. Pantalón Palazzo Fluido
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Pantalón Palazzo Fluido', 'Pantalón de pierna ancha en georgette fluido, cintura alta con lazo. Ideal para oficina o cenas.', 38.90, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop', 'palazzo.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-PP-BK-S',  '#1A1A1A', 'S',  10, NULL, p_id),
  ('TA-PP-BK-M',  '#1A1A1A', 'M',  15, NULL, p_id),
  ('TA-PP-BK-L',  '#1A1A1A', 'L',  8,  NULL, p_id),
  ('TA-PP-NV-S',  '#1C3B6E', 'S',  9,  NULL, p_id),
  ('TA-PP-NV-M',  '#1C3B6E', 'M',  12, NULL, p_id);

  -- 5. Chaqueta Denim Premium
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Chaqueta Denim Premium', 'Chaqueta vaquera de corte recto con lavado vintage, bolsillos frontales y cierre de botones.', 65.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop', 'chaqueta_denim.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-CD-LB-S',  '#6CA0DC', 'S',  8,  NULL, p_id),
  ('TA-CD-LB-M',  '#6CA0DC', 'M',  12, NULL, p_id),
  ('TA-CD-LB-L',  '#6CA0DC', 'L',  6,  NULL, p_id),
  ('TA-CD-DB-S',  '#2E4A62', 'S',  7,  NULL, p_id),
  ('TA-CD-DB-M',  '#2E4A62', 'M',  10, NULL, p_id);

  -- 6. Abrigo Lana Camel
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Abrigo Lana Camel', 'Abrigo largo de lana mezcla en tono camel, solapa notch, forro interior y corte clásico.', 119.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop', 'abrigo_lana.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-AL-CM-S',  '#C19A6B', 'S',  6,  NULL, p_id),
  ('TA-AL-CM-M',  '#C19A6B', 'M',  8,  NULL, p_id),
  ('TA-AL-CM-L',  '#C19A6B', 'L',  5,  NULL, p_id),
  ('TA-AL-BK-S',  '#1A1A1A', 'S',  4,  NULL, p_id),
  ('TA-AL-BK-M',  '#1A1A1A', 'M',  6,  NULL, p_id);

  -- 7. Jersey Canalé Acanalado
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Jersey Canalé Acanalado', 'Jersey de punto canalé elástico con cuello alto, manga larga y tejido 100% algodón peinado.', 45.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop', 'jersey_canale.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-JC-CR-S',  '#FFF8DC', 'S',  12, NULL, p_id),
  ('TA-JC-CR-M',  '#FFF8DC', 'M',  16, NULL, p_id),
  ('TA-JC-CR-L',  '#FFF8DC', 'L',  9,  NULL, p_id),
  ('TA-JC-RD-S',  '#8B0000', 'S',  8,  NULL, p_id),
  ('TA-JC-RD-M',  '#8B0000', 'M',  11, NULL, p_id),
  ('TA-JC-GR-M',  '#808080', 'M',  10, NULL, p_id);

  -- 8. Top Asimétrico
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Top Asimétrico Elástico', 'Top de punto elástico con escote asimétrico, un hombro al descubierto y acabado liso brillante.', 22.90, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop', 'top_asimetrico.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-TA-BK-XS', '#1A1A1A', 'XS', 15, NULL, p_id),
  ('TA-TA-BK-S',  '#1A1A1A', 'S',  20, NULL, p_id),
  ('TA-TA-BK-M',  '#1A1A1A', 'M',  18, NULL, p_id),
  ('TA-TA-NV-S',  '#1C3B6E', 'S',  10, NULL, p_id),
  ('TA-TA-NV-M',  '#1C3B6E', 'M',  12, NULL, p_id);

  -- 9. Mono Verano Lino
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Mono Verano Lino', 'Mono de lino con pantalón wide-leg, cuello halter anudado y espalda descubierta. Corte relajado.', 55.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop', 'mono_lino.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-ML-WH-S',  '#F8F8FF', 'S',  8,  NULL, p_id),
  ('TA-ML-WH-M',  '#F8F8FF', 'M',  10, NULL, p_id),
  ('TA-ML-SG-S',  '#8FBC8F', 'S',  7,  NULL, p_id),
  ('TA-ML-SG-M',  '#8FBC8F', 'M',  9,  NULL, p_id),
  ('TA-ML-TN-M',  '#D2B48C', 'M',  6,  NULL, p_id);

  -- 10. Falda Mini Tweed
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Falda Mini Tweed', 'Falda mini de tweed bouclé con forro interior, cierre lateral invisible y acabado deshilachado.', 48.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop', 'falda_tweed.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-MT-MU-XS', '#B8860B', 'XS', 9,  NULL, p_id),
  ('TA-MT-MU-S',  '#B8860B', 'S',  12, NULL, p_id),
  ('TA-MT-MU-M',  '#B8860B', 'M',  10, NULL, p_id),
  ('TA-MT-BK-S',  '#1A1A1A', 'S',  8,  NULL, p_id),
  ('TA-MT-BK-M',  '#1A1A1A', 'M',  9,  NULL, p_id);

  -- 11. Blazer Oversize Beige
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Blazer Oversize Beige', 'Blazer de corte oversize con hombreras sutiles, un botón y bolsillos con solapa. Versátil y elegante.', 79.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop', 'blazer_oversize.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-BO-BG-S',  '#F5F5DC', 'S',  7,  NULL, p_id),
  ('TA-BO-BG-M',  '#F5F5DC', 'M',  10, NULL, p_id),
  ('TA-BO-BG-L',  '#F5F5DC', 'L',  6,  NULL, p_id),
  ('TA-BO-BK-S',  '#1A1A1A', 'S',  5,  NULL, p_id),
  ('TA-BO-BK-M',  '#1A1A1A', 'M',  7,  NULL, p_id);

  -- 12. Camiseta Crop Premium
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Camiseta Crop Premium', 'Camiseta corta de algodón supima, cuello redondo, manga corta y largo crop a la cintura.', 19.90, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=800&fit=crop', 'camiseta_crop.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-CP-WH-XS', '#FFFFFF', 'XS', 20, NULL, p_id),
  ('TA-CP-WH-S',  '#FFFFFF', 'S',  25, NULL, p_id),
  ('TA-CP-WH-M',  '#FFFFFF', 'M',  20, NULL, p_id),
  ('TA-CP-BK-XS', '#1A1A1A', 'XS', 18, NULL, p_id),
  ('TA-CP-BK-S',  '#1A1A1A', 'S',  22, NULL, p_id),
  ('TA-CP-PK-S',  '#FFB6C1', 'S',  15, NULL, p_id);

  -- 13. Shorts Vaqueros Deshilachados
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Shorts Vaqueros Deshilachados', 'Shorts denim de tiro alto con efecto deshilachado en el bajo, 5 bolsillos y lavado claro.', 34.90, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&h=800&fit=crop', 'shorts_vaqueros.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-SV-LB-XS', '#B0C4DE', 'XS', 10, NULL, p_id),
  ('TA-SV-LB-S',  '#B0C4DE', 'S',  14, NULL, p_id),
  ('TA-SV-LB-M',  '#B0C4DE', 'M',  12, NULL, p_id),
  ('TA-SV-LB-L',  '#B0C4DE', 'L',  8,  NULL, p_id);

  -- 14. Vestido Cóctel Negro
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Vestido Cóctel Negro', 'Vestido de cóctel con escote corazón, falda evasé hasta la rodilla y cremallera trasera. Tejido crepe.', 89.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=800&fit=crop', 'vestido_coctel.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-VC-BK-XS', '#1A1A1A', 'XS', 5,  NULL, p_id),
  ('TA-VC-BK-S',  '#1A1A1A', 'S',  7,  NULL, p_id),
  ('TA-VC-BK-M',  '#1A1A1A', 'M',  8,  NULL, p_id),
  ('TA-VC-BK-L',  '#1A1A1A', 'L',  4,  NULL, p_id),
  ('TA-VC-NV-S',  '#1C3B6E', 'S',  6,  NULL, p_id);

  -- 15. Cardigan Mohair
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Cardigan Mohair Suave', 'Cardigan de punto mohair con brillo nacarado, botones nacarados y corte suelto. Ultra suave al tacto.', 58.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop', 'cardigan_mohair.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-CM-PK-S',  '#FFB6C1', 'S',  9,  NULL, p_id),
  ('TA-CM-PK-M',  '#FFB6C1', 'M',  11, NULL, p_id),
  ('TA-CM-LV-S',  '#E6E6FA', 'S',  8,  NULL, p_id),
  ('TA-CM-LV-M',  '#E6E6FA', 'M',  10, NULL, p_id),
  ('TA-CM-WH-M',  '#FFFAF0', 'M',  7,  NULL, p_id);

  -- 16. Leggings Supplex Premium
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Leggings Supplex Premium', 'Leggings de supplex con cintura alta moldeadora, bolsillo trasero y tecnología anti-transparencia.', 29.90, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop', 'leggings.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-LS-BK-XS', '#1A1A1A', 'XS', 20, NULL, p_id),
  ('TA-LS-BK-S',  '#1A1A1A', 'S',  25, NULL, p_id),
  ('TA-LS-BK-M',  '#1A1A1A', 'M',  22, NULL, p_id),
  ('TA-LS-BK-L',  '#1A1A1A', 'L',  15, NULL, p_id),
  ('TA-LS-NV-S',  '#1C3B6E', 'S',  12, NULL, p_id);

  -- 17. Trench Coat Clásico
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Trench Coat Clásico', 'Trench coat doble botonadura, cinturón con hebilla, hombreras y forro desmontable. Gabardina premium.', 99.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop', 'trench_coat.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-TC-CM-S',  '#C19A6B', 'S',  6,  NULL, p_id),
  ('TA-TC-CM-M',  '#C19A6B', 'M',  8,  NULL, p_id),
  ('TA-TC-CM-L',  '#C19A6B', 'L',  5,  NULL, p_id),
  ('TA-TC-BG-S',  '#F5F5DC', 'S',  5,  NULL, p_id),
  ('TA-TC-BG-M',  '#F5F5DC', 'M',  7,  NULL, p_id);

  -- 18. Blusa Bordada Étnica
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Blusa Bordada Étnica', 'Blusa de algodón con bordados multicolor a mano, cuello con ojal y mangas amplias con volante.', 39.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop', 'blusa_bordada.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-BE-WH-XS', '#FFFFFF', 'XS', 8,  NULL, p_id),
  ('TA-BE-WH-S',  '#FFFFFF', 'S',  12, NULL, p_id),
  ('TA-BE-WH-M',  '#FFFFFF', 'M',  10, NULL, p_id),
  ('TA-BE-WH-L',  '#FFFFFF', 'L',  7,  NULL, p_id);

  -- 19. Vestido Punto Midi
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Vestido Punto Midi', 'Vestido de punto acanalado con escote en V, manga larga y largo midi. Ajuste cómodo sin ser ceñido.', 52.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=600&h=800&fit=crop', 'vestido_punto.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-VP-BK-S',  '#1A1A1A', 'S',  10, NULL, p_id),
  ('TA-VP-BK-M',  '#1A1A1A', 'M',  13, NULL, p_id),
  ('TA-VP-BK-L',  '#1A1A1A', 'L',  8,  NULL, p_id),
  ('TA-VP-BR-S',  '#8B4513', 'S',  7,  NULL, p_id),
  ('TA-VP-BR-M',  '#8B4513', 'M',  9,  NULL, p_id);

  -- 20. Parka Impermeable Urbana
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Parka Impermeable Urbana', 'Parka con membrana impermeable, capucha ajustable, bolsillos con cremallera y forro polar desmontable.', 89.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop', 'parka_urbana.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-PU-KK-S',  '#6B6B3A', 'S',  7,  NULL, p_id),
  ('TA-PU-KK-M',  '#6B6B3A', 'M',  9,  NULL, p_id),
  ('TA-PU-KK-L',  '#6B6B3A', 'L',  6,  NULL, p_id),
  ('TA-PU-BK-S',  '#1A1A1A', 'S',  8,  NULL, p_id),
  ('TA-PU-BK-M',  '#1A1A1A', 'M',  10, NULL, p_id);

  -- 21. Bolso Tote Canvas
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Bolso Tote Canvas Premium', 'Tote bag de lona gruesa con asas de cuero, cremallera superior, bolsillo interior y base reforzada.', 32.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop', 'tote_canvas.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-BT-NT-U',  '#F5F5DC', 'Única', 20, NULL, p_id),
  ('TA-BT-BK-U',  '#1A1A1A', 'Única', 18, NULL, p_id),
  ('TA-BT-NV-U',  '#1C3B6E', 'Única', 12, NULL, p_id);

  -- 22. Bolso Clutch Satinado
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Bolso Clutch Satinado', 'Clutch de satén con cierre de sobre, cadena dorada desmontable y forro interior de terciopelo.', 44.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=800&fit=crop', 'clutch_satinado.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-CS-GD-U',  '#FFD700', 'Única', 10, NULL, p_id),
  ('TA-CS-SL-U',  '#C0C0C0', 'Única', 10, NULL, p_id),
  ('TA-CS-BK-U',  '#1A1A1A', 'Única', 12, NULL, p_id),
  ('TA-CS-RD-U',  '#8B0000', 'Única', 6,  NULL, p_id);

  -- 23. Mochila Cuero Vegano
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Mochila Cuero Vegano', 'Mochila de piel vegana con compartimento para portátil, bolsillos organizadores y correas acolchadas.', 69.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop', 'mochila_cuero.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-MV-BK-U',  '#1A1A1A', 'Única', 12, NULL, p_id),
  ('TA-MV-TN-U',  '#D2B48C', 'Única', 8,  NULL, p_id),
  ('TA-MV-BR-U',  '#8B4513', 'Única', 7,  NULL, p_id);

  -- 24. Cinturón Trenzado
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Cinturón Trenzado Cuero', 'Cinturón de cuero genuino trenzado, hebilla dorada rectangular. Disponible en varios largos.', 24.90, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop', 'cinturon_trenzado.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-CT-TN-S',  '#D2B48C', 'S (70-80cm)', 15, NULL, p_id),
  ('TA-CT-TN-M',  '#D2B48C', 'M (80-90cm)', 20, NULL, p_id),
  ('TA-CT-TN-L',  '#D2B48C', 'L (90-100cm)', 10, NULL, p_id),
  ('TA-CT-BK-M',  '#1A1A1A', 'M (80-90cm)', 18, NULL, p_id);

  -- 25. Pañuelo Seda Estampado
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Pañuelo Seda Estampado', 'Foulard de seda twill con estampado geométrico exclusivo, dobladillo enrollado a mano. 90x90 cm.', 18.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=800&fit=crop', 'panuelo_seda.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-PS-ML-U',  '#E8C4A0', 'Única', 25, NULL, p_id),
  ('TA-PS-AZ-U',  '#4682B4', 'Única', 20, NULL, p_id),
  ('TA-PS-RJ-U',  '#DC143C', 'Única', 15, NULL, p_id);

  -- 26. Sombrero Panamá Natural
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Sombrero Panamá Natural', 'Sombrero tejido a mano en paja toquilla, ala media y banda de grogrén intercambiable.', 49.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=800&fit=crop', 'sombrero_panama.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-SP-NT-S',  '#F5F5DC', 'S (55-56cm)', 8,  NULL, p_id),
  ('TA-SP-NT-M',  '#F5F5DC', 'M (57-58cm)', 12, NULL, p_id),
  ('TA-SP-NT-L',  '#F5F5DC', 'L (59-60cm)', 6,  NULL, p_id);

  -- 27. Gafas Sol Retro Oversized
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Gafas Sol Retro Oversized', 'Gafas de sol estilo retro con montura oversized de acetato, lentes polarizadas y protección UV400.', 34.90, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop', 'gafas_retro.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-GS-BK-U',  '#1A1A1A', 'Única', 20, NULL, p_id),
  ('TA-GS-TT-U',  '#8B4513', 'Única', 15, NULL, p_id),
  ('TA-GS-TR-U',  '#C0C0C0', 'Única', 12, NULL, p_id);

  -- 28. Collar Perlas Naturales
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Collar Perlas Naturales', 'Collar de perlas cultivadas de agua dulce, cierre de plata 925, largo regulable 40-45 cm.', 39.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=800&fit=crop', 'collar_perlas.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-CN-WH-U',  '#F8F8FF', 'Única', 15, NULL, p_id),
  ('TA-CN-PK-U',  '#FFB6C1', 'Única', 10, NULL, p_id),
  ('TA-CN-GR-U',  '#808080', 'Única', 8,  NULL, p_id);

  -- 29. Pendientes Aro Dorado
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Pendientes Aro Dorado', 'Pendientes de aro en baño de oro 18k sobre plata, acabado liso satinado. Diámetro 4 cm.', 19.90, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=800&fit=crop', 'pendientes_aro.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-PA-GD-S',  '#FFD700', 'S (2cm)', 30, NULL, p_id),
  ('TA-PA-GD-M',  '#FFD700', 'M (4cm)', 25, NULL, p_id),
  ('TA-PA-GD-L',  '#FFD700', 'L (6cm)', 20, NULL, p_id),
  ('TA-PA-SL-M',  '#C0C0C0', 'M (4cm)', 18, NULL, p_id);

  -- 30. Bufanda Cashmere
  INSERT INTO products (name, description, base_price, page_code)
  VALUES ('Bufanda Cashmere Premium', 'Bufanda de cashmere puro grado A, tejido liso suave, flecos en los extremos. 200x70 cm.', 65.00, 'tienda_a')
  RETURNING id INTO p_id;
  INSERT INTO product_images (url, filename, product_id) VALUES
  ('https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=800&fit=crop', 'bufanda_cashmere.jpg', p_id);
  INSERT INTO product_variants (sku, color, size, stock, price_override, product_id) VALUES
  ('TA-BC-CM-U',  '#C19A6B', 'Única', 10, NULL, p_id),
  ('TA-BC-GR-U',  '#808080', 'Única', 10, NULL, p_id),
  ('TA-BC-NV-U',  '#1C3B6E', 'Única', 8,  NULL, p_id),
  ('TA-BC-BK-U',  '#1A1A1A', 'Única', 7,  NULL, p_id);

END $$;