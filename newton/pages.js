// Chapter 2, page by page (after the AP Physics 1 organizer, Unit 3). Text and a chart on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, KN_SCALE, F_SCALE, TUG_SCALE, DRAG_SCALE, HONEY_SCALE } from './world.js';

const f = (x, n = 2) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(n);
const at = (k, dy = 0.5) => [STATIONS[k], dy, 0];
const TG = M.TUG, BD = M.BOARD, DR = M.DRAG, HN = M.HONEY;

// ---------- small SVG charts for the left page ----------
const W = 420, H = 170, P = { l: 44, r: 14, t: 16, b: 30 };
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursor, label }) {
  const sx = x => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy = y => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
  const paths = series.map(s => `<path class="${s.cls || 'curve'}" d="${s.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('')}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + 6}" y="${sy(y) + 14}">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${y1}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${String(y0).replace('-', '−')}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${x0}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${x1}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursor ? `<circle class="cursor" r="4.5" data-cursor="${cursor}"/>` : ''}
  </svg>`;
}
export const CH = { sx: (x, x0, x1) => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy: (y, y0, y1) => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b) };

const frictionChart = chart({
  x0: 0, x1: 12, y0: 0, y1: 12, xlabel: '가한 힘 (N)', ylabel: '마찰력 (N)', cursor: 'friction', label: '가한 힘에 따른 마찰력',
  series: [{ pts: [[0, 0], [M.F_SMAX, M.F_SMAX]], tag: [2.2, 2.2, '정지: f = F'] }, { pts: [[M.F_SMAX, M.F_K], [12, M.F_K]], tag: [5.6, M.F_K - 1.6, '운동: μk·FN →'] }, { cls: 'trend', pts: [[M.F_SMAX, M.F_SMAX], [M.F_SMAX, M.F_K]] }],
  marks: [[M.F_SMAX, M.F_SMAX, `${f(M.F_SMAX)} N`]],
});

