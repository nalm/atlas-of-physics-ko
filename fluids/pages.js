// Chapter 8, page by page (AP Physics 1, Unit 8: fluids). Text and charts on the left page; on the
// right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, SC, PY6, PY7 } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const kPa = (p, n = 1) => `${f(p / 1000, n)} kPa`;

// ---------- small SVG charts for the left page, with live cursors ----------
const W = 420, P = { l: 44, r: 14, t: 16, b: 30 };
export const CURSORS = {};       // key → (x, y) → [cx, cy]
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label, h = 170, ylabels, xlabels }) {
  const H = h;
  const sx = x => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy = y => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
  for (const c of cursors) CURSORS[c] = (x, y) => [sx(x), sy(y)];
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const [yt, yb] = ylabels || [y1, y0], [xl, xr] = xlabels || [x0, x1];
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${yt}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${yb}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${xl}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${xr}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(c => `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${c}"/>`).join('')}
  </svg>`;
}
const sample = (fn, a, b, n = 120) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });

// Bernoulli's energy per volume at the three points, as stacked bars
function bernBars() {
  const H = 150, top = 85, sy = v => P.t + (1 - v / top) * (H - P.t - P.b), bw = 60;
  const cols = M.BERN.pts.map((p, k) => {
    const x = P.l + 40 + k * 120; let y0 = 0, out = '';
    for (const [val, fill] of [[p.P, '#ecece8'], [p.K / 1000 * 1000, '#8fb0f0'], [p.U, '#9c9ca2']]) {
      const v = val / 1000; if (v > 0.01) out += `<rect x="${x}" y="${sy(y0 + v)}" width="${bw}" height="${sy(y0) - sy(y0 + v)}" fill="${fill}" stroke="#8a8a8f" stroke-width=".8"/>`; y0 += v;
    }
    return out + `<text class="lab" x="${x + bw / 2}" y="${H - 9}" text-anchor="middle">점 ${k + 1}</text>`;
  }).join('');
  const tot = sy(M.BERN.E / 1000);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="세 점에서의 단위 부피당 에너지: 압력, 운동 에너지, 퍼텐셜 에너지 부분의 합은 항상 같다">
    <line class="grid" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>${cols}
    <line class="trend" x1="${P.l}" x2="${W - P.r}" y1="${tot}" y2="${tot}"/><text class="lab" x="${W - P.r}" y="${tot - 6}" text-anchor="end">합계 ${f(M.BERN.E / 1000, 0)} kPa</text>
    <text class="ax" x="${P.l - 6}" y="${sy(top) + 4}" text-anchor="end">${top}</text><text class="ax" x="${P.l - 6}" y="${sy(0) + 4}" text-anchor="end">0</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">kPa = kJ/m³: P (연한색) + ½ρv² (파랑) + ρgy (회색)</text>
  </svg>`;
}

const at = (k, dx = 0, dy = 0.5, dz = 0) => [STATIONS[k] + dx, dy, dz];
const Bp = M.BERN.pts;

