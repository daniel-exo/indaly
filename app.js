import { Decrypter } from "./vendor/age.js";

const VERSAO_APP = "v32";

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
  motorista: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M7 10h10M7 14h6"/></svg>',
  externo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
};

const TEMPO_ICONES = {
  sol: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  parcial: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4.5V3M3.5 9H2M4.5 5.5l-1-1M12.5 5.5l1-1"/><path d="M5.2 11.5A4 4 0 1 1 12 7.6"/><path d="M7 20h10a4 4 0 0 0 0-8 5 5 0 0 0-9.6 1.5A3.3 3.3 0 0 0 7 20z"/></svg>',
  nuvem: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 19h10a4.5 4.5 0 0 0 .5-9A6 6 0 0 0 6 11.5 3.8 3.8 0 0 0 7 19z"/></svg>',
  neblina: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h16M3 13h18M5 17h14"/></svg>',
  chuva: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 15h10a4 4 0 0 0 .4-8A5.5 5.5 0 0 0 6.5 9 3.2 3.2 0 0 0 7 15z"/><path d="M9 18l-1 2.5M13 18l-1 2.5M17 18l-1 2.5"/></svg>',
  tempestade: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14h10a4 4 0 0 0 .4-8A5.5 5.5 0 0 0 6.5 8 3.2 3.2 0 0 0 7 14z"/><path d="M12.5 15l-2 3.5h3l-2 3.5"/></svg>',
  lua: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/></svg>',
  "lua-parcial": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 8.2A4 4 0 0 1 9 3.6a4.6 4.6 0 1 0 4.5 4.6z"/><path d="M7 20h10a4 4 0 0 0 0-8 5 5 0 0 0-9.6 1.5A3.3 3.3 0 0 0 7 20z"/></svg>',
  neve: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/></svg>',
};
function climaDe(cod, noite = false) {
  if (cod === 0) return [noite ? "lua" : "sol", "Céu limpo"];
  if (cod <= 2) return [noite ? "lua-parcial" : "parcial", "Poucas nuvens"];
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
// blocos de data e ícones da carteira: cor cheia do país (texto escuro nas cores claras)
const corBloco = (p) => `background:${p.cor};color:${p.claro ? "#14224F" : "#FFFFFF"}`;
const OURO = { nome: "Brasil", cor: "#F2C230", tint: "#FBEFC4", claro: true };

/* o cachorro do Indaly (logo). Desenho gerado por ferramentas/cao.py */
const CAO = '<path d="M50 22 C66 22 75 32 75 46 C75 54 72 60 67 64 C63 70 57 74 50 74 C43 74 37 70 33 64 C28 60 25 54 25 46 C25 32 34 22 50 22 Z" fill="#FFFFFF"/><path d="M62 23 C63.5 21 67 20.5 70.5 21 C76 21.8 81.5 25 84.5 28.5 C86.5 31 86.4 35 85 38 C83.5 41 81.8 43 81.6 46 C81.5 48 80.8 49.6 79.6 49.6 C78.6 49.6 77.4 48.5 76.6 46.5 C74.6 43 72.2 39.5 71.4 35.5 C70.8 32.5 70.2 29.6 68.6 27.8 C66.8 25.6 64.2 24.2 62 23 Z" fill="#FFFFFF" stroke="#EE8A24" stroke-width="2" stroke-linejoin="round"/><path d="M 38 23 C 36.5 21 33 20.5 29.5 21 C 24 21.8 18.5 25 15.5 28.5 C 13.5 31 13.6 35 15 38 C 16.5 41 18.2 43 18.4 46 C 18.5 48 19.2 49.6 20.4 49.6 C 21.4 49.6 22.6 48.5 23.4 46.5 C 25.4 43 27.8 39.5 28.6 35.5 C 29.2 32.5 29.8 29.6 31.4 27.8 C 33.2 25.6 35.8 24.2 38 23 Z" fill="#FFFFFF" stroke="#EE8A24" stroke-width="2" stroke-linejoin="round"/><g class="olho-aberto"><circle cx="40" cy="45" r="3.4" fill="#14224F"/><circle cx="60" cy="45" r="3.4" fill="#14224F"/></g><path d="M42 55 C42 52.5 44 51.5 50 51.5 C56 51.5 58 52.5 58 55 C58 59 54 61 50 61 C46 61 42 59 42 55 Z" fill="#14224F"/><path d="M50 61 V64" stroke="#14224F" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M42 63 C45 66.5 48 66 50 64 C52 66 55 66.5 58 63" fill="none" stroke="#14224F" stroke-width="2" stroke-linecap="round"/><ellipse cx="50" cy="33" rx="2.7" ry="4.4" fill="#EE8A24"/><circle cx="26.00" cy="71.00" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/><circle cx="27.83" cy="77.51" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/><circle cx="33.03" cy="83.02" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/><circle cx="40.82" cy="86.71" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/><circle cx="50.00" cy="88.00" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/><circle cx="59.18" cy="86.71" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/><circle cx="66.97" cy="83.02" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/><circle cx="72.17" cy="77.51" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/><circle cx="74.00" cy="71.00" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/>';
const CAO_OLHOS = '<path d="M50 22 C66 22 75 32 75 46 C75 54 72 60 67 64 C63 70 57 74 50 74 C43 74 37 70 33 64 C28 60 25 54 25 46 C25 32 34 22 50 22 Z" fill="#FFFFFF"/><path d="M62 23 C63.5 21 67 20.5 70.5 21 C76 21.8 81.5 25 84.5 28.5 C86.5 31 86.4 35 85 38 C83.5 41 81.8 43 81.6 46 C81.5 48 80.8 49.6 79.6 49.6 C78.6 49.6 77.4 48.5 76.6 46.5 C74.6 43 72.2 39.5 71.4 35.5 C70.8 32.5 70.2 29.6 68.6 27.8 C66.8 25.6 64.2 24.2 62 23 Z" fill="#FFFFFF" stroke="#EE8A24" stroke-width="2" stroke-linejoin="round"/><path d="M 38 23 C 36.5 21 33 20.5 29.5 21 C 24 21.8 18.5 25 15.5 28.5 C 13.5 31 13.6 35 15 38 C 16.5 41 18.2 43 18.4 46 C 18.5 48 19.2 49.6 20.4 49.6 C 21.4 49.6 22.6 48.5 23.4 46.5 C 25.4 43 27.8 39.5 28.6 35.5 C 29.2 32.5 29.8 29.6 31.4 27.8 C 33.2 25.6 35.8 24.2 38 23 Z" fill="#FFFFFF" stroke="#EE8A24" stroke-width="2" stroke-linejoin="round"/><g class="olho-aberto"><circle cx="40" cy="45" r="3.4" fill="#14224F"/><circle cx="60" cy="45" r="3.4" fill="#14224F"/></g><g class="olho-fechado"><path d="M36.2 44.6 Q40 48.4 43.8 44.6" fill="none" stroke="#14224F" stroke-width="2.3" stroke-linecap="round"/><path d="M56.2 44.6 Q60 48.4 63.8 44.6" fill="none" stroke="#14224F" stroke-width="2.3" stroke-linecap="round"/></g><path d="M42 55 C42 52.5 44 51.5 50 51.5 C56 51.5 58 52.5 58 55 C58 59 54 61 50 61 C46 61 42 59 42 55 Z" fill="#14224F"/><path d="M50 61 V64" stroke="#14224F" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M42 63 C45 66.5 48 66 50 64 C52 66 55 66.5 58 63" fill="none" stroke="#14224F" stroke-width="2" stroke-linecap="round"/><ellipse cx="50" cy="33" rx="2.7" ry="4.4" fill="#EE8A24"/><circle cx="26.00" cy="71.00" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/><circle cx="27.83" cy="77.51" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/><circle cx="33.03" cy="83.02" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/><circle cx="40.82" cy="86.71" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/><circle cx="50.00" cy="88.00" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/><circle cx="59.18" cy="86.71" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/><circle cx="66.97" cy="83.02" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/><circle cx="72.17" cy="77.51" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/><circle cx="74.00" cy="71.00" r="5" fill="#FFFFFF" stroke="#EE8A24" stroke-width="1.8"/>';
const CAO_FRASE = '<path d="M50 22 C66 22 75 32 75 46 C75 54 72 60 67 64 C63 70 57 74 50 74 C43 74 37 70 33 64 C28 60 25 54 25 46 C25 32 34 22 50 22 Z" fill="#FFFFFF"/><path d="M62 23 C63.5 21 67 20.5 70.5 21 C76 21.8 81.5 25 84.5 28.5 C86.5 31 86.4 35 85 38 C83.5 41 81.8 43 81.6 46 C81.5 48 80.8 49.6 79.6 49.6 C78.6 49.6 77.4 48.5 76.6 46.5 C74.6 43 72.2 39.5 71.4 35.5 C70.8 32.5 70.2 29.6 68.6 27.8 C66.8 25.6 64.2 24.2 62 23 Z" fill="#FFFFFF" stroke="#14224F" stroke-width="2" stroke-linejoin="round"/><path d="M 38 23 C 36.5 21 33 20.5 29.5 21 C 24 21.8 18.5 25 15.5 28.5 C 13.5 31 13.6 35 15 38 C 16.5 41 18.2 43 18.4 46 C 18.5 48 19.2 49.6 20.4 49.6 C 21.4 49.6 22.6 48.5 23.4 46.5 C 25.4 43 27.8 39.5 28.6 35.5 C 29.2 32.5 29.8 29.6 31.4 27.8 C 33.2 25.6 35.8 24.2 38 23 Z" fill="#FFFFFF" stroke="#14224F" stroke-width="2" stroke-linejoin="round"/><g class="olho-aberto"><circle cx="40" cy="45" r="3.4" fill="#14224F"/><circle cx="60" cy="45" r="3.4" fill="#14224F"/></g><path d="M42 55 C42 52.5 44 51.5 50 51.5 C56 51.5 58 52.5 58 55 C58 59 54 61 50 61 C46 61 42 59 42 55 Z" fill="#14224F"/><path d="M50 61 V64" stroke="#14224F" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M42 63 C45 66.5 48 66 50 64 C52 66 55 66.5 58 63" fill="none" stroke="#14224F" stroke-width="2" stroke-linecap="round"/><ellipse cx="50" cy="33" rx="2.7" ry="4.4" fill="#EE8A24"/><circle cx="26.00" cy="71.00" r="5" fill="#FFFFFF" stroke="#14224F" stroke-width="1.8"/><circle cx="27.83" cy="77.51" r="5" fill="#FFFFFF" stroke="#14224F" stroke-width="1.8"/><circle cx="33.03" cy="83.02" r="5" fill="#FFFFFF" stroke="#14224F" stroke-width="1.8"/><circle cx="40.82" cy="86.71" r="5" fill="#FFFFFF" stroke="#14224F" stroke-width="1.8"/><circle cx="50.00" cy="88.00" r="5" fill="#FFFFFF" stroke="#14224F" stroke-width="1.8"/><circle cx="59.18" cy="86.71" r="5" fill="#FFFFFF" stroke="#14224F" stroke-width="1.8"/><circle cx="66.97" cy="83.02" r="5" fill="#FFFFFF" stroke="#14224F" stroke-width="1.8"/><circle cx="72.17" cy="77.51" r="5" fill="#FFFFFF" stroke="#14224F" stroke-width="1.8"/><circle cx="74.00" cy="71.00" r="5" fill="#FFFFFF" stroke="#14224F" stroke-width="1.8"/>';
const CAO_SEM_GUIRLANDA = '<path d="M50 22 C66 22 75 32 75 46 C75 54 72 60 67 64 C63 70 57 74 50 74 C43 74 37 70 33 64 C28 60 25 54 25 46 C25 32 34 22 50 22 Z" fill="#FFFFFF"/><path d="M62 23 C63.5 21 67 20.5 70.5 21 C76 21.8 81.5 25 84.5 28.5 C86.5 31 86.4 35 85 38 C83.5 41 81.8 43 81.6 46 C81.5 48 80.8 49.6 79.6 49.6 C78.6 49.6 77.4 48.5 76.6 46.5 C74.6 43 72.2 39.5 71.4 35.5 C70.8 32.5 70.2 29.6 68.6 27.8 C66.8 25.6 64.2 24.2 62 23 Z" fill="#FFFFFF" stroke="#C3122F" stroke-width="2" stroke-linejoin="round"/><path d="M 38 23 C 36.5 21 33 20.5 29.5 21 C 24 21.8 18.5 25 15.5 28.5 C 13.5 31 13.6 35 15 38 C 16.5 41 18.2 43 18.4 46 C 18.5 48 19.2 49.6 20.4 49.6 C 21.4 49.6 22.6 48.5 23.4 46.5 C 25.4 43 27.8 39.5 28.6 35.5 C 29.2 32.5 29.8 29.6 31.4 27.8 C 33.2 25.6 35.8 24.2 38 23 Z" fill="#FFFFFF" stroke="#C3122F" stroke-width="2" stroke-linejoin="round"/><g class="olho-aberto"><circle cx="40" cy="45" r="3.4" fill="#14224F"/><circle cx="60" cy="45" r="3.4" fill="#14224F"/></g><path d="M42 55 C42 52.5 44 51.5 50 51.5 C56 51.5 58 52.5 58 55 C58 59 54 61 50 61 C46 61 42 59 42 55 Z" fill="#14224F"/><path d="M50 61 V64" stroke="#14224F" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M42 63 C45 66.5 48 66 50 64 C52 66 55 66.5 58 63" fill="none" stroke="#14224F" stroke-width="2" stroke-linecap="round"/><ellipse cx="50" cy="33" rx="2.7" ry="4.4" fill="#EE8A24"/>';
// silhueta do cachorro (cabeça e orelhas, sem guirlanda, olhos e boca), para ícones pequenos
const SILHUETA_CAO = '<path d="M50 22 C66 22 75 32 75 46 C75 54 72 60 67 64 C63 70 57 74 50 74 C43 74 37 70 33 64 C28 60 25 54 25 46 C25 32 34 22 50 22 Z"/><path d="M62 23 C63.5 21 67 20.5 70.5 21 C76 21.8 81.5 25 84.5 28.5 C86.5 31 86.4 35 85 38 C83.5 41 81.8 43 81.6 46 C81.5 48 80.8 49.6 79.6 49.6 C78.6 49.6 77.4 48.5 76.6 46.5 C74.6 43 72.2 39.5 71.4 35.5 C70.8 32.5 70.2 29.6 68.6 27.8 C66.8 25.6 64.2 24.2 62 23 Z"/><path d="M38 23 C36.5 21 33 20.5 29.5 21 C24 21.8 18.5 25 15.5 28.5 C13.5 31 13.6 35 15 38 C16.5 41 18.2 43 18.4 46 C18.5 48 19.2 49.6 20.4 49.6 C21.4 49.6 22.6 48.5 23.4 46.5 C25.4 43 27.8 39.5 28.6 35.5 C29.2 32.5 29.8 29.6 31.4 27.8 C33.2 25.6 35.8 24.2 38 23 Z"/>';
const CAO_COMIDA = '<path d="M50 22 C66 22 75 32 75 46 C75 54 72 60 67 64 C63 70 57 74 50 74 C43 74 37 70 33 64 C28 60 25 54 25 46 C25 32 34 22 50 22 Z" fill="#FFFFFF"/><path d="M62 23 C63.5 21 67 20.5 70.5 21 C76 21.8 81.5 25 84.5 28.5 C86.5 31 86.4 35 85 38 C83.5 41 81.8 43 81.6 46 C81.5 48 80.8 49.6 79.6 49.6 C78.6 49.6 77.4 48.5 76.6 46.5 C74.6 43 72.2 39.5 71.4 35.5 C70.8 32.5 70.2 29.6 68.6 27.8 C66.8 25.6 64.2 24.2 62 23 Z" fill="#FFFFFF" stroke="#D6457A" stroke-width="2" stroke-linejoin="round"/><path d="M 38 23 C 36.5 21 33 20.5 29.5 21 C 24 21.8 18.5 25 15.5 28.5 C 13.5 31 13.6 35 15 38 C 16.5 41 18.2 43 18.4 46 C 18.5 48 19.2 49.6 20.4 49.6 C 21.4 49.6 22.6 48.5 23.4 46.5 C 25.4 43 27.8 39.5 28.6 35.5 C 29.2 32.5 29.8 29.6 31.4 27.8 C 33.2 25.6 35.8 24.2 38 23 Z" fill="#FFFFFF" stroke="#D6457A" stroke-width="2" stroke-linejoin="round"/><g class="olho-aberto"><circle cx="40" cy="45" r="3.4" fill="#14224F"/><circle cx="60" cy="45" r="3.4" fill="#14224F"/></g><g transform="translate(28.56 40.66) scale(0.0575)"><path d="M238.0 477.6C222.6 472.1 211.5 463.8 202.6 451.2C199.5 446.8 197.0 442.8 197.0 442.3C197.0 441.9 196.1 439.8 195.1 437.9C189.3 427.1 187.5 397.6 191.7 380.6C199.0 350.5 229.1 334.5 256.0 346.6C263.5 350.0 272.6 359.3 276.5 367.7C279.4 374.2 281.3 387.4 282.8 413.6C283.6 427.4 283.9 429.1 286.5 433.9C292.6 445.1 302.6 451.7 315.0 452.7C318.9 453.0 322.3 453.6 322.5 454.0C323.4 455.5 318.3 461.1 314.2 463.0C292.8 473.2 266.5 463.1 256.1 440.8C250.8 429.4 249.7 422.6 250.2 404.6C250.8 385.3 250.0 382.3 243.5 378.5C241.2 377.1 238.1 376.0 236.5 376.0C232.8 376.0 226.1 379.9 224.5 383.0C219.8 392.1 220.3 428.9 225.4 442.7C229.7 454.6 236.0 465.1 243.6 472.7C246.6 475.7 249.0 478.6 249.0 479.1C249.0 480.6 244.8 480.1 238.0 477.6Z" fill="#E9592C"/><path d="M255.9 509.5C255.6 509.3 251.8 508.6 247.4 508.0C243.1 507.4 237.9 506.3 236.0 505.6C234.1 504.8 230.0 503.5 227.0 502.5C216.4 499.0 201.1 489.6 191.4 480.4C182.8 472.3 168.0 448.4 168.0 442.6C168.0 441.4 167.5 439.9 166.8 439.2C163.9 436.3 161.4 405.1 162.9 390.4C164.6 373.7 165.1 370.7 166.6 368.5C167.4 367.4 168.0 365.9 168.0 365.0C168.0 361.4 177.8 345.4 184.4 338.1C191.5 330.3 207.5 320.2 216.7 317.8C229.1 314.5 248.9 314.9 260.0 318.7C273.7 323.5 290.2 336.5 296.3 347.4C301.4 356.4 303.9 361.6 303.9 363.1C304.0 364.0 304.9 366.7 306.0 369.1C307.5 372.5 308.0 375.8 308.0 383.0C308.1 396.5 309.7 418.1 310.8 421.0C312.4 425.0 318.4 427.7 322.3 426.1C324.1 425.4 326.7 424.5 328.3 424.3C332.2 423.6 342.4 413.1 349.3 402.8C357.9 389.9 358.0 389.4 358.0 371.1C358.0 353.4 357.5 352.0 351.8 352.0C344.9 352.0 325.3 343.4 312.5 334.7C282.7 314.6 260.0 284.0 251.0 252.0C249.3 245.9 248.5 229.3 249.8 226.6C250.4 225.5 251.8 222.4 252.9 219.9C258.9 206.9 280.8 192.4 301.1 188.1C303.0 187.7 305.3 186.9 306.1 186.5C307.6 185.5 313.3 184.5 325.6 183.0C330.1 182.5 334.9 181.6 336.4 181.0C340.7 179.4 401.4 179.7 407.0 181.4C409.5 182.1 413.9 182.8 416.7 182.9C419.6 183.0 423.1 183.5 424.5 184.0C426.0 184.6 428.6 185.0 430.3 185.0C432.1 185.1 434.6 185.7 436.0 186.5C437.4 187.3 439.4 187.9 440.5 188.0C441.6 188.0 445.6 189.2 449.5 190.6C478.6 201.5 493.2 216.9 492.9 236.5C492.8 242.9 490.8 253.9 489.2 256.7C488.6 257.9 488.0 259.6 488.0 260.5C488.0 262.8 483.6 272.8 479.4 280.1C469.8 296.9 458.5 310.9 445.7 321.7C429.4 335.6 418.4 342.5 402.3 348.6C398.6 350.0 393.2 351.5 390.3 351.9C387.4 352.3 384.7 352.9 384.3 353.4C383.9 353.8 383.4 361.1 383.2 369.6C382.9 387.1 383.4 388.9 392.2 402.2C417.9 440.9 455.0 457.9 487.0 445.6C504.7 438.8 522.6 423.4 536.5 402.9C541.4 395.7 551.3 376.2 552.4 371.6C552.8 370.0 554.8 366.9 556.9 364.8C562.3 359.5 568.5 359.3 573.5 364.3C575.4 366.2 577.2 369.0 577.6 370.5C578.4 373.8 575.6 385.6 573.4 388.1C572.6 388.9 572.0 390.2 572.0 390.9C572.0 392.8 562.3 410.6 557.0 418.5C544.5 437.0 524.4 455.7 508.0 464.3C501.0 467.9 490.5 472.0 488.0 472.0C486.6 472.1 484.4 472.7 483.0 473.5C481.1 474.6 476.6 474.9 465.0 474.9C453.4 474.9 448.9 474.6 447.0 473.5C445.6 472.7 443.4 472.0 442.0 472.0C440.6 472.0 437.7 471.1 435.5 470.0C433.3 468.9 430.9 468.1 430.2 468.0C428.4 468.0 412.4 459.2 411.0 457.5C410.3 456.7 409.2 456.0 408.6 456.0C405.4 456.0 377.8 428.0 374.0 421.0C372.3 417.8 369.4 418.6 366.3 423.1C364.8 425.3 361.8 429.2 359.8 431.8C356.8 435.4 356.0 437.3 356.0 440.5C356.0 442.7 354.9 447.7 353.6 451.6C345.0 476.7 326.5 495.7 303.5 503.0C301.3 503.7 298.1 504.8 296.5 505.5C289.9 508.3 257.8 511.5 255.9 509.5ZM253.0 481.7C253.0 481.0 250.5 478.0 247.4 475.0C228.4 456.3 220.6 431.9 223.2 398.5C224.2 385.5 225.1 383.1 230.3 380.0C236.3 376.3 244.6 378.5 247.4 384.5C248.8 387.3 248.9 390.3 248.4 403.7C247.6 421.7 249.2 430.5 255.2 442.3C259.1 450.1 269.6 460.6 277.1 464.3C291.6 471.5 312.9 469.1 321.5 459.3C323.8 456.7 324.9 452.1 323.2 451.9C322.8 451.9 320.2 451.7 317.5 451.6C304.5 450.9 294.1 444.3 288.0 432.8L284.6 426.5L283.9 407.5C283.5 397.1 282.7 386.5 282.1 384.0C281.5 381.5 281.0 378.1 281.0 376.5C280.9 366.6 265.9 348.5 253.8 343.7C243.8 339.7 238.0 339.4 227.6 342.0C214.0 345.4 203.3 353.5 195.9 366.0C190.1 376.0 188.8 381.7 188.3 400.5C187.7 419.4 189.2 428.7 194.7 440.6C203.2 459.3 223.1 476.0 242.1 480.4C245.5 481.2 248.5 482.1 248.8 482.4C249.9 483.5 253.0 483.0 253.0 481.7Z" fill="#14224F" fill-rule="evenodd"/></g><ellipse cx="50" cy="33" rx="2.7" ry="4.4" fill="#EE8A24"/><circle cx="26.00" cy="71.00" r="5" fill="#FFFFFF" stroke="#D6457A" stroke-width="1.8"/><circle cx="27.83" cy="77.51" r="5" fill="#FFFFFF" stroke="#D6457A" stroke-width="1.8"/><circle cx="33.03" cy="83.02" r="5" fill="#FFFFFF" stroke="#D6457A" stroke-width="1.8"/><circle cx="40.82" cy="86.71" r="5" fill="#FFFFFF" stroke="#D6457A" stroke-width="1.8"/><circle cx="50.00" cy="88.00" r="5" fill="#FFFFFF" stroke="#D6457A" stroke-width="1.8"/><circle cx="59.18" cy="86.71" r="5" fill="#FFFFFF" stroke="#D6457A" stroke-width="1.8"/><circle cx="66.97" cy="83.02" r="5" fill="#FFFFFF" stroke="#D6457A" stroke-width="1.8"/><circle cx="72.17" cy="77.51" r="5" fill="#FFFFFF" stroke="#D6457A" stroke-width="1.8"/><circle cx="74.00" cy="71.00" r="5" fill="#FFFFFF" stroke="#D6457A" stroke-width="1.8"/>';
const CAO_FUSO = '<path d="M50 22 C66 22 75 32 75 46 C75 54 72 60 67 64 C63 70 57 74 50 74 C43 74 37 70 33 64 C28 60 25 54 25 46 C25 32 34 22 50 22 Z" fill="#FFFFFF"/><path d="M62 23 C63.5 21 67 20.5 70.5 21 C76 21.8 81.5 25 84.5 28.5 C86.5 31 86.4 35 85 38 C83.5 41 81.8 43 81.6 46 C81.5 48 80.8 49.6 79.6 49.6 C78.6 49.6 77.4 48.5 76.6 46.5 C74.6 43 72.2 39.5 71.4 35.5 C70.8 32.5 70.2 29.6 68.6 27.8 C66.8 25.6 64.2 24.2 62 23 Z" fill="#FFFFFF" stroke="#0D7A48" stroke-width="2" stroke-linejoin="round"/><path d="M 38 23 C 36.5 21 33 20.5 29.5 21 C 24 21.8 18.5 25 15.5 28.5 C 13.5 31 13.6 35 15 38 C 16.5 41 18.2 43 18.4 46 C 18.5 48 19.2 49.6 20.4 49.6 C 21.4 49.6 22.6 48.5 23.4 46.5 C 25.4 43 27.8 39.5 28.6 35.5 C 29.2 32.5 29.8 29.6 31.4 27.8 C 33.2 25.6 35.8 24.2 38 23 Z" fill="#FFFFFF" stroke="#0D7A48" stroke-width="2" stroke-linejoin="round"/><circle cx="40" cy="45" r="3.4" fill="#14224F"/><path d="M56.2 44.6 Q60 48.4 63.8 44.6" fill="none" stroke="#14224F" stroke-width="2.3" stroke-linecap="round"/><path d="M42 55 C42 52.5 44 51.5 50 51.5 C56 51.5 58 52.5 58 55 C58 59 54 61 50 61 C46 61 42 59 42 55 Z" fill="#14224F"/><path d="M50 61 V64" stroke="#14224F" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M42 63 C45 66.5 48 66 50 64 C52 66 55 66.5 58 63" fill="none" stroke="#14224F" stroke-width="2" stroke-linecap="round"/><ellipse cx="50" cy="33" rx="2.7" ry="4.4" fill="#EE8A24"/><circle cx="26.00" cy="71.00" r="5" fill="#FFFFFF" stroke="#0D7A48" stroke-width="1.8"/><circle cx="27.83" cy="77.51" r="5" fill="#FFFFFF" stroke="#0D7A48" stroke-width="1.8"/><circle cx="33.03" cy="83.02" r="5" fill="#FFFFFF" stroke="#0D7A48" stroke-width="1.8"/><circle cx="40.82" cy="86.71" r="5" fill="#FFFFFF" stroke="#0D7A48" stroke-width="1.8"/><circle cx="50.00" cy="88.00" r="5" fill="#FFFFFF" stroke="#0D7A48" stroke-width="1.8"/><circle cx="59.18" cy="86.71" r="5" fill="#FFFFFF" stroke="#0D7A48" stroke-width="1.8"/><circle cx="66.97" cy="83.02" r="5" fill="#FFFFFF" stroke="#0D7A48" stroke-width="1.8"/><circle cx="72.17" cy="77.51" r="5" fill="#FFFFFF" stroke="#0D7A48" stroke-width="1.8"/><circle cx="74.00" cy="71.00" r="5" fill="#FFFFFF" stroke="#0D7A48" stroke-width="1.8"/>';
function caoSVG(tam, { fundo = true, olhos = "abertos", classe = "", rotulo = "" } = {}) {
  const corpo = olhos === "ambos" ? CAO_OLHOS : CAO;
  const a11y = rotulo ? `role="img" aria-label="${h(rotulo)}"` : 'aria-hidden="true"';
  return `<svg class="cao ${classe}" width="${tam}" height="${tam}" style="width:${tam}px;height:${tam}px" viewBox="0 0 100 100" ${a11y}>${fundo ? '<rect width="100" height="100" rx="22" fill="#EE8A24"></rect>' : ""}${corpo}</svg>`;
}

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
  if (TEMPO?.v === 2 && Date.now() - TEMPO.em < 3 * 3600 * 1000) return;
  const cidades = [];
  for (const d of R.dias) if (!cidades.find((c) => c.cidade === d.cidade)) cidades.push({ cidade: d.cidade, lat: d.lat, lon: d.lon });
  const url = "https://api.open-meteo.com/v1/forecast?latitude=" + cidades.map((c) => c.lat).join(",") +
    "&longitude=" + cidades.map((c) => c.lon).join(",") +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,uv_index_max" +
    "&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,relative_humidity_2m,is_day" +
    "&timezone=auto&forecast_days=16";
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    let dados = await res.json();
    if (!Array.isArray(dados)) dados = [dados];
    const porCidade = {};
    dados.forEach((d, i) => {
      const m = {};
      const D = d.daily, H = d.hourly;
      D.time.forEach((t, j) => {
        m[t] = { cod: D.weather_code[j], max: D.temperature_2m_max[j], min: D.temperature_2m_min[j], chuva: D.precipitation_probability_max[j], mm: D.precipitation_sum?.[j], vento: D.wind_speed_10m_max?.[j], uv: D.uv_index_max?.[j], horas: [] };
      });
      (H?.time || []).forEach((t, j) => {
        const dia = m[t.slice(0, 10)];
        if (dia) dia.horas.push([Number(t.slice(11, 13)), H.temperature_2m[j], H.apparent_temperature[j], H.precipitation_probability[j], H.precipitation[j], H.weather_code[j], H.wind_speed_10m[j], H.relative_humidity_2m[j], H.is_day[j]]);
      });
      porCidade[cidades[i].cidade] = m;
    });
    TEMPO = { v: 2, em: Date.now(), porCidade };
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
// O resumo diário às vezes vem vazio (ex.: último dia da previsão); nesse caso calcula a partir das horas.
function tempoDoDia(dia) {
  const t = TEMPO?.porCidade?.[dia.cidade]?.[dia.data];
  if (!t) return null;
  const hs = (t.horas || []).filter((x) => x[1] != null);
  const num = (v) => typeof v === "number" && isFinite(v);
  const r = { ...t };
  if (hs.length) {
    if (!num(r.max)) r.max = Math.max(...hs.map((x) => x[1]));
    if (!num(r.min)) r.min = Math.min(...hs.map((x) => x[1]));
    if (!num(r.chuva)) { const ps = hs.map((x) => x[3]).filter(num); r.chuva = ps.length ? Math.max(...ps) : null; }
    if (!num(r.mm)) { const ms = hs.map((x) => x[4]).filter(num); r.mm = ms.length ? ms.reduce((a, b) => a + b, 0) : null; }
    if (!num(r.vento)) { const vs = hs.map((x) => x[6]).filter(num); r.vento = vs.length ? Math.max(...vs) : null; }
    if (!num(r.cod)) { const dia = hs.filter((x) => x[8]).map((x) => x[5]).filter(num); r.cod = dia.length ? Math.max(...dia) : 3; }
  }
  return num(r.max) && num(r.min) ? r : null;
}
function fichaTempo(dia) {
  const t = tempoDoDia(dia);
  if (!t) return "";
  const [ic, txt] = climaDe(t.cod);
  return `<a class="ficha ficha-tempo" href="#/mais/tempo/${dia.data}" title="${h(txt)} · ver hora a hora">${TEMPO_ICONES[ic]} ${Math.round(t.max)}° / ${Math.round(t.min)}°</a>`;
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

/* Visor de PDF com zoom (pinça ou toque duplo). Ao soltar, redesenha as páginas na resolução do zoom,
   para QR codes e códigos de barras ficarem nítidos como num leitor de PDF. */
const ZOOM_MAX = 4;
const PIXELS_MAX = 12e6; // por página; limite seguro para canvas em celulares
async function visorPdf(pdf) {
  $visorCorpo.innerHTML = '<div class="paginas"><div class="paginas-conteudo"></div></div><div class="visor-dica">Aproxime com dois dedos ou toque duas vezes</div>';
  const $rolo = $visorCorpo.querySelector(".paginas");
  const $cont = $rolo.firstChild;
  const largura = Math.min($visorCorpo.clientWidth, 900) - 16;
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const paginas = [];
  let zoom = 1, geracao = 0;
  const cssLargura = () => largura * zoom;
  async function desenhar(p, gen) {
    const base = p.pag.getViewport({ scale: 1 });
    let esc = (cssLargura() / base.width) * dpr;
    const area = base.width * base.height * esc * esc;
    if (area > PIXELS_MAX) esc *= Math.sqrt(PIXELS_MAX / area);
    if (p.esc && Math.abs(p.esc - esc) < 0.01) return;
    const vp = p.pag.getViewport({ scale: esc });
    const c = document.createElement("canvas");
    c.width = Math.floor(vp.width); c.height = Math.floor(vp.height);
    await p.pag.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
    if (gen !== geracao || $visor.hidden) { c.width = 0; return; }
    c.style.width = cssLargura() + "px";
    c.setAttribute("aria-label", p.c.getAttribute("aria-label"));
    p.c.replaceWith(c);
    p.c.width = 0;
    p.c = c; p.esc = esc;
  }
  async function redesenhar() {
    const gen = ++geracao;
    const topo = $rolo.scrollTop, alt = $rolo.clientHeight;
    // primeiro as páginas visíveis, depois as outras
    const ordem = [...paginas].sort((a, b) => {
      const va = a.c.offsetTop + a.c.offsetHeight > topo && a.c.offsetTop < topo + alt ? 0 : 1;
      const vb = b.c.offsetTop + b.c.offsetHeight > topo && b.c.offsetTop < topo + alt ? 0 : 1;
      return va - vb;
    });
    for (const p of ordem) { if (gen !== geracao || $visor.hidden) return; await desenhar(p, gen); }
  }
  function aplicarZoom(novo, fx, fy) {
    // fx, fy: ponto da tela (relativo ao rolo) que deve ficar parado
    novo = Math.min(ZOOM_MAX, Math.max(1, novo));
    const r = novo / zoom;
    const cx = $rolo.scrollLeft + fx, cy = $rolo.scrollTop + fy;
    zoom = novo;
    paginas.forEach((p) => (p.c.style.width = cssLargura() + "px"));
    $rolo.classList.toggle("ampliado", zoom > 1.01);
    $rolo.scrollLeft = cx * r - fx;
    $rolo.scrollTop = cy * r - fy;
    redesenhar();
  }
  for (let n = 1; n <= pdf.numPages; n++) {
    if ($visor.hidden) return;
    const pag = await pdf.getPage(n);
    const c = document.createElement("canvas");
    c.setAttribute("aria-label", `Página ${n} de ${pdf.numPages}`);
    const base = pag.getViewport({ scale: 1 });
    c.width = 1; c.height = 1;
    c.style.width = cssLargura() + "px";
    c.style.aspectRatio = `${base.width} / ${base.height}`;
    $cont.appendChild(c);
    const p = { pag, c, esc: 0 };
    paginas.push(p);
    await desenhar(p, geracao);
  }
  // gestos
  let pinca = null, ultimoToque = 0, ultimoXY = null;
  const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  const relativo = (x, y) => { const b = $rolo.getBoundingClientRect(); return [x - b.left, y - b.top]; };
  $rolo.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
      const [fx, fy] = relativo((e.touches[0].clientX + e.touches[1].clientX) / 2, (e.touches[0].clientY + e.touches[1].clientY) / 2);
      pinca = { d0: dist(e.touches), z0: zoom, fx, fy, z: zoom };
      $cont.style.transformOrigin = `${$rolo.scrollLeft + fx}px ${$rolo.scrollTop + fy}px`;
    }
  }, { passive: true });
  $rolo.addEventListener("touchmove", (e) => {
    if (!pinca || e.touches.length !== 2) return;
    e.preventDefault();
    pinca.z = Math.min(ZOOM_MAX, Math.max(1, (pinca.z0 * dist(e.touches)) / pinca.d0));
    $cont.style.transform = `scale(${pinca.z / pinca.z0})`;
  }, { passive: false });
  $rolo.addEventListener("touchend", (e) => {
    if (pinca && e.touches.length < 2) {
      const { z, fx, fy } = pinca;
      pinca = null;
      $cont.style.transform = "";
      aplicarZoom(z, fx, fy);
      return;
    }
    if (e.touches.length === 0 && e.changedTouches.length === 1) {
      const t = e.changedTouches[0], agora = Date.now();
      if (agora - ultimoToque < 320 && ultimoXY && Math.hypot(t.clientX - ultimoXY[0], t.clientY - ultimoXY[1]) < 30) {
        e.preventDefault();
        const [fx, fy] = relativo(t.clientX, t.clientY);
        aplicarZoom(zoom > 1.01 ? 1 : 2.5, fx, fy);
        ultimoToque = 0;
      } else { ultimoToque = agora; ultimoXY = [t.clientX, t.clientY]; }
    }
  });
  $rolo.addEventListener("dblclick", (e) => { const [fx, fy] = relativo(e.clientX, e.clientY); aplicarZoom(zoom > 1.01 ? 1 : 2.5, fx, fy); });
  $rolo.addEventListener("gesturestart", (e) => e.preventDefault());
  setTimeout(() => $visorCorpo.querySelector(".visor-dica")?.classList.add("some"), 3500);
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
      $visorCorpo.innerHTML = `<img class="visor-img" src="${urlAtual}" alt="${h(doc.nome)}">`;
      const im = $visorCorpo.firstChild;
      // imagem pequena (ex.: cartão com QR) ampliada: sem suavizar, para o QR ficar nítido
      im.onload = () => { if (im.naturalWidth < im.clientWidth * (window.devicePixelRatio || 1) * 0.9) im.classList.add("nitida"); };
      return;
    }
    if (!pdfjs) {
      pdfjs = await import("./vendor/pdf.min.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("./vendor/pdf.worker.min.mjs", import.meta.url).href;
    }
    const pdf = await pdfjs.getDocument({ data: bytes.slice() }).promise;
    await visorPdf(pdf);
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
  if (hosp.docs?.length) botoes.push(`<button type="button" class="botao botao-contorno" data-doc="${h(hosp.docs[0])}">${I.bilhete} Reserva</button>`);
  if (!aviao && hosp.endereco && hosp.endereco !== "Casa") botoes.push(`<button type="button" class="botao botao-contorno" data-ir="${dia.data}|h">${I.carro} Ir até lá</button>`);
  if (hosp.motorista) botoes.push(`<a class="botao botao-contorno" href="#/motorista/${dia.data}/h">${I.motorista} Motorista</a>`);
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
    <div class="marca">${caoSVG(72, { olhos: "ambos", classe: "cao-senha" })}<h1>Indaly</h1></div>
    <p>Índia, Nepal e Itália.<br>Um aplicativo feito sob medida para Marina, Dennis, Luca e Daniel.<br>Digite a senha do grupo uma vez neste celular.</p>
    <form id="form-senha" autocomplete="off">
      <label for="senha">SENHA</label>
      <input id="senha" name="senha" type="password" autocomplete="current-password" placeholder=" " required>
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

/* ficha curta do lugar */
function fichaLugar(f) {
  const lin = [];
  if (f.ver) lin.push(["Não perder", f.ver]);
  if (f.tempo) lin.push(["Quanto tempo", f.tempo]);
  if (f.dica) lin.push(["Dica", f.dica]);
  return `<section class="ficha-lugar">
    <div class="rotulo">Sobre o lugar</div>
    <p>${h(f.sobre)}</p>
    ${lin.length ? `<dl>${lin.map(([r, v]) => `<div><dt>${r}</dt><dd>${h(v)}</dd></div>`).join("")}</dl>` : ""}
  </section>`;
}

/* rota do dia no Google Maps: paradas na ordem do roteiro */
// endereço "de verdade": tem número e tamanho razoável (evita "Casa", "Voo noturno…")
const enderecoValido = (e) => !!e && e.length >= 10 && /\d/.test(e);
const comCidade = (txt, cidade) => (cidade && !txt.toLowerCase().includes(cidade.toLowerCase()) ? `${txt}, ${cidade}` : txt);
const pontoDe = (a, cidade) => {
  if (!a) return null;
  if (a.coords) return `${a.coords[0]},${a.coords[1]}`;
  if (a.mapa) return comCidade(a.mapa, cidade);
  if (enderecoValido(a.endereco)) return a.endereco;
  return null;
};
// hospedagem: coordenadas > nome do hotel no mapa > endereço (casas de amigos vão só pelo endereço)
const pontoHosp = (hp) => (!hp || hp.nome === "Avião" ? null : hp.coords ? `${hp.coords[0]},${hp.coords[1]}` : hp.mapa ? hp.mapa : enderecoValido(hp.endereco) ? hp.endereco : null);
function rotaDoDia(dia, i) {
  const trechos = [[]];
  for (const a of dia.atividades) {
    const p = pontoDe(a, dia.cidade);
    if (p) trechos[trechos.length - 1].push({ p, t: a.titulo });
    if (a.voo) trechos.push([]);
  }
  let k = 0;
  trechos.forEach((t, j) => { if (t.length >= trechos[k].length) k = j; });
  let pontos = trechos[k].slice();
  if (k === 0) { const o = pontoHosp(R.dias[i - 1]?.hospedagem); if (o && !(dia.atividades[0]?.titulo || "").startsWith("Chegada")) pontos.unshift({ p: o, t: "hospedagem" }); }
  if (k === trechos.length - 1) { const f = pontoHosp(dia.hospedagem); if (f) pontos.push({ p: f, t: "hospedagem" }); }
  pontos = pontos.filter((x, j) => j === 0 || x.p !== pontos[j - 1].p);
  if (pontos.length < 2) return null;
  if (pontos.length > 11) pontos = [pontos[0], ...pontos.slice(1, 10), pontos[pontos.length - 1]];
  const meio = pontos.slice(1, -1).map((x) => x.p).join("|");
  const url = "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(pontos[0].p) + "&destination=" + encodeURIComponent(pontos[pontos.length - 1].p) + (meio ? "&waypoints=" + encodeURIComponent(meio) : "");
  return { url, n: pontos.length };
}
function acoesDia(dia, i) {
  const r = rotaDoDia(dia, i);
  if (!dia.nota && !r) return "";
  return `<div class="dia-acoes">
    ${dia.nota ? `<div class="aviso aviso-pendente">${I.pendente}<div>${h(dia.nota)}</div></div>` : ""}
    ${r ? `<a class="botao botao-claro rota-dia" href="${h(r.url)}" target="_blank" rel="noopener">${I.mapa} Rota do dia no mapa <small>${r.n} paradas</small></a>` : ""}
  </div>`;
}

/* dia de voo: horários do aeroporto */
const TZ_AEROPORTO = { GRU: "America/Sao_Paulo", FCO: "Europe/Rome", DEL: "Asia/Kolkata", VNS: "Asia/Kolkata", KTM: "Asia/Kathmandu" };
function agoraApp() {
  const f = new URLSearchParams(location.search).get("agora"); // teste: ?agora=2026-11-10T18:30Z
  const d = f ? new Date(f) : new Date();
  return isNaN(d) ? new Date() : d;
}
function instante(iso, hm, tz) {
  const [y, m, d] = iso.split("-").map(Number), [hh, mm] = hm.split(":").map(Number);
  const chute = Date.UTC(y, m - 1, d, hh, mm);
  return new Date(chute - offsetMin(tz, new Date(chute)) * 60000);
}
function vooEmFoco(agora) {
  for (const dia of R.dias) {
    for (const [n, a] of dia.atividades.entries()) {
      const v = a.voo;
      if (!v) continue;
      const tz = TZ_AEROPORTO[v.de] || dia.fuso;
      const sai = instante(dia.data, v.sai, tz);
      const ap = v.aeroporto || {};
      const inicio = new Date(sai - ((ap.chegar || 180) + 360) * 60000);
      if (agora >= inicio && agora <= new Date(+sai + 20 * 60000)) return { dia, n, a, v, tz, sai, ap };
    }
  }
  return null;
}
const emQuanto = (min) => (min < 60 ? `${min} min` : `${Math.floor(min / 60)}h${String(min % 60).padStart(2, "0")}`);
function cartaoDiaDeVoo(f, agora) {
  const { dia, n, a, v, tz, sai, ap } = f;
  const menos = (min) => new Date(+sai - min * 60000);
  const passos = [];
  if (ap.conexao) {
    const ant = dia.atividades[n - 1];
    if (ant?.hora && ant.titulo.startsWith("Chegada")) passos.push(["Chegada da conexão", instante(dia.data, ant.hora, tz)]);
  } else if (ap.chegar) passos.push(["Chegar ao aeroporto", menos(ap.chegar), "recomendado"]);
  if (ap.checkin) passos.push(["Check-in e despacho fecham", menos(ap.checkin)]);
  if (ap.portao) passos.push(["Portão de embarque fecha", menos(ap.portao)]);
  passos.push(["Decolagem", sai]);
  const prox = passos.findIndex(([, t]) => t > agora);
  const falta = Math.max(0, Math.round((sai - agora) / 60000));
  return `<section class="dia-voo">
    <div class="rot">${falta > 0 ? `DIA DE VOO · DECOLA EM ${emQuanto(falta).toUpperCase()}` : "DIA DE VOO · EMBARQUE AGORA"}</div>
    <div class="t">${h(v.cia)} ${h(v.numero)} · ${h(v.de)} → ${h(v.para)}</div>
    <ol class="passos-voo">${passos.map(([r, t, obs], j) => {
      const st = prox === -1 || j < prox ? "feito" : j === prox ? "agora" : "";
      const min = Math.round((t - agora) / 60000);
      return `<li class="${st}"><b>${horaEm(tz, t)}</b><span>${h(r)}${obs ? ` <small>(${obs})</small>` : ""}</span>${j === prox ? `<em>em ${emQuanto(Math.max(0, min))}</em>` : ""}</li>`;
    }).join("")}</ol>
    <div class="s">Horários locais de ${h(v.de)}${v.terminal ? " · " + h(v.terminal) : ""}</div>
    ${chipLocalizador(v.localizador)}
    <div class="botoes">
      ${a.docs?.length ? `<button type="button" class="botao botao-papel" data-doc="${h(a.docs[0])}">${I.bilhete} Passagem</button>` : ""}
      ${ap.conexao ? `<a class="botao botao-contorno" href="#/dia/${dia.data}/${n}">${I.seta} Detalhes</a>` : `<button type="button" class="botao botao-contorno" data-ir="${dia.data}|${n}">${I.carro} Ir ao aeroporto</button>`}
    </div>
  </section>`;
}

/* foto do dia (aba Hoje): fica trancada no cofre como os documentos */
const FOTOS = new Map();
const fotoDia = (dia) => (dia.foto && R.docs[dia.foto]?.arquivo ? `<div class="foto-dia"><img alt="" data-foto="${h(dia.foto)}"></div>` : "");
async function carregarFotos() {
  for (const img of $app.querySelectorAll("img[data-foto]")) {
    const id = img.dataset.foto;
    try {
      if (!FOTOS.has(id)) {
        const d = R.docs[id];
        FOTOS.set(id, URL.createObjectURL(new Blob([await decifrar(await buscarBytes(d.arquivo))], { type: d.tipo })));
      }
      img.onload = () => img.classList.add("ok");
      img.src = FOTOS.get(id);
    } catch (e) { (img.closest(".rodape-dia") || img.closest(".foto-dia"))?.remove(); }
  }
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
        ${fotoDia(d0)}
        <div class="tracejado"></div>
        <div class="pe">${barra19(-1)}</div>
      </a>
      ${proximosDias(R.dias.slice(0, 4))}`;
  } else if (hoje > R.fim) {
    corpo = `<div class="proximo cao-fim">${caoSVG(84)}<div><div class="rot">VIAGEM CONCLUÍDA</div><div class="t">Bem-vindos de volta!</div></div></div><a class="linha-lista" href="#/roteiro"><div class="meio"><div class="t">Rever o roteiro</div></div><span class="seta">${I.seta}</span></a>`;
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
    const foco = vooEmFoco(agoraApp());
    corpo = `
      <a class="bilhete-mini" href="#/dia/${dia.data}">
        <div class="faixa ${pais.claro ? "claro" : ""}" style="--pais:${pais.cor}">
          <div class="l1"><span>${h(diaCurto(dia.data).toUpperCase())} · ${h(dataMedia(dia.data).toUpperCase())}</span><span>DIA ${i + 1} / ${R.dias.length}</span></div>
          <div class="cidade">${h(dia.cidade)}</div>
          <div class="l3">${h(PAISES[dia.pais].nome)}${dia.hospedagem?.nome && dia.hospedagem.nome !== "Avião" ? " · dormir: " + h(dia.hospedagem.nome) : ""}</div>
        </div>
        ${fotoDia(dia)}
        <div class="tracejado"></div>
        <div class="pe">${barra19(i)}<div class="fichas fichas-claras">${fichaTempo(dia)}</div></div>
      </a>
      ${dia.data === "2026-11-08" ? `<div class="kukur">${caoSVG(48)}<div><b>Hoje é Kukur Tihar</b><span>O dia dos cachorros: em Kathmandu eles ganham guirlanda de flores e tika na testa. Foi daqui que veio o nosso logo.</span></div></div>` : ""}
      ${foco ? cartaoDiaDeVoo(foco, agoraApp()) : `<div class="proximo">
        <div class="rot">${rot === "HOJE" ? "HOJE" : "PRÓXIMO · " + rot}</div>
        <div class="t">${h(a.titulo)}</div>
        <div class="s">${h(a.voo ? [a.hora, linhaVoo(a)].join(" · ") : [a.hora, a.local || a.horario].filter(Boolean).join(" · "))}</div>
        ${a.voo ? chipLocalizador(a.voo.localizador) : ""}
        <div class="botoes">
          <a class="botao botao-papel" href="#/dia/${dia.data}/${destaque.n}">${I.seta} Detalhes</a>
          ${a.docs?.length ? `<button type="button" class="botao botao-contorno" data-doc="${h(a.docs[0])}">${I.bilhete} Documento</button>` : (a.mapa || a.endereco ? `<button type="button" class="botao botao-contorno" data-ir="${dia.data}|${destaque.n}">${I.carro} Ir até lá</button>` : "")}
        </div>
      </div>`}
      ${depois.length ? `<div style="display:flex;justify-content:space-between;align-items:baseline"><h2 class="secao">Depois, hoje</h2><a href="#/dia/${dia.data}" style="font-size:13px;font-weight:600;color:var(--tinta)">Ver o dia todo</a></div>
      <div class="lista">${depois.map((o) => `<a class="linha-lista" href="#/dia/${dia.data}/${o.n}"><span class="ponto-lista" style="background:${pais.cor}"></span><div class="meio"><div class="t">${h(o.x.titulo)}</div><div class="s">${h([textoHora(o.x), subAtividade(o.x)].filter(Boolean).join(" · "))}</div></div><span class="seta">${I.seta}</span></a>`).join("")}</div>` : ""}`;
  }
  const tzLocal = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const nomeLocal = i >= 0 && hoje >= R.inicio && hoje <= R.fim ? R.dias[i].cidade : "aqui";
  $app.innerHTML = `
  <main class="tela">
    <div class="cabeca">
      <div class="marca">${caoSVG(30)}<span>Indaly</span></div>
      <div class="relogios">${tzLocal === "America/Sao_Paulo" ? `<b>${horaEm("America/Sao_Paulo")} São Paulo</b>` : relogios(tzLocal, nomeLocal)}</div>
    </div>
    ${corpo}
    ${instalado() ? "" : `<a class="linha-lista convite" href="#/mais/instalar"><span class="subapp-icone mini" style="background:#C3122F"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M12 7v7M9 11l3 3 3-3"/></svg></span><div class="meio"><div class="t">Instale o Indaly como app</div><div class="s">Ícone na tela inicial e sem barra de endereço</div></div><span class="seta">${I.seta}</span></a>`}
  </main>`;
  carregarFotos();
}

function barra19(ate) {
  const cel = R.dias.map((d, n) => `<i style="background:${ate < 0 || n <= ate ? corDia(d).cor : "var(--linha)"}"></i>`).join("");
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
    <div class="data-bloco" style="${corBloco(p)}"><small>${h(SEM3[dataDe(d.data).getDay()])}</small><b>${h(d.data.slice(8))}</b></div>
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
  ${acoesDia(dia, i)}
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
  ${cartaoHospedagem(dia.hospedagem, dia)}
  ${dia.foto && R.docs[dia.foto]?.arquivo ? `<div class="rodape-dia"><div class="foto-dia"><img alt="" data-foto="${h(dia.foto)}"></div><span>${h(dia.cidade)}</span></div>` : ""}`;
  window.scrollTo(0, 0);
  carregarFotos();
}

/* arrastar a tela para trocar de dia: do lado direito para o centro = próximo dia; do esquerdo = anterior */
(function () {
  let g = null;
  const isoAtual = () => (/^#\/dia\/(\d{4}-\d{2}-\d{2})$/.exec(location.hash) || [])[1];
  document.addEventListener("touchstart", (e) => {
    g = null;
    if (!R || !isoAtual() || e.touches.length !== 1 || !$visor.hidden || document.querySelector(".folha-fundo")) return;
    const t = e.touches[0], W = window.innerWidth;
    const lado = t.clientX > W * 0.62 ? "prox" : t.clientX < W * 0.38 ? "ant" : null;
    if (lado) g = { x0: t.clientX, y0: t.clientY, lado, dx: 0, travado: null };
  }, { passive: true });
  document.addEventListener("touchmove", (e) => {
    if (!g) return;
    const t = e.touches[0], dx = t.clientX - g.x0, dy = t.clientY - g.y0;
    if (g.travado === null && Math.hypot(dx, dy) > 10) g.travado = Math.abs(dx) > Math.abs(dy) * 1.3 && (g.lado === "prox" ? dx < 0 : dx > 0);
    if (!g.travado) return;
    e.preventDefault();
    g.dx = dx;
    const i = idxDia(isoAtual());
    const existe = g.lado === "prox" ? i < R.dias.length - 1 : i > 0;
    $app.style.transition = "none";
    $app.style.transform = `translateX(${existe ? dx * 0.6 : dx * 0.15}px)`;
    $app.style.opacity = String(1 - Math.min(Math.abs(dx) / 700, 0.3));
  }, { passive: false });
  const soltar = () => {
    if (!g || !g.travado) { g = null; return; }
    const i = idxDia(isoAtual());
    const destino = R.dias[g.lado === "prox" ? i + 1 : i - 1];
    const W = window.innerWidth;
    const sinal = g.lado === "prox" ? -1 : 1;
    $app.style.transition = "transform 0.16s ease-out, opacity 0.16s";
    if (destino && Math.abs(g.dx) > Math.min(90, W * 0.22)) {
      $app.style.transform = `translateX(${sinal * W * 0.45}px)`;
      $app.style.opacity = "0";
      setTimeout(() => {
        window.addEventListener("hashchange", () => {
          $app.style.transition = "none";
          $app.style.transform = `translateX(${-sinal * W * 0.3}px)`;
          requestAnimationFrame(() => requestAnimationFrame(() => {
            $app.style.transition = "transform 0.2s ease-out, opacity 0.2s";
            $app.style.transform = "";
            $app.style.opacity = "";
          }));
        }, { once: true });
        location.hash = "#/dia/" + destino.data;
      }, 150);
    } else {
      $app.style.transform = "";
      $app.style.opacity = "";
    }
    g = null;
  };
  document.addEventListener("touchend", soltar);
  document.addEventListener("touchcancel", soltar);
})();

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
      ${a.detalhe ? `<div style="font-size:15px;color:var(--texto-2)">${h(a.detalhe)}</div>` : ""}
      ${etiquetasAtividade({ ...a, alerta: null, pendencia: a.status === "pendente" ? "Pendente" : null })}
    </div>
    ${a.voo ? cartaoVoo(a) : ""}
    ${a.alerta ? `<div class="aviso aviso-alerta">${I.alerta}<div>${h(a.alerta)}</div></div>` : ""}
    ${a.avisos?.length ? `<div class="aviso aviso-pendente avisos">${I.pendente}<div><b>Antes de ir</b><ul>${a.avisos.map((t) => `<li>${h(t)}</li>`).join("")}</ul></div></div>` : ""}
    ${a.ficha ? fichaLugar(a.ficha) : ""}
    ${a.status === "pendente" ? `<div class="aviso aviso-pendente">${I.pendente}<div><b>Pendência:</b> ${h(a.pendencia || "a resolver")}</div></div>` : ""}
    ${linhas.length ? `<div class="info">${linhas.map(([ic, r, v]) => `<div class="info-linha">${ic}<div><div class="r">${r}</div><div class="v">${v}</div></div></div>`).join("")}</div>` : ""}
    <div class="botoes">
      ${a.coords || a.mapa || a.endereco || a.local ? `<button type="button" class="botao botao-tinta" data-ir="${dia.data}|${n}">${I.carro} Ir até lá</button>` : ""}
      ${a.motorista ? `<a class="botao botao-claro" href="#/motorista/${dia.data}/${n}">${I.motorista} Motorista</a>` : ""}
      ${a.docs?.length ? `<button type="button" class="botao botao-claro" data-doc="${h(a.docs[0])}">${I.bilhete} ${a.docs.length > 1 ? "Documentos" : h(rotuloArquivo(R.docs[a.docs[0]].nome))}</button>` : ""}
    </div>
    ${a.docs?.length ? `<div class="rotulo">Documentos</div><div class="lista">${a.docs.map((id) => linhaDoc(id)).join("")}</div>` : ""}
    ${a.notas ? `<div class="aviso aviso-pendente" style="background:var(--cartao);color:var(--tinta)"><div><b>Notas</b> · ${h(a.notas)}</div></div>` : ""}
  </main>`;
  window.scrollTo(0, 0);
}

/* cartão em tela cheia para mostrar ao motorista: nome e endereço na escrita local e em inglês */
const FRASE_MOTORISTA = {
  hi: ["कृपया मुझे यहाँ ले चलिए", "Please take me here"],
  ne: ["कृपया मलाई यहाँ लैजानुहोस्", "Please take me here"],
  it: ["Mi porti qui, per favore", "Por favor, me leve até aqui"],
};
function telaMotorista(iso, n) {
  const dia = R.dias[idxDia(iso)];
  const alvo = n === "h" ? dia?.hospedagem : dia?.atividades[Number(n)];
  const m = alvo?.motorista;
  if (!m) return (location.hash = "#/dia/" + iso);
  const [frase, fraseEn] = FRASE_MOTORISTA[m.lingua] || FRASE_MOTORISTA.hi;
  const pais = corDia(dia);
  const local = m.lingua === "it";
  $app.innerHTML = `
  <main class="motorista" lang="${m.lingua}" style="--pais:${pais.cor};--pais-txt:${pais.claro ? "#14224F" : "#fff"}">
    <div class="motorista-topo">
      <span>${local ? "Mostre ao taxista" : "Mostre ao motorista"}</span>
      <button type="button" class="motorista-fechar" id="motorista-fechar" aria-label="Fechar">✕</button>
    </div>
    <div class="motorista-frase"><b>${h(frase)}</b>${local ? "" : `<span lang="en">${h(fraseEn)}</span>`}</div>
    <div class="motorista-corpo">
      ${local ? `<div class="motorista-nome" lang="it">${h(m.nome)}</div><div class="motorista-area" lang="it">${h(m.area)}</div>` : `
      <div class="motorista-nome">${h(m.nomeLocal)}</div>
      <div class="motorista-area">${h(m.areaLocal)}</div>
      <hr>
      <div class="motorista-nome en" lang="en">${h(m.nome)}</div>
      <div class="motorista-area en" lang="en">${h(m.area)}</div>`}
    </div>
    ${m.fala ? `<button type="button" class="botao motorista-falar" id="motorista-falar">${I_OUVIR} Falar ${{ hi: "em hindi", ne: "em nepalês", it: "em italiano" }[m.lingua]}</button>` : ""}
  </main>`;
  document.getElementById("motorista-falar")?.addEventListener("click", () => falar(m.fala, LINGUAS.find((l) => l.id === m.lingua)));
  document.getElementById("motorista-fechar").addEventListener("click", () => {
    if (history.length > 1) history.back();
    else location.hash = n === "h" ? "#/dia/" + iso : `#/dia/${iso}/${n}`;
  });
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
  { id: "vip", nome: "Salas VIP" },
  { id: "passagem", nome: "Passagens" },
  { id: "hotel", nome: "Hospedagens" },
  { id: "passeio", nome: "Passeios" },
];
const ICONE_CAT = { vip: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18v-6a2 2 0 0 1 4 0v2h8v-2a2 2 0 0 1 4 0v6zM6 10V8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2M6 18v2M18 18v2"/></svg>', seguro: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>', viagem: I.id, passagem: I.aviao, hotel: I.cama, passeio: I.bilhete };

function itemCarteira(c) {
  const pc = c.data ? PAISES[R.dias.find((d) => d.data === c.data)?.pais] || PAISES.BR : PAISES.BR;
  const icone = c.titulo.startsWith("Trem") ? I.trem : ICONE_CAT[c.cat];
  const sub = [c.data ? dataMedia(c.data) : "", c.sub].filter(Boolean).join(" · ");
  const unico = c.docs.length === 1;
  const corpo = `<span class="ic" style="${corBloco(pc)}">${icone}</span>
    <span class="meio"><span class="t">${h(c.titulo)}</span><span class="s">${h(sub)}${c.aviso ? ` · <em>${h(c.aviso)}</em>` : ""}</span></span>`;
  if (unico) return `<button type="button" class="cart-item" data-doc="${h(c.docs[0])}">${corpo}<span class="seta">${I.seta}</span></button>`;
  return `<div class="cart-item varios">${corpo}<span class="arquivos">${c.docs.map((id) => `<button type="button" data-doc="${h(id)}">${h(rotuloArquivo(R.docs[id].nome))}</button>`).join("")}</span></div>`;
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
APP.prioritypass = { n: "Priority Pass", dom: "prioritypass.com", pkg: "com.prioritypass3", ios: 406878019, url: "https://www.prioritypass.com/" };
APP.visaairport = { n: "Visa Airport Companion", dom: "visa.com", pkg: "com.dragonpass.en.latam", ios: 1291608009, url: "https://apps.apple.com/app/id1291608009" };
const APPS = [
  { grupo: "Dinheiro", itens: [["wise", "Conta global e cartão"], ["nubank", "Conta global"], ["itau", "Banco"], ["splitwise", "Dividir as despesas do grupo"]] },
  { grupo: "Salas VIP", itens: [["prioritypass", "Cartão digital e lista de salas nos aeroportos"], ["visaairport", "Salas VIP pelo cartão Visa"]] },
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
    return { nome: hp.nome, endereco: hp.endereco, busca: hp.mapa || (enderecoValido(hp.endereco) ? hp.endereco : comCidade(hp.nome, dia.cidade)), coords: hp.coords, pais: dia.pais };
  }
  const a = dia.atividades[Number(k)];
  return { nome: a.titulo, endereco: a.endereco || a.local || dia.cidade, busca: a.mapa ? comCidade(a.mapa, dia.cidade) : enderecoValido(a.endereco) ? a.endereco : a.local ? comCidade(a.local, dia.cidade) : dia.cidade, coords: a.coords, pais: dia.pais };
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
  { id: "emergencia", nome: "Emergência", cor: "#C3122F", icone: `<svg class="icone-cao" viewBox="0 0 100 100" aria-hidden="true"><g transform="translate(0 -9)">${CAO_SEM_GUIRLANDA}</g><path d="M37 67 Q50 74 63 67" fill="none" stroke="#14224F" stroke-width="3" stroke-linecap="round"></path><rect x="29" y="71" width="42" height="25" rx="9" fill="#FFFFFF"></rect><rect x="36" y="71" width="3.6" height="25" fill="#14224F"></rect><rect x="60.4" y="71" width="3.6" height="25" fill="#14224F"></rect><rect x="47.1" y="77" width="5.8" height="15" rx="1.2" fill="#C3122F"></rect><rect x="42.5" y="81.6" width="15" height="5.8" rx="1.2" fill="#C3122F"></rect></svg>`, tela: () => telaEmergencia() },
  { id: "frases", nome: "Frases", cor: "#14224F", icone: `<svg class="icone-cao" viewBox="0 0 100 100" aria-hidden="true"><g transform="translate(-10 14) scale(0.88)">${CAO_FRASE}</g><path d="M70 5 H90 A6 6 0 0 1 96 11 V26 A6 6 0 0 1 90 32 H80 L71 39 L73 32 H70 A6 6 0 0 1 64 26 V11 A6 6 0 0 1 70 5 Z" fill="#FFFFFF"></path><circle cx="71.5" cy="18.5" r="2.6" fill="#14224F"></circle><circle cx="80" cy="18.5" r="2.6" fill="#14224F"></circle><circle cx="88.5" cy="18.5" r="2.6" fill="#14224F"></circle></svg>`, tela: () => telaFrases() },
  { id: "mala", nome: "Mala", cor: "#2D4BA0", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6V3.5h6V6"/><rect x="5" y="6" width="14" height="13" rx="2.5"/><path d="M9.5 9.5v6M14.5 9.5v6"/><circle cx="8.5" cy="21" r="1"/><circle cx="15.5" cy="21" r="1"/></svg>', tela: (b) => telaMala(b) },
  { id: "tempo", nome: "Tempo", cor: "#EE8A24", icone: `<svg class="icone-cao" viewBox="0 0 100 100" aria-hidden="true"><g transform="translate(-6 7) scale(0.95)">${CAO}</g><circle cx="84" cy="15" r="8.5" fill="#FFFFFF"></circle><g stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round"><path d="M84.0 3.0 L84.0 -0.5"></path><path d="M92.5 6.5 L95.0 4.0"></path><path d="M96.0 15.0 L99.5 15.0"></path><path d="M92.5 23.5 L95.0 26.0"></path><path d="M84.0 27.0 L84.0 30.5"></path><path d="M75.5 6.5 L73.0 4.0"></path></g></svg>`, tela: (b) => (b ? telaTempoDia(b) : telaTempo()) },
  { id: "comida", nome: "Comida", cor: "#D6457A", icone: `<svg class="icone-cao" viewBox="0 0 100 100" aria-hidden="true"><g transform="translate(50 53) scale(1.06) translate(-50 -53)">${CAO_COMIDA}</g></svg>`, tela: (b) => telaComida(b && decodeURIComponent(b)) },
  { id: "deuses", nome: "Deuses e símbolos", cor: "#8C1D40", icone: '<img class="icone-img" src="icons/deuses-mais.png" alt="">', tela: (b) => telaDeuses(b) },
  { id: "gorjetas", nome: "Gorjetas e preços", cor: "#5B3F8C", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="9" cy="7" rx="6" ry="2.5"/><path d="M3 7v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V7M3 11v4c0 1.4 2.7 2.5 6 2.5 1 0 1.9-.1 2.7-.3"/><circle cx="17" cy="16" r="4.5"/><path d="M17 14v4M15.6 15.2h2.2a.8.8 0 0 1 0 1.6h-1.6a.8.8 0 0 0 0 1.6h2.2"/></svg>', tela: (b) => telaGorjetas(b) },
  { id: "apps", nome: "Apps úteis", cor: "#A3560A", icone: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="1.7"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.7"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.7"/><g transform="translate(13.5 4.4) scale(0.0965) translate(-13.6 -20.5)" fill="currentColor" stroke="none">${SILHUETA_CAO}</g></svg>`, tela: () => telaApps() },
  { id: "fusos", nome: "Fusos", cor: "#0D7A48", icone: `<svg class="icone-cao" viewBox="0 0 100 100" aria-hidden="true"><g transform="translate(50 53) scale(1.06) translate(-50 -53)">${CAO_FUSO}</g></svg>`, tela: () => telaFusos() },
  { id: "compras", nome: "Compras", cor: "#C25E0A", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/></svg>', tela: () => telaCompras() },
  { id: "tema", nome: "Tema", cor: "#0D1222", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>', tela: () => telaTema() },
  { id: "atualizar", nome: "Atualizar", cor: "#565D78", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.8-4.2L4 8.5M4 4v4.5h4.5M4 13a8 8 0 0 0 14.8 4.2l1.2-1.7M20 20v-4.5h-4.5"/></svg>', tela: () => telaAtualizar() },
  { id: "sair", nome: "Sair", cor: "#3B4262", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/><circle cx="12" cy="16" r="1.3"/></svg>', tela: () => telaSair() },
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
    <p class="mais-dedicatoria">Um aplicativo feito sob medida para Marina, Dennis, Luca e Daniel.</p>
  </main>`;
}

function telaTempo() {
  const hoje = hojeISO();
  const futuros = R.dias.filter((d) => d.data >= hoje);
  const limite = isoDe(new Date(dataDe(hoje).getTime() + 15 * 86400000));
  const previsao = futuros.map((d) => {
    const t = tempoDoDia(d);
    const p = corDia(d);
    const bloco = `<div class="data-bloco-mini" style="${corBloco(p)}"><small>${h(SEM3[dataDe(d.data).getDay()])}</small><b>${h(d.data.slice(8))}</b></div>`;
    const sol = textoSol(d);
    const linhaSol = sol ? `<div class="s sol-linha">${SOL_ICONES.nasce}sol nasce ${sol.nasce} · se põe ${sol.poe}</div>` : "";
    if (!t) {
      const libera = isoDe(new Date(dataDe(d.data).getTime() - 15 * 86400000));
      return `<a class="linha-lista" href="#/mais/tempo/${d.data}">${bloco}<div class="meio"><div class="t">${h(d.cidade)}</div><div class="s">${d.data > limite ? "Previsão a partir de " + h(dataMedia(libera)) : "Previsão indisponível agora"}</div>${linhaSol}</div></a>`;
    }
    const [ic, txt] = climaDe(t.cod);
    return `<a class="linha-lista" href="#/mais/tempo/${d.data}">${bloco}<div class="meio"><div class="t">${h(d.cidade)}</div><div class="s">${h(txt)}${t.chuva != null ? ` · chuva ${t.chuva}%` : ""}</div>${linhaSol}</div><div class="tempo-dia">${TEMPO_ICONES[ic]}<b>${Math.round(t.max)}°</b><span>${Math.round(t.min)}°</span></div></a>`;
  }).join("");
  $app.innerHTML = `
  <main class="tela">
    ${topoSubapp("Tempo")}
    <div class="lista">${previsao || '<div class="nota">A viagem já acabou.</div>'}</div>
    <div class="nota">Toque num dia para ver a previsão hora a hora. Previsão para a cidade de cada dia; sai até 16 dias antes. Nascer e pôr do sol no horário local de cada cidade. ${TEMPO ? "Atualizada em " + new Date(TEMPO.em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) + "." : "Abra com internet para baixar."}</div>
  </main>`;
}

const fmtMm = (v) => (v >= 10 ? Math.round(v) : String(Math.round(v * 10) / 10).replace(".", ","));
function telaTempoDia(iso) {
  const i = idxDia(iso);
  if (i < 0) return telaTempo();
  const dia = R.dias[i];
  const p = corDia(dia);
  const t = tempoDoDia(dia);
  const sol = textoSol(dia);
  const ant = R.dias[i - 1], prox = R.dias[i + 1];
  const horaHoje = iso === new Intl.DateTimeFormat("en-CA", { timeZone: dia.fuso }).format(new Date()) ? Number(horaEm(dia.fuso).slice(0, 2)) : -1;
  const marcos = {};
  for (const a of dia.atividades) {
    const m = /^(\d{2}):\d{2}$/.exec(a.hora || "");
    if (m) (marcos[Number(m[1])] ||= []).push(a.hora + " " + a.titulo);
  }
  if (sol) {
    (marcos[Number(sol.nasce.slice(0, 2))] ||= []).push("sol nasce " + sol.nasce);
    (marcos[Number(sol.poe.slice(0, 2))] ||= []).push("sol se põe " + sol.poe);
  }
  let corpo;
  if (!t) {
    const libera = isoDe(new Date(dataDe(iso).getTime() - 15 * 86400000));
    corpo = `<div class="aviso aviso-pendente">${I.relogio}<div>${iso > libera && hojeISO() < libera ? `A previsão deste dia sai a partir de <b>${h(dataMedia(libera))}</b>.` : "Previsão indisponível agora. Abra com internet para baixar."}</div></div>`;
  } else {
    const [ic, txt] = climaDe(t.cod);
    const horas = t.horas || [];
    const tMin = Math.min(...horas.map((x) => x[1])), tMax = Math.max(...horas.map((x) => x[1]));
    const larg = (v) => (horas.length && tMax > tMin ? 18 + ((v - tMin) / (tMax - tMin)) * 82 : 60);
    corpo = `
    <section class="tempo-resumo" style="--pais:${p.cor}">
      <div class="tempo-grande">${TEMPO_ICONES[ic]}<div><b>${Math.round(t.max)}°</b><span>mín ${Math.round(t.min)}°</span></div></div>
      <div class="tempo-txt">${h(txt)}</div>
      <div class="tempo-dados">
        <div><small>Chuva</small><b>${t.chuva ?? "—"}%</b>${t.mm != null ? `<span>${fmtMm(t.mm)} mm</span>` : ""}</div>
        <div><small>Vento máx.</small><b>${t.vento != null ? Math.round(t.vento) : "—"}</b><span>km/h</span></div>
        <div><small>UV máx.</small><b>${t.uv != null ? Math.round(t.uv) : "—"}</b><span>${t.uv == null ? "" : t.uv >= 8 ? "muito alto" : t.uv >= 6 ? "alto" : t.uv >= 3 ? "moderado" : "baixo"}</span></div>
      </div>
      ${sol ? `<div class="tempo-sol">${SOL_ICONES.nasce} nasce ${sol.nasce} · ${SOL_ICONES.poe} se põe ${sol.poe}</div>` : ""}
    </section>
    ${horas.length ? `
    <div class="rotulo">Hora a hora</div>
    <div class="horas">
      <div class="hora-cab" aria-hidden="true"><span>hora</span><span></span><span>temperatura</span><span>chuva</span></div>
      ${horas.map(([hh, temp, sens, prob, mm, cod, vento, umid, ehDia]) => {
        const [hi, ht] = climaDe(cod, !ehDia);
        const marco = marcos[hh];
        return `<div class="hora-linha ${hh === horaHoje ? "agora" : ""} ${!ehDia ? "noite" : ""}" id="hora-${hh}">
          <span class="hh">${String(hh).padStart(2, "0")}h</span>
          <span class="hi" title="${h(ht)}">${TEMPO_ICONES[hi]}</span>
          <span class="ht"><i style="width:${larg(temp)}%"></i><b>${Math.round(temp)}°</b>${Math.round(sens) !== Math.round(temp) ? `<small>sensação ${Math.round(sens)}°</small>` : ""}</span>
          <span class="hc ${prob >= 50 ? "forte" : ""}"><b>${prob ?? 0}%</b>${mm > 0 ? `<small>${fmtMm(mm)} mm</small>` : ""}</span>
          ${marco ? `<span class="marco">${marco.map(h).join(" · ")}</span>` : ""}
        </div>`;
      }).join("")}
    </div>
    <div class="nota">Horário local de ${h(dia.cidade)}. A barra mostra a temperatura em relação ao resto do dia; chuva é a chance de chover naquela hora.</div>` : `<div class="nota">A previsão hora a hora aparece quando o app baixar a previsão de novo (precisa de internet).</div>`}`;
  }
  $app.innerHTML = `
  <main class="tela">
    <a class="voltar" href="#/mais/tempo">${I.voltar} Tempo</a>
    <div class="tempo-cab">
      <div><div class="sub-tela">${h(dataLonga(iso))}</div><h1 class="titulo-tela">${h(dia.cidade)}</h1></div>
      <a class="botao botao-claro" href="#/dia/${iso}">Roteiro${I.seta}</a>
    </div>
    ${corpo}
    <nav class="mala-nav">
      ${ant ? `<a class="botao botao-claro" href="#/mais/tempo/${ant.data}">${I.voltar}<span>${h(diaCurto(ant.data))} · ${h(ant.cidade)}</span></a>` : "<span></span>"}
      ${prox ? `<a class="botao botao-tinta" href="#/mais/tempo/${prox.data}"><span>${h(diaCurto(prox.data))} · ${h(prox.cidade)}</span>${I.seta}</a>` : "<span></span>"}
    </nav>
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

/* guia de compras */
const COMPRAS = [
  { pais: "NP", grupo: "Nepal · Kathmandu", itens: [
    { n: "Pashmina com selo Chyangra", o: "Xales e echarpes de lã de cabra do Himalaia (a mesma fibra do cashmere).",
      onde: "Lojas só de pashmina em Durbar Marg e Thamel, com as peças em sacos plásticos nas prateleiras.",
      dica: "Procure a etiqueta com holograma Chyangra Pashmina, a marca coletiva dos fabricantes nepaleses. Peça para queimar um fio: pashmina vira pó e cheira a cabelo queimado.",
      cuidado: "O selo ajuda, mas não garante. 'Water pashmina' e pilhas de xales na calçada costumam ser sintéticos.", mapa: "pashmina shop Durbar Marg Kathmandu" },
    { n: "Gorros, meias e malhas de iaque", o: "Peças grossas e quentes em cores naturais (marrom, cinza, creme).",
      onde: "Lojas de malha de Thamel e de Asan.",
      dica: "Lã de iaque de verdade é macia, sem brilho e em tons naturais; compare peso e toque em mais de uma loja.",
      cuidado: "Muito do 'yak wool' barato é lã de ovelha ou acrílico. Pechinche: o preço de turista costuma ter folga.", mapa: "yak wool shop Thamel Kathmandu" },
    { n: "Mochilas de cânhamo", o: "Bolsas e mochilas de tecido de cânhamo, feitas à mão no Nepal.",
      onde: "Thamel e o bazar de Asan; a Hemp House Nepal tem loja em Thamel.",
      dica: "Faixa de preço: Rs 600 a Rs 5.000, conforme tamanho e acabamento. O tecido de tear manual é mais rústico.",
      cuidado: "Muitas são mistura de cânhamo com algodão ou urtiga: pergunte quanto é cânhamo. As muito baratas raramente são puras.", mapa: "Hemp House Nepal Thamel" },
    { n: "Sonam Gear", o: "Marca nepalesa de roupas e equipamentos de trekking: anoraques, fleeces, calças, mochilas.",
      onde: "Lojas próprias em Thamel (a maior fica na área central do bairro).",
      dica: "Qualidade boa por bem menos que as marcas internacionais; vale para corta-vento e fleece.",
      cuidado: "Fuja das imitações de North Face e afins que lotam Thamel; nas lojas da marca não há esse problema.", mapa: "Sonam Gears Thamel Kathmandu" },
    { n: "Shona's Alpine", o: "Loja tradicional de equipamento de montanha: jaquetas de pluma, sacos de dormir, aluguel de equipamento.",
      onde: "Amrit Marg, Thamel: descendo da Tridevi Sadak, à direita, logo depois da entrada do Rum Doodle. Abre 9h–18h30.",
      dica: "Preço fixo, sem pechincha, e costuma sair bem abaixo das lojas vizinhas. Se não tiverem o item, indicam onde achar.",
      cuidado: "Pagamento só em dinheiro. A maior parte dos produtos é feita no Nepal ou na China.", mapa: "Shona's Alpine Amrit Marg Kathmandu" },
    { n: "Papel lokta", o: "Papel artesanal feito da casca do arbusto lokta: cadernos, cartões, envelopes e luminárias.",
      onde: "Lojas de artesanato de Thamel e a Mahaguthi (comércio justo), em Kupondole, Patan.",
      dica: "Leve e ótimo para presente; caderninhos e cartões são os mais práticos de trazer.",
      cuidado: "Guarde longe de umidade e não amasse na mala: vá entre roupas ou em pasta rígida.", mapa: "Mahaguthi Kupondole Lalitpur" },
  ]},
  { pais: "IN", grupo: "Índia · Delhi e arredores", itens: [
    { n: "Cosméticos indianos", o: "Linha ayurvédica: óleos, cremes, sabonetes e produtos de cabelo.",
      onde: "Khan Market (Forest Essentials e Kama Ayurveda, as mais sofisticadas), lojas Nykaa nos shoppings e farmácias (Himalaya, Biotique).",
      dica: "Himalaya e Biotique de farmácia são baratíssimos e bons para presentes; Forest Essentials vem em embalagem de presente.",
      cuidado: "Líquidos e cremes acima de 100 ml só na mala despachada; embale bem por causa da pressão no avião.", mapa: "Khan Market New Delhi" },
    { n: "Masalas de marca", o: "Misturas de especiarias prontas: garam masala, chana, chaat, tikka, chai masala.",
      onde: "Supermercados (Modern Bazaar, Spencer's, Smart Bazaar) e mercearias do INA Market.",
      dica: "MDH, Everest e Catch são as marcas mais comuns; sachês pequenos rendem e pesam pouco.",
      cuidado: "Traga só pacotes industriais lacrados. Na volta ao Brasil, na dúvida, declare no canal 'bens a declarar'.", mapa: "INA Market New Delhi" },
    { n: "Chás", o: "Darjeeling (mais delicado), Assam (encorpado), Nilgiri e misturas de chai.",
      onde: "Mittal Stores, no mercado de Sundar Nagar; no Nepal, procure o chá de Ilam.",
      dica: "Peça para provar e prefira lata ou pacote a vácuo; first flush é a colheita mais leve e cara do Darjeeling.",
      cuidado: "Folhas soltas a granel podem dar problema na alfândega brasileira: prefira embalagem fechada e, na dúvida, declare.", mapa: "Mittal Stores Sundar Nagar Market Delhi" },
    { n: "Jeans Spykar", o: "Marca indiana de jeans e casual, com cortes modernos e preço bem abaixo das marcas importadas.",
      onde: "Lojas próprias nos shoppings de Delhi, como o Select Citywalk (Saket).",
      dica: "A numeração é em polegadas, como a americana; experimente, porque as modelagens variam.",
      cuidado: "Confira se é loja da marca: barracas de rua vendem imitações.", mapa: "Spykar store Select Citywalk Saket" },
    { n: "Mufti", o: "Marca indiana de roupa masculina casual: camisas, jeans, jaquetas e polos.",
      onde: "Lojas próprias nos shoppings de Delhi (Select Citywalk, Ambience Mall) e em alguns aeroportos.",
      dica: "Camisas de algodão e linho são o ponto forte; fique de olho em promoções de fim de temporada.",
      cuidado: "A modelagem é mais justa que a brasileira: experimente antes.", mapa: "Mufti store Select Citywalk Saket" },
  ]},
];
function telaCompras() {
  const lin = (r, v) => (v ? `<div class="compra-lin"><b>${r}</b><span>${h(v)}</span></div>` : "");
  $app.innerHTML = `<main class="tela">${topoSubapp("Compras")}
    <p class="texto">O que vale trazer, onde achar e o que observar. Toque num item para ver os detalhes.</p>
    ${COMPRAS.map((g) => `
      <div class="rotulo" style="display:flex;align-items:center;gap:8px"><i class="barra-pais" style="background:${PAISES[g.pais].cor};height:14px"></i>${h(g.grupo)}</div>
      <div class="lista-densa compras">${g.itens.map((it) => `
        <details class="compra">
          <summary><span class="meio"><span class="t">${h(it.n)}</span><span class="s">${h(it.o)}</span></span><span class="seta">${I.seta}</span></summary>
          <div class="compra-corpo">
            ${lin("Onde", it.onde)}${lin("Dica", it.dica)}${lin("Cuidado", it.cuidado)}
            ${it.mapa ? `<a class="botao botao-claro" href="${h(urlMapa(it.mapa))}" target="_blank" rel="noopener">${I.mapa} Ver no mapa</a>` : ""}
          </div>
        </details>`).join("")}</div>`).join("")}
  </main>`;
}

/* ---------- guias: gorjetas e preços, comida, deuses e símbolos (guias.json, conteúdo público) ---------- */
let GUIAS = null;
function comGuias(titulo, desenhar) {
  if (GUIAS) return desenhar();
  $app.innerHTML = `<main class="tela">${topoSubapp(titulo)}<div class="carregando">Abrindo…</div></main>`;
  const rota = location.hash;
  fetch("guias.json").then((r) => { if (!r.ok) throw 0; return r.json(); })
    .then((j) => { GUIAS = j; if (location.hash === rota) rotear(); })
    .catch(() => { if (location.hash === rota) $app.querySelector(".carregando").textContent = "Não consegui abrir o guia. Conecte uma vez à internet."; });
}
const paisDeHoje = () => R.dias[idxDia(hojeISO())]?.pais;
function abasGuia(itens, atual, base) {
  return `<div class="filtros guia-abas" role="tablist">${itens.map(([id, nome]) => `<a role="tab" href="${base}/${id}" aria-selected="${id === atual}" class="${id === atual ? "on" : ""}">${h(nome)}</a>`).join("")}</div>`;
}

/* gorjetas e preços */
const SIMBOLO_MOEDA = { INR: "₹", NPR: "रू", EUR: "€" };
function precoTexto(v, m) {
  const casas = m === "EUR" && v % 1 ? 2 : 0;
  return `${SIMBOLO_MOEDA[m]} ${fmt(v, casas)}`;
}
function emReais(min, max, m) {
  const t = CAMBIO?.reais_por_unidade?.[m];
  if (!t) return "";
  const r = (v) => (v * t < 10 ? fmt(v * t, 2) : fmt(Math.round(v * t), 0));
  return min === max ? `≈ R$ ${r(min)}` : `≈ R$ ${r(min)}–${r(max)}`;
}
function telaGorjetas(sel) {
  comGuias("Gorjetas e preços", () => {
    const G = GUIAS.gorjetas;
    const p = G.find((x) => x.pais === sel) || G.find((x) => x.pais === paisDeHoje()) || G[0];
    $app.innerHTML = `<main class="tela">${topoSubapp("Gorjetas e preços")}
      ${abasGuia(G.map((x) => [x.pais, x.nome]), p.pais, "#/mais/gorjetas")}
      <div class="guia-regras" style="--pais:${PAISES[p.pais].cor}">${p.regras.map((t) => `<p>${h(t)}</p>`).join("")}</div>
      <div class="rotulo">Gorjetas</div>
      <div class="lista-densa guia-linhas">${p.gorjetas.map((g) => `<div class="guia-lin"><b>${h(g.n)}</b><span>${h(g.v)}</span></div>`).join("")}</div>
      <div class="rotulo">Preços de referência</div>
      <div class="lista-densa guia-linhas">${p.precos.map((x) => `
        <div class="guia-preco"><div class="meio"><b>${h(x.n)}</b>${x.obs ? `<span>${h(x.obs)}</span>` : ""}</div>
          <div class="valor"><b>${x.min === x.max ? precoTexto(x.min, p.moeda) : `${precoTexto(x.min, p.moeda)}–${fmt(x.max, p.moeda === "EUR" && x.max % 1 ? 2 : 0)}`}</b><span>${emReais(x.min, x.max, p.moeda)}</span></div></div>`).join("")}</div>
      <div class="nota">Valores aproximados, de guias de viagem de 2025 e 2026: servem para saber se o preço está justo, não como tabela. Reais pela taxa do Câmbio.</div>
    </main>`;
  });
}

/* comida */
const PIMENTA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 4c-1 0-1.6.8-1.8 1.6C9 6.5 5 11 4 18c-.2 1.4 1 2.3 2.2 1.6C12 16.5 17 12.5 18 7.5c.8-.3 1.4-1 1.2-2" fill="currentColor" stroke="none"/></svg>';
const nivelPimenta = (n) => (n ? `<span class="pimentas" aria-label="Picância ${n} de 3">${PIMENTA.repeat(n)}</span>` : `<span class="pimentas zero">sem pimenta</span>`);
function telaComida(sel) {
  comGuias("Comida", () => {
    const C = GUIAS.comida;
    const hoje = R.dias[idxDia(hojeISO())];
    const c = C.cidades.find((x) => x.cidade === sel) || C.cidades.find((x) => hoje && (x.cidade === hoje.cidade || (x.cidade === "Roma" && hoje.pais === "IT"))) || C.cidades[0];
    const pedir = C.pedir.find((x) => x.pais === c.pais);
    $app.innerHTML = `<main class="tela">${topoSubapp("Comida")}
      ${abasGuia(C.cidades.map((x) => [x.cidade, x.cidade]), c.cidade, "#/mais/comida")}
      <p class="texto">${h(c.texto)}</p>
      ${pedir ? `<div class="guia-pedir" style="--pais:${PAISES[c.pais].cor};color:${PAISES[c.pais].claro ? "#14224F" : "#FFFFFF"}"><span>Para pedir ${h(pedir.pt)}</span><b lang="${c.pais === "NP" ? "ne" : "hi"}">${h(pedir.local)}</b><i>${h(pedir.lido)}</i></div>` : ""}
      <div class="pratos">${c.pratos.map((p) => `
        <article class="prato">
          <div class="prato-topo"><span class="marca-veg ${p.v ? "veg" : "nveg"}" title="${p.v ? "Vegetariano" : "Com carne ou peixe"}"><i></i></span>
            <div class="meio"><h3>${h(p.n)}</h3>${p.l && p.l !== p.n ? `<span class="prato-local">${h(p.l)}</span>` : ""}</div>${nivelPimenta(p.p)}</div>
          <p>${h(p.o)}</p>
        </article>`).join("")}</div>
      ${c.pais !== "IT" ? `<details class="compra guia-cuidados"><summary><span class="meio"><span class="t">Comer sem susto</span><span class="s">Água, gelo e comida de rua</span></span><span class="seta">${I.seta}</span></summary>
        <div class="compra-corpo"><ul>${C.cuidados.map((t) => `<li>${h(t)}</li>`).join("")}</ul></div></details>` : ""}
      <div class="nota"><span class="marca-veg veg"><i></i></span> vegetariano · <span class="marca-veg nveg"><i></i></span> com carne, peixe ou ovo. Na Índia, os produtos e cardápios usam essa mesma marca.</div>
    </main>`;
  });
}

/* deuses e símbolos */
function ondeVer(ver) {
  const achados = [];
  for (const v of ver || []) {
    const q = v.busca.toLowerCase();
    for (const d of R.dias) {
      const n = d.atividades.findIndex((a) => [a.titulo, a.mapa, a.local].some((t) => t && t.toLowerCase().includes(q)));
      if (n >= 0) { achados.push({ d, n, o: v.o, t: d.atividades[n].titulo }); break; }
      if (d.nota && d.nota.toLowerCase().includes(q)) { achados.push({ d, n: -1, o: v.o, t: d.cidade }); break; }
    }
  }
  const vistos = new Set();
  return achados.filter((x) => { const k = x.d.data + x.n; if (vistos.has(k)) return false; vistos.add(k); return true; });
}
const emblema = (x, tam = 56) => `<span class="emblema" style="background:${x.cor};width:${tam}px;height:${tam}px">${x.img ? `<img src="${h(x.img)}" alt="" loading="lazy">` : `<svg viewBox="0 0 64 64" aria-hidden="true">${x.svg}</svg>`}</span>`;
const emblemaCor = (x, tam) => (x.imgCor ? `<span class="emblema emblema-cor" style="width:${tam}px;height:${tam}px"><img src="${h(x.imgCor)}" alt=""></span>` : emblema(x, tam));
function telaDeuses(sub) {
  comGuias("Deuses e símbolos", () => {
    if (sub === "quiz") return telaQuiz();
    const item = sub && (GUIAS.deuses.find((x) => x.id === sub) || GUIAS.simbolos.find((x) => "s-" + x.id === sub));
    if (item) return telaDeus(item, GUIAS.deuses.includes(item));
    const aba = sub === "simbolos" ? "simbolos" : "deuses";
    const lista = GUIAS[aba];
    const pref = aba === "simbolos" ? "s-" : "";
    $app.innerHTML = `<main class="tela">${topoSubapp("Deuses e símbolos")}
      <p class="texto">Para reconhecer quem é quem nos templos, nas ruas e nas festas.</p>
      ${abasGuia([["deuses", "Deuses"], ["simbolos", "Símbolos"], ["quiz", "Quem é?"]], aba, "#/mais/deuses")}
      <div class="deuses-grade">${lista.map((x) => {
        const onde = ondeVer(x.ver);
        return `<a class="deus-cartao" href="#/mais/deuses/${pref}${x.id}">
          ${emblema(x, 64)}
          <span class="deus-nome">${h(x.n)}</span>
          <span class="deus-local">${h(x.l)}</span>
          ${x.papel ? `<span class="deus-papel">${h(x.papel)}</span>` : ""}
          ${onde.length ? `<span class="deus-onde">${I.pino} ${h(onde.map((o) => o.d.cidade).filter((c, i, a) => a.indexOf(c) === i).join(" · "))}</span>` : ""}
        </a>`;
      }).join("")}</div>
    </main>`;
  });
}
function telaDeus(x, ehDeus) {
  const lista = ehDeus ? GUIAS.deuses : GUIAS.simbolos;
  const i = lista.indexOf(x);
  const pref = ehDeus ? "" : "s-";
  const ant = lista[(i - 1 + lista.length) % lista.length], prox = lista[(i + 1) % lista.length];
  const onde = ondeVer(x.ver);
  $app.innerHTML = `<main class="tela">
    <a class="voltar" href="#/mais/deuses/${ehDeus ? "deuses" : "simbolos"}">${I.voltar} ${ehDeus ? "Deuses" : "Símbolos"}</a>
    <div class="deus-hero" style="--cor:${x.cor}">
      ${emblemaCor(x, 132)}
      <div><h1 class="titulo-tela">${h(x.n)}</h1><div class="deus-local grande">${h(x.l)}</div>${x.papel ? `<div class="deus-papel">${h(x.papel)}</div>` : ""}</div>
    </div>
    ${x.reconhecer ? `<div class="rotulo">Como reconhecer</div><ul class="deus-lista">${x.reconhecer.map((t) => `<li>${h(t)}</li>`).join("")}</ul>` : ""}
    <p class="texto deus-texto">${h(x.texto)}</p>
    ${onde.length ? `<div class="rotulo">Onde vocês vão ver</div><div class="lista-densa">${onde.map((o) => `
      <a class="cart-item" href="#/dia/${o.d.data}${o.n >= 0 ? "/" + o.n : ""}">
        <span class="ic" style="${corBloco(corDia(o.d))}">${I.pino}</span>
        <span class="meio"><span class="t">${h(o.t)}</span><span class="s">${h(diaCurto(o.d.data))} · ${h(o.d.cidade)}${o.o ? " · " + h(o.o) : ""}</span></span>
        <span class="seta">${I.seta}</span></a>`).join("")}</div>` : ""}
    <div class="deus-nav">
      <a class="botao botao-claro" href="#/mais/deuses/${pref}${ant.id}">${I.voltar} ${h(ant.n)}</a>
      <a class="botao botao-claro" href="#/mais/deuses/${pref}${prox.id}">${h(prox.n)} ${I.seta}</a>
    </div>
  </main>`;
}
let QUIZ = { feitos: 0, acertos: 0, atual: null, resposta: null };
function novaPergunta() {
  const ids = Object.keys(GUIAS.quiz);
  let id;
  do { id = ids[Math.floor(Math.random() * ids.length)]; } while (ids.length > 1 && id === QUIZ.atual?.id);
  const certo = GUIAS.deuses.find((x) => x.id === id);
  const outros = ids.filter((k) => k !== id).sort(() => Math.random() - 0.5).slice(0, 3);
  QUIZ.atual = { id, opcoes: [id, ...outros].sort(() => Math.random() - 0.5), certo };
  QUIZ.resposta = null;
}
function telaQuiz() {
  if (!QUIZ.atual) novaPergunta();
  const q = QUIZ.atual, nome = (id) => GUIAS.deuses.find((x) => x.id === id).n;
  const r = QUIZ.resposta;
  $app.innerHTML = `<main class="tela">${topoSubapp("Deuses e símbolos")}
    ${abasGuia([["deuses", "Deuses"], ["simbolos", "Símbolos"], ["quiz", "Quem é?"]], "quiz", "#/mais/deuses")}
    <div class="quiz">
      <div class="quiz-placar">${QUIZ.feitos ? `${QUIZ.acertos} de ${QUIZ.feitos} certas` : "Quem é este?"}</div>
      ${emblema(q.certo, 150)}
      <div class="quiz-pista">${r ? h(GUIAS.quiz[q.id]) : '<button type="button" class="rodape-acao" id="quiz-dica">Mostrar uma dica</button>'}</div>
      <div class="quiz-opcoes">${q.opcoes.map((id) => `<button type="button" data-op="${id}" class="${r ? (id === q.id ? "certa" : id === r ? "errada" : "") : ""}" ${r ? "disabled" : ""}>${h(nome(id))}</button>`).join("")}</div>
      ${r ? `<div class="quiz-fim">${r === q.id ? "Acertou!" : `Era ${h(nome(q.id))}.`} <a href="#/mais/deuses/${q.id}">Saber mais</a></div>
        <button type="button" class="botao botao-tinta" id="quiz-prox">Próximo ${I.seta}</button>` : ""}
    </div>
  </main>`;
  $app.querySelectorAll("[data-op]").forEach((b) => b.addEventListener("click", () => {
    QUIZ.resposta = b.dataset.op; QUIZ.feitos++; if (b.dataset.op === q.id) QUIZ.acertos++; telaQuiz();
  }));
  document.getElementById("quiz-dica")?.addEventListener("click", (e) => { e.target.closest(".quiz-pista").textContent = GUIAS.quiz[q.id]; });
  document.getElementById("quiz-prox")?.addEventListener("click", () => { novaPergunta(); telaQuiz(); window.scrollTo(0, 0); });
}

/* tema claro / escuro */
const LS_TEMA = "indaly.tema";
function aplicarTema() {
  const t = lerLS(LS_TEMA) || "auto";
  if (t === "auto") delete document.documentElement.dataset.tema; else document.documentElement.dataset.tema = t;
  const escuro = t === "escuro" || (t === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", escuro ? "#0D1222" : "#14224F");
}
window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", aplicarTema);
aplicarTema();
function telaTema() {
  const atual = lerLS(LS_TEMA) || "auto";
  const op = [
    ["auto", "Automático", "Acompanha o modo claro/escuro do celular", '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17A8.5 8.5 0 0 0 12 3.5z" fill="currentColor"/></svg>'],
    ["claro", "Claro", "Sempre claro", TEMPO_ICONES.sol],
    ["escuro", "Escuro", "Sempre escuro; bom à noite e no avião", '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>'],
  ];
  $app.innerHTML = `<main class="tela">${topoSubapp("Tema")}
    <div class="temas" role="group" aria-label="Tema">${op.map(([id, t, d, ic]) => `<button type="button" data-tema="${id}" aria-pressed="${id === atual}">${ic}<span class="meio"><span class="t">${t}</span><br><span class="s">${d}</span></span><span class="marca-ok">${I.ok}</span></button>`).join("")}</div>
  </main>`;
  $app.querySelectorAll("[data-tema]").forEach((b) => b.addEventListener("click", () => { gravarLS(LS_TEMA, b.dataset.tema); aplicarTema(); telaTema(); }));
}

function telaSair() {
  $app.innerHTML = `<main class="tela">${topoSubapp("Sair")}
    <p class="texto">Tranca o cofre neste celular: para abrir o roteiro e os documentos de novo, será preciso digitar a senha do grupo.</p>
    <p class="texto">A mala, o tema e os arquivos já baixados continuam guardados (os documentos seguem trancados).</p>
    <button type="button" class="botao botao-tinta" id="sair-agora">Trancar e sair</button>
  </main>`;
  document.getElementById("sair-agora").addEventListener("click", () => {
    apagarLS(LS_CHAVE);
    for (const u of FOTOS.values()) URL.revokeObjectURL(u);
    history.replaceState(null, "", location.pathname + location.search + "#/hoje");
    location.reload();
  });
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
  despachar: { nome: "Pode ir despachada", cor: "var(--bolsa-preta)", icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6V3.5h6V6"/><rect x="5.5" y="6" width="13" height="13" rx="2.5"/><path d="M9.5 9.5v6M14.5 9.5v6"/><circle cx="8.5" cy="21" r="1"/><circle cx="15.5" cy="21" r="1"/></svg>' },
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
    ${p === 0 ? `<div class="mala-pronta">${caoSVG(72)}<div><b>Mala pronta!</b><span>Tudo marcado como OK ou NA neste celular. Boa viagem.</span></div></div>` : ""}
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
    <div class="tudo-pronto" id="tudo-pronto" hidden>${caoSVG(40)}<span>Nada pendente nesta seção.</span></div>
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
    document.getElementById("tudo-pronto").hidden = p !== 0;
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
  $abas.hidden = rota === "motorista";
  if (rota === "motorista") return telaMotorista(a, b);
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
  $app.innerHTML = `<div class="abrindo">${caoSVG(180, { fundo: false, classe: "respira" })}<div>Abrindo o roteiro…</div></div>`;
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
