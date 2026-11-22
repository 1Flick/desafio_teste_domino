// Testes de jogar peças na mesa (G4, G5). Casos da seção 5 do PLANEJAMENTO.md.
// Modo somente testes: o jogo ainda não existe, então estes testes FALHAM de propósito.
import { abrirJogo, screen, pecasNaMao, jogarPeca, pecasDaMesa, CENARIO_JOGADAS } from './helpers.js';

// CENARIO_JOGADAS: J1 = 6-6, 1-3, 0-0 · J2 = 3-6, 1-6, 2-2 · monte vazio.
/** J1 joga 6-6 e J2 joga 3-6 → pontas 6 e 3. */
import { ateTC06, ateTC07, CENARIO_GIRO_ESQUERDA } from "./cenarios/jogadas.js";
import { conferir } from "./support/verificacoes.js";
describe("Domin\xF3 \u2014 jogadas", () => {
  test('TC-DO-06 a peça encaixa na ponta com o mesmo número', async () => {
    const user = await abrirJogo(CENARIO_JOGADAS);
    await ateTC06(user);
    expect(pecasDaMesa()).toEqual(['6-6', '6-3']); // pontas iguais (6 e 6): entra à direita
    conferir.nao.visivel(screen.getByTestId('escolha-lado')); // ... sem perguntar
    conferir.texto(screen.getByTestId('ponta-esquerda'), /^6$/);
    conferir.texto(screen.getByTestId('ponta-direita'), /^3$/);
    conferir.texto(screen.getByTestId('vez'), /^J1$/);
  });
  test('TC-DO-07 a peça é girada para encaixar', async () => {
    const user = await abrirJogo(CENARIO_JOGADAS);
    await ateTC07(user); // 1-3 só encaixa no 3
    expect(pecasDaMesa()).toEqual(['6-6', '6-3', '3-1']);
    conferir.texto(screen.getByTestId('ponta-direita'), /^1$/);
    conferir.nao.visivel(screen.getByTestId('escolha-lado'));
  });

  // J1 = 6-6, 2-6, 0-0 · J2 = 3-6, 2-5, 1-1. Depois de 6-6 e 3-6, as pontas são 6 (esq.) e 3 (dir.):
  // 2-6 só encaixa na esquerda; depois, 2-5 só encaixa na esquerda (no 2) e precisa virar 5-2.

  test('TC-DO-21 a peça é girada também na ponta esquerda', async () => {
    const user = await abrirJogo(CENARIO_GIRO_ESQUERDA);
    await jogarPeca(user, 'j1', '6-6');
    await jogarPeca(user, 'j2', '3-6');
    await jogarPeca(user, 'j1', '2-6');
    expect(pecasDaMesa()).toEqual(['2-6', '6-6', '6-3']);
    await jogarPeca(user, 'j2', '2-5');
    expect(pecasDaMesa()).toEqual(['5-2', '2-6', '6-6', '6-3']);
    conferir.texto(screen.getByTestId('ponta-esquerda'), /^5$/);
    conferir.texto(screen.getByTestId('ponta-direita'), /^3$/);
  });
  test('TC-DO-08 peça que não encaixa é recusada', async () => {
    const user = await abrirJogo(CENARIO_JOGADAS);
    await ateTC06(user); // pontas 6 e 3
    await jogarPeca(user, 'j1', '0-0');
    conferir.texto(screen.getByTestId('mensagem'), 'Jogada inválida');
    expect(pecasNaMao('j1').map(p => p.getAttribute('data-testid'))).toContain('peca-0-0');
    conferir.texto(screen.getByTestId('vez'), /^J1$/);
  });
  test('TC-DO-09 peça que encaixa nas duas pontas: o jogador escolhe o lado', async () => {
    const user = await abrirJogo(CENARIO_JOGADAS);
    await ateTC07(user); // pontas 6 e 1
    conferir.nao.visivel(screen.getByTestId('escolha-lado'));
    await jogarPeca(user, 'j2', '1-6');
    conferir.visivel(screen.getByTestId('escolha-lado'));
    conferir.quantidade(pecasDaMesa(), 3); // ainda não entrou: espera a escolha
    await user.click(screen.getByTestId('btn-esquerda'));
    expect(pecasDaMesa()).toEqual(['1-6', '6-6', '6-3', '3-1']);
    conferir.texto(screen.getByTestId('ponta-esquerda'), /^1$/);
    conferir.nao.visivel(screen.getByTestId('escolha-lado'));
  });
  test('TC-DO-20 peça que encaixa nas duas pontas: escolher a direita', async () => {
    const user = await abrirJogo(CENARIO_JOGADAS);
    await ateTC07(user); // pontas 6 e 1
    await jogarPeca(user, 'j2', '1-6');
    conferir.visivel(screen.getByTestId('escolha-lado'));
    await user.click(screen.getByTestId('btn-direita'));
    expect(pecasDaMesa()).toEqual(['6-6', '6-3', '3-1', '1-6']);
    conferir.texto(screen.getByTestId('ponta-direita'), /^6$/);
    conferir.nao.visivel(screen.getByTestId('escolha-lado'));
  });
});
