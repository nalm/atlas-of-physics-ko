// momentum/practice.js — AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from the model or from the givens; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const G = M.G;
const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const sg = (x, n = 2) => (x > 1e-12 ? '+' : '') + f(x, n);   // signed, for velocities on a track

// 0 · the ball and the cart; a ball bouncing back
const Bl = M.BALL, Ct = M.CART, vb = 3.0, dp0 = Bl.m * (Bl.v + vb);
// 1 · the wall pulse
const Wl = M.WALL;
// 2 · the egg on the floor
const Eg = M.EGG, Fhard = Eg.J / Eg.tauHard;
// 3–5 · the carts
const S = M.STICK, Bo = M.BOUNCE, X = M.BURST;
const K0s = M.ke(S.m1, S.u1) + M.ke(S.m2, S.u2), K1s = M.ke(S.m1 + S.m2, S.v1);
// 6 · the ballistic pendulum
const Pd = M.PEND, Kclay = M.ke(Pd.m, Pd.u), Kafter = M.ke(Pd.m + Pd.M, Pd.v);
// 7 · the crash
const Cr = M.CRASH;
// 8 · the shell
const Sh = M.SHELL;
// 9 · rods (Physics C): λ = λ0 x/L, and λ = λ0 x²/L²
const Rd = M.ROD, xq = 3 * Rd.L / 4, Mq = Rd.lam0 * Rd.L / 3;
// 10 · plates (Physics C)
const Tr = M.TRI, Se = M.SEMI;
// 11 · the L and the holed square (Physics C)
const Ll = M.ELL, Ho = M.HOLE;

