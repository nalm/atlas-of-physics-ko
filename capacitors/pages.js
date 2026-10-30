// Chapter 12, page by page (after the AP Physics C E&M organizer, Unit 4). Text and a chart on
// the left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS as ST } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const pF = c => f(c * 1e12, 1);
const BLUE = '#3d63a8', GREY = '#86868c';

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label, under = '' }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}"${s.color ? ` style="stroke:${s.color}"` : ''} d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}"${s.color ? ` style="fill:${s.color}"` : ''}>${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    ${under}<rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(([key, color]) => `<circle class="cursor" r="4.5" data-cursor="${key}"${color ? ` style="fill:${color}"` : ''}/>`).join('')}
  </svg>`;
}
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
const area = (R, pts) => `<path d="M${CH.sx(pts[0][0], R.x0, R.x1)},${CH.sy(0, R.y0, R.y1)}${pts.map(([x, y]) => `L${CH.sx(x, R.x0, R.x1).toFixed(1)},${CH.sy(y, R.y0, R.y1).toFixed(1)}`).join('')}L${CH.sx(pts[pts.length - 1][0], R.x0, R.x1)},${CH.sy(0, R.y0, R.y1)}Z" style="fill:#dfe7f6;stroke:none"/>`;

// chart ranges, shared with the live cursors in main.js
export const R = {
  charge: { x0: 0, x1: 100, y0: 0, y1: 800 },
  gap: { x0: 0, x1: 10, y0: 0, y1: 20 },
  sph: { x0: 0, x1: 25, y0: 0, y1: 2500 },
  cyl: { x0: 0, x1: 10, y0: 0, y1: 5000 },
  fill: { x0: 0, x1: 800, y0: 0, y1: 120 },
  slab: { x0: 0, x1: 1, y0: 0, y1: 2500 },
  energy: { x0: 0, x1: 1, y0: 0, y1: 3.5 },
  probe: { x0: -28, x1: 28, y0: 0, y1: 3500 },
};
const RS = R.sph, RC = R.cyl;
const sphCurve = samples(120, 0, 25, r => M.sphE(r / 100)), cylCurve = samples(200, 0, 10, r => M.cylE(r / 100));
const S = M.SER, PA = M.PAR, u = x => (x * 1e6).toFixed(0);


// a bar chart of the charge on each capacitor, series against parallel
const qBars = (() => {
  const bars = [['C₁', S.Q1, 0], ['C₂', S.Q2, 1], ['C₁', PA.Q1, 3], ['C₂', PA.Q2, 4]], base = 140, top = 24, max = 40e-6, bw = 46, x0 = 70;
  return `<svg class="chart" viewBox="0 0 ${W} ${H + 10}" role="img" aria-label="직렬과 병렬에서 각 축전기의 전하">
    <line class="zero" x1="${x0 - 20}" x2="${x0 + 5.6 * (bw + 16)}" y1="${base}" y2="${base}"/>
    ${bars.map(([n, q, i]) => { const h = (base - top) * q / max, x = x0 + i * (bw + 16); return `<rect class="bar" x="${x}" y="${base - h}" width="${bw}" height="${h}"/><text class="ax" x="${x + bw / 2}" y="${base - h - 6}" text-anchor="middle">${u(q)} µC</text><text class="lab" x="${x + bw / 2}" y="${base + 16}" text-anchor="middle">${n}</text>`; }).join('')}
    <text class="ax" x="${x0 + (bw + 16) - 8}" y="${base + 32}" text-anchor="middle">직렬: Q가 같다</text>
    <text class="ax" x="${x0 + 3.5 * (bw + 16) + bw / 2}" y="${base + 32}" text-anchor="middle">병렬: Q가 더해진다</text>
  </svg>`;
})();

const dielTable = `<table class="data">${[0, 2, 4, 6].map(i => `<tr><td>${M.DIELECTRICS[i][0]}</td><td>${M.DIELECTRICS[i][1]}</td><td>${M.DIELECTRICS[i + 1][0]}</td><td>${M.DIELECTRICS[i + 1][1]}</td></tr>`).join('')}</table>`;
const full = { iso: M.slab(1, false), con: M.slab(1, true) };

const steps = rows => `<table class="data eqs">${rows.map(([e, n]) => `<tr><td>${e}</td><td>${n}</td></tr>`).join('')}</table>`;

export const PAGES = [
  {
    kicker: '12장', title: '축전기', sub: '떼어 놓은 전하',
    body: `
      <p class="lede"><b>축전기</b>는 서로 떨어진 두 도체다. 전지가 한쪽에서 다른 쪽으로 전하를 옮기면 +<i>Q</i>와 −<i>Q</i>가 남고 그 사이에 전기장이 생긴다.</p>
      <p>전압을 두 배로 하면 전하도 두 배가 된다. 그 비인 <b>전기 용량</b>은 변하지 않는다.</p>
      <div class="eq"><i>C</i> = <i>Q</i> / Δ<i>V</i></div>
      <p>단위는 패럿(1 F = 1 C/V)이며 결코 음수가 아니다. 전기 용량은 오직 <b>기하학적 구조</b>와 틈을 채운 물질에만 달려 있다. 이 판들은 한 변이 20 cm인 정사각형이고 5 cm 떨어져 있다. <i>C</i> = ${pF(M.C0)} pF.</p>
      <div class="charts">${chart({ ...R.charge, xlabel: 'ΔV (V)', ylabel: 'Q (pC)', cursors: [['charge']], label: '전압에 따른 전하: 기울기가 C인 직선',
        series: [{ pts: [[0, 0], [100, M.Q0 * 1e12]], tag: [58, M.C0 * 58e12 - 190, `기울기 = C = ${pF(M.C0)} pF`] }] })}</div>
      <p class="hintline">± 쌍마다 전기력선 하나. 판을 클릭해 보자. 실제 비율로 그렸다.</p>`,
    cam: { target: [ST.plates, 1.4, 0], az: 24, el: 16, dist: 10.5 }, lit: 'plates', scene: 'plates', look: {},
    fig: '전지 전압을 올렸다 내렸다',
  },
  {
    kicker: '12.1', title: '평행판', sub: '가우스 법칙, 다음은 ΔV, 그다음 C',
    body: `
      <p class="lede">언제나 세 단계다. 가우스 법칙으로 <i>E</i>, 적분으로 Δ<i>V</i>, 그리고 <i>C</i> = <i>Q</i>/Δ<i>V</i>.</p>
      ${steps([
        ['<i>EA</i> = σ<i>A</i>/ε<sub>0</sub>', '원통형 가우스 면'],
        ['<i>E</i> = σ/ε<sub>0</sub> = <i>Q</i>/ε<sub>0</sub><i>A</i>', '균일'],
        ['Δ<i>V</i> = −∫<sub><i>d</i></sub><sup>0</sup> <i>E ds</i> = <i>Ed</i>', 'E 일정'],
        ['<i>C</i> = <i>Q</i>/Δ<i>V</i> = <b>ε<sub>0</sub><i>A</i>/<i>d</i></b>', 'Q가 약분됨'],
      ])}
      <p>틈이 바뀌는 동안 <i>Q</i>는 고정되어 있다. <i>E</i>는 ${f(M.E0, 0)} V/m로 유지되고, Δ<i>V</i> = <i>Ed</i>는 커지며, <i>C</i>는 1/<i>d</i>로 줄어든다.</p>
      <div class="charts">${chart({ ...R.gap, xlabel: '간격 d (cm)', ylabel: 'C (pF)', cursors: [['gap']], label: '간격에 따른 전기 용량',
        series: [{ pts: samples(80, 1.8, 10, d => M.cPlate(M.PLATE.A, d / 100) * 1e12) }] })}</div>
      <p class="hintline">원통형 가우스 면을 클릭하면 꺼내 보인다.</p>`,
    cam: { target: [ST.pillbox, 1.45, 0], az: 24, el: 15, dist: 11 }, lit: 'pillbox', scene: 'gap', look: {},
    fig: '같은 전하, 바뀌는 간격',
  },
  {
    kicker: '12.2', title: '두 구', sub: '껍질 속의 공',
    body: `
      <p class="lede">껍질(<i>b</i> = ${M.SPH.b * 100} cm, −<i>Q</i>) 속의 공(<i>a</i> = ${M.SPH.a * 100} cm, +<i>Q</i>)을 반으로 잘랐다.</p>
      ${steps([
        ['<i>E</i>·4π<i>r</i><sup>2</sup> = <i>Q</i>/ε<sub>0</sub>', '가우스, a < r < b'],
        ['Δ<i>V</i> = −∫<sub><i>b</i></sub><sup><i>a</i></sup> <i>Q dr</i>/4πε<sub>0</sub><i>r</i><sup>2</sup>', 'E·ds = E dr'],
        ['&nbsp;&nbsp;&nbsp;&nbsp;= <i>Q</i>(<i>b</i> − <i>a</i>)/4πε<sub>0</sub><i>ab</i>', ''],
        ['<i>C</i> = <b>4πε<sub>0</sub><i>ab</i>/(<i>b</i> − <i>a</i>)</b>', `${pF(M.SPH.C)} pF`],
      ])}
      <p><i>b</i> → ∞이면 <i>C</i> → 4πε<sub>0</sub><i>a</i>로, 홀로 있는 구가 된다. 색칠한 부분: Δ<i>V</i> = ${M.V0} V.</p>
      <div class="charts">${chart({ ...RS, xlabel: 'r (cm)', ylabel: 'E (V/m)', cursors: [['sph']], label: '반지름에 따른 전기장, 틈 바깥에서는 0', under: area(RS, sphCurve.filter(([r]) => r >= 10 && r <= 20)), series: [{ pts: sphCurve }] })}</div>
      <p class="hintline">클릭하면 껍질이 열린다. 화살표는 kV/m당 2 cm.</p>`,
    cam: { target: [ST.sphere, 2.2, 0], az: 14, el: 12, dist: 17 }, lit: 'sphere', scene: 'sphere', look: {},
    fig: '두 껍질 사이에서 E ∝ 1/r²',
  },
  {
    kicker: '12.3', title: '두 원통', sub: '관 속의 막대',
    body: `
      <p class="lede">길이 <i>L</i> = ${M.CYL.L * 100} cm인 관(<i>b</i> = ${M.CYL.b * 100} cm) 속의 막대(<i>a</i> = ${M.CYL.a * 100} cm), 즉 짧은 동축 케이블이다.</p>
      ${steps([
        ['<i>E</i>·2π<i>rL</i> = <i>Q</i>/ε<sub>0</sub>', '가우스, 옆면만'],
        ['Δ<i>V</i> = −∫<sub><i>b</i></sub><sup><i>a</i></sup> <i>Q dr</i>/2πε<sub>0</sub><i>rL</i>', 'E·ds = E dr'],
        ['&nbsp;&nbsp;&nbsp;&nbsp;= (<i>Q</i>/2πε<sub>0</sub><i>L</i>) ln(<i>b</i>/<i>a</i>)', '∫dr/r = ln r'],
        ['<i>C</i> = <b>2πε<sub>0</sub><i>L</i>/ln(<i>b</i>/<i>a</i>)</b>', `${pF(M.CYL.C)} pF`],
      ])}
      <p><i>E</i> ∝ 1/<i>r</i>로 1/<i>r</i><sup>2</sup>보다 완만하므로 로그가 나온다. <i>C</i>는 길이에 비례한다. 1 m당 ${f(M.CYL.C / M.CYL.L * 1e12, 0)} pF.</p>
      <div class="charts">${chart({ ...RC, xlabel: 'r (cm)', ylabel: 'E (V/m)', cursors: [['cyl']], label: '동축 원통의 반지름에 따른 전기장', under: area(RC, cylCurve.filter(([r]) => r >= 2 && r <= 8)), series: [{ pts: cylCurve }] })}</div>
      <p class="hintline">클릭하면 관이 미끄러져 빠진다. 화살표는 kV/m당 1 cm.</p>`,
    cam: { target: [ST.coax, 1.5, 0], az: 16, el: 14, dist: 14 }, lit: 'coax', scene: 'coax', look: {},
    fig: '관 안에서 E ∝ 1/r',
  },
  {
    kicker: '12.4', title: '저장된 에너지', sub: '충전하는 데 드는 일',
    body: `
      <p class="lede">작은 전하 <i>dq</i> 하나하나를 이미 있는 전기장을 거슬러 −에서 +로 Δ<i>V</i> = <i>q</i>/<i>C</i>만큼 옮긴다. 처음 것들은 공짜이고, 마지막 것들은 ${M.V0} V를 모두 치른다.</p>
      <div class="eq"><i>U</i> = ∫<sub>0</sub><sup><i>Q</i></sup> <i>q</i>/<i>C</i> <i>dq</i> = <i>Q</i><sup>2</sup>/2<i>C</i></div>
      <p>= ½<i>Q</i>Δ<i>V</i> = ½<i>C</i>Δ<i>V</i><sup>2</sup>: 직선 아래 삼각형의 넓이로, 여기서는 ${f(M.U0 * 1e9, 1)} nJ이다. 에너지는 전기장 속에 다음 <b>에너지 밀도</b>(J/m³)로 들어 있다.</p>
      <div class="eq"><i>u</i> = ½ε<sub>0</sub><i>E</i><sup>2</sup></div>
      <div class="charts">${chart({ ...R.fill, xlabel: '옮긴 전하 q (pC)', ylabel: 'ΔV (V)', cursors: [['fill']], label: '옮긴 전하에 따른 전압, 그 아래 넓이가 저장된 에너지',
        under: `<path data-area="fill" style="fill:#dfe7f6"/>`, series: [{ pts: [[0, 0], [800, 800e-12 / M.C0]] }] })}</div>
      <p class="live" id="filllive"></p>
      <p class="hintline">틈의 파란색은 u가 클수록 짙어진다. 판을 클릭해 보자.</p>`,
    cam: { target: [ST.energy + 0.4, 1.45, 0], az: 24, el: 14, dist: 12 }, lit: 'energy', scene: 'energy', look: {},
    fig: '조금씩 충전하기',
  },
  {
    kicker: '12.5', title: '직렬과 병렬', sub: '같은 Q, 또는 같은 ΔV',
    body: `
      <p class="lede">${M.CIRC.C1 * 1e6} µF와 ${M.CIRC.C2 * 1e6} µF를 ${M.CIRC.V} V에 연결했다. 판의 넓이는 <i>C</i>에 비례하게 그렸고, 표시 하나는 2 µC이다.</p>
      <table class="data cols">
        <tr><th>직렬</th><th>병렬</th></tr>
        <tr><td>각각의 <i>Q</i>가 같다</td><td>각각의 Δ<i>V</i>가 같다</td></tr>
        <tr><td>Δ<i>V</i> = Δ<i>V</i><sub>1</sub> + Δ<i>V</i><sub>2</sub></td><td><i>Q</i> = <i>Q</i><sub>1</sub> + <i>Q</i><sub>2</sub></td></tr>
        <tr><td>1/<i>C</i><sub>eq</sub> = 1/<i>C</i><sub>1</sub> + 1/<i>C</i><sub>2</sub></td><td><i>C</i><sub>eq</sub> = <i>C</i><sub>1</sub> + <i>C</i><sub>2</sub></td></tr>
        <tr><td>${f(S.C * 1e6)} µF: ${f(S.V1, 0)} V + ${f(S.V2, 0)} V</td><td>${f(PA.C * 1e6, 0)} µF: ${u(PA.Q1)} + ${u(PA.Q2)} µC</td></tr>
      </table>
      <p>직렬에서는 두 축전기 사이의 도선이 중성인 섬이다. 한쪽 끝에 +<i>Q</i>가 있으면 다른 쪽 끝에는 −<i>Q</i>가 있다. 작은 축전기가 전압을 더 많이 나눠 갖고, 병렬에서는 큰 축전기가 전하를 더 많이 가진다.</p>
      <div class="charts">${qBars}</div>
      <p class="hintline">회로를 클릭하면 전하와 전압이 보인다.</p>`,
    cam: { target: [ST.circuits, 1.6, 0], az: 16, el: 9, dist: 19 }, lit: 'series', scene: 'circuits', look: {},
    fig: '9 V에 연결한 2 µF와 4 µF',
  },
  {
    kicker: '12.6', title: '유전체', sub: '틈 속의 부도체',
    body: `
      <p class="lede">틈 속의 부도체는 <b>편극</b>된다. 각 분자 쌍극자는 돌림힘 τ = <i>p</i>×<i>E</i> = <i>pE</i> sin θ를 받아, 에너지가 가장 낮은 <i>U</i> = −<i>p</i>·<i>E</i> 쪽으로 돌아간다.</p>
      <p>정렬된 끝들이 표면에 <b>속박 전하</b>를 남기고, 그 전기장 <i>E</i><sub>ind</sub>는 판이 만드는 전기장과 반대 방향이다.</p>
      <div class="eq"><i>E</i> = <i>E</i><sub>0</sub> − <i>E</i><sub>ind</sub> = <i>E</i><sub>0</sub>/κ</div>
      <p><i>Q</i>가 고정되어 있으면 Δ<i>V</i>는 κ배만큼 줄고, <i>C</i> = κε<sub>0</sub><i>A</i>/<i>d</i>는 κ ≥ 1배만큼 커진다.</p>
      ${dielTable}
      <div class="charts">${chart({ ...R.slab, xlabel: '틈을 채운 비율', ylabel: 'E (V/m)', cursors: [['slab']], label: '유전체 판이 들어간 정도에 따른 전기장',
        series: [{ pts: samples(60, 0, 1, x => M.slab(x, false).E) }], marks: [[1, full.iso.E, `E₀/κ`, -46, -8]] })}</div>`,
    cam: { target: [ST.slab, 1.85, 0], az: 26, el: 13, dist: 11.5 }, lit: 'slab', scene: 'slab', look: {},
    fig: 'κ = 3인 유전체 판, 판은 고립됨',
  },
  {
    kicker: '12.7', title: '연결했을 때와 아닐 때', sub: '전지가 고정하는 것',
    body: `
      <p class="lede">일부만 들어갔을 때, 유전체 판 부분과 그 옆의 공기 부분은 병렬로 연결된 두 축전기다. <i>C</i> = <i>C</i><sub>0</sub>(1 + (κ − 1)<i>x</i>), 절반이 들어가면 <i>C</i><sub>0</sub>/2 · (1 + κ).</p>
      <table class="data">
        <tr><th>유전체 판 완전 삽입</th><th>전원 연결</th><th>전원 분리</th></tr>
        <tr><td>고정되는 값</td><td>Δ<i>V</i> = ${M.V0} V</td><td><i>Q</i> = ${f(M.Q0 * 1e12, 0)} pC</td></tr>
        <tr><td><i>Q</i></td><td>κ<i>Q</i><sub>0</sub> = ${f(full.con.Q * 1e12, 0)} pC</td><td><i>Q</i><sub>0</sub></td></tr>
        <tr><td>Δ<i>V</i>, <i>E</i></td><td>변화 없음</td><td>÷ κ (${f(full.iso.V, 1)} V)</td></tr>
        <tr><td><i>U</i></td><td>× κ (${f(full.con.U * 1e9, 1)} nJ)</td><td>÷ κ (${f(full.iso.U * 1e9, 1)} nJ)</td></tr>
      </table>
      <p>전원이 연결되어 있으면 유전체 판이 있는 곳으로 전하가 흘러 들어온다. 전지는 Δ<i>V</i>·Δ<i>Q</i>의 일을 하는데, 이는 저장된 에너지 증가량의 두 배다. 어느 경우든 판은 유전체 판을 안으로 끌어당긴다.</p>
      <div class="charts">${chart({ ...R.energy, xlabel: '틈을 채운 비율', ylabel: 'U / U₀', cursors: [['enA'], ['enB', GREY]], label: '채운 비율에 따른 저장 에너지, 전원 연결과 분리',
        series: [{ pts: samples(60, 0, 1, x => M.slab(x, true).U / M.U0), tag: [0.3, 1.75, '전원 연결'] }, { pts: samples(60, 0, 1, x => M.slab(x, false).U / M.U0), color: GREY, tag: [0.6, 0.55, '전원 분리'] }] })}</div>
      <p class="hintline">어느 축전기든 클릭해 보자.</p>`,
    cam: { target: [ST.compare, 1.75, 0], az: 24, el: 11, dist: 16.5 }, lit: 'battery', scene: 'compare', look: {},
    fig: '전지 연결(왼쪽), 분리(오른쪽)',
  },
  {
    kicker: '12.8', title: '도체', sub: '정전기적 평형 상태',
    body: `
      <p class="lede">${M.COND.E0} V/m 전기장 속의 중성 금속 구. 자유 전자들은 자신들이 만든 전기장이 내부에서 바깥 전기장을 상쇄할 때까지 이동한다. 그러면 다음이 성립한다.</p>
      <ul class="rules">
        <li>금속 내부 어디에서나 <i>E</i> = 0이다.</li>
        <li>전하는 모두 표면에 있다.</li>
        <li>표면 바로 바깥에서 <i>E</i> ⊥ 표면이고 <i>E</i> = σ/ε<sub>0</sub>이다.</li>
        <li>도체 전체가 하나의 전위다.</li>
      </ul>
      <p>여기서 σ = 3ε<sub>0</sub><i>E</i><sub>0</sub> cos θ이고 합은 0이다. 양 극에서 <i>E</i> = 3<i>E</i><sub>0</sub>이다. 두께 <i>t</i>인 금속판을 축전기에 넣으면 두 틈이 직렬로 남는다. <i>C</i> = ε<sub>0</sub><i>A</i>/(<i>d</i> − <i>t</i>).</p>
      <div class="charts">${chart({ ...R.probe, xlabel: '축 위의 위치 (cm)', ylabel: 'E (V/m)', cursors: [['probe']], label: '구를 지나는 축을 따라 나타낸 전기장',
        series: [{ pts: samples(160, -28, -10.0001, x => M.condAxisE(x / 100)) }, { pts: [[-10, 0], [10, 0]] }, { pts: samples(160, 10.0001, 28, x => M.condAxisE(x / 100)) }] })}</div>
      <p class="hintline">구를 클릭하면 잘라 보인다. 전기력선은 모형에서 추적했다.</p>`,
    cam: { target: [ST.conductor, 1.8, 0], az: 40, el: 10, dist: 19 }, lit: 'conductor', scene: 'conductor', look: {},
    fig: '전기장 속의 중성 금속 구',
  },
];

// ---------- click a scene: what it breaks into ----------
const sph = r => [['가우스 면 반지름 r', `${f(r * 100, 1)} cm`], ['E(r) = Q/4πε₀r²', `${f(M.sphE(r), 0)} V/m`], ['선속 E·4πr²', `${f(M.sphE(r) * 4 * Math.PI * r * r, 1)} V·m`], ['Q/ε₀', `${f(M.SPH.Q / M.EPS0, 1)} V·m`]];
export const PLATES = {
  plates: { text: `각 판은 혼자서 +에서 멀어지고 −를 향하는 전기장 σ/2ε₀를 만든다(회색). 두 판 사이에서는 둘이 같은 방향이어서 더해져 σ/ε₀가 된다. 바깥에서는 반대 방향이어서 상쇄된다. 그래서 전기장이 모두 틈 안에 있다.`,
    facts: s => { const r = M.charging(s.charge.t); return [['ΔV', `${f(r.V, 1)} V`], ['Q = CΔV', `${f(r.Q * 1e12, 0)} pC`], ['판 하나 σ/2ε₀', `${f(r.E / 2, 0)} V/m`], ['사이: 합', `${f(r.E, 0)} V/m`], ['바깥: 차', '0 V/m']]; } },
  pillbox: { text: `원통형 가우스 면이 + 판에 걸쳐 있다. 바깥쪽 면은 전기장이 0인 곳에 있고 옆면은 전기장과 나란하므로, 선속은 틈 안에 있는 면을 지나는 E·A뿐이다. 그 안의 전하는 σA이다. 가우스 법칙: EA = σA/ε₀.`,
    facts: s => { const r = M.gapScene(s.gap.t), A = M.PILLBOX.A; return [['면의 넓이 A', `${f(A * 1e4, 1)} cm²`], ['선속 E·A', `${f(r.E * A, 3)} V·m`], ['q_enc/ε₀', `${f(M.Q0 / M.PLATE.A * A / M.EPS0, 3)} V·m`], ['간격 d', `${f(r.d * 100, 1)} cm`], ['ΔV = Ed', `${f(r.V, 0)} V`], ['C = ε₀A/d', `${pF(r.C)} pF`]]; } },
  sphere: { text: `껍질을 열면 공과 그 사이의 구형 가우스 면이 보인다. 반지름이 얼마든 그것을 지나는 선속은 똑같이 Q/ε₀이므로, E는 1/r²로 줄어든다.`,
    facts: s => sph(M.gaussR(s.sweep.t, M.SPH.a, M.SPH.b)) },
  coax: { text: `관을 치우면 막대와 원통형 가우스 면이 보인다. 선속은 넓이 2πrL인 굽은 옆면으로만 나가므로, E = Q/2πε₀rL은 1/r로 줄어든다.`,
    facts: s => { const r = M.gaussR(s.sweep.t, M.CYL.a, M.CYL.b); return [['가우스 면 반지름 r', `${f(r * 100, 1)} cm`], ['E(r)', `${f(M.cylE(r), 0)} V/m`], ['선속 E·2πrL', `${f(M.cylE(r) * 2 * Math.PI * r * M.CYL.L, 1)} V·m`], ['Q/ε₀', `${f(M.CYL.Q / M.EPS0, 1)} V·m`], ['C', `${pF(M.CYL.C)} pF`]]; } },
  energy: { text: `에너지는 틈의 부피 A × d 전체에 밀도 u = ½ε₀E²로 퍼져 있다. 둘을 곱하면 다시 ½CΔV²가 된다.`,
    facts: s => { const r = M.filling(s.fill.t), vol = M.PLATE.A * M.PLATE.d; return [['E', `${f(r.E, 0)} V/m`], ['u = ½ε₀E²', `${f(r.u * 1e6, 2)} µJ/m³`], ['부피 Ad', `${f(vol * 1e6, 0)} cm³`], ['u·Ad', `${f(r.u * vol * 1e9, 2)} nJ`], ['Q²/2C', `${f(r.U * 1e9, 2)} nJ`]]; } },
  series: { text: `전지가 고리를 따라 ${u(S.Q)} µC를 옮긴다. 안쪽 두 판과 그 사이 도선은 하나의 중성 섬이다. 한쪽에 −${u(S.Q)} µC, 다른 쪽에 +${u(S.Q)} µC. 각 축전기의 전압은 Q/C이고, 둘을 더하면 ${M.CIRC.V} V이다.`,
    facts: () => [['C_eq', `${f(S.C * 1e6)} µF`], ['각각의 Q', `${u(S.Q)} µC`], ['ΔV₁ = Q/C₁', `${f(S.V1, 1)} V`], ['ΔV₂ = Q/C₂', `${f(S.V2, 1)} V`], ['에너지 ½C_eqV²', `${f(S.U * 1e6, 0)} µJ`]] },
  parallel: { text: `두 축전기가 모두 전지 양단에 바로 연결되어 있으므로 각각 ${M.CIRC.V} V 전체를 받는다. 각각 Q = CΔV를 가지며, 전지는 그 합을 공급한다.`,
    facts: () => [['C_eq', `${f(PA.C * 1e6, 0)} µF`], ['각각의 ΔV', `${M.CIRC.V} V`], ['Q₁ = C₁ΔV', `${u(PA.Q1)} µC`], ['Q₂ = C₂ΔV', `${u(PA.Q2)} µC`], ['에너지 ½C_eqV²', `${f(PA.U * 1e6, 0)} µJ`]] },
  slab: { text: `유전체 판 속: 판의 자유 전하만 있으면 E₀(회색, 오른쪽)를 만든다. 유전체 판 표면의 속박 전하는 E_ind(회색, 왼쪽)를 만든다. 남은 것이 E(파란색)로, 유전체 판 속과 그 옆 공기에서 같은데, 둘 다 같은 ΔV에 걸쳐 있기 때문이다.`,
    facts: s => { const x = M.fillOf(s.slide.t), r = M.slab(x, false); return [['유전체 판 삽입', `${f(x * 100, 0)} %`], ['E₀ = σ_free/ε₀ (유전체 판 부분)', `${f(r.Efree, 0)} V/m`], ['E_ind = σ_bound/ε₀', `${f(r.Eind, 0)} V/m`], ['E = E₀ − E_ind', `${f(r.E, 0)} V/m`], ['ΔV', `${f(r.V, 1)} V`], ['C', `${pF(r.C)} pF`]]; } },
  battery: { text: `전지가 ΔV를 ${M.V0} V로 유지하므로 E = ΔV/d는 바뀔 수 없다. 유전체 판이 들어오면 판과 마주한 부분에 전하가 흘러 들어와 κ배가 될 때까지 쌓인다.`,
    facts: s => { const r = M.slab(M.fillOf(s.slide.t), true); return [['C', `${pF(r.C)} pF`], ['Q', `${f(r.Q * 1e12, 0)} pC`], ['ΔV', `${f(r.V, 1)} V`], ['E', `${f(r.E, 0)} V/m`], ['U', `${f(r.U * 1e9, 1)} nJ`]]; } },
  isolated: { text: `전하가 들어오거나 나갈 수 없으므로 Q는 그대로다. 전하는 유전체 판 쪽으로 몰리고, 틈 전체에서 전기장이 약해지며, ΔV도 낮아진다.`,
    facts: s => { const r = M.slab(M.fillOf(s.slide.t), false); return [['C', `${pF(r.C)} pF`], ['Q', `${f(r.Q * 1e12, 0)} pC`], ['ΔV', `${f(r.V, 1)} V`], ['E', `${f(r.E, 0)} V/m`], ['U', `${f(r.U * 1e9, 1)} nJ`]]; } },
  conductor: { text: `잘라 보면 내부에는 전하도 전기장도 없고, 표면에만 있다. 금속 안 어디에 가우스 면을 잡아도 그 위에서 E = 0이므로 안에 전하가 없다. 속이 빈 껍질에서도 마찬가지이며, 그래서 금속 상자는 안에 있는 것을 차폐한다.`,
    facts: s => { const x = M.probeX(s.clock); return [['탐침 위치', `${f(x * 100, 1)} cm`], ['그곳의 E', `${f(M.condAxisE(x), 0)} V/m`], ['내부의 E', '0 V/m'], ['양 극의 σ', `±${f(M.condSigma(0) * 1e9, 1)} nC/m²`], ['양 극의 E = σ/ε₀', `${f(M.condSigma(0) / M.EPS0, 0)} V/m`]]; } },
};
