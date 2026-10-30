// The chapter, page by page: text on the left, and for the figure on the right the camera,
// the one lit thing and what is shown. Every number comes from model.js.
import * as M from './model.js';
import { ST, RAIN_V, RIV, PULLS } from './world.js';

const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const tau = M.STROBE;
const deg = r => (r * 180 / Math.PI).toFixed(1);

// ---------- small SVG charts for pages 1.7–1.10 (live parts are updated in main.js) ----------
const CW = 420, CH = 86, CP = { l: 40, r: 12, t: 9, b: 19 };
export const KR = {
  rain: { x0: 0, x1: 30, y0: 0, y1: 90 },
  map: { x0: -2, x1: 16, y0: 0, y1: 24 },
  pa: { x0: 0, x1: 5, y0: 0, y1: 6 }, pv: { x0: 0, x1: 5, y0: 0, y1: 12 }, px: { x0: 0, x1: 5, y0: 0, y1: 45 },
  cx: { x0: 0, x1: 2, y0: -3, y1: 3 }, cv: { x0: 0, x1: 2, y0: -3, y1: 9 }, ca: { x0: 0, x1: 2, y0: 0, y1: 12 },
};
export const KC = {
  sx: (x, R) => CP.l + (x - R.x0) / (R.x1 - R.x0) * (CW - CP.l - CP.r),
  sy: (y, R) => CP.t + (1 - (y - R.y0) / (R.y1 - R.y0)) * (CH - CP.t - CP.b),
};
const samples = (n, a, b, fn) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
function kchart(R, { series, xlabel, ylabel, label, live = '', marks = [] }) {
  const sx = x => KC.sx(x, R), sy = y => KC.sy(y, R);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const zero = R.y0 < 0 ? `<line class="zero" x1="${CP.l}" x2="${CW - CP.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  const fmt = v => (v < 0 ? '−' : '') + Math.abs(v);
  return `<svg class="chart" viewBox="0 0 ${CW} ${CH}" role="img" aria-label="${label}">
    <rect class="frame" x="${CP.l}" y="${CP.t}" width="${CW - CP.l - CP.r}" height="${CH - CP.t - CP.b}"/>${zero}${live}${paths}${mk}
    <text class="ax" x="${CP.l - 6}" y="${sy(R.y1) + 4}" text-anchor="end">${fmt(R.y1)}</text><text class="ax" x="${CP.l - 6}" y="${sy(R.y0) + 4}" text-anchor="end">${fmt(R.y0)}</text>
    <text class="ax" x="${CP.l}" y="${CH - 7}">${R.x0}</text><text class="ax" x="${CW - CP.r}" y="${CH - 7}" text-anchor="end">${R.x1}</text>
    <text class="lab" x="${CP.l + 6}" y="${CP.t + 13}">${ylabel}</text><text class="ax" x="${(CP.l + CW - CP.r) / 2}" y="${CH - 7}" text-anchor="middle">${xlabel}</text>
  </svg>`;
}
// live pieces: a shaded area (filled by main.js), a red tangent, a cursor
const AREA = k => `<path data-area="${k}" style="fill:rgba(229,72,77,.18);stroke:none"/>`;
const TAN = k => `<line data-tan="${k}" style="stroke:#e5484d;stroke-width:1.4"/>`;
const CUR = k => `<circle class="cursor" r="4.5" data-cursor="${k}"/>`;

export const PAGES = [
  {
    kicker: '1장', title: '운동학', sub: '운동의 기술',
    body: `
      <p class="lede">운동학은 세 가지 양으로 운동을 기술한다. 물체가 어디에 있는지, 얼마나 빠르게 움직이는지, 그리고 그것이 어떻게 변하는지다. 왜 그런지는 묻지 않는다.</p>
      <p>이 장의 모든 내용은 ${f(M.VY0)} m/s로 똑바로 위로 던진 공 하나에서 나온다. 손을 떠난 뒤 공에 작용하는 것은 중력뿐이므로 공은 <b>자유 낙하</b> 상태다. 올라갈 때도, 내려올 때도 마찬가지다.</p>
      <p>공은 ${f(M.T / 2)} s 동안 올라가 ${f(M.H)} m 높이에서 멈추고, 던진 지 ${f(M.T)} s 뒤에 떨어진다. 그림은 절반 속도로 재생된다.</p>`,
    cam: { target: [-1.0, 2.7, 0], az: 22, el: 7, dist: 21 }, lit: 'ball', look: { strobe: 1, level: 1 },
    fig: '똑바로 위로 던진 공',
  },
  {
    kicker: '1.1', title: '위치', sub: '변위와 이동 거리',
    body: `
      <p class="lede"><b>위치</b> <i>y</i>는 원점에서 잰 공의 자리다. 여기서 원점은 던진 지점이고, 위쪽이 양의 방향이다.</p>
      <p><b>변위</b> Δ<i>y</i> = <i>y</i><sub>f</sub> − <i>y</i><sub>0</sub>는 위치의 알짜 변화다. 변위는 벡터로, 크기와 방향을 함께 갖는다(축 옆의 검은 화살표).</p>
      <p><b>이동 거리</b>는 경로의 전체 길이다. 스칼라이며 결코 음수가 되지 않는다.</p>
      <table class="data">
        <tr><th></th><th>변위</th><th>이동 거리</th></tr>
        <tr><td>던짐 → 최고점</td><td>+${f(M.H)} m</td><td>${f(M.H)} m</td></tr>
        <tr><td>던짐 → 착지</td><td>0.00 m</td><td>${f(2 * M.H)} m</td></tr>
      </table>`,
    cam: { target: [-0.3, 2.9, 0], az: -16, el: 6, dist: 15 }, lit: 'staff', look: { disp: 1 },
    fig: '위치 축',
  },
  {
    kicker: '1.2', title: '속도', sub: '그리고 속력, 둘은 같지 않다',
    body: `
      <p class="lede"><b>속도</b> <i>v</i> = Δ<i>y</i>/Δ<i>t</i>는 위치가 얼마나 빠르게 변하는지를 방향과 함께 나타낸다. <b>속력</b>은 그 크기이며, 방향이 없다.</p>
      <p>화살표가 속도다. +${f(M.VY0)} m/s에서 시작해 최고점에서 0으로 줄어든 뒤, 아래를 향해 커지다가 착지할 때 −${f(M.VY0)} m/s가 된다. 던질 때와 착지할 때의 속력은 같지만, 속도는 다르다.</p>
      <p>전체 비행의 평균에도 같은 구분이 적용된다.</p>
      <table class="data">
        <tr><td>평균 속도</td><td>Δ<i>y</i>/Δ<i>t</i> = 0 / ${f(M.T)} = 0 m/s</td></tr>
        <tr><td>평균 속력</td><td>이동 거리/Δ<i>t</i> = ${f(2 * M.H)} / ${f(M.T)} = ${f(2 * M.H / M.T)} m/s</td></tr>
      </table>`,
    cam: { target: [0.1, 3.0, 0.2], az: 24, el: 8, dist: 18 }, lit: 'vArrow', look: {},
    fig: '속도',
  },
  {
    kicker: '1.3', title: '가속도', sub: '속도가 변하는 비율',
    body: `
      <p class="lede"><b>가속도</b> <i>a</i> = Δ<i>v</i>/Δ<i>t</i>. 이 공의 가속도는 올라갈 때도, 최고점에서도, 내려올 때도 언제나 −${f(M.G)} m/s²다. 빨간 화살표는 결코 변하지 않는다.</p>
      <p>흐릿한 공들은 ${f(tau, 1)} s마다 한 번씩 찍은 스트로보 사진이다. 올라갈 때 간격은 매번 <i>g</i>τ² = ${f(M.G * tau * tau)} m씩 줄어든다. 내려올 때 상들은 정확히 같은 높이에 놓인다.</p>
      <p><b>빨라지는가, 느려지는가?</b> 부호를 비교한다. <i>v</i>와 <i>a</i>의 부호가 반대이면 공은 느려진다(올라갈 때). 부호가 같으면 빨라진다(내려올 때). 둘 다 가속도다. “감속도”라는 별도의 개념은 없다.</p>
      <p class="live" id="live-sign"></p>`,
    cam: { target: [0.1, 2.75, 0], az: -6, el: 5, dist: 15.5 }, lit: 'aArrow', look: { strobe: 1 },
    fig: '스트로보, ' + tau.toFixed(1) + ' s 간격',
  },
  {
    kicker: '1.4', title: '운동 그래프', sub: '기울기와 넓이',
    body: `
      <p class="lede">세 그래프는 같은 비행을 나타낸다. 위치 그래프는 실제 축척으로 그려져, 그래프의 높이가 곧 공의 실제 높이다.</p>
      <ul class="rules">
        <li><i>x</i>–<i>t</i>의 기울기 = 속도</li>
        <li><i>v</i>–<i>t</i>의 기울기 = 가속도</li>
        <li><i>v</i>–<i>t</i> 그래프 아래 넓이 = 변위</li>
        <li><i>a</i>–<i>t</i> 그래프 아래 넓이 = 속도 변화</li>
      </ul>
      <p>가속도가 일정하면 <i>a</i>–<i>t</i>는 수평선, <i>v</i>–<i>t</i>는 직선, <i>x</i>–<i>t</i>는 포물선이 된다. 각 그래프는 위 그래프보다 “차수”가 하나 낮다.</p>
      <p class="hintline">그래프를 클릭해 기울기와 넓이 보기.</p>`,
    cam: { target: [-7.6, 3.0, -1.0], az: 0, el: 3, dist: 40 }, lit: 'boardX', look: { level: 1 },
    fig: '시간에 따른 위치, 속도, 가속도',
  },
  {
    kicker: '1.5', title: '운동학 방정식', sub: '등가속도일 때만',
    body: `
      <p class="lede">이 운동은 다섯 가지 양 Δ<i>y</i>, <i>v</i><sub>0</sub>, <i>v</i>, <i>a</i>, <i>t</i>로 기술된다. 각 방정식에는 이 중 하나가 빠져 있으므로, 모르면서 구할 필요도 없는 양이 빠진 방정식을 고르면 된다.</p>
      <table class="data eqs">
        <tr><th>방정식</th><th>빠진 양</th></tr>
        <tr><td><i>v</i> = <i>v</i><sub>0</sub> + <i>at</i></td><td>Δ<i>y</i></td></tr>
        <tr><td>Δ<i>y</i> = <i>v</i><sub>0</sub><i>t</i> + ½<i>at</i>²</td><td><i>v</i></td></tr>
        <tr><td><i>v</i>² = <i>v</i><sub>0</sub>² + 2<i>a</i>Δ<i>y</i></td><td><i>t</i></td></tr>
        <tr><td>Δ<i>y</i> = ½(<i>v</i><sub>0</sub> + <i>v</i>)<i>t</i></td><td><i>a</i></td></tr>
        <tr><td>Δ<i>y</i> = <i>vt</i> − ½<i>at</i>²</td><td><i>v</i><sub>0</sub></td></tr>
      </table>
      <p>공은 얼마나 높이 올라가는가? 최고점에서 <i>v</i> = 0이고, <i>t</i>는 필요 없다. 0 = ${f(M.VY0)}² + 2(−${f(M.G)})Δ<i>y</i>이므로 Δ<i>y</i> = ${f(M.H)} m다.</p>`,
    cam: { target: [-3.2, 3.1, -0.4], az: 20, el: 15, dist: 34 }, lit: 'ball', look: { level: 1 },
    fig: '한 번의 비행, 다섯 가지 양',
  },
  {
    kicker: '1.6', title: '포물선 운동', sub: '동시에 일어나는 두 운동',
    body: `
      <p class="lede">두 번째 공을 같은 순간에, 같은 위쪽 속도 ${f(M.VY0)} m/s에 더해 옆으로 ${f(M.VX)} m/s의 속도로 던진다.</p>
      <p>이 공은 내내 첫 번째 공과 같은 높이를 유지하며 같은 순간에 착지한다. 연직 운동은 자유 낙하이고, 옆으로의 속력은 연직 운동을 바꾸지 않는다. 바닥에 비친 그림자는 ${f(M.VX * tau)} m씩 같은 간격으로 움직인다. 수평 운동은 등속 운동이다.</p>
      <table class="data cols">
        <tr><th>수평 · 등속</th><th>연직 · 자유 낙하</th></tr>
        <tr><td><i>v</i><sub>x</sub> = ${f(M.VX)} m/s</td><td><i>v</i><sub>0</sub> = ${f(M.VY0)} m/s, <i>v</i> = −${f(M.VY0)} m/s</td></tr>
        <tr><td>Δ<i>x</i> = <i>v</i><sub>x</sub><i>t</i> = ${f(M.RANGE, 1)} m</td><td><i>a</i> = −${f(M.G)} m/s², Δ<i>y</i> = 0</td></tr>
        <tr><td><i>t</i> = ${f(M.T)} s</td><td><i>t</i> = ${f(M.T)} s</td></tr>
      </table>
      <p>최고점에서는 연직 성분 <i>v</i><sub>y</sub>만 0이다. 공은 여전히 옆으로 ${f(M.VX)} m/s로 움직인다.</p>`,
    cam: { target: [4.6, 2.7, 0.6], az: -16, el: 13, dist: 33 }, lit: 'projV', look: { proj: 1, comp: 1 },
    fig: '매 순간 같은 높이',
  },
  {
    kicker: '1.7', title: '기준틀', sub: '속도는 누가 보느냐에 달려 있다',
    body: `
      <p class="lede">모든 속도는 무언가에 대해 측정된다. 빗방울은 도로에 대해 ${f(M.RAIN.vr, 1)} m/s로 똑바로 떨어지지만, ${f(M.RAIN.vc, 1)} m/s로 달리는 자동차에서 보면 ${f(M.vlen(M.V_RC))} m/s로 비스듬히 떨어진다.</p>
      <p>“B에 대한 A”의 속도를 <i>v</i><sub>AB</sub>로 쓴다(R 비, C 자동차, G 지면). 속도는 안쪽 글자를 맞추어 사슬처럼 이어진다.</p>
      <div class="eq"><i>v</i><sub>AC</sub> = <i>v</i><sub>AB</sub> + <i>v</i><sub>BC</sub></div>
      <p>따라서 <i>v</i><sub>RC</sub> = <i>v</i><sub>RG</sub> + <i>v</i><sub>GC</sub>이고, 화살표의 머리에 꼬리를 이어 더한다. 글자를 서로 바꾸면 화살표가 뒤집힌다. 자동차에서 보면 도로는 뒤로 움직이며, <i>v</i><sub>GC</sub> = −<i>v</i><sub>CG</sub>다. 두 성분은 서로 직각이므로 |<i>v</i><sub>RC</sub>| = √(${f(M.RAIN.vc, 1)}² + ${f(M.RAIN.vr, 1)}²) = ${f(M.vlen(M.V_RC))} m/s이고, tan θ = ${f(M.RAIN.vc, 1)}/${f(M.RAIN.vr, 1)}에서 연직으로부터 θ = ${f(M.RAIN_ANGLE, 1)}° 기울어 있다. 자동차가 빠를수록 더 많이 기운다.</p>
      <div class="charts">${kchart(KR.rain, { xlabel: '자동차 속력 (m/s)', ylabel: '연직에서 기운 각 θ (°)', label: '자동차에서 본 빗줄기의 기울기와 자동차 속력의 관계',
        series: [{ pts: samples(60, 0, 30, M.rainAngleAt) }], marks: [[M.RAIN.vc, M.RAIN_ANGLE, `${f(M.RAIN_ANGLE, 1)}°`, 8, 16]] })}</div>
      <p class="hintline">1:1 축척. 화살표는 1 m/s당 ${(RAIN_V * 100).toFixed(0)} cm. ¼ 속도. 삼각형을 클릭해 각도 보기.</p>`,
    cam: { target: [ST.rain + 11, 2.3, 0], az: -8, el: 10, dist: 60 }, lit: 'rainSum', look: {}, scene: 'rain',
    fig: '같은 비, 두 기준틀',
  },
  {
    kicker: '1.8', title: '강 건너기', sub: '머리에 꼬리를 이어 더하는 두 속도',
    body: `
      <p class="lede">강가에 대한 배의 속도는 물에 대한 배의 속도에 강가에 대한 물의 속도를 더한 것이다.</p>
      <div class="eq"><i>v</i><sub>BS</sub> = <i>v</i><sub>BW</sub> + <i>v</i><sub>WS</sub></div>
      <p>두 배 모두 ${f(M.RIVER.vw, 1)} m/s로 흐르는 물을 ${f(M.RIVER.vb, 1)} m/s로 헤치며 폭 ${M.RIVER.w} m의 강을 건넌다.</p>
      <table class="data">
        <tr><th>m/s, s, m</th><th>똑바로 건너편을 향함</th><th>상류 쪽으로 ${deg(M.AIM_UP)}° 향함</th></tr>
        <tr><td>속력</td><td>√(${f(M.RIVER.vb, 1)}² + ${f(M.RIVER.vw, 1)}²) = ${f(M.vlen(M.vBS(0)))}</td><td>√(${f(M.RIVER.vb, 1)}² − ${f(M.RIVER.vw, 1)}²) = ${f(M.vlen(M.vBS(M.AIM_UP)))}</td></tr>
        <tr><td>시간</td><td>${M.RIVER.w}/${f(M.RIVER.vb, 1)} = ${f(M.crossTime(0), 1)} s</td><td>${M.RIVER.w}/${f(M.vBS(M.AIM_UP)[1], 1)} = ${f(M.crossTime(M.AIM_UP), 1)} s</td></tr>
        <tr><td>떠밀린 거리</td><td>${f(M.RIVER.vw, 1)} × ${f(M.crossTime(0), 1)} = ${f(M.drift(0), 1)} m</td><td>0 m</td></tr>
      </table>
      <p>배를 건너편으로 보내는 것은 강을 가로지르는 성분뿐이므로, 똑바로 건너편을 향하는 것이 가장 빠르다. 물살은 배를 하류로 실어 갈 뿐이다. 정확히 맞은편에 닿으려면 sin θ = ${f(M.RIVER.vw, 1)}/${f(M.RIVER.vb, 1)}이 될 때까지 상류 쪽으로 돌린다.</p>
      <div class="charts">${kchart(KR.map, { xlabel: '하류 방향 (m)', ylabel: '가로지른 거리 (m)', label: '위에서 본 두 배의 경로',
        live: CUR('boatA') + CUR('boatB'), series: [{ pts: [[0, 0], [M.drift(0), M.RIVER.w]], tag: [8.6, 12.5, '똑바로 건너편'] }, { pts: [[0, 0], [0, M.RIVER.w]], tag: [0.3, 3, '상류 쪽'] }] })}</div>
      <p class="hintline">1 m를 ${(RIV.s * 100).toFixed(0)} cm로 그림. 화살표는 1 m/s당 ${(RIV.v * 100).toFixed(0)} cm. ${M.RIVER.rate}× 속도로 재생.</p>`,
    cam: { target: [ST.river - 1.7, 0, 0.3], az: -4, el: 44, dist: 40 }, lit: 'boatA', look: {}, scene: 'river',
    fig: '향한 쪽과 실려 가는 쪽',
  },
  {
    kicker: '1.9 · AP 물리 C', title: '미적분으로 보는 운동학', sub: '가속도가 변할 때',
    body: `
      <p class="lede">1.5의 방정식은 <i>a</i>가 일정해야 쓸 수 있다. 이 자동차의 가속도 <i>a</i> = ${f(M.PULL.a0, 1)} − ${f(M.PULL.k, 1)}<i>t</i> m/s²는 <i>t</i><sub>1</sub> = ${f(M.T1)} s에서 0으로 줄어들므로, 대신 적분한다. 자동차는 출발선에서 정지 상태로 출발한다. <i>v</i><sub>0</sub> = 0, <i>x</i><sub>0</sub> = 0.</p>
      <div class="eq"><i>v</i> = <i>v</i><sub>0</sub> + ∫<i>a</i> d<i>t</i> = ${f(M.PULL.a0, 1)}<i>t</i> − ${f(M.PULL.k / 2)}<i>t</i>² &nbsp;→ ${f(M.V1, 1)} m/s</div>
      <div class="eq"><i>x</i> = <i>x</i><sub>0</sub> + ∫<i>v</i> d<i>t</i> = ${f(M.PULL.a0 / 2, 1)}<i>t</i>² − ${f(M.PULL.k / 6)}<i>t</i>³ &nbsp;→ ${f(M.X1, 1)} m</div>
      <div class="charts">
        ${kchart(KR.pa, { xlabel: 't (s)', ylabel: 'a (m/s²) · 넓이 = Δv', label: '시간에 따른 가속도, 넓이 음영 표시', live: AREA('pa') + CUR('pa'), series: [{ pts: samples(100, 0, 5, M.pa) }] })}
        ${kchart(KR.pv, { xlabel: 't (s)', ylabel: 'v (m/s) · 넓이 = Δx, 기울기 = a', label: '시간에 따른 속도, 넓이 음영 표시', live: AREA('pv') + TAN('pv') + CUR('pv'), series: [{ pts: samples(100, 0, 5, M.pv) }] })}
        ${kchart(KR.px, { xlabel: 't (s)', ylabel: 'x (m) · 기울기 = v', label: '시간에 따른 위치와 그 접선', live: TAN('px') + CUR('px'), series: [{ pts: samples(100, 0, 5, M.px) }] })}
      </div>
      <p class="hintline">음영 = 적분, 빨간색 = 미분. 1 m를 ${(PULLS.s * 100).toFixed(0)} cm로 그림.</p>`,
    cam: { target: [ST.pull + 4.4, 0.3, 0], az: -8, el: 24, dist: 22 }, lit: 'pull', look: {}, scene: 'pull',
    fig: 'a = ' + M.PULL.a0.toFixed(1) + ' − ' + M.PULL.k.toFixed(1) + 't',
  },
  {
    kicker: '1.10 · AP 물리 C', title: 'x(t)에서 운동 구하기', sub: '미분해 내려가고, 적분해 올라간다',
    body: `
      <p class="lede"><i>x</i>(<i>t</i>)가 주어지면 미분한다. <i>x</i> = <i>t</i>³ − 3<i>t</i>이면</p>
      <div class="eq"><i>v</i> = 3<i>t</i>² − 3 &nbsp;&nbsp; <i>a</i> = 6<i>t</i></div>
      <p>입자는 ${f(-M.cv(0))} m/s로 왼쪽으로 출발해 <i>t</i> = ${f(M.T_TURN)} s, <i>x</i> = ${f(M.cx(M.T_TURN))} m에서 방향을 바꾼다. 2 s 동안 변위는 ${f(M.cx(2))} m, 이동 거리는 ${f(M.cdist(2))} m다.</p>
      <p><b>거꾸로 올라가려면</b> 초기 조건이 필요하다. <i>a</i> = 6<i>t</i>로부터 <i>v</i> = 3<i>t</i>² + <i>C</i><sub>1</sub>, <i>x</i> = <i>t</i>³ + <i>C</i><sub>1</sub><i>t</i> + <i>C</i><sub>2</sub>이고, <i>v</i>(0) = −3과 <i>x</i>(0) = 0에서 <i>C</i><sub>1</sub> = −3, <i>C</i><sub>2</sub> = 0이다.</p>
      <div class="charts">
        ${kchart(KR.cx, { xlabel: 't (s)', ylabel: 'x (m) · 기울기 = v', label: '시간에 따른 위치', live: TAN('cx') + CUR('cx'), series: [{ pts: samples(100, 0, 2, M.cx) }] })}
        ${kchart(KR.cv, { xlabel: 't (s)', ylabel: 'v (m/s) · 넓이 = Δx', label: '시간에 따른 속도, 부호 있는 넓이 음영 표시', live: AREA('cv') + CUR('cv'), series: [{ pts: samples(100, 0, 2, M.cv) }] })}
        ${kchart(KR.ca, { xlabel: 't (s)', ylabel: 'a (m/s²) · 넓이 = Δv', label: '시간에 따른 가속도, 넓이 음영 표시', live: AREA('ca') + CUR('ca'), series: [{ pts: samples(100, 0, 2, M.ca) }] })}
      </div>
      <p class="hintline">0.2 s 간격. 되돌아오는 경로는 앞쪽에 그렸다.</p>`,
    cam: { target: [ST.cube + 0.25, 0.25, 0], az: -6, el: 28, dist: 19.5 }, lit: 'bead', look: {}, scene: 'cube',
    fig: 'x = t³ − 3t',
  },
];

// ---------- click a concept: what it breaks into ----------
const sign = v => v > 1e-9 ? '+' : v < -1e-9 ? '−' : '';
export const PLATES = {
  ball: { text: `자유 낙하하는 공. 던진 뒤에는 아무것도 공을 위로 밀지 않는다. 공이 올라가는 것은 아직 위로 움직이고 있기 때문이며, 중력은 그 속도를 매초 ${M.G.toFixed(2)} m/s씩 바꾼다.`,
    facts: t => [['시간', `${t.toFixed(2)} s`], ['위치 y', `${M.y(t).toFixed(2)} m`], ['속도 v', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['가속도 a', `−${M.G.toFixed(2)} m/s²`]] },
  staff: { text: `세로선은 위치 축이다. 0은 던진 지점이다. 짧은 눈금은 공의 높이를 따라 움직이고, 검은 화살표는 0으로부터의 변위다. 공이 착지하면 공이 ${(2 * M.H).toFixed(2)} m를 이동했는데도 변위는 0으로 돌아간다.`,
    facts: t => [['위치 y', `${M.y(t).toFixed(2)} m`], ['변위', `${sign(M.y(t))}${Math.abs(M.y(t)).toFixed(2)} m`], ['지금까지 이동 거리', `${M.distance(t).toFixed(2)} m`]] },
  vArrow: { text: `화살표의 길이는 속력이고, 방향은 속도의 부호다. 일정한 축척으로 그렸으므로 두 배 빠르면 두 배 길다.`,
    facts: t => [['속도', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['속력', `${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['방향', M.vy(t) > 1e-9 ? '위' : M.vy(t) < -1e-9 ? '아래' : '없음(한순간)']] },
  aArrow: { text: `가속도는 매 순간 같으므로 이 화살표는 결코 변하지 않는다. 공이 빨라지는지 느려지는지는 속도의 부호가 이 화살표와 같은지 다른지에 달려 있다.`,
    facts: t => [['가속도', `−${M.G.toFixed(2)} m/s²`], ['속도', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['따라서 공은', M.vy(t) > 1e-9 ? '느려지는 중' : M.vy(t) < -1e-9 ? '빨라지는 중' : '최고점']] },
  boardX: { text: `빨간 선은 이 순간의 접선이다. 그 기울기(세로 변화 ÷ 가로 변화)가 속도다. 던질 때는 가파르고, 최고점에서는 평평하며, 착지할 때는 반대쪽으로 가파르다.`,
    facts: t => [['기울기 = v', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`]] },
  boardV: { text: `직선이므로 기울기(가속도)가 일정하다. 선과 0 사이의 음영 넓이가 지금까지의 변위다. 0 아래 넓이는 음수로 세므로, 착지할 때 두 절반이 상쇄된다.`,
    facts: t => [['기울기 = a', `−${M.G.toFixed(2)} m/s²`], ['넓이 = Δy', `${sign(M.areaUnderV(t))}${Math.abs(M.areaUnderV(t)).toFixed(2)} m`]] },
  boardA: { text: `수평선, 곧 등가속도다. 음영 넓이는 지금까지의 속도 변화 a·t다.`,
    facts: t => [['넓이 = Δv', `${t > 0 ? '−' : ''}${(M.G * t).toFixed(2)} m/s`], ['v = v₀ + Δv', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`]] },
  proj: { text: `동시에 일어나는 서로 독립적인 두 운동이다. 옆으로는 등속 운동, 위아래로는 자유 낙하. 각각은 고유한 방정식을 갖는 1차원 문제다. 둘이 공유하는 것은 시간뿐이다.`,
    facts: t => [['x', `${M.x(t).toFixed(2)} m`], ['y', `${M.y(t).toFixed(2)} m`], ['시간', `${t.toFixed(2)} s`]] },
  projV: { text: `속도 화살표는 결코 변하지 않는 수평 성분과, 첫 번째 공의 속도와 똑같이 행동하는 연직 성분으로 나뉜다. 둘을 머리에 꼬리를 이어 더하면 원래 화살표가 된다.`,
    facts: t => [['vₓ', `${M.VX.toFixed(2)} m/s`], ['v_y', `${sign(M.vy(t))}${Math.abs(M.vy(t)).toFixed(2)} m/s`], ['속력 √(vₓ² + v_y²)', `${Math.hypot(M.VX, M.vy(t)).toFixed(2)} m/s`]] },
  shadow: { text: `바로 위에서 비추는 빛은 운동을 바닥에 납작하게 투영한다. 남는 것은 수평 운동이다. 옆으로는 아무것도 작용하지 않으므로 같은 시간 동안 같은 간격만큼 움직인다.`,
    facts: t => [['지금까지 Δx', `${M.x(t).toFixed(2)} m`], ['간격(' + M.STROBE.toFixed(1) + ' s마다)', `${(M.VX * M.STROBE).toFixed(2)} m`]] },
  rainRoad: { text: `도로에서 보면 빗방울은 각각 ${M.RAIN.vr.toFixed(1)} m/s로 똑바로 떨어지고, 자동차는 그 아래를 ${M.RAIN.vc.toFixed(1)} m/s로 지나간다. 여기서는 아무것도 기울어 있지 않다.`,
    facts: () => [['자동차, v_CG', `앞쪽으로 ${M.RAIN.vc.toFixed(2)} m/s`], ['비, v_RG', `아래쪽으로 ${M.RAIN.vr.toFixed(2)} m/s`], ['빗방울의 경로', '연직']] },
  rainCar: { text: `자동차에서 보면 자동차는 정지해 있다. 도로는 ${M.RAIN.vc.toFixed(1)} m/s로 뒤로 흘러가고, 모든 빗방울은 아래로의 운동을 유지하면서 도로와 함께 뒤로도 움직이므로 빗줄기가 기운다.`,
    facts: () => [['비, v_RC', `${M.vlen(M.V_RC).toFixed(2)} m/s`], ['연직에서 기운 각', `${M.RAIN_ANGLE.toFixed(1)}°`], ['도로, v_GC', `뒤쪽으로 ${M.RAIN.vc.toFixed(2)} m/s`], ['자동차', '0 m/s']] },
  rainSum: { text: `머리에 꼬리 잇기: 지면에 대한 비의 속도에서 시작해, 자동차에 대한 지면의 속도를 더한다. 첫 꼬리에서 마지막 머리까지 그은 화살표가 자동차에서 본 비다.`,
    facts: () => [['앞쪽 성분', `${M.V_RC[0].toFixed(2).replace('-', '−')} m/s`], ['위쪽 성분', `${M.V_RC[1].toFixed(2).replace('-', '−')} m/s`], ['|v_RC|', `${M.vlen(M.V_RC).toFixed(2)} m/s`], ['tan θ = 10.0 / 7.0', `θ = ${M.RAIN_ANGLE.toFixed(1)}°`]] },
  river: { text: `물은 강가에 대해 ${M.RIVER.vw.toFixed(1)} m/s로 움직인다. 이 나뭇잎이나 배처럼 떠 있는 것은 무엇이든, 물을 헤치는 자체 운동에 더해 그 속력으로 실려 간다.`,
    facts: (t, s) => [['물살, v_WS', `하류 쪽으로 ${M.RIVER.vw.toFixed(2)} m/s`], ['강폭', `${M.RIVER.w} m`], ['시간', `${s.river.t.toFixed(1)} s`]] },
  boatA: { text: `똑바로 건너편을 향하면 w/v_b = ${M.crossTime(0).toFixed(1)} s 만에 맞은편에 닿는다. 가능한 가장 빠른 시간이지만, 물살이 배를 하류로 ${M.drift(0).toFixed(1)} m 실어 간다. 배는 한쪽을 향하지만 다른 쪽으로 움직인다.`,
    facts: (t, s) => boatFacts(0, s.river.t) },
  boatB: { text: `상류 쪽으로 ${deg(M.AIM_UP)}° 돌리면 상류 방향 성분(${M.RIVER.vb.toFixed(1)} sin θ = ${M.RIVER.vw.toFixed(1)} m/s)이 물살을 상쇄한다. 배는 정확히 맞은편에 닿지만, 건너는 데 남은 속력이 ${M.vBS(M.AIM_UP)[1].toFixed(1)} m/s뿐이어서 ${M.crossTime(M.AIM_UP).toFixed(1)} s가 걸린다.`,
    facts: (t, s) => boatFacts(M.AIM_UP, s.river.t) },
  pull: { text: `가속도가 일정하지 않으므로 1.5의 운동학 방정식은 적용되지 않는다. 속도는 지금까지의 a–t 그래프 아래 넓이이고, 위치는 v–t 그래프 아래 넓이다. 윤곽선 사이의 간격은 계속 커지지만 커지는 정도는 매번 줄어들어, a = 0이 되면 간격이 같아진다.`,
    facts: (t, s) => { const u = s.pull.t; return [['시간', `${u.toFixed(2)} s`], ['x = ∫v dt', `${M.px(u).toFixed(2)} m`], ['v = ∫a dt', `${M.pv(u).toFixed(2)} m/s`], ['a', `${M.pa(u).toFixed(2)} m/s²`]]; } },
  pullA: { text: `a = ${M.PULL.a0.toFixed(1)} − ${M.PULL.k.toFixed(1)}t: v–t 그래프의 기울기로, t₁ = ${M.T1.toFixed(2)} s에서 0이 될 때까지 꾸준히 줄어든다. 그 변화율 da/dt = −${M.PULL.k.toFixed(1)} m/s³을 저크(jerk)라고 한다.`,
    facts: (t, s) => { const u = s.pull.t; return [['a = dv/dt', `${M.pa(u).toFixed(2)} m/s²`], ['da/dt', u < M.T1 ? `−${M.PULL.k.toFixed(2)} m/s³` : '0'], ['지금까지의 넓이 = v', `${M.pv(u).toFixed(2)} m/s`]]; } },
  bead: { text: `x = t³ − 3t. 한 번 미분하면 속도, 두 번 미분하면 가속도다. 방향을 바꾸는 순간 v = 0이지만 a = ${M.ca(M.T_TURN).toFixed(1)} m/s²다. 속도가 0이라고 가속도가 0인 것은 아니다.`,
    facts: (t, s) => { const u = s.cube.t, v = M.cv(u), a = M.ca(u); return [['시간', `${u.toFixed(2)} s`], ['x', `${f(M.cx(u))} m`], ['v = 3t² − 3', `${f(v)} m/s`], ['a = 6t', `${f(a)} m/s²`], ['따라서', Math.abs(v) < 0.02 ? '방향을 바꾸는 중' : v * a > 0 ? '빨라지는 중' : a === 0 ? 'a = 0(한순간)' : '느려지는 중']]; } },
  cubeLine: { text: `검은 화살표는 출발점으로부터의 변위다. 입자는 왼쪽으로 2 m 갔다가 오른쪽으로 4 m 간다. 2 s에서 변위는 +2 m이지만 이동 거리는 6 m다.`,
    facts: (t, s) => { const u = s.cube.t; return [['위치 x', `${f(M.cx(u))} m`], ['변위', `${f(M.cx(u))} m`], ['지금까지 이동 거리', `${M.cdist(u).toFixed(2)} m`]]; } },
};
function boatFacts(phi, t) {
  const tt = Math.min(t, M.crossTime(phi)), [dx, dy] = M.boatPos(phi, t);
  return [['시간', `${tt.toFixed(1)} s`], ['가로지른 거리', `${dy.toFixed(1)} / ${M.RIVER.w} m`], ['하류 쪽', `${Math.abs(dx) < 0.05 ? '0.0' : dx.toFixed(1)} m`], ['속력 |v_BS|', `${M.vlen(M.vBS(phi)).toFixed(2)} m/s`], ['도착', `${M.crossTime(phi).toFixed(1)} s, 하류로 ${Math.abs(M.drift(phi)) < 0.05 ? '0.0' : M.drift(phi).toFixed(1)} m`]];
}

