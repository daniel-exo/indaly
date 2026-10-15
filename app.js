import { Decrypter } from "./vendor/age.js";

const VERSAO_APP = "v8";

/* ---------- utilidades ---------- */
const $app = document.getElementById("app");
const $abas = document.getElementById("abas");
const LS_CHAVE = "indaly.chave";
const LS_TEMPO = "indaly.tempo";
const LS_VERSAO = "indaly.versao";
const LS_MALA = "indaly.mala";
const lerLS = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const gravarLS = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
const apagarLS = (k) => { try { localStorage.removeItem(k); } catch {} };

const h = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const SEMANA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const SEM3 = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MESES_LONGOS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const dataDe = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
const isoDe = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
const diaCurto = (iso) => { const d = dataDe(iso); return `${SEM3[d.getDay()]} ${String(d.getDate()).padStart(2, "0")}`; };
const dataLonga = (iso) => { const d = dataDe(iso); const s = SEMANA[d.getDay()]; return `${s[0].toUpperCase() + s.slice(1)}, ${String(d.getDate()).padStart(2, "0")} de ${MESES_LONGOS[d.getMonth()]}`; };
const dataMedia = (iso) => { const d = dataDe(iso); return `${String(d.getDate()).padStart(2, "0")} ${MESES[d.getMonth()]}`; };
const diffDias = (a, b) => Math.round((dataDe(b) - dataDe(a)) / 86400000);

function hojeISO() {
  const forcado = new URLSearchParams(location.search).get("hoje");
  return forcado && /^\d{4}-\d{2}-\d{2}$/.test(forcado) ? forcado : isoDe(new Date());
}

const I = {
  seta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
  voltar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
  relogio: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  pino: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  carro: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17h14M6 17l1.5-6h9L18 17M8 11l1-4h6l1 4"/><circle cx="8" cy="18.5" r="1.5"/><circle cx="16" cy="18.5" r="1.5"/></svg>',
  porta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4h11v17M16 7h3v14M3 21h18"/><circle cx="13" cy="12.5" r="0.6"/></svg>',
  cama: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18V8M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="2"/></svg>',
  mapa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
  bilhete: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z"/><path d="M14 6v2M14 11v2M14 16v2"/></svg>',
  aviao: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 14l7-2V6.5a1.5 1.5 0 0 1 3 0V12l7 2v2l-7-1.5V18l2 1.5V21l-3.5-1L8 21v-1.5L10 18v-3.5L3 16z"/></svg>',
  trem: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="14" rx="3"/><path d="M6 11h12M9 21l1.5-4M15 21l-1.5-4"/></svg>',
  id: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M8.5 17h7"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
  alerta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l9.5 17h-19z"/><path d="M12 10v4.5M12 17.5v.01"/></svg>',
  pendente: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5M12 16.5v.01"/></svg>',
  ok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  externo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
};

const TEMPO_ICONES = {
  sol: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  parcial: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4.5V3M3.5 9H2M4.5 5.5l-1-1M12.5 5.5l1-1"/><path d="M5.2 11.5A4 4 0 1 1 12 7.6"/><path d="M7 20h10a4 4 0 0 0 0-8 5 5 0 0 0-9.6 1.5A3.3 3.3 0 0 0 7 20z"/></svg>',
  nuvem: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 19h10a4.5 4.5 0 0 0 .5-9A6 6 0 0 0 6 11.5 3.8 3.8 0 0 0 7 19z"/></svg>',
  neblina: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h16M3 13h18M5 17h14"/></svg>',
  chuva: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 15h10a4 4 0 0 0 .4-8A5.5 5.5 0 0 0 6.5 9 3.2 3.2 0 0 0 7 15z"/><path d="M9 18l-1 2.5M13 18l-1 2.5M17 18l-1 2.5"/></svg>',
  tempestade: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14h10a4 4 0 0 0 .4-8A5.5 5.5 0 0 0 6.5 8 3.2 3.2 0 0 0 7 14z"/><path d="M12.5 15l-2 3.5h3l-2 3.5"/></svg>',
  neve: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/></svg>',
};
function climaDe(cod) {
  if (cod === 0) return ["sol", "Céu limpo"];
  if (cod <= 2) return ["parcial", "Poucas nuvens"];
  if (cod === 3) return ["nuvem", "Nublado"];
  if (cod === 45 || cod === 48) return ["neblina", "Neblina"];
  if (cod >= 51 && cod <= 57) return ["chuva", "Garoa"];
  if ((cod >= 61 && cod <= 67) || (cod >= 80 && cod <= 82)) return ["chuva", "Chuva"];
  if ((cod >= 71 && cod <= 77) || cod === 85 || cod === 86) return ["neve", "Neve"];
  if (cod >= 95) return ["tempestade", "Tempestade"];
  return ["nuvem", "—"];
}

const PAISES = {
  BR: { nome: "Brasil", cor: "#14224F", tint: "#E3E6F0" },
  IT: { nome: "Itália", cor: "#0D7A48", tint: "#DDEFE5" },
  IN: { nome: "Índia", cor: "#EE8A24", tint: "#FCE7CF", claro: true },
  NP: { nome: "Nepal", cor: "#C3122F", tint: "#F8D3D9" },
};
const OURO = { nome: "Brasil", cor: "#F2C230", tint: "#FBEFC4", claro: true };

/* ---------- estado ---------- */
let R = null;
let IDENT = null;
let CAMBIO = null;
let TEMPO = (() => { try { return JSON.parse(lerLS(LS_TEMPO)) || null; } catch { return null; } })();
const OFFLINE = { total: 0, prontos: 0, terminou: false };
let cambioEstado = null;
let carteiraFiltro = "todos";

const corDia = (dia) => (dia.data === R.fim && dia.pais === "BR" ? OURO : PAISES[dia.pais]);
const idxDia = (iso) => R.dias.findIndex((d) => d.data === iso);

/* ---------- fusos ---------- */
function offsetMin(tz, quando = new Date()) {
  const p = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(quando);
  const g = (t) => Number(p.find((x) => x.type === t).value);
  const comoUTC = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute"));
  return Math.round((comoUTC - quando.getTime()) / 60000);
}
const horaEm = (tz, quando = new Date()) => new Intl.DateTimeFormat("pt-BR", { timeZone: tz, hour: "2-digit", minute: "2-digit" }).format(quando);
function difSP(tz, quando) {
  const d = offsetMin(tz, quando) - offsetMin("America/Sao_Paulo", quando);
  if (d === 0) return "mesmo horário de São Paulo";
  const a = Math.abs(d), hh = Math.floor(a / 60), mm = a % 60;
  return `${hh}h${mm ? String(mm).padStart(2, "0") : ""} ${d > 0 ? "à frente de" : "atrás de"} SP`;
}
function utcTexto(tz, quando) {
  const o = offsetMin(tz, quando), a = Math.abs(o);
  return `UTC${o >= 0 ? "+" : "−"}${Math.floor(a / 60)}${a % 60 ? ":" + String(a % 60).padStart(2, "0") : ""}`;
}

/* ---------- cofre ---------- */
async function buscarBytes(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Não consegui baixar " + url);
  return new Uint8Array(await res.arrayBuffer());
}
async function decifrar(bytes, comoTexto) {
  const d = new Decrypter();
  d.addIdentity(IDENT);
  return comoTexto ? d.decrypt(bytes, "text") : d.decrypt(bytes);
}
async function carregarRoteiro() {
  const texto = await decifrar(await buscarBytes("cofre/roteiro.age"), true);
  R = JSON.parse(texto);
  const anterior = lerLS(LS_VERSAO);
  if (anterior && anterior !== R.atualizado_em) avisar(`Roteiro atualizado em ${new Date(R.atualizado_em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}.`);
  gravarLS(LS_VERSAO, R.atualizado_em);
}
async function carregarCambio() {
  try { CAMBIO = await (await fetch("cambio.json")).json(); } catch { CAMBIO = null; }
}

async function guardarOffline() {
  if (!("caches" in window)) return;
  try {
    const v = await (await fetch("cofre/versao.json")).json();
    OFFLINE.total = v.arquivos.length;
    OFFLINE.prontos = 0;
    for (const arq of v.arquivos) {
      const ja = await caches.match(arq);
      if (!ja) { try { await fetch(arq); } catch {} }
      if (await caches.match(arq)) OFFLINE.prontos++;
      if (location.hash.startsWith("#/carteira")) atualizarEstadoCofre();
    }
  } catch {}
  OFFLINE.terminou = true;
  if (location.hash.startsWith("#/carteira")) atualizarEstadoCofre();
}

/* ---------- previsão do tempo (Open-Meteo, sem chave) ---------- */
async function atualizarTempo() {
  if (TEMPO && Date.now() - TEMPO.em < 3 * 3600 * 1000) return;
  const cidades = [];
  for (const d of R.dias) if (!cidades.find((c) => c.cidade === d.cidade)) cidades.push({ cidade: d.cidade, lat: d.lat, lon: d.lon });
  const url = "https://api.open-meteo.com/v1/forecast?latitude=" + cidades.map((c) => c.lat).join(",") +
    "&longitude=" + cidades.map((c) => c.lon).join(",") +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=16";
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    let dados = await res.json();
    if (!Array.isArray(dados)) dados = [dados];
    const porCidade = {};
    dados.forEach((d, i) => {
      const m = {};
      d.daily.time.forEach((t, j) => {
        m[t] = { cod: d.daily.weather_code[j], max: d.daily.temperature_2m_max[j], min: d.daily.temperature_2m_min[j], chuva: d.daily.precipitation_probability_max[j] };
      });
      porCidade[cidades[i].cidade] = m;
    });
    TEMPO = { em: Date.now(), porCidade };
    gravarLS(LS_TEMPO, JSON.stringify(TEMPO));
    const r = location.hash;
    if (r.startsWith("#/mais/tempo") || r.startsWith("#/dia") || r.startsWith("#/hoje") || r === "") rotear();
  } catch {}
}
/* nascer e pôr do sol, calculados no próprio celular (funciona sem internet) */
function solDoDia(iso, lat, lon) {
  if (lat == null || lon == null) return null;
  const rad = Math.PI / 180;
  const [y, m, d] = iso.split("-").map(Number);
  const J = Date.UTC(y, m - 1, d, 12) / 86400000 + 2440587.5 - 2451545 - lon / 360;
  const M = (357.5291 + 0.98560028 * J) % 360;
  const C = 1.9148 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 0.0003 * Math.sin(3 * M * rad);
  const L = (M + C + 180 + 102.9372) % 360;
  const transito = 2451545 + J + 0.0053 * Math.sin(M * rad) - 0.0069 * Math.sin(2 * L * rad);
  const sinD = Math.sin(L * rad) * Math.sin(23.4397 * rad);
  const cosW = (Math.sin(-0.833 * rad) - Math.sin(lat * rad) * sinD) / (Math.cos(lat * rad) * Math.cos(Math.asin(sinD)));
  if (cosW < -1 || cosW > 1) return null;
  const w = Math.acos(cosW) / rad / 360;
  const data = (j) => new Date((j - 2440587.5) * 86400000);
  return { nasce: data(transito - w), poe: data(transito + w) };
}
const SOL_ICONES = {
  nasce: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17a7 7 0 0 1 14 0M2 20h20M12 3v6M9 6l3-3 3 3M4.2 10.2l1.4 1.4M19.8 10.2l-1.4 1.4"/></svg>',
  poe: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17a7 7 0 0 1 14 0M2 20h20M12 3v6M9 6l3 3 3-3M4.2 10.2l1.4 1.4M19.8 10.2l-1.4 1.4"/></svg>',
};
function textoSol(dia) {
  const s = solDoDia(dia.data, dia.lat, dia.lon);
  return s ? { nasce: horaEm(dia.fuso, s.nasce), poe: horaEm(dia.fuso, s.poe) } : null;
}
function fichaSol(dia) {
  const s = textoSol(dia);
  return s ? `<span class="ficha ficha-sol" title="Nascer e pôr do sol" aria-label="Sol nasce às ${s.nasce} e se põe às ${s.poe}">${SOL_ICONES.nasce} ${s.nasce} – ${s.poe}</span>` : "";
}
const tempoDoDia = (dia) => TEMPO?.porCidade?.[dia.cidade]?.[dia.data] || null;
function fichaTempo(dia) {
  const t = tempoDoDia(dia);
  if (!t) return "";
  const [ic, txt] = climaDe(t.cod);
  return `<span class="ficha ficha-tempo" title="${h(txt)}">${TEMPO_ICONES[ic]} ${Math.round(t.max)}° / ${Math.round(t.min)}°</span>`;
}

