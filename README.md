# desafio_teste_domino

Desafio de testes: casos de teste para testar **uma partida de dominó para 2 jogadores**, com **casos de teste em JavaScript para testar JavaScript** (Jest + Testing Library).

## Identificação

**Refatoração e manutenção desta versão:** 1Flick. Os créditos da base permanecem preservados.

Esta versão preserva os casos de teste da base fornecida.

## Como rodar

Requisitos: Node.js 18 ou superior.

```bash
npm install
npm test                    # roda todos os casos de teste (Jest)
npm run verificar           # confere o motivo de cada falha e o ID de cada teste
npm run verificar:completo  # idem + confere que todo caso do plano tem teste
npx jest tests/<arquivo>.spec.js -t "TC-XX-NN"   # um caso só
```

## Funcionamento dos casos de teste

**Situação atual:** somente os casos de teste. O jogo ainda não está implementado, então **todos os testes falham de propósito**, pelo motivo certo (o comportamento ainda não existe). O `npm run verificar` confere isso.

- **Ferramentas:** [Jest](https://jestjs.io) roda os testes; [Testing Library](https://testing-library.com) (`@testing-library/dom`, `user-event` e `jest-dom`) simula o jogador; o [jsdom](https://github.com/jsdom/jsdom) faz o papel do navegador, sem precisar abrir um.
- **Testes de interface:** cada teste abre o `index.html` do jogo pela função `abrirJogo(params)` de `tests/helpers.js`, clica como um jogador e confere o que aparece na tela. Os testes não chamam funções internas do jogo.
- **Elementos da tela:** encontrados pelo atributo `data-testid` (contrato na seção 3 do PLANEJAMENTO.md).
- **Sem depender de sorte:** o cenário (cartas, minas, peças, frota, puzzle) é montado por parâmetros de URL, então cada teste começa sempre do mesmo jeito. O tempo usa relógio falso (`jest.useFakeTimers()`).
- **Rastreabilidade:** cada teste tem no título o ID do caso (`TC-..-NN`), o mesmo da tabela abaixo e da seção 5 do PLANEJAMENTO.md.
- **Metodologia:** TDD, um caso de teste por vez: escrever, rodar, ver falhar pelo motivo certo e fazer o commit `test:`.
- **Integração contínua:** o GitHub Actions roda `npm ci` e `npm run verificar` em todo push e Pull Request.

## Casos de teste (23)

| ID | Cenário | Arquivo | Resultado esperado |
|---|---|---|---|
| TC-DO-01 | Distribuição | `tests/distribuicao.spec.js` | `mao-j1` e `mao-j2` com 7 peças; `monte-qtd` = 14; `mesa` vazia |
| TC-DO-02 | 28 peças sem repetir | `tests/distribuicao.spec.js` | Todas de `0-0` a `6-6`, nenhuma repetida |
| TC-DO-03 | Maior dupla começa | `tests/distribuicao.spec.js` | `vez` = J2 |
| TC-DO-04 | Dupla obrigatória | `tests/distribuicao.spec.js` | `mensagem` = "Jogada inválida"; mesa vazia. Clicar 6-6 → mesa = `6-6` |
| TC-DO-05 | Sem duplas | `tests/distribuicao.spec.js` | `vez` = J1 (5-6 tem a maior soma); só 5-6 pode ser jogada primeiro |
| TC-DO-06 | Encaixe | `tests/jogadas.spec.js` | `mesa` = `6-6`, `6-3`; `ponta-esquerda` = 6, `ponta-direita` = 3; `vez` = J1 |
| TC-DO-07 | Peça girada | `tests/jogadas.spec.js` | Na mesa aparece `3-1`; `ponta-direita` = 1; não aparece `escolha-lado` |
| TC-DO-08 | Jogada inválida | `tests/jogadas.spec.js` | `mensagem` = "Jogada inválida"; 0-0 continua na mão; `vez` continua J1 |
| TC-DO-09 | Escolher o lado | `tests/jogadas.spec.js` | `escolha-lado` aparece; `btn-esquerda` → peça entra à esquerda como `1-6` e `ponta-esquerda` = 1 |
| TC-DO-10 | Mão escondida | `tests/distribuicao.spec.js` | Peças do jogador da vez `data-face="cima"`, do outro `"baixo"`; depois de jogar, invertem |
| TC-DO-11 | Comprar só sem jogada | `tests/compra.spec.js` | Para J2 (tem 6-2) `btn-comprar` desabilitado |
| TC-DO-12 | Comprar até conseguir jogar | `tests/compra.spec.js` | J2: `btn-comprar` habilitado; comprar 3 vezes → `monte-qtd` = 0 e 4-6 na mão; depois de pegar 4-6, `btn-comprar` desabilita |
| TC-DO-13 | Passar | `tests/compra.spec.js` | J2: `btn-comprar` desabilitado, `btn-passar` habilitado; passar → `vez` = J1 |
| TC-DO-14 | Batida | `tests/fim-de-jogo.spec.js` | `mensagem` = "Jogador 1 venceu!"; `pontos-j1` = 6 (2+4+0+0); peças travadas |
| TC-DO-15 | Jogo trancado | `tests/fim-de-jogo.spec.js` | `mensagem` = "Jogo trancado — Jogador 1 venceu!" (1 ponto contra 13); `pontos-j1` = 13 |
| TC-DO-16 | Trancado com empate | `tests/fim-de-jogo.spec.js` | Somas 4 × 4 (1+3 = 4; 2+2 = 4); `mensagem` = "Empate"; ninguém pontua |
| TC-DO-17 | Nova partida | `tests/fim-de-jogo.spec.js` | 7 peças para cada um, monte 14, mesa vazia, `mensagem` vazia |
| TC-DO-18 | Dupla vence soma | `tests/distribuicao.spec.js` | `vez` = J1; J1 joga 1-1 → mesa = `1-1` |
| TC-DO-19 | Maior dupla entre várias | `tests/distribuicao.spec.js` | `vez` = J2; 1-2 → "Jogada inválida"; 5-5 → mesa = `5-5` |
| TC-DO-20 | Escolher o lado direito | `tests/jogadas.spec.js` | Mesa = `6-6`, `6-3`, `3-1`, `1-6`; `ponta-direita` = 6 |
| TC-DO-21 | Girar na ponta esquerda | `tests/jogadas.spec.js` | Mesa = `5-2`, `2-6`, `6-6`, `6-3`; `ponta-esquerda` = 5 |
| TC-DO-22 | Peças jogáveis destacadas | `tests/dicas.spec.js` | Antes: só 6-6 de J1 marcada (saída obrigatória). Depois: 3-6 e 1-6 de J2 marcadas, 2-2 não; nada marcado em J1 |
| TC-DO-23 | Sugerir comprar | `tests/dicas.spec.js` | Na vez de J1, `btn-comprar` sem sugestão; na de J2, nenhuma peça marcada e `btn-comprar` com `data-sugerido="true"` |

## Estrutura

```
index.html                esqueleto da tela (elementos da seção 3)
js/main.js                ponto de entrada do jogo
tests/helpers.js          abrirJogo(), cenários fixos e atalhos
tests/*.spec.js           casos de teste
scripts/verificar-testes.mjs  verificador (npm run verificar e CI)
PLANEJAMENTO.md           regras, contrato, tarefas e casos de teste
```

## Organização da refatoração

- `tests/helpers.js` preserva a API e os cenários específicos do jogo.
- `tests/support/interface.js` concentra abertura da página, isolamento dos módulos e clique direito.
- `scripts/lib/relatorio-testes.mjs` separa a classificação dos resultados da execução do Jest.
- `scripts/verificar-testes.mjs` executa o Jest diretamente pelo Node, inclusive no Windows, e remove temporários com `finally`.
- `npm run test:infra` verifica a infraestrutura separadamente dos casos RED do jogo.
- `.github/workflows/testes.yml` executa infraestrutura e verificação completa no GitHub Actions.

Os arquivos `index.html` e `js/main.js` da base permanecem intactos. No `PLANEJAMENTO.md`, apenas a identificação foi ajustada; regras e casos permanecem iguais. Os casos `tests/*.spec.js` foram refatorados, mantendo os cenários e o contrato das verificações.
O arquivo de testes que já existia na raiz deste repositório continua preservado, fora do `testMatch` do Jest.
Ele usa outro contrato (API Node, sem interface) e pode ser executado separadamente com `node --test <arquivo>.test.js` quando houver sua implementação.
Os jogos continuam não implementados: `npm test` falha de propósito na fase RED; o comando de aceitação é `npm run verificar:completo`.

## Refatoração dos próprios casos de teste

- Cada arquivo agora agrupa seus casos por domínio com `describe`, preservando os títulos e IDs TC.
- Dados determinísticos e rotinas de cenário ficam em `tests/cenarios/`, sem alterar cartas, puzzles, minas, peças ou frotas.
- As verificações repetidas usam `conferir` em `tests/support/verificacoes.js`, com os mesmos matchers e negações do Jest.
- Onde havia abertura seguida de Nova partida, `iniciarPartida` reaproveita a mesma sequência.
- `npm run verificar:equivalencia` expande essas abstrações e compara hashes das árvores sintáticas dos casos, parâmetros, ações, asserções e hooks com a versão anterior à refatoração. Isso complementa, mas não substitui, a execução em uma implementação futura dos jogos.
