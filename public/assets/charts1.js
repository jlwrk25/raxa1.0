/* ==========================================================
   charts1.js  -  "Users" line graph (Registered / Unregistered / Total)
   Put in:  RaXa 1.0/assets/
   Needs in the page:
     <svg id="usersChart" viewBox="0 0 1000 340"></svg>   (any size: the chart adapts to the viewBox)
     <p id="usersCaption"></p>                            (optional)

   How it works
   - Three smooth lines from Jan 1, 2021 up to TODAY (read from the clock):
       green  = Registered Users   (ends at 28)
       orange = Unregistered Users (ends at 10)
       grey   = Total              (Registered + Unregistered = 38)
   - One point per month (not per day) joined by soft curves, so the
     lines look calm and elegant instead of jagged.
   - Every wiggle comes from a seeded generator keyed on the calendar
     date, so refreshing the page keeps the same history.
   - Today's values always land exactly on the two targets below.
     (A tiny smooth correction is spread over the history, so older
     points can shift by a hair as each new day is added.)
   - Subscribed % = Registered / Total  (28 of 38 = 74%), shown in the
     chart header and the caption. It is calculated, not typed in.
   - Redraws by itself when midnight passes, even if the page stays open.

   Colors can be overridden with CSS variables on a parent:
   --rx-chart-registered  --rx-chart-unregistered  --rx-chart-total
   --rx-chart-grid  --rx-chart-muted  --rx-chart-bg  --rx-chart-text
   ========================================================== */