export const PAGES = [
  {
    kicker: '8장', title: '유체', sub: '밀도',
    body: `
      <p class="lede"><b>유체</b>는 흐르는 모든 것, 곧 액체나 기체다. 분자가 제자리에 고정되어 있지 않으므로 그릇의 모양을 따른다. 유체는 단위 부피당 질량인 <b>밀도</b>로 기술한다:</p>
      <div class="eq">ρ = <i>m</i> / <i>V</i></div>
      <p>이 다섯 정육면체는 모두 한 변이 10 cm로 각각 1.0 L이다: 부피는 같지만 질량은 코르크 ${f(M.MATERIALS[0].mass)} kg에서 철 ${f(M.MATERIALS[4].mass)} kg까지 크게 다르다. 질량-부피 그래프에서 각 물질은 기울기가 밀도인 직선이다.</p>
      <p>밀도는 물체가 아니라 물질의 성질이다: 정육면체를 반으로 자르면 <i>m</i>과 <i>V</i>가 모두 절반이 된다. <b>이상 유체</b>는 압축되지 않으며(밀도가 결코 변하지 않으며) 마찰 없이 흐른다. 물은 이에 매우 가깝다.</p>
      <div class="charts">${chart({ x0: 0, x1: 1, y0: 0, y1: 3, xlabel: '부피 (L)', ylabel: '질량 (kg): 기울기 = ρ', label: '다섯 물질의 부피에 따른 질량: 기울기가 밀도인 직선', h: 150,
        series: M.MATERIALS.map(m => ({ pts: [[0, 0], [Math.min(1, 3 / m.mass), Math.min(m.mass, 3)]], tag: { cork: [0.78, 0.24, '코르크'], ice: [0.62, 0.95, '얼음, 물'], water: null, al: [0.66, 1.8, '알루미늄'], iron: [0.4, 2.3, '철'] }[m.key] })) })}</div>
      <p class="hintline">정육면체를 클릭하면 각각 여덟 조각으로 자른다.</p>`,
    cam: { target: at('density', 0, 0.06), az: -14, el: 16, dist: 3.4 }, lit: 'blocks', scene: 'density', look: {},
    fig: '1리터 정육면체 다섯 개',
  },
  {
    kicker: '8.1', title: '압력', sub: '넓이에 퍼진 힘',
    body: `
      <p class="lede"><b>압력</b>은 면을 수직으로 미는 힘을 넓이로 나눈 것이다:</p>
      <div class="eq"><i>P</i> = <i>F</i><sub>⊥</sub> / <i>A</i></div>
      <p>압력은 스칼라이며 파스칼로 잰다: 1 Pa = 1 N/m². 같은 ${M.PERSON.m} kg인 사람(${f(M.PERSON.W, 0)} N)이 눈 위에 두 번 선다:</p>
      <table class="data">
        <tr><th></th><th>넓이</th><th>압력</th></tr>
        <tr><td>신발</td><td>${f(M.SHOE.A, 3)} m²</td><td>${kPa(M.P_SHOE)}</td></tr>
        <tr><td>설피</td><td>${f(M.SNOWSHOE.A, 2)} m²</td><td>${kPa(M.P_SNOW, 2)}</td></tr>
      </table>
      <p>넓이가 여덟 배면 압력은 8분의 1이므로 눈이 버틴다. 못은 반대로 작동한다: 넓이 1 cm²인 머리를 ${M.NAIL.F} N으로 밀면 넓이 0.5 mm²인 끝은 나무를 ${f(M.NAIL.F / M.NAIL.tip / 1e6, 0)} MPa로 누른다.</p>
      <div class="charts">${chart({ x0: 0, x1: 0.5, y0: 0, y1: 30, xlabel: '접촉 넓이 (m²)', ylabel: 'P = W/A (kPa)', label: '같은 무게에서 접촉 넓이에 따른 압력: P는 1/A로 줄어든다', h: 118,
        series: [{ pts: sample(A => Math.min(M.PERSON.W / A / 1000, 30), 0.0229, 0.5) }], marks: [[M.SHOE.A, M.P_SHOE / 1000, '신발'], [M.SNOWSHOE.A, M.P_SNOW / 1000, '설피', -40, -10]] })}</div>
      <p class="hintline">화살표: 눈을 누르는 힘, 125 cm²마다 하나, kPa당 ${f(SC.shoeP * 1e5, 1)} cm. 클릭하면 사람들을 들어 올린다.</p>`,
    cam: { target: at('pressure', 0, 0.9), az: -18, el: 12, dist: 10.5 }, lit: 'feet', scene: 'pressure', look: {},
    fig: '같은 무게, 더 넓은 넓이',
  },
  {
    kicker: '8.2', title: '압력과 깊이', sub: '위에 있는 물의 무게',
    body: `
      <p class="lede">물속에서 압력은 위에 있는 물의 무게에서 생긴다. 높이 <i>h</i>, 넓이 <i>A</i>인 물기둥의 무게는 ρ<i>Ah g</i>이므로, 윗면의 압력에 ρ<i>gh</i>를 더한다:</p>
      <div class="eq"><i>P</i> = <i>P</i><sub>0</sub> + ρ<i>gh</i></div>
      <p><i>P</i><sub>0</sub> = ${kPa(M.P0)}는 수면을 누르는 대기압이다. <i>P</i>는 <b>절대</b> 압력이고, ρ<i>gh</i>만 따로 떼면 대기압을 넘는 부분인 <b>계기</b> 압력이다. 물이 ${f(M.P0 / (M.RHO * M.G), 1)} m 깊어질 때마다 약 1기압씩 더해진다: 10 m에서 잠수부는 ${kPa(M.pAt(10), 0)}를 느낀다.</p>
      <p>같은 깊이에서 압력은 주변 물의 모양과 상관없이 모든 방향으로 같다.</p>
      <div class="charts">${chart({ x0: 0, x1: 12, y0: 0, y1: 240, xlabel: '깊이 h (m)', ylabel: '압력 (kPa)', cursors: ['depth', 'gauge'], label: '깊이에 따른 절대 압력과 계기 압력: 평행한 두 직선', h: 150,
        series: [{ pts: [[0, M.P0 / 1000], [12, M.pAt(12) / 1000]], tag: [7.4, M.pAt(7.4) / 1000 + 4, '절대 압력'] }, { cls: 'trend', pts: [[0, 0], [12, M.gauge(12) / 1000]], tag: [8.6, M.gauge(8.6) / 1000 - 32, '계기 압력 ρgh'] }] })}</div>
      <p class="hintline">화살표: kPa당 ${f(SC.lakeP * 1e5, 1)} cm. 잠수부를 클릭하면 위에 있는 물기둥을 볼 수 있다.</p>`,
    cam: { target: at('depth', 0.2, 6.4), az: -12, el: 6, dist: 44 }, lit: 'diver', scene: 'depth', look: {},
    fig: '1 m에서 10 m 깊이까지 내려가는 잠수부',
  },
  {
    kicker: '8.3', title: '파스칼 원리', sub: '모든 곳에 전해지는 압력',
    body: `
      <p class="lede">그릇에 갇힌 액체를 누르면, 늘어난 압력은 줄어들지 않고 액체의 모든 부분과 모든 벽에 전달된다. 이것이 <b>파스칼 원리</b>다.</p>
      <p>작은 피스톤을 ${M.PASCAL.F1} N으로 누르면 모든 곳에서 압력이 Δ<i>P</i> = <i>F</i><sub>1</sub>/<i>A</i><sub>1</sub> = ${kPa(M.PASCAL.dP, 2)}만큼 늘어난다. 넓이가 ${f(M.PASCAL.A2 / M.PASCAL.A1, 0)}배인 큰 피스톤 아래에서는 같은 Δ<i>P</i>가 ${f(M.PASCAL.F2, 0)} N의 힘을 내며, 이는 ${f(M.PASCAL.load, 1)} kg을 떠받치기에 충분하다:</p>
      <div class="eq"><i>F</i><sub>1</sub>/<i>A</i><sub>1</sub> = <i>F</i><sub>2</sub>/<i>A</i><sub>2</sub></div>
      <p>공짜는 없다. 물은 압축되지 않으므로 왼쪽에서 밀려 내려간 부피만큼 오른쪽에서 올라온다: <i>A</i><sub>1</sub><i>d</i><sub>1</sub> = <i>A</i><sub>2</sub><i>d</i><sub>2</sub>. 큰 피스톤은 ${f(M.PASCAL.A2 / M.PASCAL.A1, 0)}배 적게 움직이므로, 들어간 일과 나온 일이 같다: <i>F</i><sub>1</sub><i>d</i><sub>1</sub> = <i>F</i><sub>2</sub><i>d</i><sub>2</sub>.</p>
      <table class="data">
        <tr><th></th><th>넓이</th><th>힘</th><th>이동 거리</th></tr>
        <tr><td>작은 피스톤</td><td>${f(M.PASCAL.A1 * 1e4, 0)} cm²</td><td>${M.PASCAL.F1} N</td><td>${f(M.PASCAL.stroke * 100, 0)} cm</td></tr>
        <tr><td>큰 피스톤</td><td>${f(M.PASCAL.A2 * 1e4, 0)} cm²</td><td>${f(M.PASCAL.F2, 0)} N</td><td>${f(M.PASCAL.stroke * 100 * M.PASCAL.A1 / M.PASCAL.A2, 0)} cm</td></tr>
      </table>
      <p class="hintline">작은 화살표 하나는 ${f(M.PASCAL.A1 * 1e4, 0)} cm² 면 하나에 작용하는 Δ<i>P</i>다: 작은 피스톤 아래에 하나, 큰 피스톤 아래에 열여섯 개. 클릭하면 모든 벽에 작용하는 Δ<i>P</i>를 볼 수 있다.</p>`,
    cam: { target: at('pascal', -0.15, 0.8), az: -18, el: 14, dist: 7.2 }, lit: 'pascal', scene: 'pascal', look: {},
    fig: '같은 ΔP, 열여섯 배의 넓이',
  },
  {
    kicker: '8.4', title: '부력', sub: '아르키메데스 원리',
    body: `
      <p class="lede">물은 잠긴 물체의 모든 면을 밀며, 깊은 곳일수록 더 세게 민다. 옆면을 미는 힘들은 상쇄되고, 아랫면을 밀어 올리는 힘이 윗면을 밀어 내리는 힘보다 크다. 그 차이가 <b>부력</b>이다.</p>
      <p>한 변이 <i>s</i>인 정육면체에서: (<i>P</i><sub>bottom</sub> − <i>P</i><sub>top</sub>)<i>s</i>² = ρ<i>gs</i>·<i>s</i>² = ρ<i>Vg</i>, 곧 정육면체가 밀어낸 물의 무게다:</p>
      <div class="eq"><i>F</i><sub>b</sub> = ρ<sub>fluid</sub> <i>V</i><sub>displaced</sub> <i>g</i></div>
      <p>부력은 정육면체가 물에 들어갈수록 커지다가, 완전히 잠기면 깊이와 상관없이 ${f(M.BUOY.Fb, 0)} N으로 일정하다. 나머지는 줄이 떠받친다: <b>겉보기 무게</b>는 ${f(M.BUOY.W, 0)} N이 아니라 <i>T</i> = <i>W</i> − <i>F</i><sub>b</sub> = ${f(M.BUOY.W - M.BUOY.Fb, 0)} N이다.</p>
      <div class="charts">${chart({ x0: -0.35, x1: 0.75, y0: 0, y1: 900, xlabel: '아랫면의 깊이 (m)', ylabel: '힘 (N)', cursors: ['fb', 'T'], label: '정육면체가 잠긴 깊이에 따른 부력과 줄의 장력', h: 140, xlabels: ['−0.35', '0.75'],
        series: [{ pts: sample(d => M.buoy(M.BUOY.L0 - d).Fb, -0.35, 0.75), tag: [0.45, M.BUOY.Fb + 10, 'F_b'] }, { pts: sample(d => M.buoy(M.BUOY.L0 - d).T, -0.35, 0.75), tag: [0.45, M.BUOY.W - M.BUOY.Fb + 10, 'T = W − F_b'] }, { cls: 'trend', pts: [[-0.35, M.BUOY.W], [0.75, M.BUOY.W]], tag: [0.6, M.BUOY.W + 10, 'W'] }] })}</div>
      <p class="hintline">계기 압력: kPa당 ${f(SC.buoyP * 1e5, 1)} cm; 힘: N당 ${f(SC.buoyF * 1000, 1)} mm. 클릭하면 각 면이 받는 전체 힘을 볼 수 있다.</p>`,
    cam: { target: at('buoy', 0, 0.95), az: -20, el: 8, dist: 6.8 }, lit: 'cube', scene: 'buoy', look: {},
    fig: `줄에 매달린 ${f(M.BUOY.s * 100, 0)} cm 알루미늄 정육면체`,
  },
  {
    kicker: '8.5', title: '뜨기와 가라앉기', sub: '밀도 비교',
    body: `
      <p class="lede">물체의 밀도가 물보다 작으면, 밀어낸 물의 무게가 물체의 무게와 같아질 때까지만 가라앉는다: ρ<sub>fluid</sub><i>V</i><sub>under</sub><i>g</i> = ρ<sub>obj</sub><i>Vg</i>, 따라서</p>
      <div class="eq"><i>V</i><sub>under</sub> / <i>V</i> = ρ<sub>obj</sub> / ρ<sub>fluid</sub></div>
      <table class="data">
        <tr><th></th><th>ρ (kg/m³)</th><th>결과</th></tr>
        <tr><td>나무 토막</td><td>${M.WOOD.rho}</td><td>뜬다, ${f(100 * M.WOOD.draft / M.WOOD.s, 0)}% 잠김</td></tr>
        <tr><td>얼음</td><td>${M.ICE.rho}</td><td>뜬다, ${f(100 * M.ICE.draft / M.ICE.s, 1)}% 잠김</td></tr>
        <tr><td>강철 공</td><td>${M.BALL.rho}</td><td>가라앉는다</td></tr>
        <tr><td>강철 배 (평균)</td><td>${f(M.SHIP.avg, 0)}</td><td>뜬다, ${f(M.SHIP.draft * 100, 1)} cm 잠김</td></tr>
      </table>
      <p>바닷물에 뜬 빙산은 ${f(100 * M.fractionUnder(917, M.RHO_SEA), 0)}%가 잠겨 있다. 공의 <i>F</i><sub>b</sub> = ${f(M.BALL.Fb, 0)} N은 무게 ${f(M.BALL.W, 0)} N에 미치지 못하므로, 나머지는 바닥이 밀어 올린다. 배는 공기를 담도록 모양을 만든 강철이다.</p>
      <div class="charts">${chart({ x0: 0, x1: 1.5, y0: 0, y1: 1.15, xlabel: 'ρ_object / ρ_water', ylabel: '물에 잠긴 비율', label: '밀도비에 따른 잠긴 비율: 밀도비와 같다가 1에 이르면 가라앉는다', h: 104, ylabels: ['', '0'],
        series: [{ pts: [[0, 0], [1, 1], [1.5, 1]], tag: [1.02, 1.0, '가라앉음 →'] }], marks: [[M.SHIP.avg / 1000, M.SHIP.avg / 1000, '배'], [0.6, 0.6, '나무'], [0.917, 0.917, '얼음', -26, -8]] })}</div>
      <p class="hintline">힘: N당 ${f(SC.floatF * 1000, 1)} mm. 클릭하면 밀려난 물을 들어 올려 보여 준다.</p>`,
    cam: { target: at('float', 0.15, 0.55), az: -10, el: 9, dist: 12.5 }, lit: 'float', scene: 'float', look: {},
    fig: '나무, 얼음, 강철 공, 강철 배',
  },
  {
    kicker: '8.6', title: '연속 방정식', sub: '들어간 만큼 나온다',
    body: `
      <p class="lede">물은 압축되지 않고 관은 새지 않으므로, 매초 모든 단면을 같은 부피가 지나간다. 이것이 <b>부피 흐름률</b> <i>Q</i> = <i>Av</i>이다:</p>
      <div class="eq"><i>A</i><sub>1</sub><i>v</i><sub>1</sub> = <i>A</i><sub>2</sub><i>v</i><sub>2</sub></div>
      <p>관이 반지름의 절반, 곧 넓이의 4분의 1로 좁아지므로 물은 네 배 빨라진다: ${f(M.FLOW.v1, 1)} m/s에서 ${f(M.FLOW.v2, 1)} m/s로. <i>Q</i>는 어디서나 ${f(M.FLOW.Q * 1000, 0)} L/s이다.</p>
      <p>짙은 색 물 조각을 따라가 보라: 넓은 부분에서는 짧고 굵으며, 좁은 부분에서는 같은 부피가 길고 가늘다. 호스 끝을 엄지로 막는 것도 같은 원리다.</p>
      <div class="charts">${chart({ x0: 0, x1: 0.3, y0: 0, y1: 3, xlabel: '단면적 A (m²)', ylabel: '속력 v = Q/A (m/s)', cursors: ['flow'], label: '단면적에 따른 속력: v는 1/A로 줄어든다', h: 150,
        series: [{ pts: sample(A => Math.min(M.FLOW.Q / A, 3), M.FLOW.Q / 3, 0.3) }], marks: [[M.FLOW.A1, M.FLOW.v1, 'A₁', -6, -10], [M.FLOW.A2, M.FLOW.v2, 'A₂']] })}</div>
      <p class="hintline">속도: m/s당 ${f(SC.flowV * 100, 0)} cm. 관을 클릭하면 두 단면을 꺼내 보여 준다.</p>`,
    cam: { target: at('continuity', 0, PY6 + 0.1), az: -12, el: 14, dist: 14 }, lit: 'pipe', scene: 'continuity', look: {},
    fig: '넓이는 4분의 1, 속력은 네 배',
  },
  {
    kicker: '8.7', title: '베르누이', sub: '유체의 에너지 보존',
    body: `
      <p class="lede">관을 따라 흐르는 물 한 덩이를 따라가 보자. 물이 빨라지는 곳에서는 무언가가 그것을 앞으로 밀어야 한다: 뒤의 압력이 앞의 압력보다 높아야 한다. 그래서 <b>빠른 흐름은 낮은 압력을 뜻한다</b>.</p>
      <p>흐름을 따라 단위 부피당 에너지는 보존된다(이상 유체, 정상 흐름):</p>
      <div class="eq"><i>P</i> + ½ρ<i>v</i>² + ρ<i>gy</i> = 일정</div>
      <table class="data">
        <tr><th></th><th><i>v</i></th><th><i>y</i></th><th><i>P</i> (계기)</th></tr>
        ${Bp.map((p, k) => `<tr><td>${k + 1} ${['넓고 낮음', '좁고 낮음', '넓고 높음'][k]}</td><td>${f(p.v, 1)} m/s</td><td>${f(p.y, 1)} m</td><td>${kPa(p.P)}</td></tr>`).join('')}
      </table>
      <div class="charts">${bernBars()}</div>
      <p class="hintline">실제 속력의 절반으로 재생. 압력: kPa당 ${f(SC.bernP * 1e5, 1)} cm. 클릭하면 막대를 관 옆에 세운다.</p>`,
    cam: { target: at('bernoulli', 0.8, PY7 + 0.6), az: -12, el: 10, dist: 24.5 }, lit: 'bernoulli', scene: 'bernoulli', look: {},
    fig: '좁은 곳에서 빠르게, 높은 곳에서 느리게',
  },
  {
    kicker: '8.8', title: '토리첼리 법칙', sub: '구멍에서 나오는 물줄기',
    body: `
      <p class="lede">물이 수면에서 <i>h</i> 아래에 있는 구멍으로 빠져나간다. 열린 수면(대기압, 거의 정지)에서 물줄기(역시 대기압)까지 베르누이 방정식을 적용하면 압력 항이 상쇄되어 ρ<i>gh</i> = ½ρ<i>v</i>²만 남으므로</p>
      <div class="eq"><i>v</i> = √(2<i>gh</i>)</div>
      <p><i>h</i>만큼 자유 낙하한 물방울과 같은 속력이다. 여기서 <i>h</i>는 처음에 ${f(M.TANK.h0, 1)} m이므로 <i>v</i> = ${f(M.torricelli(M.TANK.h0))} m/s이다. 탱크의 물이 빠지면서 <i>h</i>와 <i>v</i>는 함께 줄어든다.</p>
      <p>구멍을 나오면 모든 물방울은 포물체다: 수평으로 <i>v</i>로 움직이면서 ${f(M.jetFlight, 3)} s 동안 ${f(M.TANK.yh, 2)} m 떨어진다. 수평 도달 거리는 <i>v t</i> = 2√(<i>h y</i><sub>hole</sub>)로, 탱크가 가득 찼을 때 ${f(M.jetRange(M.TANK.h0))} m이다.</p>
      <div class="charts">${chart({ x0: 0, x1: 1.2, y0: 0, y1: 5, xlabel: '구멍 위 물의 높이 h (m)', ylabel: '물줄기 속력 v (m/s)', cursors: ['tank'], label: '물 높이에 따른 물줄기 속력: 2gh의 제곱근', h: 150,
        series: [{ pts: sample(h => M.torricelli(h), 0, 1.2) }] })}</div>
      <p class="hintline">속도: m/s당 ${f(SC.jetV * 100, 0)} cm. 탱크를 클릭하면 물방울의 속도를 분해한다.</p>`,
    cam: { target: at('torricelli', -0.05, 1.15), az: -14, el: 10, dist: 10 }, lit: 'tank', scene: 'torricelli', look: {},
    fig: '구멍으로 물이 빠지는 탱크',
  },
];

