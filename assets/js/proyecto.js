// Plomada (sitio de ejemplo): página de proyecto. Menú, revelados, diseño y obra, y visor de la galería.

// Menú: sombra al bajar y menú del teléfono
const menu = document.querySelector(".menu");
const abrir = document.querySelector(".menu-abrir");
const movil = document.getElementById("menu-movil");
addEventListener("scroll", () => menu.classList.toggle("con-sombra", scrollY > 10), { passive: true });
abrir.addEventListener("click", () => {
  const abierto = abrir.getAttribute("aria-expanded") === "true";
  abrir.setAttribute("aria-expanded", String(!abierto));
  // El menú del teléfono empieza justo debajo del encabezado (la franja de aviso lo corre hacia abajo)
  movil.style.top = menu.getBoundingClientRect().bottom + "px";
  movil.hidden = abierto;
  document.body.style.overflow = abierto ? "" : "hidden";
});
movil.addEventListener("click", (e) => {
  if (e.target.closest("a")) abrir.click();
});

// Revelados
const vistos = new IntersectionObserver((entradas) => {
  for (const e of entradas) if (e.isIntersecting) { e.target.classList.add("visible"); vistos.unobserve(e.target); }
}, { rootMargin: "0px 0px -10% 0px" });
document.querySelectorAll(".revela").forEach((el) => vistos.observe(el));

// Del render a la obra: los botones cambian de espacio
const [render, obra] = document.querySelectorAll(".par img");
const espacios = [...document.querySelectorAll(".cambio-pie button")];
espacios.forEach((b) => b.addEventListener("click", () => {
  espacios.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
  render.src = b.dataset.render;
  obra.src = b.dataset.obra;
  render.alt = b.dataset.altRender;
  obra.alt = b.dataset.altObra;
}));

// Visor de la galería: clic para ampliar, flechas para recorrer, Esc para cerrar
const visor = document.querySelector(".visor");
const grande = visor.querySelector("img");
const fotos = [...document.querySelectorAll(".galeria img")];
let indice = 0;
function mostrar(n) {
  indice = (n + fotos.length) % fotos.length;
  grande.src = fotos[indice].src;
  grande.alt = fotos[indice].alt;
}
fotos.forEach((f, i) => f.parentElement.addEventListener("click", () => { mostrar(i); visor.showModal(); }));
visor.querySelector(".visor-cerrar").addEventListener("click", () => visor.close());
visor.querySelector(".visor-ant").addEventListener("click", () => mostrar(indice - 1));
visor.querySelector(".visor-sig").addEventListener("click", () => mostrar(indice + 1));
visor.addEventListener("click", (e) => { if (e.target === visor) visor.close(); });
visor.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") mostrar(indice - 1);
  if (e.key === "ArrowRight") mostrar(indice + 1);
});
