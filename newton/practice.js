// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + Math.abs(x).toPrecision(3);   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const G = M.G, sin = d => Math.sin(d * Math.PI / 180), cos = d => Math.cos(d * Math.PI / 180);
const TG = M.TUG, BD = M.BOARD, DR = M.DRAG;

// 0 · pressing down on the resting block
const PRESS = 5.0;
// 1 · strings at 25°
const TH1 = 25;
// 2 · hanging in an elevator moving up at constant speed
const VEL2 = 3.0;
// 3 · more thrust
const THRUST3 = 2400;
// 4 · distance in the push time
const X4 = 0.5 * M.A1 * M.PUSH_T ** 2;
// 5 · the car at highway speed, same forward push
const V5 = 30, D5 = M.CAR.k * V5 ** 2, A5 = (M.CAR.F - D5) / M.CAR.m;
// 6 · an 8.0 N push at rest; a 12.0 N push while sliding
const P6 = 8.0, P6b = 12.0, A6 = (P6b - M.F_K) / M.M1;
// 7 · the push moved to B's side
const C7 = M.M1 * M.PUSH / (M.M1 + M.M2);
// 8 · where the skaters meet, measured from A's start
const MEET = TG.d0 * TG.mB / TG.M;
// 9 · a harder pull on the board
const F9 = 24, ACM9 = F9 / BD.M, ABOARD9 = (F9 - BD.f) / BD.Mb;
// 10 · down the slope; with friction
const V10 = Math.sqrt(2 * M.A_INC * M.INC_LEN), A10 = G * (sin(M.THETA_DEG) - M.MU_K * cos(M.THETA_DEG));
// 11 · half of terminal speed; drag when a = g/4
const THALF = DR.tau * Math.log(2), D11 = 0.75 * DR.W;
// 12 · distance fallen in 1.00 s
const T12 = 1.00, X12 = M.linDrag(T12).x;

