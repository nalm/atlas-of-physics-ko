// Chapter 9, page by page (after the AP Physics C: E&M organizer, Unit 1). Text and a chart on
// the left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, S, E_SCALE, F_SCALE, PL } from './world.js';

const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const sci = (x, n = 2) => { const p = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** p; return `${m.toFixed(n)} × 10<sup>${p < 0 ? '−' + -p : p}</sup>`; };
const cm = x => (x * 100).toFixed(0);
const kNC = x => (x / 1000).toFixed(2);

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
const curve = (x0, x1, fn, n = 80) => Array.from({ length: n + 1 }, (_, i) => { const x = x0 + (x1 - x0) * i / n; return [x, fn(x)]; });
const clip = (y, y1) => Math.min(y, y1);
// chart ranges shared with main.js (live cursors)
export const RANGE = {
  induce: { x0: 0, x1: Math.ceil(M.INDUCE.run), y0: -1, y1: 4 },
  coulomb: { x0: 15, x1: 50, y0: 0, y1: 4 },
  line: { x0: 10, x1: 40, y0: -0.4, y1: 0.3 },
  field: { x0: 5, x1: 35, y0: 0, y1: 4 },
  dipole: { x0: 10, x1: 50, y0: 0, y1: 2 },
  rod: { x0: 0, x1: 40, y0: 0, y1: 4 },
  ring: { x0: 0, x1: 60, y0: 0, y1: 1.5 },
  plates: { x0: 0, x1: 12, y0: 0, y1: 14 },
};
const at = (k, x = 0, y = 0.4) => [STATIONS[k] + x, y, 0];
const R = RANGE;

const pairF = r => M.coulomb(M.PAIR.q1, M.PAIR.q2, r);
const inducedSeries = () => curve(0, M.INDUCE.run, t => M.induce(t).Qnet / M.nC, 200);

