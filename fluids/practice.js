// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + (Math.abs(x) >= 1000 ? Math.abs(x).toFixed(0) : Math.abs(x).toPrecision(3));   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const G = M.G, RHO = M.RHO;
const AL = M.MATERIALS.find(m => m.key === 'al'), ICEM = M.MATERIALS.find(m => m.key === 'ice');
const BU = M.BUOY, PA = M.PASCAL, FL = M.FLOW, BE = M.BERN, TK = M.TANK;
const eq = s => `<div class="eq">${s}</div>`;

// 0 · a 5.0 cm ice cube
const S0 = 0.05, M0 = ICEM.rho * S0 ** 3;
// 1 · standing on one shoe
const A1 = M.SHOE.w * M.SHOE.l, P1 = M.PERSON.W / A1;
// 2 · the lake floor
const D2 = M.LAKE.depth, P2 = M.pAt(D2);
// 3 · a car lift: pistons of radius 2.0 cm and 10.0 cm, a 12 000 N car
const R3a = 0.020, R3b = 0.100, W3 = 12000, F3 = W3 * (R3a / R3b) ** 2;
const D3 = PA.stroke * PA.A1 / PA.A2;
// 4 · the cube all the way under
const T4 = BU.W - BU.Fb;
// 5 · wood in sea water; the steel ball on the floor
const FR5 = M.WOOD.rho / M.RHO_SEA, N5 = M.BALL.W - M.BALL.Fb;
// 6 · narrowing to 10 cm radius; filling a 1000 L tank from the wide part
const R6 = 0.10, V6 = FL.v1 * (FL.r1 / R6) ** 2, T6 = 1.0 / FL.Q;
// 7 · Bernoulli at the three points
const [B1, B2, B3] = BE.pts;
// 8 · the jet when the water is 0.60 m above the hole
const H8 = 0.60, X8 = 2 * Math.sqrt(H8 * TK.yh);
const kPa = (x, n = 1) => `${(x / 1000).toFixed(n)} kPa`;

