// Chapter 14, page by page (after the AP Physics C E&M organizer, Unit 7). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, SC } from './world.js';

const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
export const sci = (x, n = 2) => { const e = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** e; return `${f(m, n)}×10${String(e).split('').map(c => SUP[c]).join('')}`; };
const uT = x => f(x * 1e6, 1);

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], vlines = [], zero = false, cursor, label }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(Math.min(Math.max(y, y0), y1)).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const vl = vlines.map(([x, t]) => `<line class="grid" x1="${sx(x)}" x2="${sx(x)}" y1="${P.t}" y2="${H - P.b}"/><text class="ax" x="${sx(x) + 4}" y="${H - P.b - 6}">${t}</text>`).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const z = zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${z}${vl}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2 + 40}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursor ? `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${cursor}"/>` : ''}
  </svg>`;
}
const curve = (fn, a, b, n = 80) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
// chart ranges, shared with main.js for the live cursors
export const R = {
  magnet: { x0: -40, x1: 40, y0: 0, y1: 300 },
  rhr: { x0: 0, x1: 180, y0: 0, y1: 2 },
  cyclo: { x0: 0, x1: 2.5, y0: 0, y1: 3 },
  selector: { x0: 0, x1: 2, y0: -2, y1: 2 },
  loop: { x0: 0, x1: 180, y0: -0.08, y1: 0.08 },
  ampere: { x0: 0, x1: 15, y0: 0, y1: 400 },
  ring: { x0: 0, x1: 36, y0: 0, y1: 45 },
  wires: { x0: 0, x1: 40, y0: 0, y1: 2 },
  solenoid: { x0: -40, x1: 40, y0: 0, y1: 300 },
};

// the closed surface round the magnet's N end, summed once
export const MAGFLUX = M.boxFlux(M.magnetB, M.MAG_BOX.c, M.MAG_BOX.h, 60);
const BC = M.magnetB([0, 0, 0])[0], SOLC = M.solB([0, 0, 0])[0];
const slow = c => sci(c, 1);

export const PAGES = [
  {
    kicker: '14장', title: '자기장', sub: '움직이는 전하가 만든다',
    body: `
      <p class="lede"><b>자기장</b> <b>B</b>는 움직이는 전하가 만든다. 전류일 수도 있고, 자석 속에서 스핀하는 전자일 수도 있다. 단위는 테슬라다(1 T = 10<sup>4</sup> 가우스).</p>
      <p>자석 바깥에서 자기력선은 N에서 S로, 안에서는 S에서 다시 N으로 이어지므로 모든 자기력선은 닫혀 있다. 자기 홀극은 없다(자석을 자르면 자석 두 개가 된다). 그러므로 어떤 닫힌 곡면을 지나도</p>
      <div class="eq">∮ <b>B</b> · d<b>A</b> = 0</div>
      <p>이 ${f(M.MAG.L * 100, 0)} cm 자석은 앙페르가 상상한 대로, 옆면을 감아 도는 전류 판으로 그렸다. 모든 자기력선은 그 전류에 대한 비오-사바르 합으로 추적한 것이다.</p>
      <div class="charts">${chart({ ...R.magnet, xlabel: '축을 따른 x (cm)', ylabel: 'B (mT)', label: '자석 축을 따른 자기장', vlines: [[-10, 'S'], [10, 'N']],
        series: [{ pts: curve(x => M.magnetB([x / 100, 0, 0])[0] * 1000, -40, 40, 120) }] })}</div>
      <p class="hintline">자석을 클릭하면 N극 끝을 둘러싼 닫힌 상자가 나타난다. 격자 한 칸은 10 cm이다.</p>`,
    cam: { target: [STATIONS.magnet, 2.0, 0], az: -18, el: 20, dist: 20 }, lit: 'magnet', scene: 'magnet', look: {},
    fig: '자기력선은 N에서 나와 S로 돌아온다',
  },
  {
    kicker: '14.1', title: '자기력', sub: 'F = qv × B',
    body: `
      <p class="lede">자기장은 <b>움직이는</b> 전하에만, 그것도 옆으로 힘을 준다. <b>v</b>와 <b>B</b> 모두에 수직인 방향이다.</p>
      <div class="eq"><b>F</b> = <i>q</i> <b>v</b> × <b>B</b>, &nbsp; <i>F</i> = <i>qvB</i> sin θ</div>
      <p><b>오른손 법칙:</b> 엄지를 <b>v</b>, 검지를 <b>B</b> 방향으로 두면 가운뎃손가락이 + 전하가 받는 <b>F</b>의 방향이고, − 전하는 그 반대다. <b>B</b>를 따라 움직이면 힘이 없다.</p>
      <p><b>F</b> ⊥ <b>v</b>가 항상 성립하므로 <b>B</b>는 <b>일을 하지 않는다</b>. 전하의 방향은 바꾸지만 속력은 결코 바꾸지 않는다. <b>E</b>도 있으면 <b>F</b> = <i>q</i><b>E</b> + <i>q</i><b>v</b> × <b>B</b>(로런츠 힘)이다.</p>
      <div class="charts">${chart({ ...R.rhr, xlabel: 'v와 B 사이의 θ (°)', ylabel: 'F (10⁻¹⁴ N)', cursor: 'rhr', label: '각도에 따른 힘', series: [{ pts: curve(d => M.RHR.Fmax * Math.sin(d * Math.PI / 180) / 1e-14, 0, 180) }] })}</div>
      <p class="hintline">클릭하면 <b>v</b>가 <b>B</b>에 나란한 성분과 수직인 성분으로 나뉜다. <i>v</i> = ${sci(M.RHR.v, 1)} m/s, <i>B</i> = ${f(M.RHR.B)} T. <b>F</b>는 ${sci(M.RHR.Fmax, 1)} N일 때 1.5칸이다.</p>`,
    cam: { target: [STATIONS.rhr, 1.9, 0], az: -36, el: 22, dist: 17 }, lit: 'rhr', scene: 'rhr', look: {},
    fig: '속도가 같은 양성자와 전자',
  },
  {
    kicker: '14.2', title: '자기장 속 원운동', sub: 'r = mv/qB',
    body: `
      <p class="lede">균일한 <b>B</b>에 수직으로 움직이면 힘이 늘 속도에 수직이다. 이 힘이 구심력이 되어 전하는 일정한 속력으로 원을 그린다.</p>
      <div class="eq"><i>qvB</i> = <i>mv</i>²/<i>r</i> → <i>r</i> = <i>mv</i>/<i>qB</i>, &nbsp;ω = <i>qB</i>/<i>m</i></div>
      <p>양성자 두 개가 정지 상태에서 각각 50 V와 200 V로 가속된다(<i>q</i>Δ<i>V</i> = ½<i>mv</i>²이므로 50 eV와 200 eV). 에너지가 네 배면 속력이 두 배, 반지름도 두 배다: ${f(M.CYC.r[0] * 100)} cm와 ${f(M.CYC.r[1] * 100)} cm.</p>
      <p>그런데 <i>T</i> = 2π<i>m</i>/<i>qB</i> = ${f(M.CYC.T * 1e6, 3)} μs로 둘이 같아서, 한 바퀴마다 출발점에서 다시 만난다. <b>사이클로트론</b>은 이를 이용해 ${f(M.CYC.f / 1e6)} MHz로 틈을 건널 때마다 입자를 가속한다.</p>
      <div class="charts">${chart({ ...R.cyclo, xlabel: 'v (10⁵ m/s)', ylabel: 'r (cm)', label: '속력에 따른 반지름', series: [{ pts: curve(v => M.MP * v * 1e5 / (M.QE * M.CYC.B) * 100, 0, 2.5) }],
        marks: M.CYC.v.map((v, i) => [v / 1e5, M.CYC.r[i] * 100, `${M.CYC.dV[i]} V`]) })}</div>
      <p class="hintline">클릭하면 힘과 반지름이 보인다. <i>B</i> = ${f(M.CYC.B)} T, 아래 방향. 격자 한 칸은 1 cm이고, 시간은 ${slow(M.CYC.show / M.CYC.T)}배 느리게 흐른다.</p>`,
    cam: { target: [STATIONS.cyclo, 0.8, 0], az: -14, el: 40, dist: 17 }, lit: 'cyclo', scene: 'cyclo', look: {},
    fig: '속력 두 배, 반지름 두 배, 주기는 같다',
  },
  {
    kicker: '14.3', title: '서로 수직인 E와 B', sub: '속도 선택기',
    body: `
      <p class="lede">극판 사이의 <b>E</b>는 양성자를 <i>qE</i>로 − 극판 쪽으로 민다. 종이 안쪽으로 향하는 <b>B</b>는 <i>qvB</i>로 도로 민다. 두 힘은 한 속력에서 상쇄된다.</p>
      <div class="eq"><i>qE</i> = <i>qvB</i> &nbsp;→&nbsp; <i>v</i> = <i>E</i>/<i>B</i></div>
      <p>여기서 <i>E</i> = ${f(M.SEL.E, 0)} V/m, <i>B</i> = ${f(M.SEL.B, 3)} T이므로 ${sci(M.SEL.v0, 1)} m/s인 입자가 곧게 지나간다. 더 느리면 <i>qE</i>가 이겨 아래로 휘고, 더 빠르면 <i>qvB</i>가 이겨 위로 휜다.</p>
      <p><b>홀 효과</b>는 도선 속에서 같은 균형이 이루어지는 것이다. 전하가 한쪽 가장자리에 쌓여 <i>qE</i> = <i>qv</i><sub>d</sub><i>B</i>가 될 때까지 계속되고, 그 결과 Δ<i>V</i><sub>H</sub> = <i>v</i><sub>d</sub><i>Bd</i> = <i>IBd</i>/<i>nqA</i>가 남는다.</p>
      <div class="charts">${chart({ ...R.selector, zero: true, xlabel: 'v (10⁵ m/s)', ylabel: 'qvB − qE, 위쪽 (10⁻¹⁶ N)', label: '속력에 따른 알짜힘',
        series: [{ pts: curve(v => M.QE * (v * 1e5 * M.SEL.B - M.SEL.E) / 1e-16, 0, 2) }], marks: M.SEL.k.map((k, i) => [k, M.QE * M.SEL.E * (k - 1) / 1e-16, ['0.8', 'E/B', '1.25'][i], i === 1 ? -26 : 6, i === 1 ? -8 : 14]) })}</div>
      <p class="hintline">클릭하면 각 양성자에 작용하는 <i>q</i><b>E</b>와 <i>q</i><b>v</b> × <b>B</b>가 보인다. 격자 한 칸은 1 cm이다.</p>`,
    cam: { target: [STATIONS.selector + 0.4, 2.5, 0], az: -22, el: 13, dist: 31 }, lit: 'selector', scene: 'selector', look: {},
    fig: 'v = E/B인 입자만 곧게 통과한다',
  },
  {
    kicker: '14.4', title: '전류가 받는 힘', sub: '그리고 고리가 받는 돌림힘',
    body: `
      <p class="lede">전류는 움직이는 수많은 전하다. <i>I</i> = <i>nqAv</i><sub>d</sub>를 쓰면, 도선 속 전하 <i>nqAL</i>이 받는 힘은</p>
      <div class="eq"><b>F</b> = <i>I</i> <b>L</b> × <b>B</b></div>
      <p>균일한 자기장 속 고리에서는 변들이 받는 힘의 합이 0이지만, 세로 두 변은 서로 다른 작용선을 따라 반대로 밀린다. 그래서 고리가 비틀린다.</p>
      <div class="eq"><b>τ</b> = <b>μ</b> × <b>B</b>, &nbsp; <b>μ</b> = <i>I</i><b>A</b></div>
      <p>전기 쌍극자에서 <i>U</i> = −<b>p</b> · <b>E</b>인 것처럼 <i>U</i> = −<b>μ</b> · <b>B</b>이다. <b>B</b>와 같은 방향일 때 가장 낮고(안정), 반대 방향일 때 가장 높다(불안정). 여기서 μ = ${f(M.LOOP.mu, 2)} A·m²이다.</p>
      <div class="charts">${chart({ ...R.loop, zero: true, xlabel: 'μ와 B 사이의 θ (°)', ylabel: 'τ (N·m), U (J)', cursor: 'loop', label: '각도에 따른 돌림힘과 에너지',
        series: [{ pts: curve(d => M.LOOP.tmax * Math.sin(d * Math.PI / 180), 0, 180), tag: [80, M.LOOP.tmax, 'τ'] }, { cls: 'trend', pts: curve(M.loopU, 0, 180), tag: [150, M.loopU(150), 'U'] }] })}</div>
      <p class="hintline">고리는 모든 각도를 거치며 천천히 돌아간다. 클릭하면 각 변이 받는 힘이 보인다(1 N당 4칸).</p>`,
    cam: { target: [STATIONS.loop, 2.3, 0], az: -32, el: 16, dist: 20 }, lit: 'loop', scene: 'loop', look: {},
    fig: `${f(M.LOOP.a * 100, 0)} × ${f(M.LOOP.b * 100, 0)} cm, ${f(M.LOOP.I, 1)} A, B = ${f(M.LOOP.B)} T`,
  },
  {
    kicker: '14.5', title: '앙페르 법칙', sub: '긴 도선 주위의 B',
    body: `
      <p class="lede">긴 도선 주위의 자기력선은 원이다. 엄지를 <i>I</i> 방향으로 두면 감아쥔 손가락이 <b>B</b>의 방향이다.</p>
      <div class="eq">∮ <b>B</b> · d<b>s</b> = μ<sub>0</sub><i>I</i><sub>enc</sub></div>
      <p>원 위에서는 <b>B</b> ∥ d<b>s</b>이고 <i>B</i>가 일정하므로 <i>B</i>(2π<i>r</i>) = μ<sub>0</sub><i>I</i>, 곧 <i>B</i> = μ<sub>0</sub><i>I</i>/2π<i>r</i>이다. 굵은 도선 안에서는 <i>B</i> = μ<sub>0</sub><i>Ir</i>/2π<i>a</i>²이다.</p>
      <p>직사각형을 지나는 선속은 띠들을 더해 구한다: ∫<sub><i>a</i></sub><sup><i>a</i>+<i>c</i></sup> (μ<sub>0</sub><i>I</i>/2π<i>r</i>) <i>b</i> d<i>r</i>, 곧</p>
      <div class="eq">Φ = (μ<sub>0</sub><i>Ib</i>/2π) ln((<i>a</i> + <i>c</i>)/<i>a</i>)</div>
      <div class="charts">${chart({ ...R.ampere, xlabel: 'r (cm)', ylabel: 'B (μT)', cursor: 'ampere', label: '굵은 도선으로부터의 거리에 따른 자기장', vlines: [[1, 'a']],
        series: [{ pts: curve(r => M.ampereB(r / 100) * 1e6, 0, 15, 150) }] })}</div>
      <p class="hintline">도선을 클릭하면 d<b>s</b>가, 직사각형을 클릭하면 띠들이 보인다. <b>B</b>: 100 μT당 0.8칸.</p>`,
    cam: { target: [STATIONS.ampere + 0.7, 3.3, 0], az: 34, el: 21, dist: 24 }, lit: 'ampere', scene: 'ampere', look: {},
    fig: `긴 도선을 따라 위로 ${f(M.AMP.I, 0)} A`,
  },
  {
    kicker: '14.6', title: '비오-사바르 법칙', sub: '모든 조각을 더하기',
    body: `
      <p class="lede">대칭성이 없으면, 쿨롱 법칙으로 전하 조각들을 더하듯 도선의 모든 조각 d<b>l</b>이 만드는 자기장을 더한다. <b>r̂</b>은 d<b>l</b>에서 P를 향한다.</p>
      <div class="eq">d<b>B</b> = (μ<sub>0</sub><i>I</i>/4π) d<b>l</b> × <b>r̂</b> / <i>r</i>²</div>
      <p>고리의 축 위에서는 모든 d<b>l</b> ⊥ <b>r</b>이다. d<b>B</b>의 옆 방향 성분은 고리를 한 바퀴 돌며 상쇄되고, 축 방향 성분(cos θ = <i>R</i>/<i>r</i>)은 더해진다.</p>
      <div class="eq"><i>B</i> = μ<sub>0</sub><i>IR</i>² / 2(<i>R</i>² + <i>z</i>²)<sup>3/2</sup></div>
      <p>중심에서는 μ<sub>0</sub><i>I</i>/2<i>R</i> = ${uT(M.RING.Bc)} μT이다. 멀리서는 μ<sub>0</sub><i>IR</i>²/2<i>z</i>³으로, 쌍극자의 1/<i>z</i>³ 꼴이다.</p>
      <div class="charts">${chart({ ...R.ring, xlabel: '축을 따른 z (cm)', ylabel: 'B (μT)', cursor: 'ring', label: '고리 축을 따른 자기장',
        series: [{ cls: 'trend', pts: curve(z => M.ringFar(z / 100) * 1e6, 12, 36), tag: [24, 13, 'μ₀IR²/2z³'] }, { pts: curve(z => M.ringAxis(z / 100) * 1e6, 0, 36) }] })}</div>
      <p class="hintline">고리를 클릭하면 조각 d<b>l</b> ${M.RING.pieces}개와 각각의 d<b>B</b>가 보인다(5배 길게 그림). <b>B</b>: 20 μT당 1칸.</p>`,
    cam: { target: [STATIONS.ring + 1.0, 2.5, 0], az: -38, el: 14, dist: 22 }, lit: 'ring', scene: 'ring', look: {},
    fig: `R = ${f(M.RING.R * 100, 0)} cm, I = ${f(M.RING.I, 0)} A`,
  },
  {
    kicker: '14.7', title: '평행한 도선', sub: '같은 방향 전류는 끌어당긴다',
    body: `
      <p class="lede">각 도선은 다른 도선의 자기장 속에 있으므로 각각 <b>F</b> = <i>I</i> <b>L</b> × <b>B</b>를 받는다.</p>
      <div class="eq"><i>B</i><sub>1</sub> = μ<sub>0</sub><i>I</i><sub>1</sub>/2π<i>d</i> &nbsp;→&nbsp; <i>F</i>/<i>L</i> = μ<sub>0</sub><i>I</i><sub>1</sub><i>I</i><sub>2</sub>/2π<i>d</i></div>
      <p>각각 ${f(M.WIRES.I, 0)} A가 흐르고 ${f(M.WIRES.d * 100, 0)} cm 떨어져 있으면 1 m당 ${f(M.WIRES.FL * 1000)} mN이다. 전류가 <b>같은</b> 방향이면 끌어당기고, <b>반대</b> 방향이면 밀어낸다. 전하와는 거꾸로다.</p>
      <p>자기력선이 이를 보여 준다. 같은 방향 전류는 두 도선 사이에서 자기장이 상쇄되고(한가운데에서 <i>B</i> = 0), 바깥 자기력선이 두 도선을 함께 감싼다. 반대 방향 전류는 둘 사이에 자기장을 몰아넣는다.</p>
      <div class="charts">${chart({ ...R.wires, xlabel: 'd (cm)', ylabel: 'F/L (mN/m)', label: '간격에 따른 단위 길이당 힘',
        series: [{ pts: curve(d => M.MU0 * M.WIRES.I ** 2 / (2 * Math.PI * d / 100) * 1000, 2, 40) }], marks: [[M.WIRES.d * 100, M.WIRES.FL * 1000, `${f(M.WIRES.FL * 1000)} mN/m`]] })}</div>
      <p class="hintline">한 쌍을 클릭하면 각 도선이 다른 도선에게서 받는 자기장이 보인다. 힘: 1 mN/m당 2칸.</p>`,
    cam: { target: [(STATIONS.same + STATIONS.opposite) / 2, 2.0, 0], az: -10, el: 30, dist: 34 }, lit: 'same', scene: 'wires', look: {},
    fig: '같은 방향, 그다음 반대 방향',
  },
  {
    kicker: '14.8', title: '솔레노이드', sub: '그리고 토로이드: 균일한 자기장',
    body: `
      <p class="lede">고리를 여러 개 쌓으면 자기장이 안에서는 더해지고 바깥에서는 거의 상쇄된다. 이것이 <b>솔레노이드</b>다.</p>
      <p>절반이 안에 들어간 직사각형을 잡자. 안쪽 변만 기여하므로(양 끝 변에서는 <b>B</b> ⊥ d<b>s</b>, 바깥에서는 <i>B</i> ≈ 0) <i>BL</i> = μ<sub>0</sub><i>NI</i>이다. 1 m당 감은 수를 <i>n</i> = <i>N</i>/<i>L</i>이라 하면</p>
      <div class="eq"><i>B</i> = μ<sub>0</sub><i>nI</i> &nbsp;&nbsp; 토로이드: <i>B</i> = μ<sub>0</sub><i>NI</i>/2π<i>r</i></div>
      <p>여기서 μ<sub>0</sub><i>nI</i> = ${uT(M.SOL.B)} μT이다. 비오-사바르 합으로는 ${uT(SOLC)} μT가 나오는데, 이 코일의 길이가 반지름의 ${f(M.SOL.L / M.SOL.R, 1)}배밖에 안 되기 때문이다. 고리 모양으로 구부리면 <b>토로이드</b>가 된다. 안에서는 <i>B</i>(2π<i>r</i>) = μ<sub>0</sub><i>NI</i>이고, 구멍과 바깥에서는 0이다.</p>
      <div class="charts">${chart({ ...R.solenoid, xlabel: '축을 따른 x (cm)', ylabel: 'B (μT)', label: '솔레노이드 축을 따른 자기장', vlines: [[-20, '끝'], [20, '끝']],
        series: [{ cls: 'trend', pts: [[-20, M.SOL.B * 1e6], [20, M.SOL.B * 1e6]], tag: [-6, M.SOL.B * 1e6 + 6, 'μ₀nI'] }, { pts: curve(x => M.solB([x / 100, 0, 0])[0] * 1e6, -40, 40, 100) }] })}</div>
      <p class="hintline">솔레노이드를 클릭하면 앙페르 직사각형이, 토로이드를 클릭하면 내부가 보인다. <b>B</b>: 100 μT당 1칸.</p>`,
    cam: { target: [(STATIONS.solenoid + STATIONS.toroid) / 2 - 0.4, 1.8, 0], az: -10, el: 30, dist: 31 }, lit: 'solenoid', scene: 'solenoid', look: {},
    fig: `${M.SOL.N}회와 ${M.TOR.N}회 감음, ${f(M.SOL.I, 1)} A`,
  },
];

// ---------- click a scene: what it breaks into ----------
const deg = Math.PI / 180;
export const PLATES = {
  magnet: { text: `자석이 흐려지며 안쪽의 자기력선이 드러나고, N극 끝을 닫힌 상자가 둘러싼다. 자기력선은 상자의 바깥 면들로 나가고, 같은 자기력선이 자석을 가로지르는 면으로 다시 들어온다. 나가는 것과 들어오는 것이 상쇄된다. 홀로 있는 극은 없다.`,
    facts: () => [['나가는 선속', `${sci(MAGFLUX.out)} Wb`], ['들어오는 선속', `${sci(MAGFLUX.in)} Wb`], ['전체 ∮B·dA', `나가는 선속의 ${f(Math.abs(MAGFLUX.total / MAGFLUX.out) * 100, 3)}%: 0`], ['중심의 B', `${f(BC * 1000, 0)} mT`]] },
  rhr: { text: `<b>v</b>가 <b>B</b>에 나란한 성분과 수직인 성분(회색)으로 나뉜다. 수직 성분만 힘을 받는다: <i>F</i> = <i>qv</i><sub>⊥</sub><i>B</i> = <i>qvB</i> sin θ. <b>F</b>는 <b>v</b>와 <b>B</b> 모두에 ⊥이다. 음전하인 전자는 반대쪽으로 밀린다.`,
    facts: s => { const d = M.rhrAngle(s.clock), v = M.RHR.v; return [['θ', `${f(d, 0)}°`], ['B에 나란한 v', `${sci(Math.max(Math.abs(v * Math.cos(d * deg)), 1), 2)} m/s`], ['B에 수직인 v', `${sci(Math.max(v * Math.sin(d * deg), 1), 2)} m/s`], ['F = qv⊥B', `${sci(Math.max(M.RHR.Fmax * Math.sin(d * deg), 1e-30), 2)} N`], ['F가 한 일', '0']]; } },
  cyclo: { text: `힘(빨강)은 각 원의 중심을 향하고 <b>v</b>에 ⊥이므로 속력은 결코 변하지 않는다. 더 빠른 양성자는 더 큰 원이 필요하지만, 같은 시간에 한 바퀴를 돈다.`,
    facts: s => { const t = M.cycTime(s.clock) % M.CYC.T; return [['이번 바퀴의 t', `${f(t * 1e6, 3)} μs / ${f(M.CYC.T * 1e6, 3)} μs`], ['50 V 양성자가 받는 F', `${sci(M.QE * M.CYC.v[0] * M.CYC.B)} N`], ['200 V 양성자가 받는 F', `${sci(M.QE * M.CYC.v[1] * M.CYC.B)} N`], ['ω = qB/m', `${sci(M.CYC.omega)} rad/s`]]; } },
  selector: { text: `극판 사이의 각 양성자에는 모두 똑같은 <i>q</i><b>E</b>가 아래로, 속력에 따라 커지는 <i>q</i><b>v</b> × <b>B</b>가 위로 작용한다. 둘의 합(빨강)은 <i>v</i> = <i>E</i>/<i>B</i>일 때만 0이다. 일을 하는 것은 <b>E</b>뿐이므로, 느린 양성자는 − 극판 쪽으로 떨어지면서 빨라진다.`,
    facts: () => [['qE (셋 모두)', `${sci(M.QE * M.SEL.E)} N`], ['0.8 E/B에서 qvB', `${sci(0.8 * M.QE * M.SEL.E)} N`], ['E/B에서 qvB', `${sci(M.QE * M.SEL.E)} N`], ['1.25 E/B에서 qvB', `${sci(1.25 * M.QE * M.SEL.E)} N`]] },
  loop: { text: `각 변에 <b>F</b> = <i>I</i> <b>L</b> × <b>B</b>가 작용한다. 세로 변의 <b>F</b><sub>1</sub>과 <b>F</b><sub>3</sub>는 늘 <i>IbB</i>이지만 작용선이 달라서 고리를 비튼다. 위아래의 <b>F</b><sub>2</sub>와 <b>F</b><sub>4</sub>는 같은 작용선 위에서 크기가 같고 방향이 반대라, 고리를 늘이거나 누를 뿐이다. 구부러진 도선도 다르지 않다. 반지름 <i>R</i>인 반원은 ∫<i>I</i> d<b>s</b> × <b>B</b> = 2<i>IRB</i>를 받아, 곧은 현과 같다.`,
    facts: s => { const d = M.loopAngle(s.clock), S = M.loopSides(d); return [['θ', `${f(d, 0)}°`], ['F₁, F₃ (세로 변)', `각 ${f(M.len(S[0].F), 3)} N`], ['F₂, F₄ (위, 아래)', `각 ${f(M.len(S[1].F), 3)} N`], ['ΣF', '0 N'], ['τ = μB sin θ', `${f(M.len(M.loopTorque(d)), 4)} N·m`]]; } },
  ampere: { text: `앙페르 원을 조각 d<b>s</b>로 나눈다. 모든 조각에서 <b>B</b>는 d<b>s</b>와 같은 방향이고 크기도 같으므로, ∮<b>B</b> · d<b>s</b>는 그냥 <i>B</i> × 2π<i>r</i>이다. 원이 커지면 그만큼 <i>B</i>가 작아져서 합은 늘 μ<sub>0</sub><i>I</i>이다.`,
    facts: s => { const r = M.ampR(s.clock), B = M.ampereB(r); return [['r', `${f(r * 100, 1)} cm`], ['B', `${uT(B)} μT`], ['2πr', `${f(2 * Math.PI * r * 100, 1)} cm`], ['B · 2πr', `${sci(B * 2 * Math.PI * r)} T·m`], ['μ₀I', `${sci(M.MU0 * M.AMP.I)} T·m`]]; } },
  flux: { text: `직사각형을 폭 d<i>r</i>인 띠 ${M.FLUX.strips}개로 나눈다. 각 띠에서 <i>B</i>는 거의 일정하므로 띠 하나의 선속은 <i>B</i>(<i>r</i>) <i>b</i> d<i>r</i>이다. 가까운 띠일수록 선속이 크다. 이들을 모두 더한 것이 적분이다.`,
    facts: () => { const s = M.fluxStrips(); return [...s.map((x, i) => [`띠 ${i + 1} (r ${f((M.FLUX.a + (i + 0.5) * M.FLUX.c / M.FLUX.strips) * 100, 1)} cm)`, `${f(x * 1e9, 0)} nWb`]), ['합', `${f(s.reduce((a, b) => a + b, 0) * 1e9, 0)} nWb`], ['(μ₀Ib/2π) ln((a+c)/a)', `${f(M.FLUX.phi * 1e9, 0)} nWb`]]; } },
  ring: { text: `고리의 조각 d<b>l</b> 열두 개와, 각 조각이 P에 만드는 d<b>B</b>(회색). 각 d<b>B</b>는 d<b>l</b>과 <b>r</b> 모두에 ⊥이므로 모아 놓으면 원뿔을 이룬다. 고리를 한 바퀴 돌며 옆 방향 성분은 짝지어 상쇄되고, 축 방향 성분이 더해져 <b>B</b>가 된다.`,
    facts: s => { const z = M.ringZ(s.clock), p = M.ringPieces(z), one = M.len(p[0].dB); return [['z', `${f(z * 100, 1)} cm`], ['각 |dB|', `${f(one * 1e6, 2)} μT`], ['각 조각의 축 방향 성분', `${f(p[0].dB[0] * 1e6, 2)} μT`], [`${p.length}개의 합`, `${uT(p.reduce((a, q) => a + q.dB[0], 0))} μT`], ['μ₀IR²/2(R²+z²)^{3/2}', `${uT(M.ringAxis(z))} μT`]]; } },
  same: { text: `도선 2의 위치에서 도선 1의 자기장 <b>B</b><sub>1</sub>은 도선에 ⊥이다. <i>I</i><sub>2</sub><b>L</b> × <b>B</b><sub>1</sub>은 도선 1 쪽을 향한다. 반대쪽도 마찬가지여서, 크기가 같고 방향이 반대인 한 쌍의 힘이 된다.`,
    facts: () => [['도선 2에서의 B₁', `${uT(M.ampereB(M.WIRES.d))} μT`], ['각 도선의 F/L', `${f(M.WIRES.FL * 1000)} mN/m`], ['한가운데의 B', '0'], ['방향', '서로를 향해']] },
  opposite: { text: `<i>I</i><sub>2</sub>를 뒤집으면 <i>I</i><sub>2</sub><b>L</b> × <b>B</b><sub>1</sub>도 뒤집혀 도선들이 서로 밀어낸다. 이제 둘 사이에서는 두 자기장이 더해진다.`,
    facts: () => [['도선 2에서의 B₁', `${uT(M.ampereB(M.WIRES.d))} μT`], ['각 도선의 F/L', `${f(M.WIRES.FL * 1000)} mN/m`], ['한가운데의 B', `${uT(2 * M.ampereB(M.WIRES.d / 2))} μT`], ['방향', '서로 멀어지게']] },
  solenoid: { text: `감긴 도선이 흐려지며 안쪽 자기장이 드러난다. 거의 균일하고 거의 평행하다. 점선 앙페르 직사각형은 ${M.rectTurns()}회의 감음을 둘러싼다. ∮<b>B</b> · d<b>s</b>에 기여하는 것은 축을 따른 변뿐이다.`,
    facts: () => { const L = 2 * M.SOL_RECT.h, N = M.rectTurns(); return [['둘러싼 감은 수 N', `${N}`], ['안쪽 변, L', `${f(L * 100, 0)} cm`], ['μ₀NI / L', `${uT(M.MU0 * N * M.SOL.I / L)} μT`], ['모형에서 합산한 ∮B·ds', `${sci(M.lineIntegral(M.solB, M.rectPath(M.SOL_RECT.h, M.SOL_RECT.Y, 200)))} T·m`], ['μ₀NI', `${sci(M.MU0 * N * M.SOL.I)} T·m`]]; } },
  toroid: { text: `감긴 도선이 흐려진다. 점선 원이 구멍에서 심을 지나 바깥까지 숨 쉬듯 오간다. <b>B</b> 화살표는 원이 감긴 부분 안에 있을 때만 나타나는데, 이때 원은 ${M.TOR.N}회의 감음을 모두 한 번씩 둘러싼다.`,
    facts: s => { const r = M.torR(s.clock); return [['r', `${f(r * 100, 1)} cm`], ['둘러싼 전류', r > M.TOR.R0 - M.TOR.a && r < M.TOR.R0 + M.TOR.a ? `NI = ${f(M.TOR.N * M.TOR.I, 0)} A` : '0'], ['μ₀NI/2πr', `${uT(M.torIdeal(r))} μT`], ['모형에서', `${uT(M.len(M.torB([r, 0, 0])))} μT`]]; } },
};