/* ---------- visor de documentos ---------- */
const $visor = document.getElementById("visor");
const $visorCorpo = document.getElementById("visor-corpo");
const $visorTitulo = document.getElementById("visor-titulo");
const $visorAbrir = document.getElementById("visor-abrir");
const $visorComp = document.getElementById("visor-compartilhar");
let urlAtual = null;
let pdfjs = null;

function fecharVisor() {
  $visor.hidden = true;
  $visorCorpo.innerHTML = "";
  if (urlAtual) { URL.revokeObjectURL(urlAtual); urlAtual = null; }
  document.body.style.overflow = "";
}
document.getElementById("visor-fechar").addEventListener("click", fecharVisor);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$visor.hidden) fecharVisor(); });

function rotuloArquivo(nome) {
  const m = nome.match(/\((Bilhete|Recibo|recibo|Daniel|Marina)/);
  if (m) return m[1][0].toUpperCase() + m[1].slice(1);
  if (/ETA/.test(nome)) return "e-Visa";
  if (/Passage/i.test(nome)) return "Passagem";
  if (/travel_insurance/i.test(nome)) return "Apólice";
  if (/certificado_de_elegibilidade/i.test(nome)) return "Certificado";
  return "Documento";
}

async function abrirDoc(id) {
  const doc = R.docs[id];
  if (!doc || !doc.arquivo) return avisar("Esse documento ainda não está no cofre.");
  $visorTitulo.textContent = doc.titulo || doc.nome.replace(/\.[a-z]+$/i, "");
  $visorCorpo.innerHTML = '<div class="visor-msg">Abrindo o documento…</div>';
  $visorAbrir.hidden = true;
  $visorComp.hidden = true;
  $visor.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("visor-fechar").focus();
  try {
    const bytes = await decifrar(await buscarBytes(doc.arquivo));
    const blob = new Blob([bytes], { type: doc.tipo });
    urlAtual = URL.createObjectURL(blob);
    $visorAbrir.href = urlAtual;
    $visorAbrir.setAttribute("download", doc.nome);
    $visorAbrir.hidden = false;
    const arquivo = new File([blob], doc.nome, { type: doc.tipo });
    if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
      $visorComp.hidden = false;
      $visorComp.onclick = () => navigator.share({ files: [arquivo], title: doc.nome }).catch(() => {});
    }
    if (doc.tipo.startsWith("image/")) {
      $visorCorpo.innerHTML = `<img src="${urlAtual}" alt="${h(doc.nome)}">`;
      return;
    }
    if (!pdfjs) {
      pdfjs = await import("./vendor/pdf.min.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("./vendor/pdf.worker.min.mjs", import.meta.url).href;
    }
    const pdf = await pdfjs.getDocument({ data: bytes.slice() }).promise;
    $visorCorpo.innerHTML = '<div class="paginas"></div>';
    const $pag = $visorCorpo.firstChild;
    const largura = Math.min($visorCorpo.clientWidth, 900) - 16;
    for (let n = 1; n <= pdf.numPages; n++) {
      if ($visor.hidden) break;
      const pag = await pdf.getPage(n);
      const base = pag.getViewport({ scale: 1 });
      const escala = largura / base.width;
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const vp = pag.getViewport({ scale: escala * dpr });
      const c = document.createElement("canvas");
      c.width = vp.width; c.height = vp.height;
      c.style.width = largura + "px";
      c.setAttribute("aria-label", `Página ${n} de ${pdf.numPages}`);
      $pag.appendChild(c);
      await pag.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
    }
  } catch (e) {
    console.error(e);
    $visorCorpo.innerHTML = '<div class="visor-msg">Não consegui mostrar aqui. Toque em <b>Abrir</b> para ver no leitor do celular.</div>';
    if (!urlAtual) $visorCorpo.innerHTML = '<div class="visor-msg">Não consegui abrir este documento. Se estiver sem internet, ele ainda não foi guardado neste celular.</div>';
  }
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-doc]");
  if (b) { e.preventDefault(); abrirDoc(b.dataset.doc); }
});

/* ---------- avisos ---------- */
function avisar(texto, acao) {
  document.querySelector(".aviso-atualizacao")?.remove();
  const el = document.createElement("div");
  el.className = "aviso-atualizacao";
  el.setAttribute("role", "status");
  el.innerHTML = `<span>${h(texto)}</span>${acao ? `<button type="button">${h(acao.rotulo)}</button>` : ""}`;
  if (acao) el.querySelector("button").onclick = () => { el.remove(); acao.fazer(); };
  document.body.appendChild(el);
  if (!acao || acao.tempo) setTimeout(() => el.remove(), acao?.tempo || 4500);
}

/* ---------- partes reutilizadas ---------- */
const urlMapa = (q) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
function pendenciasDoDia(dia) {
  let n = dia.atividades.filter((a) => a.status === "pendente").length;
  if (dia.hospedagem?.status === "pendente") n++;
  if (dia.transporte?.status === "pendente") n++;
  return n;
}
function textoHora(a) { return a.hora || a.periodo || ""; }

function cabecalhoDia(dia, i) {
  const pais = corDia(dia);
  const ant = R.dias[i - 1], prox = R.dias[i + 1];
  const fusoFicha = dia.pais === "BR" ? "" : `<span class="ficha">${h(utcTexto(dia.fuso, dataDe(dia.data)))} · ${h(difSP(dia.fuso, dataDe(dia.data)))}</span>`;
  const transp = dia.transporte ? `<span class="ficha ${dia.transporte.status === "pendente" ? "pendente" : ""}">${h(dia.transporte.texto)}${dia.transporte.status === "pendente" ? " · a combinar" : ""}</span>` : "";
  return `
  <header class="bilhete-topo ${pais.claro ? "claro" : ""}" style="--pais:${pais.cor}">
    <div class="navdia">
      ${ant ? `<a href="#/dia/${ant.data}" aria-label="Dia anterior">${I.voltar}${h(diaCurto(ant.data))}</a>` : '<span class="vazio"></span>'}
      <span class="contador">DIA ${i + 1} / ${R.dias.length}</span>
      ${prox ? `<a href="#/dia/${prox.data}" aria-label="Próximo dia">${h(diaCurto(prox.data))}${I.seta}</a>` : '<span class="vazio"></span>'}
    </div>
    <div class="bilhete-titulo">
      <div>
        <div class="data">${h(dataLonga(dia.data))}</div>
        <h1>${h(dia.cidade)}</h1>
        ${dia.subtitulo ? `<div class="subt">${h(dia.subtitulo)}</div>` : ""}
      </div>
      <div class="carimbo" aria-hidden="true"><b>${h(dia.codigo)}</b><span>${h(pais.nome.toUpperCase())}</span></div>
    </div>
    <div class="fichas">${fichaTempo(dia)}${fichaSol(dia)}${fusoFicha}${transp}</div>
  </header>
  <div class="picote" style="--pais:${pais.cor}" aria-hidden="true"></div>`;
}

function etiquetasAtividade(a) {
  const e = [];
  if (a.status === "confirmado" && a.docs?.length) e.push(`<span class="etiqueta et-doc">${I.bilhete} ${a.docs.length > 1 ? a.docs.length + " documentos" : "Documento"}</span>`);
  else if (a.status === "confirmado") e.push(`<span class="etiqueta et-ok">${I.ok} Confirmado</span>`);
  if (a.status === "pendente") e.push(`<span class="etiqueta et-pendente">${I.pendente} ${h(a.pendencia || "Pendente")}</span>`);
  if (a.status === "na hora") e.push('<span class="etiqueta et-neutra">Ingresso na hora</span>');
  if (a.alerta) e.push(`<span class="etiqueta et-alerta">${I.alerta} ${h(a.alerta)}</span>`);
  if (a.tag) e.push(`<span class="etiqueta et-pendente">${h(a.tag)}</span>`);
  return e.length ? `<div class="etiquetas">${e.join("")}</div>` : "";
}

function linhaVoo(a) {
  const v = a.voo;
  return [v.numero, v.duracao ? v.duracao + " de voo" : "", v.chega ? "chega " + v.chega + (v.chega_dia ? " (" + v.chega_dia + ")" : "") : ""].filter(Boolean).join(" · ");
}
const chipLocalizador = (cod) => `<span class="localizador" role="button" tabindex="0" data-copiar="${h(cod)}" aria-label="Copiar localizador ${h(cod)}"><small>LOCALIZADOR</small><b>${h(cod)}</b><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg></span>`;
function cartaoVoo(a) {
  const v = a.voo;
  return `<section class="voo" aria-label="Voo ${h(v.numero)}">
    <div class="voo-topo"><span>${h(v.cia)} · <b class="mono">${h(v.numero)}</b></span>${v.duracao ? `<span>${h(v.duracao)} de voo</span>` : ""}</div>
    <div class="voo-rota">
      <div><div class="voo-cod">${h(v.de)}</div><div class="voo-hora">${h(v.sai)}</div><div class="voo-rot">saída do voo</div></div>
      <div class="voo-meio" aria-hidden="true"><i></i>${I.aviao}<i></i></div>
      <div class="dir"><div class="voo-cod">${h(v.para)}</div><div class="voo-hora">${h(v.chega || "—")}</div><div class="voo-rot">${v.chega ? "chegada" + (v.chega_dia ? " · " + h(v.chega_dia) : "") : "volta ao KTM"}</div></div>
    </div>
    <div class="voo-nota">Horário local de cada aeroporto${v.terminal ? " · " + h(v.terminal) : ""}</div>
    ${chipLocalizador(v.localizador)}
    ${(v.extra || []).map(([r, val]) => `<span class="localizador menor" role="button" tabindex="0" data-copiar="${h(val)}"><small>${h(r.toUpperCase())}</small><b>${h(val)}</b></span>`).join("")}
    ${v.app ? `<a class="botao botao-papel" href="${h(urlApp(v.app))}" ${urlApp(v.app).startsWith("intent:") ? "" : 'target="_blank" rel="noopener"'}>${logoApp(v.app, "app-logo mini")} Abrir o app da ${h(v.cia)}</a>` : ""}
  </section>`;
}
document.addEventListener("click", (e) => {
  const c = e.target.closest("[data-copiar]");
  if (!c) return;
  e.preventDefault(); e.stopPropagation();
  const t = c.dataset.copiar;
  (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => avisar(`${t} copiado.`), () => avisar("Não consegui copiar."));
}, true);
document.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.matches?.("[data-copiar]")) { e.preventDefault(); e.target.click(); }
});

function subAtividade(a) {
  if (a.voo) return linhaVoo(a);
  return [a.detalhe, a.horario, a.local].filter(Boolean)[0] || "";
}

function cartaoHospedagem(hosp, dia) {
  if (!hosp || hosp.nome === "Avião" && !hosp.endereco) return "";
  const aviao = hosp.nome === "Avião";
  const botoes = [];
  if (hosp.docs?.length) botoes.push(`<button type="button" class="botao botao-papel" data-doc="${h(hosp.docs[0])}">${I.bilhete} Reserva</button>`);
  if (!aviao && hosp.endereco && hosp.endereco !== "Casa") botoes.push(`<button type="button" class="botao botao-contorno" data-ir="${dia.data}|h">${I.carro} Ir até lá</button>`);
  if (hosp.tel) botoes.push(`<a class="botao botao-contorno" href="tel:${h(hosp.tel.replace(/\s/g, ""))}">${I.tel} Ligar</a>`);
  return `
  <section class="hospedagem-bloco" aria-label="Onde dormir">
    <div class="hospedagem">
      ${aviao ? I.aviao : I.cama}
      <div style="flex:1;min-width:0">
        <div class="t">${aviao ? "Noite no avião" : h(hosp.nome)}</div>
        <div class="s">${h(hosp.endereco)}${hosp.tel ? " · " + h(hosp.tel) : ""}</div>
        ${hosp.status === "pendente" ? `<span class="etiqueta et-pendente">${I.pendente} ${h(hosp.pendencia || "Reserva pendente")}</span>` : ""}
      </div>
    </div>
    ${botoes.length ? `<div class="botoes hosp-botoes">${botoes.join("")}</div>` : ""}
  </section>`;
}

