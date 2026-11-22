// Dados determinísticos e ações reutilizadas nos casos deste domínio.
// Testes de peças, distribuição e de quem começa (G2, G3). Casos da seção 5 do PLANEJAMENTO.md.
// Modo somente testes: o jogo ainda não existe, então estes testes FALHAM de propósito.
import { abrirJogo, screen, pecasNaMao, jogarPeca, pecasDaMesa } from "../helpers.js";
import { conferir } from "../support/verificacoes.js";
import { iniciarPartida } from "../partidas.js";
export async function novaPartida() {
  const user = await iniciarPartida();
  return user;
}
/** Peça de saída pela regra da seção 1: a maior dupla; sem dupla, a de maior soma. */
export function pecaDeSaida(ids) {
  const pecas = ids.map(id => id.replace('peca-', '').split('-').map(Number));
  const duplas = pecas.filter(([a, b]) => a === b).sort((x, y) => y[0] - x[0]);
  const [a, b] = duplas[0] ?? [...pecas].sort((x, y) => y[0] + y[1] - (x[0] + x[1]))[0];
  return `${a}-${b}`;
}
// Só J2 tem dupla (6-6). Monte vazio.
export const CENARIO_6_6_COM_J2 = {
  j1: '1-2,0-3,4-5',
  j2: '6-6,2-3,0-1',
  monte: ''
};
// Ninguém tem dupla: começa quem tem a peça de maior soma (5-6, com J1).
export const CENARIO_SEM_DUPLAS = {
  j1: '5-6,0-1',
  j2: '4-6,2-3',
  monte: ''
};
// J1 tem só uma dupla baixa (1-1); J2 tem a peça de maior soma (5-6), mas nenhuma dupla.
export const CENARIO_DUPLA_X_SOMA = {
  j1: '1-1,0-2',
  j2: '5-6,0-3',
  monte: ''
};
// J1 tem 3-3 e a peça de maior soma (5-6); J2 tem 5-5, a maior dupla.
export const CENARIO_DUPLAS = {
  j1: '3-3,5-6',
  j2: '5-5,1-2',
  monte: ''
};
