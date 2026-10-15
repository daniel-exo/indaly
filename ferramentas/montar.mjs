// Monta o cofre do Indaly a partir do roteiro legível e da pasta de documentos.
//
// Uso (a partir da raiz do repositório, com `npm install age-encryption@0.2.4` feito em algum lugar acessível):
//   node ferramentas/montar.mjs --roteiro /caminho/roteiro.json --docs /pasta/com/os/pdfs
//
// Opções:
//   --senha X           só na primeira vez: cria a chave do cofre protegida por esta senha
//   --senha-atual X --nova-senha Y   troca a senha (os documentos não mudam)
//
// O roteiro legível NUNCA vai para o repositório. Ele fica guardado no projeto Indaly do Claude.
// Aqui só entram arquivos trancados (.age), a chave pública e o índice de arquivos.

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { createHash } from "node:crypto";
import { Encrypter, Decrypter, generateIdentity, identityToRecipient } from "age-encryption";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => (cur.startsWith("--") ? [...acc, [cur.slice(2), arr[i + 1]]] : acc), [])
);

const RAIZ = new URL("..", import.meta.url).pathname;
const COFRE = join(RAIZ, "cofre");
const PASTA_D = join(COFRE, "d");
mkdirSync(PASTA_D, { recursive: true });

const caminhoDest = join(COFRE, "destinatario.txt");
const caminhoChave = join(COFRE, "chave.age");

async function cifrarComSenha(texto, senha) {
  const e = new Encrypter();
  e.setPassphrase(senha);
  return e.encrypt(texto);
}

// 1. Chave do cofre
if (args["nova-senha"]) {
  const d = new Decrypter();
  d.addPassphrase(args["senha-atual"]);
  const identidade = await d.decrypt(readFileSync(caminhoChave), "text");
  writeFileSync(caminhoChave, await cifrarComSenha(identidade, args["nova-senha"]));
  console.log("Senha trocada.");
  if (!args.roteiro) process.exit(0);
}
if (!existsSync(caminhoDest)) {
  if (!args.senha) throw new Error("Primeira montagem: informe --senha");
  const identidade = await generateIdentity();
  writeFileSync(caminhoDest, (await identityToRecipient(identidade)) + "\n");
  writeFileSync(caminhoChave, await cifrarComSenha(identidade, args.senha));
  console.log("Chave do cofre criada.");
}
const destinatario = readFileSync(caminhoDest, "utf8").trim();

async function cifrar(dados) {
  const e = new Encrypter();
  e.addRecipient(destinatario);
  return e.encrypt(dados);
}

// 2. Documentos
const roteiroCaminho = args.roteiro;
const roteiro = JSON.parse(readFileSync(roteiroCaminho, "utf8"));

function acharArquivos(pasta) {
  const mapa = new Map();
  const andar = (p) => {
    for (const nome of readdirSync(p)) {
      if (/^(Cancelados|_antigos|Planejamento|WIP)$/.test(nome)) continue;
      const c = join(p, nome);
      if (statSync(c).isDirectory()) andar(c);
      else mapa.set(nome.normalize("NFC"), c);
    }
  };
  if (pasta) andar(pasta);
  return mapa;
}
const arquivos = acharArquivos(args.docs);
// --extra: outra pasta (ex.: fotos do dia já recortadas)
if (args.extra) for (const [k, v] of acharArquivos(args.extra)) arquivos.set(k, v);

const MIME = { ".pdf": "application/pdf", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".heic": "image/heic" };

for (const [id, doc] of Object.entries(roteiro.docs)) {
  const jaTem = doc.arquivo && existsSync(join(RAIZ, doc.arquivo));
  const origem = arquivos.get(doc.nome.normalize("NFC"));
  if (!origem) {
    if (!jaTem) console.warn("FALTA o arquivo:", doc.nome);
    continue;
  }
  const bytes = readFileSync(origem);
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 20);
  const destinoRel = `cofre/d/${hash}.age`;
  if (doc.arquivo === destinoRel && jaTem) continue;
  writeFileSync(join(RAIZ, destinoRel), await cifrar(bytes));
  doc.arquivo = destinoRel;
  doc.tipo = MIME[extname(doc.nome).toLowerCase()] || "application/octet-stream";
  doc.bytes = bytes.length;
  console.log("trancado:", doc.nome);
}

// 3. Roteiro
roteiro.atualizado_em = new Date().toISOString();
writeFileSync(roteiroCaminho, JSON.stringify(roteiro, null, 1));
writeFileSync(join(COFRE, "roteiro.age"), await cifrar(JSON.stringify(roteiro)));

// 4. Índice público (sem conteúdo): versão e lista de arquivos para guardar offline
const usados = Object.values(roteiro.docs).map((d) => d.arquivo).filter(Boolean);
writeFileSync(
  join(COFRE, "versao.json"),
  JSON.stringify({ versao: roteiro.atualizado_em, arquivos: usados }, null, 1)
);
// remove trancados que ninguém mais usa
for (const nome of readdirSync(PASTA_D)) {
  if (!usados.includes(`cofre/d/${nome}`)) {
    (await import("node:fs")).unlinkSync(join(PASTA_D, nome));
    console.log("removido:", nome);
  }
}
console.log("Cofre montado:", usados.length, "documentos.");