export const PRACTICE = {
  0: [
    { q: `${f(Bl.m, 1)} kg 공과 ${f(Ct.m, 1)} kg 수레의 운동량이 같다. 수레의 운동 에너지에 대한 공의 운동 에너지의 비는 얼마인가?`,
      choices: [f(1, 1), f(Bl.m / Ct.m), f(Ct.m / Bl.m, 1), f(Math.sqrt(Ct.m / Bl.m), 1)], answer: 2,
      why: `<p><i>p</i>가 같을 때 <i>K</i> = <i>p</i>²/2<i>m</i>이므로 따라서 <i>K</i><sub>ball</sub>/<i>K</i><sub>cart</sub> = <i>m</i><sub>cart</sub>/<i>m</i><sub>ball</sub> = ${f(Ct.m, 1)}/${f(Bl.m, 1)} = ${f(Ct.m / Bl.m, 1)}이다. 확인: ${f(M.ke(Bl.m, Bl.v), 1)} J 대 ${f(M.ke(Ct.m, Ct.v), 1)} J. 운동량이 같다고 에너지가 같은 것은 아니다.</p>` },
    { q: `동쪽으로 ${f(Bl.v, 1)} m/s로 움직이던 ${f(Bl.m, 1)} kg 공이 서쪽으로 ${f(vb, 1)} m/s로 튕겨 나온다. 운동량 변화의 크기는 얼마인가?`,
      choices: [f(Bl.m * (Bl.v - vb)) + ' kg·m/s', f(Bl.m * Bl.v) + ' kg·m/s', f(dp0) + ' kg·m/s', f(Bl.v + vb) + ' kg·m/s'], answer: 2,
      why: `<p>동쪽을 +로 잡는다. Δ<i>p</i> = <i>m</i>(<i>v</i><sub>f</sub> − <i>v</i><sub>0</sub>) = ${f(Bl.m, 1)} × (−${f(vb, 1)} − ${f(Bl.v, 1)}) = −${f(dp0)} kg·m/s이므로 |Δ<i>p</i>| = ${f(dp0)} kg·m/s이다. 속력끼리 빼면(${f(Bl.m * (Bl.v - vb))}) 속도의 방향이 뒤집혔다는 사실을 무시하게 된다.</p>` },
  ],
  1: [
    { q: `벽이 ${f(Wl.m, 1)} kg 공의 속도를 ${f(Wl.tau)} s 동안 +${f(Wl.v, 1)} m/s에서 −${f(Wl.v, 1)} m/s로 뒤집는다. 공에 작용한 평균 힘의 크기는 얼마인가?`,
      choices: [`${f(Wl.m * Wl.v / Wl.tau, 1)} N`, `${f(Wl.J / Wl.tau, 1)} N`, `${f(Wl.J * Wl.tau, 2)} N`, `${f(Wl.Fpk, 1)} N`], answer: 1,
      why: `<div class="eq"><i>F</i><sub>avg</sub> = |Δ<i>p</i>|/Δ<i>t</i> = 2<i>mv</i>/Δ<i>t</i> = ${f(Wl.J, 1)} / ${f(Wl.tau)} = ${f(Wl.J / Wl.tau, 1)} N</div><p>${f(Wl.m * Wl.v / Wl.tau, 1)} N은 공을 멈추게만 할 뿐인데, 공은 되돌아와야 한다. ${f(Wl.Fpk, 1)} N은 펄스의 평균이 아니라 최댓값이다.</p>` },
    { q: `0 ≤ <i>t</i> ≤ τ에서 벽이 작용하는 힘은 <i>F</i>(<i>t</i>) = <i>F</i><sub>pk</sub> sin(π<i>t</i>/τ)이고, <i>F</i><sub>pk</sub> = ${f(Wl.Fpk, 1)} N, τ = ${f(Wl.tau)} s이다. 이 힘이 공에 주는 충격량은 얼마인가?`,
      choices: [`${f(Wl.Fpk * Wl.tau / 2)} N·s`, `${f(Wl.Fpk * Wl.tau)} N·s`, `${f(Wl.Fpk * Wl.tau / Math.PI)} N·s`, `${f(2 * Wl.Fpk * Wl.tau / Math.PI)} N·s`], answer: 3,
      why: `<div class="eq"><i>J</i> = ∫<sub>0</sub><sup>τ</sup> <i>F</i><sub>pk</sub> sin(π<i>t</i>/τ) d<i>t</i> = <i>F</i><sub>pk</sub>(τ/π)[−cos(π<i>t</i>/τ)]<sub>0</sub><sup>τ</sup> = 2<i>F</i><sub>pk</sub>τ/π = ${f(2 * Wl.Fpk * Wl.tau / Math.PI)} N·s</div><p>2<i>mv</i> = ${f(Wl.J)} N·s와 일치한다. <i>F</i><sub>pk</sub>τ는 최댓값이 내내 이어진 것처럼 계산한 값이고, <i>F</i><sub>pk</sub>τ/2는 사인 곡선 아치가 아니라 삼각형의 넓이다.</p>` },
  ],
  2: [
    { q: `${f(Eg.m, 3)} kg 달걀이 ${f(Eg.v0, 1)} m/s로 바닥에 떨어져 튀지 않고 ${f(Eg.tauHard)} s 만에 멈춘다. 달걀에 작용한 평균 알짜힘의 크기는 얼마인가?`,
      choices: [`${f(Fhard)} N`, `${f(2 * Fhard, 1)} N`, `${f(Eg.J, 3)} N`, `${f(M.ke(Eg.m, Eg.v0) / Eg.tauHard)} N`], answer: 0,
      why: `<div class="eq"><i>F</i><sub>net</sub>Δ<i>t</i> = Δ<i>p</i> &nbsp;⇒&nbsp; <i>F</i><sub>net</sub> = <i>mv</i>/Δ<i>t</i> = ${f(Eg.J, 3)} / ${f(Eg.tauHard)} = ${f(Fhard)} N</div><p>튀지 않고 멈추므로 Δ<i>p</i>는 2<i>mv</i>가 아니라 <i>mv</i>이다. ${f(M.ke(Eg.m, Eg.v0) / Eg.tauHard)} N은 에너지를 시간으로 나눈 값이다(그것은 일률이다).</p>` },
    { q: '바닥에 떨어질 때와 비교하면, 베개에 떨어질 때 달걀이 받는 것은',
      choices: ['더 작은 충격량과 더 작은 평균 힘', '더 긴 시간에 걸친 더 큰 충격량', '더 긴 시간에 걸친 같은 평균 힘', '같은 충격량과 더 작은 평균 힘'], answer: 3,
      why: '<p>어느 경우든 달걀의 속도는 <i>v</i>에서 0이 되므로 Δ<i>p</i>, 즉 충격량은 같다. 베개는 Δ<i>t</i>를 늘리므로 <i>F</i> = Δ<i>p</i>/Δ<i>t</i>가 작아진다.</p>' },
  ],
  3: [
    { q: `오른쪽을 +로 잡는다. ${sg(S.u1, 1)} m/s로 움직이는 ${f(S.m1, 1)} kg 수레와 ${sg(S.u2, 1)} m/s로 움직이는 ${f(S.m2, 1)} kg 수레가 충돌해 달라붙는다. 충돌 후 속도는 얼마인가?`,
      choices: [`${sg((S.m1 * S.u1 - S.m2 * S.u2) / (S.m1 + S.m2))} m/s`, `${sg((S.u1 + S.u2) / 2)} m/s`, `${sg(S.v1)} m/s`, `${sg(S.m1 * S.u1 + S.m2 * S.u2)} m/s`], answer: 2,
      why: `<div class="eq"><i>v</i>′ = (<i>m</i>₁<i>v</i>₁ + <i>m</i>₂<i>v</i>₂)/(<i>m</i>₁ + <i>m</i>₂) = (${f(S.m1 * S.u1, 1)} − ${f(-S.m2 * S.u2, 1)})/${f(S.m1 + S.m2, 1)} = ${sg(S.v1)} m/s</div><p>두 번째 수레는 왼쪽으로 움직이므로 운동량이 음수다. 이를 +${f(-S.m2 * S.u2, 1)}로 더하면 ${sg((S.m1 * S.u1 - S.m2 * S.u2) / (S.m1 + S.m2))} m/s가 나온다. 속도를 평균 내면 질량을 무시하게 된다.</p>` },
    { q: '이 충돌에서 잃은 운동 에너지는 얼마인가?',
      choices: [`${f(K1s)} J`, `${f(K0s)} J`, '0 J', `${f(K0s - K1s)} J`], answer: 3,
      why: `<p>충돌 전: ½(${f(S.m1, 1)})(${f(S.u1, 1)})² + ½(${f(S.m2, 1)})(${f(S.u2, 1)})² = ${f(K0s)} J. 충돌 후: ½(${f(S.m1 + S.m2, 1)})(${f(S.v1, 1)})² = ${f(K1s)} J. 손실: ${f(K0s - K1s)} J로, 열, 소리, 찌그러짐이 된다. 운동량은 보존되지만 운동 에너지는 보존되지 않는다.</p>` },
  ],
  4: [
    { q: `오른쪽을 +로 잡는다. ${sg(Bo.u1, 1)} m/s로 움직이는 ${f(Bo.m1, 1)} kg 수레가 정지한 ${f(Bo.m2, 1)} kg 수레와 탄성 충돌한다. 충돌 후 ${f(Bo.m1, 1)} kg 수레의 속도는 얼마인가?`,
      choices: [`${sg(-Bo.v1)} m/s`, `${sg(Bo.v1)} m/s`, `${f(0)} m/s`, `${sg(Bo.m1 * Bo.u1 / (Bo.m1 + Bo.m2))} m/s`], answer: 1,
      why: `<p>탄성 충돌에서는 상대 속도가 뒤집힌다. <i>v</i>₂′ − <i>v</i>₁′ = ${f(Bo.u1, 1)} m/s. 운동량 보존 식 ${f(Bo.m1, 1)} × ${f(Bo.u1, 1)} = ${f(Bo.m1, 1)}<i>v</i>₁′ + ${f(Bo.m2, 1)}<i>v</i>₂′과 함께 풀면 다음과 같다.</p><div class="eq"><i>v</i>₁′ = (<i>m</i>₁ − <i>m</i>₂)<i>v</i>₁/(<i>m</i>₁ + <i>m</i>₂) = ${sg(Bo.v1)} m/s, &nbsp; <i>v</i>₂′ = ${sg(Bo.v2)} m/s</div><p>가벼운 수레가 되튕겨 나온다. ${sg(Bo.m1 * Bo.u1 / (Bo.m1 + Bo.m2))} m/s는 달라붙는 경우의 답이다.</p>` },
    { q: '대신 움직이는 수레가 정지한 똑같은 수레와 탄성 충돌하면, 충돌 후',
      choices: ['둘 다 절반의 속력으로 함께 나아간다', '첫 번째 수레는 멈추고 두 번째 수레가 첫 번째 수레의 속력으로 나아간다', '첫 번째 수레가 처음 속력으로 되튕겨 나온다', '둘 다 멈춘다'], answer: 1,
      why: '<p><i>m</i>₁ = <i>m</i>₂이면 <i>v</i>₁′ = (<i>m</i>₁ − <i>m</i>₂)<i>v</i>₁/(<i>m</i>₁ + <i>m</i>₂) = 0, <i>v</i>₂′ = <i>v</i>₁이다. 절반의 속력으로 함께 나아가면 운동량은 보존되지만 운동 에너지의 절반을 잃으므로 탄성 충돌이 아니다.</p>' },
  ],
  5: [
    { q: `둘 다 정지해 있는 ${f(X.m1, 1)} kg 수레와 ${f(X.m2, 1)} kg 수레 사이의 용수철이 ${f(X.Q, 1)} J을 내놓는다. ${f(X.m2, 1)} kg 수레는 얼마나 빠르게 움직이는가?`,
      choices: [`${f(-X.v1)} m/s`, `${f(Math.sqrt(2 * X.Q / X.m2))} m/s`, `${f(Math.sqrt(2 * X.Q / (X.m1 + X.m2)))} m/s`, `${f(X.v2)} m/s`], answer: 3,
      why: `<p>운동량은 계속 0이다. <i>m</i>₁<i>v</i>₁′ = −<i>m</i>₂<i>v</i>₂′이므로 ${f(X.m1, 1)} kg 수레가 ${f(X.m2 / X.m1, 0)}배 빠르다. 에너지: ½<i>m</i>₁(${f(X.m2 / X.m1, 0)}<i>v</i>)² + ½<i>m</i>₂<i>v</i>² = ${f(X.Q, 1)} J에서 <i>v</i> = ${f(X.v2)} m/s이다(가벼운 수레는 ${f(-X.v1)} m/s).</p><p>${f(Math.sqrt(2 * X.Q / X.m2))} m/s는 에너지를 모두 한 수레에 준 것으로, 운동량 보존에 어긋난다.</p>` },
    { q: `이 폭발에서 ${f(X.m1, 1)} kg 수레의 운동 에너지를 ${f(X.m2, 1)} kg 수레의 운동 에너지로 나눈 값은 얼마인가?`,
      choices: [f(X.m1 / X.m2), f(1, 1), f(X.m2 / X.m1, 1), f((X.m2 / X.m1) ** 2, 1)], answer: 2,
      why: `<p>운동량의 크기가 같고 방향이 반대이며 <i>K</i> = <i>p</i>²/2<i>m</i>이므로, 비는 <i>m</i>₂/<i>m</i>₁ = ${f(X.m2 / X.m1, 1)}이다. ${f(M.ke(X.m1, X.v1), 1)} J 대 ${f(M.ke(X.m2, X.v2), 1)} J. 가벼운 수레가 용수철 에너지의 대부분을 가져간다.</p>` },
  ],
  6: [
    { q: `${f(Pd.u, 0)} m/s로 날아온 ${f(Pd.m, 1)} kg 찰흙이 ${f(Pd.M, 1)} kg 블록에 박힌다. 블록은 얼마나 높이 올라가는가?`,
      choices: [`${f(Pd.dy * 100, 1)} cm`, `${f(Kclay / ((Pd.m + Pd.M) * G) * 100, 1)} cm`, `${f(Pd.v ** 2 / G * 100, 1)} cm`, `${f(Pd.u ** 2 / (2 * G) * 100, 0)} cm`], answer: 0,
      why: `<p>충돌: 운동량 보존, <i>v</i>′ = <i>mu</i>/(<i>m</i> + <i>M</i>) = ${f(Pd.m * Pd.u, 1)}/${f(Pd.m + Pd.M, 1)} = ${f(Pd.v, 3)} m/s. 흔들림: 에너지 보존, Δ<i>y</i> = <i>v</i>′²/2<i>g</i> = ${f(Pd.dy * 100, 1)} cm.</p><p>${f(Kclay / ((Pd.m + Pd.M) * G) * 100, 1)} cm는 찰흙의 운동 에너지가 충돌 후에도 남는다고 가정한 값이다. 찰흙이 달라붙을 때 그 대부분이 사라진다.</p>` },
    { q: '충돌에서 찰흙의 운동 에너지 중 몇 퍼센트를 잃는가?',
      choices: [`${f(100 * Pd.m / (Pd.m + Pd.M), 1)}%`, '0%', `${f(100 * (1 - Kafter / Kclay), 1)}%`, '50.0%'], answer: 2,
      why: `<p>충돌 전: ½(${f(Pd.m, 1)})(${f(Pd.u, 0)})² = ${f(Kclay, 1)} J. 충돌 후: ½(${f(Pd.m + Pd.M, 1)})(${f(Pd.v, 3)})² = ${f(Kafter)} J. 남은 비율: <i>m</i>/(<i>m</i> + <i>M</i>) = ${f(100 * Pd.m / (Pd.m + Pd.M), 1)}%이므로 ${f(100 * (1 - Kafter / Kclay), 1)}%를 잃는다.</p>` },
  ],
  7: [
    { q: `${Cr.m1} kg 승용차(동쪽으로 ${f(Cr.v1, 0)} m/s)와 ${Cr.m2} kg 트럭(북쪽으로 ${f(Cr.v2, 0)} m/s)이 충돌해 한 덩어리가 된다. 충돌 직후 잔해의 속력은 얼마인가?`,
      choices: [`${f((Cr.px + Cr.py) / (Cr.m1 + Cr.m2))} m/s`, `${f(Cr.v)} m/s`, `${f((Cr.v1 + Cr.v2) / 2, 1)} m/s`, `${f(Math.hypot(Cr.v1, Cr.v2), 1)} m/s`], answer: 1,
      why: `<p>방향마다 따로 구한다. <i>v</i>′<sub>x</sub> = ${Cr.px}/${Cr.m1 + Cr.m2} = ${f(Cr.vx)} m/s, <i>v</i>′<sub>y</sub> = ${Cr.py}/${Cr.m1 + Cr.m2} = ${f(Cr.vy)} m/s.</p><div class="eq"><i>v</i>′ = √(${f(Cr.vx)}² + ${f(Cr.vy)}²) = ${f(Cr.v)} m/s</div><p>${f((Cr.px + Cr.py) / (Cr.m1 + Cr.m2))} m/s는 운동량이 같은 방향을 향하는 것처럼 더한 값이다.</p>` },
    { q: '잔해는 어느 방향으로 움직이는가?',
      choices: [`동쪽에서 북쪽으로 ${f(90 - Cr.angle, 1)}°`, `동쪽에서 북쪽으로 ${f(Math.atan2(Cr.v2, Cr.v1) * 180 / Math.PI, 1)}°`, `동쪽에서 북쪽으로 ${f(Math.atan2(Cr.v1, Cr.v2) * 180 / Math.PI, 1)}°`, `동쪽에서 북쪽으로 ${f(Cr.angle, 1)}°`], answer: 3,
      why: `<div class="eq">tan θ = <i>p</i><sub>y</sub>/<i>p</i><sub>x</sub> = ${Cr.py}/${Cr.px} &nbsp;⇒&nbsp; θ = 동쪽에서 북쪽으로 ${f(Cr.angle, 1)}°</div><p>속력이 아니라 운동량을 써야 한다. 느린 트럭이 여덟 배 무거우므로 트럭 쪽이 우세하다. ${f(Math.atan2(Cr.v2, Cr.v1) * 180 / Math.PI, 1)}°는 속력으로 구한 값이다.</p>` },
  ],
  8: [
    { q: `포탄(${Sh.deg}°, ${f(Sh.v0, 0)} m/s, 터지지 않을 때 수평 도달 거리 <i>R</i> = ${f(Sh.R)} m)이 최고점에서 질량이 같은 두 조각으로 갈라지고, 뒤쪽 조각은 곧장 아래로 떨어진다. 앞쪽 조각은 어디에 떨어지는가?`,
      choices: [`${f(Sh.R / 2)} m`, `${f(Sh.R)} m`, `${f(1.5 * Sh.R)} m`, `${f(2 * Sh.R)} m`], answer: 2,
      why: `<p>질량 중심은 아무 일 없었다는 듯 여전히 <i>R</i>에 떨어진다. 뒤쪽 조각은 <i>R</i>/2 = ${f(Sh.R / 2)} m에 떨어지고 두 조각의 질량이 같으므로, 앞쪽 조각은 <i>R</i>를 그만큼 지나서 떨어진다. <i>x</i> = 2<i>R</i> − <i>R</i>/2 = 3<i>R</i>/2 = ${f(1.5 * Sh.R)} m.</p><p>직접 구하면: 앞쪽 조각은 최고점을 2<i>v</i><sub>x</sub>로 떠나 같은 시간 동안 떨어지므로, 남은 거리 <i>R</i>/2의 두 배를 간다.</p>` },
    { q: '폭발 순간부터 첫 조각이 땅에 닿을 때까지, 계의 질량 중심의 가속도는',
      choices: ['0', '<i>g</i>, 아래 방향', '2<i>g</i>, 아래 방향', '폭발 때문에 앞 방향'], answer: 1,
      why: '<p>폭발로 생기는 힘은 내력이므로 쌍으로 상쇄된다. 외력은 여전히 전체 무게 <i>Mg</i>뿐이므로, 폭발 전과 똑같이 <i>a</i><sub>cm</sub> = <i>g</i>, 아래 방향이다.</p>' },
  ],
  9: [
    { q: `<i>x</i> = 0부터 <i>L</i> = ${f(Rd.L, 1)} m까지 놓인 막대의 선밀도가 λ(<i>x</i>) = λ<sub>0</sub><i>x</i>/<i>L</i>이다. 질량 중심은 어디에 있는가?`,
      choices: [`<i>x</i> = ${f(Rd.L / 2)} m`, `<i>x</i> = ${f(Rd.L / 3, 3)} m`, `<i>x</i> = ${f(Rd.xN)} m`, `<i>x</i> = ${f(3 * Rd.L / 4)} m`], answer: 2,
      why: `<div class="eq"><i>M</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>/<i>L</i> d<i>x</i> = λ<sub>0</sub><i>L</i>/2, &nbsp; ∫<i>x</i> d<i>m</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>²/<i>L</i> d<i>x</i> = λ<sub>0</sub><i>L</i>²/3</div><div class="eq"><i>x</i><sub>cm</sub> = (λ<sub>0</sub><i>L</i>²/3)/(λ<sub>0</sub><i>L</i>/2) = 2<i>L</i>/3 = ${f(Rd.xN)} m</div><p>밀도가 큰 끝 쪽으로 치우친다. <i>L</i>/3은 반대쪽 끝에서 잰 값이고, <i>L</i>/2는 밀도를 무시한 값이다.</p>` },
    { q: `서술형. <i>x</i> = 0부터 <i>L</i> = ${f(Rd.L, 1)} m까지 놓인 막대의 선밀도가 λ(<i>x</i>) = λ<sub>0</sub><i>x</i>²/<i>L</i>², λ<sub>0</sub> = ${f(Rd.lam0, 1)} kg/m이다. 막대의 질량과 질량 중심을 구하라.`,
      solution: `<p>막대를 d<i>m</i> = λ d<i>x</i>로 잘게 나눈다.</p><div class="eq"><i>M</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>²/<i>L</i>² d<i>x</i> = λ<sub>0</sub><i>L</i>/3 = ${f(Rd.lam0, 1)} × ${f(Rd.L, 1)}/3 = ${f(Mq)} kg</div><div class="eq">∫<i>x</i> d<i>m</i> = ∫<sub>0</sub><sup><i>L</i></sup> λ<sub>0</sub><i>x</i>³/<i>L</i>² d<i>x</i> = λ<sub>0</sub><i>L</i>²/4</div><div class="eq"><i>x</i><sub>cm</sub> = (λ<sub>0</sub><i>L</i>²/4)/(λ<sub>0</sub><i>L</i>/3) = 3<i>L</i>/4 = ${f(xq)} m</div><p>선형 막대의 2<i>L</i>/3보다 밀도가 큰 끝 쪽으로 더 치우치는데, 질량이 <i>x</i> = <i>L</i> 근처에 더 많이 몰려 있으니 당연하다.</p>` },
  ],
  10: [
    { q: `균일한 반원판의 반지름이 <i>R</i> = ${f(Se.R, 1)} m이다. 질량 중심은 곧은 변에서 얼마나 떨어져 있는가?`,
      choices: [`${f(Se.R / 2, 3)} m`, `${f(2 * Se.R / Math.PI, 3)} m`, `${f(Se.R / 3, 3)} m`, `${f(Se.ucm, 3)} m`], answer: 3,
      why: `<p>지름에 나란한 띠의 폭은 2√(<i>R</i>² − <i>u</i>²)이다.</p><div class="eq"><i>u</i><sub>cm</sub> = ∫<sub>0</sub><sup><i>R</i></sup> 2<i>u</i>√(<i>R</i>² − <i>u</i>²) d<i>u</i> / (π<i>R</i>²/2) = (2<i>R</i>³/3)/(π<i>R</i>²/2) = 4<i>R</i>/3π = ${f(Se.ucm, 3)} m</div><p><i>R</i>/2는 변에서 멀어질수록 띠가 좁아진다는 점을 무시한 값이다. 2<i>R</i>/π = ${f(2 * Se.R / Math.PI, 3)} m는 질량이 모두 둘레에 있는 가는 반원형 철사의 경우다.</p>` },
    { q: `균일한 삼각형 판의 밑변으로부터 높이가 <i>h</i> = ${f(Tr.h, 1)} m이다. 질량 중심은 밑변에서 얼마나 높은 곳에 있는가?`,
      choices: [`${f(Tr.h / 2, 3)} m`, `${f(Tr.ucm, 3)} m`, `${f(2 * Tr.h / 3, 3)} m`, `${f(Tr.h / 4, 3)} m`], answer: 1,
      why: `<p>밑변에 나란한 띠의 폭은 <i>w</i> = <i>b</i>(1 − <i>u</i>/<i>h</i>)로, 밑변에서 가장 넓고 꼭짓점에서 0이다.</p><div class="eq"><i>u</i><sub>cm</sub> = ∫<sub>0</sub><sup><i>h</i></sup> <i>u</i>·<i>b</i>(1 − <i>u</i>/<i>h</i>) d<i>u</i> / (<i>bh</i>/2) = (<i>bh</i>²/6)/(<i>bh</i>/2) = <i>h</i>/3 = ${f(Tr.ucm, 3)} m</div><p>2<i>h</i>/3은 꼭짓점에서 잰 거리다.</p>` },
  ],
  11: [
    { q: `L자 판: 팔 A는 ${f(Ll.pA.m)} kg이고 중심이 <i>x</i> = ${f(Ll.pA.c[0])} m, 팔 B는 ${f(Ll.pB.m)} kg이고 중심이 <i>x</i> = ${f(Ll.pB.c[0])} m에 있다. L자 판의 <i>x</i><sub>cm</sub>은 얼마인가?`,
      choices: [`${f((Ll.pA.c[0] + Ll.pB.c[0]) / 2, 3)} m`, `${f(Ll.pA.c[0], 3)} m`, `${f((Ll.pB.m * Ll.pA.c[0] + Ll.pA.m * Ll.pB.c[0]) / Ll.M, 3)} m`, `${f(Ll.cm[0], 3)} m`], answer: 3,
      why: `<div class="eq"><i>x</i><sub>cm</sub> = (${f(Ll.pA.m)} × ${f(Ll.pA.c[0])} + ${f(Ll.pB.m)} × ${f(Ll.pB.c[0])})/${f(Ll.M)} = ${f(Ll.cm[0], 3)} m</div><p>각 중심에 그 조각의 질량을 가중치로 곱한다. ${f((Ll.pA.c[0] + Ll.pB.c[0]) / 2, 3)} m는 중심들을 단순 평균한 값으로, 질량이 같을 때만 맞다.</p>` },
    { q: `서술형. <i>x</i><sub>cm</sub> = (1/<i>M</i>)∫<i>x</i> d<i>m</i>에서 출발해, 구멍을 음의 질량으로 다뤄도 되는 이유를 설명하라. 그다음 중심이 원점에 있는 ${f(Ho.s, 1)} m 정사각형 판(σ = ${f(M.SIGMA, 1)} kg/m²)에 중심이 <i>x</i> = ${f(Ho.c[0])} m인 반지름 ${f(Ho.r, 1)} m의 구멍이 뚫려 있을 때 <i>x</i><sub>cm</sub>을 구하라.`,
      solution: `<p>어떤 영역에 대한 적분은 그 부분들에 대한 적분으로 나눌 수 있다. 판은 정사각형 전체에서 원판을 뺀 것이므로</p><div class="eq">∫<sub>plate</sub> <i>x</i> d<i>m</i> = ∫<sub>square</sub> <i>x</i> d<i>m</i> − ∫<sub>disc</sub> <i>x</i> d<i>m</i> = <i>m</i><sub>full</sub><i>x</i><sub>full</sub> − <i>m</i><sub>plug</sub><i>x</i><sub>plug</sub></div><p>이고, 마찬가지로 <i>M</i> = <i>m</i><sub>full</sub> − <i>m</i><sub>plug</sub>이다. 구멍은 그 중심에 놓인 질량 −<i>m</i><sub>plug</sub>와 정확히 같은 방식으로 들어간다.</p><p><i>m</i><sub>full</sub> = σ<i>s</i>² = ${f(Ho.mFull)} kg at <i>x</i> = 0; <i>m</i><sub>plug</sub> = σπ<i>r</i>² = ${f(Ho.mPlug, 3)} kg at <i>x</i> = ${f(Ho.c[0])} m; <i>M</i> = ${f(Ho.M, 3)} kg.</p><div class="eq"><i>x</i><sub>cm</sub> = (0 − ${f(Ho.mPlug, 3)} × ${f(Ho.c[0])})/${f(Ho.M, 3)} = ${f(Ho.cm[0] * 100)} cm</div><p>음수다. 질량 중심은 구멍에서 멀어지는 쪽으로 옮겨 간다.</p>` },
  ],
};
