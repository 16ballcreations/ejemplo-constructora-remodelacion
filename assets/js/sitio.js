// Plomada (sitio de ejemplo): portada, menú, revelados, del diseño a la obra, filtros y formulario.
const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;

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

// Portada: tres proyectos lado a lado; el índice 01·02·03 los recorre
const pista = document.querySelector(".portada-pista");
const laminas = [...pista.children];
const botones = [...document.querySelectorAll(".portada-indice button")];
let actual = 0;
let turno;
function ir(n) {
  actual = (n + laminas.length) % laminas.length;
  const ancho = laminas[0].getBoundingClientRect().width;
  pista.style.transform = `translateX(${-actual * ancho}px)`;
  laminas.forEach((l, i) => {
    l.classList.toggle("activa", i === actual);
    l.inert = i !== actual;
  });
  botones.forEach((b, i) => b.classList.toggle("activo", i === actual));
}
function programar() {
  clearInterval(turno);
  if (!reducido) turno = setInterval(() => ir(actual + 1), 6500);
}
botones.forEach((b, i) => b.addEventListener("click", () => { ir(i); programar(); }));
addEventListener("resize", () => ir(actual));
let toque = null;
pista.addEventListener("touchstart", (e) => { toque = e.touches[0].clientX; }, { passive: true });
pista.addEventListener("touchend", (e) => {
  if (toque === null) return;
  const d = e.changedTouches[0].clientX - toque;
  if (Math.abs(d) > 50) { ir(actual + (d < 0 ? 1 : -1)); programar(); }
  toque = null;
});
ir(0);
programar();

// Revelados
const vistos = new IntersectionObserver((entradas) => {
  for (const e of entradas) if (e.isIntersecting) { e.target.classList.add("visible"); vistos.unobserve(e.target); }
}, { rootMargin: "0px 0px -10% 0px" });
document.querySelectorAll(".revela").forEach((el) => vistos.observe(el));

// Cifras: cuentan desde cero
const contar = new IntersectionObserver((entradas) => {
  for (const e of entradas) {
    if (!e.isIntersecting) continue;
    contar.unobserve(e.target);
    const fin = e.target.dataset.cifra;
    const decimales = fin.includes(",") ? 1 : 0;
    const valor = parseFloat(fin.replace(",", "."));
    if (reducido) continue;
    const inicio = performance.now();
    const paso = (t) => {
      const p = Math.min(1, (t - inicio) / 1400);
      const v = valor * (1 - Math.pow(1 - p, 3));
      e.target.textContent = v.toFixed(decimales).replace(".", ",");
      if (p < 1) requestAnimationFrame(paso);
      else e.target.textContent = fin;
    };
    requestAnimationFrame(paso);
  }
}, { threshold: .6 });
document.querySelectorAll("[data-cifra]").forEach((el) => contar.observe(el));

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

// Proyectos: filtros
const filtros = [...document.querySelectorAll(".filtros button")];
filtros.forEach((b) => b.addEventListener("click", () => {
  filtros.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
  document.querySelectorAll(".tarjeta").forEach((t) => {
    t.hidden = b.dataset.filtro !== "todos" && !t.dataset.tipo.split(" ").includes(b.dataset.filtro);
  });
}));

// Formulario: arma el mensaje y abre WhatsApp
const formulario = document.querySelector(".formulario");
formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(formulario);
  const lineas = [
    `Hola, Plomada. Soy ${d.get("nombre").trim()}.`,
    `Quiero remodelar: ${d.get("espacio")}.`,
    d.get("metros") ? `Tiene unos ${d.get("metros")} m².` : "",
    d.get("zona").trim() ? `Queda en ${d.get("zona").trim()}.` : "",
    d.get("mensaje").trim(),
  ].filter(Boolean);
  window.open(`https://wa.me/?text=${encodeURIComponent(lineas.join("\n"))}`, "_blank", "noopener");
});

// Menú: marca la sección visible
const enlaces = [...document.querySelectorAll(".menu-enlaces a")];
const secciones = new IntersectionObserver((entradas) => {
  for (const e of entradas) {
    if (!e.isIntersecting) continue;
    enlaces.forEach((a) => a.classList.toggle("activo", a.getAttribute("href") === "#" + e.target.id));
  }
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => secciones.observe(s));
