-- =============================================
-- MEGA INSERT DE 20 PRODUCTOS PARA BLOOM (V4)
-- Imágenes 100% funcionales via picsum.photos
-- =============================================

-- LIMPIAR TODO PRIMERO
DELETE FROM "order_items";
DELETE FROM "product_variants";
DELETE FROM "product_images";
DELETE FROM "products";

-- Resetear secuencias
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE product_variants_id_seq RESTART WITH 1;
ALTER SEQUENCE product_images_id_seq RESTART WITH 1;

-- ============================================================
-- 1. Vestido Lino Riviera
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Vestido Lino Riviera', 'Vestido midi de lino italiano con corte fluido, perfecto para cualquier evento de verano.', 59.00);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop', 'vestido_riviera.jpg', 1);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('RIV-WH-S', '#FFFFFF', 'S', 12, NULL, 1),
('RIV-WH-M', '#FFFFFF', 'M', 18, NULL, 1),
('RIV-WH-L', '#FFFFFF', 'L', 8, NULL, 1),
('RIV-BG-S', '#F5F5DC', 'S', 6, NULL, 1),
('RIV-BG-M', '#F5F5DC', 'M', 14, NULL, 1);

-- ============================================================
-- 2. Bolso Cuero Media Luna
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Bolso Cuero Media Luna', 'Bolso de hombro en piel vegana con forma de media luna y cierre magnético.', 45.00);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop', 'bolso_luna.jpg', 2);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('LUN-BK-U', '#2C2C2C', 'Única', 20, NULL, 2),
('LUN-BN-U', '#8B4513', 'Única', 15, NULL, 2),
('LUN-BE-U', '#F5F5DC', 'Única', 10, NULL, 2);

-- ============================================================
-- 3. Camiseta Oversize Algodón
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Camiseta Oversize Cotton', 'Camiseta oversize 100% algodón orgánico con tacto ultra suave.', 24.90);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop', 'camiseta_oversize.jpg', 3);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('COT-WH-S', '#FFFFFF', 'S', 30, NULL, 3),
('COT-WH-M', '#FFFFFF', 'M', 40, NULL, 3),
('COT-WH-L', '#FFFFFF', 'L', 25, NULL, 3),
('COT-BK-S', '#1A1A1A', 'S', 20, NULL, 3),
('COT-BK-M', '#1A1A1A', 'M', 35, NULL, 3),
('COT-BK-L', '#1A1A1A', 'L', 15, NULL, 3);

-- ============================================================
-- 4. Vela Aromática Sándalo
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Vela Aromática Sándalo', 'Vela artesanal de cera de soja con esencia de sándalo y vainilla. 60h de duración.', 22.00);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=600&h=800&fit=crop', 'vela_sandalo.jpg', 4);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('VEL-CR-S', '#FFF8DC', 'Pequeña', 40, 16.00, 4),
('VEL-CR-L', '#FFF8DC', 'Grande', 25, NULL, 4);

-- ============================================================
-- 5. Gafas de Sol Cat-Eye
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Gafas Sol Cat-Eye', 'Gafas de sol polarizadas con montura retro cat-eye. Protección UV400.', 32.00);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1511499767390-a73359580bc1?w=600&h=800&fit=crop', 'gafas_cateye.jpg', 5);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('GAF-BK-U', '#1A1A1A', 'Única', 18, NULL, 5),
('GAF-TO-U', '#D2691E', 'Única', 12, NULL, 5);

-- ============================================================
-- 6. Pendientes de Aro
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Pendientes Aro Dorados', 'Pendientes de aro minimalistas con baño de oro 18k. Cierre de clip.', 19.90);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=800&fit=crop', 'pendientes_aro.jpg', 6);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('ARO-OR-S', '#FFD700', 'Pequeño', 30, 15.90, 6),
('ARO-OR-M', '#FFD700', 'Mediano', 25, NULL, 6),
('ARO-PL-M', '#C0C0C0', 'Mediano', 20, NULL, 6);

-- ============================================================
-- 7. Pantalón Cullote
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Pantalón Cullote Denim', 'Vaquero de tiro alto y pierna extra ancha. Tejido orgánico.', 42.00);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop', 'cullote_denim.jpg', 7);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('CUL-AZ-36', '#4169E1', '36', 8, NULL, 7),
('CUL-AZ-38', '#4169E1', '38', 12, NULL, 7),
('CUL-AZ-40', '#4169E1', '40', 10, NULL, 7),
('CUL-NE-38', '#1A1A1A', '38', 6, NULL, 7);

-- ============================================================
-- 8. Collar Estrella
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Collar Estrella Dorado', 'Collar delicado con colgante de estrella y cadena de 45cm ajustable.', 26.00);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1599643477193-a3a710bc9ecf?w=600&h=800&fit=crop', 'collar_estrella.jpg', 8);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('EST-OR-U', '#FFD700', '45cm', 22, NULL, 8),
('EST-PL-U', '#C0C0C0', '45cm', 18, NULL, 8);

-- ============================================================
-- 9. Blazer Oversize
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Blazer Oversize Chic', 'Blazer con hombrera y corte recto. Forro interior de satín.', 69.00);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1548142813-c348350df52b?w=600&h=800&fit=crop', 'blazer_chic.jpg', 9);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('BLZ-NG-S', '#2C2C2C', 'S', 4, NULL, 9),
('BLZ-NG-M', '#2C2C2C', 'M', 8, NULL, 9),
('BLZ-NG-L', '#2C2C2C', 'L', 3, NULL, 9),
('BLZ-BG-M', '#F5F5DC', 'M', 5, 75.00, 9);