// ---------- click a scene: what it breaks into ----------
const b4 = s => s.st4;
export const PLATES = {
  blocks: { text: `각 정육면체가 작은 정육면체 여덟 개로 나뉜다. 각 조각은 질량도 8분의 1, 부피도 8분의 1이므로 밀도는 같다. 밀도는 양이 얼마나 되는지가 아니라 물질 자체의 성질이다.`,
    facts: () => M.MATERIALS.map(m => [`${m.name}: ${f(m.mass / 8, 3)} kg / 0.125 L`, `${m.rho} kg/m³`]) },
  feet: { text: `사람들이 들려 올라가고 눈 위에 접촉면만 남는다. 전체 힘은 두 경우 모두 ${f(M.PERSON.W, 0)} N으로 같다. 설피는 그 힘을 여덟 배 넓이에 퍼뜨리므로, 각 면은 8분의 1의 세기로 눌린다.`,
    facts: () => [['무게 W', `${f(M.PERSON.W, 0)} N`], ['신발: W / A', `${f(M.PERSON.W, 0)} / ${f(M.SHOE.A, 3)} = ${kPa(M.P_SHOE)}`], ['설피: W / A', `${f(M.PERSON.W, 0)} / ${f(M.SNOWSHOE.A, 2)} = ${kPa(M.P_SNOW, 2)}`], ['비', `${f(M.P_SHOE / M.P_SNOW, 0)}×`]] },
  diver: { text: `짙은 물기둥은 잠수부 바로 위에 있는, 단면적 1 m²인 물이다. 그 무게를 1 m²에 퍼뜨린 것이 계기 압력 ρgh이다. 위에 대기압을 더하면 절대 압력이 된다. 아래에서 오는 화살표는 위에서 오는 화살표보다 조금 길다: 잠수부의 발이 머리보다 깊이 있기 때문이다.`,
    facts: s => { const d = M.diveDepth(s.clock); return [['깊이 h', `${f(d, 2)} m`], ['물기둥 무게 ρ(1 m²)h g', `${f(M.gauge(d) / 1000, 1)} kN`], ['계기 압력 ρgh', kPa(M.gauge(d))], ['절대 압력 P₀ + ρgh', kPa(M.pAt(d))], ['기압 단위로', `${f(M.pAt(d) / M.P0, 2)} atm`]]; } },
  pascal: { text: `누른 힘 때문에 늘어난 압력은 모든 벽과 두 피스톤에서 같다. 다른 것은 그 압력이 작용하는 넓이다: 큰 피스톤 아래는 넓이가 열여섯 배이므로 힘도 열여섯 배다.`,
    facts: s => { const p = M.pascal(s.clock); return [['모든 곳의 ΔP', kPa(M.PASCAL.dP, 2)], ['F₁ = ΔP·A₁', `${M.PASCAL.F1} N`], ['F₂ = ΔP·A₂', `${f(M.PASCAL.F2, 0)} N`], ['작은 피스톤 하강 d₁', `${f(p.d1 * 100, 1)} cm`], ['큰 피스톤 상승 d₂', `${f(p.d2 * 100, 2)} cm`], ['일 F₁d₁ = F₂d₂', `${f(M.PASCAL.F1 * p.d1, 2)} J`]]; } },
  cube: { text: `각 면의 화살표들이 그 면이 받는 전체 힘, 곧 면의 중심에 작용하는 <i>P</i>·<i>A</i>로 바뀐다. 네 옆면의 힘은 둘씩 상쇄된다. 아랫면의 힘에서 윗면의 힘을 뺀 것이 부력이며, 정육면체가 밀어낸 물의 무게와 같다.`,
    facts: s => { const b = b4(s), A = M.BUOY.s ** 2, top = M.gaugeAtY(b.yb + M.BUOY.s, b.L) * A, bot = M.gaugeAtY(b.yb, b.L) * A;
      return [['아랫면을 밀어 올리는 힘', `${f(bot, 1)} N`], ['윗면을 밀어 내리는 힘', `${f(top, 1)} N`], ['F_b = 아랫면 − 윗면', `${f(bot - top, 1)} N`], ['ρ V_under g', `${f(b.Fb, 1)} N`], ['장력 T = W − F_b', `${f(b.T, 1)} N`], ['수면 상승', `${f((b.L - M.BUOY.L0) * 1000, 1)} mm`]]; } },
  float: { text: `파란 덩어리는 각 물체가 밀어낸 물을 들어 올린 것이다. 뜨는 물체의 경우 그 무게는 물체의 무게와 정확히 같다. 강철 공은 자기 부피 전체만큼 물을 밀어내지만 그래도 모자란다.`,
    facts: () => [['나무: W = F_b', `${f(M.WOOD.W, 0)} N`], ['얼음: W = F_b', `${f(M.ICE.W, 0)} N`], ['강철 공: W, F_b', `${f(M.BALL.W, 0)} N, ${f(M.BALL.Fb, 0)} N`], ['배: W = F_b', `${f(M.SHIP.W, 0)} N (강철 ${f(M.SHIP.m, 1)} kg)`]] },
  pipe: { text: `두 단면이 미끄러져 나온다. 매초 ${f(M.FLOW.Q * 1000, 0)} L가 두 단면을 모두 지나간다: ${f(M.FLOW.A1, 3)} m²를 ${f(M.FLOW.v1, 1)} m/s로, 그리고 ${f(M.FLOW.A2, 3)} m²를 ${f(M.FLOW.v2, 1)} m/s로.`,
    facts: s => { const A = M.PIPE1.area(s.slab6); return [['A₁v₁', `${f(M.FLOW.A1, 4)} × ${f(M.FLOW.v1, 1)} = ${f(M.FLOW.Q, 4)} m³/s`], ['A₂v₂', `${f(M.FLOW.A2, 4)} × ${f(M.FLOW.v2, 1)} = ${f(M.FLOW.Q, 4)} m³/s`], ['짙은 조각: A', `${f(A, 4)} m²`], ['그 속력 Q/A', `${f(M.FLOW.Q / A, 2)} m/s`]]; } },
  bernoulli: { text: `각 점 뒤에 그 점의 단위 부피당 에너지가 서 있다: 압력(연한색), 운동 에너지 ½ρv²(파랑), 퍼텐셜 에너지 ρgy(회색). 각 부분은 서로 주고받지만 막대의 높이는 항상 같다. 같은 주고받음이 날개를 들어 올린다: 휘어진 윗면 위의 공기가 더 빠르게 움직이므로, 위에서 누르는 압력이 아래에서 미는 압력보다 작다.`,
    facts: () => Bp.map((p, k) => [`점 ${k + 1}: P + ½ρv² + ρgy`, `${f(p.P / 1000, 1)} + ${f(p.K / 1000, 1)} + ${f(p.U / 1000, 1)} = ${f((p.P + p.K + p.U) / 1000, 1)} kPa`]) },
  tank: { text: `점선은 현재 속력으로 나간 물의 경로다. 구멍을 떠난 지 0.25 s 된 물방울은 떠날 때의 수평 속력 v를 그대로 가지며(회색, 수평), 아래쪽으로 g·t의 속도를 얻었다(회색, 아래).`,
    facts: s => { const h = s.h8, v = M.torricelli(h); return [['h', `${f(h)} m`], ['v = √(2gh)', `${f(v)} m/s`], ['½v² = gh', `${f(0.5 * v * v, 2)} = ${f(M.G * h, 2)} J/kg`], ['낙하 시간', `${f(M.jetFlight, 3)} s`], ['수평 도달 거리', `${f(M.jetRange(h))} m`]]; } },
};
