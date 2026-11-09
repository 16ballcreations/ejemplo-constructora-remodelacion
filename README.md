# Plomada Remodelaciones: sitio de ejemplo

**Sitio de ejemplo de 16 Ball Creations para constructoras de remodelación.** Sirve para enseñarle a
cualquier prospecto del rubro (remodelación de apartamentos y casas, acabados de obra gris, cocinas,
baños y carpintería) cómo se vería su web, sin mostrar el trabajo ni los datos de otro cliente.

**Plomada es una marca inventada.** La fundadora, los proyectos («Apartamento Nogal», «Arrayán»,
«Ceiba»), las cifras, los precios, las opiniones y los datos de contacto son ficticios. Las fotos son
de Unsplash, con licencia libre para uso comercial (ver [CREDITOS-IMAGENES.md](CREDITOS-IMAGENES.md)).
El sitio lo dice en una franja arriba de cada página y en el pie, y tiene `noindex, nofollow`.

Se hizo a partir de una propuesta de web real de 16BC; de ella quedan solo el diseño, la
distribución de páginas y la estructura de los textos. No conserva nombres, textos propios,
fotos, renders, proyectos, teléfonos, direcciones ni redes de ese cliente.

## Concepto: «Te entregaron media casa. Nosotros la terminamos.»

Quien remodela no busca exclusividad: quiere ver que su inversión rinde y que no habrá sorpresas.
La página muestra calidad, limpieza, objetividad y eficiencia, es decir, hacer mucho con poco. Por eso
hay precio a la vista, pagos por hitos y el diseño al lado de la obra entregada.

El nombre: la plomada es la pesa que cuelga de un hilo y marca la vertical. Es la herramienta más
sencilla de la obra y la que nunca miente. El logo es esa pesa en ocre, colgada de su hilo verde.

La distribución viene de la plantilla **Larson** (bslthemes, https://larson.bslthemes.com):
- fondo blanco y un solo color de acento;
- portada con proyectos lado a lado e índice 01·02·03;
- foto enmarcada con cita;
- servicios numerados y cifras;
- proyectos con filtros;
- testimonios en tarjetas con borde.

Se le agregaron tres bloques que pide este público: el paquete con precio, el proceso con los pagos
y la comparación del diseño con la obra entregada.

| # | Sección | Qué hace |
|---|---|---|
| 1 | Portada | Cocina, sala y baño del apartamento Nogal, con índice 01·02·03 |
| 2 | Nosotros | El porqué de Plomada y la fundadora con la esquina ocre de Larson |
| 3 | Servicios | Seis servicios numerados; el botón lleva al «del diseño a la obra» |
| 4 | Cifras | 4,9 de calificación, 140 obras, 7 años, 5 pasos |
| 5 | Paquete | Franja madera: desde $38.000.000, 45 a 60 m², lo que incluye |
| 6 | Cómo trabajamos | 5 pasos y la barra de pagos 40/40/20; foto de la revisión del presupuesto |
| 7 | Del diseño a tu casa | Dibujo y obra entregada lado a lado (sala y baño de Nogal) |
| 8 | Proyectos | Ocho tarjetas con filtros: remodelación, carpintería, diseño y render |
| 9 | Opiniones | Tres opiniones de clientes |
| 10 | Contacto | Franja verde; el formulario arma el mensaje de WhatsApp |

**Página de proyecto: `proyectos/nogal/`.** Título grande con foto ancha, el relato al lado de la
ficha, los seis cambios, diseño y obra, una galería con visor, la entrega (llaves, obra y testimonio)
y un llamado final. La portada y dos tarjetas de proyectos enlazan aquí.

**El «diseño» de la comparación** no es un render: `herramientas/optimizar-imagenes.mjs` dibuja los
bordes de la misma foto de la obra para que el par coincida. Con un cliente real se reemplaza por su
render y su foto.

## Marca

| Token | Valor | Uso |
|---|---|---|
| `--pino` | `#1d5a4c` | Color de la marca: logo, franja de contacto, íconos |
| `--profundo` | `#10302a` | Titulares, precio, franja del aviso |
| `--ocre` | `#d9822b` | El acento de Larson: la pesa del logo, cifras, números, esquinas |
| `--madera` | `#5b3d27` | Franja del paquete |
| `--beige` / `--arena` | `#cbbdb3` / `#f5f0eb` | Fondos claros |

Tipografías: Outfit (títulos y logo) y Figtree (texto), de Google Fonts.
El logo va en línea (SVG + texto) para usar Outfit; `assets/img/marca/logo.svg` es la referencia y
`assets/img/marca/plomada.svg` el isotipo (favicon).

## Datos de ejemplo

- Teléfono **300 000 0000** y correo **hola@plomada.example** (dominio reservado, no existe).
  Los botones de WhatsApp abren `wa.me` sin número: el mensaje sale armado y la persona elige a quién mandarlo.
- Dirección: «Sala de muestras · Dirección de ejemplo». Ciudad: ninguna; el texto dice «toda la ciudad
  y los municipios cercanos», para que sirva en cualquier lugar de Colombia.
- Redes: los íconos del pie no llevan a ninguna cuenta.

Para personalizarlo para un prospecto: cambiar nombre y logo, tokens de `marca.css`, textos, cifras,
precio, fotos (repetir `optimizar-imagenes.mjs` con las suyas) y quitar la franja de aviso.

## Archivos

| Ruta | Qué es |
|---|---|
| `index.html` | La página |
| `proyectos/nogal/index.html` | Página del proyecto Nogal |
| `assets/css/marca.css` | Tokens de color y tipografía |
| `assets/css/sitio.css` | Estilos de la página (incluye logo y franja de aviso) |
| `assets/css/proyecto.css`, `assets/js/proyecto.js` | Estilos y comportamiento de las páginas de proyecto (visor de la galería incluido) |
| `assets/js/sitio.js` | Portada, menú, revelados, cifras, diseño/obra, filtros y formulario |
| `assets/img/marca/` | Logo e isotipo en SVG |
| `assets/img/web/` | Fotos recortadas en WebP |
| `CREDITOS-IMAGENES.md` | Origen, autor y licencia de cada foto |
| `herramientas/servir.mjs` | Servidor local: `node herramientas/servir.mjs 4340` |
| `herramientas/optimizar-imagenes.mjs` | Descarga las fotos de Unsplash a `fuentes/` y las recorta hacia `assets/img/web/` (necesita `sharp`) |

`fuentes/` (los originales) no se sube.
