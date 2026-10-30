// Chapter 11, page by page (after the AP Physics C E&M organizer, Unit 3). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS as ST, SC } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const BLUE = '#3d63a8';
const uJ = J => f(J * 1e6, 3);

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label, zero = false, extra = '' }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" style="fill:none${s.color ? `;stroke:${s.color}` : ''}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}"${s.color ? ` style="fill:${s.color}"` : ''}>${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>
    ${zero ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/><text class="ax" x="${P.l - 6}" y="${sy(0) + 4}" text-anchor="end">0</text>` : ''}${paths}${mk}${extra}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(([key, color]) => `<circle class="cursor" r="4.5" data-cursor="${key}"${color ? ` style="fill:${color}"` : ''}/>`).join('')}
  </svg>`;
}
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// chart ranges, shared with the live cursors in main.js
export const R = {
  pair: { x0: 10, x1: 40, y0: -1, y1: 1 },
  square: { x0: 0, x1: 4.8, y0: 0, y1: 1.2 },
  uniform: { x0: 0, x1: 20, y0: -12, y1: 0 },
  hill: { x0: 0, x1: 0.4, y0: 0, y1: 200 },
  rod: { x0: 0, x1: 0.4, y0: 0, y1: 300 },
  ring: { x0: 0, x1: 0.25, y0: 0, y1: 250 },
  sphV: { x0: 0, x1: 0.4, y0: 0, y1: 300 },
  sphE: { x0: 0, x1: 0.4, y0: 0, y1: 2 },
  accel: { x0: 0, x1: 6, y0: 0, y1: 6 },
};

const Ulike = M.pair(M.PAIR.run, 1), Uunl = M.pair(M.PAIR.run, -1);
const steps = [0, 1, 2, 3].map(M.sqStep);
const dipAxis = M.VdipAxis(M.DIP.axisX), rodA = M.VrodAxis(0.1), rodB = M.VrodBis(M.ROD.bisA);
// split a sampled curve into the runs that stay inside ±lim (it blows up at each charge)
const runs = (pts, lim) => pts.reduce((out, p, i) => { if (Math.abs(p[1]) > lim || !isFinite(p[1])) return out; if (i && Math.abs(pts[i - 1][1]) <= lim && out.length) out.at(-1).push(p); else out.push([p]); return out; }, []);


