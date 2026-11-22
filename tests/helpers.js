// API dos cenários; ciclo de abertura compartilhado em support/interface.js.
import { criarAbertura, screen, within } from './support/interface.js';
export { cliqueDireito, screen, within } from './support/interface.js';

export const abrirJogo = criarAbertura(() => import('../js/main.js'));


/**
 * CENARIO_JOGADAS: J1 = 6-6, 1-3, 0-0; J2 = 3-6, 1-6, 2-2; monte vazio. J1 começa (tem 6-6).
 * Com j1/j2/monte na URL, a partida já começa ao abrir a página.
 */
export const CENARIO_JOGADAS = { j1: '6-6,1-3,0-0', j2: '3-6,1-6,2-2', monte: '' };

/** Peças na mão de 'j1' ou 'j2'. */
export const pecasNaMao = (jogador) => within(screen.getByTestId(`mao-${jogador}`)).queryAllByTestId(/^peca-\d-\d$/);
/** Clica na peça `a-b` (a ≤ b) da mão do jogador. */
export async function jogarPeca(user, jogador, peca) {
  await user.click(within(screen.getByTestId(`mao-${jogador}`)).getByTestId(`peca-${peca}`));
}
/** Peças da mesa, da esquerda para a direita, na orientação em que estão (data-peca). */
export const pecasDaMesa = () => [...screen.getByTestId('mesa').children].map((p) => p.getAttribute('data-peca'));
