# Como atualizar o Indaly

O roteiro legível (`roteiro.json`) **não fica neste repositório**. Ele está guardado no projeto "Indaly" do Claude
(`claude/indaly-roteiro.json`). Aqui só entram arquivos trancados.

## Atualizar roteiro ou documentos

1. Pegar o `roteiro.json` do projeto e editar (dias, atividades, status, pendências, notas).
   - `status`: `confirmado` | `pendente` (com `pendencia`) | `na hora` | `livre`
   - `alerta`: aviso em vermelho (ex.: lugar fechado no dia)
   - Documento novo: acrescentar em `docs` (`{"nome": "<arquivo>", "pasta": "..."}`), citar o id em `atividades[].docs`
     e/ou em `carteira[].docs`. Na carteira, `ate` define quando o item vai para "Utilizados".
2. `npm install` (instala `age-encryption`) e rodar:
   `node ferramentas/montar.mjs --roteiro /caminho/roteiro.json --docs "/pasta/com/os/arquivos"`
   - Fotos do dia (aba Hoje): recortar em 8:3 com `python3 ferramentas/fotos.py` e passar a pasta com `--extra /pasta/fotos-app`.
   - Tranca só os documentos novos ou alterados (nome = hash do conteúdo).
   - Não precisa da senha: usa a chave pública `cofre/destinatario.txt`.
3. Salvar o `roteiro.json` atualizado de volta no projeto e fazer commit/push aqui.

## Compras
Ficam dentro do cofre, na chave `compras` do `roteiro.json` (as lojas citam os dias da viagem e a hospedagem, então não podem ir para arquivo público). Três listas ligadas por `id`:
- `itens`: o que comprar; `marcas` e `lojas` citam ids.
- `marcas`: cada uma cita as `lojas` onde achar.
- `lojas`: endereço, horário, `folga`, `tel`, `link` (do Google Maps) ou `mapa` (busca), e `dias` do roteiro em que passam perto.
  A loja aparece sozinha no dia correspondente, em "Compras por perto".

## Câmbio
Editar `cambio.json` → `reais_por_unidade` (quantos reais vale 1 unidade de cada moeda), `data`, `origem`.

## Trocar a senha
`node ferramentas/montar.mjs --senha-atual "<atual>" --nova-senha "<nova>"` (só regrava `cofre/chave.age`).
Quem já abriu o app continua funcionando; aparelhos novos usam a senha nova.

## Atualizar o app (código)
Ao mudar `app.js`, `app.css` ou `index.html`, aumentar `VERSAO_APP` em `app.js` (formato 2.00, 2.01, …) e `VERSAO` em `sw.js` ("indaly-" + o mesmo número) para os celulares baixarem a versão nova.

## Nunca no repositório público
O repositório é público. Nada que diga onde o grupo vai estar e quando (datas, hospedagem, nomes de anfitriões, telefones, localizadores) pode ir em arquivo fora de `cofre/`. Na dúvida, vai no `roteiro.json` e é trancado com `montar.mjs`.