export const PRACTICE = {
  0: [
    { q: `바닥에 놓인 ${f(M.M1, 1)} kg 블록을 ${f(PRESS, 1)} N의 힘으로 똑바로 아래로 누른다. 바닥이 가하는 수직 항력은 얼마인가?`,
      choices: [`${p3(M.W1 + PRESS)} N`, `${p3(M.W1)} N`, `${p3(M.W1 - PRESS)} N`, `${p3(PRESS)} N`], answer: 0,
      why: `<p>자유 물체 도형: 아래쪽으로 무게 ${f(M.W1, 1)} N, 아래쪽으로 누르는 힘 ${f(PRESS, 1)} N, 위쪽으로 수직 항력. 블록은 정지해 있으므로 Σ<i>F</i> = 0이다.</p><div class="eq"><i>F</i><sub>N</sub> = <i>mg</i> + <i>F</i><sub>push</sub> = ${f(M.W1, 1)} + ${f(PRESS, 1)} = ${p3(M.W1 + PRESS)} N</div><p>수직 항력은 면이 공급해야 하는 만큼의 힘이다. 수직 항력이 <i>mg</i>와 같은 것은 연직 방향으로 다른 힘이 작용하지 않을 때뿐이다.</p>` },
    { q: '블록이 마찰 없는 바닥을 일정한 속도로 미끄러진다(공기 저항 없음). 자유 물체 도형에 들어갈 힘은 무엇인가?',
      choices: ['무게, 수직 항력, 그리고 블록을 계속 움직이게 하는 앞쪽 힘', '무게만', '수직 항력과 앞쪽 힘', '무게와 수직 항력만'], answer: 3,
      why: `<p>블록에 힘을 가하는 것은 블록에 닿아 있는 것들(과 중력)뿐이다. 바닥은 수직 항력을, 지구는 무게를 준다. 블록을 앞으로 미는 것은 없다. 블록의 속도가 그대로인 것은 알짜힘이 0이기 때문이지, 무언가가 블록을 몰아가기 때문이 아니다.</p>` },
  ],
  1: [
    { q: `${f(M.M1, 1)} kg 블록이 두 줄에 매달려 정지해 있다. 두 줄은 각각 수평에서 ${TH1}° 위로 기울어 있다. 각 줄의 장력은 얼마인가?`,
      choices: [`${p3(M.W1 / (2 * cos(TH1)))} N`, `${p3(M.W1 / (2 * sin(TH1)))} N`, `${p3(M.W1 / sin(TH1))} N`, `${p3(M.W1 / 2)} N`], answer: 1,
      why: `<p>수평 성분은 상쇄된다. 두 연직 성분이 무게를 떠받친다.</p><div class="eq">2<i>T</i> sin θ = <i>mg</i> &nbsp;→ <i>T</i> = ${f(M.W1, 1)} / (2 sin ${TH1}°) = ${p3(M.W1 / (2 * sin(TH1)))} N</div><p>각도를 수평에서 쟀으므로 연직 성분은 <i>T</i> cos θ가 아니라 <i>T</i> sin θ다. 각 줄은 무게의 절반인 ${p3(M.W1 / 2)} N보다 더 큰 힘을 감당한다.</p>` },
    { q: '블록이 계속 매달려 정지해 있는 채로, 두 줄을 점점 더 평평하게, 수평에 가깝게 당긴다. 장력은 어떻게 되는가?',
      choices: ['0을 향해 줄어든다.', '무게의 절반으로 유지된다.', '한없이 커진다. 완벽하게 수평인 줄은 불가능하다.', '무게 전체에 가까워진다.'], answer: 2,
      why: `<p><i>T</i> = <i>mg</i>/(2 sin θ). θ → 0이면 sin θ → 0이고 <i>T</i> → ∞다. 수평인 줄에는 연직 성분이 전혀 없으므로, 어떤 유한한 장력으로도 블록을 떠받칠 수 없다.</p>` },
  ],
  2: [
    { q: `${f(M.M1, 1)} kg 블록이 <b>일정한 ${f(VEL2, 1)} m/s로 위로 움직이는</b> 엘리베이터 안에서 줄에 매달려 있다. 줄의 장력은 얼마인가?`,
      choices: [`${p3(M.W1 + M.M1 * VEL2)} N`, `${p3(M.M1 * VEL2)} N`, `${p3(M.W1 - M.M1 * VEL2)} N`, `${p3(M.W1)} N`], answer: 3,
      why: `<p>속도가 일정하면 <i>a</i> = 0이므로 블록은 평형 상태다. Σ<i>F</i> = <i>T</i> − <i>mg</i> = 0.</p><div class="eq"><i>T</i> = <i>mg</i> = ${f(M.M1, 1)} × ${f(G)} = ${p3(M.W1)} N</div><p>속력은 전혀 관여하지 않는다. 힘은 속도를 바꾸는 것이지, 속도를 유지하는 데 필요한 것이 아니다. (<i>mv</i>는 애초에 힘도 아니다.)</p>` },
    { q: '퍽이 마찰 없는 얼음 위를 일정한 속력으로 미끄러진다. 퍽을 계속 움직이게 하려면 무엇이 필요한가?',
      choices: ['아무것도 필요 없다. 알짜힘이 0이면 속도는 그대로 유지된다.', '무게와 같은 크기의 일정한 앞쪽 힘', '천천히 줄어드는 앞쪽 힘', '시간이 지나면 닳아 없어지는 “관성력”'], answer: 0,
      why: `<p>제1법칙: Σ<i>F</i> = 0이면 움직이든 아니든 속도는 일정하게 유지된다. 관성은 성질(속도 변화에 대한 저항)이지 힘이 아니며, 닳아 없어지지도 않는다.</p>` },
  ],
  3: [
    { q: `${M.PLANE.m} kg 비행기가 항력 ${M.PLANE.D} N을 받으며 수평으로 순항한다. 조종사가 추력을 ${THRUST3} N으로 높인다. 항력이 변하기 전인 그 직후, 비행기의 가속도는 얼마인가?`,
      choices: [`${p3(THRUST3 / M.PLANE.m)} m/s²`, `${p3(M.PLANE.D / M.PLANE.m)} m/s²`, `${p3((THRUST3 - M.PLANE.D) / M.PLANE.m)} m/s²`, `${p3((THRUST3 + M.PLANE.D) / M.PLANE.m)} m/s²`], answer: 2,
      why: `<p>양력은 여전히 무게를 상쇄한다. 비행 경로를 따라 알짜힘은 추력에서 항력을 뺀 값이다.</p><div class="eq"><i>a</i> = (${THRUST3} − ${M.PLANE.D}) / ${M.PLANE.m} = 앞쪽으로 ${p3((THRUST3 - M.PLANE.D) / M.PLANE.m)} m/s²</div><p>추력만 쓰면 여전히 작용하는 항력을 무시하게 된다.</p>` },
    { q: `${M.PLANE.v} m/s로 일정하게 수평 비행할 때, 앞쪽 추력은 항력과 비교해 어떠한가?`,
      choices: ['추력이 더 크다. 그렇지 않으면 비행기가 느려진다.', '둘은 같다.', '추력이 비행기의 무게만큼 더 크다.', '비행기가 움직이고 있으므로 항력이 더 크다.'], answer: 1,
      why: `<p>속도가 일정하다는 것은 알짜힘이 0이라는 뜻이므로(제1법칙) 추력 = 항력 = ${M.PLANE.D} N이다. 추력이 항력보다 크면 비행기는 단지 계속 움직이는 것이 아니라 빨라진다.</p>` },
  ],
  4: [
    { q: `마찰 없는 면 위에 정지해 있던 ${f(M.M1, 1)} kg 블록에 ${f(M.PUSH, 1)} N의 미는 힘이 작용한다. ${f(M.PUSH_T, 1)} s 동안 블록은 얼마나 이동하는가?`,
      choices: [`${p3(2 * X4)} m`, `${p3(0.5 * M.A2 * M.PUSH_T ** 2)} m`, `${p3(M.A1 * M.PUSH_T)} m`, `${p3(X4)} m`], answer: 3,
      why: `<p><i>a</i> = Σ<i>F</i>/<i>m</i> = ${f(M.PUSH, 1)}/${f(M.M1, 1)} = ${f(M.A1, 2)} m/s²로 일정하므로</p><div class="eq">Δ<i>x</i> = ½<i>at</i>² = ½ × ${f(M.A1, 2)} × (${f(M.PUSH_T, 1)})² = ${p3(X4)} m</div><p>${p3(2 * X4)} m는 ½을 빠뜨린 값이다. ${p3(M.A1 * M.PUSH_T)}는 도달한 속력으로, 단위는 m/s다.</p>` },
    { q: '수레에 작용하는 알짜힘을 두 배로 하고 질량도 두 배로 한다. 가속도는 어떻게 되는가?',
      choices: ['4분의 1로 줄어든다', '그대로다', '두 배가 된다', '네 배가 된다'], answer: 1,
      why: `<p><i>a</i> = Σ<i>F</i>/<i>m</i> = (2Σ<i>F</i>)/(2<i>m</i>): 두 인수가 약분된다.</p>` },
  ],
  5: [
    { q: '자동차가 평평한 도로에서 빨라진다. 자동차를 앞으로 미는 외력은 무엇인가?',
      choices: ['엔진이 자동차에 가하는 힘', '타이어가 도로에 가하는 힘', '도로가 타이어에 가하는 정지 마찰력', '도로가 타이어에 가하는 운동 마찰력'], answer: 2,
      why: `<p>엔진은 자동차의 일부이며, 내력은 자동차를 가속할 수 없다. 타이어가 도로를 뒤로 밀면, 제3법칙에 따라 도로가 타이어를 앞으로 민다. 타이어 표면은 도로에서 미끄러지지 않으므로 이것은 <b>정지</b> 마찰력이다. 타이어가 도로에 가하는 힘은 자동차가 아니라 도로에 작용한다.</p>` },
    { q: `도로가 앞쪽으로 같은 ${f(M.CAR.F / 1000, 1)} kN으로 밀 때, ${M.CAR.m} kg 자동차가 ${V5} m/s에 이르면 항력은 ${f(D5, 0)} N이다. 그때 자동차의 가속도는 얼마인가?`,
      choices: [`${p3(M.CAR.F / M.CAR.m)} m/s²`, `${p3(A5)} m/s²`, `${p3((M.CAR.F + D5) / M.CAR.m)} m/s²`, `${p3(D5 / M.CAR.m)} m/s²`], answer: 1,
      why: `<p>항력은 운동과 반대인 뒤쪽을 향한다.</p><div class="eq"><i>a</i> = (<i>F</i> − <i>F</i><sub>d</sub>)/<i>m</i> = (${M.CAR.F} − ${f(D5, 0)}) / ${M.CAR.m} = ${p3(A5)} m/s²</div><p>${p3(M.CAR.F / M.CAR.m)} m/s²는 항력을 무시한 값이다. 실제 자동차가 빠른 속력에서 더 천천히 가속하는 까닭이 이 항력이다.</p>` },
  ],
  6: [
    { q: `${f(M.M1, 1)} kg 블록이 거친 바닥(μ<sub>s</sub> = ${f(M.MU_S)}, μ<sub>k</sub> = ${f(M.MU_K)}) 위에 놓여 있다. 블록을 옆으로 ${f(P6, 1)} N으로 민다. 블록에 작용하는 마찰력은 얼마인가?`,
      choices: [`${p3(M.F_SMAX)} N`, `${p3(M.F_K)} N`, `${p3(P6)} N`, '0 N'], answer: 2,
      why: `<p>한계는 μ<sub>s</sub><i>F</i><sub>N</sub> = ${f(M.MU_S)} × ${f(M.FN, 1)} = ${f(M.F_SMAX)} N이다. ${f(P6, 1)} N은 그보다 작으므로 블록은 제자리에 있고, 정지 마찰력은 미는 힘과 딱 균형을 이루는 ${p3(P6)} N이다. μ<sub>s</sub><i>F</i><sub>N</sub>은 실제 값이 아니라 <b>최댓값</b>이다.</p>` },
    { q: `블록이 미끄러지기 시작한 뒤, 미는 힘이 ${f(P6b, 1)} N으로 커졌다. 블록의 가속도는 얼마인가?`,
      choices: [`${p3((P6b - M.F_SMAX) / M.M1)} m/s²`, `${p3(P6b / M.M1)} m/s²`, `${p3((P6b + M.F_K) / M.M1)} m/s²`, `${p3(A6)} m/s²`], answer: 3,
      why: `<p>미끄러지고 있으므로 운동 마찰력 μ<sub>k</sub><i>mg</i> = ${f(M.F_K)} N이 뒤쪽으로 작용한다.</p><div class="eq"><i>a</i> = (${f(P6b, 1)} − ${f(M.F_K)}) / ${f(M.M1, 1)} = ${p3(A6)} m/s²</div><p>블록이 미끄러지기 시작하면 정지 마찰력의 한계 ${f(M.F_SMAX)} N은 더 이상 적용되지 않는다.</p>` },
  ],
  7: [
    { q: `이번에는 같은 ${f(M.PUSH, 1)} N의 미는 힘을 B(${f(M.M2, 1)} kg)에 가해, 마찰 없는 바닥에서 B를 A(${f(M.M1, 1)} kg) 쪽으로 민다. 두 블록이 서로 미는 힘은 얼마인가?`,
      choices: [`${p3(C7)} N`, `${p3(M.CONTACT)} N`, `${p3(M.PUSH)} N`, `${p3(M.PUSH / 2)} N`], answer: 0,
      why: `<p>함께 움직이므로 <i>a</i> = ${f(M.PUSH, 1)}/(${f(M.M1, 1)} + ${f(M.M2, 1)}) = ${f(M.A_PAIR, 2)} m/s²다. 접촉력은 A에 작용하는 유일한 수평 힘이므로</p><div class="eq"><i>F</i><sub>BA</sub> = <i>m</i><sub>A</sub><i>a</i> = ${f(M.M1, 1)} × ${f(M.A_PAIR, 2)} = ${p3(C7)} N</div><p>가벼운 블록을 뒤에서 밀 때는 작은 접촉력만 있으면 된다. ${p3(M.CONTACT)} N은 A를 밀었을 때의 답이다.</p>` },
    { q: '블록이 탁자 위에 놓여 있다. 블록의 무게(지구가 블록을 아래로 당기는 힘)와 제3법칙의 쌍을 이루는 힘은 무엇인가?',
      choices: ['탁자가 블록을 위로 미는 힘', '블록이 지구를 위로 당기는 힘', '블록이 탁자를 아래로 누르는 힘', '탁자가 바닥을 아래로 누르는 힘'], answer: 1,
      why: `<p>제3법칙의 쌍은 같은 상호 작용을 양쪽에서 본 것이다. 지구는 블록을 당기고, 블록은 지구를 당기며, 크기는 같고 방향은 반대이고, 서로 다른 물체에 작용한다. 탁자의 수직 항력도 블록에 작용하므로, 여기서 크기가 같더라도 짝이 될 수 없다.</p>` },
  ],
  8: [
    { q: `스케이터 A(${TG.mA} kg)와 B(${TG.mB} kg)가 마찰 없는 얼음 위에 ${f(TG.d0, 1)} m 떨어져 서서, 만날 때까지 가벼운 밧줄을 당긴다. 두 사람은 A의 출발점에서 얼마나 떨어진 곳에서 만나는가?`,
      choices: [`${p3(TG.d0 / 2)} m`, `${p3(TG.d0 * TG.mA / TG.M)} m`, `${p3(MEET)} m`, `${p3(TG.d0 * TG.mA / TG.mB)} m`], answer: 2,
      why: `<p>수평 방향으로는 내력만 작용하므로 질량 중심은 제자리에 있고, 두 사람은 그곳에서 만난다. A를 기준으로 하면</p><div class="eq"><i>x</i><sub>cm</sub> = (<i>m</i><sub>A</sub> · 0 + <i>m</i><sub>B</sub> · <i>d</i>) / (<i>m</i><sub>A</sub> + <i>m</i><sub>B</sub>) = ${TG.mB} × ${f(TG.d0, 1)} / ${TG.M} = ${p3(MEET)} m</div><p>가벼운 스케이터가 더 멀리 움직인다. ${p3(TG.d0 * TG.mA / TG.M)} m는 두 질량을 서로 바꾼 값이다.</p>` },
    { q: '두 스케이터와 밧줄로 이루어진 계에서, 밧줄을 당기는 동안 옳은 설명은 무엇인가?',
      choices: ['질량 중심이 무거운 스케이터 쪽으로 움직인다.', '밧줄의 장력이 계의 질량 중심을 가속한다.', 'A와 B에 작용하는 장력은 A와 B의 질량이 같을 때만 상쇄된다.', '장력이 내력이므로 질량 중심은 정지해 있다.'], answer: 3,
      why: `<p>밧줄은 A와 B를 크기가 같고 방향이 반대인 힘으로 당기며, 두 힘 모두 계 안에 있으므로 질량과 관계없이 더하면 0이다. 무게와 수직 항력은 상쇄된다. Σ<i>F</i><sub>ext</sub> = 0이므로 <i>a</i><sub>cm</sub> = 0이고, 질량 중심은 처음에 정지해 있었다.</p>` },
  ],
  9: [
    { q: `판을 당기는 힘이 ${F9} N으로 커진다. ${f(BD.m, 1)} kg 블록은 여전히 ${f(BD.Mb, 1)} kg 판 위에서 미끄러진다(μ<sub>k</sub> = ${f(BD.mu_k)}). 블록의 가속도는 얼마인가?`,
      choices: [`${p3(ACM9)} m/s²`, `${p3(BD.aBlock)} m/s²`, `${p3(BD.mu_s * G)} m/s²`, `${p3(ABOARD9)} m/s²`], answer: 1,
      why: `<p>당기는 힘과 관계없이, 블록에 작용하는 유일한 수평 힘은 운동 마찰력 μ<sub>k</sub><i>mg</i> = ${f(BD.f)} N이다.</p><div class="eq"><i>a</i> = μ<sub>k</sub><i>g</i> = ${f(BD.mu_k)} × ${f(G)} = ${p3(BD.aBlock)} m/s²</div><p>밧줄은 블록이 아니라 판을 당긴다. ${p3(ACM9)} m/s²는 질량 중심의 가속도다.</p>` },
    { q: `같은 ${F9} N으로 당긴다. 블록 + 판의 질량 중심의 가속도는 얼마인가?`,
      choices: [`${p3(F9 / BD.Mb)} m/s²`, `${p3(ABOARD9)} m/s²`, `${p3((F9 - BD.f) / BD.M)} m/s²`, `${p3(ACM9)} m/s²`], answer: 3,
      why: `<p>블록과 판 사이의 마찰력은 내력이므로 상쇄된다. 수평 방향의 외력은 당기는 힘뿐이다.</p><div class="eq"><i>a</i><sub>cm</sub> = Σ<i>F</i><sub>ext</sub>/<i>M</i> = ${F9} / ${f(BD.M, 1)} = ${p3(ACM9)} m/s²</div><p>확인: (${f(BD.m, 1)} × ${f(BD.aBlock)} + ${f(BD.Mb, 1)} × ${f(ABOARD9)}) / ${f(BD.M, 1)} = ${f(ACM9)} m/s².</p>` },
  ],
  10: [
    { q: `블록이 마찰 없는 ${M.THETA_DEG}° 경사면을 따라 정지 상태에서 ${f(M.INC_LEN, 1)} m 미끄러져 내려간다. 바닥에서 블록의 속력은 얼마인가?`,
      choices: [`${p3(Math.sqrt(2 * G * M.INC_LEN))} m/s`, `${p3(Math.sqrt(G * sin(M.THETA_DEG) * M.INC_LEN))} m/s`, `${p3(V10)} m/s`, `${p3(Math.sqrt(2 * G * cos(M.THETA_DEG) * M.INC_LEN))} m/s`], answer: 2,
      why: `<p>경사면을 따라 <i>a</i> = <i>g</i> sin θ = ${f(M.A_INC)} m/s²다. 정지 상태에서 출발하고 시간이 주어지지 않았으므로</p><div class="eq"><i>v</i> = √(2<i>aL</i>) = √(2 × ${f(M.A_INC)} × ${f(M.INC_LEN, 1)}) = ${p3(V10)} m/s</div><p>${p3(Math.sqrt(2 * G * M.INC_LEN))} m/s는 마치 ${f(M.INC_LEN, 1)} m를 똑바로 떨어진 것처럼 <i>g</i> 전체를 쓴 값이다. cos θ는 경사면을 <b>누르는</b> 성분이다.</p>` },
    { q: `이번에는 경사면이 거칠다. μ<sub>k</sub> = ${f(M.MU_K)}. 경사면을 따라 미끄러져 내려가는 블록의 가속도는 얼마인가?`,
      choices: [`${p3(M.A_INC)} m/s²`, `${p3(G * (sin(M.THETA_DEG) + M.MU_K * cos(M.THETA_DEG)))} m/s²`, `${p3(A10)} m/s²`, `${p3(G * (sin(M.THETA_DEG) - M.MU_K))} m/s²`], answer: 2,
      why: `<p>마찰력은 μ<sub>k</sub><i>F</i><sub>N</sub>이고, 경사면에서는 <i>F</i><sub>N</sub> = <i>mg</i> cos θ다. 마찰력은 미끄러짐에 맞서 경사면 위쪽을 향한다.</p><div class="eq"><i>a</i> = <i>g</i>(sin θ − μ<sub>k</sub> cos θ) = ${f(G)}(${f(sin(M.THETA_DEG), 3)} − ${f(M.MU_K)} × ${f(cos(M.THETA_DEG), 3)}) = ${p3(A10)} m/s²</div><p>${p3(G * (sin(M.THETA_DEG) - M.MU_K))} m/s²는 <i>F</i><sub>N</sub> = <i>mg</i>를 쓴 값으로, 이는 평평한 바닥에서만 성립한다.</p>` },
  ],
  11: [
    { q: `${f(DR.m, 2)} kg 공(<i>b</i> = ${f(DR.b)} kg/s)을 정지 상태에서 놓는다. 종단 속력의 절반에 이르기까지 얼마나 걸리는가?`,
      choices: [`${p3(DR.tau / 2)} s`, `${p3(THALF)} s`, `${p3(DR.tau)} s`, `${p3(Math.log(2))} s`], answer: 1,
      why: `<p><i>m</i> d<i>v</i>/d<i>t</i> = <i>mg</i> − <i>bv</i>에서 변수를 분리해 적분하면 <i>v</i> = <i>v</i><sub>t</sub>(1 − e<sup>−<i>t</i>/τ</sup>), τ = <i>m</i>/<i>b</i> = ${f(DR.tau)} s를 얻는다. <i>v</i> = <i>v</i><sub>t</sub>/2로 놓으면</p><div class="eq">e<sup>−<i>t</i>/τ</sup> = ½ &nbsp;→ <i>t</i> = τ ln 2 = ${f(DR.tau)} × ${f(Math.log(2), 3)} = ${p3(THALF)} s</div><p>속력은 선형으로 커지지 않으므로 τ/2가 아니다. τ에서는 이미 63%에 이른다.</p>` },
    { q: `같은 공(<i>m</i> d<i>v</i>/d<i>t</i> = <i>mg</i> − <i>bv</i>, 정지 상태에서 출발)에 대해 <i>v</i>(<i>t</i>)를 미분해 <i>a</i>(<i>t</i>)를 구하라. 그리고 <i>a</i> = <i>g</i>/4인 순간의 항력과 그 시각을 구하라.`,
      solution: `<p>1. <i>v</i> = <i>v</i><sub>t</sub>(1 − e<sup>−<i>t</i>/τ</sup>)이므로 <i>a</i> = d<i>v</i>/d<i>t</i> = (<i>v</i><sub>t</sub>/τ) e<sup>−<i>t</i>/τ</sup> = <i>g</i> e<sup>−<i>t</i>/τ</sup>다. <i>v</i><sub>t</sub>/τ = (<i>mg</i>/<i>b</i>)(<i>b</i>/<i>m</i>) = <i>g</i>이기 때문이다.</p><p>2. 미분 방정식에서 <i>ma</i> = <i>mg</i> − <i>F</i><sub>d</sub>. <i>a</i> = <i>g</i>/4이면</p><div class="eq"><i>F</i><sub>d</sub> = <i>mg</i> − <i>mg</i>/4 = ¾<i>mg</i> = ¾ × ${f(DR.W, 2)} = ${f(D11, 2)} N</div><p>3. e<sup>−<i>t</i>/τ</sup> = ¼에서 <i>t</i> = τ ln 4 = ${f(DR.tau)} × ${f(Math.log(4), 3)} = ${f(DR.tau * Math.log(4), 3)} s. 확인: <i>v</i> = ¾<i>v</i><sub>t</sub> = ${f(0.75 * DR.vt)} m/s이고 <i>bv</i> = ${f(DR.b * 0.75 * DR.vt, 2)} N이다.</p>` },
  ],
  12: [
    { q: `공(<i>v</i><sub>t</sub> = ${f(DR.vt)} m/s, τ = ${f(DR.tau)} s)을 정지 상태에서 놓은 지 ${f(T12)} s 뒤, 공은 얼마나 떨어졌는가?`,
      choices: [`${p3(DR.vt * T12)} m`, `${p3(X12)} m`, `${p3(DR.vt * (T12 - DR.tau))} m`, `${p3(0.5 * G * T12 ** 2)} m`], answer: 1,
      why: `<p>속도를 적분한다.</p><div class="eq"><i>x</i> = ∫<sub>0</sub><sup><i>t</i></sup> <i>v</i><sub>t</sub>(1 − e<sup>−<i>t</i>′/τ</sup>) d<i>t</i>′ = <i>v</i><sub>t</sub>[<i>t</i> − τ(1 − e<sup>−<i>t</i>/τ</sup>)]</div><div class="eq">= ${f(DR.vt)} × [${f(T12)} − ${f(DR.tau)}(1 − e<sup>−${f(T12 / DR.tau, 1)}</sup>)] = ${p3(X12)} m</div><p>${p3(DR.vt * (T12 - DR.tau))} m는 충분히 시간이 지난 뒤의 점근선 <i>v</i><sub>t</sub>(<i>t</i> − τ)다. <i>t</i> = ${f(T12 / DR.tau, 1)}τ에서는 e<sup>−<i>t</i>/τ</sup> 항을 아직 무시할 수 없다. ${p3(0.5 * G * T12 ** 2)} m는 항력을 무시한 값이다.</p>` },
    { q: '크기와 모양은 같고 한쪽의 질량이 다른 쪽의 4배인 두 공이 종단 속력까지 떨어진다. 무거운 공의 <i>v</i><sub>t</sub>는 선형 항력(<i>bv</i>)과 이차 항력(<i>kv</i>²)에서 각각 몇 배인가?',
      choices: ['선형 2×, 이차 4×', '선형 4×, 이차 4×', '선형 2×, 이차 2×', '선형 4×, 이차 2×'], answer: 3,
      why: `<p>종단 속력에서 항력 = <i>mg</i>다. 선형: <i>bv</i><sub>t</sub> = <i>mg</i>, <i>v</i><sub>t</sub> = <i>mg</i>/<i>b</i> ∝ <i>m</i>이므로 4×. 이차: <i>kv</i><sub>t</sub>² = <i>mg</i>, <i>v</i><sub>t</sub> = √(<i>mg</i>/<i>k</i>) ∝ √<i>m</i>이므로 2×. 크기와 모양이 같으면 <i>b</i>와 <i>k</i>도 같다.</p>` },
  ],
};