export const PAGES = [
  {
    kicker: '9장', title: '전하', sub: '전자 개수로 센다',
    body: `
      <p class="lede">원자는 전하를 띤 구성 요소로 이루어진다. 원자핵 속의 <b>양성자</b>(+), 그 주위의 <b>전자</b>(−), 그리고 전하가 없는 중성자다. 같은 부호의 전하는 서로 밀어내고, 다른 부호의 전하는 서로 끌어당긴다.</p>
      <table class="data">
        <tr><th>입자</th><th>전하</th><th>질량</th></tr>
        <tr><td>양성자</td><td>+<i>e</i></td><td>${sci(M.MP)} kg</td></tr>
        <tr><td>전자</td><td>−<i>e</i></td><td>${sci(M.ME)} kg</td></tr>
        <tr><td>중성자</td><td>0</td><td>≈ <i>m</i><sub>p</sub></td></tr>
      </table>
      <div class="eq">1 <i>e</i> = ${sci(M.QE)} C</div>
      <p>양성자와 전자의 수가 같으면 <b>중성</b>, 전자가 남으면 <b>음전하</b>, 모자라면 <b>양전하</b>를 띤다. 고체를 대전할 때는 전자만 이동하며, 모든 전하량은 <i>e</i>의 정수배다.</p>
      <p><b>전하 보존:</b> 전하는 생성되거나 소멸하지 않고 옮겨질 뿐이다. 막대를 털가죽으로 문지르면 한쪽은 +<i>q</i>, 다른 쪽은 −<i>q</i>를 얻는다.</p>
      <p class="hintline">원자를 클릭해 남는 전자와 빠진 전자를 찾아보자.</p>`,
    cam: { target: at('charge', 0, 0.3), az: -14, el: 10, dist: 25 }, lit: 'atoms', scene: 'atoms', look: {},
    fig: '중성, 음전하, 양전하',
  },
  {
    kicker: '9.1', title: '물체의 대전', sub: '전자를 옮기는 네 가지 방법',
    body: `
      <p class="lede">대전은 전하를 만들어 내지 않는다. 전자를 물체에 더하거나, 물체에서 빼내거나, 물체 안에서 옮길 뿐이다.</p>
      <table class="data">
        <tr><td><b>마찰</b></td><td>털가죽으로 PVC를 문지르면 전자가 건너간다</td></tr>
        <tr><td><b>접촉(전도)</b></td><td>닿게 하면 금속에서는 퍼지고, 절연체에서는 그 자리에 머문다</td></tr>
        <tr><td><b>유도</b></td><td>접촉 없이 금속의 전자를 밀어낸 뒤 접지한다</td></tr>
        <tr><td><b>분극</b></td><td>절연체의 분자가 늘어나 쌍극자가 된다</td></tr>
      </table>
      <p>${f(M.ROD.Q / M.nC, 0)} nC 막대가 ${cm(M.ROD.near)} cm 안으로 다가온다. 구의 자유 전자는 먼 쪽으로 몰리고, 접지하면 빠져나간다. 구에는 막대와 반대 부호인 <b>+${f(M.QG / M.nC)} nC</b>가 남는다.</p>
      <div class="charts">${chart({ ...R.induce, xlabel: '시간 (s)', ylabel: '구의 알짜 전하 (nC)', cursor: 'induce', label: '유도 과정 동안 구의 알짜 전하',
        series: [{ pts: inducedSeries() }] })}</div>
      <p class="hintline">구슬 크기는 표면 전하 밀도 σ를 나타낸다. 구나 풍선을 클릭해 보자.</p>`,
    cam: { target: at('charging', -0.3, 0.4), az: -8, el: 8, dist: 32 }, lit: 'induce', scene: 'induce', look: {},
    fig: '유도와 분극',
  },
  {
    kicker: '9.2', title: '쿨롱 법칙', sub: '거리 제곱에 반비례',
    body: `
      <p class="lede">두 점전하 사이의 힘은 두 전하량의 곱에 비례하고 거리의 제곱에 반비례한다.</p>
      <div class="eq"><i>F</i> = <i>k</i>|<i>q</i><sub>1</sub><i>q</i><sub>2</sub>|/<i>r</i>²</div>
      <p><i>k</i> = 1/4πε<sub>0</sub> = ${sci(M.K)} N·m²/C². 크기 |<i>q</i>|를 쓰고, 부호는 인력인지 척력인지만 알려 준다. 두 힘은 작용·반작용 쌍이므로 한 전하가 다른 전하의 두 배라도 크기가 같다.</p>
      <div class="charts">${chart({ ...R.coulomb, xlabel: '거리 r (cm)', ylabel: '각 전하가 받는 힘 (N)', cursor: 'coulomb', label: '거리에 따른 힘, r 제곱에 반비례해 줄어든다',
        series: [{ pts: curve(15, 50, x => clip(pairF(x / 100), 4)) }], marks: [[20, pairF(0.2), `${f(pairF(0.2))} N`], [40, pairF(0.4), `${f(pairF(0.4))} N`, -46, -8]] })}</div>
      <p><b>얼마나 셀까?</b> 1 m 떨어진 ${M.PEOPLE.m} kg인 두 사람에게 전자보다 양성자가 1% 더 많다고 하자. 각각 ${sci(M.PEOPLE.q)} C이고 <i>F</i> = ${sci(M.PEOPLE.F)} N으로, 지구를 ${f(M.PEOPLE.a, 1)} m/s²으로 가속하기에 충분하다.</p>
      <p class="hintline">실제 크기의 ${S}배, 힘은 1 N당 ${cm(F_SCALE.coulomb)} cm. 클릭하면 같은 부호 쌍이 나온다.</p>`,
    cam: { target: at('coulomb', 0, 0.1), az: -12, el: 8, dist: 13 }, lit: 'coulomb', scene: 'coulomb', look: {},
    fig: `+${M.PAIR.q1 / M.uC} μC와 −${-M.PAIR.q2 / M.uC} μC`,
  },
  {
    kicker: '9.3', title: '알짜힘', sub: '그리고 평형점',
    body: `
      <p class="lede">전하가 여러 개이면 대상 전하가 받는 각각의 힘을 구한 뒤 벡터로 더한다. 이것이 <b>중첩</b>이다.</p>
      <p>+${f(M.LINE.q0 / M.uC, 1)} μC 시험 전하가 ${cm(M.LINE.D)} cm 떨어진 A(+${M.LINE.qA / M.uC} μC)와 B(+${M.LINE.qB / M.uC} μC) 사이에 있다. 둘 다 시험 전하를 밀어낸다. 두 힘이 평형을 이루는 곳은</p>
      <div class="eq sm"><i>kq</i><sub>A</sub>/<i>x</i>² = <i>kq</i><sub>B</sub>/(<i>d</i> − <i>x</i>)²  →  <i>x</i> = ${cm(M.LINE.xEq)} cm</div>
      <p>평형점은 언제나 <b>더 작은 전하 쪽에 가깝다</b>. 두 전하 사이에 있을 필요도 없다. B를 음전하로 바꾸면 평형점은 B 바깥쪽 ${cm(M.LINE.xEqUnlike)} cm로 옮겨 간다.</p>
      <div class="charts">${chart({ ...R.line, xlabel: '위치 x (cm)', ylabel: 'q₀가 받는 알짜힘 (N)', cursor: 'line', label: '위치에 따른 시험 전하의 알짜힘, 평형점에서 0을 지난다',
        series: [{ pts: curve(10, 40, x => Math.max(Math.min(M.lineForces(x / 100).net[0], 0.3), -0.4)) }], marks: [[M.LINE.xEq * 100, 0, `${cm(M.LINE.xEq)} cm`, 6, -8]] })}</div>
      <p class="hintline">힘은 0.01 N당 ${f(F_SCALE.line, 0)} cm. 클릭하면 시험 전하를 평형점에 세운다.</p>`,
    cam: { target: at('line', 0, 0.3), az: -10, el: 8, dist: 15.5 }, lit: 'line', scene: 'line', look: {},
    fig: 'A와 B 사이의 시험 전하',
  },
  {
    kicker: '9.4', title: '전기장', sub: '단위 전하당 힘',
    body: `
      <p class="lede">전하는 주위 공간을 바꾼다. 작은 양의 <b>시험 전하</b> <i>q</i><sub>0</sub>을 어디에 두든 힘을 받으며, 전기장은 그 힘을 쿨롬당으로 나타낸 것이다.</p>
      <div class="eq"><b>E</b> = <b>F</b>/<i>q</i><sub>0</sub> = (<i>kQ</i>/<i>r</i>²) <b>r̂</b></div>
      <p><b>r̂</b>은 <i>Q</i>에서 멀어지는 방향이다. +<i>Q</i>이면 전기장은 바깥쪽, −<i>Q</i>이면 안쪽을 향한다. 단위는 N/C.</p>
      <table class="data">
        <tr><td><b>전기력선</b></td><td>방향을 나타내고, 촘촘한 정도로 세기를 나타낸다. +에서 시작해 −에서 끝난다</td></tr>
        <tr><td><b>전기장 벡터</b></td><td>크기도 나타낸다. 10, 20, 30 cm에서 ${f(M.pointMag(M.POINT.Q, 0.1), 0)}, ${f(M.pointMag(M.POINT.Q, 0.2), 0)}, ${f(M.pointMag(M.POINT.Q, 0.3), 0)} N/C</td></tr>
      </table>
      <div class="charts">${chart({ ...R.field, xlabel: '거리 r (cm)', ylabel: 'E (kN/C)', cursor: 'field', label: '거리에 따른 전기장 세기, r 제곱에 반비례해 줄어든다',
        series: [{ cls: 'curve total', pts: curve(5, 35, x => clip(M.pointMag(M.POINT.Q, x / 100) / 1000, 4)) }] })}</div>
      <p class="hintline">각 전하를 따로 그렸고 실제 크기의 ${S}배, E는 100 N/C당 ${cm(E_SCALE.field * 100)} cm. +${f(M.POINT.q0 / M.nC, 1)} nC 시험 전하가 받는 힘은 E와 같은 길이로 그렸다. 클릭하면 r̂이 보인다.</p>`,
    cam: { target: at('field', 0, 0.4), az: -8, el: 8, dist: 35 }, lit: 'point', scene: 'point', look: {},
    fig: `+${M.POINT.Q / M.nC} nC와 −${M.POINT.Q / M.nC} nC`,
  },
  {
    kicker: '9.5', title: '전기 쌍극자', sub: '전기장은 벡터로 더한다',
    body: `
      <p class="lede">2<i>a</i> 떨어진 반대 부호의 두 전하 ±<i>q</i>. P에서의 <b>E</b>는 각 전하가 만드는 전기장의 벡터 합이다.</p>
      <p><b>축 위에서는</b> 두 전기장이 모두 축을 따라 놓이고, 더 가까운 전하의 전기장이 이긴다.</p>
      <div class="eq sm"><i>E</i> = <i>kq</i>/(<i>x</i>−<i>a</i>)² − <i>kq</i>/(<i>x</i>+<i>a</i>)² = 4<i>kqax</i>/(<i>x</i>²−<i>a</i>²)²</div>
      <p><b>수직 이등분선 위에서는</b> <i>y</i> 성분이 상쇄되고 <i>x</i> 성분이 더해진다.</p>
      <div class="eq sm"><i>E</i> = 2 · <i>kq</i>/(<i>a</i>²+<i>y</i>²) · cos θ = 2<i>kqa</i>/(<i>a</i>²+<i>y</i>²)<sup>3/2</sup></div>
      <p>멀리서는 각각 4<i>kqa</i>/<i>x</i>³, 2<i>kqa</i>/<i>y</i>³이 된다. 두 전기장이 거의 상쇄되므로 E는 <b>1/<i>r</i>³</b>로 줄어든다.</p>
      <div class="charts">${chart({ ...R.dipole, xlabel: '중심으로부터의 거리 (cm)', ylabel: 'E (kN/C)', cursor: 'dipole', label: '축과 수직 이등분선 위에서 거리에 따른 쌍극자 전기장과 원거리 근사',
        series: [{ cls: 'curve total', pts: curve(20, 50, x => clip(M.dipoleAxis(x / 100) / 1000, 2)), tag: [27, 1.0, '축'] }, { cls: 'curve trend', pts: curve(20, 50, x => clip(4 * M.K * M.DIPOLE.q * M.DIPOLE.a / (x / 100) ** 3 / 1000, 2)) },
          { cls: 'curve total', pts: curve(10, 50, x => clip(M.dipoleBisector(x / 100) / 1000, 2)), tag: [15.5, 0.75, '이등분선'] }, { cls: 'curve trend', pts: curve(14, 50, x => clip(2 * M.K * M.DIPOLE.q * M.DIPOLE.a / (x / 100) ** 3 / 1000, 2)) }] })}</div>
      <p class="hintline">점선: 1/r³. 실제 크기의 ${S}배, E는 100 N/C당 ${cm(E_SCALE.dipole * 100)} cm. 클릭하면 E를 E₊와 E₋로 나눈다.</p>`,
    cam: { target: at('dipole', -0.6, 0.2), az: -10, el: 8, dist: 19 }, lit: 'dipole', scene: 'dipole', look: {},
    fig: `±${M.DIPOLE.q / M.nC} nC, ${cm(2 * M.DIPOLE.a)} cm 간격`,
  },
  {
    kicker: '9.6', title: '대전된 막대', sub: '조각을 모두 더한다',
    body: `
      <p class="lede">막대를 d<i>x</i> 조각으로 자르면 각 조각은 d<i>q</i> = λ d<i>x</i>를 가진다(λ = <i>Q</i>/<i>L</i> = ${f(M.RODE.lambda / M.nC, 0)} nC/m). 각 조각을 점전하로 보고 적분한다.</p>
      <p><b>축 위</b>, 끝에서 <i>a</i>만큼 떨어진 곳에서는</p>
      <div class="eq sm"><i>E</i> = ∫<sub><i>a</i></sub><sup><i>a</i>+<i>L</i></sup> <i>k</i>λ d<i>x</i>/<i>x</i>² = <i>k</i>λ[1/<i>a</i> − 1/(<i>a</i>+<i>L</i>)] = <i>kQ</i>/<i>a</i>(<i>a</i>+<i>L</i>)</div>
      <p><b>수직 이등분선 위</b>, 가운데에서 <i>a</i>만큼 위에서는 <i>x</i> 성분이 상쇄된다.</p>
      <div class="eq sm"><i>E</i> = ∫ <i>k</i>λ<i>a</i> d<i>x</i>/(<i>x</i>²+<i>a</i>²)<sup>3/2</sup> = <i>kQ</i>/<i>a</i>√(<i>L</i>²/4 + <i>a</i>²)</div>
      <p>멀리서(<i>a</i> ≫ <i>L</i>) 둘 다 점전하의 전기장 <i>kQ</i>/<i>a</i>²이 된다. 가운데 가까이(<i>a</i> ≪ <i>L</i>)에서는 2<i>k</i>λ/<i>a</i>이다.</p>
      <div class="charts">${chart({ ...R.rod, xlabel: '거리 a (cm)', ylabel: 'E (kN/C)', cursor: 'rod', label: '축과 수직 이등분선 위에서 거리에 따른 막대의 전기장과 점전하의 전기장',
        series: [{ cls: 'curve total', pts: curve(2, 40, x => clip(M.rodAxis(x / 100) / 1000, 4)), tag: [3.5, 1.5, '축'] }, { cls: 'curve total', pts: curve(3, 40, x => clip(M.rodBisector(x / 100) / 1000, 4)), tag: [13, 2.0, '이등분선'] },
          { cls: 'curve trend', pts: curve(10, 40, x => clip(M.K * M.RODE.Q / (x / 100) ** 2 / 1000, 4)), tag: [24, 0.75, 'kQ/a²'] }] })}</div>
      <p class="hintline">실제 크기의 ${S}배, E는 100 N/C당 ${cm(E_SCALE.rod * 100)} cm. 클릭하면 막대를 ${M.RODE.slices}조각으로 자른다.</p>`,
    cam: { target: at('rod', 0, 1.0), az: -10, el: 8, dist: 21 }, lit: 'rod', scene: 'rod', look: {},
    fig: `${cm(M.RODE.L)} cm 막대 위의 +${M.RODE.Q / M.nC} nC`,
  },
  {
    kicker: '9.7', title: '대전된 고리', sub: '그리고 원판',
    body: `
      <p class="lede">고리의 모든 조각은 축 위의 점 P에서 같은 거리에 있다. 옆 방향 성분은 상쇄되고, 각 조각에서 cos φ = <i>z</i>/√(<i>z</i>²+<i>R</i>²)만큼만 남는다.</p>
      <div class="eq sm"><i>E</i> = ∫<sub>0</sub><sup>2π</sup> <i>k</i>λ<i>R</i> d<i>θ</i> · <i>z</i>/(<i>z</i>²+<i>R</i>²)<sup>3/2</sup> = <i>kQz</i>/(<i>z</i>²+<i>R</i>²)<sup>3/2</sup></div>
      <p>중심에서는 0, 멀리서는 <i>kQ</i>/<i>z</i>²이며, 그 사이 <i>z</i> = <i>R</i>/√2 = ${f(M.RING_ZMAX * 100, 1)} cm에서 최댓값을 가진다.</p>
      <div class="charts">${chart({ ...R.ring, xlabel: '축을 따른 거리 z (cm)', ylabel: 'E (kN/C)', cursor: 'ring', label: '축을 따른 고리의 전기장: 중심에서 0, 최댓값을 지나 줄어든다',
        series: [{ cls: 'curve total', pts: curve(0, 60, x => M.ringAxis(x / 100) / 1000) }, { cls: 'curve trend', pts: curve(31, 60, x => clip(M.K * M.RING.Q / (x / 100) ** 2 / 1000, 1.5)), tag: [44, 0.55, 'kQ/z²'] }], marks: [[M.RING_ZMAX * 100, M.ringAxis(M.RING_ZMAX) / 1000, 'R/√2', 6, -6]] })}</div>
      <p><b>원판</b>은 고리를 겹쳐 놓은 것이다. d<i>q</i> = σ 2π<i>r</i> d<i>r</i>:</p>
      <div class="eq sm"><i>E</i> = (σ/2ε<sub>0</sub>)(1 − <i>z</i>/√(<i>z</i>²+<i>R</i>²))</div>
      <p>중심 바로 위에서는 0이 아니라 σ/2ε<sub>0</sub>이다. P 바로 아래에도 원판의 전하가 있기 때문이다.</p>
      <p class="hintline">실제 크기의 ${S}배, E는 100 N/C당 ${cm(E_SCALE.ring * 100)} cm, d<i>E</i>는 2배. 클릭하면 조각이 보인다.</p>`,
    cam: { target: at('ring', -0.4, 0.5), az: -30, el: 12, dist: 20 }, lit: 'ring', scene: 'ring', look: {},
    fig: `고리 위의 +${(M.RING.Q / M.nC).toFixed(0)} nC, R = ${cm(M.RING.R)} cm`,
  },
  {
    kicker: '9.8', title: '균일한 전기장', sub: '다시 포물선 운동',
    body: `
      <p class="lede">반대 부호로 대전된 커다란 두 판 사이의 전기장은 어디서나 같으며 +에서 −를 향한다. 그 안의 전하는 일정한 힘을 받아 던진 공처럼 움직인다.</p>
      <div class="eq"><i>F</i> = <i>qE</i> = <i>ma</i></div>
      <p>전자가 ${sci(M.PLATES.v0, 1)} m/s로 들어오고, <i>E</i> = ${M.PLATES.E} N/C이다. 전자가 받는 힘은 <b>E</b>와 <i>반대</i> 방향, 곧 + 판 쪽을 향한다.</p>
      <table class="data">
        <tr><td><i>a</i> = <i>eE</i>/<i>m</i><sub>e</sub></td><td>${sci(M.PLATES.a)} m/s², 위쪽</td></tr>
        <tr><td><i>t</i> = <i>L</i>/<i>v</i><sub>0</sub></td><td>${cm(M.PLATES.L)} cm 판 사이에서 ${f(M.PLATES.tCross * 1e9, 1)} ns</td></tr>
        <tr><td><i>y</i> = ½<i>at</i>²</td><td>${f(M.PLATES.yExit * 1000, 2)} mm, ${f(M.PLATES.angle, 1)}°로 빠져나감</td></tr>
      </table>
      <p>양성자라면 반대쪽으로, ${f(M.MP / M.ME, 0)}분의 1만큼만 휜다. ${f(M.PLATES.yProton * 1e6, 1)} μm.</p>
      <div class="charts">${chart({ ...R.plates, xlabel: 'x (cm)', ylabel: 'y (mm)', cursor: 'plates', label: '전자의 경로: 판 사이에서는 포물선, 그 뒤로는 직선',
        series: [{ pts: curve(0, M.PLATES.run, t => [M.electron(t).x * 100, M.electron(t).y * 1000]).map(p => p[1]) }, { cls: 'curve trend', pts: [[M.PLATES.L * 100, 0], [M.PLATES.L * 100, 14]], tag: [M.PLATES.L * 100 - 3.6, 12, '판 끝'] }] })}</div>
      <p class="hintline">약 10⁹배 느리게, 실제 크기의 ${PL.S}배, E는 1 kN/C당 ${f(PL.E * 100 * 1000, 0)} cm. 클릭하면 v<sub>x</sub>, v<sub>y</sub>가 보인다.</p>`,
    cam: { target: at('plates', -0.1, 0.5), az: -10, el: 5, dist: 17 }, lit: 'plates', scene: 'plates', look: {},
    fig: '대전된 판 사이의 전자',
  },
];