/* ---------- telas ---------- */
function telaBloqueio(msg = "") {
  $abas.hidden = true;
  $app.innerHTML = `
  <main class="bloqueio">
    <div class="marca"><img src="icons/icon-192.png" alt=""><h1>Indaly</h1></div>
    <p>Índia, Nepal e Itália · 30 de outubro a 17 de novembro de 2026.<br>Digite a senha do grupo uma vez neste celular.</p>
    <form id="form-senha" autocomplete="off">
      <label for="senha">SENHA</label>
      <input id="senha" name="senha" type="password" autocomplete="current-password" required>
      <button class="botao botao-papel" type="submit">Abrir o cofre</button>
      <div class="erro" role="alert">${h(msg)}</div>
    </form>
  </main>`;
  const f = document.getElementById("form-senha");
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const senha = f.senha.value.trim();
    const $erro = f.querySelector(".erro");
    const $b = f.querySelector("button");
    $b.disabled = true; $b.textContent = "Abrindo o cofre…"; $erro.textContent = "";
    try {
      const bytes = await buscarBytes("cofre/chave.age");
      const d = new Decrypter();
      d.addPassphrase(senha);
      IDENT = (await d.decrypt(bytes, "text")).trim();
      gravarLS(LS_CHAVE, IDENT);
      await entrar();
    } catch (err) {
      console.error(err);
      $erro.textContent = navigator.onLine ? "Senha incorreta. Tente de novo." : "Sem internet. Na primeira vez é preciso estar conectado.";
      $b.disabled = false; $b.textContent = "Abrir o cofre";
    }
  });
  setTimeout(() => document.getElementById("senha")?.focus(), 50);
}

function telaHoje() {
  const hoje = hojeISO();
  const agora = new Date();
  const i = idxDia(hoje);
  const relogios = (tz, nome) => `<b>${horaEm(tz)} ${h(nome)}</b><br>${horaEm("America/Sao_Paulo")} São Paulo`;
  let corpo = "";
  if (hoje < R.inicio) {
    const falta = diffDias(hoje, R.inicio);
    const d0 = R.dias[0];
    const p0 = corDia(d0);
    const a0 = d0.atividades[0];
    corpo = `
      <div class="contagem"><b>${falta}</b><span>${falta === 1 ? "dia para o embarque" : "dias para o embarque"}</span></div>
      <a class="bilhete-mini" href="#/dia/${d0.data}">
        <div class="faixa ${p0.claro ? "claro" : ""}" style="--pais:${p0.cor}">
          <div class="l1"><span>${h(diaCurto(d0.data).toUpperCase())} · ${h(dataMedia(d0.data).toUpperCase())}</span><span>DIA 1</span></div>
          <div class="cidade">${h(d0.cidade)}</div>
          <div class="l3">${h(a0.hora)} · ${h(a0.titulo)}</div>
        </div>
        <div class="tracejado"></div>
        <div class="pe">${barra19(-1)}</div>
      </a>
      ${proximosDias(R.dias.slice(0, 4))}`;
  } else if (hoje > R.fim) {
    corpo = `<div class="proximo"><div class="rot">VIAGEM CONCLUÍDA</div><div class="t">Bem-vindos de volta!</div></div><a class="linha-lista" href="#/roteiro"><div class="meio"><div class="t">Rever o roteiro</div></div><span class="seta">${I.seta}</span></a>`;
  } else {
    const dia = R.dias[i];
    const pais = corDia(dia);
    const agoraHM = horaEm(dia.fuso === "America/Sao_Paulo" ? Intl.DateTimeFormat().resolvedOptions().timeZone : Intl.DateTimeFormat().resolvedOptions().timeZone, agora);
    const comHora = dia.atividades.map((a, n) => ({ a, n })).filter((x) => x.a.hora);
    let destaque = comHora.find((x) => x.a.hora >= agoraHM) || null;
    let rot = "";
    if (destaque) {
      const [hh, mm] = destaque.a.hora.split(":").map(Number);
      const [ah, am] = agoraHM.split(":").map(Number);
      const min = hh * 60 + mm - (ah * 60 + am);
      rot = min <= 0 ? "AGORA" : min < 60 ? `EM ${min} MIN` : `EM ${Math.floor(min / 60)}H${String(min % 60).padStart(2, "0")}`;
    } else {
      destaque = { a: dia.atividades[0], n: 0 };
      rot = "HOJE";
    }
    const a = destaque.a;
    const depois = dia.atividades.map((x, n) => ({ x, n })).filter((o) => o.n > destaque.n).slice(0, 4);
    corpo = `
      <a class="bilhete-mini" href="#/dia/${dia.data}">
        <div class="faixa ${pais.claro ? "claro" : ""}" style="--pais:${pais.cor}">
          <div class="l1"><span>${h(diaCurto(dia.data).toUpperCase())} · ${h(dataMedia(dia.data).toUpperCase())}</span><span>DIA ${i + 1} / ${R.dias.length}</span></div>
          <div class="cidade">${h(dia.cidade)}</div>
          <div class="l3">${h(PAISES[dia.pais].nome)}${dia.hospedagem?.nome && dia.hospedagem.nome !== "Avião" ? " · dormir: " + h(dia.hospedagem.nome) : ""}</div>
        </div>
        <div class="tracejado"></div>
        <div class="pe">${barra19(i)}<div class="fichas fichas-claras">${fichaTempo(dia)}</div></div>
      </a>
      <div class="proximo">
        <div class="rot">${rot === "HOJE" ? "HOJE" : "PRÓXIMO · " + rot}</div>
        <div class="t">${h(a.titulo)}</div>
        <div class="s">${h(a.voo ? [a.hora, linhaVoo(a)].join(" · ") : [a.hora, a.local || a.horario].filter(Boolean).join(" · "))}</div>
        ${a.voo ? chipLocalizador(a.voo.localizador) : ""}
        <div class="botoes">
          <a class="botao botao-papel" href="#/dia/${dia.data}/${destaque.n}">${I.seta} Detalhes</a>
          ${a.docs?.length ? `<button type="button" class="botao botao-contorno" data-doc="${h(a.docs[0])}">${I.bilhete} Documento</button>` : (a.mapa || a.endereco ? `<button type="button" class="botao botao-contorno" data-ir="${dia.data}|${destaque.n}">${I.carro} Ir até lá</button>` : "")}
        </div>
      </div>
      ${depois.length ? `<div style="display:flex;justify-content:space-between;align-items:baseline"><h2 class="secao">Depois, hoje</h2><a href="#/dia/${dia.data}" style="font-size:13px;font-weight:600;color:var(--tinta)">Ver o dia todo</a></div>
      <div class="lista">${depois.map((o) => `<a class="linha-lista" href="#/dia/${dia.data}/${o.n}"><span class="ponto-lista" style="background:${pais.cor}"></span><div class="meio"><div class="t">${h(o.x.titulo)}</div><div class="s">${h([textoHora(o.x), subAtividade(o.x)].filter(Boolean).join(" · "))}</div></div><span class="seta">${I.seta}</span></a>`).join("")}</div>` : ""}`;
  }
  const tzLocal = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const nomeLocal = i >= 0 && hoje >= R.inicio && hoje <= R.fim ? R.dias[i].cidade : "aqui";
  $app.innerHTML = `
  <main class="tela">
    <div class="cabeca">
      <div class="marca">Indaly</div>
      <div class="relogios">${tzLocal === "America/Sao_Paulo" ? `<b>${horaEm("America/Sao_Paulo")} São Paulo</b>` : relogios(tzLocal, nomeLocal)}</div>
    </div>
    ${corpo}
    ${instalado() ? "" : `<a class="linha-lista convite" href="#/mais/instalar"><span class="subapp-icone mini" style="background:#C3122F"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M12 7v7M9 11l3 3 3-3"/></svg></span><div class="meio"><div class="t">Instale o Indaly como app</div><div class="s">Ícone na tela inicial e sem barra de endereço</div></div><span class="seta">${I.seta}</span></a>`}
  </main>`;
}

function barra19(ate) {
  const cel = R.dias.map((d, n) => `<i style="background:${ate < 0 || n <= ate ? corDia(d).cor : "#E4E0D6"}"></i>`).join("");
  return `<div class="barra19" role="img" aria-label="Linha da viagem">${cel}</div><div class="barra19-legenda"><span>${h(dataMedia(R.inicio))}</span><span>${h(dataMedia(R.fim))}</span></div>`;
}

function proximosDias(dias) {
  return `<h2 class="secao">Primeiros dias</h2><div class="lista">${dias.map((d) => linhaDia(d, false)).join("")}</div>`;
}

function linhaDia(d, comEstado = true) {
  const p = corDia(d);
  const hoje = hojeISO();
  const passou = comEstado && d.data < hoje;
  const ehHoje = d.data === hoje;
  const pend = pendenciasDoDia(d);
  const alerta = d.atividades.some((a) => a.alerta);
  const resumo = d.atividades.map((a) => a.titulo).slice(0, 3).join(" · ");
  const lado = [];
  if (ehHoje) lado.push('<span class="etiqueta et-doc">HOJE</span>');
  if (!passou && alerta) lado.push(`<span class="etiqueta et-alerta">${I.alerta} aviso</span>`);
  if (!passou && pend) lado.push(`<span class="etiqueta et-pendente">${pend} pend.</span>`);
  return `<a class="linha-lista dia-linha ${ehHoje ? "hoje" : ""}" href="#/dia/${d.data}" style="${passou ? "opacity:.55" : ""}">
    <div class="data-bloco" style="background:${p.tint}"><small>${h(SEM3[dataDe(d.data).getDay()])}</small><b>${h(d.data.slice(8))}</b></div>
    <div class="meio"><div class="t">${h(d.cidade)}${d.subtitulo ? ` <span style="font-weight:400;color:var(--apagado)">${h(d.subtitulo)}</span>` : ""}</div><div class="s">${h(resumo)}</div></div>
    <div class="lado">${lado.join("")}</div>
  </a>`;
}

function telaRoteiro() {
  const grupos = [];
  for (const d of R.dias) {
    const p = corDia(d);
    const ult = grupos[grupos.length - 1];
    if (ult && ult.pais === d.pais && ult.cor === p.cor) ult.dias.push(d);
    else grupos.push({ pais: d.pais, cor: p.cor, nome: p.nome, dias: [d] });
  }
  $app.innerHTML = `
  <main class="tela">
    <div>
      <h1 class="titulo-tela">Roteiro</h1>
      <div class="sub-tela">${h(dataMedia(R.inicio))} → ${h(dataMedia(R.fim))} · ${h(R.viajantes.join(", "))}</div>
    </div>
    ${grupos.map((g) => `
      <div class="capitulo"><i style="background:${g.cor}"></i><b>${h(g.nome.toUpperCase())}</b><span>${h(g.dias.length > 1 ? `${dataMedia(g.dias[0].data)} – ${dataMedia(g.dias[g.dias.length - 1].data)}` : dataMedia(g.dias[0].data))}</span></div>
      <div class="lista">${g.dias.map((d) => linhaDia(d)).join("")}</div>`).join("")}
  </main>`;
  document.querySelector(".dia-linha.hoje")?.scrollIntoView({ block: "center" });
}

function telaDia(iso) {
  const i = idxDia(iso);
  if (i < 0) return (location.hash = "#/roteiro");
  const dia = R.dias[i];
  const pais = corDia(dia);
  const hoje = hojeISO();
  $app.innerHTML = `
  ${cabecalhoDia(dia, i)}
  <section class="tempo" style="--pais:${pais.cor}" aria-label="Atividades do dia">
    ${dia.atividades.map((a, n) => `
      <a class="passo ${a.status === "confirmado" ? "confirmado" : ""} ${a.status === "pendente" ? "pendente" : ""} ${dia.data < hoje ? "feito" : ""}" href="#/dia/${dia.data}/${n}">
        <div class="hora">${h(textoHora(a) || "—")}</div>
        <div class="trilho"><i></i><span class="ponto"></span><i></i></div>
        <div class="corpo">
          <div class="t">${h(a.titulo)}</div>
          ${subAtividade(a) ? `<div class="s">${h(subAtividade(a))}</div>` : ""}
          ${a.voo ? chipLocalizador(a.voo.localizador) : ""}
          ${etiquetasAtividade(a)}
        </div>
      </a>`).join("")}
  </section>
  ${cartaoHospedagem(dia.hospedagem, dia)}`;
  window.scrollTo(0, 0);
}

