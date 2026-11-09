// Descarga las fotos de stock (Unsplash, licencia Unsplash) y las deja recortadas en WebP
// en assets/img/web/. Los originales se guardan en fuentes/ (no se sube).
// Uso: node herramientas/optimizar-imagenes.mjs   (necesita sharp; si no está instalado aquí,
// NODE_PATH=C:/Dev/16bc-site/node_modules). El origen y el autor de cada foto están en CREDITOS-IMAGENES.md.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const raiz = fileURLToPath(new URL('..', import.meta.url));
const origen = raiz + 'fuentes/';
const destino = raiz + 'assets/img/web/';
mkdirSync(origen, { recursive: true });
mkdirSync(destino, { recursive: true });

// clave: id de la foto en images.unsplash.com
const fuentes = {
  i04: '1781249144484-f5969c55e54e', i05: '1781249144237-1946dd3e0389', i06: '1781249144216-143445323087',
  i09: '1781249144368-e8e1c457482a', i10: '1781249144526-2cfd9375dc7a', i13: '1781249144182-b79f4a1d6a3a',
  i14: '1781249144509-b275faf929f1', i15: '1781249144389-4174c1164955', i17: '1781249144427-b675cf4fd2ad',
  i19: '1781249144499-b71924068997', i20: '1781249144628-532cc915c99f',
  jb2: '1781888679143-01d758aedbe6', w5: '1505798577917-a65157d3320a', pl3: '1619531703242-7a0eaf09839c',
  x7: '1784651859318-d9300849bf34', ky3: '1758523671893-0ba21cf4260f', t3: '1755288556795-711618bfca4e',
  d2: '1585412727096-409979b24724', h1: '1706808849777-96e0d7be3bb7', y5: '1678762200388-51e11225d4de',
  ky1: '1741156386380-0236c72eb6f9', y8: '1736182615481-3795ea557614', x5: '1758523417356-3171f06a32b6',
};

// a: archivo de salida; ancho × alto final; pos: punto que se conserva al recortar; boceto: versión dibujada
const fotos = [
  // Portada (apartamento Nogal)
  { de: 'i14', a: 'portada-cocina', w: 1080, h: 790 },
  { de: 'i04', a: 'portada-sala', w: 1080, h: 790 },
  { de: 'i06', a: 'portada-bano', w: 1080, h: 790, y: .55 },
  // Nosotros y servicios
  { de: 'jb2', a: 'fundadora', w: 880, h: 1100, x: .5, y: .2 },
  { de: 'w5', a: 'taller', w: 720, h: 900, pos: 'left' },
  // Proceso: la reunión del presupuesto
  { de: 'pl3', a: 'asesoria', w: 900, h: 900 },
  // Del diseño a la obra: el boceto sale de la misma foto
  { de: 'i09', a: 'diseno-sala', w: 1080, h: 618, boceto: true },
  { de: 'i09', a: 'obra-sala', w: 1080, h: 618 },
  { de: 'i19', a: 'diseno-bano', w: 1080, h: 618, y: .62, boceto: true },
  { de: 'i19', a: 'obra-bano', w: 1080, h: 618, y: .62 },
  // Proyectos (3:5)
  { de: 'i17', a: 'p-cocina', w: 600, h: 1000, x: .3 },
  { de: 'i06', a: 'p-bano', w: 600, h: 1000, y: .7 },
  { de: 'x7', a: 'p-closet', w: 600, h: 1000, x: .52 },
  { de: 'ky3', a: 'p-entrega', w: 600, h: 1000, x: .5 },
  { de: 't3', a: 'p-mueble', w: 600, h: 1000, x: .12 },
  { de: 'd2', a: 'p-puerta', w: 600, h: 1000, pos: 'right' },
  { de: 'h1', a: 'p-casa', w: 600, h: 1000 },
  { de: 'y5', a: 'p-interior', w: 600, h: 1000 },
  // Página del proyecto Nogal: portada ancha, galería (4:5) y entrega
  { de: 'i15', a: 'nogal-portada', w: 1080, h: 608 },
  { de: 'i05', a: 'nogal-g-cocina', w: 720, h: 900, x: .45 },
  { de: 'i17', a: 'nogal-g-isla', w: 720, h: 900, x: .35 },
  { de: 'i13', a: 'nogal-g-closet', w: 720, h: 900 },
  { de: 'i19', a: 'nogal-g-ducha', w: 720, h: 900, y: .6 },
  { de: 'i10', a: 'nogal-g-bano', w: 720, h: 900, y: .6 },
  { de: 'i20', a: 'nogal-g-sala', w: 720, h: 900, x: .45 },
  { de: 'ky1', a: 'nogal-llaves', w: 720, h: 900 },
  { de: 'y8', a: 'nogal-obra', w: 512, h: 640 },
  { de: 'x5', a: 'nogal-clientes', w: 720, h: 900 },
];

async function bajar(clave) {
  const archivo = origen + clave + '.jpg';
  if (!existsSync(archivo)) {
    const r = await fetch(`https://images.unsplash.com/photo-${fuentes[clave]}?w=2000&q=85&fm=jpg`);
    writeFileSync(archivo, Buffer.from(await r.arrayBuffer()));
  }
  return archivo;
}

// Recorte tipo «cover» con punto propio: x e y van de 0 (izquierda/arriba) a 1 (derecha/abajo)
async function recortar(archivo, f) {
  if (f.x === undefined && f.y === undefined) return sharp(archivo).resize(f.w, f.h, { fit: 'cover', position: f.pos || 'attention' });
  const m = await sharp(archivo).metadata();
  const k = Math.max(f.w / m.width, f.h / m.height);
  const rw = Math.round(m.width * k), rh = Math.round(m.height * k);
  const left = Math.round((rw - f.w) * (f.x ?? .5)), top = Math.round((rh - f.h) * (f.y ?? .5));
  const buf = await sharp(archivo).resize(rw, rh).extract({ left, top, width: f.w, height: f.h }).toBuffer();
  return sharp(buf);
}

// Boceto: bordes (Sobel) sobre un lavado claro de la foto, en tinta azul grisácea
async function boceto(archivo, f) {
  const base = sharp(await (await recortar(archivo, f)).png().toBuffer());
  const { data, info } = await base.clone().greyscale().blur(1.4).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, o = Buffer.alloc(W * H);
  const g = (x, y) => data[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const gx = -g(x-1,y-1) - 2*g(x-1,y) - g(x-1,y+1) + g(x+1,y-1) + 2*g(x+1,y) + g(x+1,y+1);
    const gy = -g(x-1,y-1) - 2*g(x,y-1) - g(x+1,y-1) + g(x-1,y+1) + 2*g(x,y+1) + g(x+1,y+1);
    const m = Math.min(255, Math.hypot(gx, gy) * 1.5);
    o[y * W + x] = 255 - (m < 40 ? 0 : m);
  }
  const lineas = await sharp(o, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
  const lavado = await base.clone().modulate({ saturation: 0.45, brightness: 1.25 }).blur(6).linear(0.35, 165).png().toBuffer();
  return sharp(lavado).composite([{ input: lineas, blend: 'multiply' }]).tint({ r: 70, g: 92, b: 110 });
}

for (const f of fotos) {
  const archivo = await bajar(f.de);
  const img = f.boceto ? await boceto(archivo, f) : await recortar(archivo, f);
  await img.webp({ quality: 76 }).toFile(destino + f.a + '.webp');
  console.log(f.a);
}
