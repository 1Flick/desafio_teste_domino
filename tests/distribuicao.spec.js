// Testes de peças, distribuição e de quem começa (G2, G3). Casos da seção 5 do PLANEJAMENTO.md.
// Modo somente testes: o jogo ainda não existe, então estes testes FALHAM de propósito.
import { abrirJogo, screen, pecasNaMao, jogarPeca, pecasDaMesa } from './helpers.js';
import { novaPartida, pecaDeSaida, CENARIO_6_6_COM_J2, CENARIO_SEM_DUPLAS, CENARIO_DUPLA_X_SOMA, CENARIO_DUPLAS } from "./cenarios/distribuicao.js";
import { conferir } from "./support/verificacoes.js";
import { iniciarPartida } from "./partidas.js";
describe("Domin\xF3 \u2014 distribuicao", () => {
  test('TC-DO-01 nova partida: 7 peças para cada um e 14 no monte', async () => {
    await novaPartida();
    conferir.quantidade(pecasNaMao('j1'), 7);
    conferir.quantidade(pecasNaMao('j2'), 7);
    conferir.texto(screen.getByTestId('monte-qtd'), /^14$/);
    conferir.quantidade(pecasDaMesa(), 0);
  });
  test('TC-DO-02 peças distribuídas são do duplo-seis e não se repetem (20 partidas)', async () => {
    for (let i = 0; i < 20; i++) {
      await novaPartida();
      const ids = [...pecasNaMao('j1'), ...pecasNaMao('j2')].map(p => p.getAttribute('data-testid'));
      conferir.quantidade(ids, 14);
      for (const id of ids) {
        const [, a, b] = id.match(/^peca-([0-6])-([0-6])$/) ?? [];
        expect(id).toMatch(/^peca-[0-6]-[0-6]$/); // peça de 0-0 a 6-6
        expect(Number(a)).toBeLessThanOrEqual(Number(b));
      }
      expect(new Set(ids).size).toBe(14);
    }
  });

  /** Peça de saída pela regra da seção 1: a maior dupla; sem dupla, a de maior soma. */

  test('TC-DO-10 só a mão do jogador da vez fica virada para cima', async () => {
    const user = await novaPartida();
    const vez = screen.getByTestId('vez').textContent.trim().toLowerCase();
    expect(['j1', 'j2']).toContain(vez);
    const outro = vez === 'j1' ? 'j2' : 'j1';
    for (const p of pecasNaMao(vez)) conferir.atributo(p, 'data-face', 'cima');
    for (const p of pecasNaMao(outro)) conferir.atributo(p, 'data-face', 'baixo');
    await jogarPeca(user, vez, pecaDeSaida(pecasNaMao(vez).map(p => p.getAttribute('data-testid'))));
    for (const p of pecasNaMao(outro)) conferir.atributo(p, 'data-face', 'cima');
    for (const p of pecasNaMao(vez)) conferir.atributo(p, 'data-face', 'baixo');
  });

  // Só J2 tem dupla (6-6). Monte vazio.

  test('TC-DO-03 quem tem a maior dupla começa', async () => {
    await abrirJogo(CENARIO_6_6_COM_J2);
    conferir.texto(screen.getByTestId('vez'), /^J2$/);
  });
  test('TC-DO-04 a primeira jogada tem que ser a maior dupla', async () => {
    const user = await abrirJogo(CENARIO_6_6_COM_J2);
    await jogarPeca(user, 'j2', '2-3');
    conferir.texto(screen.getByTestId('mensagem'), 'Jogada inválida');
    conferir.quantidade(pecasDaMesa(), 0);
    await jogarPeca(user, 'j2', '6-6');
    expect(pecasDaMesa()).toEqual(['6-6']);
  });

  // Ninguém tem dupla: começa quem tem a peça de maior soma (5-6, com J1).

  test('TC-DO-05 sem duplas, começa a peça de maior soma', async () => {
    const user = await abrirJogo(CENARIO_SEM_DUPLAS);
    conferir.texto(screen.getByTestId('vez'), /^J1$/);
    await jogarPeca(user, 'j1', '0-1');
    conferir.texto(screen.getByTestId('mensagem'), 'Jogada inválida');
    conferir.quantidade(pecasDaMesa(), 0);
    await jogarPeca(user, 'j1', '5-6');
    conferir.quantidade(pecasDaMesa(), 1);
    expect(['5-6', '6-5']).toContain(pecasDaMesa()[0]);
  });

  // J1 tem só uma dupla baixa (1-1); J2 tem a peça de maior soma (5-6), mas nenhuma dupla.

  test('TC-DO-18 dupla vence soma: quem tem dupla começa, mesmo com soma menor', async () => {
    const user = await abrirJogo(CENARIO_DUPLA_X_SOMA);
    conferir.texto(screen.getByTestId('vez'), /^J1$/);
    await jogarPeca(user, 'j1', '1-1');
    expect(pecasDaMesa()).toEqual(['1-1']);
  });

  // J1 tem 3-3 e a peça de maior soma (5-6); J2 tem 5-5, a maior dupla.

  test('TC-DO-19 a maior dupla começa, entre várias duplas', async () => {
    const user = await abrirJogo(CENARIO_DUPLAS);
    conferir.texto(screen.getByTestId('vez'), /^J2$/);
    await jogarPeca(user, 'j2', '1-2');
    conferir.texto(screen.getByTestId('mensagem'), 'Jogada inválida');
    conferir.quantidade(pecasDaMesa(), 0);
    await jogarPeca(user, 'j2', '5-5');
    expect(pecasDaMesa()).toEqual(['5-5']);
  });
});