function telaAtividade(iso, n) {
  const i = idxDia(iso);
  const dia = R.dias[i];
  const a = dia?.atividades[n];
  if (!a) return (location.hash = "#/dia/" + iso);
  const pais = corDia(dia);
  const linhas = [];
  if ((a.hora || a.periodo) && !a.voo) linhas.push([I.relogio, "Quando", `${h(a.hora || a.periodo)} · ${h(SEM3[dataDe(dia.data).getDay()])}, ${h(dataMedia(dia.data))}`]);
  if (a.horario) linhas.push([I.porta, "Funcionamento", h(a.horario)]);
  if (a.local || a.endereco) linhas.push([I.pino, "Onde", `${a.local ? h(a.local) : ""}${a.local && a.endereco ? "<br>" : ""}${a.endereco ? `<span style="font-weight:400;font-size:14px">${h(a.endereco)}</span>` : ""}`]);
  const comoIr = a.como_ir || (dia.transporte ? dia.transporte.texto + (dia.transporte.status === "pendente" ? " (a combinar)" : "") : "");
  if (comoIr) linhas.push([I.carro, "Como ir", h(comoIr)]);
  const q = a.mapa || a.endereco || (a.titulo + ", " + dia.cidade);
  $app.innerHTML = `
  <main class="tela" style="--pais-texto:${pais.claro ? "var(--acafrao-texto)" : pais.cor}">
    <a class="voltar" href="#/dia/${dia.data}">${I.voltar} ${h(diaCurto(dia.data))} · ${h(dia.cidade)}</a>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${a.hora && !a.voo ? `<span class="mono" style="font-weight:600;font-size:13px;color:${pais.claro ? "var(--acafrao-texto)" : pais.cor}">${h(a.hora)}</span>` : ""}
      <h1 class="atv-titulo">${h(a.titulo)}</h1>
      ${a.detalhe ? `<div style="font-size:15px;color:#3B4262">${h(a.detalhe)}</div>` : ""}
      ${etiquetasAtividade({ ...a, alerta: null, pendencia: a.status === "pendente" ? "Pendente" : null })}
    </div>
    ${a.voo ? cartaoVoo(a) : ""}
    ${a.alerta ? `<div class="aviso aviso-alerta">${I.alerta}<div>${h(a.alerta)}</div></div>` : ""}
    ${a.status === "pendente" ? `<div class="aviso aviso-pendente">${I.pendente}<div><b>Pendência:</b> ${h(a.pendencia || "a resolver")}</div></div>` : ""}
    ${linhas.length ? `<div class="info">${linhas.map(([ic, r, v]) => `<div class="info-linha">${ic}<div><div class="r">${r}</div><div class="v">${v}</div></div></div>`).join("")}</div>` : ""}
    <div class="botoes">
      <button type="button" class="botao botao-tinta" data-ir="${dia.data}|${n}">${I.carro} Ir até lá</button>
      ${a.docs?.length ? `<button type="button" class="botao botao-claro" data-doc="${h(a.docs[0])}">${I.bilhete} ${a.docs.length > 1 ? "Documentos" : h(rotuloArquivo(R.docs[a.docs[0]].nome))}</button>` : ""}
    </div>
    ${a.docs?.length ? `<div class="rotulo">Documentos</div><div class="lista">${a.docs.map((id) => linhaDoc(id)).join("")}</div>` : ""}
    ${a.notas ? `<div class="aviso aviso-pendente" style="background:#fff;color:var(--tinta)"><div><b>Notas</b> · ${h(a.notas)}</div></div>` : ""}
  </main>`;
  window.scrollTo(0, 0);
}

function linhaDoc(id) {
  const d = R.docs[id];
  if (!d) return "";
  const img = d.tipo?.startsWith("image/");
  return `<button type="button" class="linha-lista doc-linha" data-doc="${h(id)}">
    <div class="icone-doc">${I.pdf}<span>${img ? "IMG" : "PDF"}</span></div>
    <div class="meio"><div class="t">${h(d.titulo || d.nome.replace(/\.[a-z]+$/i, ""))}</div><div class="s">${d.bytes ? Math.max(1, Math.round(d.bytes / 1024)) + " KB · " : ""}<span class="offline" data-offline="${h(d.arquivo || "")}">${I.ok} no cofre</span></div></div>
  </button>`;
}

