/**
 * Repara los productos que quedaron sin imagen.
 * Obtiene todos los productos, detecta los que no tienen imágenes
 * y les sube una foto de ropa real desde Pexels.
 */

const BASE_URL       = 'http://localhost:8080/api';
const ADMIN_EMAIL    = 'marinaj@test.com';
const ADMIN_PASSWORD = 'Amorcito123';

// Fotos de ropa reales desde Pexels (siempre accesibles sin API key)
const CLOTHING_IMAGES = [
  'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?w=700&auto=compress',
  'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?w=700&auto=compress',
  'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?w=700&auto=compress',
  'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?w=700&auto=compress',
  'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?w=700&auto=compress',
  'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?w=700&auto=compress',
  'https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg?w=700&auto=compress',
  'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?w=700&auto=compress',
  'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?w=700&auto=compress',
];

async function login() {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const data = await res.json();
  return data.token ?? data.accessToken ?? data.jwt;
}

async function getAllProducts(token) {
  const res = await fetch(`${BASE_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

async function uploadImage(token, productId, imageUrl) {
  const imgRes = await fetch(imageUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  if (!imgRes.ok) throw new Error(`No se pudo descargar: ${imageUrl} (${imgRes.status})`);
  const buffer = await imgRes.arrayBuffer();
  const blob   = new Blob([buffer], { type: 'image/jpeg' });

  const form = new FormData();
  form.append('files', blob, 'product.jpg');

  const res = await fetch(`${BASE_URL}/products/${productId}/images`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Error subiendo imagen (${res.status}): ${err}`);
  }
  return res.json();
}

async function main() {
  console.log('🔐 Iniciando sesión...');
  const token = await login();
  console.log('✅ Token obtenido\n');

  const products = await getAllProducts(token);
  const sinImagen = products.filter(p => !p.images || p.images.length === 0);

  if (sinImagen.length === 0) {
    console.log('✅ Todos los productos ya tienen imagen. Nada que reparar.');
    return;
  }

  console.log(`📦 ${sinImagen.length} productos sin imagen. Subiendo fotos...\n`);

  let ok = 0;
  for (const [i, product] of sinImagen.entries()) {
    const imageUrl = CLOTHING_IMAGES[i % CLOTHING_IMAGES.length];
    process.stdout.write(`[${i + 1}/${sinImagen.length}] "${product.name}" (id: ${product.id})... `);
    try {
      await uploadImage(token, product.id, imageUrl);
      console.log('✅');
      ok++;
    } catch (e) {
      console.log(`❌ ${e.message}`);
    }
  }

  console.log(`\n🎉 Completado: ${ok}/${sinImagen.length} imágenes subidas`);
}

main().catch(e => {
  console.error('Error fatal:', e.message);
  process.exit(1);
});
