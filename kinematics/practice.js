// AP-style practice, one or two questions per page (keys are page indices, as in PAGES).
// Every number is computed here from model.js; checks.mjs recomputes each answer another way.
import * as M from './model.js';

const p3 = x => (x < 0 ? '−' : '') + Math.abs(x).toPrecision(3);   // 3 significant figures
const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const dg = r => r * 180 / Math.PI;

// 0 · a faster throw
const H2 = (2 * M.VY0) ** 2 / (2 * M.G);
// 1 · caught on the way down, below the launch point
const DROP = 1.50, DIST1 = 2 * M.H + DROP;
// 2 · averages over the first 1.50 s
const T2 = 1.50, Y2 = M.y(T2), D2 = 2 * M.H - Y2;
// 3 · strobe gaps shrink by gτ²
const TAU = M.STROBE;
// 5 · speed at 3.00 m up
const Y5 = 3.00, V5 = Math.sqrt(M.VY0 ** 2 - 2 * M.G * Y5);
// 6 · twice the sideways speed
const R6 = 2 * M.VX * M.T;
// 7 · a faster car
const VC7 = 20.0, A7 = dg(Math.atan2(VC7, M.RAIN.vr));
// 8 · a stronger current, aimed straight across
const VW8 = 2.0;
// 9 · the fading pull, at 2.00 s
const T9 = 2.00, V9 = M.PULL.a0 * T9 - 0.5 * M.PULL.k * T9 ** 2;

