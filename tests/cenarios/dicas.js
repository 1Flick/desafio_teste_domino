// Dados determinísticos e ações reutilizadas nos casos deste domínio.
// Testes das dicas de jogo (G6). Casos da seção 5 do PLANEJAMENTO.md.
// Modo somente testes: o jogo ainda não existe, então estes testes FALHAM de propósito.
import { abrirJogo, screen, pecasNaMao, jogarPeca, CENARIO_JOGADAS } from "../helpers.js";

/** IDs das peças marcadas como jogáveis na mão. */
import { conferir } from "../support/verificacoes.js";
/** IDs das peças marcadas como jogáveis na mão. */
export const marcadas = jogador => pecasNaMao(jogador).filter(p => p.getAttribute('data-jogavel') === 'true').map(p => p.getAttribute('data-testid'));