const CATS = [
  { id: "todos", nome: "Todos" },
  { id: "viagem", nome: "Vistos e saúde" },
  { id: "seguro", nome: "Seguro" },
  { id: "passagem", nome: "Passagens" },
  { id: "hotel", nome: "Hospedagens" },
  { id: "passeio", nome: "Passeios" },
];
const ICONE_CAT = { seguro: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>', viagem: I.id, passagem: I.aviao, hotel: I.cama, passeio: I.bilhete };

function itemCarteira(c) {
  const tint = c.data ? (PAISES[R.dias.find((d) => d.data === c.data)?.pais] || PAISES.BR).tint : "#E3E6F0";
  const icone = c.titulo.startsWith("Trem") ? I.trem : ICONE_CAT[c.cat];
  const sub = [c.data ? dataMedia(c.data) : "", c.sub].filter(Boolean).join(" · ");
  const unico = c.docs.length === 1;
  const corpo = `<span class="ic" style="background:${tint}">${icone}</span>
    <span class="meio"><span class="t">${h(c.titulo)}</span><span class="s">${h(sub)}${c.aviso ? ` · <em>${h(c.aviso)}</em>` : ""}</span></span>`;
  if (unico) return `<button type="button" class="cart-item" data-doc="${h(c.docs[0])}">${corpo}<span class="seta">${I.seta}</span></button>`;
  return `<div class="cart-item">${corpo}<span class="arquivos">${c.docs.map((id) => `<button type="button" data-doc="${h(id)}">${h(rotuloArquivo(R.docs[id].nome))}</button>`).join("")}</span></div>`;
}

function telaCarteira() {
  const hoje = hojeISO();
  const itens = R.carteira.filter((c) => carteiraFiltro === "todos" || c.cat === carteiraFiltro);
  const sempre = itens.filter((c) => !c.ate);
  const proximos = itens.filter((c) => c.ate && c.ate >= hoje);
  const usados = itens.filter((c) => c.ate && c.ate < hoje);
  const bloco = (titulo, lista, extra = "") => lista.length ? `<div class="rotulo">${titulo}</div><div class="lista-densa ${extra}">${lista.map(itemCarteira).join("")}</div>` : "";
  $app.innerHTML = `
  <main class="tela">
    <div>
      <h1 class="titulo-tela">Carteira</h1>
      <div class="estado-cofre" id="estado-cofre"></div>
    </div>
    <div class="filtros" role="group" aria-label="Filtrar documentos">
      ${CATS.map((c) => `<button type="button" data-filtro="${c.id}" aria-pressed="${carteiraFiltro === c.id}">${h(c.nome)}</button>`).join("")}
    </div>
    ${bloco("Viagem toda", sempre)}
    ${bloco("Próximos", proximos)}
    ${bloco("Utilizados", usados, "usados")}
    ${itens.length ? "" : '<div class="nota">Nada por aqui.</div>'}
    <button type="button" class="rodape-acao" id="bloquear">Bloquear este celular</button>
  </main>`;
  $app.querySelectorAll("[data-filtro]").forEach((b) => b.addEventListener("click", () => { carteiraFiltro = b.dataset.filtro; telaCarteira(); }));
  document.getElementById("bloquear").addEventListener("click", () => {
    if (!confirm("Bloquear o Indaly neste celular? Para abrir de novo, será preciso digitar a senha.")) return;
    apagarLS(LS_CHAVE); IDENT = null; R = null; telaBloqueio();
  });
  atualizarEstadoCofre();
}
function atualizarEstadoCofre() {
  const el = document.getElementById("estado-cofre");
  if (!el) return;
  if (!OFFLINE.total) { el.innerHTML = "Documentos trancados com a senha do grupo"; return; }
  el.innerHTML = OFFLINE.prontos >= OFFLINE.total
    ? `<span class="offline">${I.ok}</span> ${OFFLINE.total} arquivos guardados neste celular · funciona sem internet`
    : `Guardando para usar sem internet… ${OFFLINE.prontos} de ${OFFLINE.total}`;
}

const BANDEIRAS = {
  USD: '<svg class="bandeira" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#fff"/><path d="M0 0h30v2.9H0zM0 5.7h30v2.9H0zM0 11.4h30v2.9H0zM0 17.1h30V20H0z" fill="#B22234"/><rect width="13" height="10.8" fill="#3C3B6E"/><g fill="#fff"><circle cx="3" cy="2.7" r=".9"/><circle cx="6.5" cy="2.7" r=".9"/><circle cx="10" cy="2.7" r=".9"/><circle cx="4.7" cy="5.4" r=".9"/><circle cx="8.3" cy="5.4" r=".9"/><circle cx="3" cy="8.1" r=".9"/><circle cx="6.5" cy="8.1" r=".9"/><circle cx="10" cy="8.1" r=".9"/></g></svg>',
  EUR: '<svg class="bandeira" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#003399"/><g fill="#FFCC00"><circle cx="15" cy="4.5" r="1"/><circle cx="17.75" cy="5.24" r="1"/><circle cx="19.76" cy="7.25" r="1"/><circle cx="20.5" cy="10" r="1"/><circle cx="19.76" cy="12.75" r="1"/><circle cx="17.75" cy="14.76" r="1"/><circle cx="15" cy="15.5" r="1"/><circle cx="12.25" cy="14.76" r="1"/><circle cx="10.24" cy="12.75" r="1"/><circle cx="9.5" cy="10" r="1"/><circle cx="10.24" cy="7.25" r="1"/><circle cx="12.25" cy="5.24" r="1"/></g></svg>',
  INR: '<svg class="bandeira" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="6.67" fill="#FF9933"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#138808"/><circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" stroke-width=".9"/><circle cx="15" cy="10" r=".7" fill="#000080"/></svg>',
  NPR: '<svg class="bandeira" viewBox="0 0 30 20" aria-hidden="true"><path d="M9 1v18h11.5L13 11.3h7.5L9 1z" fill="#DC143C" stroke="#003893" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12.2" cy="8.2" r="1.1" fill="#fff"/><circle cx="12.6" cy="15.2" r="1.5" fill="#fff"/></svg>',
  BRL: '<svg class="bandeira" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#009C3B"/><path d="M15 2.5L27 10 15 17.5 3 10z" fill="#FFDF00"/><circle cx="15" cy="10" r="4.2" fill="#002776"/></svg>',
};
const MOEDAS = [
  { c: "USD", s: "US$", n: "Dólar americano", cor: "#14224F" },
  { c: "EUR", s: "€", n: "Euro · Itália", cor: "#0D7A48" },
  { c: "INR", s: "₹", n: "Rúpia indiana", cor: "#EE8A24" },
  { c: "NPR", s: "रू", n: "Rúpia nepalesa", cor: "#C3122F" },
];
function moedaDoDia() {
  const d = R.dias[idxDia(hojeISO())];
  return d ? ({ IN: "INR", NP: "NPR", IT: "EUR" }[d.pais] || "INR") : "INR";
}
const fmt = (v, casas) => v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
const lerNumero = (s) => parseFloat(String(s).replace(/\./g, "").replace(",", ".")) || 0;

function telaCambio() {
  if (!CAMBIO) {
    $app.innerHTML = `<main class="tela"><h1 class="titulo-tela">Câmbio</h1><div class="nota">As taxas ainda não foram baixadas. Abra uma vez com internet.</div></main>`;
    return;
  }
  const T = CAMBIO.reais_por_unidade;
  if (!cambioEstado) cambioEstado = { modo: "para", moeda: moedaDoDia(), valor: "1.000" };
  const e = cambioEstado;
  const m = MOEDAS.find((x) => x.c === e.moeda);
  const valor = lerNumero(e.valor);
  const rapidos = e.modo === "de" ? [50, 100, 200, 500] : { USD: [10, 50, 100, 200], EUR: [10, 20, 50, 100], INR: [100, 500, 1000, 2000], NPR: [100, 500, 1000, 5000] }[e.moeda];
  const resultado = e.modo === "de"
    ? MOEDAS.map((x) => `<div class="resultado">${BANDEIRAS[x.c]}<div class="meio"><div class="c">${x.c}</div><div class="n">${h(x.n)}</div></div><div class="v">${x.s} ${fmt(valor / T[x.c], valor / T[x.c] >= 100 ? 0 : 2)}</div></div>`).join("")
    : `<div class="resultado">${BANDEIRAS.BRL}<div class="meio"><div class="c">BRL</div><div class="n">Real</div></div><div class="v">R$ ${fmt(valor * T[e.moeda], 2)}</div></div>
       <div class="nota">1 ${m.c} = R$ ${fmt(T[e.moeda], T[e.moeda] < 1 ? 4 : 2)} · R$ 1 = ${m.s} ${fmt(1 / T[e.moeda], 1 / T[e.moeda] >= 10 ? 2 : 4)}</div>`;
  $app.innerHTML = `
  <main class="tela">
    <div>
      <h1 class="titulo-tela">Câmbio</h1>
    </div>
    <div class="filtros" role="group" aria-label="Direção">
      <button type="button" data-modo="para" aria-pressed="${e.modo === "para"}">Moeda → reais</button>
      <button type="button" data-modo="de" aria-pressed="${e.modo === "de"}">Reais → moeda</button>
    </div>
    <div class="conversor">
      ${e.modo === "para" ? `<div class="moedas" role="group" aria-label="Moeda" style="grid-template-columns:repeat(4,minmax(0,1fr))">${MOEDAS.map((x) => `<button type="button" data-moeda="${x.c}" aria-pressed="${x.c === e.moeda}">${BANDEIRAS[x.c]}<span>${x.c}</span></button>`).join("")}</div>` : ""}
      <label for="valor">${e.modo === "de" ? "VALOR EM REAIS" : "VALOR EM " + h(m.n.split(" ·")[0].toUpperCase())}</label>
      <div class="valor"><span>${e.modo === "de" ? "R$" : h(m.s)}</span><input id="valor" type="text" inputmode="decimal" value="${h(e.valor)}" autocomplete="off"></div>
      <div class="rapidos">${rapidos.map((n) => `<button type="button" data-rapido="${n}">${n.toLocaleString("pt-BR")}</button>`).join("")}</div>
    </div>
    <div class="lista" id="resultado">${resultado}</div>
    <div class="nota">Taxas efetivas atualizadas em ${h(CAMBIO.data.slice(8, 10) + "/" + CAMBIO.data.slice(5, 7) + "/" + CAMBIO.data.slice(2, 4))}</div>
  </main>`;
  $app.querySelectorAll("[data-modo]").forEach((b) => b.addEventListener("click", () => { e.modo = b.dataset.modo; e.valor = e.modo === "de" ? "100" : "1.000"; if (e.modo === "para" && e.moeda === "USD") e.valor = "100"; telaCambio(); }));
  $app.querySelectorAll("[data-moeda]").forEach((b) => b.addEventListener("click", () => { e.moeda = b.dataset.moeda; telaCambio(); }));
  $app.querySelectorAll("[data-rapido]").forEach((b) => b.addEventListener("click", () => { e.valor = Number(b.dataset.rapido).toLocaleString("pt-BR"); telaCambio(); }));
  const inp = document.getElementById("valor");
  inp.addEventListener("input", () => {
    e.valor = inp.value;
    const pos = inp.selectionStart;
    telaCambio();
    const novo = document.getElementById("valor");
    novo.focus();
    try { novo.setSelectionRange(pos, pos); } catch {}
  });
}

/* ---------- Mais ---------- */
/* apps: pkg = pacote Android (abre o app ou a Play Store); ios = id na App Store (a loja mostra "Abrir" se já estiver instalado) */
const APP = {
  wise: { n: "Wise", dom: "wise.com", pkg: "com.transferwise.android", ios: 612261027, url: "https://wise.com/" },
  nubank: { n: "Nubank", dom: "nubank.com.br", pkg: "com.nu.production", ios: 814456780, url: "https://nubank.com.br/" },
  itau: { n: "Itaú", dom: "itau.com.br", pkg: "com.itau", ios: 474505665, url: "https://www.itau.com.br/" },
  splitwise: { n: "Splitwise", dom: "splitwise.com", pkg: "com.Splitwise.SplitwiseMobile", ios: 458023433, url: "https://secure.splitwise.com/" },
  ita: { n: "ITA Airways", dom: "ita-airways.com", ios: 1589844779, url: "https://www.ita-airways.com/" },
  airindia: { n: "Air India", dom: "airindia.com", pkg: "com.bets.airindia.ui", ios: 932302964, url: "https://www.airindia.com/" },
  buddha: { n: "Buddha Air", dom: "buddhaair.com", ios: 962660238, url: "https://www.buddhaair.com/" },
  indigo: { n: "IndiGo", dom: "goindigo.in", pkg: "in.goindigo.android", ios: 726070762, url: "https://www.goindigo.in/" },
  uber: { n: "Uber", dom: "uber.com", pkg: "com.ubercab", ios: 368677368, url: "https://m.uber.com/" },
  ola: { n: "Ola", dom: "book.olacabs.com", pkg: "com.olacabs.customer", ios: 539179365, url: "https://www.olacabs.com/" },
  rapido: { n: "Rapido", dom: "rapido.bike", pkg: "com.rapido.passenger", ios: 1198464606, url: "https://www.rapido.bike/" },
  pathao: { n: "Pathao", dom: "pathao.com", pkg: "com.pathao.user", ios: 1201700952, url: "https://pathao.com/np/" },
  indrive: { n: "inDrive", dom: "indrive.com", pkg: "sinet.startup.inDriver", ios: 780125801, url: "https://indrive.com/" },
  trenitalia: { n: "Trenitalia", dom: "trenitalia.com", pkg: "com.lynxspa.prontotreno", ios: 331050847, url: "https://www.trenitalia.com/" },
  freenow: { n: "FREENOW", dom: "free-now.com", pkg: "taxi.android.client", ios: 357852748, url: "https://www.free-now.com/" },
  maps: { n: "Google Maps", dom: "maps.google.com", pkg: "com.google.android.apps.maps", ios: 585027354, url: "https://maps.google.com/" },
  waze: { n: "Waze", dom: "waze.com", pkg: "com.waze", ios: 323229106, url: "https://www.waze.com/" },
  tradutor: { n: "Google Tradutor", dom: "translate.google.com", pkg: "com.google.android.apps.translate", ios: 414706506, url: "https://translate.google.com/" },
};
const APPS = [
  { grupo: "Dinheiro", itens: [["wise", "Conta global e cartão"], ["nubank", "Conta global"], ["itau", "Banco"], ["splitwise", "Dividir as despesas do grupo"]] },
  { grupo: "Companhias aéreas", itens: [["ita", "Brasil ⇄ Roma ⇄ Delhi (a antiga Alitalia)"], ["airindia", "Delhi → Kathmandu"], ["buddha", "Kathmandu → Varanasi"], ["indigo", "Varanasi → Delhi"]] },
  { grupo: "Transporte na Índia", itens: [["uber", "Carro e tuk-tuk (Uber Auto)"], ["ola", "Carro e tuk-tuk, muito usado na Índia"], ["rapido", "Moto-táxi, tuk-tuk e carro"]] },
  { grupo: "Transporte no Nepal", itens: [["pathao", "O mais usado em Kathmandu"], ["indrive", "Você propõe o preço da corrida"]] },
  { grupo: "Transporte na Itália", itens: [["trenitalia", "Trens, inclusive o Leonardo Express"], ["freenow", "Táxi em Roma"], ["uber", "Carro com motorista em Roma"]] },
  { grupo: "Mapas e idiomas", itens: [["maps", "Baixe os mapas das cidades para usar offline"], ["waze", "Rotas de carro"], ["tradutor", "Baixe hindi, nepalês e italiano para usar offline"]] },
];
const ehIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const ehAndroid = () => /Android/i.test(navigator.userAgent);
function urlApp(id) {
  const a = APP[id];
  if (ehAndroid()) {
    if (!a.pkg) return "https://play.google.com/store/search?c=apps&q=" + encodeURIComponent(a.n);
    const loja = "https://play.google.com/store/apps/details?id=" + a.pkg;
    return `intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;package=${a.pkg};S.browser_fallback_url=${encodeURIComponent(loja)};end`;
  }
  if (ehIOS()) return "https://apps.apple.com/br/app/id" + a.ios;
  return a.url;
}
const logoApp = (id, classe = "app-logo") => {
  const a = APP[id];
  return `<span class="${classe}" aria-hidden="true"><img src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=https://${a.dom}" alt="" loading="lazy" onload="this.classList.add('ok')" onerror="this.remove()"><b>${h(a.n[0])}</b></span>`;
};

/* "Ir até lá": rotas e corridas para o lugar da atividade */
const CORRIDAS = { IN: ["uber", "ola", "rapido"], NP: ["pathao", "indrive"], IT: ["uber", "freenow"], BR: ["uber"] };
function lugarDe(chave) {
  const [iso, k] = chave.split("|");
  const dia = R.dias[idxDia(iso)];
  if (!dia) return null;
  if (k === "h") {
    const hp = dia.hospedagem;
    return { nome: hp.nome, endereco: hp.endereco, busca: hp.nome + ", " + hp.endereco, coords: hp.coords, pais: dia.pais };
  }
  const a = dia.atividades[Number(k)];
  return { nome: a.titulo, endereco: a.endereco || a.local || dia.cidade, busca: a.mapa || a.endereco || (a.titulo + ", " + dia.cidade), coords: a.coords, pais: dia.pais };
}
function abrirIrAte(chave) {
  const l = lugarDe(chave);
  if (!l) return;
  const [lat, lon] = l.coords || [];
  const temCoord = lat != null;
  const destino = temCoord ? `${lat},${lon}` : l.busca;
  const opcoes = [
    { id: "maps", t: "Rota no Google Maps", s: "A pé, de carro ou transporte", url: "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(destino) },
    { id: "waze", t: "Rota no Waze", s: "De carro", url: temCoord ? `https://waze.com/ul?ll=${lat},${lon}&navigate=yes` : "https://waze.com/ul?navigate=yes&q=" + encodeURIComponent(l.busca) },
  ];
  for (const id of CORRIDAS[l.pais] || []) {
    if (id === "uber") {
      const p = new URLSearchParams({ action: "setPickup", pickup: "my_location", "dropoff[nickname]": l.nome, "dropoff[formatted_address]": l.endereco || l.busca });
      if (temCoord) { p.set("dropoff[latitude]", lat); p.set("dropoff[longitude]", lon); }
      opcoes.push({ id, t: "Pedir um Uber", s: "Já com o destino preenchido", url: "https://m.uber.com/ul/?" + p.toString() });
    } else {
      opcoes.push({ id, t: "Pedir no " + APP[id].n, s: "Copia o endereço e abre o app", url: urlApp(id), copiar: true });
    }
  }
  fecharFolha();
  const el = document.createElement("div");
  el.className = "folha-fundo";
  el.innerHTML = `
    <div class="folha" role="dialog" aria-modal="true" aria-labelledby="folha-titulo">
      <div class="folha-alca" aria-hidden="true"></div>
      <h2 id="folha-titulo">Ir até lá</h2>
      <div class="folha-destino"><b>${h(l.nome)}</b><span>${h(l.endereco || "")}</span></div>
      <div class="lista">
        ${opcoes.map((o, i) => `<a class="linha-lista app-linha-ir" href="${h(o.url)}" ${o.url.startsWith("intent:") ? "" : 'target="_blank" rel="noopener"'} data-opcao="${i}">${logoApp(o.id)}<div class="meio"><div class="t">${h(o.t)}</div><div class="s">${h(o.s)}</div></div><span class="seta">${I.seta}</span></a>`).join("")}
      </div>
      <div class="botoes" style="grid-template-columns:1fr 1fr">
        <button type="button" class="botao botao-claro" id="folha-copiar">Copiar endereço</button>
        <button type="button" class="botao botao-tinta" id="folha-fechar">Fechar</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  document.body.style.overflow = "hidden";
  const copiar = async () => {
    try { await navigator.clipboard.writeText(l.endereco && l.endereco !== l.nome ? `${l.nome}, ${l.endereco}` : l.busca); return true; } catch { return false; }
  };
  el.addEventListener("click", (e) => { if (e.target === el) fecharFolha(); });
  el.querySelector("#folha-fechar").addEventListener("click", fecharFolha);
  el.querySelector("#folha-copiar").addEventListener("click", async () => { avisar((await copiar()) ? "Endereço copiado." : "Não consegui copiar."); });
  el.querySelectorAll("[data-opcao]").forEach((a) => a.addEventListener("click", () => {
    const o = opcoes[Number(a.dataset.opcao)];
    if (o.copiar) { copiar(); avisar("Endereço copiado: cole como destino no app."); }
  }));
  el.querySelector("#folha-fechar").focus();
}
function fecharFolha() {
  document.querySelector(".folha-fundo")?.remove();
  if ($visor.hidden) document.body.style.overflow = "";
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-ir]");
  if (b) { e.preventDefault(); abrirIrAte(b.dataset.ir); }
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharFolha(); });

const FUSOS = [
  { nome: "São Paulo", tz: "America/Sao_Paulo", pais: "BR", obs: "Casa" },
  { nome: "Roma e Bracciano", tz: "Europe/Rome", pais: "IT", obs: "31 out e 12 a 16 nov" },
  { nome: "Delhi, Agra, Jaipur e Varanasi", tz: "Asia/Kolkata", pais: "IN", obs: "1 a 6 e 9 a 11 nov" },
  { nome: "Kathmandu", tz: "Asia/Kathmandu", pais: "NP", obs: "7 e 8 nov" },
];

/* sub-apps da aba Mais: para acrescentar um novo, basta incluir aqui e criar a função da página */
const SUBAPPS = [
  { id: "emergencia", nome: "Emergência", cor: "#C3122F", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z"/></svg>', tela: () => telaEmergencia() },
  { id: "frases", nome: "Frases", cor: "#A3560A", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3.5V15H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M17 9h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1v2.5L16 19h-3a2 2 0 0 1-2-2"/></svg>', tela: () => telaFrases() },
  { id: "mala", nome: "Mala", cor: "#2D4BA0", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6V3.5h6V6"/><rect x="5" y="6" width="14" height="13" rx="2.5"/><path d="M9.5 9.5v6M14.5 9.5v6"/><circle cx="8.5" cy="21" r="1"/><circle cx="15.5" cy="21" r="1"/></svg>', tela: (b) => telaMala(b) },
  { id: "tempo", nome: "Tempo", cor: "#EE8A24", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4.5V3M3.5 9H2M4.5 5.5l-1-1M12.5 5.5l1-1"/><path d="M5.2 11.5A4 4 0 1 1 12 7.6"/><path d="M7 20h10a4 4 0 0 0 0-8 5 5 0 0 0-9.6 1.5A3.3 3.3 0 0 0 7 20z"/></svg>', tela: () => telaTempo() },
  { id: "apps", nome: "Apps úteis", cor: "#14224F", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/></svg>', tela: () => telaApps() },
  { id: "fusos", nome: "Fusos", cor: "#0D7A48", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>', tela: () => telaFusos() },
  { id: "atualizar", nome: "Atualizar", cor: "#565D78", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.8-4.2L4 8.5M4 4v4.5h4.5M4 13a8 8 0 0 0 14.8 4.2l1.2-1.7M20 20v-4.5h-4.5"/></svg>', tela: () => telaAtualizar() },
  { id: "instalar", nome: "Instalar", cor: "#C3122F", soSemInstalar: true, icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M12 7v7M9 11l3 3 3-3M10 18.5h4"/></svg>', tela: () => telaInstalar() },
];
const instalado = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
let pedidoInstalar = null;
window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); pedidoInstalar = e; if (location.hash.startsWith("#/mais")) rotear(); });
window.addEventListener("appinstalled", () => { pedidoInstalar = null; avisar("Indaly instalado na tela inicial."); });

function topoSubapp(titulo) {
  return `<a class="voltar" href="#/mais">${I.voltar} Mais</a><h1 class="titulo-tela">${h(titulo)}</h1>`;
}

function telaMais() {
  const itens = SUBAPPS.filter((s) => !(s.soSemInstalar && instalado()));
  $app.innerHTML = `
  <main class="tela">
    <h1 class="titulo-tela">Mais</h1>
    <div class="subapps">
      ${itens.map((s) => `<a class="subapp" href="#/mais/${s.id}"><span class="subapp-icone" style="background:${s.cor}">${s.icone}</span><span class="subapp-nome">${h(s.nome)}</span></a>`).join("")}
    </div>
  </main>`;
}

function telaTempo() {
  const hoje = hojeISO();
  const futuros = R.dias.filter((d) => d.data >= hoje);
  const limite = isoDe(new Date(dataDe(hoje).getTime() + 15 * 86400000));
  const previsao = futuros.map((d) => {
    const t = tempoDoDia(d);
    const p = corDia(d);
    const bloco = `<div class="data-bloco-mini" style="background:${p.tint}"><small>${h(SEM3[dataDe(d.data).getDay()])}</small><b>${h(d.data.slice(8))}</b></div>`;
    const sol = textoSol(d);
    const linhaSol = sol ? `<div class="s sol-linha">${SOL_ICONES.nasce}sol nasce ${sol.nasce} · se põe ${sol.poe}</div>` : "";
    if (!t) {
      const libera = isoDe(new Date(dataDe(d.data).getTime() - 15 * 86400000));
      return `<a class="linha-lista" href="#/dia/${d.data}">${bloco}<div class="meio"><div class="t">${h(d.cidade)}</div><div class="s">${d.data > limite ? "Previsão a partir de " + h(dataMedia(libera)) : "Previsão indisponível agora"}</div>${linhaSol}</div></a>`;
    }
    const [ic, txt] = climaDe(t.cod);
    return `<a class="linha-lista" href="#/dia/${d.data}">${bloco}<div class="meio"><div class="t">${h(d.cidade)}</div><div class="s">${h(txt)}${t.chuva != null ? ` · chuva ${t.chuva}%` : ""}</div>${linhaSol}</div><div class="tempo-dia">${TEMPO_ICONES[ic]}<b>${Math.round(t.max)}°</b><span>${Math.round(t.min)}°</span></div></a>`;
  }).join("");
  $app.innerHTML = `
  <main class="tela">
    ${topoSubapp("Tempo")}
    <div class="lista">${previsao || '<div class="nota">A viagem já acabou.</div>'}</div>
    <div class="nota">Previsão para a cidade de cada dia; sai até 16 dias antes. Nascer e pôr do sol no horário local de cada cidade. ${TEMPO ? "Atualizada em " + new Date(TEMPO.em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) + "." : "Abra com internet para baixar."}</div>
  </main>`;
}

function telaApps() {
  $app.innerHTML = `
  <main class="tela">
    ${topoSubapp("Apps úteis")}
    <div class="nota">Toque para abrir o app. Se ainda não estiver instalado, abre a página dele na loja.</div>
    ${APPS.map((g) => `<div class="rotulo">${h(g.grupo)}</div><div class="lista">${g.itens.map(([id, d]) => `
      <a class="linha-lista app-linha-ir" href="${h(urlApp(id))}" ${urlApp(id).startsWith("intent:") ? "" : 'target="_blank" rel="noopener"'}>${logoApp(id)}<div class="meio"><div class="t">${h(APP[id].n)}</div><div class="s">${h(d)}</div></div><span class="seta">${I.externo}</span></a>`).join("")}</div>`).join("")}
  </main>`;
}

function telaFusos() {
  const hoje = hojeISO();
  const ref = hoje >= R.inicio && hoje <= R.fim ? new Date() : dataDe("2026-11-05");
  $app.innerHTML = `
  <main class="tela">
    ${topoSubapp("Fusos")}
    <div class="lista">${FUSOS.map((f) => `
      <div class="linha-lista"><i class="barra-pais" style="background:${PAISES[f.pais].cor}"></i><div class="meio"><div class="t">${h(f.nome)}</div><div class="s">${h(utcTexto(f.tz, ref))}${f.pais !== "BR" ? " · " + h(difSP(f.tz, ref)) : ""} · ${h(f.obs)}</div></div><div class="hora-fuso" data-tz="${f.tz}">${horaEm(f.tz)}</div></div>`).join("")}</div>
    <div class="nota">Horário de agora em cada lugar. As diferenças já consideram as datas da viagem (a Itália estará no horário de inverno).</div>
  </main>`;
}

function telaAtualizar() {
  const quando = R?.atualizado_em ? new Date(R.atualizado_em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—";
  $app.innerHTML = `
  <main class="tela">
    ${topoSubapp("Atualizar")}
    <p class="texto">O app se atualiza sozinho quando abre com internet. Se alguma mudança ainda não apareceu, toque abaixo: ele baixa tudo de novo e reabre.</p>
    <div class="info">
      <div class="info-linha">${I.relogio}<div><div class="r">Roteiro deste celular</div><div class="v">atualizado em ${h(quando)}</div></div></div>
      <div class="info-linha">${I.ok}<div><div class="r">Versão do app</div><div class="v">${h(VERSAO_APP)}</div></div></div>
    </div>
    <button type="button" class="botao botao-tinta" id="forcar-atualizacao">Atualizar agora</button>
  </main>`;
  document.getElementById("forcar-atualizacao").addEventListener("click", forcarAtualizacao);
}
async function forcarAtualizacao() {
  if (!navigator.onLine) return avisar("Sem internet agora. Tente quando estiver conectado.");
  const b = document.getElementById("forcar-atualizacao");
  if (b) { b.disabled = true; b.textContent = "Atualizando…"; }
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    await Promise.race([reg?.update(), new Promise((ok) => setTimeout(ok, 4000))]);
    if ("caches" in window) {
      const nomes = await caches.keys();
      await Promise.all(nomes.filter((n) => n.endsWith("-casca")).map((n) => caches.delete(n)));
      const dados = await caches.open("indaly-dados");
      for (const arq of ["cofre/roteiro.age", "cofre/versao.json", "cofre/chave.age", "cambio.json"]) await dados.delete(new URL(arq, location.href).href);
    }
  } catch (e) { console.error(e); }
  history.replaceState(null, "", location.pathname + "#/hoje");
  location.reload();
}

function telaInstalar() {
  let corpo;
  if (instalado()) {
    corpo = `<div class="aviso aviso-alerta" style="box-shadow:inset 0 0 0 1.5px var(--verde)"><div>O Indaly já está instalado neste celular.</div></div>`;
  } else if (pedidoInstalar) {
    corpo = `<p class="texto">Um toque e o Indaly vai para a tela inicial, com o ícone laranja e sem a barra de endereço.</p>
      <button type="button" class="botao botao-tinta" id="instalar-agora">Instalar o Indaly</button>`;
  } else if (ehIOS()) {
    corpo = `<ol class="passos">
      <li>Abra este endereço no <b>Safari</b> (no Chrome do iPhone não funciona).</li>
      <li>Toque em <b>Compartilhar</b> (o quadrado com a seta para cima).</li>
      <li>Escolha <b>Adicionar à Tela de Início</b> e confirme.</li>
    </ol>`;
  } else {
    corpo = `<ol class="passos">
      <li>Se já existe um ícone do Indaly com o símbolo do Chrome, apague esse atalho.</li>
      <li>Abra este endereço no <b>Chrome</b> e toque no menu <b>⋮</b>.</li>
      <li>Escolha <b>Instalar app</b>. Se aparecer "Adicionar à tela inicial", toque e escolha <b>Instalar</b>, não "Criar atalho".</li>
    </ol>
    <p class="texto">Instalado de verdade, o ícone fica laranja, sem o símbolo do Chrome, e o app abre sem a barra de endereço.</p>`;
  }
  $app.innerHTML = `<main class="tela">${topoSubapp("Instalar")}${corpo}</main>`;
  document.getElementById("instalar-agora")?.addEventListener("click", async () => {
    pedidoInstalar.prompt();
    await pedidoInstalar.userChoice;
    pedidoInstalar = null;
    rotear();
  });
}
setInterval(() => {
  document.querySelectorAll(".hora-fuso").forEach((el) => (el.textContent = horaEm(el.dataset.tz)));
}, 30000);

/* ---------- Emergência ---------- */
const telLimpo = (t) => "tel:" + String(t).replace(/[^\d+]/g, "");
function paisAgora() {
  const d = R.dias[idxDia(hojeISO())];
  return d && ["IN", "NP", "IT"].includes(d.pais) ? d.pais : "IN";
}
const NOME_PAIS_EM = { IN: "na Índia", NP: "no Nepal", IT: "na Itália", BR: "no Brasil" };
function telaEmergencia() {
  const E = R.emergencia;
  if (!E) { $app.innerHTML = `<main class="tela">${topoSubapp("Emergência")}<div class="nota">Os contatos de emergência ainda não estão neste roteiro. Toque em Mais → Atualizar.</div></main>`; return; }
  const agora = paisAgora();
  const pAgora = E.paises.find((p) => p.pais === agora);
  const S = E.seguro;
  const hosp = [];
  for (const d of R.dias) {
    const x = d.hospedagem;
    if (!x || !x.endereco || x.nome === "Avião" || d.pais === "BR" || hosp.find((y) => y.nome === x.nome)) continue;
    hosp.push({ ...x, pais: d.pais, cidade: d.cidade });
  }
  const contatos = [...(E.contatos || []).map((c) => ({ ...c, pais: "IN" })), ...hosp.filter((x) => !(E.contatos || []).some((c) => x.tel && c.tel === x.tel))];
  const linhaContato = (c) => `
    <div class="linha-lista contato">
      <i class="barra-pais" style="background:${PAISES[c.pais]?.cor || "var(--tinta)"}"></i>
      <div class="meio"><div class="t">${h(c.nome)}</div><div class="s">${h(c.papel || c.cidade || "")}</div><div class="s quebra">${h(c.endereco || "")}</div></div>
      <div class="contato-botoes">
        ${c.endereco ? `<a class="botao-redondo" href="${h(urlMapa(c.nome + ", " + c.endereco))}" target="_blank" rel="noopener" aria-label="Mapa de ${h(c.nome)}">${I.mapa}</a>` : ""}
        ${c.tel ? `<a class="botao-redondo cheio" href="${telLimpo(c.tel)}" aria-label="Ligar para ${h(c.nome)}">${I.tel}</a>` : ""}
      </div>
    </div>`;
  $app.innerHTML = `
  <main class="tela">
    ${topoSubapp("Emergência")}
    <section class="sos ${PAISES[agora].claro ? "claro" : ""}" style="--pais:${PAISES[agora].cor}">
      <div class="sos-rot">EMERGÊNCIA ${h(NOME_PAIS_EM[agora].toUpperCase())}</div>
      <div class="sos-numeros">${pAgora.numeros.filter((n) => n[2]).map(([num, desc]) => `<a class="sos-numero" href="${telLimpo(num)}"><b>${h(num)}</b><span>${h(desc)}</span></a>`).join("")}</div>
    </section>

    <div class="rotulo">Seguro viagem</div>
    <div class="info">
      <div class="info-linha">${ICONE_CAT.seguro}<div><div class="v">${h(S.nome)}</div><div class="r">${h(S.nota)}</div></div></div>
      ${S.telefones.map(([t, d]) => `<a class="info-linha info-tel" href="${telLimpo(t)}">${I.tel}<div><div class="v mono">${h(t)}</div><div class="r">${h(d)}</div></div></a>`).join("")}
      <div class="info-linha">${I.id}<div class="apolices"><div class="r">Apólices (toque para copiar)</div>${S.apolices.map(([quem, n]) => `<span class="localizador menor" role="button" tabindex="0" data-copiar="${h(n)}"><small>${h(quem.toUpperCase())}</small><b>${h(n)}</b></span>`).join("")}</div></div>
    </div>
    <div class="lista-densa">${S.docs.filter((id) => R.docs[id]).map((id) => `<button type="button" class="cart-item" data-doc="${h(id)}"><span class="ic" style="background:var(--linha-2)">${I.pdf}</span><span class="meio"><span class="t">${h(R.docs[id].titulo || R.docs[id].nome)}</span></span><span class="seta">${I.seta}</span></button>`).join("")}</div>

    <div class="rotulo">Números por país</div>
    ${E.paises.map((p) => `
      <div class="lista-densa numeros-pais">
        <div class="numeros-cab"><i class="barra-pais" style="background:${PAISES[p.pais].cor}"></i>${h(p.nome)}</div>
        ${p.numeros.map(([num, desc]) => `<a class="numero-linha" href="${telLimpo(num)}"><b>${h(num)}</b><span>${h(desc)}</span>${I.tel}</a>`).join("")}
      </div>`).join("")}

    <div class="rotulo">Embaixadas do Brasil</div>
    <div class="lista">${E.embaixadas.map((e) => linhaContato({ nome: e.nome, endereco: e.pais === "BR" ? "" : e.endereco, papel: e.pais === "BR" ? e.endereco : e.tel, tel: e.tel, pais: e.pais })).join("")}</div>

    <div class="rotulo">Onde vamos ficar</div>
    <div class="lista">${contatos.map(linhaContato).join("")}</div>
    <div class="nota">Ligações para números de emergência funcionam com o chip do Brasil em roaming. No Nepal não existe 112: use 100 (polícia) ou 1144 (polícia turística, fala inglês).</div>
  </main>`;
}

/* ---------- Frases úteis ---------- */
const BANDEIRA_IT = '<svg class="bandeira" viewBox="0 0 30 20" aria-hidden="true"><rect width="10" height="20" fill="#009246"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#CE2B37"/></svg>';
const LINGUAS = [
  { id: "hi", nome: "Hindi", onde: "Índia", pais: "IN", voz: ["hi"], bandeira: () => BANDEIRAS.INR },
  { id: "ne", nome: "Nepalês", onde: "Nepal", pais: "NP", voz: ["ne", "hi"], bandeira: () => BANDEIRAS.NPR },
  { id: "it", nome: "Italiano", onde: "Itália", pais: "IT", voz: ["it"], bandeira: () => BANDEIRA_IT },
];
// [português, [hindi, pronúncia], [nepalês, pronúncia], [italiano, pronúncia]]
const FRASES = [
  ["Olá / bom dia", ["नमस्ते", "namastê"], ["नमस्ते", "namastê"], ["Buongiorno", "buondjôrno"]],
  ["Obrigado(a)", ["धन्यवाद", "dhanyavád"], ["धन्यवाद", "dhanyabád"], ["Grazie", "grátsie"]],
  ["Por favor", ["कृपया", "kripayá"], ["कृपया", "kripayá"], ["Per favore", "per favôre"]],
  ["Sim / não", ["हाँ / नहीं", "hãn / nahín"], ["हो / होइन", "hô / hôina"], ["Sì / no", "sí / nó"]],
  ["Com licença / desculpe", ["माफ़ कीजिए", "máf kídjie"], ["माफ गर्नुहोस्", "máf garnuhôs"], ["Scusi", "scúzi"]],
  ["Quanto custa?", ["यह कितने का है?", "iê kitnê ká hê?"], ["यो कति हो?", "iô kati hô?"], ["Quanto costa?", "cuánto cósta?"]],
  ["Está muito caro", ["बहुत महँगा है", "bahut mahangá hê"], ["धेरै महँगो भयो", "dhêrai mahangô bhaiô"], ["È troppo caro", "é tróppo káro"]],
  ["Pode fazer um desconto?", ["थोड़ा कम कीजिए", "thorá kam kídjie"], ["अलि कम गर्नुहोस्", "áli kam garnuhôs"], ["Può fare uno sconto?", "puó fáre úno scônto?"]],
  ["Pouco apimentado, por favor", ["कम मिर्च, प्लीज़", "kam mirtch, plíz"], ["पिरो कम गर्नुहोस्", "pirô kam garnuhôs"], ["Non piccante, per favore", "non piccánte, per favôre"]],
  ["Água de garrafa", ["बोतल वाला पानी", "bôtal válá páni"], ["बोतलको पानी", "bôtal-kô páni"], ["Acqua naturale", "ácua naturále"]],
  ["A conta, por favor", ["बिल दीजिए", "bil dídjie"], ["बिल दिनुहोस्", "bil dinuhôs"], ["Il conto, per favore", "il cônto, per favôre"]],
  ["Onde fica o banheiro?", ["टॉयलेट कहाँ है?", "tóilet kahãn hê?"], ["ट्वाइलेट कहाँ छ?", "tuáilet kahãn tchá?"], ["Dov'è il bagno?", "dové il bánho?"]],
  ["Sou vegetariano(a)", ["मैं शाकाहारी हूँ", "mãin xákahári hûn"], ["म शाकाहारी हुँ", "ma xákahári hun"], ["Sono vegetariano / vegetariana", "sôno vedjetariáno / vedjetariána"]],
  ["Muito gostoso!", ["बहुत स्वादिष्ट!", "bahut suádisht!"], ["मिठो छ!", "mitthô tchá!"], ["Buonissimo!", "buoníssimo!"]],
  ["Socorro!", ["बचाओ!", "batcháo!"], ["बचाउनुहोस्!", "batcháunuhôs!"], ["Aiuto!", "aiúto!"]],
  ["Me leve a este endereço", ["मुझे यहाँ ले चलिए", "mudjhê iahãn lê tchalie"], ["मलाई यहाँ लैजानुहोस्", "malái iahãn laidjánuhôs"], ["Mi porti a questo indirizzo", "mi pórti a cuésto indiríttso"]],
  ["Preciso de um médico", ["मुझे डॉक्टर चाहिए", "mudjhê dóktar tcháhie"], ["मलाई डाक्टर चाहियो", "malái dáktar tcháhiô"], ["Ho bisogno di un medico", "ó bizônho di un médico"]],
  ["Até logo", ["फिर मिलेंगे", "phir milênguê"], ["फेरि भेटौँला", "phêri bhetáunlá"], ["Arrivederci", "arrivedértchi"]],
];
const I_OUVIR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
let frasesLingua = null;
try { window.speechSynthesis?.getVoices(); } catch {}
function falar(texto, lingua) {
  const ss = window.speechSynthesis;
  if (!ss || typeof SpeechSynthesisUtterance === "undefined") return avisar("Este celular não tem leitura em voz alta.");
  ss.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  const vozes = ss.getVoices();
  let voz = null;
  for (const q of lingua.voz) { voz = vozes.find((v) => v.lang.toLowerCase().replace("_", "-").startsWith(q)); if (voz) break; }
  u.lang = voz ? voz.lang : ({ hi: "hi-IN", ne: "hi-IN", it: "it-IT" }[lingua.id]);
  if (voz) u.voice = voz;
  u.rate = 0.8;
  u.onerror = () => avisar("Não consegui tocar. Veja se a voz do idioma está instalada no celular.");
  ss.speak(u);
}
function telaFrases() {
  if (!frasesLingua) frasesLingua = { IN: "hi", NP: "ne", IT: "it" }[paisAgora()] || "hi";
  const L = LINGUAS.find((l) => l.id === frasesLingua);
  const col = LINGUAS.indexOf(L) + 1;
  $app.innerHTML = `
  <main class="tela">
    ${topoSubapp("Frases")}
    <div class="linguas" role="group" aria-label="Idioma">
      ${LINGUAS.map((l) => `<button type="button" data-lingua="${l.id}" aria-pressed="${l.id === L.id}">${l.bandeira()}<span><b>${h(l.nome)}</b><small>${h(l.onde)}</small></span></button>`).join("")}
    </div>
    <div class="frases">
      ${FRASES.map((f, i) => `
        <div class="frase">
          <div class="frase-pt">${h(f[0])}</div>
          <div class="frase-orig" lang="${L.id}">${h(f[col][0])}</div>
          <div class="frase-pron">${h(f[col][1])}</div>
          <button type="button" class="frase-ouvir" data-falar="${i}" aria-label="Ouvir: ${h(f[0])}">${I_OUVIR}</button>
        </div>`).join("")}
    </div>
    <div class="nota">A pronúncia está escrita do jeito que se lê em português; a sílaba com acento é a mais forte. O botão de ouvir usa a voz do próprio celular${L.id === "ne" ? " (o nepalês sai com a voz do hindi, que usa a mesma escrita)" : ""}. Se ficar mudo, instale a voz do idioma nas configurações de texto para fala.</div>
  </main>`;
  $app.querySelectorAll("[data-lingua]").forEach((b) => b.addEventListener("click", () => { frasesLingua = b.dataset.lingua; telaFrases(); }));
  $app.querySelectorAll("[data-falar]").forEach((b) => b.addEventListener("click", () => falar(FRASES[Number(b.dataset.falar)][col][0], L)));
}

/* ---------- Mala (checklist; cada celular guarda o seu) ---------- */
let MALA = null;
let malaSoPendentes = false;
const BOLSAS = {
  mao: { nome: "Bagagem de mão", cor: "#1F5FBF", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6.5V5a3 3 0 0 1 6 0v1.5"/><rect x="5" y="6.5" width="14" height="14.5" rx="4"/><path d="M8.5 14h7v4h-7zM8.5 11h7"/></svg>' },
  despachar: { nome: "Pode ir despachada", cor: "#1B1B1F", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6V3.5h6V6"/><rect x="5.5" y="6" width="13" height="13" rx="2.5"/><path d="M9.5 9.5v6M14.5 9.5v6"/><circle cx="8.5" cy="21" r="1"/><circle cx="15.5" cy="21" r="1"/></svg>' },
  proibido: { nome: "Proibido na bagagem de mão", cor: "#C3122F", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>' },
  dica: { nome: "Dica", cor: "#A3560A", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>' },
};
const ICONES_MALA = {
  documentos: '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M8.5 16.5h7"/>',
  remedios: '<rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-40 12 12)"/><path d="M9.6 9.1l4.8 5.8"/>',
  toilette: '<path d="M10 3h4M10.5 3v3L8 8.5V19a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8.5L13.5 6V3"/><path d="M8 13h8"/>',
  roupas: '<path d="M8.5 3.5L3.5 6.5l2 4 2.5-1V20.5h8V9.5l2.5 1 2-4-5-3a3.5 3.5 0 0 1-7 0z"/>',
  intima: '<path d="M9 3h6.5v8.5l-4.5 7.2a3 3 0 0 1-5.1-3.1L9 11z"/><path d="M9 7h6.5"/>',
  calcados: '<path d="M3 17.5v-7l4 1.5 3-4 3.5 3.5c2 1.8 4.8 2 6.6 3a2 2 0 0 1 .9 1.7v1.3z"/><path d="M3 17.5h18M12 11l1.5-1.5"/>',
  acessorios: '<circle cx="12" cy="12" r="5"/><path d="M9.2 7.8L10 3h4l.8 4.8M9.2 16.2L10 21h4l.8-4.8M12 10v2l1.5 1"/>',
  olhos: '<path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eletronicos: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
  fotos: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
  papelaria: '<path d="M16 3.5l4.5 4.5L9 19.5H4.5V15z"/><path d="M13.5 6l4.5 4.5"/>',
  diversos: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  alimentos: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2 1.5-3 4-3 7h3"/>',
  praia: '<path d="M3 11a9 9 0 0 1 18 0z"/><path d="M12 11v7.5a2 2 0 0 0 4 0"/>',
  aventura: '<path d="M2.5 20l6.5-12 4 6.5 2.5-3.5 6 9z"/><path d="M7 11.5l2 1 1.5-1"/>',
  barraca: '<path d="M2.5 20L12 4l9.5 16z"/><path d="M12 11l-3.5 9M12 11l3.5 9"/>',
  limpeza: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
  diversao: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.1"/><circle cx="15" cy="9" r="1.1"/><circle cx="12" cy="12" r="1.1"/><circle cx="9" cy="15" r="1.1"/><circle cx="15" cy="15" r="1.1"/>',
  dicas: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
};
const iconeMala = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONES_MALA[k] || ICONES_MALA.diversos}</svg>`;
const COR_GRUPO = { viagem: "#2D4BA0", camping: "#0D7A48", dicas: "#A3560A" };
const GRUPOS_MALA = [["viagem", "Viagem"], ["camping", "Camping"], ["dicas", "Antes de viajar"]];
const lerMarcas = () => { try { return JSON.parse(lerLS(LS_MALA)) || {}; } catch { return {}; } };
const gravarMarcas = (m) => gravarLS(LS_MALA, JSON.stringify(m));
const pendentesDe = (sec, m) => sec.itens.filter((it) => !m[it.id]).length;
const textoPendentes = (p, t) => (p === 0 ? `${t} de ${t} resolvidos` : `${p} de ${t} pendente${p === 1 ? "" : "s"}`);
const barraProgresso = (p, t, cor) => `<span class="progresso" aria-hidden="true"><i style="width:${t ? Math.round(((t - p) / t) * 100) : 0}%;background:${cor}"></i></span>`;

function telaMala(secId) {
  if (!MALA) {
    $app.innerHTML = `<main class="tela">${topoSubapp("Mala")}<div class="carregando">Abrindo a lista…</div></main>`;
    fetch("mala.json").then((r) => { if (!r.ok) throw 0; return r.json(); })
      .then((j) => { MALA = j; if (location.hash.startsWith("#/mais/mala")) rotear(); })
      .catch(() => { if (location.hash.startsWith("#/mais/mala")) $app.querySelector(".carregando").textContent = "Não consegui abrir a lista. Conecte uma vez à internet."; });
    return;
  }
  const sec = secId && MALA.secoes.find((x) => x.id === secId);
  return sec ? telaMalaSecao(sec) : telaMalaInicio();
}

function telaMalaInicio() {
  const m = lerMarcas();
  const todos = MALA.secoes.flatMap((x) => x.itens);
  const p = todos.filter((it) => !m[it.id]).length;
  $app.innerHTML = `
  <main class="tela">
    ${topoSubapp("Mala")}
    <div class="mala-resumo">
      <div><b>${p}</b> de ${todos.length} itens pendentes</div>
      ${barraProgresso(p, todos.length, "var(--verde)")}
      <div class="nota">Cada celular guarda a sua lista. Marque <b>OK</b> quando o item já estiver na mala e <b>NA</b> quando não se aplica.</div>
    </div>
    <div class="legenda-mala">
      ${["mao", "despachar", "proibido"].map((k) => `<div><span class="bolsa" style="--bolsa:${BOLSAS[k].cor}">${BOLSAS[k].icone}</span><span>${h(BOLSAS[k].nome)}</span></div>`).join("")}
    </div>
    ${GRUPOS_MALA.map(([g, nome]) => {
      const secs = MALA.secoes.filter((x) => x.grupo === g);
      if (!secs.length) return "";
      return `<div class="rotulo">${h(nome)}</div><div class="lista-densa">${secs.map((x) => {
        const pp = pendentesDe(x, m), t = x.itens.length;
        return `<a class="cart-item secao-mala ${pp === 0 ? "feita" : ""}" href="#/mais/mala/${x.id}">
          <span class="ic" style="background:${COR_GRUPO[g]};color:#fff">${iconeMala(x.icone)}</span>
          <span class="meio"><span class="t">${h(x.nome)}</span><span class="s">${h(textoPendentes(pp, t))}</span>${barraProgresso(pp, t, COR_GRUPO[g])}</span>
          <span class="seta">${pp === 0 ? `<span class="feito-ok">${I.ok}</span>` : I.seta}</span>
        </a>`;
      }).join("")}</div>`;
    }).join("")}
    <button type="button" class="rodape-acao" id="mala-limpar">Recomeçar a lista deste celular</button>
  </main>`;
  document.getElementById("mala-limpar").addEventListener("click", () => {
    const antes = lerMarcas();
    if (!Object.keys(antes).length) return avisar("A lista já está zerada.");
    gravarMarcas({});
    telaMalaInicio();
    avisar("Lista zerada.", { rotulo: "Desfazer", tempo: 7000, fazer: () => { gravarMarcas(antes); rotear(); } });
  });
}

function itemMala(it, m) {
  const b = BOLSAS[it.t] || BOLSAS.despachar;
  const est = m[it.id] || "";
  return `<div class="mala-item ${it.t === "dica" ? "dica" : ""}" data-item="${h(it.id)}" data-estado="${est}">
    <span class="bolsa" style="--bolsa:${b.cor}" title="${h(b.nome)}" role="img" aria-label="${h(b.nome)}">${b.icone}</span>
    <div class="meio"><div class="t">${h(it.n)}</div>${it.nota ? `<div class="s">${h(it.nota)}</div>` : ""}</div>
    <button type="button" class="marca marca-ok" data-marca="ok" aria-pressed="${est === "ok"}" aria-label="OK, já está na mala">OK</button>
    <button type="button" class="marca marca-na" data-marca="na" aria-pressed="${est === "na"}" aria-label="Não se aplica">NA</button>
  </div>`;
}

function telaMalaSecao(sec) {
  const m = lerMarcas();
  const i = MALA.secoes.indexOf(sec);
  const ant = MALA.secoes[i - 1], prox = MALA.secoes[i + 1];
  const t = sec.itens.length;
  const cor = COR_GRUPO[sec.grupo];
  const tipos = [...new Set(sec.itens.map((it) => it.t))].filter((k) => k !== "dica");
  $app.innerHTML = `
  <main class="tela">
    <a class="voltar" href="#/mais/mala">${I.voltar} Mala</a>
    <div class="secao-topo">
      <span class="subapp-icone mini" style="background:${cor}">${iconeMala(sec.icone)}</span>
      <div><div class="sub-tela">${h(GRUPOS_MALA.find((g) => g[0] === sec.grupo)[1])}</div><h1 class="titulo-tela">${h(sec.nome)}</h1></div>
    </div>
    <div class="mala-resumo">
      <div id="mala-contador"></div>
      <span id="mala-barra"></span>
    </div>
    ${tipos.length > 1 ? `<div class="legenda-mala compacta">${tipos.map((k) => `<div><span class="bolsa" style="--bolsa:${BOLSAS[k].cor}">${BOLSAS[k].icone}</span><span>${h(BOLSAS[k].nome)}</span></div>`).join("")}</div>` : ""}
    <div class="filtros" role="group" aria-label="Mostrar">
      <button type="button" data-filtro="todos" aria-pressed="${!malaSoPendentes}">Todos</button>
      <button type="button" data-filtro="pendentes" aria-pressed="${malaSoPendentes}">Só pendentes</button>
    </div>
    <div class="lista-mala ${malaSoPendentes ? "so-pendentes" : ""}" id="lista-mala">${sec.itens.map((it) => itemMala(it, m)).join("")}</div>
    <div class="tudo-pronto" id="tudo-pronto" hidden>${I.ok} Nada pendente nesta seção.</div>
    <button type="button" class="rodape-acao" id="mala-na">Marcar os pendentes como NA</button>
    <nav class="mala-nav">
      ${ant ? `<a class="botao botao-claro" href="#/mais/mala/${ant.id}">${I.voltar}<span>${h(ant.nome)}</span></a>` : "<span></span>"}
      ${prox ? `<a class="botao botao-tinta" href="#/mais/mala/${prox.id}"><span>${h(prox.nome)}</span>${I.seta}</a>` : `<a class="botao botao-tinta" href="#/mais/mala">Voltar à lista</a>`}
    </nav>
  </main>`;
  const $lista = document.getElementById("lista-mala");
  const atualizarContador = () => {
    const mm = lerMarcas();
    const p = pendentesDe(sec, mm);
    document.getElementById("mala-contador").innerHTML = p === 0 ? `<b>Tudo resolvido</b> · ${t} de ${t}` : `<b>${p}</b> de ${t} pendente${p === 1 ? "" : "s"}`;
    document.getElementById("mala-barra").innerHTML = barraProgresso(p, t, cor);
    document.getElementById("mala-na").hidden = p === 0;
    document.getElementById("tudo-pronto").hidden = !(malaSoPendentes && p === 0);
  };
  atualizarContador();
  $lista.addEventListener("click", (e) => {
    const bt = e.target.closest("[data-marca]");
    if (!bt) return;
    const linha = bt.closest("[data-item]");
    const id = linha.dataset.item;
    const mm = lerMarcas();
    const novo = mm[id] === bt.dataset.marca ? "" : bt.dataset.marca;
    if (novo) mm[id] = novo; else delete mm[id];
    gravarMarcas(mm);
    linha.dataset.estado = novo;
    linha.querySelectorAll("[data-marca]").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.marca === novo)));
    linha.classList.remove("saindo");
    if (malaSoPendentes && novo) { linha.classList.add("saindo"); setTimeout(() => linha.classList.remove("saindo"), 700); }
    atualizarContador();
  });
  $app.querySelectorAll("[data-filtro]").forEach((b) => b.addEventListener("click", () => {
    malaSoPendentes = b.dataset.filtro === "pendentes";
    $app.querySelectorAll("[data-filtro]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $lista.classList.toggle("so-pendentes", malaSoPendentes);
    atualizarContador();
  }));
  document.getElementById("mala-na").addEventListener("click", () => {
    const antes = lerMarcas();
    const mm = { ...antes };
    const ids = sec.itens.filter((it) => !mm[it.id]).map((it) => it.id);
    ids.forEach((id) => (mm[id] = "na"));
    gravarMarcas(mm);
    telaMalaSecao(sec);
    avisar(`${ids.length} ${ids.length === 1 ? "item marcado" : "itens marcados"} como NA.`, { rotulo: "Desfazer", tempo: 7000, fazer: () => { gravarMarcas(antes); rotear(); } });
  });
}

/* ---------- roteamento ---------- */
function marcarAba(nome) {
  $abas.querySelectorAll("a").forEach((a) => (a.dataset.aba === nome ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
}
function rotear() {
  if (!R) return;
  const partes = (location.hash || "#/hoje").slice(2).split("/");
  const [rota, a, b] = partes;
  if (rota === "dia" && a && b !== undefined) { marcarAba("roteiro"); return telaAtividade(a, Number(b)); }
  if (rota === "dia" && a) { marcarAba("roteiro"); return telaDia(a); }
  if (rota === "roteiro") { marcarAba("roteiro"); return telaRoteiro(); }
  if (rota === "carteira") { marcarAba("carteira"); return telaCarteira(); }
  if (rota === "cambio") { marcarAba("cambio"); return telaCambio(); }
  if (rota === "mais") { marcarAba("mais"); const s = SUBAPPS.find((x) => x.id === a); return s ? s.tela(b) : telaMais(); }
  marcarAba("hoje");
  telaHoje();
}

async function entrar() {
  $app.innerHTML = '<div class="carregando">Abrindo o roteiro…</div>';
  await carregarRoteiro();
  await carregarCambio();
  $abas.hidden = false;
  rotear();
  window.addEventListener("hashchange", () => { rotear(); window.scrollTo(0, 0); });
  atualizarTempo();
  guardarOffline();
}

async function iniciar() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then((reg) => {
      reg.addEventListener("updatefound", () => {
        const novo = reg.installing;
        novo?.addEventListener("statechange", () => {
          if (novo.state === "installed" && navigator.serviceWorker.controller) {
            avisar("Nova versão do app disponível.", { rotulo: "Atualizar", fazer: () => location.reload() });
          }
        });
      });
    }).catch(() => {});
  }
  IDENT = lerLS(LS_CHAVE);
  if (!IDENT) return telaBloqueio();
  try {
    await entrar();
  } catch (e) {
    console.error(e);
    if (String(e).includes("fetch") || String(e).includes("baixar")) {
      $app.innerHTML = '<div class="carregando">Sem internet e sem cópia guardada do roteiro.<br>Conecte uma vez para baixar.</div>';
    } else {
      apagarLS(LS_CHAVE);
      telaBloqueio("A chave do cofre mudou. Digite a senha nova.");
    }
  }
}
iniciar();