export const PRACTICE = {
  0: [
    { q: `공을 ${f(M.VY0)} m/s 대신 ${f(2 * M.VY0, 1)} m/s로 똑바로 위로 던진다. 공은 얼마나 높이 올라가는가? (공기 저항은 무시한다.)`,
      choices: [`${p3(2 * M.H)} m`, `${p3(Math.SQRT2 * M.H)} m`, `${p3(H2)} m`, `${p3(8 * M.H)} m`], answer: 2,
      why: `<p>최고점에서 <i>v</i> = 0이므로 <i>h</i> = <i>v</i><sub>0</sub>²/2<i>g</i>이다. 높이는 처음 속력의 <b>제곱</b>에 비례한다. <i>v</i><sub>0</sub>을 두 배로 하면 4 × ${f(M.H)} m가 된다.</p><div class="eq"><i>h</i> = (${f(2 * M.VY0, 1)})² / (2 × ${f(M.G)}) = ${p3(H2)} m</div><p>${p3(2 * M.H)} m는 높이가 속력에 비례한다고 가정한 답이다.</p>` },
    { q: '공이 최고점에 있는 순간, 공의 가속도는',
      choices: ['0', `아래쪽으로 ${f(M.G)} m/s²`, `위쪽으로 ${f(M.G)} m/s²`, '방향이 바뀌고 있으므로 정의되지 않는다'], answer: 1,
      why: `<p>매 순간 작용하는 힘은 중력뿐이므로, 비행 내내 <i>a</i> = <i>g</i> = ${f(M.G)} m/s², 아래쪽이다. 최고점에서 0인 것은 <b>속도</b>이며, 속도는 그때에도 변하고 있다. 잠시 뒤에는 아래를 향한다.</p>` },
  ],
  1: [
    { q: `턱에서 공을 ${f(M.VY0)} m/s로 똑바로 위로 던졌다가, 내려오는 길에 던진 지점보다 ${f(DROP)} m <b>아래</b>에서 잡는다. 공이 이동한 전체 거리는 얼마인가?`,
      choices: [`${p3(DROP)} m`, `${p3(2 * M.H - DROP)} m`, `${p3(M.H + DROP)} m`, `${p3(DIST1)} m`], answer: 3,
      why: `<p>이동 거리는 경로의 모든 구간을 더한 것이다. 공은 <i>h</i> = <i>v</i><sub>0</sub>²/2<i>g</i> = ${f(M.H)} m 올라가고, 던진 지점까지 ${f(M.H)} m 내려온 뒤, ${f(DROP)} m를 더 내려간다.</p><div class="eq">${f(M.H)} + ${f(M.H)} + ${f(DROP)} = ${p3(DIST1)} m</div><p>${p3(DROP)} m는 <b>변위</b>의 크기(위쪽을 양으로 하면 −${f(DROP)} m)이지, 이동 거리가 아니다.</p>` },
    { q: '직선을 따라 움직이는 물체에서, 변위의 크기는 이동 거리와 비교해 어떠한가?',
      choices: ['언제나 같다.', '변위가 이동 거리보다 클 수 있다.', '변위가 더 클 수는 없다. 물체가 방향을 바꾸지 않을 때만 둘이 같다.', '변위는 언제나 이동 거리보다 작다.'], answer: 2,
      why: `<p>이동 거리는 경로의 모든 미터를 세고, 변위는 알짜 변화만 센다. 방향을 바꿀 때마다 변위의 일부는 상쇄되지만 이동 거리는 늘어난다(왕복이면 0 m 대 ${f(2 * M.H)} m). 방향을 바꾸지 않으면 둘은 같으므로, “언제나 작다”도 틀렸다.</p>` },
  ],
  2: [
    { q: `던진 순간부터 <i>t</i> = ${f(T2)} s까지 공의 평균 <b>속력</b>은 얼마인가? (공은 ${f(M.VY0)} m/s로 위로 던져져 ${f(M.T / 2)} s에 최고 높이 ${f(M.H)} m에 이른다.)`,
      choices: [`${p3(D2 / T2)} m/s`, `${p3(Y2 / T2)} m/s`, `${p3(M.H / T2)} m/s`, `${p3((M.VY0 + Math.abs(M.vy(T2))) / 2)} m/s`], answer: 0,
      why: `<p>평균 속력 = 이동 거리 / 시간. ${f(T2)} s에 공은 내려오는 중이며 <i>y</i> = ${f(M.VY0)}(${f(T2)}) − ½(${f(M.G)})(${f(T2)})² = ${f(Y2, 3)} m에 있다. 이동 거리 = 올라간 ${f(M.H)} m + 내려온 ${f(M.H - Y2, 3)} m = ${f(D2, 3)} m.</p><div class="eq">${f(D2, 3)} m / ${f(T2)} s = ${p3(D2 / T2)} m/s</div><p>${p3(Y2 / T2)} m/s는 평균 <b>속도</b>(변위 / 시간)다.</p>` },
    { q: '공이 손을 막 떠난 직후의 속도와, 손으로 돌아오기 직전의 속도를 비교하면 어떠한가?',
      choices: ['둘은 같다.', '중력이 더 오래 작용했으므로 착지 속도가 더 크다.', '평균하면 둘 다 0이므로 비교할 수 없다.', '속력은 같고 방향은 반대다.'], answer: 3,
      why: `<p>운동은 대칭이다. 던질 때 +${f(M.VY0)} m/s, 내려오며 같은 높이에 왔을 때 −${f(M.VY0)} m/s다(Δ<i>y</i> = 0일 때 <i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i>). 속력은 같지만 속도는 방향을 포함하므로 두 속도는 다르다.</p>` },
  ],
  3: [
    { q: '위쪽을 양으로 잡는다. 비행 중 어느 구간에서 공이 빨라지는가?',
      choices: ['올라갈 때. 속도가 양이므로', '최고점에서. 그곳에서 가속도가 가장 크므로', '내려올 때. v와 a의 부호가 같으므로', '빨라지는 구간은 없다. 음의 가속도는 언제나 물체를 느리게 하므로'], answer: 2,
      why: `<p>빨라진다는 것은 <i>v</i>와 <i>a</i>가 같은 방향이라는 뜻이다. <i>a</i>는 내내 −${f(M.G)} m/s²이고, 내려오는 동안 <i>v</i>도 음이므로 속력이 커진다. 음의 <i>a</i>가 공을 느리게 하는 것은 <i>v</i>가 양일 때뿐이다.</p>` },
    { q: `스트로보가 ${f(TAU, 3)} s마다 터진다. 올라가는 동안, 연속한 상 사이의 각 간격은 바로 앞 간격보다 얼마만큼 줄어드는가?`,
      choices: [`${p3(0.5 * M.G * TAU ** 2)} m`, `${p3(M.G * TAU ** 2)} m`, `${p3(M.G * TAU)} m`, `${p3(2 * M.G * TAU ** 2)} m`], answer: 1,
      why: `<p>각 간격은 한 구간 동안 이동한 거리 <i>v</i>τ − ½<i>g</i>τ²이며, 여기서 <i>v</i>는 그 구간이 시작될 때의 속력이다. 한 간격에서 다음 간격으로 갈 때 <i>v</i>가 <i>g</i>τ만큼 줄어들므로, 간격은 (<i>g</i>τ)τ만큼 줄어든다.</p><div class="eq">Δ(간격) = <i>g</i>τ² = ${f(M.G)} × (${f(TAU, 3)})² = ${p3(M.G * TAU ** 2)} m</div><p>½은 간격 하나에 붙는 것이지, 두 간격의 차이에 붙는 것이 아니다.</p>` },
  ],
  4: [
    { q: `공의 <i>v</i>–<i>t</i> 그래프(위쪽이 양, <i>v</i><sub>0</sub> = ${f(M.VY0)} m/s)에서 0부터 ${f(T2)} s까지 그래프와 시간 축 사이의 알짜 넓이는 얼마인가?`,
      choices: [`${p3(D2)} m`, `${p3(M.VY0 * T2)} m`, `${p3(M.H)} m`, `${p3(Y2)} m`], answer: 3,
      why: `<p><i>v</i>–<i>t</i> 그래프 아래 넓이는 변위이며, 축 아래 넓이는 음수로 센다. 축 위로는 ${f(M.T / 2)} s까지의 삼각형이 +½(${f(M.VY0)})(${f(M.T / 2)}) = +${f(M.H)} m다. 축 아래로는 ${f(M.T / 2)} s부터 ${f(T2)} s까지 −½(${f(T2 - M.T / 2)})(${f(-M.vy(T2))}) = −${f(M.H - Y2, 3)} m다.</p><div class="eq">알짜 = ${f(M.H)} − ${f(M.H - Y2, 3)} = ${p3(Y2)} m</div><p>${p3(D2)} m는 축 아래 부분을 빼지 않고 더한 값으로, 이것은 이동 거리다.</p>` },
    { q: '공이 최고점에 있는 순간, 다음 중 0인 것은?',
      choices: ['<i>y</i>–<i>t</i> 그래프의 기울기', '<i>v</i>–<i>t</i> 그래프의 기울기', '<i>a</i>–<i>t</i> 그래프에서 읽은 값', '던진 뒤부터 <i>a</i>–<i>t</i> 그래프 아래 넓이'], answer: 0,
      why: `<p><i>y</i>–<i>t</i> 그래프의 기울기는 속도이며, 최고점에서 0이다. <i>v</i>–<i>t</i> 그래프의 기울기와 <i>a</i>–<i>t</i> 그래프의 값은 둘 다 −${f(M.G)} m/s²다. 던진 뒤부터 <i>a</i>–<i>t</i> 그래프 아래 넓이는 Δ<i>v</i> = −${f(M.VY0)} m/s로, 0이 아니다.</p>` },
  ],
  5: [
    { q: `공이 던진 지점보다 ${f(Y5)} m 위에 있을 때 공의 속력은 얼마인가? (<i>v</i><sub>0</sub> = 위쪽으로 ${f(M.VY0)} m/s)`,
      choices: [`${p3(Math.sqrt(M.VY0 ** 2 + 2 * M.G * Y5))} m/s`, `${p3(V5)} m/s`, `${p3(Math.sqrt(M.VY0 ** 2 - M.G * Y5))} m/s`, `${p3(V5 ** 2)} m/s`], answer: 1,
      why: `<p>시간은 주어지지도 않았고 필요하지도 않으므로, <i>t</i>가 빠진 방정식을 <i>a</i> = −${f(M.G)} m/s²로 쓴다.</p><div class="eq"><i>v</i>² = ${f(M.VY0)}² + 2(−${f(M.G)})(${f(Y5)}) = ${f(V5 ** 2)} m²/s², &nbsp;<i>v</i> = ${p3(V5)} m/s</div><p>${p3(Math.sqrt(M.VY0 ** 2 + 2 * M.G * Y5))} m/s는 <i>a</i>를 +<i>g</i>로 잡은 결과다. 그 높이에서 공은 더 빠른 것이 아니라 더 느려야 한다. (공은 ${f(Y5)} m를 두 번 지나며, 두 번 다 같은 속력이다.)</p>` },
    { q: `<i>v</i><sub>0</sub>, <i>a</i>, Δ<i>y</i>만 알 때 공이 처음으로 ${f(Y5)} m에 이르는 시간을 구하려 한다. 한 번에 구할 수 있는 방정식은 무엇인가?`,
      choices: ['<i>v</i> = <i>v</i><sub>0</sub> + <i>at</i>', '<i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i>', 'Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>²', 'Δ<i>y</i> = ½(<i>v</i><sub>0</sub> + <i>v</i>)<i>t</i>'], answer: 2,
      why: `<p>필요 없는 미지수는 나중 속도 <i>v</i>이므로, <i>v</i>가 빠진 방정식 Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>²을 고른다. 이 식은 <i>t</i>에 대한 이차식이며, 작은 근이 올라가는 길이다. 나머지 세 식은 <i>v</i>를 포함하거나 <i>t</i>를 포함하지 않는다.</p>` },
  ],
  6: [
    { q: `두 번째 공은 옆으로 ${f(M.VX)} m/s, 위로 ${f(M.VY0)} m/s로 출발한다. 경로의 최고점에서 공의 속력은 얼마인가?`,
      choices: ['0 m/s', `${p3(M.VY0)} m/s`, `${p3(M.V0P)} m/s`, `${p3(M.VX)} m/s`], answer: 3,
      why: `<p>최고점에서는 <i>v</i><sub>y</sub>만 0이다. 옆으로는 아무것도 작용하지 않으므로 <i>v</i><sub>x</sub>는 ${f(M.VX)} m/s로 유지되고, 속력은 √(<i>v</i><sub>x</sub>² + 0²) = ${p3(M.VX)} m/s다. “0 m/s”는 똑바로 위로 던진 공에만 맞는 답이다.</p>` },
    { q: `평평한 지면에서 위쪽으로는 같은 ${f(M.VY0)} m/s, 옆으로는 <b>두 배</b>인 ${f(2 * M.VX)} m/s로 다시 던진다. 공은 얼마나 멀리 떨어지는가?`,
      choices: [`${p3(M.RANGE)} m`, `${p3(R6)} m`, `${p3(4 * M.RANGE)} m`, `${p3(Math.SQRT2 * M.RANGE)} m`], answer: 1,
      why: `<p>공중에 머무는 시간은 연직 운동에만 달려 있다. <i>t</i> = 2<i>v</i><sub>0y</sub>/<i>g</i> = ${f(M.T)} s로 변하지 않는다. 수평 운동은 등속 운동이다.</p><div class="eq">Δ<i>x</i> = <i>v</i><sub>x</sub><i>t</i> = ${f(2 * M.VX)} × ${f(M.T)} = ${p3(R6)} m</div><p>${p3(4 * M.RANGE)} m는 던지는 속력 전체를 두 배로 했을 때의 결과로, 그러면 시간도 두 배가 된다.</p>` },
  ],
  7: [
    { q: `비가 ${f(M.RAIN.vr, 1)} m/s로 똑바로 떨어진다. 자동차가 ${f(VC7, 1)} m/s로 속력을 높인다. 자동차에서 볼 때 빗줄기는 연직에서 몇 도 기울어 보이는가?`,
      choices: [`${p3(dg(Math.atan2(M.RAIN.vr, VC7)))}°`, `${p3(M.RAIN_ANGLE)}°`, `${p3(A7)}°`, `${p3(dg(Math.atan2(M.RAIN.vr, M.RAIN.vc)))}°`], answer: 2,
      why: `<p><i>v</i><sub>RC</sub> = <i>v</i><sub>RG</sub> + <i>v</i><sub>GC</sub>: 아래쪽 ${f(M.RAIN.vr, 1)} m/s에 뒤쪽 ${f(VC7, 1)} m/s를 더하며, 두 성분은 직각이다. 연직을 기준으로 하면 대변은 수평 성분이다.</p><div class="eq">tan θ = ${f(VC7, 1)} / ${f(M.RAIN.vr, 1)}, &nbsp;θ = ${p3(A7)}°</div><p>${p3(dg(Math.atan2(M.RAIN.vr, VC7)))}°는 <b>수평</b>으로부터 잰 각이다.</p>` },
    { q: `${f(M.RAIN.vc, 1)} m/s로 앞으로 달리는 자동차의 승객에게 도로의 속도는 얼마인가?`,
      choices: [`뒤쪽으로 ${f(M.RAIN.vc, 1)} m/s`, `앞쪽으로 ${f(M.RAIN.vc, 1)} m/s`, '0. 도로가 기준이다', `${f(M.vlen(M.V_RC))} m/s, 비스듬히`], answer: 0,
      why: `<p>글자를 서로 바꾸면 벡터가 뒤집힌다. <i>v</i><sub>GC</sub> = −<i>v</i><sub>CG</sub>. 자동차는 도로에 대해 앞쪽으로 ${f(M.RAIN.vc, 1)} m/s로 움직이므로, 도로는 자동차에 대해 뒤쪽으로 ${f(M.RAIN.vc, 1)} m/s로 움직인다. 어느 물체를 기준으로 삼을지는 선택의 문제이지, 사실의 문제가 아니다.</p>` },
  ],
  8: [
    { q: `물살이 ${f(VW8, 1)} m/s로 빨라진다. 배는 여전히 물에 대해 ${f(M.RIVER.vb, 1)} m/s로, 폭 ${M.RIVER.w} m인 강의 똑바로 건너편을 향한다. 강을 건너는 데 걸리는 시간은 얼마인가?`,
      choices: [`${p3(M.RIVER.w / Math.hypot(M.RIVER.vb, VW8))} s`, `${p3(M.RIVER.w / Math.sqrt(M.RIVER.vb ** 2 - VW8 ** 2))} s`, `${p3(M.RIVER.w / (M.RIVER.vb + VW8))} s`, `${p3(M.RIVER.w / M.RIVER.vb)} s`], answer: 3,
      why: `<p>배를 맞은편 강가로 보내는 것은 속도 중 강을 가로지르는 성분뿐이며, 물살에는 가로지르는 성분이 없다. 따라서</p><div class="eq"><i>t</i> = <i>w</i> / <i>v</i><sub>b</sub> = ${M.RIVER.w} / ${f(M.RIVER.vb, 1)} = ${p3(M.RIVER.w / M.RIVER.vb)} s</div><p>로 전과 같다. 물살이 세지면 배가 하류로 더 멀리 실려 갈 뿐이다(${f(VW8 * M.RIVER.w / M.RIVER.vb, 1)} m). 전체 속력 ${f(Math.hypot(M.RIVER.vb, VW8))} m/s로 나누는 것은 비스듬한 경로의 속력을 똑바로 가로지르는 거리에 쓰는 셈이다.</p>` },
    { q: `물살이 다시 ${f(M.RIVER.vw, 1)} m/s일 때, ${f(M.RIVER.vb, 1)} m/s인 배가 정확히 맞은편에 닿으려면 똑바로 건너편 방향에서 상류 쪽으로 얼마나 돌려야 하는가?`,
      choices: [`${p3(dg(Math.atan(M.RIVER.vw / M.RIVER.vb)))}°`, `${p3(dg(M.AIM_UP))}°`, `${p3(dg(Math.acos(M.RIVER.vw / M.RIVER.vb)))}°`, `${p3(dg(Math.atan(M.RIVER.vb / M.RIVER.vw)))}°`], answer: 1,
      why: `<p>배의 상류 방향 성분이 물살을 상쇄해야 한다. 배 자체의 속도가 빗변이다.</p><div class="eq"><i>v</i><sub>b</sub> sin θ = <i>v</i><sub>w</sub> &nbsp;→ sin θ = ${f(M.RIVER.vw, 1)} / ${f(M.RIVER.vb, 1)}, θ = ${p3(dg(M.AIM_UP))}°</div><p>tan θ = ${f(M.RIVER.vw, 1)}/${f(M.RIVER.vb, 1)}은 ${f(M.RIVER.vb, 1)} m/s를 가로지르는 변으로 취급한 것이지만, 이것은 물에 대한 배의 전체 속력이다.</p>` },
  ],
  9: [
    { q: `자동차가 정지 상태에서 <i>a</i> = ${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i> (m/s², <i>t</i>의 단위는 s)로 출발한다. <i>t</i> = ${f(T9)} s에서 자동차의 속력은 얼마인가?`,
      choices: [`${p3(M.PULL.a0 * T9 - M.PULL.k * T9 ** 2)} m/s`, `${p3(M.PULL.a0 * T9)} m/s`, `${p3(V9)} m/s`, `${p3(M.pa(T9))} m/s`], answer: 2,
      why: `<p><i>a</i>가 일정하지 않으므로 적분한다.</p><div class="eq"><i>v</i>(<i>t</i>) = ∫<sub>0</sub><sup><i>t</i></sup> (${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i>′) d<i>t</i>′ = ${f(M.PULL.a0, 1)}<i>t</i> − ${f(M.PULL.k / 2)}<i>t</i>²</div><div class="eq"><i>v</i>(${f(T9)}) = ${f(M.PULL.a0 * T9, 1)} − ${f(M.PULL.k / 2 * T9 ** 2, 1)} = ${p3(V9)} m/s</div><p>${p3(M.PULL.a0 * T9 - M.PULL.k * T9 ** 2)} m/s는 <i>t</i>를 적분할 때 생기는 ½을 빠뜨린 것이고, ${p3(M.PULL.a0 * T9)} m/s는 <i>a</i>를 ${f(M.PULL.a0, 1)} m/s²로 일정하다고 본 것이다.</p>` },
    { q: `같은 자동차(<i>a</i> = <i>a</i><sub>0</sub> − <i>kt</i>가 0이 될 때까지, 그 뒤로는 0; <i>x</i> = 0에서 정지 상태로 출발)가 가속도가 0이 될 때까지 <i>x</i><sub>1</sub> = <i>a</i><sub>0</sub>³/3<i>k</i>²만큼 이동함을 보이고, <i>t</i> = 5.00 s에서의 위치를 구하라.`,
      solution: `<p>1. <i>a</i> = 0이 되는 때는 <i>t</i><sub>1</sub> = <i>a</i><sub>0</sub>/<i>k</i> = ${f(M.T1)} s다.</p><p>2. <i>v</i> = ∫<sub>0</sub><sup><i>t</i></sup><i>a</i> d<i>t</i>′ = <i>a</i><sub>0</sub><i>t</i> − ½<i>kt</i>²이므로 <i>v</i><sub>1</sub> = <i>a</i><sub>0</sub>²/2<i>k</i> = ${f(M.V1, 1)} m/s다.</p><p>3. <i>x</i> = ∫<sub>0</sub><sup><i>t</i></sup><i>v</i> d<i>t</i>′ = ½<i>a</i><sub>0</sub><i>t</i>² − <i>kt</i>³/6. <i>t</i><sub>1</sub>에서</p><div class="eq"><i>x</i><sub>1</sub> = <i>a</i><sub>0</sub>³/2<i>k</i>² − <i>a</i><sub>0</sub>³/6<i>k</i>² = <i>a</i><sub>0</sub>³/3<i>k</i>² = ${f(M.PULL.a0, 1)}³ / (3 × ${f(M.PULL.k, 1)}²) = ${f(M.X1, 1)} m</div><p>4. <i>t</i><sub>1</sub> 이후에는 <i>a</i> = 0이므로 <i>v</i>는 ${f(M.V1, 1)} m/s로 유지된다.</p><div class="eq"><i>x</i>(5.00) = ${f(M.X1, 1)} + ${f(M.V1, 1)} × (5.00 − ${f(M.T1)}) = ${f(M.px(5), 1)} m</div>` },
  ],
  10: [
    { q: `입자가 <i>x</i> = <i>t</i>³ − 3<i>t</i> (m, s)로 움직인다. 속도가 0인 순간(<i>t</i> &gt; 0) 입자의 가속도는 얼마인가?`,
      choices: [`${p3(M.ca(M.T_TURN))} m/s²`, '0 m/s²', `${p3(M.cx(M.T_TURN))} m/s²`, `${p3(3 * M.CUBE.A * M.T_TURN)} m/s²`], answer: 0,
      why: `<p><i>v</i> = d<i>x</i>/d<i>t</i> = 3<i>t</i>² − 3은 <i>t</i> = ${f(M.T_TURN)} s에서 0이다. <i>a</i> = d<i>v</i>/d<i>t</i> = 6<i>t</i> = ${p3(M.ca(M.T_TURN))} m/s².</p><p>속도가 0이라고 가속도가 0인 것은 아니다. 입자는 방향을 바꾸는 중이므로 속도가 변하고 있다. (${p3(M.cx(M.T_TURN))}은 그때 입자의 위치로, 단위는 m다.)</p>` },
    { q: '입자의 가속도가 <i>a</i> = 6<i>t</i> (m/s²)이고, <i>v</i>(0) = −3 m/s, <i>x</i>(0) = 0이다. <i>x</i>(<i>t</i>), 입자가 다시 <i>x</i> = 0으로 돌아오는 시각 <i>t</i> &gt; 0, 그리고 그때의 속도를 구하라.',
      solution: `<p>1. 한 번 적분한다. <i>v</i> = 3<i>t</i>² + <i>C</i><sub>1</sub>; <i>v</i>(0) = −3에서 <i>C</i><sub>1</sub> = −3.</p><p>2. 다시 적분한다. <i>x</i> = <i>t</i>³ − 3<i>t</i> + <i>C</i><sub>2</sub>; <i>x</i>(0) = 0에서 <i>C</i><sub>2</sub> = 0.</p><p>3. <i>x</i> = <i>t</i>(<i>t</i>² − 3)은 <i>t</i> = √3 = ${f(Math.sqrt(3))} s에서 0이다.</p><div class="eq"><i>v</i>(√3) = 3(3) − 3 = ${f(M.cv(Math.sqrt(3)))} m/s</div><p>입자는 1 s에 <i>x</i> = −2 m까지 왼쪽으로 갔다가, 오른쪽으로 움직이며 돌아왔다. 돌아올 때는 출발할 때보다 더 빠르다.</p>` },
  ],
};
