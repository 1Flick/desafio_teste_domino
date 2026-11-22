// Dados determinísticos e ações reutilizadas nos casos deste domínio.
// Testes de jogar peças na mesa (G4, G5). Casos da seção 5 do PLANEJAMENTO.md.
// Modo somente testes: o jogo ainda não existe, então estes testes FALHAM de propósito.
import { abrirJogo, screen, pecasNaMao, jogarPeca, pecasDaMesa, CENARIO_JOGADAS } from "../helpers.js";

// CENARIO_JOGADAS: J1 = 6-6, 1-3, 0-0 · J2 = 3-6, 1-6, 2-2 · monte vazio.
/** J1 joga 6-6 e J2 joga 3-6 → pontas 6 e 3. */
import { conferir } from "../support/verificacoes.js";
// CENARIO_JOGADAS: J1 = 6-6, 1-3, 0-0 · J2 = 3-6, 1-6, 2-2 · monte vazio.
/** J1 joga 6-6 e J2 joga 3-6 → pontas 6 e 3. */
export async function ateTC06(user) {
  await jogarPeca(user, 'j1', '6-6');
  await jogarPeca(user, 'j2', '3-6');
}
/** ... e J1 joga 1-3 → pontas 6 e 1. */
export async function ateTC07(user) {
  await ateTC06(user);
  await jogarPeca(user, 'j1', '1-3');
}
// J1 = 6-6, 2-6, 0-0 · J2 = 3-6, 2-5, 1-1. Depois de 6-6 e 3-6, as pontas são 6 (esq.) e 3 (dir.):
// 2-6 só encaixa na esquerda; depois, 2-5 só encaixa na esquerda (no 2) e precisa virar 5-2.
export const CENARIO_GIRO_ESQUERDA = {
  j1: '6-6,2-6,0-0',
  j2: '3-6,2-5,1-1',
  monte: ''
};