(function () {
  "use strict";

  var DAY = 86400000;
  var START = Date.UTC(2021, 0, 1);
  var KNOT = 30;           // one point about every 30 days
  var TRIAL_DAYS = 52;     // length of the free trial, used in the conversion text

  // the only fixed numbers: where each line must end today
  var SERIES = [
    {
      key: "registered", label: "Registered Users", target: 28, salt: 1013,
      color: "var(--rx-chart-registered,#6fbf00)",
      shape: function (t) { return 0.55 * Math.pow(t, 1.8) + 0.45 * (3 * t * t - 2 * t * t * t); },
      wavePeriods: [330, 190], wavePhase: [0.7, 2.1], waveSize: 0.10
    },
    {
      key: "unregistered", label: "Unregistered Users", target: 10, salt: 7919,
      color: "var(--rx-chart-unregistered,#ff8a1f)",
      shape: function (t) { return 0.7 * t + 0.3 * Math.pow(t, 1.3); },
      wavePeriods: [280, 160], wavePhase: [1.9, 0.4], waveSize: 0.14
    }
  ];
  var TOTAL_COLOR = "var(--rx-chart-total,#7d8b9a)";

  /* ---------- seeded randomness (depends only on day number + salt) ---------- */
  function rand(day, salt) {
    var h = (Math.imul(day + 1, 0x9E3779B1) ^ Math.imul(salt + 1, 0x85EBCA6B)) | 0;
    h ^= h >>> 15; h = Math.imul(h, 0x85EBCA6B);
    h ^= h >>> 13; h = Math.imul(h, 0xC2B2AE35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  function r1(day, salt) { return rand(day, salt) * 2 - 1; }   // -1 .. 1

  function dayCount(today) {
    return Math.round((today - START) / DAY);
  }

  // which days get a point: every KNOT days, plus today (never two points crowded together)
  function knotDays(n) {
    var days = [0], i;
    for (i = KNOT; i < n - 12; i += KNOT) days.push(i);
    days.push(n);
    return days;
  }

  /* ---------- one series at the knot days ----------
     value = slow growth curve + gentle long waves + a soft, smoothed wobble */
  function buildSeries(cfg, days, n) {
    var base = [], dev = [], i, k;

    for (k = 0; k < days.length; k++) {
      i = days[k];
      var t = i / n;
      var env = Math.min(1, i / 240) * Math.min(1, (n - i) / 90);      // zero at both ends
      var wave = 0;
      for (var w = 0; w < 2; w++) {
        wave += (w ? 0.6 : 1) * Math.sin(2 * Math.PI * i / cfg.wavePeriods[w] + cfg.wavePhase[w]);
      }
      var b = cfg.target * (cfg.shape(t) + cfg.waveSize * env * wave);
      base.push(b);

      // 3-point smoothed noise taken from absolute days, so it never changes for a given date
      var noise = (r1(i - KNOT, cfg.salt + 5) + 2 * r1(i, cfg.salt + 5) + r1(i + KNOT, cfg.salt + 5)) / 4;
      var settle = Math.min(1, (n - i) / 120);                         // wobble fades out so the line lands smoothly on today's value
      dev.push(i === 0 ? 0 : noise * (0.02 * cfg.target + 0.05 * b) * settle);
    }

    // spread a smooth correction over the history so today lands exactly on target
    var fix = dev[dev.length - 1], out = [];
    for (k = 0; k < days.length; k++) {
      var v = base[k] + dev[k] - fix * (days[k] / n);
      out.push(Math.max(0, v));
    }
    out[0] = 0;
    out[out.length - 1] = cfg.target;
    return out;
  }

  // smooth curve through points (Catmull-Rom converted to Bezier)
  function curve(pts) {
    var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += "C" + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + " " + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) +
           "," + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + " " + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) +
           "," + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    return d;
  }

  function niceMax(maxV) {
    var steps = [5, 10, 20, 50, 100, 200, 500, 1000], step = 5;
    for (var s = 0; s < steps.length; s++) {
      step = steps[s];
      if (Math.ceil(maxV * 1.1 / step) <= 6) break;
    }
    return { step: step, max: Math.max(step * 2, Math.ceil(maxV * 1.1 / step) * step) };
  }

  /* ---------- drawing ---------- */
  function draw() {
    var svg = document.getElementById("usersChart");
    if (!svg) return;

    var now = new Date();
    var todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    var n = dayCount(todayUTC);
    if (n < 60) n = 60;                                 // safety if the clock is wrong

    var days = knotDays(n);
    var lines = SERIES.map(function (cfg) {
      return { key: cfg.key, label: cfg.label, color: cfg.color, w: 3, values: buildSeries(cfg, days, n) };
    });
    var total = lines[0].values.map(function (v, k) { return v + lines[1].values[k]; });
    var all = [{ key: "total", label: "Total", color: TOTAL_COLOR, w: 2.5, values: total }].concat(lines);

    var reg = lines[0].values[days.length - 1], unreg = lines[1].values[days.length - 1];
    var tot = reg + unreg;
    var pct = Math.round(reg / tot * 100);

    var maxV = 0;
    total.forEach(function (v) { if (v > maxV) maxV = v; });
    var scale = niceMax(maxV);

    // use the size the page gave the svg, so changing the viewBox resizes the chart
    var vb = svg.viewBox && svg.viewBox.baseVal;
    var W = (vb && vb.width) || 800, H = (vb && vb.height) || 320;
    var L = 50, R = 24, T = 52, B = 40;
    var x = function (i) { return L + (i / n) * (W - L - R); };
    var y = function (v) { return T + (1 - v / scale.max) * (H - T - B); };

    var grid = "var(--rx-chart-grid,#d7e0e9)";
    var muted = "var(--rx-chart-muted,#5b6b7b)";
    var halo = "var(--rx-chart-bg,#ffffff)";
    var ink = "var(--rx-chart-text,#12263a)";

    // soft vertical fade under each line + clip so curves never dip under 0
    var html = '<defs><clipPath id="rxChartClip"><rect x="' + L + '" y="' + (T - 10) +
               '" width="' + (W - L - R) + '" height="' + (y(0) - T + 12).toFixed(1) + '"/></clipPath>';
    all.forEach(function (s) {
      html += '<linearGradient id="rxGrad-' + s.key + '" x1="0" y1="0" x2="0" y2="1">' +
              '<stop offset="0" style="stop-color:' + s.color + ';stop-opacity:' + (s.key === "total" ? ".22" : ".30") + '"/>' +
              '<stop offset="1" style="stop-color:' + s.color + ';stop-opacity:0"/></linearGradient>';
    });
    html += "</defs>";

    // horizontal grid + y labels
    for (var g = 0; g <= scale.max; g += scale.step) {
      html += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(g).toFixed(1) + '" y2="' + y(g).toFixed(1) +
              '" stroke="' + grid + '"/>' +
              '<text x="' + (L - 10) + '" y="' + (y(g) + 4).toFixed(1) + '" text-anchor="end" font-size="13" fill="' + muted + '">' + g + "</text>";
    }

    // vertical grid + year labels (each Jan 1), skipping any that would crowd the "Today" label
    var thisYear = now.getFullYear();
    for (var yr = 2021; yr <= thisYear; yr++) {
      var idx = dayCount(Date.UTC(yr, 0, 1));
      if (idx > n) break;
      var xx = x(idx);
      html += '<line x1="' + xx.toFixed(1) + '" x2="' + xx.toFixed(1) + '" y1="' + T +
              '" y2="' + y(0).toFixed(1) + '" stroke="' + grid + '" stroke-dasharray="3 5"/>';
      if (xx > W - R - 70) continue;
      html += '<text x="' + xx.toFixed(1) + '" y="' + (H - 12) + '" text-anchor="' + (yr === 2021 ? "start" : "middle") +
              '" font-size="13" fill="' + muted + '">' + yr + "</text>";
    }
    html += '<text x="' + (W - R) + '" y="' + (H - 12) + '" text-anchor="end" font-size="13" fill="' + muted + '">Today</text>';

    // lines + soft areas (grey total first, so green/orange sit on top)
    html += '<g clip-path="url(#rxChartClip)">';
    all.forEach(function (s) {
      var xy = days.map(function (d, k) { return [x(d), y(s.values[k])]; });
      var line = curve(xy);
      var area = line + "L" + xy[xy.length - 1][0].toFixed(1) + " " + y(0).toFixed(1) +
                 "L" + xy[0][0].toFixed(1) + " " + y(0).toFixed(1) + "Z";
      s.xy = xy;
      html += '<path d="' + area + '" fill="url(#rxGrad-' + s.key + ')"/>' +
              '<path d="' + line + '" fill="none" stroke="' + s.color + '" stroke-width="' + s.w +
              '" stroke-linecap="round" stroke-linejoin="round"/>';
    });
    html += "</g>";

    // glowing dots on the main peaks and dips of the total line
    var tx = all[0].xy, lastY = tx[0][1], shown = 0, k, j;
    for (k = 2; k < tx.length - 3 && shown < 4; k++) {
      var isMax = true, isMin = true;
      for (j = k - 2; j <= k + 2; j++) {
        if (tx[j][1] < tx[k][1]) isMax = false;     // smaller y = higher value
        if (tx[j][1] > tx[k][1]) isMin = false;
      }
      if ((isMax || isMin) && Math.abs(tx[k][1] - lastY) > (H - T - B) * 0.10) {
        html += '<circle cx="' + tx[k][0].toFixed(1) + '" cy="' + tx[k][1].toFixed(1) + '" r="10" fill="' + TOTAL_COLOR + '" opacity=".22"/>' +
                '<circle cx="' + tx[k][0].toFixed(1) + '" cy="' + tx[k][1].toFixed(1) + '" r="4.5" fill="' + halo + '" stroke="' + TOTAL_COLOR + '" stroke-width="2"/>';
        lastY = tx[k][1]; shown++;
      }
    }

    // end-of-line dots with a soft glow, plus today's number
    all.forEach(function (s) {
      var last = s.xy[s.xy.length - 1];
      var val = s.key === "total" ? tot : s.key === "registered" ? reg : unreg;
      html += '<circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="12" fill="' + s.color + '" opacity=".22"/>' +
              '<circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="6" fill="' + s.color +
              '" stroke="' + ink + '" stroke-width="2"/>' +
              '<text x="' + (last[0] - 12).toFixed(1) + '" y="' + (last[1] - 12).toFixed(1) +
              '" text-anchor="end" font-size="15" font-weight="700" fill="' + ink +
              '" stroke="' + halo + '" stroke-width="4" paint-order="stroke">' + Math.round(val) + "</text>";
    });

    // legend (left) and conversion rate (right)
    var lx = L;
    [lines[0], lines[1], all[0]].forEach(function (s) {
      html += '<line x1="' + lx + '" x2="' + (lx + 24) + '" y1="20" y2="20" stroke="' + s.color +
              '" stroke-width="4" stroke-linecap="round"/>' +
              '<text x="' + (lx + 32) + '" y="25" font-size="14" font-weight="600" fill="' + ink + '">' + s.label + "</text>";
      lx += 32 + s.label.length * 8 + 22;
    });
    html += '<text x="' + (W - R) + '" y="25" text-anchor="end" font-size="14" font-weight="600" fill="' + ink + '">' +
            '<tspan font-size="17" font-weight="800" fill="' + lines[0].color + '" stroke="' + halo + '" stroke-width="3" paint-order="stroke">' + pct + '%</tspan>' +
            ' subscribed after the ' + TRIAL_DAYS + '-day free trial</text>';

    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Line graph of registered users (green), unregistered users (orange) and the total (grey) from 2021 to today");
    svg.innerHTML = html;

    var cap = document.getElementById("usersCaption");
    if (cap) {
      cap.textContent = "Registered users (green), unregistered users (orange) and the total (grey) since January 2021 \u2014 " +
        "now " + Math.round(reg) + " registered, " + Math.round(unreg) + " unregistered, " + Math.round(tot) + " in total. " +
        pct + "% of users who signed up for the " + TRIAL_DAYS + "-day free trial decided to subscribe (" +
        Math.round(reg) + " of " + Math.round(tot) + ").";
    }

    return todayUTC;
  }

  /* ---------- start + keep it current ---------- */
  var drawnFor = null;
  function refresh() {
    var d = new Date();
    var key = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
    if (key === drawnFor) return;
    if (draw() !== undefined) drawnFor = key;
  }

  function start() {
    refresh();
    setInterval(refresh, 60000);                        // catches midnight on a page left open
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) refresh();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