-- ============================================================
-- 10. Set de Anillos
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Set 3 Anillos Minimal', 'Pack de 3 anillos finos ajustables en plata de ley 925.', 24.00);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=800&fit=crop', 'anillos_set.jpg', 10);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('ANI-PL-U', '#C0C0C0', 'Única', 35, NULL, 10),
('ANI-OR-U', '#FFD700', 'Única', 20, 28.00, 10);

-- ============================================================
-- 11. Sombrero de Paja
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Sombrero de Paja Riviera', 'Sombrero de ala ancha ideal para playa. Lazo de terciopelo negro.', 28.00);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600&h=800&fit=crop', 'sombrero_paja.jpg', 11);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('SOM-NA-U', '#F5DEB3', 'Única', 15, NULL, 11);

-- ============================================================
-- 12. Cuaderno Premium
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Cuaderno Premium A5', 'Cuaderno de notas con tapa dura de lino y hojas punteadas (240 págs).', 16.00);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&h=800&fit=crop', 'cuaderno_premium.jpg', 12);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('CUA-GR-A5', '#808080', 'A5', 50, NULL, 12),
('CUA-RS-A5', '#FFB6C1', 'A5', 40, NULL, 12),
('CUA-AZ-A5', '#6495ED', 'A5', 35, NULL, 12);

-- ============================================================
-- 13. Jabón Artesanal Rosa
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Jabón Artesanal Rosa', 'Jabón natural hecho en frío con aceite de rosa mosqueta y karité.', 8.90);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=600&h=800&fit=crop', 'jabon_rosa.jpg', 13);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('JAB-RS-100', '#FFB6C1', '100g', 100, NULL, 13),
('JAB-LV-100', '#E6E6FA', '100g', 80, NULL, 13);

-- ============================================================
-- 14. Jersey Punto Suave
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Jersey Punto Oversize', 'Jersey de punto grueso con cuello redondo. Mezcla de lana y cashmere.', 48.00);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop', 'jersey_punto.jpg', 14);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('JER-CR-S', '#FFF8DC', 'S', 8, NULL, 14),
('JER-CR-M', '#FFF8DC', 'M', 15, NULL, 14),
('JER-CR-L', '#FFF8DC', 'L', 6, NULL, 14),
('JER-GR-M', '#808080', 'M', 10, NULL, 14);

-- ============================================================
-- 15. Taza Cerámica Artesanal
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Taza Cerámica Artesanal', 'Taza hecha a mano con esmalte mate. Capacidad 350ml.', 14.00);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1514228742587-6b1558fbed20?w=600&h=800&fit=crop', 'taza_artesanal.jpg', 15);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('TAZ-RS-U', '#FFB6C1', '350ml', 30, NULL, 15),
('TAZ-AZ-U', '#ADD8E6', '350ml', 25, NULL, 15),
('TAZ-VR-U', '#98FB98', '350ml', 20, NULL, 15);

-- ============================================================
-- 16. Neceser Terciopelo
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Neceser Terciopelo Soft', 'Neceser de maquillaje de terciopelo con cremallera dorada.', 18.00);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=800&fit=crop', 'neceser_velvet.jpg', 16);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('NEC-RS-M', '#FFB6C1', 'M', 25, NULL, 16),
('NEC-NG-M', '#2C2C2C', 'M', 20, NULL, 16);

-- ============================================================
-- 17. Pulsera Trenzada
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Pulsera Trenzada Plata', 'Pulsera de cordón trenzado con cierre de plata de ley.', 16.50);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=800&fit=crop', 'pulsera_trenzada.jpg', 17);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('PUL-NE-U', '#2C2C2C', 'Única', 40, NULL, 17),
('PUL-MA-U', '#8B4513', 'Única', 30, NULL, 17);

-- ============================================================
-- 18. Falda Midi Satén
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Falda Midi Satén', 'Falda midi de satén con cintura elástica y caída fluida.', 36.00);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop', 'falda_saten.jpg', 18);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('FAL-CH-S', '#FFB6C1', 'S', 10, NULL, 18),
('FAL-CH-M', '#FFB6C1', 'M', 14, NULL, 18),
('FAL-NG-S', '#2C2C2C', 'S', 8, NULL, 18),
('FAL-NG-M', '#2C2C2C', 'M', 12, NULL, 18);

-- ============================================================
-- 19. Espejo de Pared Redondo
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Espejo Pared Redondo', 'Espejo decorativo redondo con marco de bambú natural. 50cm de diámetro.', 52.00);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=800&fit=crop', 'espejo_bambu.jpg', 19);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('ESP-NA-50', '#DEB887', '50cm', 6, NULL, 19);

-- ============================================================
-- 20. Lámpara de Sobremesa
-- ============================================================
INSERT INTO "products" ("name", "description", "base_price") 
VALUES ('Lámpara Sobremesa Globe', 'Lámpara esférica de cristal opal con base de madera de haya.', 58.00);

INSERT INTO "product_images" ("url", "filename", "product_id") 
VALUES ('https://images.unsplash.com/photo-1507473885765-e6ed028f8815?w=600&h=800&fit=crop', 'lampara_globe.jpg', 20);

INSERT INTO "product_variants" ("sku", "color", "size", "stock", "price_override", "product_id") VALUES 
('LAM-BL-M', '#FFFFFF', 'Mediana', 8, NULL, 20),
('LAM-BL-G', '#FFFFFF', 'Grande', 4, 72.00, 20);
