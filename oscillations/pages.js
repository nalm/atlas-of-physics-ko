// Chapter 6, page by page (after the AP Physics 1 organizer, Unit 7). Text and charts on the
// left page; on the right, the camera, the lit scene and what is shown. Numbers from model.js.
import * as M from './model.js';
import { STATIONS, P_SCALE, PAPER, TQ_ARC } from './world.js';

const f = (x, n = 2) => (x < -1e-9 ? '−' : '') + Math.abs(x).toFixed(n);
const deg = r => (r / M.DEG).toFixed(0);

// ---------- small SVG charts for the left page, with live cursors ----------
const W = 420, P = { l: 44, r: 14, t: 16, b: 30 };
export const CURSORS = {};       // key → (x, y) → [cx, cy]
export const LIVE = {};          // key → (t) → path d, for a series that is redrawn every frame
function chart({ x0, x1, y0, y1, series, xlabel, ylabel, marks = [], cursors = [], label, h = 170, ylabels, xlabels }) {
  const H = h;
  const sx = x => P.l + (x - x0) / (x1 - x0) * (W - P.l - P.r), sy = y => P.t + (1 - (y - y0) / (y1 - y0)) * (H - P.t - P.b);
  for (const c of cursors) CURSORS[c] = (x, y) => [sx(x), sy(y)];
  const toD = pts => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('');
  for (const s of series) if (s.live) { LIVE[s.live] = t => toD(s.fn(t)); s.pts = s.fn(0); }
  const paths = series.map(s => `<path class="${s.cls || 'curve'}"${s.live ? ` data-live="${s.live}"` : ''} d="${toD(s.pts)}"/>` + (s.tag ? `<text class="lab" x="${sx(s.tag[0]) + 4}" y="${sy(s.tag[1]) - 6}">${s.tag[2]}</text>` : '')).join('');
  const mk = marks.map(([x, y, t, dx = 6, dy = 14]) => `<circle class="mark" cx="${sx(x)}" cy="${sy(y)}" r="3.5"/><text class="ax" x="${sx(x) + dx}" y="${sy(y) + dy}">${t}</text>`).join('');
  const zero = y0 < 0 && y1 > 0 ? `<line class="zero" x1="${P.l}" x2="${W - P.r}" y1="${sy(0)}" y2="${sy(0)}"/>` : '';
  const [yt, yb] = ylabels || [y1, y0], [xl, xr] = xlabels || [x0, x1];
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
    <rect class="frame" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}"/>${zero}${paths}${mk}
    <text class="ax" x="${P.l - 6}" y="${sy(y1) + 4}" text-anchor="end">${yt}</text><text class="ax" x="${P.l - 6}" y="${sy(y0) + 4}" text-anchor="end">${yb}</text>
    <text class="ax" x="${P.l}" y="${H - 9}">${xl}</text><text class="ax" x="${W - P.r}" y="${H - 9}" text-anchor="end">${xr}</text>
    <text class="lab" x="${P.l + 6}" y="${P.t + 13}">${ylabel}</text><text class="ax" x="${(P.l + W - P.r) / 2}" y="${H - 9}" text-anchor="middle">${xlabel}</text>
    ${cursors.map(c => `<circle class="cursor" r="4.5" cx="-20" cy="-20" data-cursor="${c}"/>`).join('')}
  </svg>`;
}
const sample = (fn, a, b, n = 120) => Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, fn(x)]; });
const T2 = 2 * M.T0;

const at = (k, dx = 0, dy = 0.35) => [STATIONS[k] + dx, dy, 0];

export const PAGES = [
  {
    kicker: '6장', title: '진동', sub: '갔다가 돌아오고, 또다시',
    body: `
      <p class="lede"><b>진동</b>은 <b>평형</b> 위치를 중심으로 앞뒤로 오가는 운동이다. <b>복원력</b>이 변위에 비례하여 물체를 평형 쪽으로 되돌리면 그 운동은 <b>단순 조화 운동</b>(SHM)이다. 이때 주기는 결코 변하지 않는다.</p>
      <table class="data">
        <tr><td>진폭 <i>A</i>: 평형에서 가장 먼 거리</td><td>${f(M.A)} m</td></tr>
        <tr><td>주기 <i>T</i>: 한 번 완전히 왕복하는 데 걸리는 시간</td><td>${f(M.T0, 3)} s</td></tr>
        <tr><td>진동수 <i>f</i> = 1/<i>T</i>: 1초 동안의 왕복 횟수</td><td>${f(M.F0, 3)} Hz</td></tr>
      </table>
      <div class="charts">${chart({ x0: 0, x1: 1, xlabels: ['0', '2T'], y0: -M.A, y1: M.A, ylabels: ['+A', '−A'], xlabel: '시간', ylabel: '위치 x', cursors: ['x0'], label: '시간에 따른 위치: 코사인', h: 140,
        series: [{ pts: sample(u => M.spring(u * T2).x, 0, 1) }], marks: [[0.5, M.A, 'T', -3, 16]] })}</div>
      <p class="hintline">윤곽선은 같은 시간 간격으로 찍은 스트로보 사진이다. 블록이 느린 양 끝에서 촘촘하다. 블록을 클릭하면 v와 a를 볼 수 있다.</p>`,
    cam: { target: at('spring', -0.25, 0.3), az: -20, el: 20, dist: 7.6 }, lit: 'spring', scene: 'spring', look: {},
    fig: '마찰 없는 바닥 위, 용수철에 달린 블록',
  },
  {
    kicker: '6.1', title: '훅 법칙', sub: '복원력',
    body: `
      <p class="lede">용수철을 늘이거나 압축하면, 용수철은 그 끝이 움직인 거리에 비례하는 힘으로 되밀어 낸다.</p>
      <div class="eq"><i>F</i><sub>s</sub> = −<i>k</i>Δ<i>x</i></div>
      <p><i>k</i> = ${M.K} N/m는 용수철의 뻣뻣한 정도인 <b>용수철 상수</b>다. 음의 부호는 힘이 항상 변위와 <b>반대</b> 방향을 향한다는 뜻이다. 무게와 수직 항력이 상쇄되므로 <i>F</i><sub>s</sub>가 알짜힘이고, <i>a</i> = −(<i>k</i>/<i>m</i>)<i>x</i>(빨강)이다.</p>
      <table class="data">
        <tr><th>위치</th><th>힘, 가속도</th><th>속력</th></tr>
        <tr><td><i>x</i> = ±<i>A</i></td><td>${f(M.FMAX, 1)} N, ${f(M.AMAX, 1)} m/s²: 최대</td><td>0</td></tr>
        <tr><td><i>x</i> = 0</td><td>0</td><td>${f(M.VMAX, 1)} m/s: 최대</td></tr>
      </table>
      <div class="charts">${chart({ x0: -M.A, x1: M.A, y0: -M.FMAX, y1: M.FMAX, xlabel: '변위 x (m)', ylabel: 'F (N)', cursors: ['Fx'], label: '변위에 따른 용수철 힘: 기울기가 −k인 직선', h: 130,
        series: [{ pts: [[-M.A, M.FMAX], [M.A, -M.FMAX]], tag: [0.12, -2.4, '기울기 −k'] }] })}</div>
      <p class="hintline">블록을 클릭하면 자유 물체 도형을 볼 수 있다.</p>`,
    cam: { target: at('hooke', -0.2, 0.3), az: -16, el: 14, dist: 7.8 }, lit: 'hooke', scene: 'hooke', look: {},
    fig: '힘은 항상 x = 0 쪽을 향한다',
  },
  {
    kicker: '6.2', title: 'x, v, a', sub: '코사인과 그 기울기',
    body: `
      <p class="lede">블록 아래에서 종이 띠가 미끄러져 나가므로, 블록이 시간에 따른 자기 위치를 직접 그린다. 그 모양은 코사인이다.</p>
      <table class="data eqs">
        <tr><td><i>x</i> = <i>A</i> cos 2π<i>ft</i></td><td>양 끝에서 ±<i>A</i></td></tr>
        <tr><td><i>v</i> = −2π<i>fA</i> sin 2π<i>ft</i></td><td><i>x</i> = 0에서 최대 ${f(M.VMAX)} m/s</td></tr>
        <tr><td><i>a</i> = −4π²<i>f</i>²<i>A</i> cos 2π<i>ft</i></td><td>±<i>A</i>에서 최대 ${f(M.AMAX)} m/s²</td></tr>
      </table>
      <p>각 그래프는 바로 위 그래프의 기울기다. cos → −sin → −cos. 그리고 <i>a</i>는 <i>x</i>를 뒤집고 크기를 바꾼 것이다.</p>
      <div class="charts">
        ${chart({ x0: 0, x1: 1, xlabels: ['', ''], y0: -1, y1: 1, ylabels: ['+A', '−A'], xlabel: '', ylabel: 'x', cursors: ['tx'], label: '위치: 코사인', h: 78, series: [{ pts: sample(u => Math.cos(2 * Math.PI * 2 * u), 0, 1) }] })}
        ${chart({ x0: 0, x1: 1, xlabels: ['', ''], y0: -1, y1: 1, ylabels: ['+최대', '−최대'], xlabel: '', ylabel: 'v', cursors: ['tv'], label: '속도: 음의 사인', h: 78, series: [{ pts: sample(u => -Math.sin(2 * Math.PI * 2 * u), 0, 1) }] })}
        ${chart({ x0: 0, x1: 1, xlabels: ['0', '2T'], y0: -1, y1: 1, ylabels: ['+최대', '−최대'], xlabel: '시간', ylabel: 'a', cursors: ['ta'], label: '가속도: 음의 코사인', h: 88, series: [{ pts: sample(u => -Math.cos(2 * Math.PI * 2 * u), 0, 1) }] })}
      </div>
      <p class="hintline">그래프를 클릭하면 펜 위치에서의 기울기, 곧 속도를 볼 수 있다.</p>`,
    cam: { target: [STATIONS.trace - 0.1, 0, 1.45], az: -10, el: 52, dist: 11 }, lit: 'trace', scene: 'trace', look: {},
    fig: '블록이 시간에 따른 x를 그린다',
  },
  {
    kicker: '6.3', title: '에너지', sub: '주고받을 뿐, 사라지지 않는다',
    body: `
      <p class="lede">마찰이 없으면 전체 에너지는 그대로다. 블록의 운동과 용수철 사이를 오갈 뿐이다.</p>
      <div class="eq">½<i>kA</i>² = ½<i>mv</i>² + ½<i>kx</i>²</div>
      <p>±<i>A</i>에서는 에너지가 모두 용수철에 있으며 ½<i>kA</i>² = ${f(M.E)} J이다. <i>x</i> = 0에서는 모두 운동 에너지이므로 ½<i>mv</i><sub>max</sub>² = ½<i>kA</i>²이고 <i>v</i><sub>max</sub> = √(<i>k</i>/<i>m</i>)·<i>A</i> = ${f(M.VMAX)} m/s이다. 두 몫이 같아지는 곳은 중간 지점이 아니라 <i>x</i> = <i>A</i>√2/2 = ${f(M.X_HALF, 3)} m이다.</p>
      <div class="charts">${chart({ x0: -M.A, x1: M.A, y0: 0, y1: M.E, xlabel: '위치 x (m)', ylabel: '에너지 (J)', cursors: ['U', 'K'], label: '위치에 따른 운동 에너지와 용수철 에너지', h: 140,
        series: [{ pts: sample(x => 0.5 * M.K * x * x, -M.A, M.A), tag: [0.27, 0.32, 'U'] }, { pts: sample(x => M.E - 0.5 * M.K * x * x, -M.A, M.A), tag: [-0.06, 1.72, 'K'] }],
        marks: [[M.X_HALF, M.E / 2, 'K = U', 8, 4]] })}</div>
      <p>용수철 에너지는 용수철을 늘이는 데 한 일, 곧 <i>F</i> = <i>kx</i> 그래프 아래 삼각형의 넓이 ½(<i>kx</i>)<i>x</i>이다.</p>
      <p class="hintline">클릭하면 쌓인 막대에서 운동 에너지 부분을 들어 올린다.</p>`,
    cam: { target: at('energy', 0.95, 0.6), az: -10, el: 14, dist: 12 }, lit: 'energy', scene: 'energy', look: {},
    fig: '운동 에너지와 용수철 에너지',
  },
  {
    kicker: '6.4', title: '매달린 용수철', sub: '중력은 중심을 옮길 뿐, 박자는 그대로',
    body: `
      <p class="lede">같은 블록을 같은 용수철에 매단다. 블록은 용수철이 무게를 떠받칠 때까지, 곧 <i>kd</i> = <i>mg</i>가 될 때까지 처진다.</p>
      <div class="eq"><i>d</i> = <i>mg</i>/<i>k</i> = ${f(M.D, 3)} m</div>
      <p>이것이 새 평형 위치다. 여기서부터 <i>y</i>를 재면 중력이 식에서 빠진다. <i>k</i>(<i>d</i> − <i>y</i>) − <i>mg</i> = −<i>ky</i>. 다시 훅 법칙이므로, 블록은 바닥에서와 같은 주기 ${f(M.T0, 3)} s로 위아래로 진동한다.</p>
      <table class="data">
        <tr><th>위치</th><th>용수철</th><th>무게</th><th>알짜힘 (빨강)</th></tr>
        <tr><td>맨 위</td><td>${f(M.K * (M.D - M.HANG.A))} N</td><td>${f(M.WEIGHT)} N</td><td>${f(M.K * M.HANG.A)} N ↓</td></tr>
        <tr><td>평형</td><td>${f(M.WEIGHT)} N</td><td>${f(M.WEIGHT)} N</td><td>0</td></tr>
        <tr><td>맨 아래</td><td>${f(M.K * (M.D + M.HANG.A))} N</td><td>${f(M.WEIGHT)} N</td><td>${f(M.K * M.HANG.A)} N ↑</td></tr>
      </table>
      <p class="hintline">블록을 클릭하면 자유 물체 도형을 볼 수 있다.</p>`,
    cam: { target: at('hang', 0.1, 1.9), az: -14, el: 6, dist: 9 }, lit: 'hang', scene: 'hang', look: {},
    fig: '연직 용수철에 달린 블록',
  },
  {
    kicker: '6.5', title: '진자', sub: '흔들림이 작으면 SHM',
    body: `
      <p class="lede">줄은 줄 방향으로만 당기므로, 호를 따라 추를 되돌리는 것은 중력뿐이다.</p>
      <div class="eq"><i>F</i> = −<i>mg</i> sin θ</div>
      <p>θ에 정확히 비례하지는 않는다. 그러나 약 10° 이하에서는 sin θ ≈ θ(라디안 단위)이므로 <i>F</i> ≈ −<i>mg</i>θ이고, 주기가 다음과 같은 SHM이 된다.</p>
      <div class="eq"><i>T</i> = 2π√(<i>L</i>/<i>g</i>) = ${f(M.P_T, 3)} s</div>
      <p>±${deg(M.PEND.th0)}°에서 실제 주기는 겨우 ${f(100 * (M.periodExact(M.PEND.L, M.PEND.th0) / M.P_T - 1), 2)}% 더 길다. 가장 낮은 곳에서는 복원력이 없고 추가 가장 빠르다. ½<i>mv</i>² = <i>mg</i>Δ<i>y</i>에서 ${f(M.vmaxPendulum(M.PEND.L, M.PEND.th0), 3)} m/s이다.</p>
      <div class="charts">${chart({ x0: 0, x1: 60, y0: 0, y1: 1.05, ylabels: ['mg', '0'], xlabel: '각 θ (°)', ylabel: '복원력', cursors: ['th'], label: 'θ에 따른 mg sin θ와 mgθ 비교', h: 120,
        series: [{ pts: sample(d => Math.sin(d * M.DEG), 0, 60), tag: [46, Math.sin(46 * M.DEG) - 0.24, 'mg sin θ'] }, { cls: 'trend', pts: sample(d => d * M.DEG, 0, 60), tag: [40, 40 * M.DEG + 0.04, 'mgθ'] }, { cls: 'grid', pts: [[10, 0], [10, 1.05]] }],
        marks: [[10, Math.sin(10 * M.DEG), '10°', 6, 16]] })}</div>
      <p class="hintline">화살표: 1 N당 ${(P_SCALE * 100).toFixed(0)} cm. 추를 클릭하면 무게가 성분으로 나뉜다.</p>`,
    cam: { target: at('pendulum', 0, 2.05), az: -12, el: 5, dist: 9.5 }, lit: 'pendulum', scene: 'pendulum', look: {},
    fig: `${M.PEND.L.toFixed(1)} m 진자, ±${deg(M.PEND.th0)}°`,
  },
  {
    kicker: '6.6', title: '주기를 두 배로', sub: '제곱근에 주의',
    body: `
      <p class="lede">주기는 <i>m</i>, 1/<i>k</i>, <i>L</i>의 <i>제곱근</i>에 비례한다. 주기를 두 배로 하려면 이 값들을 네 배로 해야 한다.</p>
      <table class="data cols">
        <tr><th>용수철에 달린 물체</th><th>진자</th></tr>
        <tr><td><i>T</i> = 2π√(<i>m</i>/<i>k</i>)</td><td><i>T</i> = 2π√(<i>L</i>/<i>g</i>)</td></tr>
        <tr><td>2<i>T</i>: 4<i>m</i> 또는 ¼<i>k</i></td><td>2<i>T</i>: 4<i>L</i></td></tr>
        <tr><td>${f(M.periodSpring(M.DOUBLE.m, M.K))} s → ${f(M.periodSpring(M.DOUBLE.m4, M.K))} s</td><td>${f(M.periodPendulum(M.DOUBLE.L))} s → ${f(M.periodPendulum(M.DOUBLE.L4))} s</td></tr>
      </table>
      <p><b>수치로 풀기.</b> 2 N/m 용수철에 8 kg: <i>T</i> = 2π√(8/2) = 4π s. 8π s가 되려면 8π = 2π√(<i>m</i>/2)에서 <i>m</i> = 32 kg, 곧 네 배다.</p>
      <p><b>비례로 풀기.</b> <i>T</i> ∝ √<i>m</i>이므로 2<i>T</i> ∝ √(<u>&nbsp;?&nbsp;</u><i>m</i>)이다. 제곱근이 2인 수는? 4다. <i>k</i>는 분모에 있으므로 2 = √(1/<i>x</i>)에서 ¼이다. 바꾸는 값만 배율을 따지면 되고, 2π나 ½은 그대로 따라온다.</p>
      <div class="charts">${chart({ x0: 0, x1: 4, y0: 0, y1: 3.5, xlabel: '16 N/m 용수철에 단 질량 (kg)', ylabel: '주기 (s)', label: '질량에 따른 주기: 제곱근 곡선', h: 120,
        series: [{ pts: sample(m => M.periodSpring(m, M.K), 0, 4) }], marks: [[1, M.periodSpring(1, M.K), 'm: 1.57 s', 6, 14], [4, M.periodSpring(4, M.K), '4m: 3.14 s', -64, 16]] })}</div>
      <p class="hintline">어느 쪽 쌍이든 클릭하면 왕복 횟수를 셀 수 있다.</p>`,
    cam: { target: at('double', -0.45, 1.6), az: -12, el: 10, dist: 16.5 }, lit: 'springs4', scene: 'double', look: {},
    fig: '질량 4배, 길이 4배: 주기 2배',
  },
  {
    kicker: '6.7', title: '주기와 무관한 것', sub: '진폭, 그리고 진자의 질량',
    body: `
      <p class="lede">진폭은 주기를 바꾸지 <b>않는다</b>. 어느 공식에도 진폭은 들어 있지 않다.</p>
      <p>멀리 있는 블록은 두 배 먼 곳에서 출발한다. 힘도 두 배, 가속도도 두 배, 같은 시간에 가는 거리도 두 배이므로 두 블록은 보조를 맞춘다.</p>
      <p>진자의 <b>질량</b>도 주기를 바꾸지 않는다. <i>ma</i> = −<i>mg</i> sin θ에서 자유 낙하 때처럼 <i>m</i>이 약분된다. ${f(M.IGNORE.m2, 0)} kg 추는 ${f(M.IGNORE.m1, 0)} kg 추와 박자를 맞춘다.</p>
      <table class="data">
        <tr><th>바꾸는 것</th><th>주기</th></tr>
        <tr><td>용수철에 달린 질량 <i>m</i></td><td><i>T</i> ∝ √<i>m</i></td></tr>
        <tr><td>용수철 상수 <i>k</i></td><td><i>T</i> ∝ 1/√<i>k</i></td></tr>
        <tr><td>진자의 길이 <i>L</i></td><td><i>T</i> ∝ √<i>L</i></td></tr>
        <tr><td>진자의 질량</td><td>변화 없음</td></tr>
        <tr><td>진폭 (진자는 작은 진폭일 때)</td><td>변화 없음</td></tr>
      </table>`,
    cam: { target: at('ignore', -0.6, 1.2), az: -12, el: 11, dist: 13.5 }, lit: 'amp', scene: 'ignore', look: {},
    fig: '두 진폭, 두 질량, 각각 하나의 주기',
  },

  {
    kicker: '6.8 · AP 물리 C', title: 'SHM 방정식', sub: '답이 코사인인 이유',
    body: `
      <p class="lede">훅 법칙을 Σ<i>F</i> = <i>ma</i>에 넣으면 <i>x</i>(<i>t</i>)에 대한 방정식을 얻는다.</p>
      <div class="eq">d²<i>x</i>/d<i>t</i>² = −(<i>k</i>/<i>m</i>) <i>x</i></div>
      <p><i>x</i> = <i>A</i> cos(ω<i>t</i> + φ)를 넣어 보자. 두 번 미분하면 −<i>A</i>ω² cos(ω<i>t</i> + φ) = −ω²<i>x</i>이다. ω = √(<i>k</i>/<i>m</i>) = ${f(M.W, 1)} rad/s이면 어떤 <i>A</i>와 φ에 대해서도 성립한다. <i>A</i>와 φ는 처음 조건 <i>x</i><sub>0</sub> = <i>A</i> cos φ, <i>v</i><sub>0</sub> = −<i>A</i>ω sin φ로 정해진다.</p>
      <div class="eq"><i>A</i> = √(<i>x</i><sub>0</sub>² + (<i>v</i><sub>0</sub>/ω)²) &nbsp; tan φ = −<i>v</i><sub>0</sub>/ω<i>x</i><sub>0</sub></div>
      <table class="data">
        <tr><th>출발</th><th><i>x</i><sub>0</sub>, <i>v</i><sub>0</sub></th><th><i>A</i></th><th>φ</th></tr>
        ${M.STARTS.map((st, i) => `<tr><td>${i ? '밀어서' : '놓아서'}</td><td>${f(st.x0)} m, ${f(st.v0, 1)} m/s</td><td>${f(st.A)} m</td><td>${f(st.phi / M.DEG, 1)}°</td></tr>`).join('')}
      </table>
      <div class="charts">${chart({ x0: 0, x1: 1, xlabels: ['0', '2T'], y0: -0.55, y1: 0.55, ylabels: ['0.5 m', '−0.5'], xlabel: '시간', ylabel: 'x', cursors: ['st0', 'st1'], label: '두 출발 조건에서 시간에 따른 위치: 주기는 같고 진폭과 위상은 다르다', h: 112,
        series: [{ cls: 'trend', pts: sample(u => M.start(0, u * T2).x, 0, 1, 160) }, { pts: sample(u => M.start(1, u * T2).x, 0, 1, 160) }] })}</div>
      <p class="hintline">점선: 놓아서 출발. 실선: 밀어서 출발. 어느 블록이든 클릭해 보자.</p>`,
    cam: { target: at('ode', 0.05, 0.45), az: -8, el: 16, dist: 16.5 }, lit: 'starts', scene: 'ode', look: {},
    fig: '방정식 하나, 출발 조건 둘',
  },
  {
    kicker: '6.9 · AP 물리 C', title: '물리 진자', sub: '회전축에 매달린 강체',
    body: `
      <p class="lede">강체의 무게는 회전축에서 거리 <i>d</i>만큼 아래에 있는 질량 중심에 작용하여 강체를 되돌려 비튼다.</p>
      <div class="eq">τ = −<i>mgd</i> sin θ ≈ −<i>mgd</i> θ</div>
      <p><i>I</i>α = τ에서 d²θ/d<i>t</i>² = −(<i>mgd</i>/<i>I</i>)θ이다. ω = √(<i>mgd</i>/<i>I</i>)인 SHM이며 주기는 다음과 같다.</p>
      <div class="eq"><i>T</i> = 2π√(<i>I</i>/<i>mgd</i>)</div>
      <p><i>I</i>는 회전축에 대한 값이다. <i>I</i> = <i>I</i><sub>cm</sub> + <i>md</i>² (평행축 정리).</p>
      <table class="data">
        <tr><th></th><th><i>I</i></th><th><i>d</i></th><th><i>T</i></th></tr>
        <tr><td>추, 줄 길이 <i>L</i></td><td><i>mL</i>²</td><td><i>L</i></td><td>2π√(<i>L</i>/<i>g</i>) = ${f(M.periodPendulum(M.ROD.L))} s</td></tr>
        <tr><td>길이 <i>L</i> 막대, 한끝이 축</td><td>⅓<i>mL</i>²</td><td><i>L</i>/2</td><td>2π√(2<i>L</i>/3<i>g</i>) = ${f(M.ROD.T)} s</td></tr>
        <tr><td>못에 걸린 고리</td><td>2<i>mR</i>²</td><td><i>R</i></td><td>2π√(2<i>R</i>/<i>g</i>) = ${f(M.HOOP.T)} s</td></tr>
      </table>
      <div class="charts">${chart({ x0: -5, x1: 0, xlabels: ['5 s 전', '현재'], y0: -9, y1: 9, ylabels: ['+8°', '−8°'], xlabel: '시간', ylabel: 'θ', cursors: ['rodNow', 'strNow'], label: '같은 길이의 막대와 단진자에서 시간에 따른 각: 막대의 주기가 더 짧다', h: 104,
        series: [{ cls: 'trend', live: 'strTh', fn: t => sample(u => M.pendulum(t + u, M.ROD.L, M.ROD.th0).th / M.DEG, -5, 0, 160) }, { live: 'rodTh', fn: t => sample(u => M.physical(M.ROD, t + u).th / M.DEG, -5, 0, 160) }] })}</div>
      <p class="hintline">실선: 막대. 점선: 줄. 막대를 클릭해 보자.</p>`,
    cam: { target: at('physical', 0.1, 2.1), az: -8, el: 6, dist: 11.5 }, lit: 'rod', scene: 'physical', look: {},
    fig: '각각 회전축에 매달린 줄, 막대, 고리',
  },
  {
    kicker: '6.10 · AP 물리 C', title: '비틀림 진자', sub: '비틀면 되비틀린다',
    body: `
      <p class="lede">원판을 철사에 매달고 돌린다. 철사는 각에 비례하여 되비틀린다. 회전에 대한 훅 법칙이다.</p>
      <div class="eq">τ = −κθ &nbsp;⇒&nbsp; <i>T</i> = 2π√(<i>I</i>/κ)</div>
      <p><i>I</i>α = −κθ는 용수철 방정식에서 <i>m</i> → <i>I</i>, <i>k</i> → κ로 바꾼 것이기 때문이다. κ는 철사의 <b>비틀림 상수</b>로 ${M.TORS.kappa} N·m/rad이다. 반지름 ${f(M.TORS.R)} m, 질량 ${f(M.TORS.M, 1)} kg인 원판은 <i>I</i> = ½<i>MR</i>² = ${f(M.TORS.I, 3)} kg·m²이므로 <i>T</i> = ${f(M.TORS.T, 2)} s이다.</p>
      <p>이번에는 작은 각 근사가 필요 없다. 철사를 얼마나 비틀든(한계 안에서) 돌림힘은 θ에 비례한다. ${(M.TORS.th0 / M.DEG).toFixed(0)}°에서도 5°에서도 주기는 같다.</p>
      <div class="charts">${chart({ x0: -60, x1: 60, y0: -0.3, y1: 0.3, ylabels: ['0.3 N·m', '−0.3'], xlabels: ['−60°', '60°'], xlabel: '비틀림 θ', ylabel: 'τ', cursors: ['tq'], label: '비틀림 각에 따른 돌림힘: 기울기가 −κ인 직선', h: 120,
        series: [{ pts: [[-60, M.TORS.kappa * 60 * M.DEG], [60, -M.TORS.kappa * 60 * M.DEG]], tag: [12, -0.08, '기울기 −κ'] }] })}</div>
      <p class="hintline">원판을 클릭하면 철사가 원판에 작용하는 돌림힘을 볼 수 있다.</p>`,
    cam: { target: at('torsion', 0.1, 1.9), az: -14, el: 22, dist: 5.9 }, lit: 'disc', scene: 'torsion', look: {},
    fig: '철사에 매달려 비틀리는 원판',
  },
  {
    kicker: '6.11', title: '일상 속 진동자', sub: '자동차, 그네',
    body: `
      <p class="lede">변위에 따라 커지는 복원력을 받는 것은 무엇이든 진동한다.</p>
      <p><b>용수철 위의 자동차.</b> ${M.CAR.m} kg 차체가 합쳐서 ${(M.CAR.k / 1000).toFixed(0)} kN/m인 용수철 네 개 위에 얹혀 있다. 자기 무게로 ${f(100 * M.CAR.d, 1)} cm 처지며, 눌렀다 놓으면 <i>T</i> = 2π√(<i>m</i>/<i>k</i>) = ${f(M.CAR.T)} s로 출렁인다. (실제 충격 흡수 장치는 한두 번 왕복하는 사이에 이 진동을 잦아들게 하지만, 여기서는 꺼 두었다.)</p>
      <p><b>그네.</b> ${f(M.SWING.L, 1)} m 그네에 탄 아이는 진자다. 작게 밀든 크게 밀든, 아이가 가볍든 무겁든 <i>T</i> = 2π√(<i>L</i>/<i>g</i>) = ${f(M.SWING.T)} s이다. 그래서 박자에 맞춰 밀어 주는 것이다.</p>
      <table class="data cols">
        <tr><th>용수철에 달린 물체</th><th>진자</th></tr>
        <tr><td>복원력 −<i>kx</i></td><td>복원력 −<i>mg</i> sin θ</td></tr>
        <tr><td>항상 SHM</td><td>θ가 작을 때 SHM</td></tr>
        <tr><td>½<i>kA</i>² = ½<i>mv</i><sub>max</sub>²</td><td><i>mg</i>Δ<i>y</i> = ½<i>mv</i><sub>max</sub>²</td></tr>
      </table>`,
    cam: { target: at('life', -1.4, 1.4), az: -12, el: 8, dist: 19.5 }, lit: 'car', scene: 'life', look: {},
    fig: '출렁이는 자동차, 그네 타는 아이',
  },
];

// ---------- click a scene: what it breaks into ----------
const phase = t => { const s = M.spring(t); return Math.abs(s.x) > 0.97 * M.A ? '끝점: 정지, 힘과 가속도 최대' : Math.abs(s.x) < 0.03 * M.A ? '평형점: 가장 빠름, 힘 없음' : s.x * s.v < 0 ? '중심으로 향함: 빨라짐' : '바깥으로 향함: 느려짐'; };
export const PLATES = {
  spring: { text: `복원력 위에 속도(검정)와 가속도(빨강)를 겹쳐 그렸다. 가속도는 힘처럼 항상 가운데를 향한다. 속도는 블록이 가는 쪽을 향한다. 중심으로 향할 때는 둘의 방향이 같아 블록이 빨라지고, 바깥으로 향할 때는 방향이 달라 느려진다.`,
    facts: s => { const r = M.spring(s.t); return [['위치 x', `${f(r.x)} m`], ['속도 v', `${f(r.v)} m/s`], ['가속도 a', `${f(r.a)} m/s²`], ['현재 상태', phase(s.t)]]; } },
  hooke: { text: `블록이 점으로 줄어든다. 이것이 자유 물체 도형이다. 무게와 수직 항력은 상쇄된다. 남은 힘은 용수철 힘뿐이므로 그것이 알짜힘이며, 항상 x = 0 쪽을 향한다.`,
    facts: s => { const r = M.spring(s.t); return [['변위 x', `${f(r.x)} m`], ['F<sub>s</sub> = −kx', `${f(r.F)} N`], ['a = F<sub>s</sub>/m', `${f(r.a)} m/s²`], ['무게, 수직 항력', `각각 ${f(M.WEIGHT)} N, 상쇄`]]; } },
  trace: { text: `빨간 선은 펜 위치에서 그래프에 그은 접선이다. 종이는 1초마다 ${PAPER} m씩 움직이므로, 1초 동안 펜이 옆으로 움직인 거리, 곧 기울기가 블록의 속도다. 펜이 가운데를 지날 때 가장 가파르고 양 끝에서 평평하다.`,
    facts: s => { const r = M.spring(s.t); return [['x', `${f(r.x)} m`], ['기울기 = v', `${f(r.v)} m/s`], ['a', `${f(r.a)} m/s²`], ['t', `${f(M.T0, 3)} s 중 ${f(s.t % M.T0)} s`]]; } },
  energy: { text: `쌓인 막대가 두 부분으로 나뉜다. 각각의 높이는 매 순간 변하지만, 합치면 항상 점선 ½kA²에 닿는다.`,
    facts: s => { const r = M.spring(s.t); return [['운동 ½mv²', `${f(r.KE)} J`], ['용수철 ½kx²', `${f(r.U)} J`], ['합계', `${f(r.KE + r.U)} J`], ['x', `${f(r.x)} m`]]; } },
  hang: { text: `자유 물체 도형. 용수철은 항상 위로 당기고(여기서는 항상 늘어나 있다), 무게는 아래로 당긴다. 둘의 차인 빨간 알짜힘은 −ky로, 평형에서 0이고 맨 위와 맨 아래에서 가장 크다.`,
    facts: s => { const r = M.hang(s.t); return [['평형에서 잰 y', `${f(r.y)} m`], ['용수철 k(d − y)', `위로 ${f(r.Fs)} N`], ['무게 mg', `아래로 ${f(M.WEIGHT)} N`], ['알짜힘 = −ky', `${f(r.net)} N`]]; } },
  pendulum: { text: `무게를 두 성분(회색)으로 바꿔 놓았다. 줄 방향 성분과 호 방향 성분이다. 줄 방향으로는 장력이 mg cos θ보다 크며, 이 차이가 경로를 원으로 휘게 한다. 호 방향으로는 mg sin θ가 복원력이며, 가장 낮은 곳 쪽을 향한다.`,
    facts: s => { const p = M.pendulum(s.t); return [['각 θ', `${f(p.th / M.DEG, 1)}°`], ['mg sin θ (복원력)', `${f(Math.abs(p.restoring), 3)} N`], ['mg cos θ', `${f(p.along, 3)} N`], ['장력 T', `${f(p.tension, 3)} N`], ['속력', `${f(Math.abs(p.v), 3)} m/s`]]; } },
  springs4: { text: `4.0 kg 블록은 같은 16 N/m 용수철에 달린 질량이 네 배다. 이 블록이 한 번 왕복할 때마다 1.0 kg 블록은 두 번 왕복한다.`,
    facts: s => [['1.0 kg: T', `${f(M.periodSpring(1, M.K), 3)} s`], ['4.0 kg: T', `${f(M.periodSpring(4, M.K), 3)} s`], ['지금까지 왕복 횟수', `${f(s.t / M.periodSpring(1, M.K), 1)}, ${f(s.t / M.periodSpring(4, M.K), 1)}`]] },
  pend4: { text: `긴 진자는 짧은 진자보다 네 배 길다. 짧은 진자가 두 번 흔들릴 때 한 번 흔들린다.`,
    facts: s => [[`${f(M.DOUBLE.L)} m: T`, `${f(M.periodPendulum(M.DOUBLE.L), 3)} s`], [`${f(M.DOUBLE.L4, 1)} m: T`, `${f(M.periodPendulum(M.DOUBLE.L4), 3)} s`], ['지금까지 흔들린 횟수', `${f(s.t / M.periodPendulum(M.DOUBLE.L), 1)}, ${f(s.t / M.periodPendulum(M.DOUBLE.L4), 1)}`]] },
  amp: { text: `같은 블록, 같은 용수철이지만 하나는 두 배 멀리 당겼다. 매 순간 멀리 당긴 쪽의 변위, 힘, 속력이 모두 두 배이므로 둘은 양 끝과 가운데에 함께 도착한다.`,
    facts: s => [['작은 진폭: x', `${f(M.spring(s.t, M.IGNORE.A1).x)} m`], ['큰 진폭: x', `${f(M.spring(s.t, M.IGNORE.A2).x)} m`], ['비', '항상 2'], ['둘 다: T', `${f(M.T0, 3)} s`]] },
  bobs: { text: `질량이 네 배면 복원력도 네 배지만, 움직이기 어려운 정도인 관성도 네 배다. 둘이 상쇄되어 두 추는 함께 흔들린다.`,
    facts: s => [['1 kg: mg sin θ', `${f(Math.abs(M.pendulum(s.t, M.IGNORE.L, M.IGNORE.th0, 1).restoring), 3)} N`], ['4 kg: mg sin θ', `${f(Math.abs(M.pendulum(s.t, M.IGNORE.L, M.IGNORE.th0, 4).restoring), 3)} N`], ['둘 다: T', `${f(M.periodPendulum(M.IGNORE.L), 3)} s`]] },

  starts: { text: `각 블록은 반지름 A인 원 위를 ω = √(k/m)로 도는 빨간 점의 그림자다. 두 점은 같은 빠르기로 돌지만, 크기가 다른 원 위의 서로 다른 각 φ에서 출발한다. 밀어서 출발한 블록의 점은 53° 돌아간 곳에서 출발하므로, 그 블록은 이미 중심 쪽으로 움직이고 있다.`,
    facts: s => [0, 1].map(i => { const r = M.start(i, s.t), st = M.STARTS[i]; return [i ? '밀어서' : '놓아서', `x ${f(r.x)} m, A ${f(st.A)} m, φ ${f(st.phi / M.DEG, 0)}°`]; }).concat([['ω, 둘 다', `${f(M.W, 1)} rad/s`], ['T, 둘 다', `${f(M.T0, 3)} s`]]) },
  string: { text: `단진자는 질량이 모두 한 점에 모인 물리 진자다. I = mL², d = L이므로 2π√(I/mgd) = 2π√(L/g)이다.`,
    facts: s => { const p = M.pendulum(s.t, M.ROD.L, M.ROD.th0); return [['각', `${f(p.th / M.DEG, 1)}°`], ['I = mL²', `${f(M.ROD.m * M.ROD.L ** 2, 2)} kg·m²`], ['d', `${f(M.ROD.L, 2)} m`], ['T', `${f(M.periodPendulum(M.ROD.L), 3)} s`]]; } },
  rod: { text: `무게는 회전축에서 d = L/2 아래에 있는 질량 중심에 작용한다. 막대에 수직인 성분(빨강)의 지레팔이 d이므로 τ = −mgd sin θ이다. 2L/3에 있는 빨간 표시는 진동 중심으로, 그 길이의 줄에 매단 추는 막대와 박자를 맞춰 흔들린다.`,
    facts: s => { const r = M.physical(M.ROD, s.t); return [['각', `${f(r.th / M.DEG, 1)}°`], ['τ = −mgd sin θ', `${f(r.torque, 3)} N·m`], ['I = ⅓mL²', `${f(M.ROD.I, 3)} kg·m²`], ['α = τ/I', `${f(r.torque / M.ROD.I, 3)} rad/s²`], ['T', `${f(M.ROD.T, 3)} s`]]; } },
  hoop: { text: `고리의 질량은 모두 중심에서 R만큼 떨어져 있으므로 I_cm = mR²이다. 못도 중심에서 R만큼 떨어져 있으므로 평행축 정리에 따라 mR²이 더해져 I = 2mR²이다. d = R이므로 T = 2π√(2R/g)로, 길이가 고리의 지름과 같은 단진자와 같다.`,
    facts: s => { const h = M.physical(M.HOOP, s.t); return [['각', `${f(h.th / M.DEG, 1)}°`], ['I = 2mR²', `${f(M.HOOP.I, 3)} kg·m²`], ['d = R', `${f(M.HOOP.d)} m`], ['τ', `${f(h.torque, 3)} N·m`], ['T', `${f(M.HOOP.T, 3)} s`]]; } },
  disc: { text: `빨간 화살표는 철사가 원판에 작용하는 돌림힘이다. 항상 θ = 0 쪽을 향하며, 많이 비틀수록 길어진다(1 N·m당 호 ${TQ_ARC} rad). θ = 0에서는 돌림힘이 없고 원판이 가장 빠르게 돈다.`,
    facts: s => { const r = M.torsion(s.t); return [['비틀림 θ', `${f(r.th / M.DEG, 1)}°`], ['τ = −κθ', `${f(r.torque, 3)} N·m`], ['α = τ/I', `${f(r.alpha, 2)} rad/s²`], ['각속력', `${f(Math.abs(r.om), 2)} rad/s`], ['T', `${f(M.TORS.T, 3)} s`]]; } },
  car: { text: `차체는 네 용수철 위에서, 네 용수철의 강성을 합친 용수철 하나에 달린 질량 하나처럼 위아래로 움직인다. 가속도(빨강)는 정지 높이 쪽을 향하며, 출렁일 때마다 맨 위와 맨 아래에서 가장 크다.`,
    facts: s => { const r = M.shm(M.CAR.A, Math.sqrt(M.CAR.k / M.CAR.m), s.t); return [['정지 높이 기준 높이', `${f(100 * r.x, 1)} cm`], ['가속도', `${f(r.a)} m/s²`], ['주기', `${f(M.CAR.T, 3)} s`], ['진동수', `${f(1 / M.CAR.T, 2)} Hz`]]; } },
  swing: { text: `그네는 나뭇가지에서 아이의 질량 중심까지가 길이인 진자다. 주기는 그 길이와 g에만 달려 있다.`,
    facts: s => { const p = M.pendulum(s.t, M.SWING.L, M.SWING.th0, M.SWING.m); return [['각', `${f(p.th / M.DEG, 1)}°`], ['속력', `${f(Math.abs(p.v))} m/s`], ['주기', `${f(M.SWING.T, 2)} s`], ['복원력', `${f(Math.abs(p.restoring), 1)} N`]]; } },
};