export const PRACTICE = {
  0: [
    { q: `한 변이 10 cm인 알루미늄 정육면체(ρ = ${AL.rho} kg/m³)를 똑같은 작은 정육면체 여덟 개로 자른다. 작은 정육면체 하나의 밀도는 얼마인가?`,
      choices: [`${AL.rho / 8} kg/m³`, `${AL.rho / 2} kg/m³`, `${AL.rho} kg/m³`, `${AL.rho * 8} kg/m³`], answer: 2,
      why: `<p>각 조각은 질량도 ⅛, 부피도 ⅛이므로 ρ = m/V는 변하지 않는다. 밀도는 물체가 아니라 물질의 성질이다.</p>` },
    { q: `한 변이 ${f(S0 * 100, 1)} cm인 얼음 정육면체의 질량은 얼마인가? (ρ<sub>ice</sub> = ${ICEM.rho} kg/m³)`,
      choices: [`${p3(ICEM.mass / 2)} kg`, `${p3(M0)} kg`, `${p3(ICEM.mass / 4)} kg`, `${p3(ICEM.rho * (S0 * 10) ** 3)} kg`], answer: 1,
      why: `<p>먼저 미터로 바꾼다: V = (${f(S0, 2)} m)³ = ${f(S0 ** 3 * 1e4, 2)} × 10<sup>−4</sup> m³.</p>${eq(`m = ρV = ${ICEM.rho} × ${f(S0 ** 3 * 1e4, 2)} × 10<sup>−4</sup> = ${p3(M0)} kg`)}<p>한 변을 절반으로 줄이면 부피는 ½이 아니라 ⅛이 된다: 10 cm 정육면체의 ${f(ICEM.mass, 3)} kg이 ${p3(M0)} kg이 된다.</p>` },
  ],
  1: [
    { q: `${M.PERSON.m} kg인 사람이 신발 <b>한</b> 짝(밑창 ${f(M.SHOE.w * 100, 0)} cm × ${f(M.SHOE.l * 100, 0)} cm)으로 선다. 눈에 작용하는 압력은 얼마인가?`,
      choices: [`${kPa(M.P_SHOE)}`, `${kPa(M.PERSON.m / A1, 2)}`, `${kPa(2 * P1)}`, `${kPa(P1)}`], answer: 3,
      why: `${eq(`P = F/A = mg / A = ${f(M.PERSON.W, 0)} N / ${f(A1, 3)} m² = ${kPa(P1)}`)}<p>신발 두 짝 넓이의 절반이므로, 두 짝일 때의 ${kPa(M.P_SHOE)}의 두 배다. ${kPa(M.PERSON.m / A1, 2)}는 무게가 아니라 질량을 넓이로 나눈 값이다.</p>` },
    { q: `넓이 1 cm²인 못 머리를 ${M.NAIL.F} N으로 밀어 못을 나무에 박는다. 못은 가속하지 않는다. 엄지가 못 머리에 작용하는 것과 비교할 때, 못 끝이 나무에 작용하는 것은 어떠한가?`,
      choices: ['힘도 같고 압력도 같다', '힘도 더 크고 압력도 더 크다', '힘은 같고 압력은 훨씬 크다', '힘은 더 작고 압력은 더 크다'], answer: 2,
      why: `<p>못은 평형 상태에 있으므로(그리고 질량이 거의 없으므로) 나무는 같은 ${M.NAIL.F} N으로 되민다. 못 끝의 넓이는 200분의 1이므로 압력은 200배다: ${f(M.NAIL.F / M.NAIL.head / 1e3, 0)} kPa에 비해 ${f(M.NAIL.F / M.NAIL.tip / 1e6, 0)} MPa.</p>` },
  ],
  2: [
    { q: `깊이 ${D2} m인 호수 바닥의 절대 압력은 얼마인가? (<i>P</i><sub>0</sub> = ${kPa(M.P0)})`,
      choices: [`${kPa(M.gauge(D2))}`, `${kPa(P2)}`, `${kPa(M.P0)}`, `${kPa(2 * M.P0)}`], answer: 1,
      why: `${eq(`<i>P</i> = <i>P</i><sub>0</sub> + ρ<i>gh</i> = ${kPa(M.P0)} + ${RHO} × ${f(G)} × ${D2} = ${kPa(M.P0)} + ${kPa(M.gauge(D2))} = ${kPa(P2)}`)}<p>${kPa(M.gauge(D2))}는 계기 압력이다: 수면 위의 대기압을 빠뜨렸다.</p>` },
    { q: '길고 가는 꽃병, 넓은 대접, 위로 갈수록 좁아지는 원뿔에 물을 같은 깊이로 채운다. 바닥의 압력은 어떠한가?',
      choices: ['물이 가장 많이 담긴 넓은 대접에서 가장 크다', '물이 좁게 눌리는 원뿔에서 가장 크다', '가는 꽃병에서 가장 크다', '셋 모두 같다'], answer: 3,
      why: '<p><i>P</i> = <i>P</i><sub>0</sub> + ρ<i>gh</i>는 열린 수면 아래의 깊이에만 의존하며, 그릇의 모양이나 물의 양과는 무관하다. 무게의 차이는 벽이 떠받친다.</p>' },
  ],
  3: [
    { q: `자동차 리프트의 피스톤 반지름이 ${f(R3a * 100, 1)} cm와 ${f(R3b * 100, 1)} cm이다. 큰 피스톤 위의 ${W3} N 자동차를 떠받치려면 작은 피스톤에 얼마의 힘을 가해야 하는가?`,
      choices: [`${p3(W3 * R3a / R3b)} N`, `${p3(F3)} N`, `${p3(W3)} N`, `${p3(W3 * (R3b / R3a) ** 2)} N`], answer: 1,
      why: `<p>두 피스톤에 같은 Δ<i>P</i>가 작용하므로 <i>F</i><sub>1</sub>/<i>A</i><sub>1</sub> = <i>F</i><sub>2</sub>/<i>A</i><sub>2</sub>이고, 넓이는 r²에 비례한다:</p>${eq(`<i>F</i><sub>1</sub> = ${W3} × (${f(R3a * 100, 1)} / ${f(R3b * 100, 1)})² = ${p3(F3)} N`)}<p>${p3(W3 * R3a / R3b)} N은 넓이의 비 대신 반지름의 비를 쓴 값이다.</p>` },
    { q: `본문의 압착기에서 작은 피스톤(${f(PA.A1 * 1e4, 0)} cm²)을 ${f(PA.stroke * 100, 0)} cm 눌러 내린다. 큰 피스톤(${f(PA.A2 * 1e4, 0)} cm²)은 얼마나 올라가는가?`,
      choices: [`${p3(PA.stroke * 100 * PA.r1 / PA.r2)} cm`, `${p3(PA.stroke * 100)} cm`, `${p3(PA.stroke * 100 * PA.A2 / PA.A1)} cm`, `${p3(D3 * 100)} cm`], answer: 3,
      why: `<p>물은 압축되지 않으므로 밀려 내려간 부피만큼 올라온다: <i>A</i><sub>1</sub><i>d</i><sub>1</sub> = <i>A</i><sub>2</sub><i>d</i><sub>2</sub>.</p>${eq(`<i>d</i><sub>2</sub> = ${f(PA.stroke * 100, 0)} cm × ${f(PA.A1 * 1e4, 0)} / ${f(PA.A2 * 1e4, 0)} = ${p3(D3 * 100)} cm`)}<p>열여섯 배의 힘이 16분의 1의 거리를 움직인다: 들어간 일과 나온 일이 같다.</p>` },
  ],
  4: [
    { q: `${f(BU.s * 100, 0)} cm 알루미늄 정육면체(W = ${f(BU.W, 0)} N)가 줄에 매달려 물속에 완전히 잠겨 있다. 줄의 장력은 얼마인가?`,
      choices: [`${p3(BU.W)} N`, `${p3(BU.Fb)} N`, `${p3(BU.W + BU.Fb)} N`, `${p3(T4)} N`], answer: 3,
      why: `${eq(`<i>F</i><sub>b</sub> = ρ<sub>water</sub><i>Vg</i> = ${RHO} × ${f(BU.V, 3)} × ${f(G)} = ${f(BU.Fb, 0)} N`)}${eq(`<i>T</i> = <i>W</i> − <i>F</i><sub>b</sub> = ${f(BU.W, 0)} − ${f(BU.Fb, 0)} = ${p3(T4)} N`)}<p>부력에는 알루미늄이 아니라 <b>물의</b> 밀도를 쓴다. ${p3(BU.Fb)} N은 장력이 아니라 부력이다.</p>` },
    { q: '정육면체가 완전히 잠긴 뒤 더 깊이 내린다. 정육면체가 받는 부력은 어떻게 되는가?',
      choices: ['깊을수록 압력이 크므로 증가한다', '위에 있는 물이 많아지므로 감소한다', '일정하다', '무게와 같아질 때까지 증가한다'], answer: 2,
      why: '<p>더 깊어지면 윗면과 아랫면의 압력이 모두 같은 ρgΔh만큼 커진다. 그 차이 ρgs, 따라서 <i>F</i><sub>b</sub> = ρ<i>Vg</i>는 변하지 않는다. (물은 압축되지 않는다고 본다.)</p>' },
  ],
  5: [
    { q: `${M.WOOD.rho} kg/m³ 나무 토막을 민물 대신 바닷물(${M.RHO_SEA} kg/m³)에 띄운다. 나무 토막의 몇 %가 물에 잠기는가?`,
      choices: [`${f(100 * M.WOOD.rho / RHO, 1)}%`, `${f(100 * (1 - FR5), 1)}%`, `${f(100 * FR5, 1)}%`, `${f(100 * (1 - M.WOOD.rho / RHO), 1)}%`], answer: 2,
      why: `<p>떠 있으므로 <i>F</i><sub>b</sub> = <i>W</i>: ρ<sub>sea</sub><i>V</i><sub>under</sub><i>g</i> = ρ<sub>wood</sub><i>Vg</i>.</p>${eq(`<i>V</i><sub>under</sub>/<i>V</i> = ${M.WOOD.rho} / ${M.RHO_SEA} = ${f(100 * FR5, 1)}%`)}<p>밀도가 더 큰 물은 더 적은 부피로 나무를 떠받치므로, 민물에서의 ${f(100 * M.WOOD.rho / RHO, 1)}%보다 조금 적다. ${f(100 * (1 - FR5), 1)}%는 물 위로 나온 부분이다.</p>` },
    { q: `강철 공(반지름 ${f(M.BALL.r, 2)} m, ρ = ${M.BALL.rho} kg/m³)이 수조 바닥에 놓여 있다. 바닥이 공을 밀어 올리는 힘은 얼마인가?`,
      choices: [`${p3(M.BALL.W)} N`, `${p3(N5)} N`, `${p3(M.BALL.Fb)} N`, `${p3(M.BALL.W + M.BALL.Fb)} N`], answer: 1,
      why: `${eq(`V = ⁴⁄₃πr³ = ${f(M.BALL.V, 4)} m³, W = ρ<sub>steel</sub>Vg = ${f(M.BALL.W, 0)} N, <i>F</i><sub>b</sub> = ρ<sub>water</sub>Vg = ${f(M.BALL.Fb, 0)} N`)}${eq(`<i>F</i><sub>N</sub> = W − <i>F</i><sub>b</sub> = ${p3(N5)} N`)}<p>가라앉은 공도 물은 여전히 밀어 올린다. 바닥은 나머지만 떠받친다.</p>` },
  ],
  6: [
    { q: `반지름 ${f(FL.r1 * 100, 0)} cm인 관에서 ${f(FL.v1, 1)} m/s로 흐르던 물이 반지름 ${f(R6 * 100, 0)} cm인 구간으로 들어간다. 그곳에서의 속력은 얼마인가?`,
      choices: [`${p3(FL.v1 * FL.r1 / R6)} m/s`, `${p3(V6)} m/s`, `${p3(FL.v1 * (R6 / FL.r1) ** 2)} m/s`, `${p3(FL.v1 * R6 / FL.r1)} m/s`], answer: 1,
      why: `${eq(`<i>A</i><sub>1</sub><i>v</i><sub>1</sub> = <i>A</i><sub>2</sub><i>v</i><sub>2</sub> → <i>v</i><sub>2</sub> = <i>v</i><sub>1</sub>(r<sub>1</sub>/r<sub>2</sub>)² = ${f(FL.v1, 1)} × 3² = ${p3(V6)} m/s`)}<p>넓이는 r²에 비례하므로 반지름이 3분의 1이면 넓이는 9분의 1이다. ${p3(FL.v1 * FL.r1 / R6)} m/s는 반지름의 비를 쓴 값이다.</p>` },
    { q: `넓은 관(반지름 ${f(FL.r1 * 100, 0)} cm, ${f(FL.v1, 1)} m/s)으로 1000 L 탱크를 채우는 데 걸리는 시간은 얼마인가?`,
      choices: [`${p3(1.0 / (Math.PI * (2 * FL.r1) ** 2 * FL.v1))} s`, `${p3(1.0 / (2 * Math.PI * FL.r1 * FL.v1))} s`, `${p3(T6)} s`, `${p3(1.0 / (FL.r1 ** 2 * FL.v1))} s`], answer: 2,
      why: `${eq(`<i>Q</i> = <i>Av</i> = π(${f(FL.r1, 2)})² × ${f(FL.v1, 1)} = ${f(FL.Q, 4)} m³/s`)}${eq(`t = V/Q = 1.000 m³ / ${f(FL.Q, 4)} m³/s = ${p3(T6)} s`)}<p>1000 L는 1 m³이다. 지름 60 cm를 반지름으로 쓰면 넓이가 네 배로 너무 커진다.</p>` },
  ],
  7: [
    { q: `본문의 관에서 물은 넓은 부분에서 계기 압력 ${kPa(B1.P, 0)}, 속력 ${f(B1.v, 1)} m/s로 흐르다가, 같은 높이의 좁은 부분에서 ${f(B2.v, 1)} m/s로 빨라진다. 그곳의 계기 압력은 얼마인가?`,
      choices: [`${kPa(B1.P + (B2.P - B1.P) * -1, 0)}`, `${kPa(B1.P, 0)}`, `${kPa(B1.P * B1.v / B2.v, 1)}`, `${kPa(B2.P, 0)}`], answer: 3,
      why: `${eq(`<i>P</i><sub>2</sub> = <i>P</i><sub>1</sub> + ½ρ(<i>v</i><sub>1</sub>² − <i>v</i><sub>2</sub>²) = ${kPa(B1.P, 0)} + ½ × ${RHO} × (${f(B1.v, 0)}² − ${f(B2.v, 0)}²) = ${kPa(B2.P, 0)}`)}<p>빠른 흐름, 낮은 압력. ${kPa(B1.P + (B2.P - B1.P) * -1, 0)}는 부호를 뒤집은 값이다: 물이 빨라지는 것은 뒤쪽의 압력이 더 높기 때문이다.</p>` },
    { q: `다시 ${f(B3.v, 1)} m/s로 느려진 뒤 관이 ${f(BE.H, 1)} m 올라간다. 높고 넓은 부분의 계기 압력은 얼마인가?`,
      choices: [`${kPa(B1.P + RHO * G * BE.H)}`, `${kPa(B3.P)}`, `${kPa(B1.P)}`, `${kPa(B1.P - 2 * RHO * G * BE.H)}`], answer: 1,
      why: `<p>점 1과 속력이 같으므로 ½ρv² 항은 상쇄된다:</p>${eq(`<i>P</i><sub>3</sub> = <i>P</i><sub>1</sub> − ρ<i>g</i>Δy = ${kPa(B1.P, 0)} − ${RHO} × ${f(G)} × ${f(BE.H, 1)} = ${kPa(B3.P)}`)}<p>물을 들어 올리면 압력이 줄어든다. 더 깊이 잠수하면 압력이 늘어나는 것과 같은 이치다.</p>` },
  ],
  8: [
    { q: '구멍 위 물의 높이를 네 배로 높인다. 구멍에서 나오는 물줄기의 속력은 어떻게 되는가?',
      choices: ['같은 속력', `√2배`, '두 배', '네 배'], answer: 2,
      why: '<p><i>v</i> = √(2<i>gh</i>): <i>h</i>가 네 배면 속력은 √4 = 2배다. 네 배 높이에서 떨어뜨린 돌과 같다.</p>' },
    { q: `구멍은 바닥에서 ${f(TK.yh, 2)} m 위에 있다. 물이 구멍 위 ${f(H8, 2)} m 높이에 있을 때, 물줄기는 탱크에서 얼마나 떨어진 곳에 떨어지는가?`,
      choices: [`${p3(Math.sqrt(H8 * TK.yh))} m`, `${p3(X8)} m`, `${p3(M.jetRange(TK.h0))} m`, `${p3(Math.sqrt(2 * H8 * TK.yh))} m`], answer: 1,
      why: `${eq(`<i>v</i> = √(2 × ${f(G)} × ${f(H8, 2)}) = ${f(M.torricelli(H8))} m/s, t = √(2 × ${f(TK.yh, 2)} / ${f(G)}) = ${f(M.jetFlight, 3)} s`)}${eq(`x = vt = 2√(h y<sub>hole</sub>) = ${p3(X8)} m`)}<p>${p3(M.jetRange(TK.h0))} m는 지금이 아니라 탱크가 가득 찼을 때(${f(TK.h0, 1)} m)의 수평 도달 거리다.</p>` },
  ],
};