export const PAGES = [
  {
    kicker: '2장', title: '뉴턴의 운동 법칙', sub: '무엇이 운동을 바꾸는가',
    body: `
      <p class="lede">운동학은 운동을 기술했다. 동역학은 운동을 설명한다. <b>힘</b>은 밀거나 당기는 작용이며, 운동을 바꾸는 것이 바로 힘이다.</p>
      <p>힘은 벡터이며, 물체의 중심에서 뻗어 나가는 화살표로 그린다. 1 뉴턴은 1 kg에 1 m/s²의 가속도를 주는 힘이다. 이 ${f(M.M1, 1)} kg 블록에는 두 힘이 작용한다.</p>
      <table class="data">
        <tr><th>힘</th><th>기호</th><th>여기서</th></tr>
        <tr><td>무게(중력)</td><td><i>F</i><sub>g</sub> = <i>mg</i></td><td>아래쪽 ${f(M.W1, 1)} N</td></tr>
        <tr><td>수직 항력(면)</td><td><i>F</i><sub>N</sub></td><td>위쪽 ${f(M.FN, 1)} N</td></tr>
        <tr><td>장력(줄)</td><td><i>T</i></td><td>—</td></tr>
        <tr><td>마찰력</td><td><i>f</i></td><td>—</td></tr>
        <tr><td>항력(공기)</td><td><i>F</i><sub>d</sub></td><td>—</td></tr>
      </table>
      <p>언제나 <b>자유 물체 도형</b>부터 그린다. 물체는 점으로, 물체에 작용하는 모든 힘은 화살표로 나타낸다. 블록을 클릭해 확인해 보자.</p>`,
    cam: { target: at('rest', 0.45), az: -30, el: 12, dist: 9 }, lit: 'rest', scene: 'rest', look: {},
    fig: '정지해 있는 블록',
  },
  {
    kicker: '2.1', title: '장력', sub: '줄은 당길 수만 있다',
    body: `
      <p class="lede"><b>장력</b> <i>T</i>는 줄이나 밧줄이 줄 방향으로 당기는 힘이다. 줄은 당길 수는 있지만 결코 밀 수는 없다.</p>
      <p>왼쪽에서는 ${f(M.M1, 1)} kg 블록이 줄 하나에 매달려 있다. 블록은 평형 상태이므로 <i>T</i> = <i>mg</i> = ${f(M.W1, 1)} N이다.</p>
      <p>오른쪽에서는 두 줄이 무게를 나누어 진다. 블록을 떠받치는 것은 두 장력의 연직 성분뿐이므로 2<i>T</i> sin θ = <i>mg</i>이고</p>
      <div class="eq"><i>T</i> = <i>mg</i> / (2 sin θ)</div>
      <p>줄이 평평해질수록 θ가 작아지고 장력은 커진다. 70°에서 ${f(M.tension2(70), 1)} N, 30°에서 ${f(M.tension2(30), 1)} N, 20°에서 ${f(M.tension2(20), 1)} N이다. 빨랫줄을 완벽하게 곧게 당길 수 없는 까닭이 여기에 있다. 수평 성분끼리는 서로 상쇄된다.</p>
      <div class="charts">${chart({ x0: 10, x1: 90, y0: 0, y1: 60, xlabel: '줄의 각도 θ (°)', ylabel: '각 줄의 장력 (N)', cursor: 'tension', label: '줄의 각도에 따른 장력',
        series: [{ pts: Array.from({ length: 41 }, (_, i) => { const d = 12 + i * 1.95; return [d, Math.min(M.tension2(d), 60)]; }) }] })}</div>
      <p class="hintline">줄을 클릭해 각 장력을 성분으로 나누어 보기.</p>`,
    cam: { target: [STATIONS.tension, 1.5, 0], az: -10, el: 5, dist: 11 }, lit: 'tension', scene: 'tension', look: {},
    fig: '줄 하나, 그리고 둘',
  },
  {
    kicker: '2.2', title: '제1법칙', sub: '관성',
    body: `
      <p class="lede">0이 아닌 <b>알짜힘</b>이 작용하지 않는 한, 정지한 물체는 계속 정지해 있고 직선으로 움직이는 물체는 같은 속도로 계속 움직인다.</p>
      <p>이 블록은 마찰 없는 면 위를 ${f(M.V_GLIDE, 1)} m/s로 미끄러진다. 무게와 수직 항력이 상쇄되므로 Σ<i>F</i> = 0이고, 아무것도 블록의 운동을 바꾸지 않는다. 스트로보 상들의 간격이 고르다.</p>
      <p><b>평형</b>은 Σ<i>F</i> = 0을 뜻한다. 정지해 있는 것뿐 아니라 일정한 속도로 움직이는 것도 평형이다. 물체가 계속 움직이게 <i>유지하는</i> 데에는 아무것도 필요 없다.</p>
      <div class="charts">${chart({ x0: 0, x1: 2.4, y0: 0, y1: 3.6, xlabel: '시간 (s)', ylabel: '위치 (m)', label: '시간에 따른 위치: 직선', series: [{ pts: [[0, 0], [2.4, 3.6]] }] })}</div>`,
    cam: { target: at('glide', 0.45), az: -18, el: 14, dist: 12 }, lit: 'glide', scene: 'glide', look: {},
    fig: '일정한 속도, 알짜힘 0',
  },
  {
    kicker: '2.3', title: '수평 비행', sub: '움직이지만 평형 상태',
    body: `
      <p class="lede">${M.PLANE.m} kg 비행기가 ${M.PLANE.v} m/s의 일정한 속력으로 수평으로, 직선을 따라 순항한다. 속도가 변하지 않으므로 제1법칙에 따라 알짜힘은 0이다.</p>
      <table class="data">
        <tr><td>양력(위쪽, 날개가 받는 힘)</td><td>${(M.PLANE.L / 1000).toFixed(2)} kN</td></tr>
        <tr><td>무게(아래쪽)</td><td>${(M.PLANE.W / 1000).toFixed(2)} kN</td></tr>
        <tr><td>추력(앞쪽, 프로펠러가 내는 힘)</td><td>${(M.PLANE.T / 1000).toFixed(2)} kN</td></tr>
        <tr><td><b>항력</b>(뒤쪽, 공기가 가하는 힘)</td><td>${(M.PLANE.D / 1000).toFixed(2)} kN</td></tr>
      </table>
      <p><b>항력</b>은 유체 속을 지나는 운동에 맞서 유체가 가하는 힘이다. 항력은 속력에 따라 커지며, 대략 <i>F</i><sub>d</sub> = ½<i>DρAv</i>²이다(<i>D</i>는 항력 계수, <i>A</i>는 흐름을 마주하는 면적). 엔진은 비행기를 계속 움직이게 할 필요가 없다. 항력을 상쇄하기만 하면 된다.</p>
      <p class="hintline">여기서 화살표는 1킬로뉴턴당 ${(KN_SCALE * 100).toFixed(0)} cm로 그렸다.</p>`,
    cam: { target: [STATIONS.plane, 3.0, 0], az: -26, el: 9, dist: 34 }, lit: 'plane', scene: 'plane', look: {},
    fig: '양력 = 무게, 추력 = 항력',
  },
  {
    kicker: '2.4', title: '제2법칙', sub: 'ΣF = ma',
    body: `
      <p class="lede">알짜힘은 그 방향으로 크기 Σ<i>F</i>/<i>m</i>의 가속도를 일으킨다.</p>
      <p>마찰 없는 면 위의 두 블록이 똑같이 ${f(M.PUSH, 1)} N으로 밀린다. ${f(M.M1, 1)} kg 블록은 ${f(M.A1, 1)} m/s²로 가속한다. 질량이 두 배인 ${f(M.M2, 1)} kg 블록은 그 절반인 ${f(M.A2, 1)} m/s²로 가속한다.</p>
      <p>힘이 클수록 가속도가 크다. 질량이 클수록 가속도가 작다.</p>
      <div class="charts">${chart({ x0: 0, x1: 12, y0: 0, y1: 6, xlabel: '알짜힘 (N)', ylabel: '가속도 (m/s²)', label: '2 kg과 4 kg 블록의 알짜힘에 따른 가속도', series: [{ pts: [[0, 0], [12, 6]], tag: [9, 4.5, '2 kg'] }, { pts: [[0, 0], [12, 3]], tag: [9.6, 2.4, '4 kg'] }], marks: [[M.PUSH, M.A1, '3.0'], [M.PUSH, M.A2, '1.5']] })}</div>`,
    cam: { target: [STATIONS.second + 1.2, 0.4, 0], az: -22, el: 20, dist: 12 }, lit: 'second', scene: 'second', look: {},
    fig: '2 kg과 4 kg에 가한 같은 6.0 N',
  },
  {
    kicker: '2.5', title: '무엇이 자동차를 미는가?', sub: '도로가 민다',
    body: `
      <p class="lede">엔진은 바퀴를 돌리지만, 엔진은 자동차의 일부이며 어떤 것도 스스로를 밀 수는 없다. 자동차에 작용하는 앞쪽 힘은 <b>도로</b>에서 온다. 바로 타이어에 작용하는 정지 마찰력이다.</p>
      <p>타이어는 도로를 뒤로 민다. 제3법칙에 따라 도로는 타이어를 앞으로 미는데, 여기서는 그 크기가 ${f(M.CAR.F / 1000, 1)} kN이다. 타이어가 미끄러지지 않으므로, 자동차가 움직이고 있더라도 이것은 <i>정지</i> 마찰력이다.</p>
      <p>공기 항력은 뒤로 밀며 <i>v</i>²에 따라 커진다. ${f(M.car(M.CAR.run).v, 1)} m/s에서는 ${f(M.car(M.CAR.run).D, 0)} N에 불과하지만, 고속도로 속력(30 m/s)에서는 ${f(M.CAR.k * 30 * 30, 0)} N이다. 자동차가 빨라질수록 알짜힘이, 따라서 가속도가 줄어든다.</p>
      <div class="charts">${chart({ x0: 0, x1: 3.2, y0: 0, y1: 10, xlabel: '시간 (s)', ylabel: '속력 (m/s)', cursor: 'car', label: '시간에 따른 자동차의 속력',
        series: [{ pts: Array.from({ length: 33 }, (_, i) => [i * 0.1, M.car(i * 0.1).v]) }] })}</div>
      <p class="hintline">화살표: 1킬로뉴턴당 ${(KN_SCALE * 100).toFixed(0)} cm.</p>`,
    cam: { target: [STATIONS.car + 0.5, 1.2, 0], az: -20, el: 14, dist: 36 }, lit: 'car', scene: 'car', look: {},
    fig: '앞쪽으로 마찰력, 뒤쪽으로 항력',
  },
  {
    kicker: '2.6', title: '마찰력', sub: '정지 마찰, 그다음 운동 마찰',
    body: `
      <p class="lede">거친 바닥에서 미는 힘이 매초 ${f(M.RAMP, 1)} N씩 꾸준히 커진다. 처음에는 블록이 움직이지 않는다. <b>정지 마찰력</b>이 미는 힘과 정확히 같아지기 때문이다.</p>
      <p>정지 마찰력에는 한계가 있다. μ<sub>s</sub><i>F</i><sub>N</sub> = ${f(M.MU_S)} × ${f(M.FN, 1)} = ${f(M.F_SMAX)} N. 이보다 세게 밀면 블록이 미끄러지기 시작한다. 그러면 미는 힘과 관계없이 더 작고 일정한 <b>운동 마찰력</b> μ<sub>k</sub><i>F</i><sub>N</sub> = ${f(M.F_K)} N이 대신 작용한다. 알짜힘을 나타내는 빨간 화살표는 미는 힘이 이긴 뒤에야 나타난다.</p>
      <div class="charts">${frictionChart}</div>`,
    cam: { target: [STATIONS.friction + 0.4, 0.45, 0], az: -26, el: 13, dist: 9 }, lit: 'friction', scene: 'friction', look: {},
    fig: '거친 바닥에서 점점 커지는 미는 힘',
  },
  {
    kicker: '2.7', title: '제3법칙', sub: '힘은 쌍으로 작용한다',
    body: `
      <p class="lede">A가 B를 밀면, B도 같은 순간에 A를 크기가 같고 방향이 반대인 힘으로 민다.</p>
      <p>${f(M.PUSH, 1)} N으로 밀면 두 블록이 함께 ${f(M.A_PAIR, 1)} m/s²로 움직인다. B(${f(M.M2, 1)} kg)에 그 가속도를 주려면 A가 B를 ${f(M.CONTACT, 1)} N으로 밀어야 한다. B는 A를 ${f(M.CONTACT, 1)} N으로 되밀므로, A에 작용하는 알짜힘은 ${f(M.PUSH - M.CONTACT, 1)} N이며, 이는 정확히 ${f(M.M1, 1)} kg × ${f(M.A_PAIR, 1)} m/s²다.</p>
      <p>한 쌍을 이루는 두 힘은 <b>서로 다른 물체</b>에 작용하므로 결코 서로 상쇄되지 않는다. 무게와 수직 항력은 작용 반작용 쌍이 <i>아니다</i>. 둘 다 같은 블록에 작용하기 때문이다. 블록의 무게와 짝을 이루는 힘은 블록이 지구를 위로 당기는 힘이다.</p>`,
    cam: { target: [STATIONS.third + 0.9, 0.45, 0], az: -24, el: 12, dist: 9 }, lit: 'third', scene: 'third', look: {},
    fig: 'A가 B를 밀고, B가 A를 민다',
  },

  {
    kicker: '2.8', title: '계 고르기', sub: '내력은 상쇄된다',
    body: `
      <p class="lede">원하는 물체들을 경계로 둘러싸고 그것을 <b>계</b>라고 부른다. 계 안에 있는 것들 사이의 힘은 <b>내력</b>이다. 계 바깥의 무언가가 가하는 힘은 <b>외력</b>이다.</p>
      <p>스케이터 A(${TG.mA} kg)와 스케이터 B(${TG.mB} kg)가 마찰 없는 얼음 위에 서서 가벼운 밧줄을 끌어당긴다. 밧줄은 각자를 ${TG.T} N으로 당기므로, A는 ${f(TG.aA, 1)} m/s², B는 ${f(TG.aB, 1)} m/s²로 서로를 향해 가속한다.</p>
      <p>스케이터 + 밧줄을 계로 잡자. 장력은 내력이며 크기가 같고 방향이 반대인 쌍으로 작용하므로 더하면 0이다. 무게와 수직 항력은 외력이지만 서로 상쇄된다. 계 전체는 가속할 수 없다. 계의 <b>질량 중심</b>은 제자리에 머문다.</p>
      <div class="eq"><i>x</i><sub>cm</sub> = Σ<i>m</i><i>x</i> / Σ<i>m</i></div>
      <div class="eq">= (<i>m</i><sub>A</sub><i>x</i><sub>A</sub> + <i>m</i><sub>B</sub><i>x</i><sub>B</sub>) / (<i>m</i><sub>A</sub> + <i>m</i><sub>B</sub>)</div>
      <table class="data">
        <tr><th></th><th><i>x</i><sub>A</sub></th><th><i>x</i><sub>B</sub></th><th><i>x</i><sub>cm</sub></th></tr>
        <tr><td>처음</td><td>${f(M.tug(0).xA)} m</td><td>${f(M.tug(0).xB)} m</td><td>0.00 m</td></tr>
        <tr><td>${f(TG.run, 2)} s 뒤</td><td>${f(M.tug(TG.run).xA)} m</td><td>${f(M.tug(TG.run).xB)} m</td><td>0.00 m</td></tr>
      </table>
      <p>가벼운 스케이터가 얼음 위를 더 많이 이동한다. ${f(M.tug(TG.run).xA - TG.xA0, 1)} m 대 ${f(TG.xB0 - M.tug(TG.run).xB, 1)} m로, 정확히 <i>x</i><sub>cm</sub>을 고정시키는 비율이다. 두 사람이 함께 미끄러지고 있었다면 <i>x</i><sub>cm</sub>은 같은 속도로 계속 미끄러졌을 것이다.</p>
      <div class="charts">${chart({ x0: 0, x1: 1.7, y0: -3, y1: 2, xlabel: '시간 (s)', ylabel: '위치 (m)', cursor: 'tug', label: '시간에 따른 두 스케이터와 질량 중심의 위치',
        series: [{ pts: Array.from({ length: 21 }, (_, i) => [i * TG.run / 20, M.tug(i * TG.run / 20).xA]), tag: [0.15, TG.xA0 + 0.25, 'A'] }, { pts: Array.from({ length: 21 }, (_, i) => [i * TG.run / 20, M.tug(i * TG.run / 20).xB]), tag: [0.75, M.tug(0.75).xB - 0.75, 'B'] }, { cls: 'curve total', pts: [[0, 0], [TG.run, 0]], tag: [1.2, 0.1, 'x<tspan dy="3" font-size="8">cm</tspan>'] }] })}</div>
      <p class="hintline">여기서 화살표는 1뉴턴당 ${(TUG_SCALE * 100).toFixed(1)} cm. 스케이터를 클릭해 계의 경계 보기.</p>`,
    cam: { target: [STATIONS.tug - 0.45, 0.95, 0], az: -8, el: 9, dist: 18 }, lit: 'tug', scene: 'tug', look: {},
    fig: '얼음 위에서 밧줄 끌어당기기',
  },
  {
    kicker: '2.9', title: '질량 중심의 가속도', sub: 'ΣF_ext = M a_cm',
    body: `
      <p class="lede">계의 모든 부분에 대해 <i>F</i> = <i>ma</i>를 쓰고 모두 더한다. 내력은 쌍으로 상쇄되고, 남는 것은 계 전체에 대한 제2법칙이다.</p>
      <div class="eq">Σ<i>F</i><sub>ext</sub> = <i>M</i> <i>a</i><sub>cm</sub>, &nbsp; <i>M</i> = Σ<i>m</i></div>
      <p>얼음 위의 ${f(BD.Mb, 1)} kg 판 위에 ${f(BD.m, 1)} kg 블록이 놓여 있고, 밧줄이 판을 ${BD.F} N으로 당긴다. 이는 정지 마찰력이 나누어 감당할 수 있는 한계(μ<sub>s</sub><i>Mg</i> = ${f(BD.Fslip)} N)보다 크므로 블록이 미끄러진다. 운동 마찰력 ${f(BD.f)} N이 블록은 앞으로, 판은 뒤로 끈다.</p>
      <table class="data">
        <tr><td>블록: <i>f</i>/<i>m</i></td><td>${f(BD.aBlock)} m/s²</td></tr>
        <tr><td>판: (<i>F</i> − <i>f</i>)/<i>M</i><sub>board</sub></td><td>${f(BD.aBoard)} m/s²</td></tr>
        <tr><td><b>계</b>: <i>F</i>/(<i>m</i> + <i>M</i><sub>board</sub>)</td><td>${f(BD.aCm)} m/s²</td></tr>
      </table>
      <p>확인: (${f(BD.m, 1)} × ${f(BD.aBlock)} + ${f(BD.Mb, 1)} × ${f(BD.aBoard)}) / ${f(BD.M, 1)} = ${f(BD.aCm)} m/s². 마찰력은 <i>a</i><sub>cm</sub>에 아무 영향도 주지 않았다. 접시 밑의 식탁보를 확 잡아 빼도 같은 일이 일어난다. 접시를 끄는 것은 마찰력뿐이고, 마찰력이 접시에 줄 수 있는 가속도는 μ<i>g</i>뿐이다.</p>
      <div class="charts">${chart({ x0: 0, x1: 1.1, y0: 0, y1: 4.5, xlabel: '시간 (s)', ylabel: '속도 (m/s)', cursor: 'board', label: '시간에 따른 블록, 판, 질량 중심의 속도',
        series: [{ pts: [[0, 0], [1.1, BD.aBoard * 1.1]], tag: [0.86, BD.aBoard * 0.86 + 0.2, '판'] }, { cls: 'curve total', pts: [[0, 0], [1.1, BD.aCm * 1.1]], tag: [0.92, BD.aCm * 0.92 - 0.95, 'cm'] }, { pts: [[0, 0], [1.1, BD.aBlock * 1.1]], tag: [0.8, BD.aBlock * 0.8 - 0.75, '블록'] }] })}</div>
      <p class="hintline">화살표: 1뉴턴당 ${(F_SCALE * 100).toFixed(0)} cm. 클릭해 블록을 들어 올리고 마찰력 쌍 보기.</p>`,
    cam: { target: [STATIONS.board + 0.4, 0.5, 0], az: -16, el: 15, dist: 13.5 }, lit: 'board', scene: 'board', look: {},
    fig: '블록 밑에서 잡아 빼는 판',
  },
  {
    kicker: '2.10', title: '경사면', sub: '축을 기울여라',
    body: `
      <p class="lede">경사면에서는 면을 따르는 방향과 면에 수직인 방향으로 잰다. 그러면 무게가 두 성분으로 나뉜다.</p>
      <table class="data">
        <tr><td>경사면을 따라</td><td><i>mg</i> sin θ = ${f(M.W_PAR)} N</td></tr>
        <tr><td>경사면을 누르는 쪽</td><td><i>mg</i> cos θ = ${f(M.W_PERP)} N</td></tr>
      </table>
      <p>경사면을 파고드는 방향으로는 아무것도 가속하지 않으므로, 수직 항력이 두 번째 성분을 상쇄한다. <i>F</i><sub>N</sub> = <i>mg</i> cos θ = ${f(M.FN_INC)} N. 경사면을 따르는 성분만 남는다. <i>a</i> = <i>g</i> sin θ = ${f(M.A_INC)} m/s².</p>
      <p>마찰을 더하면, tan θ = μ<sub>k</sub>일 때 블록은 일정한 속력으로 미끄러진다. μ<sub>k</sub> = ${f(M.MU_K)}이면 그 각은 ${f(M.critical(M.MU_K), 1)}°다.</p>
      <p class="hintline">블록을 클릭해 무게를 성분으로 나누어 보기.</p>`,
    cam: { target: [STATIONS.incline - 0.2, 1.0, 0], az: -8, el: 12, dist: 12 }, lit: 'incline', scene: 'incline', look: {},
    fig: `${M.THETA_DEG}° 경사면`,
  },
  {
    kicker: '2.11 · AP 물리 C', title: 'v에 비례하는 항력', sub: '종단 속도',
    body: `
      <p class="lede">항력은 속도와 반대 방향을 향하며 속력에 따라 커진다. 끈끈한 유체 속의 작고 느린 물체에서는 항력이 단순히 속력에 비례한다. <i>F</i><sub>d</sub> = −<i>bv</i>.</p>
      <p><i>b</i> = ${f(DR.b)} kg/s인 ${f(DR.m, 2)} kg 공을 정지 상태에서 놓는다. 아래쪽을 양으로 잡으면</p>
      <div class="eq"><i>m</i> d<i>v</i>/d<i>t</i> = <i>mg</i> − <i>bv</i></div>
      <p>처음에는 <i>v</i> = 0이고 <i>a</i> = <i>g</i>다. 공이 빨라지면서 항력이 커지므로 알짜힘은 줄어든다. <i>bv</i> = <i>mg</i>가 되면 알짜힘은 0이다. 이때의 속력이 <b>종단 속도</b> <i>v</i><sub>t</sub> = <i>mg</i>/<i>b</i> = ${f(DR.vt)} m/s다. τ = <i>m</i>/<i>b</i>로 놓고 변수를 분리한다.</p>
      <div class="eq">d<i>v</i> / (<i>v</i><sub>t</sub> − <i>v</i>) = d<i>t</i> / τ</div>
      <div class="eq">∫<sub>0</sub><sup><i>v</i></sup> d<i>v</i>′/(<i>v</i><sub>t</sub> − <i>v</i>′) = ∫<sub>0</sub><sup><i>t</i></sup> d<i>t</i>′/τ</div>
      <div class="eq">−ln(1 − <i>v</i>/<i>v</i><sub>t</sub>) = <i>t</i>/τ</div>
      <div class="eq"><i>v</i>(<i>t</i>) = <i>v</i><sub>t</sub> (1 − e<sup>−<i>t</i>/τ</sup>)</div>
      <p>여기서 τ = ${f(DR.tau)} s다. τ가 한 번 지나면 공의 속력은 <i>v</i><sub>t</sub>의 1 − 1/e = 63.2%, 3τ 뒤에는 95%, 5τ 뒤에는 99.3%가 된다. 공은 종단 속도에 결코 완전히 도달하지 못한다.</p>
      <div class="charts">${chart({ x0: 0, x1: 2, y0: 0, y1: 4.5, xlabel: '시간 (s)', ylabel: '속력 (m/s)', cursor: 'drag', label: '종단 속도에 다가가는, 시간에 따른 속력',
        series: [{ cls: 'trend', pts: [[0, DR.vt], [2, DR.vt]], tag: [1.62, DR.vt, 'v<tspan dy="3" font-size="8">t</tspan>'] }, { pts: Array.from({ length: 41 }, (_, i) => [i * 0.05, M.linDrag(i * 0.05).v]) }, { cls: 'trend', pts: [[DR.tau, 0], [DR.tau, M.linDrag(DR.tau).v]] }],
        marks: [[DR.tau, M.linDrag(DR.tau).v, `τ = ${f(DR.tau, 1)} s에서 63.2%`]] })}
        ${chart({ x0: 0, x1: 2, y0: 0, y1: 6, xlabel: '시간 (s)', ylabel: '힘 (N)', cursor: 'dragF', label: '시간에 따른 항력과 무게',
        series: [{ cls: 'trend', pts: [[0, DR.W], [2, DR.W]], tag: [1.2, DR.W, '무게 <tspan font-style="italic">mg</tspan>'] }, { pts: Array.from({ length: 41 }, (_, i) => [i * 0.05, M.linDrag(i * 0.05).D]), tag: [0.5, M.linDrag(0.5).D - 2.2, '항력 <tspan font-style="italic">bv</tspan>'] }] })}</div>
      <p class="hintline">여기서 화살표는 1뉴턴당 ${(DRAG_SCALE * 100).toFixed(0)} cm. 공을 클릭해 실시간 자유 물체 도형 보기.</p>`,
    cam: { target: [STATIONS.drag, 2.8, 0], az: -10, el: 5, dist: 23 }, lit: 'drag', scene: 'drag', look: {},
    fig: '항력 −bv를 받으며 떨어지는 공',
  },
  {
    kicker: '2.12 · AP 물리 C', title: '실제 유체', sub: '위치, 그리고 어떤 항력 법칙인가',
    body: `
      <p class="lede">한 번 더 적분하면 떨어진 위치를 얻는다.</p>
      <div class="eq"><i>x</i>(<i>t</i>) = ∫<sub>0</sub><sup><i>t</i></sup> <i>v</i> d<i>t</i>′ = <i>v</i><sub>t</sub> [ <i>t</i> − τ (1 − e<sup>−<i>t</i>/τ</sup>) ]</div>
      <p>τ가 몇 번 지나면 이 식은 <i>v</i><sub>t</sub>(<i>t</i> − τ)가 된다. 공은 처음부터 줄곧 <i>v</i><sub>t</sub>로 움직였지만 τ만큼 늦게 출발한 것처럼 떨어진다(아래 점선).</p>
      <p>선형 항력은 끈끈한 유체 속의 작고 느린 물체에서 성립한다. 크거나 빠른 물체는 유체를 옆으로 밀어내며, 항력이 2.5절의 자동차처럼 <i>kv</i>²로 커진다. 그러면 <i>v</i><sub>t</sub> = √(<i>mg</i>/<i>k</i>)이다.</p>
      <table class="data">
        <tr><th>떨어지는 것</th><th><i>v</i><sub>t</sub></th><th>τ</th><th>항력</th></tr>
        <tr><td>안개 물방울, 20 µm</td><td>${f(M.drop(1e-5).vLin * 100, 1)} cm/s</td><td>${f(M.drop(1e-5).tau * 1000, 1)} ms</td><td><i>bv</i></td></tr>
        <tr><td>꿀 속의 강철 공, 10 mm</td><td>${f(HN.vt * 100, 1)} cm/s</td><td>${f(HN.tau * 1000, 1)} ms</td><td><i>bv</i></td></tr>
        <tr><td>빗방울, 2 mm</td><td>${f(M.drop(1e-3).vQuad, 1)} m/s</td><td>—</td><td><i>kv</i>²</td></tr>
      </table>
      <p>빗방울의 경우 <i>bv</i>로는 ${f(M.drop(1e-3).vLin, 0)} m/s가 예측된다. 실제로는 <i>kv</i>²가 말해 주듯 약 6.5 m/s로 떨어진다.</p>
      <p>꿀 속의 강철 공(실제 크기의 10×로 그림)은 부력 <i>B</i>도 받으므로, <i>mg</i>가 <i>mg</i> − <i>B</i>로 바뀌고 <i>v</i><sub>t</sub> = (<i>mg</i> − <i>B</i>)/<i>b</i>가 된다. τ가 겨우 ${f(HN.tau * 1000, 1)} ms이므로 1 mm도 채 안 되는 거리 안에 종단 속력에 이르러, 처음부터 일정하게 가라앉는 것처럼 보인다.</p>
      <div class="charts">${chart({ x0: 0, x1: 2, y0: 0, y1: 7, xlabel: '시간 (s)', ylabel: '떨어진 거리 (m)', label: '시간에 따른 떨어진 거리와 그 점근선',
        series: [{ cls: 'trend', pts: [[DR.tau, 0], [2, DR.vt * (2 - DR.tau)]], tag: [1.25, DR.vt * 0.85 - 0.4, 'v<tspan dy="3" font-size="8">t</tspan><tspan dy="-3">(t − τ)</tspan>'] }, { pts: Array.from({ length: 41 }, (_, i) => [i * 0.05, M.linDrag(i * 0.05).x]) }] })}
        ${chart({ x0: 0, x1: 2, y0: 0, y1: 4.5, xlabel: '시간 (s)', ylabel: '속력 (m/s), 같은 v_t', label: '종단 속력이 같은 선형 항력과 이차 항력',
        series: [{ cls: 'trend', pts: [[0, DR.vt], [2, DR.vt]] }, { pts: Array.from({ length: 41 }, (_, i) => [i * 0.05, M.quadV(i * 0.05)]), tag: [0.18, M.quadV(0.3), 'kv²'] }, { pts: Array.from({ length: 41 }, (_, i) => [i * 0.05, M.linDrag(i * 0.05).v]), tag: [0.5, M.linDrag(0.4).v - 1.3, 'bv'] }] })}</div>
      <p><i>v</i><sub>t</sub>보다 느릴 때 <i>kv</i>²는 <i>bv</i>보다 약하므로, <i>v</i><sub>t</sub>가 같다면 더 빨리 가까워진다. <i>t</i> = τ에서 63%가 아니라 ${(100 * M.quadV(DR.tau) / DR.vt).toFixed(0)}%다.</p>
      <p class="hintline">여기서 화살표는 1뉴턴당 ${HONEY_SCALE} m. 공을 클릭해 작용하는 힘 보기.</p>`,
    cam: { target: [STATIONS.honey, 0.68, 0], az: -12, el: 8, dist: 5.6 }, lit: 'honey', scene: 'honey', look: {},
    fig: '꿀 속으로 가라앉는 강철 공',
  },
];

