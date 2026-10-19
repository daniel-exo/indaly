// Service worker do Indaly: guarda o app e o cofre para funcionar sem internet.
const VERSAO = "indaly-v34";
const CASCA = [
  "./",
  "index.html",
  "app.css",
  "app.js",
  "vendor/age.js",
  "vendor/pdf.min.mjs",
  "vendor/pdf.worker.min.mjs",
  "manifest.webmanifest",
  "mala.json",
  "guias.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "icons/logo.svg",
  "icons/guia/aarti-cor.webp",
  "icons/guia/aarti.png",
  "icons/guia/bandeiras-cor.webp",
  "icons/guia/bandeiras.png",
  "icons/guia/brahma-cor.webp",
  "icons/guia/brahma.png",
  "icons/guia/buda-cor.webp",
  "icons/guia/buda.png",
  "icons/guia/diya-cor.webp",
  "icons/guia/diya.png",
  "icons/guia/durga-cor.webp",
  "icons/guia/durga.png",
  "icons/guia/ganesha-cor.webp",
  "icons/guia/ganesha.png",
  "icons/guia/ganga-cor.webp",
  "icons/guia/guirlanda-cor.webp",
  "icons/guia/guirlanda.png",
  "icons/guia/hanuman-cor.webp",
  "icons/guia/hanuman.png",
  "icons/guia/kali-cor.webp",
  "icons/guia/kali.png",
  "icons/guia/khanda-cor.webp",
  "icons/guia/khanda.png",
  "icons/guia/krishna-cor.webp",
  "icons/guia/krishna.png",
  "icons/guia/kumari-cor.webp",
  "icons/guia/kumari.png",
  "icons/guia/lakshmi-cor.webp",
  "icons/guia/lakshmi.png",
  "icons/guia/lingam-cor.webp",
  "icons/guia/lingam.png",
  "icons/guia/lotus-cor.webp",
  "icons/guia/lotus.png",
  "icons/guia/mudra-cor.webp",
  "icons/guia/mudra.png",
  "icons/guia/namaste-cor.webp",
  "icons/guia/namaste.png",
  "icons/guia/nandi-cor.webp",
  "icons/guia/nandi.png",
  "icons/guia/olhos-cor.webp",
  "icons/guia/olhos.png",
  "icons/guia/om-cor.webp",
  "icons/guia/om.png",
  "icons/guia/rangoli-cor.webp",
  "icons/guia/rangoli.png",
  "icons/guia/roda-cor.webp",
  "icons/guia/roda.png",
  "icons/guia/saraswati-cor.webp",
  "icons/guia/saraswati.png",
  "icons/guia/shiva-cor.webp",
  "icons/guia/shiva.png",
  "icons/guia/suastica-cor.webp",
  "icons/guia/suastica.png",
  "icons/guia/swaminarayan-cor.webp",
  "icons/guia/swaminarayan.png",
  "icons/guia/tika-cor.webp",
  "icons/guia/tika.png",
  "icons/guia/tripundra-cor.webp",
  "icons/guia/tripundra.png",
  "icons/guia/vaca-cor.webp",
  "icons/guia/vaca.png",
  "icons/guia/vajra-cor.webp",
  "icons/guia/vajra.png",
  "icons/guia/vishnu-cor.webp",
  "icons/guia/vishnu.png",
  "icons/deuses-mais.png",
  "fonts/bricolage-grotesque-latin-600-normal.woff2",
  "fonts/bricolage-grotesque-latin-800-normal.woff2",
  "fonts/instrument-sans-latin-400-normal.woff2",
  "fonts/instrument-sans-latin-600-normal.woff2",
  "fonts/jetbrains-mono-latin-400-normal.woff2",
  "fonts/jetbrains-mono-latin-600-normal.woff2",
];
const CACHE_CASCA = VERSAO + "-casca";
const CACHE_DADOS = "indaly-dados"; // sobrevive a atualizações do app

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_CASCA)
      .then((c) => Promise.all(CASCA.map((u) => fetch(u, { cache: "reload" }).then((r) => (r.ok ? c.put(u, r) : null)))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(nomes.filter((n) => n.endsWith("-casca") && n !== CACHE_CASCA).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

// Arquivos que mudam quando o roteiro é atualizado: tenta a rede primeiro.
const VIVOS = /\/(cofre\/(roteiro\.age|versao\.json|chave\.age)|cambio\.json)$/;
// Documentos trancados: nome muda quando o conteúdo muda, então podem ficar guardados para sempre.
const DOCS = /\/cofre\/d\/[0-9a-f]+\.age$/;

async function redePrimeiro(req) {
  const cache = await caches.open(CACHE_DADOS);
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(req, { cache: "no-store", signal: ctrl.signal });
    clearTimeout(t);
    if (res.ok) await cache.put(req, res.clone());
    return res;
  } catch (err) {
    const salvo = await cache.match(req);
    if (salvo) return salvo;
    throw err;
  }
}

async function cachePrimeiro(req) {
  const cache = await caches.open(CACHE_DADOS);
  const salvo = await cache.match(req);
  if (salvo) return salvo;
  const res = await fetch(req);
  if (res.ok || res.type === "opaque") await cache.put(req, res.clone());
  return res;
}

// App (html, js, css): tenta a rede primeiro para as mudanças aparecerem logo; sem rede, usa o guardado.
async function casca(req) {
  const cache = await caches.open(CACHE_CASCA);
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(req, { cache: "no-cache", signal: ctrl.signal });
    clearTimeout(t);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    return (await cache.match(req, { ignoreSearch: true })) || (await cache.match("index.html"));
  }
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.hostname.endsWith("gstatic.com") && url.pathname.startsWith("/faviconV2")) return e.respondWith(cachePrimeiro(req));
  if (url.origin !== self.location.origin) return;
  if (DOCS.test(url.pathname)) return e.respondWith(cachePrimeiro(req));
  if (VIVOS.test(url.pathname)) return e.respondWith(redePrimeiro(req));
  if (/\/(fonts|vendor|icons)\//.test(url.pathname)) return e.respondWith(caches.open(CACHE_CASCA).then(async (c) => (await c.match(req)) || fetch(req).then((r) => { if (r.ok) c.put(req, r.clone()); return r; })));
  if (req.mode === "navigate") return e.respondWith(casca(new Request("index.html")));
  e.respondWith(casca(req));
});
