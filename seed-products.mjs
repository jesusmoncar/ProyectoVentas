/**
 * Seed 20 productos de ropa con fotos reales desde Unsplash.
 * Requiere Node.js 18+ (fetch nativo).
 *
 * Uso:
 *   1. Cambia ADMIN_EMAIL y ADMIN_PASSWORD por los de tu cuenta admin
 *   2. node seed-products.mjs
 */

const BASE_URL   = 'http://localhost:8080/api';
const ADMIN_EMAIL    = 'marinaj@test.com';   // ← cambia esto
const ADMIN_PASSWORD = 'Amorcito123'; // ← cambia esto

// ─────────────────────────────────────────────
// Catálogo de 20 productos de ropa
// ─────────────────────────────────────────────
const PRODUCTS = [
  {
    name: 'Camiseta Básica Blanca',
    description: 'Camiseta de algodón 100% con corte clásico. Suave, transpirable y perfecta para el día a día.',
    basePrice: 24.99,
    variants: [
      { color: 'Blanco', size: 'XS', stock: 15 },
      { color: 'Blanco', size: 'S',  stock: 20 },
      { color: 'Blanco', size: 'M',  stock: 25 },
      { color: 'Blanco', size: 'L',  stock: 20 },
      { color: 'Blanco', size: 'XL', stock: 10 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&auto=format&fit=crop',
  },
  {
    name: 'Camiseta Oversize Negra',
    description: 'Camiseta oversize de algodón grueso con caída perfecta. Estilo urbano y cómodo.',
    basePrice: 34.99,
    variants: [
      { color: 'Negro', size: 'S',  stock: 18 },
      { color: 'Negro', size: 'M',  stock: 22 },
      { color: 'Negro', size: 'L',  stock: 20 },
      { color: 'Negro', size: 'XL', stock: 15 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=700&auto=format&fit=crop',
  },
  {
    name: 'Camisa Oxford Azul',
    description: 'Camisa oxford de manga larga con tejido resistente. Ideal para looks smart casual.',
    basePrice: 49.99,
    variants: [
      { color: 'Azul', size: 'S',  stock: 12 },
      { color: 'Azul', size: 'M',  stock: 18 },
      { color: 'Azul', size: 'L',  stock: 16 },
      { color: 'Azul', size: 'XL', stock: 10 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1598033970596-212279e463c8?w=700&auto=format&fit=crop',
  },
  {
    name: 'Camisa de Franela Cuadros',
    description: 'Camisa de franela a cuadros con tejido suave y cálido. Perfecta para otoño e invierno.',
    basePrice: 44.99,
    variants: [
      { color: 'Rojo/Negro', size: 'S',  stock: 14 },
      { color: 'Rojo/Negro', size: 'M',  stock: 20 },
      { color: 'Rojo/Negro', size: 'L',  stock: 18 },
      { color: 'Rojo/Negro', size: 'XL', stock: 12 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689f?w=700&auto=format&fit=crop',
  },
  {
    name: 'Jersey de Punto Gris',
    description: 'Jersey de punto fino con cuello redondo. Tejido suave y abrigado para los días fríos.',
    basePrice: 59.99,
    variants: [
      { color: 'Gris', size: 'S',   stock: 10 },
      { color: 'Gris', size: 'M',   stock: 15 },
      { color: 'Gris', size: 'L',   stock: 14 },
      { color: 'Gris', size: 'XL',  stock: 8  },
      { color: 'Navy', size: 'M',   stock: 12 },
      { color: 'Navy', size: 'L',   stock: 10 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=700&auto=format&fit=crop',
  },
  {
    name: 'Sudadera con Capucha',
    description: 'Hoodie unisex de felpa interior. Bolsillo canguro y cordón ajustable. Básico de temporada.',
    basePrice: 54.99,
    variants: [
      { color: 'Gris', size: 'S',  stock: 20 },
      { color: 'Gris', size: 'M',  stock: 25 },
      { color: 'Gris', size: 'L',  stock: 22 },
      { color: 'Negro', size: 'M', stock: 20 },
      { color: 'Negro', size: 'L', stock: 18 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=700&auto=format&fit=crop',
  },
  {
    name: 'Sudadera Crewneck Beige',
    description: 'Sudadera sin capucha de algodón grueso. Corte relajado y minimal, fácil de combinar.',
    basePrice: 49.99,
    variants: [
      { color: 'Beige', size: 'XS', stock: 10 },
      { color: 'Beige', size: 'S',  stock: 15 },
      { color: 'Beige', size: 'M',  stock: 18 },
      { color: 'Beige', size: 'L',  stock: 14 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1620799139507-2a3efc5845b8?w=700&auto=format&fit=crop',
  },
  {
    name: 'Vaquero Slim Fit Azul',
    description: 'Pantalón vaquero slim de denim elástico. Sienta bien y permite libertad de movimiento.',
    basePrice: 69.99,
    variants: [
      { color: 'Azul claro', size: '28', stock: 12 },
      { color: 'Azul claro', size: '30', stock: 18 },
      { color: 'Azul claro', size: '32', stock: 20 },
      { color: 'Azul claro', size: '34', stock: 15 },
      { color: 'Azul oscuro', size: '30', stock: 14 },
      { color: 'Azul oscuro', size: '32', stock: 16 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=700&auto=format&fit=crop',
  },
  {
    name: 'Vaquero Mom Fit',
    description: 'Jean mom de tiro alto con lavado vintage. Silueta relajada y con mucho estilo.',
    basePrice: 74.99,
    variants: [
      { color: 'Azul lavado', size: '36', stock: 10 },
      { color: 'Azul lavado', size: '38', stock: 14 },
      { color: 'Azul lavado', size: '40', stock: 12 },
      { color: 'Blanco roto', size: '36', stock: 8  },
      { color: 'Blanco roto', size: '38', stock: 10 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&auto=format&fit=crop',
  },
  {
    name: 'Pantalón Chino Beige',
    description: 'Pantalón chino de sarga con corte recto. Elegante y versátil, ideal para oficina o salir.',
    basePrice: 64.99,
    variants: [
      { color: 'Beige', size: '28', stock: 12 },
      { color: 'Beige', size: '30', stock: 16 },
      { color: 'Beige', size: '32', stock: 14 },
      { color: 'Verde caqui', size: '30', stock: 10 },
      { color: 'Verde caqui', size: '32', stock: 12 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=700&auto=format&fit=crop',
  },
  {
    name: 'Chaqueta Vaquera Clásica',
    description: 'Chaqueta vaquera de denim rígido con botones metálicos. Un básico atemporal del armario.',
    basePrice: 89.99,
    variants: [
      { color: 'Azul medio', size: 'S',  stock: 10 },
      { color: 'Azul medio', size: 'M',  stock: 14 },
      { color: 'Azul medio', size: 'L',  stock: 12 },
      { color: 'Azul oscuro', size: 'M', stock: 10 },
      { color: 'Azul oscuro', size: 'L', stock: 8  },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=700&auto=format&fit=crop',
  },
  {
    name: 'Cazadora Bomber Verde',
    description: 'Bomber de nylon con forro satinado y puños en rib. Estilo noventero y muy actual.',
    basePrice: 99.99,
    variants: [
      { color: 'Verde oliva', size: 'S',  stock: 8  },
      { color: 'Verde oliva', size: 'M',  stock: 12 },
      { color: 'Verde oliva', size: 'L',  stock: 10 },
      { color: 'Negro',       size: 'M',  stock: 10 },
      { color: 'Negro',       size: 'L',  stock: 8  },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&auto=format&fit=crop',
  },
  {
    name: 'Abrigo Largo Camel',
    description: 'Abrigo largo de lana con solapa sastre. Elegante y abrigado para los días más fríos.',
    basePrice: 149.99,
    variants: [
      { color: 'Camel', size: 'XS', stock: 6  },
      { color: 'Camel', size: 'S',  stock: 10 },
      { color: 'Camel', size: 'M',  stock: 12 },
      { color: 'Camel', size: 'L',  stock: 8  },
      { color: 'Negro', size: 'S',  stock: 8  },
      { color: 'Negro', size: 'M',  stock: 10 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1539533113208-f19d8bb05d7b?w=700&auto=format&fit=crop',
  },
  {
    name: 'Parka Impermeable Khaki',
    description: 'Parka con relleno sintético y capucha desmontable. Resistente al viento y al agua.',
    basePrice: 129.99,
    variants: [
      { color: 'Khaki',  size: 'S',  stock: 8  },
      { color: 'Khaki',  size: 'M',  stock: 12 },
      { color: 'Khaki',  size: 'L',  stock: 10 },
      { color: 'Negro',  size: 'M',  stock: 10 },
      { color: 'Negro',  size: 'L',  stock: 8  },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1547624643-5bf80a0a6a25?w=700&auto=format&fit=crop',
  },
  {
    name: 'Vestido Floral Verano',
    description: 'Vestido midi con estampado floral y escote en V. Tejido ligero perfecto para el verano.',
    basePrice: 79.99,
    variants: [
      { color: 'Floral azul', size: 'XS', stock: 8  },
      { color: 'Floral azul', size: 'S',  stock: 12 },
      { color: 'Floral azul', size: 'M',  stock: 14 },
      { color: 'Floral azul', size: 'L',  stock: 10 },
      { color: 'Floral rosa', size: 'S',  stock: 10 },
      { color: 'Floral rosa', size: 'M',  stock: 12 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9a57b9f68bae?w=700&auto=format&fit=crop',
  },
  {
    name: 'Vestido Negro Midi',
    description: 'Vestido midi negro de punto con manga larga. Elegante y versátil para cualquier ocasión.',
    basePrice: 89.99,
    variants: [
      { color: 'Negro', size: 'XS', stock: 8  },
      { color: 'Negro', size: 'S',  stock: 14 },
      { color: 'Negro', size: 'M',  stock: 16 },
      { color: 'Negro', size: 'L',  stock: 12 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=700&auto=format&fit=crop',
  },
  {
    name: 'Falda Plisada Satinada',
    description: 'Falda plisada de raso con cintura elástica. Cae perfectamente y da un toque sofisticado.',
    basePrice: 54.99,
    variants: [
      { color: 'Rosa palo', size: 'XS', stock: 10 },
      { color: 'Rosa palo', size: 'S',  stock: 14 },
      { color: 'Rosa palo', size: 'M',  stock: 12 },
      { color: 'Champán',   size: 'S',  stock: 10 },
      { color: 'Champán',   size: 'M',  stock: 8  },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5274a5c310?w=700&auto=format&fit=crop',
  },
  {
    name: 'Top Crop de Lino',
    description: 'Top corto de lino natural con escote cuadrado. Fresco y cómodo para el verano.',
    basePrice: 34.99,
    variants: [
      { color: 'Blanco',     size: 'XS', stock: 12 },
      { color: 'Blanco',     size: 'S',  stock: 16 },
      { color: 'Blanco',     size: 'M',  stock: 14 },
      { color: 'Arena',      size: 'XS', stock: 10 },
      { color: 'Arena',      size: 'S',  stock: 12 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c827a4?w=700&auto=format&fit=crop',
  },
  {
    name: 'Malla Deportiva de Cintura Alta',
    description: 'Leggings de compresión con cintura alta y tejido técnico transpirable. Ideal para deporte.',
    basePrice: 44.99,
    variants: [
      { color: 'Negro',      size: 'XS', stock: 15 },
      { color: 'Negro',      size: 'S',  stock: 20 },
      { color: 'Negro',      size: 'M',  stock: 20 },
      { color: 'Negro',      size: 'L',  stock: 15 },
      { color: 'Gris marl',  size: 'S',  stock: 14 },
      { color: 'Gris marl',  size: 'M',  stock: 12 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=700&auto=format&fit=crop',
  },
  {
    name: 'Zapatillas Blancas Minimalistas',
    description: 'Sneakers de cuero sintético con suela de goma. Diseño clean y atemporal que combina con todo.',
    basePrice: 79.99,
    variants: [
      { color: 'Blanco', size: '36', stock: 8  },
      { color: 'Blanco', size: '37', stock: 10 },
      { color: 'Blanco', size: '38', stock: 12 },
      { color: 'Blanco', size: '39', stock: 14 },
      { color: 'Blanco', size: '40', stock: 12 },
      { color: 'Blanco', size: '41', stock: 10 },
      { color: 'Blanco', size: '42', stock: 8  },
      { color: 'Blanco', size: '43', stock: 6  },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop',
  },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
async function login() {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login fallido (${res.status}). Revisa ADMIN_EMAIL y ADMIN_PASSWORD`);
  const data = await res.json();
  const token = data.token ?? data.accessToken ?? data.jwt;
  if (!token) throw new Error('No se encontró el token en la respuesta: ' + JSON.stringify(data));
  return token;
}

async function createProduct(token, product) {
  const body = {
    name:        product.name,
    description: product.description,
    basePrice:   product.basePrice,
    variants:    product.variants.map(v => ({
      color:         v.color,
      size:          v.size,
      stock:         v.stock,
      priceOverride: v.priceOverride ?? null,
    })),
  };
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error creando "${product.name}" (${res.status}): ${err}`);
  }
  return res.json();
}

async function uploadImage(token, productId, imageUrl) {
  // Descargar imagen
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`No se pudo descargar la imagen: ${imageUrl}`);
  const buffer = await imgRes.arrayBuffer();
  const blob   = new Blob([buffer], { type: 'image/jpeg' });

  // Subir al backend como multipart
  const form = new FormData();
  form.append('files', blob, 'product.jpg');

  const res = await fetch(`${BASE_URL}/products/${productId}/images`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error subiendo imagen para producto ${productId} (${res.status}): ${err}`);
  }
  return res.json();
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
async function main() {
  console.log('🔐 Iniciando sesión como admin...');
  const token = await login();
  console.log('✅ Token obtenido\n');

  let ok = 0;
  let fail = 0;

  for (const [i, product] of PRODUCTS.entries()) {
    process.stdout.write(`[${i + 1}/${PRODUCTS.length}] ${product.name}... `);
    try {
      const created = await createProduct(token, product);
      await uploadImage(token, created.id, product.imageUrl);
      console.log(`✅ (id: ${created.id})`);
      ok++;
    } catch (e) {
      console.log(`❌ ${e.message}`);
      fail++;
    }
  }

  console.log(`\n🎉 Completado: ${ok} creados, ${fail} errores`);
}

main().catch(e => {
  console.error('Error fatal:', e.message);
  process.exit(1);
});
