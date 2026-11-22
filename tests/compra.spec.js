// Testes de compra e passe (B2 e B3).
import { abrirJogo, screen, pecasNaMao, jogarPeca } from './helpers.js';
import { conferir } from "./support/verificacoes.js";
describe("Domin\xF3 \u2014 compra", () => {
  test('TC-DO-11 comprar fica desabilitado quando há jogada', async () => {
    const user = await abrirJogo({
      j1: '6-6,6-1',
      j2: '0-1,6-2',
      monte: '3-4'
    });
    await jogarPeca(user, 'j1', '6-6');
    conferir.texto(screen.getByTestId('vez'), /^J2$/);
    conferir.desabilitado(screen.getByTestId('btn-comprar'));
  });
  test('TC-DO-12 comprar continua até obter peça jogável', async () => {
    const user = await abrirJogo({
      j1: '6-6,5-5',
      j2: '0-1,2-3',
      monte: '0-0,1-2,4-6'
    });
    await jogarPeca(user, 'j1', '6-6');
    conferir.habilitado(screen.getByTestId('btn-comprar'));
    await user.click(screen.getByTestId('btn-comprar')); // compra 0-0: uma peça por clique
    conferir.texto(screen.getByTestId('monte-qtd'), /^2$/);
    conferir.quantidade(pecasNaMao('j2'), 3);
    conferir.habilitado(screen.getByTestId('btn-comprar'));
    await user.click(screen.getByTestId('btn-comprar')); // compra 1-2
    conferir.texto(screen.getByTestId('monte-qtd'), /^1$/);
    conferir.quantidade(pecasNaMao('j2'), 4);
    conferir.habilitado(screen.getByTestId('btn-comprar'));
    await user.click(screen.getByTestId('btn-comprar')); // compra 4-6, que encaixa no 6
    conferir.texto(screen.getByTestId('monte-qtd'), /^0$/);
    conferir.quantidade(pecasNaMao('j2'), 5);
    expect(pecasNaMao('j2').map(p => p.dataset.testid)).toContain('peca-4-6');
    conferir.desabilitado(screen.getByTestId('btn-comprar'));
  });
  test('TC-DO-13 passar alterna a vez quando monte está vazio', async () => {
    const user = await abrirJogo({
      j1: '6-6,6-5',
      j2: '0-1',
      monte: ''
    });
    await jogarPeca(user, 'j1', '6-6');
    conferir.texto(screen.getByTestId('vez'), /^J2$/);
    conferir.desabilitado(screen.getByTestId('btn-comprar'));
    conferir.habilitado(screen.getByTestId('btn-passar'));
    await user.click(screen.getByTestId('btn-passar'));
    conferir.texto(screen.getByTestId('vez'), /^J1$/);
  });
});
