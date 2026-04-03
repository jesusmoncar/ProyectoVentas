const COLOR_NAMES: [string, string][] = [
  ['#000000','Negro'],['#FFFFFF','Blanco'],['#808080','Gris'],['#C0C0C0','Plata'],['#D3D3D3','Gris claro'],
  ['#A9A9A9','Gris oscuro'],['#FF0000','Rojo'],['#8B0000','Rojo oscuro'],['#FF4500','Rojo naranja'],
  ['#FF6347','Tomate'],['#FF7F50','Coral'],['#FFA07A','Salmón'],['#FFA500','Naranja'],['#FF8C00','Naranja oscuro'],
  ['#FFD700','Dorado'],['#FFFF00','Amarillo'],['#9ACD32','Verde amarillo'],['#008000','Verde'],
  ['#006400','Verde oscuro'],['#90EE90','Verde claro'],['#00FF7F','Verde primavera'],['#20B2AA','Verde mar'],
  ['#008080','Verde azulado'],['#00CED1','Turquesa'],['#00FFFF','Cian'],['#87CEEB','Azul cielo'],
  ['#4169E1','Azul real'],['#0000FF','Azul'],['#000080','Azul marino'],['#191970','Azul medianoche'],
  ['#8A2BE2','Azul violeta'],['#800080','Morado'],['#EE82EE','Violeta'],['#FF00FF','Magenta'],
  ['#FF69B4','Rosa fuerte'],['#FFB6C1','Rosa claro'],['#FFC0CB','Rosa'],['#FF1493','Rosa intenso'],
  ['#A52A2A','Marrón'],['#8B4513','Marrón silla'],['#D2691E','Chocolate'],['#DEB887','Beis madera'],
  ['#F5DEB3','Trigo'],['#F5F5DC','Beis'],['#FFFACD','Crema'],['#F0E68C','Caqui claro'],
  ['#BDB76B','Caqui'],['#556B2F','Verde oliva'],['#808000','Oliva'],['#2F4F4F','Pizarra verde'],
];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function hexToColorName(hex: string): string {
  if (!hex || hex.length < 7) return '';
  const [r, g, b] = hexToRgb(hex);
  let minDist = Infinity, name = '';
  for (const [h, n] of COLOR_NAMES) {
    const [cr, cg, cb] = hexToRgb(h);
    const d = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2);
    if (d < minDist) { minDist = d; name = n; }
  }
  return name;
}

/** Si el label tiene formato "#rrggbb - Talla", reemplaza el hex por el nombre del color */
export function formatVariantLabel(label: string): string {
  if (!label) return label;
  return label.replace(/^(#[0-9a-fA-F]{6})\s*-\s*/, (_, hex) => `${hexToColorName(hex)} - `);
}