// ---------- click a scene: what it breaks into ----------
const ind = s => s.induce;
export const PLATES = {
  atoms: { text: `세 원자 모두 원자핵은 같다. 양성자 6개, +6<i>e</i>. 음이온은 전자 하나를 더 얻었고, 여기서는 그것을 끄집어내 보였다. 양이온은 전자 하나를 잃었고, 윤곽선이 빈자리를 표시한다. 알짜 전하는 언제나 (양성자 수 − 전자 수) × <i>e</i>다. (모식도일 뿐이다. 실제 원자의 지름은 약 10⁻¹⁰ m, 원자핵은 그보다 10만 배 작으며, 전자는 행성처럼 궤도를 돌지 않는다.)`,
    facts: () => M.ATOMS.map(a => [a.name, `${a.p} − ${a.e} = ${a.p - a.e >= 0 ? (a.p - a.e ? '+' : '') : '−'}${Math.abs(a.p - a.e)} e = ${a.p === a.e ? '0' : (a.p > a.e ? '+' : '−') + sci(M.QE)} C`]) },
  induce: { text: `구슬 크기는 구의 표면 전하 밀도 σ다. 막대가 가까이 있고 아무것도 연결되지 않았을 때, σ는 가까운 쪽이 +, 먼 쪽이 −이지만 합하면 여전히 0이다. 전자가 자리만 옮겼기 때문이다. 접지하면 먼 쪽의 전자가 빠져나간다. 남은 전하는 막대에 붙잡혀 있다가, 막대가 떠나면 고르게 퍼진다.`,
    facts: s => { const st = ind(s); return [['단계', st.stage], ['막대 끝에서 중심까지', st.rod ? `${cm(st.dTip)} cm` : '없음'], ['구의 알짜 전하', `${f(st.Qnet / M.nC)} nC`], ['접지 후', `−Σ q R/d = +${f(M.QG / M.nC)} nC`]]; } },
  balloon: { text: `벽은 절연체여서 전자가 분자를 벗어나지 못한다. 각 분자는 늘어나기만 하고, − 끝이 + 풍선 쪽을 향한다. − 끝이 더 가까우므로 그 인력이 + 끝의 척력보다 커서 풍선이 끌려간다. 여기서 늘어나는 정도는 풍선의 전기장에 따라 커진다.`,
    facts: s => { const g = s.balloonGap, r = g + M.BALLOON.r; return [['풍선의 전하', `+${M.BALLOON.q / M.nC} nC`], ['벽까지의 간격', `${f(g * 100, 1)} cm`], ['벽에서 풍선의 전기장', `${kNC(M.K * M.BALLOON.q / (r * r))} kN/C`]]; } },
  coulomb: { text: `아래에는 같은 거리의 같은 부호 쌍이 있으며, 서로 밀어낸다. 두 쌍 모두에서 +4 μC 전하는 작은 전하와 같은 크기의 힘을 받는다. 곱 q₁q₂가 힘의 크기를 정하고, 부호는 인력인지 척력인지를 정한다.`,
    facts: s => { const r = s.pairR; return [['r', `${f(r * 100, 1)} cm`], ['F = k|q₁q₂|/r²', `${f(pairF(r))} N`], ['2r에서의 F', `${f(pairF(2 * r))} N (¼)`], ['다른 부호 쌍', '인력'], ['같은 부호 쌍', '척력']]; } },
  line: { text: `x<sub>eq</sub>에 세우면 두 미는 힘이 크기가 같고 방향이 반대여서 빨간 알짜힘이 사라진다. 어느 쪽으로든 살짝 밀면 더 가까워진 전하가 도로 밀어낸다. 이 직선을 따라서는 안정한 평형점이다. 푸는 방법: (1) 각 힘의 방향을 보고 평형이 가능한 구간을 정한다. (2) 두 힘을 같게 놓고 거리를 구한다. (3) 그 점이 더 작은 전하에 가까운지 확인한다.`,
    facts: () => { const r = M.lineForces(M.LINE.xEq); return [['x<sub>eq</sub>', `A에서 ${cm(M.LINE.xEq)} cm`], ['그곳의 F<sub>A</sub>', `${f(r.FA[0], 3)} N →`], ['그곳의 F<sub>B</sub>', `${f(-r.FB[0], 3)} N ←`], ['알짜힘', `${f(Math.abs(r.net[0]), 3)} N`]]; } },
  point: { text: `시험 전하가 20 cm에서 멈춘다. r̂(회색)은 길이가 1인 단위 벡터로, 전하에서 시험 전하를 지나 바깥쪽을 향한다. 전기장은 <i>kQ</i>/<i>r</i>²에 r̂을 곱한 것이다. −Q이면 같은 식이 −r̂을 주므로, 양의 시험 전하가 받는 힘은 안쪽을 향한다.`,
    facts: () => { const r = 0.2, E = M.pointMag(M.POINT.Q, r); return [['r', `${f(r * 100, 1)} cm`], ['E = kQ/r²', `${f(E, 0)} N/C`], ['F = q₀E', `${sci(M.POINT.q0 * E)} N`], ['r̂', `(cos 22.5°, sin 22.5°) = (${f(Math.cos(M.POINT.ang))}, ${f(Math.sin(M.POINT.ang))})`]]; } },
  dipole: { text: `각 P에서 가는 화살표는 E₊(+q에서 멀어지는 방향)와 E₋(−q를 향하는 방향)다. 축 위에서는 서로 반대 방향이고 더 가까운 쪽이 이긴다. 수직 이등분선 위에서는 크기가 같아서 회색 y 성분은 상쇄되고 x 성분은 더해진다. 어떤 전하 배치에도 통하는 방법: (1) P에서 각 전하의 전기장을 구한다. (2) 대칭으로 상쇄되는 성분을 찾는다. (3) 나머지는 변의 길이로 구한 sin, cos로 계산한다. (4) 더한다.`,
    facts: s => { const x = s.dipoleX, y = s.dipoleY, a = M.DIPOLE.a, k = M.K * M.DIPOLE.q; return [['축: E₊ − E₋', `${f(k / (x - a) ** 2, 0)} − ${f(k / (x + a) ** 2, 0)} = ${f(M.dipoleAxis(x), 0)} N/C`], ['이등분선: 각각', `${f(k / (a * a + y * y), 0)} N/C`], ['이등분선: 2 E cos θ', `${f(M.dipoleBisector(y), 0)} N/C`]]; } },
  rod: { text: `두 P가 모두 가까이 다가온다. 막대를 ${M.RODE.slices}조각으로 떼어 냈고, 각 조각은 점전하 Q/${M.RODE.slices}이다. 위쪽 P에서 이들의 dE 화살표는 대칭으로 펼쳐지므로 옆 방향 성분이 상쇄된다. 이 벡터 합은 이미 적분값에 가깝고, 조각을 더 많이, 더 얇게 하면 정확해진다. 수직 이등분선에서는 ∫x dx/(x²+a²)<sup>3/2</sup> = −1/(x²+a²)<sup>1/2</sup>을 써서 대칭 구간에서 E<sub>x</sub> = 0을 얻고, E<sub>y</sub>에는 ∫dx/(x²+a²)<sup>3/2</sup> = x/a²(x²+a²)<sup>1/2</sup>을 쓴다.`,
    facts: () => { const b = M.RODE.b0, sum = M.sumE(M.rodSlices(M.RODE.slices), [0, b, 0])[1]; return [['a (이등분선)', `${f(b * 100, 1)} cm`], [`${M.RODE.slices}조각의 합`, `${f(sum, 0)} N/C`], ['적분값', `${f(M.rodBisector(b), 0)} N/C`], ['옆 방향', '0, 상쇄']]; } },
  ring: { text: `P가 최댓값 위치 z = R/√2에서 멈춘다. ${M.RING.beads}개 조각은 각각 고리에서 뻗은 자기 직선(점선)을 따라 dE를 만든다. 고리를 한 바퀴 돌면 옆 방향 성분은 모든 방향을 향해 상쇄되고, 축 방향 성분은 모두 더해진다. 모든 조각의 <i>r</i>와 cos φ가 같으므로 θ에 대한 적분은 그냥 2π다. E = 2π<i>k</i>λ<i>Rz</i>/(<i>z</i>²+<i>R</i>²)<sup>3/2</sup> = <i>kQz</i>/(<i>z</i>²+<i>R</i>²)<sup>3/2</sup>. 원판은 이 고리들을 <i>r</i> = 0부터 <i>R</i>까지 ∫<i>r</i> d<i>r</i>/(<i>z</i>²+<i>r</i>²)<sup>3/2</sup> = −1/(<i>z</i>²+<i>r</i>²)<sup>1/2</sup>로 적분한다.`,
    facts: () => { const z = M.RING_ZMAX, dEm = M.K * M.RING.Q / M.RING.beads / (z * z + M.RING.R ** 2); return [['z', `${f(z * 100, 1)} cm`], ['각 dE', `${f(dEm, 0)} N/C`], ['cos φ', f(z / Math.hypot(z, M.RING.R), 3)], ['E = Σ dE cos φ', `${f(M.ringAxis(z), 0)} N/C`]]; } },
  plates: { text: `회색은 속도의 두 성분이다. v<sub>x</sub>는 변하지 않고, v<sub>y</sub>는 전자가 판 사이에 있는 동안 꾸준히 커지다가 그 뒤로는 둘 다 일정하다. 전기장이 중력 역할을 하는 포물선 운동이다. 잔상 윤곽은 같은 시간 간격으로 찍혔다.`,
    facts: s => { const e = M.electron(s.plates.t); return [['t', `${f(s.plates.t * 1e9, 2)} ns`], ['v<sub>x</sub>', `${sci(e.vx)} m/s`], ['v<sub>y</sub>', `${sci(Math.max(e.vy, 1))} m/s`], ['y', `${f(e.y * 1000, 2)} mm`]]; } },
};
