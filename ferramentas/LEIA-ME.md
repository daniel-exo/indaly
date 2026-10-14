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
   - Tranca só os documentos novos ou alterados (nome = hash do conteúdo).
   - Não precisa da senha: usa a chave pública `cofre/destinatario.txt`.
3. Salvar o `roteiro.json` atualizado de volta no projeto e fazer commit/push aqui.

## Câmbio
Editar `cambio.json` → `reais_por_unidade` (quantos reais vale 1 unidade de cada moeda), `data`, `origem`.

## Trocar a senha
`node ferramentas/montar.mjs --senha-atual "<atual>" --nova-senha "<nova>"` (só regrava `cofre/chave.age`).
Quem já abriu o app continua funcionando; aparelhos novos usam a senha nova.

## Atualizar o app (código)
Ao mudar `app.js`, `app.css` ou `index.html`, aumentar `VERSAO` em `sw.js` para os celulares baixarem a versão nova.
