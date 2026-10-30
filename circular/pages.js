// Chapter 3, page by page (after the AP Physics 1 organizer, Units 4 and 6, and AP Physics C
// gravitation and orbits). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, V_SCALE, A_SCALE, F_SCALE, ROAD, COASTER, SPACE, ORBIT, WELLS } from './world.js';

const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const cm = x => (x * 100).toFixed(x * 100 < 1 ? 1 : 0);
const deg = r => r * 180 / Math.PI;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 150, P = { l: 44, r: 14, t: 16, b: 30 };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursor, label }) {
  const sx = x => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy = y => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const zero = y0 < 0 && y1 > 0 ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${zero}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursor ? `<circle class="cursor" r="4.5" data-cursor="${cursor}"/>` : ''}
  </svg>`;
}
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
const curve = (x0, x1, fn, n = 60) => Array.from({ length: n + 1 }, (_, i) => { const x = x0 + (x1 - x0) * i / n; return [x, fn(x)]; });

const lapW = M.period(M.V1, M.BALL.r);
const vb = M.loopV(0), Nb = M.loopN(0), Nt = M.loopN(Math.PI);
const r1 = M.SAT.r1, r2 = M.SAT.r2, RE = M.EARTH.R;
const Kp = 0.5 * M.SAT_M * M.ELL.vp ** 2, Ka = 0.5 * M.SAT_M * M.ELL.va ** 2;
const dE = M.circE(M.SAT.r2) - M.circE(M.SAT.r1), dU = M.Ugrav(M.SAT.r2) - M.Ugrav(M.SAT.r1);
const F1 = M.gravF(M.SPHERES.m1, M.SPHERES.m2, M.SPHERES.rMin), F3 = M.gravF(M.SPHERES.m1, M.SPHERES.m2, M.SPHERES.rMax);

export const PAGES = [
  {
    kicker: '3장', title: '원운동', sub: '속력은 일정해도 가속한다',
    body: `
      <p class="lede">줄에 매달려 빙빙 도는 공은 속력이 변하지 않는데도 내내 가속하고 있다. 원 위의 모든 점에서 속도의 <b>방향</b>이 바뀌기 때문이다.</p>
      <p>속도는 벡터다. 크기<i>나</i> 방향 중 하나만 바뀌어도 속도가 변한다. 이 공은 매끄러운 탁자 위에서 ${f(M.BALL.r)} m 줄에 매달려 ${f(M.V1, 1)} m/s로 돈다. ⅛바퀴마다 찍힌 흐린 잔상들은 간격이 고르다.</p>
      <table class="data">
        <tr><td><i>v</i> (파랑)</td><td>원의 접선 방향</td></tr>
        <tr><td><i>a</i><sub>c</sub> = <i>v</i>²/<i>r</i> (빨강)</td><td>${f(M.ac(M.V1, M.BALL.r))} m/s², 중심을 향함, ⟂ <i>v</i></td></tr>
        <tr><td><i>T</i> = 2π<i>r</i>/<i>v</i></td><td>한 바퀴에 ${f(lapW)} s</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 5, y0: -3, y1: 3, xlabel: '시간 (s)', ylabel: '속도 (m/s)', cursor: 'whirl', label: '속력은 일정한데 속도의 한 성분은 오르내린다',
        series: [{ pts: curve(0, 5, t => M.uniform(M.BALL.r, M.V1, t).vx, 120), tag: [0.15, -2.2, 'v<tspan dy="3" font-size="8">x</tspan>'] }, { cls: 'trend', pts: [[0, M.V1], [5, M.V1]], tag: [3.6, M.V1 + 0.1, '속력'] }] })}</div>
      <p class="hintline">공을 클릭하면 Δv를 구한다. 1 m/s당 ${cm(V_SCALE)} cm, 1 m/s²당 ${cm(A_SCALE)} cm.</p>`,
    cam: { target: [STATIONS.whirl, 0.1, 0.05], az: -18, el: 40, dist: 5.2 }, lit: 'whirl', scene: 'whirl', look: {},
    fig: '줄에 매단 공, 위에서 본 모습',
  },
  {
    kicker: '3.1', title: '구심력', sub: '새로운 힘이 아니라 하나의 역할',
    body: `
      <p class="lede">중심을 향하는 가속도에는 중심을 향하는 알짜힘이 필요하다: Σ<i>F</i> = <i>ma</i><sub>c</sub> = <i>mv</i>²/<i>r</i>. 이것은 새로운 종류의 힘이 아니라, 안쪽을 향하는 실제 힘이면 무엇이든 그 역할을 맡는다:</p>
      <table class="data">
        <tr><td>줄에 매단 공</td><td>장력 <i>T</i></td></tr>
        <tr><td>휘두르는 양동이 속의 물</td><td>양동이가 주는 수직 항력</td></tr>
        <tr><td>평평한 커브길의 자동차</td><td>정지 마찰력 <i>f</i><sub>s</sub></td></tr>
        <tr><td>경사진 커브길의 자동차</td><td>수직 항력의 일부</td></tr>
        <tr><td>지구 둘레를 도는 달</td><td>중력 <i>F</i><sub>g</sub></td></tr>
      </table>
      <p>여기서 <i>F</i><sub>N</sub> = <i>mg</i>이고 <i>T</i> = <i>mv</i>²/<i>r</i>이다. ${f(M.V1, 1)} m/s에서는 ${f(M.tension(M.V1))} N, ${f(M.V2, 1)} m/s에서는 <b>${f(M.tension(M.V2))} N</b>. 속력을 두 배로 하면 장력은 네 배가 되고, 반지름을 절반으로 줄이면 두 배가 된다.</p>
      <div class="charts">${chart({ x0: 0, x1: 5, y0: 0, y1: 6, xlabel: '속력 v (m/s)', ylabel: '장력 T (N)', label: '장력은 속력의 제곱에 비례해 커진다',
        series: [{ pts: curve(0, 5, v => Math.min(M.tension(v), 6)) }], marks: [[M.V1, M.tension(M.V1), `${f(M.tension(M.V1), 1)} N`], [M.V2, M.tension(M.V2), `${f(M.tension(M.V2), 1)} N`, -44, 4]] })}</div>
      <p class="hintline">공을 클릭하면 자유 물체 도형이 나온다. 1 N당 ${cm(F_SCALE)} cm.</p>`,
    cam: { target: [STATIONS.double, 0.1, 0.1], az: -10, el: 38, dist: 11.5 }, lit: 'double', scene: 'double', look: {},
    fig: '같은 줄, 2.0 m/s와 4.0 m/s',
  },
  {
    kicker: '3.2', title: '커브길의 자동차', sub: '마찰력이 방향을 튼다',
    body: `
      <p class="lede">평평한 커브길에서 자동차에 옆으로 작용하는 힘은 중심을 향하는 도로의 <b>정지 마찰력</b>뿐이다. 타이어가 옆으로 미끄러지지 않으므로 정지 마찰력이며, 그 크기는 최대 μ<sub>s</sub><i>F</i><sub>N</sub>이다.</p>
      <table class="data eqs">
        <tr><td>Σ<i>F</i><sub>y</sub> = 0</td><td><i>F</i><sub>N</sub> = <i>mg</i> = ${f(M.CAR.W / 1000)} kN</td></tr>
        <tr><td>Σ<i>F</i><sub>x</sub> = <i>ma</i><sub>c</sub></td><td><i>f</i><sub>s</sub> = <i>mv</i>²/<i>r</i> = ${f(M.CAR.f / 1000)} kN (최대 ${f(M.CAR.fmax / 1000)} kN)</td></tr>
      </table>
      <p>μ<sub>s</sub><i>mg</i> = <i>mv</i>²/<i>r</i>에서 질량이 소거된다:</p>
      <div class="eq"><i>v</i><sub>max</sub> = √(μ<sub>s</sub><i>gr</i>) = ${f(M.CAR.vmax)} m/s</div>
      <p>이보다 빠르면 자동차는 접선을 따라 미끄러져 나간다. 바깥으로 튕겨 나가는 것이 아니라 곧장 직진한다.</p>
      <div class="charts">${chart({ x0: 0, x1: 12, y0: 0, y1: 16, xlabel: '속력 v (m/s)', ylabel: '필요한 마찰력 (kN)', cursor: 'flatcar', label: '속력에 따라 필요한 마찰력과 도로가 줄 수 있는 최대 마찰력',
        series: [{ pts: curve(0, 12, v => Math.min(M.CAR.m * v * v / M.CAR.r / 1000, 16)) }, { cls: 'trend', pts: [[0, M.CAR.fmax / 1000], [12, M.CAR.fmax / 1000]], tag: [0.3, M.CAR.fmax / 1000 + 0.3, 'μs·mg'] }],
        marks: [[M.CAR.vmax, M.CAR.fmax / 1000, `v<tspan dy="3" font-size="8">max</tspan><tspan dy="-3"> ${f(M.CAR.vmax, 1)}</tspan>`, 8, 18]] })}</div>
      <p class="hintline">자동차를 클릭하면 자유 물체 도형이 나온다. 축척 1:4, 1 kN당 ${cm(ROAD.kN)} cm, 1 m/s당 ${cm(ROAD.v)} cm.</p>`,
    cam: { target: [STATIONS.flatcar, 0.2, 0.3], az: -14, el: 48, dist: 21 }, lit: 'flatcar', scene: 'flatcar', look: {},
    fig: `반지름 ${M.CAR.r} m 커브, ${f(M.CAR.v, 1)} m/s`,
  },
  {
    kicker: '3.3', title: '원뿔 진자', sub: '줄이 기운다',
    body: `
      <p class="lede">줄에 매단 공을 돌리면 줄은 수평을 유지할 수 없다. 무언가가 중력에 맞서 공을 떠받쳐야 하기 때문이다. 줄은 그 당기는 힘이 두 가지 일을 모두 해낼 때까지 아래로 기운다.</p>
      <p>θ를 연직선에서 잰다. 그러면 수평 성분에는 sin θ가, 연직 성분에는 cos θ가 들어간다:</p>
      <table class="data eqs">
        <tr><td>Σ<i>F</i><sub>y</sub> = 0</td><td><i>T</i> cos θ = <i>mg</i>, 따라서 <i>T</i> = <i>mg</i>/cos θ = ${f(M.CONE.T)} N</td></tr>
        <tr><td>Σ<i>F</i><sub>x</sub> = <i>ma</i><sub>c</sub></td><td><i>T</i> sin θ = <i>mv</i>²/<i>r</i> = ${f(M.CONE.Tx)} N</td></tr>
      </table>
      <p>한 식을 다른 식으로 나누면 장력이 소거된다:</p>
      <div class="eq"><i>g</i> tan θ = <i>v</i>²/<i>r</i> = <i>a</i><sub>c</sub></div>
      <p>여기서 ${f(M.CONE.L, 1)} m 줄이 θ = ${M.CONE.thetaDeg}°로 기울면 공은 <i>r</i> = ${f(M.CONE.r)} m인 원을 그리므로, 공은 ${f(M.CONE.v)} m/s로 움직여 ${f(M.period(M.CONE.v, M.CONE.r))} s마다 한 바퀴를 돌아야 한다. 줄이 완전히 수평일 수는 없다. <i>mg</i>와 균형을 이룰 힘이 없기 때문이다.</p>
      <p class="hintline">공을 클릭하면 장력을 성분으로 나눈다. 힘은 1 N당 ${cm(F_SCALE)} cm.</p>`,
    cam: { target: [STATIONS.cone, 1.25, 0], az: -14, el: 24, dist: 5.6 }, lit: 'cone', scene: 'cone', look: {},
    fig: `연직선에서 ${M.CONE.thetaDeg}° 기운 ${f(M.CONE.L, 1)} m 줄`,
  },
  {
    kicker: '3.4', title: '연직 원운동', sub: '고리의 꼭대기와 바닥',
    body: `
      <p class="lede">연직 고리에서는 중력도 가세한다. 바닥과 꼭대기에서는 중심이 바로 위나 바로 아래에 있으므로, 그곳의 알짜힘은 연직 방향이며 크기는 <i>mv</i>²/<i>r</i>이다.</p>
      <table class="data eqs">
        <tr><td>바닥: <i>F</i><sub>N</sub> − <i>mg</i> = <i>mv</i>²/<i>r</i></td><td><i>F</i><sub>N</sub> = <i>m</i>(<i>v</i>²/<i>r</i> + <i>g</i>) = ${f(Nb / 1000, 1)} kN</td></tr>
        <tr><td>꼭대기: <i>F</i><sub>N</sub> + <i>mg</i> = <i>mv</i>²/<i>r</i></td><td><i>F</i><sub>N</sub> = <i>m</i>(<i>v</i>²/<i>r</i> − <i>g</i>) = ${f(Nt / 1000, 1)} kN</td></tr>
      </table>
      <div class="eq"><i>F</i><sub>N top</sub> = 0: <i>v</i><sub>min</sub> = √(<i>gr</i>) = ${f(M.LOOP.vmin)} m/s</div>
      <p>머리 위로 휘두르는 물 양동이도 마찬가지다. 이 ${M.LOOP.m} kg 카트는 고리 꼭대기를 ${f(M.LOOP.vTop, 1)} m/s로 지나고 바닥에서는 ${f(vb, 1)} m/s에 이른다. 그 사이에서는 알짜힘의 일부가 카트를 빠르게 하거나 느리게 한다.</p>
      <div class="charts">${chart({ x0: 0, x1: 360, y0: 0, y1: 35, xlabel: '바닥에서부터 고리를 따라 잰 각 (°)', ylabel: '수직 항력 (kN)', cursor: 'loop', label: '고리를 따라 변하는 수직 항력',
        series: [{ pts: curve(0, 360, d => M.loopN(d * Math.PI / 180) / 1000, 90) }, { cls: 'trend', pts: [[0, M.LOOP.W / 1000], [360, M.LOOP.W / 1000]], tag: [8, M.LOOP.W / 1000 + 0.5, 'mg'] }],
        marks: [[180, Nt / 1000, `꼭대기 ${f(Nt / 1000, 1)}`, 10, -10]] })}</div>
      <p class="hintline">카트를 클릭하면 자유 물체 도형이 나온다. 축척 1:5, 힘은 1 kN당 ${cm(COASTER.kN)} cm.</p>`,
    cam: { target: [STATIONS.loop + 0.75, 1.3, 0], az: -8, el: 6, dist: 12 }, lit: 'loop', scene: 'loop', look: {},
    fig: `반지름 ${f(M.LOOP.r, 0)} m 고리, 꼭대기에서 ${f(M.LOOP.vTop, 0)} m/s`,
  },
  {
    kicker: '3.5', title: '경사진 커브길', sub: '도로를 기울인다',
    body: `
      <p class="lede">도로를 기울이면 수직 항력도 경사각 θ만큼 함께 기운다. 그 수평 성분이 마찰 없이도 자동차의 방향을 튼다.</p>
      <table class="data eqs">
        <tr><td>Σ<i>F</i><sub>y</sub> = 0</td><td><i>F</i><sub>N</sub> cos θ = <i>mg</i>, <i>F</i><sub>N</sub> = ${f(M.BANK.N / 1000)} kN</td></tr>
        <tr><td>Σ<i>F</i><sub>x</sub> = <i>ma</i><sub>c</sub></td><td><i>F</i><sub>N</sub> sin θ = <i>mv</i>²/<i>r</i> = ${f(M.BANK.Nx / 1000)} kN</td></tr>
      </table>
      <div class="eq">tan θ = <i>v</i>²/(<i>rg</i>)</div>
      <p>경사마다 알맞은 속력이 하나씩 있다. √(<i>rg</i> tan θ), 여기서는 ${f(M.BANK.v)} m/s다. 더 빠르면 자동차는 경사면 위쪽으로 밀려 올라가고, 더 느리면 아래로 미끄러진다.</p>
      <div class="charts">${chart({ x0: 0, x1: 45, y0: 0, y1: 10, xlabel: '경사각 θ (°)', ylabel: '알맞은 속력 (m/s)', label: '반지름 10 m 커브에서 경사각에 따른 알맞은 속력',
        series: [{ pts: curve(0, 45, d => M.bankSpeed(d)) }], marks: [[M.BANK.thetaDeg, M.BANK.v, `${M.BANK.thetaDeg}°: ${f(M.BANK.v)} m/s`]] })}</div>
      <p class="hintline">자동차를 클릭하면 수직 항력을 성분으로 나눈다. 축척 1:4, 힘은 1 kN당 ${cm(ROAD.kN)} cm.</p>`,
    cam: { target: [STATIONS.bank, 0.3, 0.3], az: -14, el: 30, dist: 21 }, lit: 'bank', scene: 'bank', look: {},
    fig: `경사각 ${M.BANK.thetaDeg}°, 마찰 없음`,
  },
  {
    kicker: '3.6', title: '각속도', sub: 'v = rω',
    body: `
      <p class="lede">회전하는 원판 위의 모든 점은 같은 시간에 같은 각만큼 돈다. 즉 <b>각속도</b> ω는 하나다. 바깥쪽 점일수록 더 먼 거리를 가므로 더 빠르게 움직인다.</p>
      <table class="data eqs">
        <tr><td>ω = Δθ/<i>t</i></td><td>rad/s (또는 rpm)</td></tr>
        <tr><td><i>s</i> = <i>r</i>Δθ</td><td>호의 길이. <i>s</i> = <i>r</i>일 때 1 rad</td></tr>
        <tr><td><i>v</i> = <i>r</i>ω</td><td>접선 속력. <i>T</i> = 2π/ω</td></tr>
      </table>
      <p>ω = ${f(M.DISC.w)} rad/s(${f(M.radToRpm(M.DISC.w), 1)} rpm. rpm × 2π/60 = rad/s)일 때 ${f(M.DISC.r1)} m에 있는 블록은 ${f(M.DISC.v1)} m/s로, 두 배 먼 곳의 블록은 ${f(M.DISC.v2)} m/s로 움직인다. 둘 다 한 바퀴에 ${f(M.DISC.T)} s가 걸리며, 질량은 상관없다.</p>
      <div class="charts">${chart({ x0: 0, x1: 1, y0: 0, y1: 3, xlabel: '중심에서의 거리 r (m)', ylabel: '속력 v (m/s)', label: '속력은 반지름에 비례해 커진다',
        series: [{ pts: [[0, 0], [1, M.DISC.w]], tag: [0.06, 1.0, '기울기 = ω'] }], marks: [[M.DISC.r1, M.DISC.v1, 'v₁'], [M.DISC.r2, M.DISC.v2, 'v₂']] })}</div>
      <p class="hintline">원판을 클릭하면 1 라디안을 휩쓰는 모습이 보인다.</p>`,
    cam: { target: [STATIONS.disc, 0.05, 0.05], az: -16, el: 40, dist: 5.6 }, lit: 'disc', scene: 'disc', look: {},
    fig: `ω = ${f(M.DISC.w, 1)} rad/s`,
  },
  {
    kicker: '3.7', title: '중력', sub: '모든 질량은 다른 모든 질량을 당긴다',
    body: `
      <p class="lede">모든 질량은 다른 모든 질량을 끌어당긴다. 그 힘은 두 질량의 곱에 비례하고, 두 중심 사이 거리의 제곱에 반비례한다.</p>
      <div class="eq"><i>F</i><sub>g</sub> = <i>G m</i><sub>1</sub><i>m</i><sub>2</sub> / <i>r</i>²</div>
      <p><i>G</i> = 6.67 × 10⁻¹¹ N·m²/kg². 이 두 구는 ${f(M.SPHERES.rMin, 1)} m 거리에서 ${f(F1 * 1e6, 0)} μN으로 서로 당긴다(쌀알 반 톨의 무게). 세 배 멀어지면 9분의 1인 ${f(F3 * 1e6, 1)} μN이 된다. 지구는 <i>g</i> = <i>GM</i><sub>E</sub>/<i>R</i><sub>E</sub>² = ${f(M.EARTH.g)} m/s²를 준다. ${M.PERSON} kg인 사람에게는 ${f(M.gravF(M.EARTH.M, M.PERSON, M.EARTH.R), 0)} N, 곧 <i>mg</i>다.</p>
      <table class="data">
        <tr><td>2<i>m</i><sub>1</sub>, 2<i>m</i><sub>2</sub>, 3<i>r</i></td><td>2 × 2 / 3²</td><td>4/9 <i>F</i></td></tr>
        <tr><td>4<i>m</i><sub>1</sub>, <i>m</i><sub>2</sub>, ½<i>r</i></td><td>4 × 1 / 0.5²</td><td>${f(M.ratio(4, 1, 0.5), 0)} <i>F</i></td></tr>
      </table>
      <div class="charts">${chart({ x0: 0.8, x1: 3.2, y0: 0, y1: 220, xlabel: '두 중심 사이의 거리 r (m)', ylabel: '힘 (μN)', cursor: 'gravity', label: '거리에 따른 중력: 역제곱',
        series: [{ pts: curve(0.8, 3.2, r => M.gravF(M.SPHERES.m1, M.SPHERES.m2, r) * 1e6, 80) }] })}</div>
      <p class="hintline">클릭하면 가속도를 비교한다. 1 μN당 ${f(SPACE.uN * 1000, 0)} mm.</p>`,
    cam: { target: [STATIONS.gravity + 0.15, 0.85, 0], az: -10, el: 12, dist: 14 }, lit: 'gravity', scene: 'gravity', look: {},
    fig: `철 ${M.SPHERES.m1} kg과 ${M.SPHERES.m2} kg`,
  },
  {
    kicker: '3.8', title: '궤도', sub: '중력이라는 줄',
    body: `
      <p class="lede">원 궤도를 도는 위성은 줄에 매단 공과 같고, 중력이 그 줄이다. 우주에서의 문제는 언제나 <i>F</i><sub>g</sub> = <i>F</i><sub>c</sub>에서 출발한다:</p>
      <div class="eq"><i>GMm</i>/<i>r</i>² = <i>mv</i>²/<i>r</i> &nbsp;→&nbsp; <i>v</i> = √(<i>GM</i>/<i>r</i>)</div>
      <p>위성 자신의 질량은 소거된다. <i>v</i> = 2π<i>r</i>/<i>T</i>를 대입하면 케플러 제3법칙 <i>T</i>² ∝ <i>r</i>³이 나온다:</p>
      <div class="eq"><i>T</i>² = (4π²/<i>GM</i>) <i>r</i>³</div>
      <table class="data">
        <tr><th>궤도 반지름</th><th><i>v</i></th><th><i>T</i></th><th><i>a</i></th></tr>
        <tr><td>2 <i>R</i><sub>E</sub> = ${f(r1 / 1e6 * 1000, 0)} km</td><td>${f(M.orbitV(r1) / 1000)} km/s</td><td>${f(M.orbitT(r1) / 3600)} h</td><td>${f(M.orbitA(r1))} m/s²</td></tr>
        <tr><td>4 <i>R</i><sub>E</sub> = ${f(r2 / 1e6 * 1000, 0)} km</td><td>${f(M.orbitV(r2) / 1000)} km/s</td><td>${f(M.orbitT(r2) / 3600)} h</td><td>${f(M.orbitA(r2))} m/s²</td></tr>
      </table>
      <p>궤도가 높을수록 주기는 길고 속력은 <b>느리다</b>. 모든 점이 같은 ω를 공유해 바깥쪽이 가장 빠른 원판과는 정반대다. 실제 궤도는 행성을 한 초점에 둔 타원이며(케플러 제1법칙), 같은 시간에 같은 넓이를 휩쓴다(제2법칙). 다음 페이지에서 하나를 그려 본다.</p>
      <p class="hintline">3600배 빠르게 표시: 여기서 1초는 1시간이다. ${f(1 / ORBIT.draw / 1e6 * 1000, 0)} km당 1 m, 1 km/s당 ${cm(ORBIT.v)} cm, 1 m/s²당 ${cm(ORBIT.a)} cm.</p>`,
    cam: { target: [STATIONS.orbit, 1.6, 0.2], az: -14, el: 36, dist: 34 }, lit: 'orbit', scene: 'orbit', look: {},
    fig: '지구 반지름의 2배와 4배인 궤도',
  },
  {
    kicker: '3.9', title: '타원 궤도', sub: '같은 시간에 같은 넓이',
    body: `
      <p class="lede">대부분의 궤도는 지구를 한 초점에 둔 타원이다(케플러 제1법칙). 중력은 지구 중심에 대해 돌림힘이 없으므로 각운동량 <i>mvr</i><sub>⊥</sub>가 보존된다. 근지점과 원지점에서는 <i>v</i> ⟂ <i>r</i>이다:</p>
      <div class="eq"><i>r</i><sub>p</sub><i>v</i><sub>p</sub> = <i>r</i><sub>a</sub><i>v</i><sub>a</sub></div>
      <table class="data">
        <tr><td>근지점, 2 <i>R</i><sub>E</sub></td><td><i>v</i><sub>p</sub> = ${f(M.ELL.vp / 1000)} km/s</td></tr>
        <tr><td>원지점, 6 <i>R</i><sub>E</sub></td><td><i>v</i><sub>a</sub> = ${f(M.ELL.va / 1000)} km/s</td></tr>
      </table>
      <p>세 배 멀면 3분의 1의 속력이다. 반지름은 같은 시간에 같은 넓이를 휩쓸며(케플러 제2법칙), 제3법칙은 <i>r</i> 대신 긴반지름 <i>a</i>를 쓰면 성립한다.</p>
      <div class="charts">${chart({ x0: 0, x1: 360, y0: 0, y1: 8, xlabel: '근지점에서 잰 각 (°)', ylabel: '속력 (km/s)', cursor: 'kepler', label: '타원을 따라 변하는 속력: 근지점에서 가장 빠르고 원지점에서 가장 느리다',
        series: [{ pts: curve(0, 360, d => M.ellV(d * Math.PI / 180) / 1000, 120) }],
        marks: [[180, M.ELL.va / 1000, `원지점 ${f(M.ELL.va / 1000)}`, -36, -12]] })}</div>
      <p class="hintline">클릭하면 근지점과 원지점을 본다. 부채꼴은 각각 1시간(파랑: 마지막 것). 3600배, 1 km/s당 ${cm(ORBIT.v)} cm.</p>`,
    cam: { target: [STATIONS.kepler + 0.6, 1.8, 0.3], az: -6, el: 62, dist: 41 }, lit: 'kepler', scene: 'kepler', look: {},
    fig: '근지점 2, 원지점 6 지구 반지름',
  },
  {
    kicker: '3.10', title: '궤도 위의 에너지', sub: '운동 에너지와 퍼텐셜 에너지의 교환',
    body: `
      <p class="lede">작용하는 힘은 중력뿐이고 중력은 보존력이므로, 위성–지구 계의 역학적 에너지는 보존된다:</p>
      <div class="eq">½<i>mv</i>² − <i>GMm</i>/<i>r</i> = <i>E</i>, 일정</div>
      <p>근지점을 향해 떨어지는 동안 중력에는 <i>v</i> 방향 성분이 있다. 이 성분이 양의 일을 하므로 <i>U</i> = −<i>GMm</i>/<i>r</i>는 줄고 <i>K</i>는 그만큼 늘어난다. 멀어지며 올라갈 때는 같은 성분이 위성을 느리게 한다.</p>
      <table class="data">
        <tr><th>${M.SAT_M} kg</th><th><i>K</i></th><th><i>U</i></th><th><i>E</i></th></tr>
        <tr><td>근지점</td><td>${f(Kp / 1e9, 1)} GJ</td><td>${f(M.Ugrav(M.ELL.rp) / 1e9, 1)} GJ</td><td>${f(M.ELL.E / 1e9, 1)} GJ</td></tr>
        <tr><td>원지점</td><td>${f(Ka / 1e9, 1)} GJ</td><td>${f(M.Ugrav(M.ELL.ra) / 1e9, 1)} GJ</td><td>${f(M.ELL.E / 1e9, 1)} GJ</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 360, y0: -35, y1: 25, xlabel: '근지점에서 잰 각 (°)', ylabel: '에너지 (GJ)', label: '타원을 따라 변하는 운동 에너지, 퍼텐셜 에너지, 총에너지',
        series: [{ pts: curve(0, 360, d => 0.5 * M.SAT_M * M.ellV(d * Math.PI / 180) ** 2 / 1e9, 120), tag: [172, 5, 'K'] },
                 { pts: curve(0, 360, d => M.Ugrav(M.ellR(d * Math.PI / 180)) / 1e9, 120), tag: [172, -20, 'U'] },
                 { cls: 'curve total', pts: [[0, M.ELL.E / 1e9], [360, M.ELL.E / 1e9]], tag: [262, M.ELL.E / 1e9 + 0.5, 'E = K + U'] }] }).replace('</svg>', '<circle class="cursor" r="4.5" data-cursor="orbitK"/><circle class="cursor" r="4.5" data-cursor="orbitU"/></svg>')}</div>
      <p class="hintline">위성을 클릭하면 중력을 <i>v</i>에 나란한 성분과 수직인 성분으로 나눈다. 1 kN당 ${f(ORBIT.kN * 100, 0)} cm, 막대는 1 GJ당 ${f(ORBIT.GJ * 100, 0)} cm.</p>`,
    cam: { target: [STATIONS.orbitE + 0.1, 1.9, 0.3], az: -6, el: 36, dist: 36 }, lit: 'orbitE', scene: 'orbitE', look: {},
    fig: `${M.SAT_M} kg 위성, K + U = E`,
  },
  {
    kicker: '3.11 · AP 물리 C', title: '퍼텐셜 에너지', sub: 'U = −GMm/r, 무한대에서 0',
    body: `
      <p class="lede">지면에서 멀어지면 <i>g</i>가 달라지므로 <i>mgh</i>는 맞지 않는다. 무한대에서 <i>U</i> = 0으로 놓고 <i>F</i><sub>r</sub> = −<i>GMm</i>/<i>r</i>²를 적분한다:</p>
      <div class="eq"><i>U</i> = −∫<sub>∞</sub><sup><i>r</i></sup> <i>F</i><sub>r</sub> d<i>r</i>′ = <i>GMm</i>[−1/<i>r</i>′]<sub>∞</sub><sup><i>r</i></sup> = −<i>GMm</i>/<i>r</i></div>
      <p>음수인 까닭은 <i>m</i>을 무한대에서 끌어올 때 중력이 양의 일을 하기 때문이다. 의미 있는 것은 차이뿐이며, −d<i>U</i>/d<i>r</i>을 하면 다시 <i>F</i><sub>r</sub>가 나온다. 지면 근처에서는 <i>h</i> ≪ <i>R</i>인 <i>r</i> = <i>R</i> + <i>h</i>이므로:</p>
      <div class="eq">Δ<i>U</i> ≈ (<i>GMm</i>/<i>R</i>²) <i>h</i> = <i>mgh</i></div>
      <div class="charts">${chart({ x0: 0, x1: 2, y0: 0, y1: 130, xlabel: '높이 h (지구 반지름 단위)', ylabel: '지면 기준 ΔU (GJ)', label: '1000 kg에 대한 mgh와 퍼텐셜 에너지의 정확한 변화 비교',
        series: [{ pts: curve(0, 2, h => (M.Ugrav(RE * (1 + h)) - M.Ugrav(RE)) / 1e9), tag: [1.5, 34, '정확한 값'] }, { cls: 'trend', pts: curve(0, 2, h => M.SAT_M * M.EARTH.g * h * RE / 1e9, 2), tag: [1.25, 96, 'mgh'] }] })}</div>
      <p class="hintline">100 km에서 <i>mgh</i>는 ${f(100e3 / M.EARTH.R * 100, 1)}% 크다. 곡선을 클릭해 보자. 가로 ${f(1 / ORBIT.draw / 1e6 * 1000, 0)} km당 1 m, 세로 1 GJ당 ${cm(WELLS.GJ)} cm, 1 kN당 ${cm(WELLS.kN)} cm.</p>`,
    cam: { target: [STATIONS.well + 3.8, 1.3, 0], az: -8, el: 10, dist: 30 }, lit: 'well', scene: 'well', look: {},
    fig: `${M.SAT_M} kg 위성의 U(r)`,
  },
  {
    kicker: '3.12 · AP 물리 C', title: '탈출', sub: '0보다 낮으면 묶여 있다',
    body: `
      <p class="lede">원 궤도에서는 <i>mv</i>² = <i>GMm</i>/<i>r</i>이므로 <i>K</i> = −<i>U</i>/2이고</p>
      <div class="eq"><i>E</i> = <i>K</i> + <i>U</i> = −<i>GMm</i>/2<i>r</i></div>
      <p>${M.SAT_M} kg을 2 <i>R</i><sub>E</sub>에서 4 <i>R</i><sub>E</sub>로 올리는 데 ${f(dE / 1e9, 1)} GJ가 들지만, 결과적으로 위성은 더 느려진다. <i>U</i>는 ${f(dU / 1e9, 1)} GJ 늘고 <i>K</i>는 ${f(dE / 1e9, 1)} 줄어든다. <i>r</i> → ∞에 도달하려면 <i>E</i> ≥ 0이어야 한다:</p>
      <div class="eq">½<i>mv</i>² = <i>GMm</i>/<i>R</i> → <i>v</i><sub>esc</sub> = √(2<i>GM</i>/<i>R</i>)</div>
      <p>지면에서는 어느 방향으로든 ${f(M.vEsc(M.EARTH.R) / 1000, 1)} km/s, 2 <i>R</i><sub>E</sub>에서는 ${f(M.LAUNCH.vesc / 1000)} km/s = √2 <i>v</i><sub>c</sub>다. 이보다 느리면 타원, 같으면 포물선, 빠르면 쌍곡선을 그린다.</p>
      <div class="charts">${chart({ x0: 1.6, x1: 8, y0: -40, y1: 10, xlabel: '원 궤도 반지름 (지구 반지름 단위)', ylabel: '에너지 (GJ)', label: 'U(r)와 지구 반지름 2배, 4배 원 궤도의 총에너지 및 운동 에너지',
        series: [{ pts: curve(1.6, 8, x => M.Ugrav(x * RE) / 1e9, 90), tag: [5.6, -17, 'U(r)'] },
          ...[2, 4].flatMap(x => [{ cls: 'curve total', pts: [[x - 0.35, M.circE(x * RE) / 1e9], [x + 0.35, M.circE(x * RE) / 1e9]], tag: [x + 0.35, M.circE(x * RE) / 1e9 - 1, 'E'] },
            { cls: 'trend', pts: [[x, M.Ugrav(x * RE) / 1e9], [x, M.circE(x * RE) / 1e9]], tag: [x - 0.02, (M.Ugrav(x * RE) + M.circE(x * RE)) / 2e9 - 2, 'K'] }]),
          { cls: 'trend', pts: [[6.3, 0], [8, 0]], tag: [5.2, 1, '탈출: E ≥ 0'] }],
        marks: [[2, M.Ugrav(2 * RE) / 1e9, '2 R<tspan dy="3" font-size="8">E</tspan>', 6, 12], [4, M.Ugrav(4 * RE) / 1e9, '4 R<tspan dy="3" font-size="8">E</tspan>', 6, 12]] })}</div>
      <p class="hintline">발사체를 클릭하면 속력을 비교한다. ${M.ESC_TIME}배 빠르게 표시, 1 km/s당 ${cm(ORBIT.v)} cm.</p>`,
    cam: { target: [STATIONS.escape - 0.8, 1.4, -2.4], az: -8, el: 52, dist: 42 }, lit: 'escape', scene: 'escape', look: {},
    fig: '지구 반지름 2배 지점에서 옆으로 발사',
  },
];

// ---------- click a scene: what it breaks into ----------
export const PLATES = {
  whirl: { text: `원 위에서 ${f(deg(M.DPHI), 0)}° 떨어진 두 순간의 속도를 한 점에서 그려 보자. 변화량 Δ<i>v</i> = <i>v</i><sub>f</sub> − <i>v</i><sub>0</sub>(빨강)은 원의 중심을 향한다. 두 순간 사이의 시간을 줄여 가면 Δ<i>v</i>/Δ<i>t</i>는 정확히 <i>v</i>²/<i>r</i>가 되며, 언제나 중심을 향한다.`,
    facts: () => { const dt = M.DPHI * M.BALL.r / M.V1; return [['Δv = 2v sin(Δθ/2)', `${f(M.deltaV(M.V1, M.DPHI))} m/s`], ['Δt', `${f(dt, 3)} s`], ['Δv / Δt', `${f(M.avgAccel(M.V1, M.BALL.r, M.DPHI))} m/s²`], ['v²/r (Δt → 0)', `${f(M.ac(M.V1, M.BALL.r))} m/s²`]]; } },
  double: { text: `각 공을 점으로 줄이면 자유 물체 도형이 된다. 위아래로는 탁자가 미는 힘이 무게를 상쇄한다. 옆으로 작용하는 힘은 줄뿐이므로 장력이 <i>곧</i> 알짜힘(빨강)이며, 핀을 향한다.`,
    facts: () => [['F<sub>N</sub> = mg', `${f(M.BALL.m * M.G)} N, 둘 다`], [`${f(M.V1, 1)} m/s일 때 T`, `${f(M.tension(M.V1))} N`], [`${f(M.V2, 1)} m/s일 때 T`, `${f(M.tension(M.V2))} N`], ['비', `(${f(M.V2 / M.V1, 0)})² = ${f(M.tension(M.V2) / M.tension(M.V1), 0)}`]] },
  flatcar: { text: `자동차를 점으로 줄이면 무게와 수직 항력은 상쇄되고, 중심을 향하는 정지 마찰력이 알짜힘이다. 점선은 빙판길처럼 마찰이 사라졌을 때 자동차가 갈 길로, 접선을 따라 곧장 나아간다.`,
    facts: () => [['f<sub>s</sub> = mv²/r', `${f(M.CAR.f)} N`], ['μ<sub>s</sub> F<sub>N</sub> (한계)', `${f(M.CAR.fmax)} N`], ['a<sub>c</sub> = v²/r', `${f(M.CAR.v ** 2 / M.CAR.r)} m/s²`], ['v<sub>max</sub> = √(μ<sub>s</sub> g r)', `${f(M.CAR.vmax)} m/s`]] },
  cone: { text: `장력은 <i>mg</i>에 맞서 공을 떠받치는 연직 성분과 원의 중심을 향하는 수평 성분으로 나뉜다. 수평 성분이 알짜힘(빨강) 전체다.`,
    facts: () => [['T', `${f(M.CONE.T)} N`], ['T cos θ = mg', `${f(M.CONE.Ty)} N`], ['T sin θ = mv²/r', `${f(M.CONE.Tx)} N`], ['tan θ = v²/(rg)', `${f(Math.tan(M.CONE.th), 3)}`]] },
  loop: { text: `꼭대기와 바닥에서의 자유 물체 도형. 바닥에서는 트랙이 위로 밀며 중력까지 이겨야 하므로 무게의 ${f(Nb / M.LOOP.W, 1)}배가 된다. 꼭대기에서는 트랙과 중력이 모두 아래, 곧 중심 쪽으로 밀며, 둘이 합쳐 <i>mv</i>²/<i>r</i>를 이룬다.`,
    facts: () => [['바닥: F<sub>N</sub>', `${f(vb)} m/s에서 ${f(Nb / 1000)} kN`], ['꼭대기: F<sub>N</sub>', `${f(M.LOOP.vTop)} m/s에서 ${f(Nt / 1000)} kN`], ['무게 mg', `${f(M.LOOP.W / 1000)} kN`], ['v<sub>min</sub> = √(gr)', `${f(M.LOOP.vmin)} m/s`]] },
  bank: { text: `수직 항력은 무게와 정확히 균형을 이루는 연직 성분과 중심을 향하는 수평 성분으로 나뉜다. 그 수평 성분이 알짜힘(빨강)이다. 알맞은 속력에서는 마찰이 필요 없다.`,
    facts: () => [['F<sub>N</sub> = mg / cos θ', `${f(M.BANK.N)} N`], ['F<sub>N</sub> cos θ = mg', `${f(M.BANK.Ny)} N`], ['F<sub>N</sub> sin θ = mv²/r', `${f(M.BANK.Nx)} N`], ['알맞은 속력', `${f(M.BANK.v)} m/s`]] },
  disc: { text: `같은 시간 동안 두 블록은 모두 1 라디안을 돈다. <i>s</i> = <i>r</i>θ이므로 바깥쪽 호가 두 배 길다. 같은 시간에 두 배의 거리, 곧 두 배의 속력이다.`,
    facts: () => [['Δθ', '1 rad = 57.3°'], ['s₁ = r₁ × 1 rad', `${f(M.DISC.r1)} m`], ['s₂ = r₂ × 1 rad', `${f(M.DISC.r2)} m`], ['1 rad에 걸리는 시간', `${f(1 / M.DISC.w)} s`]] },
  gravity: { text: `두 끌어당김은 작용–반작용 쌍이다. 한 구의 질량이 두 배여도 크기는 같고 방향은 반대다. 그러나 가속도(빨강, <i>a</i> = <i>F</i>/<i>m</i>)는 같지 않다. 가벼운 구가 두 배의 가속도를 받는다.`,
    facts: s => { const r = M.sep(s.clock), F = M.gravF(M.SPHERES.m1, M.SPHERES.m2, r); return [['r', `${f(r)} m`], ['F<sub>12</sub> = F<sub>21</sub>', `${f(F * 1e6, 1)} μN`], ['a₁ (1000 kg)', `${f(F / M.SPHERES.m1 * 1e9, 1)} × 10⁻⁹ m/s²`], ['a₂ (2000 kg)', `${f(F / M.SPHERES.m2 * 1e9, 1)} × 10⁻⁹ m/s²`]]; } },
  orbit: { text: `호는 각 위성이 같은 1시간 동안 가는 거리를 보여 준다. 안쪽 위성은 ${f(deg(3600 * M.orbitV(r1) / r1), 0)}°를 휩쓸지만 바깥쪽 위성은 ${f(deg(3600 * M.orbitV(r2) / r2), 0)}°뿐이다. 원판 위의 점들과 달리 궤도들은 각속도를 공유하지 않는다. 멀리 있을수록 모든 면에서 느리다.`,
    facts: () => [['T₁², T₂² ÷ r³', `${(M.orbitT(r1) ** 2 / r1 ** 3).toExponential(3)} s²/m³, 둘 다`], ['4π² / GM', `${(4 * Math.PI ** 2 / M.GM).toExponential(3)} s²/m³`], ['T₂ / T₁', `${f(M.orbitT(r2) / M.orbitT(r1))} = 2√2`], ['v₂ / v₁', `${f(M.orbitV(r2) / M.orbitV(r1), 3)} = 1/√2`]] },
  kepler: { text: `근지점과 원지점에 있는 위성. 두 곳 모두 <i>v</i> ⟂ <i>r</i>이므로 <i>L</i> = <i>mvr</i>이다. 세 배 멀리 있으면 3분의 1의 속력으로 움직인다. 1시간짜리 부채꼴들의 넓이는 같다. 지구 가까이에서는 짧고 넓으며, 먼 곳에서는 길고 가늘다.`,
    facts: () => [['r<sub>p</sub> v<sub>p</sub>', `${f(M.ELL.rp * M.ELL.vp / 1e10, 3)} × 10¹⁰ m²/s`], ['r<sub>a</sub> v<sub>a</sub>', `${f(M.ELL.ra * M.ELL.va / 1e10, 3)} × 10¹⁰ m²/s`], ['1시간당 넓이 (RK4)', `${f(M.swept(0, M.SWEEP) / 1e12, 1)} × 10¹² m²`], ['T = 2π√(a³/GM)', `${f(M.ELL.T / 3600)} h`]] },
  orbitE: { text: `중력(빨강)은 속도에 나란한 성분과 수직인 성분으로 나뉜다. 일을 하는 것은 <i>v</i>에 나란한 성분뿐이다. 이 성분은 들어올 때 위성을 빠르게 하고 나갈 때 느리게 한다. 근지점과 원지점에서는 이 성분이 사라지고, 속력은 극값이 된다.`,
    facts: s => { const p = M.ELL.track.at(s.clock * M.ORBIT_TIME), K = 0.5 * M.SAT_M * p.v ** 2, U = M.Ugrav(p.r); return [['r', `${f(p.r / RE)} R<sub>E</sub>`], ['K = ½mv²', `${f(K / 1e9)} GJ`], ['U = −GMm/r', `${f(U / 1e9)} GJ`], ['E = K + U', `${f((K + U) / 1e9)} GJ`]]; } },
  well: { text: `빨간 선은 <i>U</i>(<i>R</i>) + <i>mgh</i>로, 지면에서 곡선에 그은 기울기 <i>mg</i>인 접선이다. <i>h</i>가 작을 때는 맞지만, 더 높이 올라가면 <i>g</i>가 약해지면서 실제 곡선은 평평해지고 결코 0에 닿지 않는다. 반면 직선은 지구 반지름 하나만큼 올라간 곳에서 0을 지난다.`,
    facts: s => { const r = M.wellR(s.clock); return [['r', `${f(r / RE)} R<sub>E</sub>`], ['U = −GMm/r', `${f(M.Ugrav(r) / 1e9)} GJ`], ['F = GMm/r²', `${f(M.GM * M.SAT_M / r ** 2 / 1000)} kN`], ['U(R) + mgh', `${f((M.Ugrav(RE) + M.SAT_M * M.EARTH.g * (r - RE)) / 1e9)} GJ`]]; } },
  escape: { text: `네 가지 발사 속력을 나란히 놓았다. 모두 같은 점에서 옆으로 발사했다. <i>E</i>의 부호가 결과를 정한다. 0보다 작으면 공은 묶여 있어 한 바퀴 돌아 돌아오고, 0이면 간신히 탈출해 멀리서 속력이 0에 가까워지며, 0보다 크면 속력을 남긴 채 떠난다.`,
    facts: () => M.LAUNCH.list.map(o => [`${o.name}: ${f(o.v0 / 1000)} km/s`, `E ${Math.abs(o.E) < 1 ? '0' : f(o.E * M.SAT_M / 1e9, 1)} GJ`]) },
};