export const PAGES = [
  {
    kicker: '11장', title: '전기 퍼텐셜 에너지', sub: '두 전하 사이에 저장된 일',
    body: `
      <p class="lede">어떤 전하를 같은 부호의 다른 전하 쪽으로 밀면 척력을 거슬러 일을 하게 된다. 그 일은 <b>전기 퍼텐셜 에너지</b>로 저장된다.</p>
      <div class="eq"><i>U</i> = <i>kq</i><sub>1</sub><i>q</i><sub>2</sub> / <i>r</i></div>
      <p>두 전하가 무한히 멀리 떨어져 있을 때 <i>U</i> = 0이다. +2 nC를 +4 nC로부터 ${M.PAIR.r0 * 100} cm 거리에서 ${M.PAIR.r1 * 100} cm 거리까지 데려오는 데 ${uJ(Ulike.W)} μJ이 든다. 부호가 반대인 전하는 서로 끌어당기므로 <i>U</i>가 <b>음수</b>이고, 가까워질수록 작아진다. <i>U</i>는 스칼라이며, 그 부호는 전하들의 부호가 정한다.</p>
      <div class="charts">${chart({ ...R.pair, zero: true, xlabel: '거리 r (cm)', ylabel: 'U (μJ)', cursors: [['pairL'], ['pairU', BLUE]], label: '같은 부호 쌍과 반대 부호 쌍의 거리에 따른 퍼텐셜 에너지',
        series: [{ pts: samples(60, 10, 40, r => M.Upair(M.PAIR.q1, M.PAIR.q2, r / 100) * 1e6), tag: [24, 0.38, '같은 부호: U > 0'] }, { color: BLUE, pts: samples(60, 10, 40, r => M.Upair(M.PAIR.q1, -M.PAIR.q2, r / 100) * 1e6), tag: [24, -0.18, '반대 부호: U < 0'] }] })}</div>
      <p class="hintline">클릭하면 경로를 단계별로 보여 준다. 각 단계는 <i>F</i>Δ<i>r</i>씩 더한다. 1칸 = 10 cm, 힘은 1 μN당 ${(SC.F * 10).toFixed(1)} cm.</p>`,
    cam: { target: [ST.pair + 0.2, 0.3, 0], az: -12, el: 32, dist: 16 }, lit: 'pair', scene: 'pair', look: {},
    fig: '가까워지는 같은 부호 쌍과 반대 부호 쌍',
  },
  {
    kicker: '11.1', title: '전하 모으기', sub: '모든 쌍을 더한다',
    body: `
      <p class="lede">전하 집단의 에너지는 전하들을 무한히 먼 곳에서 하나씩 데려오는 데 드는 일이다.</p>
      <table class="data">
        <tr><td><i>q</i><sub>1</sub></td><td>아직 아무것도 없음</td><td>0</td></tr>
        <tr><td><i>q</i><sub>2</sub></td><td><i>kq</i>²/<i>a</i></td><td>${uJ(steps[1])} μJ</td></tr>
        <tr><td><i>q</i><sub>3</sub></td><td><i>kq</i>²/<i>a</i> + <i>kq</i>²/√2<i>a</i></td><td>${uJ(steps[2])} μJ</td></tr>
        <tr><td><i>q</i><sub>4</sub></td><td>2<i>kq</i>²/<i>a</i> + <i>kq</i>²/√2<i>a</i></td><td>${uJ(steps[3])} μJ</td></tr>
      </table>
      <div class="eq"><i>U</i> = 4<i>kq</i>²/<i>a</i> + 2<i>kq</i>²/√2<i>a</i> = ${uJ(M.SQ.U)} μJ</div>
      <p>+2 nC 전하 네 개, <i>a</i> = ${M.SQ.a * 100} cm. 쌍은 여섯 개이며 순서는 상관없다.</p>
      <div class="charts">${chart({ ...R.square, xlabel: '시간 (s)', ylabel: '집단의 U (μJ)', cursors: [['square']], label: '전하가 도착함에 따라 변하는 집단의 에너지',
        series: [{ pts: samples(240, 0, M.SQ.run, t => M.square(t).U * 1e6) }] })}</div>
      <p class="hintline">정사각형을 클릭하면 여섯 쌍이 보인다.</p>`,
    cam: { target: [ST.square, 0.3, 0], az: -12, el: 40, dist: 15 }, lit: 'square', scene: 'square', look: {},
    fig: '전하 네 개, 쌍 여섯 개',
  },
  {
    kicker: '11.2', title: '전위', sub: '단위 전하당 에너지',
    body: `
      <p class="lede"><b>전위</b> <i>V</i>는 단위 전하당 퍼텐셜 에너지이며, 단위는 볼트(J/C)다. 그 자리에 놓인 전하 <i>q</i>는 <i>U</i> = <i>qV</i>를 가진다.</p>
      <div class="eq">Δ<i>V</i> = −∫<sub>A</sub><sup>B</sup> <b><i>E</i></b> · d<b><i>s</i></b></div>
      <p>각 걸음 d<b><i>s</i></b> 가운데 <b><i>E</i></b> 방향 성분만 의미가 있다. <i>E</i> = ${M.UNI.E} N/C일 때, A → B는 <b><i>E</i></b>를 가로지르므로 0을 더한다. B → C는 그 방향으로 0.2 m이므로 −${M.UNI.E} × 0.2 = <b>−10 V</b>이다. A → C로 곧장 가도 같다. <b><i>E</i></b> <b>방향으로</b> 움직이면 <i>V</i>가 낮아진다. 옅은 면들은 <b>등전위면</b>이며 <b><i>E</i></b>와 직각을 이룬다. <i>E</i> = 4<i>x</i>이면 −∫<sub>0</sub><sup>4</sup> 4<i>x</i> d<i>x</i> = ${M.VARY.dV} V이다.</p>
      <div class="charts">${chart({ ...R.uniform, xlabel: 'E 방향 거리 (cm)', ylabel: 'V (볼트)', cursors: [['uni']], label: '전기장 방향 거리에 따른 전위', series: [{ pts: [[0, 0], [20, -10]] }] })}</div>
      <p class="hintline">클릭하면 A → C를 걸음 d<b><i>s</i></b>로 나눈다. <b><i>E</i></b>: 25 N/C당 1칸.</p>`,
    cam: { target: [ST.uniform, 0.4, 0.2], az: -18, el: 34, dist: 19 }, lit: 'uniform', scene: 'uniform', look: {},
    fig: 'E = 50 N/C, A에서 C까지 10 V 낮아짐',
  },
  {
    kicker: '11.3', title: '전위 언덕', sub: 'V = kq/r, 그리고 E = −∇V',
    body: `
      <p class="lede">점전하 주위에서는 각 걸음의 지름 방향 성분만 의미가 있다. <b>r̂</b> · d<b><i>s</i></b> = d<i>r</i>:</p>
      <div class="eq">Δ<i>V</i> = −∫ <i>kq</i>/<i>r</i>² d<i>r</i> = <i>kq</i>(1/<i>r</i><sub>B</sub> − 1/<i>r</i><sub>A</sub>)</div>
      <p>무한히 먼 곳을 기준으로 <i>V</i> = <i>kq</i>/<i>r</i>이며, +1 nC에 대해 이를 높이로 그렸다. 원들은 30 V 간격의 등전위선으로, 언덕이 가파른 곳에서 촘촘해진다. <b><i>E</i></b>는 곧장 내리막 쪽을 가리키고 크기는 기울기와 같다. <b><i>E</i></b> = −∇<i>V</i>, 즉 <i>E</i> = −d<i>V</i>/d<i>r</i>이다.</p>
      <div class="charts">${chart({ ...R.hill, xlabel: '거리 r (m)', ylabel: 'V (볼트)', cursors: [['hill']], label: '거리에 따른 전위와 탐침 위치의 접선',
        series: [{ pts: samples(80, 0.045, 0.4, r => M.Vpoint(M.HILL.Q, r)) }], extra: `<path class="trend" style="fill:none" data-tangent="hill" d=""/>` })}</div>
      <p class="live" id="hilllive"></p>
      <p class="hintline">클릭하면 언덕이 지도에서 들어 올려진다. 높이: 60 V당 1칸(150 V 위는 둥글게 처리), <b><i>E</i></b>: kN/C당 1칸.</p>`,
    cam: { target: [ST.hill, 0.9, 0], az: -18, el: 30, dist: 25 }, lit: 'hill', scene: 'hill', look: {},
    fig: '높이 = 전위, 화살표는 내리막 방향',
  },
  {
    kicker: '11.4', title: '쌍극자', sub: '전위는 수처럼 더해진다',
    body: `
      <p class="lede">전위는 스칼라다. 전하가 여럿이면 각각의 <i>kq</i>/<i>r</i>를 부호와 함께 더하면 된다. 성분은 필요 없다.</p>
      <div class="eq"><i>V</i><sub>axis</sub> = −2<i>akq</i>/(<i>x</i>² − <i>a</i>²)</div>
      <p>이는 ${2 * M.DIP.a * 100} cm 떨어진 ±1 nC에 대한 <i>kq</i>/(<i>x</i> + <i>a</i>) − <i>kq</i>/(<i>x</i> − <i>a</i>)로, 언덕 옆에 우물이 있는 모양이다. ${M.DIP.axisX * 100} cm 바깥의 P에서 <i>V</i> = ${f(dipAxis, 1)} V이다. 수직이등분선 위의 모든 점은 두 전하에서 같은 거리에 있으므로 그곳에서 <i>V</i> = <b>0</b>이지만, <b><i>E</i></b>는 0이 아니다. 같은 부호의 두 전하라면 이등분선 위의 <i>V</i>는 0이 아니며, 가운데 점에서 가장 크다.</p>
      <div class="charts">${chart({ x0: -0.36, x1: 0.36, y0: -200, y1: 200, zero: true, xlabel: '축 위의 위치 (m)', ylabel: '축 위의 V (볼트)', label: '쌍극자 축을 따라 나타낸 전위',
        series: runs(samples(720, -0.36, 0.36, x => M.Vdip([x, 0, 0])), 200).map(pts => ({ pts })),
        marks: [[M.DIP.axisX, dipAxis, `P: ${f(dipAxis, 0)} V`, 6, 16]] })}</div>
      <p class="hintline">클릭하면 P와 P′에서 각 전하의 몫이 보인다. 높이: 60 V당 1칸. 파란색: 모형에서 추적한 전기력선.</p>`,
    cam: { target: [ST.dipole, 0, 0], az: -14, el: 30, dist: 24 }, lit: 'dipole', scene: 'dipole', look: {},
    fig: '언덕과 우물, 그 사이는 V = 0',
  },
  {
    kicker: '11.5', title: '대전된 막대', sub: '모든 dq를 더한다',
    body: `
      <p class="lede">퍼져 있는 전하를 조각 d<i>q</i>로 자르면 각 조각이 <i>k</i> d<i>q</i>/<i>r</i>씩 더한다. 이를 적분한다.</p>
      <table class="data eqs">
        <tr><td>λ = <i>Q</i>/<i>L</i>, d<i>q</i> = λ d<i>x</i></td><td>${f(M.ROD.lam * 1e9, 0)} nC/m</td></tr>
        <tr><td>축 위의 P: <i>k</i>λ ln((<i>a</i> + <i>L</i>)/<i>a</i>)</td><td>${f(rodA, 1)} V</td></tr>
        <tr><td>이등분선 위의 P′: <i>k</i>λ ln[(<i>L</i> + <i>s</i>)/(−<i>L</i> + <i>s</i>)]</td><td>${f(rodB, 1)} V</td></tr>
      </table>
      <p>${M.ROD.L * 100} cm에 걸친 +3 nC, 값은 <i>a</i> = 10 cm에서 구했다. ∫ d<i>x</i>/√(<i>x</i>² + <i>a</i>²) = ln(<i>x</i> + √(<i>x</i>² + <i>a</i>²))에서 <i>s</i> = √(<i>L</i>² + 4<i>a</i>²)이다. 멀리서 보면 막대는 점전하처럼 행동한다(점선).</p>
      <div class="charts">${chart({ ...R.rod, xlabel: '끝에서의 거리 a (m)', ylabel: 'P의 V (볼트)', cursors: [['rod']], label: '막대 축 위의 거리에 따른 전위',
        series: [{ pts: samples(60, 0.04, 0.4, M.VrodAxis), tag: [0.09, 175, '막대'] }, { cls: 'trend', pts: samples(60, 0.04, 0.4, a => M.K * M.ROD.Q / (a + M.ROD.L / 2)), tag: [0.2, 95, 'kQ/(a + L/2)'] }] })}</div>
      <p class="hintline">막대를 클릭하면 조각 d<i>q</i> 12개로 잘린다.</p>`,
    cam: { target: [ST.rod - 0.5, 1.6, 0], az: -12, el: 14, dist: 15 }, lit: 'rod', scene: 'rod', look: {},
    fig: 'λ = 10 nC/m, P는 축을 따라 움직인다',
  },
  {
    kicker: '11.6', title: '고리, 원호, 원판', sub: '모든 dq가 같은 거리에 있을 때',
    body: `
      <p class="lede">고리나 원호의 중심에서는 모든 d<i>q</i>가 같은 거리 <i>R</i>에 있으므로 <i>V</i><sub>c</sub> = (<i>k</i>/<i>R</i>)∫d<i>q</i> = <i>kQ</i>/<i>R</i>이다.</p>
      <table class="data eqs">
        <tr><td>고리, 축 위</td><td><i>kQ</i>/√(<i>R</i>² + <i>z</i>²)</td></tr>
        <tr><td>원판, d<i>q</i> = σ·2π<i>r</i> d<i>r</i></td><td>2π<i>k</i>σ(√(<i>R</i>² + <i>z</i>²) − <i>z</i>)</td></tr>
        <tr><td>원판 중심, σ = <i>Q</i>/π<i>R</i>²</td><td>2<i>kQ</i>/<i>R</i></td></tr>
      </table>
      <p>각각 +2 nC, <i>R</i> = ${M.RING.R * 100} cm. 고리와 반원 고리의 중심: ${f(M.Varc0, 1)} V. 원판 중심: ${f(M.Vdisc(0), 1)} V로 두 배인데, 같은 전하가 더 가까이 있기 때문이다.</p>
      <div class="charts">${chart({ ...R.ring, xlabel: '축 방향 거리 z (m)', ylabel: 'V (볼트)', cursors: [['ring'], ['disc', BLUE]], label: '고리와 원판의 축 위 전위',
        series: [{ color: BLUE, pts: samples(60, 0, 0.25, M.Vdisc), tag: [0.1, 160, '원판'] }, { pts: samples(60, 0, 0.25, M.Vring), tag: [0.1, 70, '고리'] }, { cls: 'trend', pts: samples(40, 0.075, 0.25, z => M.K * M.RING.Q / z), tag: [0.17, 112, 'kQ/z'] }] })}</div>
      <p class="hintline">고리, 원호, 원판을 클릭하면 조각 d<i>q</i>로 나뉜다.</p>`,
    cam: { target: [ST.ring - 1.4, 1.8, 0], az: -32, el: 12, dist: 29 }, lit: 'ring', scene: 'ring', look: {},
    fig: '중심에서 kQ/R, P는 축 위 바깥쪽',
  },
  {
    kicker: '11.7', title: '대전된 구', sub: '도체와 부도체',
    body: `
      <p class="lede">가우스 법칙으로 각 영역의 <b><i>E</i></b>를 구한 다음, 무한히 먼 곳에서 걸어 들어온다. 바깥은 ∞ → <i>R</i>, 안쪽은 <i>R</i> → <i>r</i>.</p>
      <p>바깥에서는 둘 다 점전하처럼 행동하여 <i>V</i> = <i>kQ</i>/<i>r</i>이다. <b>도체</b> 안에서는 <i>E</i> = 0이므로 <i>V</i>는 <i>kQ</i>/<i>R</i> = ${f(M.Vcond(0), 1)} V로 일정하다. <b>부도체</b> 안에서는 <i>E</i> = <i>kQr</i>/<i>R</i>³이 계속 더해진다.</p>
      <div class="eq"><i>V</i> = (<i>kQ</i>/<i>R</i>)(3/2 − <i>r</i>²/2<i>R</i>²)</div>
      <p>중심에서 3<i>kQ</i>/2<i>R</i> = ${f(M.Vins(0), 1)} V(+2 nC, <i>R</i> = ${M.SPH.R * 100} cm). <i>V</i>는 결코 불연속적으로 뛰지 않는다.</p>
      <div class="charts">${chart({ ...R.sphV, xlabel: 'r (m)', ylabel: 'V (볼트)', cursors: [['sphVc'], ['sphVi', BLUE]], label: '두 구의 r에 따른 전위',
        series: [{ color: BLUE, pts: samples(120, 0, 0.4, M.Vins), tag: [0.11, 215, '부도체'] }, { pts: samples(120, 0, 0.4, M.Vcond), tag: [0.13, 150, '도체'] }] })}</div>
      <p class="hintline">구를 클릭하면 경로를 따라 <b><i>E</i></b>가 보인다. 막대: 150 V당 1칸, <b><i>E</i></b>: 2.5 kN/C당 1칸.</p>`,
    cam: { target: [ST.spheres, 1.8, 0], az: -8, el: 10, dist: 27 }, lit: 'conductor', scene: 'spheres', look: {},
    fig: '40 cm에서 걸어 들어오기',
  },
  {
    kicker: '11.8', title: '전자볼트', sub: '전위차에서 얻는 에너지',
    body: `
      <p class="lede">전하를 놓아주면 퍼텐셜 에너지가 운동 에너지로 바뀌고, 역학적 에너지는 보존된다.</p>
      <div class="eq"><i>qV</i><sub>0</sub> = <i>qV</i><sub>f</sub> + ½<i>mv</i>²  →  <i>v</i> = √(2<i>q</i>Δ<i>V</i>/<i>m</i>)</div>
      <p>양성자는 <b><i>E</i></b>를 따라 7 V에서 1 V로 “내리막”을 구르고, 전자는 반대 방향으로 간다. 둘 다 ${M.ACC.dV} <b>eV</b>를 얻지만(1 eV = ${M.E_CH.toExponential(2).replace('e-', ' × 10⁻')} J, <i>e</i> 하나가 1 V를 지날 때), 전자는 ${Math.round(M.M_P / M.M_E)}배 가볍다.</p>
      <table class="data">
        <tr><th></th><th>양성자</th><th>전자</th></tr>
        <tr><td>나중 속력</td><td>${f(M.ACC.vp / 1000, 1)} km/s</td><td>${f(M.ACC.ve / 1e6, 2)} × 10⁶ m/s</td></tr>
        <tr><td>6 cm를 건너는 시간</td><td>${f(M.ACC.Tp * 1e6, 2)} μs</td><td>${f(M.ACC.Te * 1e9, 0)} ns</td></tr>
      </table>
      <div class="charts">${chart({ ...R.accel, xlabel: '7 V 판으로부터의 거리 (cm)', ylabel: 'K (eV)', cursors: [['accP'], ['accE', BLUE]], label: '양성자와 전자의 위치에 따른 운동 에너지',
        series: [{ pts: [[0, 0], [6, 6]], tag: [3.6, 3.0, '양성자 →'] }, { color: BLUE, pts: [[6, 0], [0, 6]], tag: [0.5, 3.4, '← 전자'] }] })}</div>
      <p class="hintline">둘 다 ${M.ACC.run} s에 건너도록 느리게 보여 준다. 클릭하면 힘과 연속 사진이 보인다. 1칸 = 1 cm, <b><i>E</i></b>: 50 V/m당 1칸.</p>`,
    cam: { target: [ST.accel, 2.3, 0], az: -16, el: 10, dist: 21 }, lit: 'accel', scene: 'accel', look: {},
    fig: '6 V 내려가고 6 V 올라가며 각각 6 eV',
  },
];