// ---------- click a scene: what it breaks into ----------
export const PLATES = {
  tug: { text: `옅은 상자가 계다. 두 스케이터와 밧줄이 여기에 속한다. A에 작용하는 장력과 B에 작용하는 장력은 내력으로, 크기가 같고 방향이 반대이므로 더하면 0이다. 각 스케이터의 무게는 얼음의 수직 항력이 상쇄한다. 알짜 외력이 없으므로 질량 중심(4등분된 원판)은 움직일 수 없다.`,
    facts: s => { const r = M.tug(s.tug.t), xc = M.xcm([TG.mA, TG.mB], [r.xA, r.xB]); return [['x<sub>A</sub>, v<sub>A</sub>', `${f(r.xA)} m, ${f(r.vA)} m/s`], ['x<sub>B</sub>, v<sub>B</sub>', `${f(r.xB)} m, ${f(r.vB)} m/s`], ['x<sub>cm</sub> = Σmx/Σm', `${f(Math.abs(xc) < 5e-3 ? 0 : xc)} m`], ['내력: A에 작용하는 T + B에 작용하는 T', `${TG.T} − ${TG.T} = 0 N`], ['외력: ΣF<sub>ext</sub>', '0 N']]; } },
  board: { text: `떼어 놓고 보면 마찰력 쌍이 드러난다. 판은 블록을 앞으로 끌고, 블록은 판을 뒤로 끈다. 각각 ${f(BD.f)} N이다. 블록 + 판 계 안에서 이 둘은 상쇄된다. 외력은 당기는 힘 F뿐이므로, 질량 중심은 F/M으로 가속하며 이 값은 블록의 가속도와 판의 가속도 사이에 있다.`,
    facts: s => { const t = s.board.t, r = M.board(t); return [['ΣF<sub>ext</sub> = F', `${BD.F} N`], ['M = m + M<sub>board</sub>', `${f(BD.M, 1)} kg`], ['a<sub>cm</sub> = ΣF<sub>ext</sub>/M', `${f(BD.aCm)} m/s²`], ['v<sub>block</sub>, v<sub>board</sub>', `${f(r.vBlock)}, ${f(r.vBoard)} m/s`], ['v<sub>cm</sub>', `${f(M.xcm([BD.m, BD.Mb], [r.vBlock, r.vBoard]))} m/s`]]; } },
  drag: { text: `공이 자유 물체 도형으로 줄어든다. 무게는 아래로, 항력은 위로 작용한다. 항력은 bv이므로 속력에 따라 커지다가 무게와 같아지고, 알짜힘(빨간색)은 사라진다. 가속도는 g e<sup>−t/τ</sup>로, 처음에 가장 크고 종단 속력에서 0이 된다.`,
    facts: s => { const r = M.linDrag(s.drag.t); return [['시간', `${f(s.drag.t)} s = ${f(s.drag.t / DR.tau, 1)} τ`], ['속력 v', `${f(r.v)} m/s = v<sub>t</sub>의 ${(100 * r.v / DR.vt).toFixed(1)}%`], ['항력 bv', `${f(r.D)} N`], ['무게 mg', `${f(DR.W)} N`], ['알짜힘, a', `${f(DR.W - r.D)} N, ${f(r.a)} m/s²`]]; } },
  honey: { text: `세 힘이 이미 균형을 이루고 있다. 무게는 아래로, 항력과 부력은 위로 작용한다. 공은 종단 속력에 있으므로 스트로보 상들의 간격이 고르다. 여기서 항력이 선형인 까닭은, 유체를 밀어내는 효과와 유체의 끈끈함을 비교하는 레이놀즈 수 ρvd/η가 1보다 훨씬 작기 때문이다.`,
    facts: () => [['무게 mg', `${f(HN.W * 1000, 1)} mN`], ['부력 B', `${f(HN.B * 1000, 1)} mN`], ['항력 bv<sub>t</sub> (b = 6πηr)', `${f(HN.b * HN.vt * 1000, 1)} mN`], ['알짜힘', '0 N'], ['v<sub>t</sub>, τ', `${f(HN.vt * 100, 2)} cm/s, ${f(HN.tau * 1000, 1)} ms`], ['레이놀즈 수', f(HN.Re, 3)]] },
  tension: { text: `각 장력은 수평 성분과 연직 성분(회색)으로 나뉜다. 수평 성분끼리는 크기가 같고 방향이 반대이므로 상쇄된다. 두 연직 성분을 더하면 무게와 같다. 줄이 평평할수록 각 연직 성분이 작아지므로, 장력은 더 커져야 한다.`,
    facts: s => { const th = M.hangAngle(s.clock * M.SLOW), T = M.tension2(th), r = th * Math.PI / 180; return [['각도 θ', `${th.toFixed(1)}°`], ['각 장력 T', `${f(T)} N`], ['연직 성분 T sin θ', `${f(T * Math.sin(r))} N × 2 = ${f(2 * T * Math.sin(r))} N`], ['수평 성분 T cos θ', `${f(T * Math.cos(r))} N, 서로 상쇄`]]; } },
  plane: { text: `네 힘, 균형을 이룬 두 쌍. 이들은 제3법칙의 쌍이 아니라는 점에 주목하자. 네 힘 모두 비행기에 작용한다. 비행기가 올라가지도 내려가지도 않으므로 양력과 무게가 균형을 이루고, 속력이 변하지 않으므로 추력과 항력이 균형을 이룬다.`,
    facts: () => [['양력 − 무게', '0 N'], ['추력 − 항력', '0 N'], ['가속도', '0 m/s²'], ['속력', `${M.PLANE.v} m/s, 일정`]] },
  car: { text: `무게와 수직 항력은 상쇄된다. 수평 방향으로는 두 힘이 있다. 도로가 가하는 앞쪽의 정지 마찰력과 뒤쪽의 공기 항력이다. 두 힘의 차이가 알짜힘(빨간색)이다.`,
    facts: s => { const c = M.car(s.car.t); return [['도로의 마찰력(앞쪽)', `${f(M.CAR.F)} N`], ['공기 항력(뒤쪽)', `${f(c.D)} N`], ['알짜힘', `${f(M.CAR.F - c.D)} N`], ['가속도', `${f(c.a)} m/s²`], ['속력', `${f(c.v)} m/s`]]; } },
  rest: { text: `블록이 점으로 줄어들고, 블록에 작용하는 힘만 남는다. 이것이 자유 물체 도형이다. 크기가 같고 방향이 반대인 두 힘이므로 알짜힘은 0이고, 블록은 계속 정지해 있다.`,
    facts: () => [['무게 F<sub>g</sub>', `아래쪽 ${f(M.W1)} N`], ['수직 항력 F<sub>N</sub>', `위쪽 ${f(M.FN)} N`], ['알짜힘', '0 N']] },
  glide: { text: `자유 물체 도형은 정지한 블록과 똑같다. Σ<i>F</i> = 0은 “움직이지 않는다”는 뜻이 아니다. “속도가 변하지 않는다”는 뜻이다.`,
    facts: s => [['속도', `${f(M.V_GLIDE)} m/s, 일정`], ['알짜힘', '0 N'], ['가속도', '0 m/s²']] },
  second: { text: `빨간 화살표는 각 블록에 작용하는 알짜힘으로, 둘 다 6.0 N이다. 각 질량으로 나누면 가속도를 얻는다.`,
    facts: s => [['2.0 kg: a = 6.0/2.0', `${f(M.A1)} m/s²`], ['4.0 kg: a = 6.0/4.0', `${f(M.A2)} m/s²`], ['시간', `${f(s.second.t)} s`]] },
  friction: { text: `블록에 작용하는 네 힘을 실시간으로 보여 준다. 위아래 힘은 상쇄된다. 수평 방향으로는, 미는 힘이 ${f(M.F_SMAX)} N을 넘기 전까지 마찰력이 미는 힘과 같다. 그 뒤에는 마찰력이 ${f(M.F_K)} N으로 떨어지고, 그 차이가 블록을 가속한다.`,
    facts: s => { const r = M.friction(s.friction.t); return [['미는 힘 F<sub>app</sub>', `${f(r.F)} N`], [`마찰력(${r.kind})`, `${f(r.f)} N`], ['알짜힘', `${f(r.F - r.f)} N`], ['가속도', `${f(r.a)} m/s²`]]; } },
  third: { text: `잠시 떼어 놓으면 힘의 쌍이 쉽게 보인다. A는 B를 ${f(M.CONTACT, 1)} N으로 앞으로 밀고, B는 A를 ${f(M.CONTACT, 1)} N으로 뒤로 민다. 크기는 같고, 방향은 반대이며, 서로 다른 블록에 작용한다.`,
    facts: () => [['A에 작용하는 F(바깥에서 미는 힘)', `${f(M.PUSH, 1)} N →`], ['F<sub>B on A</sub>', `${f(M.CONTACT, 1)} N ←`], ['F<sub>A on B</sub>', `${f(M.CONTACT, 1)} N →`], ['두 블록의 가속도', `${f(M.A_PAIR, 1)} m/s²`]] },
  incline: { text: `무게(연직 아래쪽)가 기울어진 축을 따르는 두 성분으로 바뀐다. 수직 항력이 경사면을 누르는 성분을 상쇄한다. 경사면을 따르는 성분이 알짜힘이므로, 블록은 경사면을 따라 내려가며 빨라진다.`,
    facts: () => [['mg sin θ', `${f(M.W_PAR)} N`], ['mg cos θ = F<sub>N</sub>', `${f(M.W_PERP)} N`], ['a = g sin θ', `${f(M.A_INC)} m/s²`]] },
};
