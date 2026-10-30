// Chapter 13, page by page (after the AP Physics C E&M organizer, Units 5 and 6). Text and a chart
// on the left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, HS, MAG, SPEEDUP, LEN_SCALE, K_DOT } from './world.js';

const f = (x, n = 2) => (x < -1e-12 ? '−' : '') + Math.abs(x).toFixed(n);
const sci = (x, n = 2) => { const e = Math.floor(Math.log10(Math.abs(x))); return `${(x / 10 ** e).toFixed(n)} × 10<sup>${e < 0 ? '−' : ''}${Math.abs(e)}</sup>`; };
const heightNote = `높이: 격자 한 칸이 ${f(1 / HS, 0)} V.`;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], vlines = [], cursors = [], label }) {
  const sx = x => CH.sx(x, x0, x1), sy = y => CH.sy(y, y0, y1);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(Math.min(Math.max(y, y0), y1)).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const vl = vlines.map(([x, t]) => `<line class="grid" x1="${sx(x)}" x2="${sx(x)}" y1="${P.t}" y2="${H - P.b}"/><text class="ax" x="${sx(x)}" y="${H - 9}" text-anchor="middle">${t}</text>`).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const cs = cursors.map(c => `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${c}"/>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${vl}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${y0}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2 + 40}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cs}
  </svg>`;
}
const curve = (fn, a, b, n = 120) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
// chart ranges, shared with main.js for the live cursors
export const R = {
  drude: { x0: 0, x1: 4, y0: 0, y1: 2.4 },
  res: { x0: 0, x1: 2, y0: 0, y1: 12 },
  energy: { x0: 0, x1: M.BULB.run, y0: 0, y1: 60 },
  term: { x0: 0, x1: 6, y0: 0, y1: 12 },
  pload: { x0: 0, x1: 8, y0: 0, y1: 20 },
  rc: { x0: 0, x1: M.RC.cycle, y0: -100, y1: 100 },
};

const { CU, RC } = M;
const ohmI = M.OHM.E / M.OHM.R, bulbI = M.BULB.E / M.BULB.R, bulbP = bulbI * M.BULB.E;
const kr = M.solve(M.KIRCH.edges, 'bl'), kI = n => M.edgeI(M.KIRCH, kr, n), kd = M.solve(M.kirchEdges(false), 'bl');

export const PAGES = [
  {
    kicker: '13장', title: '전류', sub: '움직이는 전하',
    body: `
      <p class="lede">전지는 두 단자 사이를 일정한 전위차로 유지한다. 두 단자를 도선으로 이으면 금속 안의 전기장이 자유 전하를 밀어 움직인다. 이것이 <b>전류</b>다.</p>
      <div class="eq"><i>I</i> = d<i>q</i>/d<i>t</i> = <i>nqAv</i><sub>d</sub>,  <i>J</i> = <i>I</i>/<i>A</i> = <i>nqv</i><sub>d</sub> = σ<i>E</i></div>
      <p>1 A = 1 C/s이며, <i>양</i>전하가 움직인다고 보고 센다. 전자는 반대 방향으로 떠다닌다. 길이 Δ<i>x</i> = <i>v</i><sub>d</sub>Δ<i>t</i>인 조각에는 <i>nqA</i>Δ<i>x</i>의 전하가 들어 있고, 이 전하가 모두 Δ<i>t</i> 동안 <i>A</i>를 지나간다. 일반적으로 <i>I</i> = ∫<b>J</b>·d<b>A</b>이다.</p>
      <table class="data">
        <tr><td>구리 1 mm²에 흐르는 1 A: <i>n</i></td><td>${sci(CU.n, 1)} m⁻³</td></tr>
        <tr><td>유동 속력 <i>v</i><sub>d</sub></td><td>${f(CU.vd * 1e3, 3)} mm/s</td></tr>
      </table>
      <p>전자 하나하나는 빨라지다가 이온에 부딪혀 멈추고 다시 출발하며(드루드 모형), 평균하면 <i>v</i><sub>d</sub>가 된다. 1 m를 가는 데 ${f(CU.hours, 1)}시간이 걸린다. 그래도 전등이 곧바로 켜지는 것은 전기장이 도선을 따라 순식간에 퍼지기 때문이다.</p>
      <div class="charts">${chart({ ...R.drude, xlabel: '시간 (충돌 횟수)', ylabel: '전자 하나의 속력 / v_d', cursors: ['drude'], label: '전자 하나의 톱니 모양 속력, 평균하면 유동 속력',
        series: [{ pts: curve(t => M.drudeV(t, 1, 1), 0, 3.999, 400) }, { cls: 'trend', pts: [[0, 1], [4, 1]], tag: [3.25, 1, 'v_d'] }] })}</div>
      <p class="hintline">도선을 클릭하면 <i>A</i>를 지나가는 조각이 보인다. 실제 크기의 ${MAG}배로 그렸고, 유동은 실제보다 ${SPEEDUP}배 빠르다.</p>`,
    cam: { target: [STATIONS.wire, 0.95, 0], az: -16, el: 14, dist: 21 }, lit: 'wire', scene: 'wire', look: {},
    fig: '전자는 전류와 반대로 떠다닌다',
  },
  {
    kicker: '13.1', title: '저항', sub: '길고 가늘수록 크다',
    body: `
      <p class="lede"><b>저항</b> <i>R</i> = Δ<i>V</i>/<i>I</i>는 단위가 옴(V/A)이며, 어떤 물체에 전류를 흘리기가 얼마나 어려운지를 나타낸다.</p>
      <div class="eq"><i>R</i> = ρ<i>L</i>/<i>A</i> = <i>L</i>/σ<i>A</i></div>
      <p>물질이 <b>비저항</b> ρ = 1/σ를 정하고(구리 ${sci(M.RHO.copper, 2)}, 니크롬 ${sci(M.RHO.nichrome, 2)} Ω·m), 모양이 <i>L</i>/<i>A</i>를 정한다. 길이가 두 배면 두 토막을 직렬로 이은 셈이라 <i>R</i>도 두 배다. 지름이 두 배면 가닥 네 개를 나란히 놓은 셈이라 <i>R</i>는 4분의 1이다.</p>
      <p>지름 ${f(M.RES.dThin * 1e3, 1)} mm와 ${f(M.RES.dThick * 1e3, 1)} mm인 니크롬선에 각각 1.5 V를 건다. 두 선에서 전하 운반자의 유동 속력은 같지만(<i>E</i> = Δ<i>V</i>/<i>L</i>가 같음), 굵은 선에는 운반자가 네 배 많다.</p>
      <div class="charts">${chart({ ...R.res, xlabel: '길이 L (m)', ylabel: 'R (Ω)', cursors: ['thin', 'thick'], label: '두 지름에 대한 길이별 저항',
        series: [{ pts: curve(M.rThin, 0, 2, 4), tag: [1.15, M.rThin(1.15), 'd'] }, { pts: curve(M.rThick, 0, 2, 4), tag: [1.5, M.rThick(1.5), '2d'] }] })}</div>
      <p class="hintline">클릭하면 굵은 선이 네 가닥으로 나뉜다. 길이는 1 m당 ${LEN_SCALE * 100} cm로 그렸고, 굵기는 확대했다.</p>`,
    cam: { target: [STATIONS.resist - 0.5, 0.35, 0], az: -14, el: 30, dist: 15 }, lit: 'wires', scene: 'wires', look: {},
    fig: '같은 1.5 V, 다른 모양',
  },
  {
    kicker: '13.2', title: '옴의 법칙', sub: 'V = IR',
    body: `
      <p class="lede">옴 도체에서는 전류가 양단의 전압에 비례하며, 그 비가 저항이다.</p>
      <p>금속 속 옴의 법칙 <i>J</i> = σ<i>E</i>에서 출발해, 도선을 따라 <i>E</i> = Δ<i>V</i>/<i>L</i>을 쓰면</p>
      <div class="eq"><i>I</i> = <i>JA</i> = σ<i>A</i>Δ<i>V</i>/<i>L</i>  ⟹  Δ<i>V</i> = <i>IR</i></div>
      <p>${M.OHM.R} Ω에 ${M.OHM.E} V를 걸면 ${f(ohmI, 1)} A가 흐른다. 각 점은 그 전위만큼의 높이에 그렸다. 전지는 전하를 ${M.OHM.E} V 들어 올리고, 이상적인 도선은 평평하며, 저항은 내리막이다. 전류를 따라 저항을 지나면 전위를 <i>잃는다</i>.</p>
      <div class="charts">${chart({ x0: 0, x1: 9, y0: 0, y1: 3, xlabel: 'ΔV (V)', ylabel: 'I (A)', label: '3옴 저항의 전압에 따른 전류: 직선',
        series: [{ pts: [[0, 0], [9, 3]], tag: [6.6, 2.15, '기울기 1/R'] }], marks: [[M.OHM.E, ohmI, `${M.OHM.E} V, ${f(ohmI, 1)} A`, 8, 14]] })}</div>
      <p class="hintline">클릭하면 저항 속 전기장이 보인다. ${heightNote}</p>`,
    cam: { target: [STATIONS.ohm, 0.8, 0.1], az: -34, el: 16, dist: 14 }, lit: 'ohm', scene: 'ohm', look: { ohm: 1 },
    fig: '전지에서 올라가고 저항에서 내려간다',
  },
  {
    kicker: '13.3', title: '전력', sub: 'P = IΔV',
    body: `
      <p class="lede">1 C의 전하는 전지에서 Δ<i>V</i> 줄의 에너지를 얻고, 저항에서 그 에너지를 열로, 전구라면 빛으로도 내놓는다.</p>
      <div class="eq"><i>P</i> = d<i>U</i>/d<i>t</i> = <i>I</i>Δ<i>V</i> = <i>I</i>²<i>R</i> = Δ<i>V</i>²/<i>R</i></div>
      <p>뒤의 두 식은 Δ<i>V</i> = <i>IR</i>을 쓴 것이다. 전류를 알면(직렬) <i>I</i>²<i>R</i>, 전압을 알면(병렬) Δ<i>V</i>²/<i>R</i>을 쓴다. 단위는 와트, J/s이다.</p>
      <table class="data">
        <tr><td><i>I</i>Δ<i>V</i></td><td>${f(bulbI, 2)} A × ${M.BULB.E} V = ${f(bulbP, 1)} W</td></tr>
        <tr><td><i>I</i>²<i>R</i></td><td>(${f(bulbI, 2)} A)² × ${M.BULB.R} Ω = ${f(bulbI ** 2 * M.BULB.R, 1)} W</td></tr>
        <tr><td>Δ<i>V</i>²/<i>R</i></td><td>(${M.BULB.E} V)² / ${M.BULB.R} Ω = ${f(M.BULB.E ** 2 / M.BULB.R, 1)} W</td></tr>
      </table>
      <p>에너지 <i>E</i> = <i>Pt</i>: ${M.BULB.run} s마다 ${f(bulbP * M.BULB.run, 0)} J.</p>
      <div class="charts">${chart({ ...R.energy, xlabel: '시간 (s)', ylabel: '에너지 (J)', cursors: ['energy'], label: '시간에 따라 전달된 에너지: 기울기가 P인 직선', series: [{ pts: [[0, 0], [M.BULB.run, bulbP * M.BULB.run]], tag: [5.2, 25, '기울기 P = 6 W'] }] })}</div>
      <p class="hintline">전구를 클릭하면 유리가 벗겨진다.</p>`,
    cam: { target: [STATIONS.power, 0.25, 0.05], az: -14, el: 42, dist: 12.5 }, lit: 'bulb', scene: 'bulb', look: {},
    fig: '6와트의 열과 빛',
  },
  {
    kicker: '13.4', title: '기전력', sub: '실제 전지',
    body: `
      <p class="lede"><b>기전력</b> ℰ는 전지의 화학 작용이 1 C마다 주는 에너지다. 이름과 달리 힘이 아니다.</p>
      <p>실제 전지에는 <b>내부 저항</b> <i>r</i>가 있어서, 전류가 전지 안에서 <i>Ir</i>를 잃는다.</p>
      <div class="eq">Δ<i>V</i><sub>단자</sub> = ℰ − <i>Ir</i>,  <i>I</i> = ℰ/(<i>R</i> + <i>r</i>)</div>
      <p>여기서 ℰ = ${M.CELL.E} V, <i>r</i> = ${M.CELL.r} Ω이고, 전구의 <i>R</i>는 ${M.CELL.Rmin}–${M.CELL.Rmax} Ω 사이를 오간다. 전류가 클수록 단자 전압이 낮아지고, <i>I</i>²<i>r</i>가 전지를 데운다. 전구가 받는 전력은 ℰ²<i>R</i>/(<i>R</i> + <i>r</i>)²이다. d<i>P</i>/d<i>R</i> = 0은 <i>R</i> = <i>r</i>일 때이고, 이때 전구가 가장 밝다: ℰ²/4<i>r</i> = ${f(M.CELL.E ** 2 / (4 * M.CELL.r), 0)} W.</p>
      <div class="charts">${chart({ ...R.pload, xlabel: '부하 R (Ω)', ylabel: '전구가 받는 전력 (W)', cursors: ['pload'], vlines: [[M.CELL.r, 'r']], label: '부하 저항에 따른 부하 전력, R = r에서 최대',
        series: [{ pts: curve(M.loadP, 0, 8) }] })}</div>
      <p class="hintline">전지를 클릭하면 열린다. ${heightNote}</p>`,
    cam: { target: [STATIONS.cell, 0.2, 0.05], az: -14, el: 42, dist: 14 }, lit: 'cell', scene: 'cell', look: {},
    fig: '기전력 12 V, 내부 저항 2 Ω',
  },
  {
    kicker: '13.5', title: '직렬과 병렬', sub: '한 길로, 또는 나란히',
    body: `
      <p class="lede"><b>직렬</b>에서는 전류의 경로가 하나뿐이라 모든 저항에 같은 전류가 흐르고 전압이 더해진다. <b>병렬</b>에서는 모든 가지가 같은 두 점 사이에 걸쳐 있어서 전압이 같고 전류가 더해진다.</p>
      <div class="eq"><i>R</i><sub>s</sub> = <i>R</i><sub>1</sub> + <i>R</i><sub>2</sub>,  1/<i>R</i><sub>p</sub> = 1/<i>R</i><sub>1</sub> + 1/<i>R</i><sub>2</sub> + …</div>
      <table class="data cols">
        <tr><th>직렬, 9 V</th><th>병렬, 9 V</th></tr>
        <tr><td><i>R</i><sub>eq</sub> = 2 + 4 = 6 Ω</td><td><i>R</i><sub>eq</sub> = ${f(M.parallelR([2, 4, 6]), 3)} Ω</td></tr>
        <tr><td><i>I</i> = 9/6 = 1.5 A</td><td><i>I</i><sub>1</sub> = 9/2 = 4.5 A</td></tr>
        <tr><td>Δ<i>V</i><sub>1</sub> = 1.5 × 2 = 3 V</td><td><i>I</i><sub>2</sub> = 9/4 = 2.25 A</td></tr>
        <tr><td>Δ<i>V</i><sub>2</sub> = 1.5 × 4 = 6 V</td><td><i>I</i><sub>3</sub> = 9/6 = 1.5 A</td></tr>
        <tr><td>3 + 6 = 9 V ✓</td><td><i>I</i> = 8.25 A ✓</td></tr>
      </table>
      <p>직렬로 더 이으면 <i>R</i><sub>eq</sub>가 커지고, 병렬로 더 이으면 작아져 가장 작은 가지보다도 작아진다. 병렬에서는 가지 전류가 모이는 레일을 따라 점들이 빨라진다.</p>
      <p class="hintline">어느 회로든 클릭하면 들어 올려진다. 점의 속력 ∝ 전류(병렬에서는 1 A당 ${f(K_DOT.parallel / K_DOT.series, 1)}배 빠름).</p>`,
    cam: { target: [STATIONS.sp + 0.07, 0.1, 0.1], az: -5, el: 50, dist: 20.5 }, lit: null, scene: 'sp', look: {},
    fig: '2 Ω과 4 Ω; 2, 4, 6 Ω',
  },
  {
    kicker: '13.6', title: '저항의 조합', sub: '줄인 다음 거꾸로 풀기',
    body: `
      <p class="lede">직렬과 병렬 부분으로 된 회로는 한 단계씩 줄여 하나의 등가 저항으로 만들 수 있다. 그런 다음 거꾸로 풀어 각 전압과 전류를 구한다.</p>
      <ol class="rules">
        <li>R<sub>2</sub>, R<sub>4</sub>, R<sub>5</sub>에는 같은 전류가 흐른다. 직렬이므로 4 + 2 + 2 = ${M.COMBO.R245} Ω.</li>
        <li>R<sub>3</sub>와 그 ${M.COMBO.R245} Ω은 같은 두 점 사이에 걸쳐 있다. 병렬이므로 1/(½ + ⅛) = ${f(M.COMBO.R2345, 1)} Ω.</li>
        <li>R<sub>1</sub>이 이것과 직렬이다: <i>R</i><sub>eq</sub> = 2 + ${f(M.COMBO.R2345, 1)} = ${f(M.COMBO.Req, 1)} Ω, 따라서 <i>I</i> = 9/${f(M.COMBO.Req, 1)} = ${f(9 / M.COMBO.Req, 1)} A.</li>
      </ol>
      <table class="data">
        <tr><th>거꾸로 풀기</th><th>Δ<i>V</i></th><th><i>I</i></th></tr>
        <tr><td>R<sub>1</sub></td><td>2.5 × 2 = 5 V</td><td>2.5 A</td></tr>
        <tr><td>R<sub>3</sub> (병렬 부분)</td><td>9 − 5 = 4 V</td><td>4/2 = 2.0 A</td></tr>
        <tr><td>R<sub>2</sub>, R<sub>4</sub>, R<sub>5</sub></td><td>2, 1, 1 V</td><td>4/8 = 0.5 A</td></tr>
      </table>
      <p>모든 단계가 같은 2.5 A를 끌어 쓴다. 이것이 ‘등가’의 뜻이다. (요약 자료에는 R<sub>245</sub> = 10 Ω, 3.667 Ω으로 적혀 있지만, 표시된 값대로라면 4 + 2 + 2 = 8 Ω이다.)</p>
      <p class="hintline">전체 회로(1)를 클릭하면 들어 올려진다.</p>`,
    cam: { target: [STATIONS.combo, 0.1, 0.15], az: -4, el: 56, dist: 27 }, lit: 'combo', scene: 'combo', look: {},
    fig: '저항 다섯 개를 하나로',
  },
  {
    kicker: '13.7', title: '키르히호프 법칙', sub: '전하와 에너지의 보존',
    body: `
      <p class="lede">서로 다른 가지에 전지가 두 개 있으면 저항 하나로 줄일 수 없다. 키르히호프의 두 법칙은 언제나 통한다.</p>
      <ul class="rules"><li><b>접합점 법칙</b>(전하 보존): 들어온 만큼 나간다. A에서 <i>I</i><sub>1</sub> = <i>I</i><sub>2</sub> + <i>I</i><sub>3</sub>.</li>
        <li><b>고리 법칙</b>(에너지 보존): 어떤 고리를 한 바퀴 돌아도 ΣΔ<i>V</i> = 0. 전류 방향으로 저항을 지나면 −<i>IR</i>, 전지를 − 에서 + 로 지나면 +ℰ.</li></ul>
      <div class="eq">1:  −10<i>I</i><sub>1</sub> − 5<i>I</i><sub>2</sub> − 10<i>I</i><sub>1</sub> + 12 = 0</div>
      <div class="eq">2:  −20<i>I</i><sub>3</sub> + 6 − 20<i>I</i><sub>3</sub> + 5<i>I</i><sub>2</sub> = 0</div>
      <p>따라서 <i>I</i><sub>1</sub> = ${f(kI('R1'), 2)} A, <i>I</i><sub>2</sub> = ${f(kI('R5'), 2)} A, <i>I</i><sub>3</sub> = ${f(kI('R3'), 2)} A로 요약 자료의 답과 같다. 이 답이 나오려면 여기 그린 것처럼 6 V 전지의 + 극이 아래에 있어야 한다. 요약 자료의 그림에는 + 극이 위에 있는데, 그러면 고리 2에 −6이 들어가고 <i>I</i><sub>3</sub> = ${f(kd.I[2], 3)} A, 즉 전류가 반대로 흐른다.</p>
      <p class="hintline">클릭하면 들어 올려지고 각 고리를 따라 걷는다. ${heightNote}</p>`,
    cam: { target: [STATIONS.kirch, 0.3, 0.1], az: -8, el: 46, dist: 16 }, lit: 'kirch', scene: 'kirch', look: {},
    fig: 'I₁ = I₂ + I₃; 각 고리에서 ΣΔV = 0',
  },
  {
    kicker: '13.8', title: 'RC 회로', sub: '충전과 방전',
    body: `
      <p class="lede"><b>a</b>에서는 전지가 <i>R</i>를 거쳐 축전기를 충전한다. <b>b</b>에서는 축전기가 빌 때까지 <i>R</i>를 거쳐 전류를 거꾸로 밀어낸다.</p>
      <div class="eq">ℰ − <i>IR</i> − <i>q</i>/<i>C</i> = 0, <i>I</i> = d<i>q</i>/d<i>t</i></div><div class="eq"><i>q</i> = ℰ<i>C</i>(1 − e<sup>−<i>t</i>/<i>RC</i></sup>)</div>
      <p>(변수 분리: ∫d<i>q</i>/(ℰ<i>C</i> − <i>q</i>) = ∫d<i>t</i>/<i>RC</i>.) <i>I</i> = (ℰ/<i>R</i>)e<sup>−<i>t</i>/<i>RC</i></sup>. τ = <i>RC</i> = ${f(RC.tau, 1)} s. τ가 한 번 지나면 <i>q</i>는 ℰ<i>C</i> = ${f(RC.Qmax * 1e3, 1)} mC의 63.2%, <i>I</i>는 ℰ/<i>R</i> = ${f(RC.Imax * 1e3, 1)} mA의 36.8%가 된다. 방전할 때는 <i>q</i> = <i>Q</i><sub>max</sub>e<sup>−<i>t</i>/<i>RC</i></sup>.</p>
      <p>비어 있는 축전기는 도선처럼, 가득 찬 축전기는 끊긴 곳처럼 행동한다. 전지가 내놓은 <i>Q</i>ℰ = ${f(RC.Qmax * RC.E * 1e3, 1)} mJ 중 절반은 저장되고 절반은 열이 된다.</p>
      <div class="charts">${chart({ ...R.rc, xlabel: '시간 (s)', ylabel: '최댓값의 %', cursors: ['rcq', 'rci'], vlines: [[RC.tau, 'τ'], [RC.Tch, 'b'], [RC.Tch + RC.tau, 'τ']],
        label: '충전과 방전 중 시간에 따른 전하와 전류',
        series: [{ cls: 'zero', pts: [[0, 0], [RC.cycle, 0]] }, { pts: curve(t => 100 * M.rc(t).Q / RC.Qmax, 0, RC.cycle - 1e-6, 400), tag: [3.5, 92, 'q'] },
          { cls: 'curve total', pts: curve(t => 100 * M.rc(t).I / RC.Imax, 0, RC.cycle - 1e-6, 400), tag: [3.4, 14, 'I'] }],
        marks: [[RC.tau, 63.2, '63.2%'], [RC.tau, 36.8, '36.8%', 6, -6]] })}</div>
      <p class="hintline">클릭하면 들어 올려진다. Δ<i>V</i><sub>C</sub>가 커지면서 Δ<i>V</i><sub>R</sub>가 줄어든다.</p>`,
    cam: { target: [STATIONS.rc, 0.25, 0.1], az: -10, el: 44, dist: 15 }, lit: 'rc', scene: 'rc', look: {},
    fig: '20 kΩ, 100 µF: τ = 2.0 s',
  },
];

// ---------- click a scene: what it breaks into ----------
const vC = n => n.toFixed(2);
export const PLATES = {
  wire: { text: `파란 조각은 <i>A</i>와 그 상류 Δ<i>x</i> = <i>v</i><sub>d</sub>Δ<i>t</i> 거리 사이의 도선이다. 그 안의 모든 전자가 Δ<i>t</i> 안에 <i>A</i>를 지나가므로, <i>A</i>를 통과하는 전하량은 <i>nqA</i>Δ<i>x</i>이고 전류는 <i>nqAv</i><sub>d</sub>이다.`,
    facts: () => { const dx = 1.5 / MAG, dt = dx / CU.vd, Q = CU.n * M.E_CH * CU.A * dx; return [['조각 길이 Δx', `${f(dx * 1e3, 2)} mm (1.5칸으로 그림)`], ['통과 시간 Δt = Δx/v_d', `${f(dt, 1)} s`], ['조각 속 전하 nqAΔx', `${f(Q, 1)} C`], ['I = Q/Δt', `${f(Q / dt, 2)} A`], ['충돌 사이 시간', `${f(CU.tauC * 1e15, 0)} fs`]]; } },
  wires: { text: `굵은 선이 가는 가닥 네 개로 나뉜다. 각 가닥은 가는 선과 똑같다. 같은 경로 네 개가 나란히 있으면 같은 전압에서 네 배의 전류가 흐른다. 곧 저항은 4분의 1이다.`,
    facts: s => { const L = M.resLength(s.clock); return [['길이 L', `${f(L)} m`], ['가는 선: R = ρL/A', `${f(M.rThin(L))} Ω, I ${f(1.5 / M.rThin(L))} A`], ['굵은 선: R/4', `${f(M.rThick(L))} Ω, I ${f(1.5 / M.rThick(L))} A`], ['ρ (니크롬)', `${sci(M.RES.rho, 2)} Ω·m`]]; } },
  ohm: { text: `파란 화살표는 저항 속 전기장으로, 비탈 아래쪽을 가리킨다. 이상적인 도선에는 비탈이 없으니 전기장도 필요 없다. 저항도 0, 전압도 0이다. ${M.OHM.E} V 전체가 저항에서 소비된다.`,
    facts: () => [['전지에서 상승', `+${M.OHM.E} V`], ['도선', '0 V'], ['저항에서 강하 IR', `−${f(ohmI * M.OHM.R, 1)} V`], ['전류', `${f(ohmI, 1)} A`], ['고리 한 바퀴', '0 V']] },
  bulb: { text: `유리 아래에는 가는 텅스텐 선을 감은 코일이 있다. 빛날 만큼 뜨거워지는 저항이다. 전구는 회로 속 ${M.BULB.R} Ω 저항일 뿐이다.`,
    facts: s => { const t = s.clock % M.BULB.run; return [['P = IΔV', `${f(bulbP, 1)} W`], ['P = I²R', `${f(bulbI ** 2 * M.BULB.R, 1)} W`], ['P = ΔV²/R', `${f(M.BULB.E ** 2 / M.BULB.R, 1)} W`], ['지금까지 에너지 E = Pt', `${f(bulbP * t, 1)} J`]]; } },
  cell: { text: `내부에는 이상적인 ${M.CELL.E} V 기전력과 ${M.CELL.r} Ω 저항이 직렬로 있다. 들어 올리면, 전지는 전하를 ${M.CELL.E} V 들어 올리고 내부 저항이 단자에 이르기 전에 <i>Ir</i>를 도로 가져간다.`,
    facts: s => { const R = M.cellLoad(s.clock), I = M.cellI(R); return [['부하 R', `${f(R)} Ω`], ['전류 I = ℰ/(R + r)', `${f(I)} A`], ['내부 손실 Ir', `${f(I * M.CELL.r)} V`], ['단자 ΔV = ℰ − Ir', `${f(M.terminalV(I))} V`], ['전구 전력', `${f(M.loadP(R))} W`], ['내부 낭비 I²r', `${f(I * I * M.CELL.r)} W`]]; } },
  series: { text: `들어 올리면, 전지가 9 V를 올리고 전류는 내리막 두 개를 차례로 내려간다. 2 Ω에서 3 V, 4 Ω에서 6 V. 저항이 클수록 전압을 더 많이 나눠 가진다.`,
    facts: () => [['R_eq', '6 Ω'], ['I (모든 곳)', '1.5 A'], ['ΔV₁', '3.0 V'], ['ΔV₂', '6.0 V'], ['합', '9.0 V']] },
  parallel: { text: `들어 올리면, 왼쪽 레일은 9 V, 오른쪽 레일은 0 V에 있으므로 모든 가지에서 9 V 전체가 강하한다. 각 가지는 제 몫의 전류 ΔV/R를 가져가고, 레일에는 그 합이 흐른다.`,
    facts: () => [['각 가지의 ΔV', '9.0 V'], ['I₁ (2 Ω)', '4.50 A'], ['I₂ (4 Ω)', '2.25 A'], ['I₃ (6 Ω)', '1.50 A'], ['전지', '8.25 A'], ['R_eq', `${f(M.parallelR([2, 4, 6]), 3)} Ω`]] },
  combo: { text: `들어 올리면, R<sub>1</sub>에서 5 V가 강하하고 남은 4 V는 두 길로 동시에 내려간다. R<sub>3</sub>에서는 한꺼번에, R<sub>2</sub>, R<sub>4</sub>, R<sub>5</sub>에서는 2, 1, 1 V의 세 계단으로.`,
    facts: () => [['R_eq', `${f(M.COMBO.Req, 1)} Ω`], ['전지 전류', '2.5 A'], ['R₁ 양단', '5.0 V'], ['R₃ 양단', '4.0 V, 2.0 A'], ['R₂, R₄, R₅', '0.5 A에서 2.0, 1.0, 1.0 V']] },
  kirch: { text: `들어 올리면, 각 점이 제 전위의 높이에 놓인다. 파란 공이 고리 1을, 이어서 고리 2를 걸으며 모든 상승과 강하를 더한다. 공은 언제나 출발한 곳으로 돌아온다: ΣΔV = 0.`,
    facts: s => [['A의 전위', `${f(kr.V.a)} V`], ['B의 전위', `${f(kr.V.b)} V`], ['I₁ = I₂ + I₃', `${f(kI('R1'), 3)} = ${f(kI('R5'), 3)} + ${f(kI('R3'), 3)} A`], ['걷는 고리', `${s.walk.loop}`], ['지금까지 ΣΔV', `${f(s.walk.sum)} V`]] },
  rc: { text: `들어 올리면, 전지가 12 V를 올린다. 저항의 내리막은 <i>IR</i>, 축전기의 계단은 <i>q</i>/<i>C</i>이다. 충전 중에는 축전기 몫이 커지면서 저항 몫이 줄어들고, 둘의 합은 언제나 12 V이다. 방전 중에는 전지가 빠지고 축전기의 계단이 전류를 거꾸로 보낸다.`,
    facts: s => { const r = s.rc; return [['스위치', r.charging ? 'a: 충전 중' : 'b: 방전 중'], ['전환 후 시간 t', `${f(r.s, 1)} s = ${f(r.s / RC.tau, 2)} τ`], ['q', `${vC(r.Q * 1e3)} mC (${f(100 * r.Q / RC.Qmax, 1)}%)`], ['I', `${f(r.I * 1e3, 3)} mA`], ['ΔV_R', `${f(Math.abs(r.VR))} V`], ['ΔV_C', `${f(r.Vc)} V`], ['저장 에너지 q²/2C', `${f(r.Q ** 2 / (2 * RC.C) * 1e3)} mJ`]]; } },
};