// ---------- click a scene: what it breaks into ----------
const pairFacts = s => { const a = M.pair(s.pair.t, 1), b = M.pair(s.pair.t, -1);
  return [['거리 r', `${f(a.r * 100, 1)} cm`], ['같은 부호: +2 nC에 작용하는 F', `${f(a.F * 1e6)} μN, 미는 방향`], ['같은 부호: U', `${uJ(a.U)} μJ`], ['같은 부호: 지금까지 한 일', `${uJ(a.W)} μJ`], ['반대 부호: U', `${uJ(b.U)} μJ`], ['반대 부호: 지금까지 한 일', `${uJ(b.W)} μJ`]]; };
export const PLATES = {
  pair: { text: `잔상이 5 cm 간격으로 경로를 표시하고, 각 위치의 전기력을 함께 보여 준다. 힘은 1/<i>r</i>²로 커지므로 걸음마다 앞 걸음보다 일이 더 든다. 그 합 −∫<i>F</i> d<i>r</i>가 <i>U</i>의 변화량이다. 같은 부호 쌍은 힘을 거슬러 밀어야 하고(양의 일), 반대 부호 쌍은 힘이 끌어당기므로 붙잡아 두어야 한다(음의 일).`, facts: pairFacts },
  square: { text: `여섯 연결선이 여섯 쌍이다. 각 쌍은 <i>kq</i>²/<i>r</i>를 저장한다. 네 변은 <i>r</i> = <i>a</i>, 두 대각선은 √2<i>a</i>이다. 이들의 합이 집단의 에너지다.`,
    facts: s => { const st = M.square(s.square.t); return [['배치된 전하', `${st.n}/4`], ['현재 U', `${uJ(st.U)} μJ`], ['변 하나 kq²/a', `${uJ(M.K * M.SQ.q ** 2 / M.SQ.a)} μJ`], ['대각선 하나 kq²/√2a', `${uJ(M.K * M.SQ.q ** 2 / (Math.SQRT2 * M.SQ.a))} μJ`], ['여섯 쌍 모두', `${uJ(M.SQ.U)} μJ`]]; } },
  uniform: { text: `A → C를 네 걸음 d<b><i>s</i></b>(검은색)로 나눴다. <b><i>E</i></b> 방향인 회색 성분 d<i>x</i>만 의미가 있다. <b><i>E</i></b> · d<b><i>s</i></b> = <i>E</i> d<i>x</i>. 5 cm씩 네 걸음마다 전위가 2.5 V씩 낮아진다. 각 걸음의 옆 방향 성분은 등전위면을 따라가므로 아무것도 더하지 않는다. 그래서 경로가 상관없다.`,
    facts: s => { const r = M.uniPath(s.uniform.t); return [['각 걸음: −E dx', `−${M.UNI.E} × 0.05 = −2.5 V`], ['A → C, 네 걸음', '−10.00 V'], ['전하 위치', `x = ${f(r.p[0] * 100, 1)} cm`], ['그곳의 V', `${f(r.V)} V`], ['U = qV (q = +1 nC)', `${f(r.U * 1e9)} nJ`]]; } },
  hill: { text: `곡면이 바닥 지도에서 들어 올려진다. 각 등고선 고리는 자신의 등전위 원 위로 떨어진다. 등전위선은 언덕을 도는 수평한 길이다. 파란 <b><i>E</i></b> 화살표는 원과 직각으로 교차하며 내리막을 가리키고, 원이 촘촘한 곳에서 가장 길다.`,
    facts: s => { const r = M.hillProbe(s.clock); return [['탐침 위치 r', `${f(r * 100, 1)} cm`], ['V = kq/r', `${f(M.Vpoint(M.HILL.Q, r), 1)} V`], ['E = kq/r²', `${f(M.Epoint(M.HILL.Q, r), 0)} N/C`], ['기울기 −dV/dr', `${f(M.Epoint(M.HILL.Q, r), 0)} V/m`]]; } },
  dipole: { text: `각 점에서 빨간 막대는 +1 nC의 <i>kq</i>/<i>r</i>, 파란 막대는 −1 nC의 값, 검은 막대는 그 합이다. 축 위에서는 가까운 −q가 이긴다. 이등분선 위의 P′에서는 둘이 정확히 상쇄되어 <i>V</i> = 0이고, 검은 막대가 사라진다.`,
    facts: () => { const a = M.DIP.axisX, z = M.DIP.bisZ, v1 = M.Vpoint(M.DIP.q, a + M.DIP.a), v2 = M.Vpoint(-M.DIP.q, a - M.DIP.a), w = M.Vpoint(M.DIP.q, Math.hypot(M.DIP.a, z));
      return [['P: +q의 몫', `${f(v1, 1)} V`], ['P: −q의 몫', `${f(v2, 1)} V`], ['P: 합계', `${f(v1 + v2, 1)} V`], ['P′: ±q 각각', `±${f(w, 1)} V`], ['P′: 합계', '0 V']]; } },
  rod: { text: `막대를 d<i>q</i> = λΔ<i>x</i> = 0.25 nC인 조각 ${12}개로 나눴고, 각 조각은 점전하다. 모든 조각이 P와 P′에 <i>k</i> d<i>q</i>/<i>r</i>를 보낸다. 선들은 그 거리 <i>r</i>이다. 조각 12개만으로도 적분값에 가깝다.`,
    facts: s => { const a = M.rodProbe(s.clock); return [['P: 거리 a', `${f(a * 100, 1)} cm`], ['P: kλ ln((a+L)/a)', `${f(M.VrodAxis(a), 1)} V`], ['P: 조각 12개의 합', `${f(M.rodSum(12, [-a, 0, 0]), 1)} V`], ['P′: 닫힌 식', `${f(rodB, 1)} V`], ['P′: 조각 12개의 합', `${f(M.rodSum(12, [M.ROD.L / 2, 0, -M.ROD.bisA]), 1)} V`]]; } },
  ring: { text: `0.125 nC 조각 16개가 모두 P에서 같은 거리 √(<i>R</i>² + <i>z</i>²)에 있으므로, 합은 그냥 <i>kQ</i>를 그 거리로 나눈 값이다.`,
    facts: s => { const z = M.axisProbe(s.clock); return [['P 위치 z', `${f(z * 100, 1)} cm`], ['각 조각까지 거리', `${f(Math.hypot(M.RING.R, z) * 100, 1)} cm`], ['kQ/√(R² + z²)', `${f(M.Vring(z), 1)} V`], ['조각 16개의 합', `${f(M.ringSum(16, z), 1)} V`]]; } },
  arc: { text: `반원 고리, 0.25 nC 조각 8개가 모두 중심 C에서 ${M.ARC.R * 100} cm 떨어져 있다. 원호가 얼마나 펼쳐졌는지는 상관없고 전체 전하만 중요하다. <i>V</i><sub>c</sub> = <i>kQ</i>/<i>R</i>. (C에서의 전기장은 모양에 따라 달라지지만, 전위는 그렇지 않다.)`,
    facts: () => [['조각 하나', `k(0.25 nC)/0.15 m = ${f(M.Varc0 / 8, 2)} V`], ['조각 8개', `${f(M.arcSum(8), 1)} V`], ['kQ/R', `${f(M.Varc0, 1)} V`]] },
  disc: { text: `고리 다섯 개를 떼어 놓았다. 각각은 전하 d<i>q</i> = σ · 2π<i>r</i> d<i>r</i>인 고리로, P에서 √(<i>r</i>² + <i>z</i>²) 떨어져 있다. 바깥 고리일수록 전하가 많지만 더 멀리 있다. 이들을 더하는 것이 <i>r</i>에 대한 적분이다.`,
    facts: s => { const z = M.axisProbe(s.clock); return [['P 위치 z', `${f(z * 100, 1)} cm`], ['σ', `${f(M.DISC.sigma * 1e9, 1)} nC/m²`], ['2πkσ(√(R² + z²) − z)', `${f(M.Vdisc(z), 1)} V`], ['고리 5개의 합', `${f(M.discSum(5, z), 1)} V`]]; } },
  conductor: { text: `두 구간으로 걸어 들어온다. ∞에서 <i>R</i>까지 전기장은 <i>kQ</i>/<i>r</i>²(파란색)이고 <i>V</i>는 <i>kQ</i>/<i>R</i>까지 올라간다. 안쪽은 <i>E</i> = 0이다. 화살표가 없고 더할 것도 없으므로 <i>V</i>는 평평하게 유지된다. 도체 전체가 하나의 등전위다.`,
    facts: s => { const r = M.sphProbe(s.spheres.t); return [['탐침 위치 r', `${f(r * 100, 1)} cm`], ['그곳의 E', `${f(M.Econd(r), 0)} N/C`], ['그곳의 V', `${f(M.Vcond(r), 1)} V`], ['∞ → R에서 더해짐', `${f(M.Vcond(M.SPH.R), 1)} V`], ['R → 0에서 더해짐', '0 V']]; } },
  insulator: { text: `같은 경로다. 바깥에서는 같은 <i>kQ</i>/<i>r</i>² 전기장이다. 안쪽에서는 전기장이 중심으로 갈수록 <i>kQr</i>/<i>R</i>³로 줄어들지만(<i>r</i> 안쪽의 전하만 의미가 있다) 0은 아니므로, <i>V</i>는 계속 올라가 중심에서 <i>kQ</i>/2<i>R</i>만큼 더 커진다.`,
    facts: s => { const r = M.sphProbe(s.spheres.t); return [['탐침 위치 r', `${f(r * 100, 1)} cm`], ['그곳의 E', `${f(M.Eins(r), 0)} N/C`], ['그곳의 V', `${f(M.Vins(r), 1)} V`], ['∞ → R에서 더해짐', `${f(M.Vins(M.SPH.R), 1)} V`], ['R → 0에서 더해짐', `${f(M.Vins(0) - M.Vins(M.SPH.R), 1)} V`]]; } },
  accel: { text: `둘에 같은 크기의 힘 <i>eE</i>가 반대 방향으로 작용한다. 양전하는 <b><i>E</i></b> 방향으로, 음전하는 반대 방향으로 밀린다. 같은 시간 간격의 연속 사진은 각각이 빨라질수록 간격이 벌어진다. 같은 힘이 같은 거리에 걸쳐 작용하므로 일도 같아서, 각각 6 eV다.`,
    facts: s => { const u = s.accel.t / M.ACC.run, p = M.accel(u, 'p'), e = M.accel(u, 'e');
      return [['각각에 작용하는 힘 eE', `${(M.E_CH * M.ACC.E).toExponential(2)} N`], ['양성자: V, K', `${f(p.V)} V, ${f(M.eV(p.K))} eV`], ['양성자: v', `${f(p.v / 1000, 1)} km/s`], ['전자: V, K', `${f(e.V)} V, ${f(M.eV(e.K))} eV`], ['전자: v', `${f(e.v / 1e6, 3)} × 10⁶ m/s`]]; } },
};
