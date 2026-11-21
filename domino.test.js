/**
 * ESPECIFICAÇÃO EXECUTÁVEL — DOMINÓ PARA DOIS JOGADORES
 * Enunciado: JavaScript; partida para 02 jogadores.
 * Origem: github.com/JoaoChoma/teste_software_2026/blob/main/desafios.md
 * Colaboradores: Pedro Lucas Gomes Braido (24190443-2);
 * Leonardo Fratoni Borges da Silva (24047610-2).
 *
 * Node.js >= 24. Implementação ESM em domino.js ao lado deste arquivo.
 * Execute: node --test domino.test.js
 * Opcional: MODULO_DOMINO aponta para outra implementação. Sem bibliotecas externas.
 *
 * API: criarPecas():Array<[number,number]>; new Domino({baralho=criarPecas(),inicial=0}).
 * jogar(jogador,indice,lado='direita'); comprar(jogador):[a,b]; passar(jogador);
 * encaixa([a,b]):boolean; podeJogar(jogador):boolean.
 * Estado: maos=[pecasJ0,pecasJ1], monte, mesa (peças orientadas), turno,
 * passagens, estado='jogando'|'venceu'|'empate', vencedor=0|1|null.
 *
 * VARIANTE EXPLICITADA (não estava detalhada no enunciado):
 * - Duplo-seis: 28 peças físicas únicas, 0<=a<=b<=6. [2,5] e [5,2] são a
 *   MESMA peça. Baralho fornecido aceita qualquer orientação, mas não duplicatas.
 * - Sete peças iniciais para cada jogador: primeiras 7 para J0, próximas 7 J1;
 *   últimas 14 são o monte, comprado em ordem pela frente. Entradas são copiadas.
 * - inicial é 0 ou 1. Não há obrigação de abrir com a maior carroça.
 * - Primeira peça é livre. Esquerda encaixa em mesa[0][0]; direita em última[1].
 *   Inverter a peça automaticamente se necessário. Não se altera a peça original.
 * - Índice é inteiro da mão ATUAL. Só joga o jogador da vez. Jogar válido passa
 *   turno e zera passagens; esvaziar a mão encerra imediatamente com vitória.
 * - Sem encaixe, deve comprar uma peça POR VEZ; compra mantém turno e devolve
 *   cópia da peça. Continua comprando até obter encaixe ou esgotar o monte.
 * - Não pode comprar se já tiver encaixe. Não pode passar se tiver encaixe ou
 *   houver monte. Uma passagem válida alterna turno, a segunda seguida bloqueia.
 * - No bloqueio ganha MENOR SOMA dos pontos restantes, não menor número de peças;
 *   somas iguais = estado 'empate', vencedor null. Não há placar entre partidas.
 * - Jogadas inválidas/ações após fim lançam Error, sem alterar estado.
 * - API pública permite montar snapshots tardios para testes de unidade.
 *   Fixtures abaixo conservam as 28 peças e uma mesa conectada (trilha de Euler).
 * - Nenhuma exigência de interface gráfica, IA, rede ou embaralhamento interno.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const { criarPecas, Domino } = await import(process.env.MODULO_DOMINO
  ? pathToFileURL(resolve(process.env.MODULO_DOMINO)).href
  : new URL('./domino.js',import.meta.url).href);
const PECAS=Array.from({length:7},(_,a)=>Array.from({length:7-a},(_,i)=>[a,a+i])).flat();
const key=p=>[...p].sort((a,b)=>a-b).join(',');
const copiar=m=>m.map(p=>[...p]);
function foto(j){return structuredClone({maos:j.maos,monte:j.monte,mesa:j.mesa,turno:j.turno,passagens:j.passagens,estado:j.estado,vencedor:j.vencedor});}
function rejeita(j,acao){const antes=foto(j);assert.throws(acao,Error);assert.deepEqual(foto(j),antes);}
function verificarConservacao(j){
  const todas=[...j.maos[0],...j.maos[1],...j.monte,...j.mesa];assert.equal(todas.length,28);
  assert.deepEqual(todas.map(key).sort(),PECAS.map(key).sort());
  for(let i=1;i<j.mesa.length;i++)assert.equal(j.mesa[i-1][1],j.mesa[i][0]);
}
function fixture(maos,{turno=0,monte=[],inicio=6}={}) {
  const usadas=[...maos.flat(),...monte].map(key),restantes=PECAS.filter(p=>!usadas.includes(key(p))).map(p=>[...p]);
  assert.equal(new Set(usadas).size,usadas.length,'fixture não pode duplicar peças');
  const stack=[inicio],rota=[];
  while(stack.length){const v=stack.at(-1),i=restantes.findIndex(p=>p.includes(v));if(i<0)rota.push(stack.pop());else{const p=restantes.splice(i,1)[0];stack.push(p[0]===v?p[1]:p[0]);}}
  assert.equal(restantes.length,0,'fixture precisa de uma mesa conectada');rota.reverse();
  const j=new Domino();j.maos=maos.map(copiar);j.monte=copiar(monte);j.mesa=rota.slice(1).map((v,i)=>[rota[i],v]);j.turno=turno;j.passagens=0;
  verificarConservacao(j);return j;
}
function embaralhar(seed){let n=seed>>>0;const p=copiar(PECAS);for(let i=p.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const k=n%(i+1);[p[i],p[k]]=[p[k],p[i]];}return p;}

test('criarPecas produz exatamente o conjunto duplo-seis, sem duplicatas',()=>{const p=criarPecas();assert.equal(p.length,28);assert.deepEqual(p.map(key).sort(),PECAS.map(key).sort());assert.ok(p.every(([a,b])=>Number.isInteger(a)&&Number.isInteger(b)&&a<=b));});
test('criarPecas devolve novos arrays em cada chamada',()=>{const p=criarPecas(),q=criarPecas();p[0][0]=99;assert.equal(q[0][0],0);});
for(const inicial of [0,1]) test(`distribuição é 7/7/14 e pode começar no jogador ${inicial}`,()=>{
  const j=new Domino({baralho:copiar(PECAS),inicial});assert.deepEqual(j.maos,[PECAS.slice(0,7),PECAS.slice(7,14)]);assert.deepEqual(j.monte,PECAS.slice(14));assert.equal(j.turno,inicial);assert.equal(j.estado,'jogando');assert.equal(j.vencedor,null);assert.equal(j.passagens,0);assert.deepEqual(j.mesa,[]);verificarConservacao(j);
});
test('baralho de entrada e peças são copiados, sem aliases entre mãos/monte',()=>{
  const b=copiar(PECAS),j=new Domino({baralho:b});b[0][0]=9;assert.deepEqual(j.maos[0][0],[0,0]);j.maos[1][0][0]=6;assert.deepEqual(b[7],PECAS[7]);
});
test('orientações invertidas são aceitas como um baralho físico válido',()=>{const b=PECAS.map(([a,b])=>[b,a]),j=new Domino({baralho:b});assert.deepEqual(j.maos[0],b.slice(0,7));verificarConservacao(j);});
for(const b of [[],PECAS.slice(0,27),[...PECAS,[0,0]],null,'baralho']) test(`baralho ausente/incompleto/excedente ou malformado ${String(b).slice(0,20)}`,()=>assert.throws(()=>new Domino({baralho:b}),Error));
for(const ruim of [[-1,0],[0,7],[0.5,1],['0',1],[0],[0,1,2],null]) test(`peça inválida no baralho: ${JSON.stringify(ruim)}`,()=>{const b=copiar(PECAS);b[3]=ruim;assert.throws(()=>new Domino({baralho:b}),Error);});
test('mesma peça invertida não pode aparecer duas vezes',()=>{const b=copiar(PECAS);b[0]=[1,0];assert.throws(()=>new Domino({baralho:b}),Error);});
for(const inicial of [-1,2,0.5,'0',null]) test(`jogador inicial inválido ${String(inicial)} é rejeitado`,()=>assert.throws(()=>new Domino({inicial}),Error));
test('primeira peça é livre e lado omitido é direita',()=>{const j=new Domino();j.jogar(0,3);assert.deepEqual(j.mesa,[[0,3]]);assert.equal(j.turno,1);assert.equal(j.maos[0].length,6);verificarConservacao(j);});
for(const lado of ['esquerda','direita']) for(const inverter of [false,true]) test(`encaixe na ${lado}, peça ${inverter?'invertida':'na orientação original'}`,()=>{
  // Peças restantes determinam uma trilha com pontas 6 e 2.
  const p=[2,6];if(inverter)p.reverse();
  const j=fixture([[p,[0,0]],[[3,3]]],{inicio:6});
  assert.equal(j.mesa[0][0],6);assert.equal(j.mesa.at(-1)[1],2);
  const antes=copiar(j.mesa),pecaAntes=[...j.maos[0][0]],alvo=lado==='esquerda'?antes[0][0]:antes.at(-1)[1];
  assert.ok(pecaAntes.includes(alvo));j.jogar(0,0,lado);
  const nova=lado==='esquerda'?j.mesa[0]:j.mesa.at(-1);assert.equal(nova[lado==='esquerda'?1:0],alvo);assert.equal(key(nova),key(pecaAntes));verificarConservacao(j);
});
test('encaixa consulta qualquer ponta e podeJogar verifica a mão inteira',()=>{
  const j=fixture([[[1,6],[0,0]],[[2,2]]],{inicio:6});assert.equal(j.encaixa([1,6]),true);assert.equal(j.encaixa([2,2]),false);assert.equal(j.podeJogar(0),true);assert.equal(j.podeJogar(1),false);
});
