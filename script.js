// ---- Content: edit here. Add `img: "images/name.jpg"` to a card to replace its emoji with a screenshot. ----
const SHIPPED = [
  { name: "SL Live", tag: "Travel planning", emoji: "🚌", color: "#29d3ff",
    blurb: "Live bus and train travel planning for Stockholm's SL network. Runs on my own server.", url: "https://sl.ogun.se/", host: "sl.ogun.se" },
  { name: "Svensk Fotboll", tag: "Live map", emoji: "⚽", color: "#2ee59d",
    blurb: "A live map of Swedish football.", url: "https://oguneg.github.io/svenskfotboll/", host: "svenskfotboll" },
  { name: "Verb Tränare", tag: "Language app", emoji: "🇸🇪", color: "#ffd23f",
    blurb: "A trainer for Swedish verbs.", url: "https://oguneg.github.io/verb-tranare/", host: "verb-tranare" },
  { name: "Walk to Burn", tag: "Web page", emoji: "🥾", color: "#ff8a3d",
    blurb: "A simple page on why incline walking works so well.", url: "https://oguneg.github.io/walktoburn/", host: "walktoburn" },
];
const GAMES = [
  { name: "Tap on Time!", tag: "Phoca", host: "App Store", img: "images/tap-on-time.jpg", color: "#ffd23f",
    blurb: "Tap the target as your avatar spins around the circle, at ever higher speeds. 3.5M+ players and several runs in the iOS US top charts.",
    url: "https://apps.apple.com/se/app/tap-on-time/id1607320796?l=en-GB" },
  { name: "Beauty Care!", tag: "Ruby Game Studio", host: "App Store", img: "images/beauty-care.jpg", color: "#ff4d8d",
    blurb: "Satisfying mini games where you unlock more tools and update your office.",
    url: "https://apps.apple.com/se/app/beauty-care/id1520462164?l=en-GB" },
  { name: "My games on itch.io", tag: "Play in browser", host: "ogun.itch.io", img: "images/itch-io.svg", logo: true, color: "#29d3ff",
    blurb: "I make games, music and very simple art. My games are playable right in the browser.",
    url: "https://ogun.itch.io" },
];

const $ = (s, el = document) => el.querySelector(s);
// Motion: the system "reduce motion" setting is the default, and the button on the strip overrides it (and is remembered).
const osReduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const initialMotion = (os, stored) => (stored === "on" ? true : stored === "off" ? false : !os);
let motion = initialMotion(osReduced(), (() => { try { return localStorage.getItem("motion"); } catch (e) { return null; } })());
document.documentElement.dataset.motion = motion ? "on" : "off";

function card(g) {
  const el = document.createElement(g.url ? "a" : "article");
  el.className = "game rv";
  el.style.background = g.color;
  if (g.url) { el.href = g.url; el.target = "_blank"; el.rel = "noopener"; }
  const art = g.img ? `<img class="icon${g.logo ? " logo-tile" : ""}" src="${g.img}" alt="${g.logo ? "itch.io logo" : g.name + " app icon"}" width="120" height="120" loading="lazy">` : `<div class="glyph" aria-hidden="true">${g.emoji}</div>`;
  const foot = g.host ? `<span>${g.host} ↗</span>` : `<span>${g.meta}</span>`;
  el.innerHTML = `${art}<div><h3>${g.name}</h3><p class="blurb">${g.blurb}</p><div class="meta"><span class="tag">${g.tag}</span>${foot}</div></div>`;
  return el;
}
SHIPPED.forEach(g => $("#shipped-grid").appendChild(card(g)));
GAMES.forEach(g => $("#games-grid").appendChild(card(g)));
$("#shipped-count").textContent = SHIPPED.length;

// The email address is assembled here so it is not sitting in the page source for scrapers.
$("#mail").addEventListener("click", e => {
  e.preventDefault();
  location.href = "mailto:" + ["ogunemregundogdu", "gmail.com"].join("@") + "?subject=" + encodeURIComponent("Hello from ogun.se");
});

// 3D tilt on cards
if (matchMedia("(hover:hover)").matches) {
  document.addEventListener("mousemove", e => {
    if (!motion) return;
    const el = e.target.closest && e.target.closest(".game"); if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    el.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-4px)`;
  });
  document.addEventListener("mouseout", e => { const el = e.target.closest && e.target.closest(".game"); if (el) el.style.transform = ""; });
}

// ---- Reveal on scroll + count-up ----
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in"); io.unobserve(e.target);
  const b = $("b[data-n]", e.target);
  if (b) countUp(b);
}), { threshold: .15 });
document.querySelectorAll(".rv,.stat,.steps li,.pace-points article,.chat,.broke,.flow li").forEach(el => { el.classList.add("rv"); io.observe(el); });

function countUp(b) {
  const to = parseFloat(b.dataset.n), suf = b.dataset.suffix || "", dec = String(to).includes(".") ? 1 : 0;
  if (!motion) { b.textContent = to.toFixed(dec) + suf; return; }
  const t0 = performance.now();
  (function f(t) {
    const p = Math.min((t - t0) / 1200, 1), e = 1 - Math.pow(1 - p, 3);
    b.textContent = (to * e).toFixed(dec) + (p === 1 ? suf : "");
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}

$("#yr").textContent = new Date().getFullYear();

// ---- Hero playground: shoveable blocks ----
// Motion is time-based (units are "per 1/60 s"), so a 120 Hz laptop screen moves things at the same speed as a 60 Hz one.
const cv = $("#playground"), ctx = cv.getContext("2d");
const COLORS = ["#ff4d8d", "#ff8a3d", "#ffd23f", "#2ee59d", "#3d7bff", "#7b4dfd", "#29d3ff"];
const FRAME = 1000 / 60;
let W = 0, H = 0, DPR = 1, blocks = [], small = null;
const copy = $(".hero-copy"), hero = $(".hero");
const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, t: 0 };
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// The headline column is an obstacle: shapes bounce off it, so text is never drawn over a colour block.
function textBox() {
  const c = copy.getBoundingClientRect(), v = cv.getBoundingClientRect(), pad = 14;
  return { l: c.left - v.left - pad, r: c.right - v.left + pad, t: c.top - v.top - pad, b: c.bottom - v.top + pad };
}
const inside = (x, y, r, o) => x + r > o.l && x - r < o.r && y + r > o.t && y - r < o.b;

function spawn() {
  const n = small ? 9 : Math.round(clamp(W / 40, 14, 34)), box = textBox();
  blocks = Array.from({ length: n }, (_, i) => {
    const s = (small ? 22 : 26) + Math.random() * (small ? 28 : 46);
    let x, y, tries = 0;
    do { x = Math.random() * W; y = Math.random() * H; } while (inside(x, y, s / 2, box) && ++tries < 40);
    return { x, y, vx: (Math.random() - .5) * 1.2, vy: (Math.random() - .5) * 1.2,
      s, rot: Math.random() * 6, vr: (Math.random() - .5) * .02, c: COLORS[i % COLORS.length], kind: i % 3 };
  });
}

// Runs on every resize and zoom. It must NOT re-scatter the shapes: it only resizes the canvas and carries the shapes along.
function layout() {
  const nW = cv.clientWidth, nH = cv.clientHeight;
  if (!nW || !nH) return;
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  const px = Math.round(nW * DPR), py = Math.round(nH * DPR);
  if (cv.width !== px || cv.height !== py) { cv.width = px; cv.height = py; }
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const nowSmall = nW < 700;
  if (!blocks.length || nowSmall !== small) { W = nW; H = nH; small = nowSmall; spawn(); }   // only a phone/desktop switch re-deals the shapes
  else { const sx = nW / W, sy = nH / H; for (const b of blocks) { b.x *= sx; b.y *= sy; } W = nW; H = nH; }
}

function roundedSquare(r, size, radius) {
  if (ctx.roundRect) { ctx.roundRect(-r, -r, size, size, radius); return; }   // older Safari has no roundRect
  ctx.moveTo(-r + radius, -r);
  ctx.arcTo(r, -r, r, r, radius); ctx.arcTo(r, r, -r, r, radius); ctx.arcTo(-r, r, -r, -r, radius); ctx.arcTo(-r, -r, r, -r, radius);
  ctx.closePath();
}
function shape(b) {
  ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot);
  ctx.fillStyle = b.c; ctx.strokeStyle = "#1b1230"; ctx.lineWidth = 3; ctx.lineJoin = "round";
  const r = b.s / 2; ctx.beginPath();
  if (b.kind === 0) roundedSquare(r, b.s, b.s * .28);
  else if (b.kind === 1) ctx.arc(0, 0, r, 0, Math.PI * 2);
  else { ctx.moveTo(0, -r); ctx.lineTo(r, r * .8); ctx.lineTo(-r, r * .8); ctx.closePath(); }
  ctx.fill(); ctx.stroke(); ctx.restore();
}

// One simulation step. dt is in 60 Hz frames (1 = 16.7 ms), so 120 Hz gives 0.5 and a stalled tab is capped at 3.
function step(dt = 1) {
  ctx.clearRect(0, 0, W, H);
  const box = textBox(), damp = Math.pow(.985, dt);
  for (const b of blocks) {
    const dx = b.x - mouse.x, dy = b.y - mouse.y, d = Math.hypot(dx, dy) || 1, R = 130 + b.s;
    if (d < R) {
      const f = (1 - d / R) * 1.6 * dt;
      b.vx += (dx / d) * f + mouse.vx * .02 * dt; b.vy += (dy / d) * f + mouse.vy * .02 * dt; b.vr += (dx > 0 ? 1 : -1) * .004 * dt;
    }
    b.vx *= damp; b.vy *= damp; b.vr *= damp;
    b.vx += (Math.random() - .5) * .02 * dt; b.vy += (Math.random() - .5) * .02 * dt;   // lazy drift so they never fully stop
    b.x += b.vx * dt; b.y += b.vy * dt; b.rot += b.vr * dt;
    const m = b.s / 2;
    if (b.x < m) { b.x = m; b.vx = Math.abs(b.vx); } if (b.x > W - m) { b.x = W - m; b.vx = -Math.abs(b.vx); }
    if (b.y < m) { b.y = m; b.vy = Math.abs(b.vy); } if (b.y > H - m) { b.y = H - m; b.vy = -Math.abs(b.vy); }
    if (inside(b.x, b.y, m, box)) {   // push out through the nearest side and bounce
      const pl = b.x + m - box.l, pr = box.r - (b.x - m), pt = b.y + m - box.t, pb = box.b - (b.y - m), least = Math.min(pl, pr, pt, pb);
      if (least === pl) { b.x -= pl; b.vx = -Math.abs(b.vx); } else if (least === pr) { b.x += pr; b.vx = Math.abs(b.vx); }
      else if (least === pt) { b.y -= pt; b.vy = -Math.abs(b.vy); } else { b.y += pb; b.vy = Math.abs(b.vy); }
    }
    shape(b);
  }
  const fade = Math.pow(.8, dt); mouse.vx *= fade; mouse.vy *= fade;
}

// The loop: exactly one at a time, however often it is started and stopped.
let running = true, inView = true, raf = 0, last = 0;
function frame(now) {
  raf = 0;
  if (!running) return;
  const dt = clamp((now - (last || now)) / FRAME, 0, 3);
  last = now;
  step(dt);
  raf = requestAnimationFrame(frame);
}
function start() { if (!raf && running && motion) { last = 0; raf = requestAnimationFrame(frame); } }

hero.addEventListener("pointermove", e => {
  const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
  if (mouse.x > -9000) {   // the first move into the hero has no previous point, so it must not count as a huge swipe
    const ms = Math.max(e.timeStamp - mouse.t, 4);   // pointer events can arrive far faster than frames on a trackpad
    mouse.vx = clamp((x - mouse.x) / ms * FRAME, -40, 40); mouse.vy = clamp((y - mouse.y) / ms * FRAME, -40, 40);
  }
  mouse.x = x; mouse.y = y; mouse.t = e.timeStamp;
});
hero.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; mouse.vx = mouse.vy = 0; });
new IntersectionObserver(([e]) => { inView = e.isIntersecting; running = inView && motion; if (running) start(); }).observe(hero);

let relayoutQueued = false;   // coalesce bursts of resize events (zooming fires dozens) into one layout per frame
const relayout = () => { if (relayoutQueued) return; relayoutQueued = true; requestAnimationFrame(() => { relayoutQueued = false; layout(); if (!motion) step(0); }); };   // a still canvas is cleared by a resize, so repaint it
addEventListener("resize", relayout);
if ("ResizeObserver" in window) new ResizeObserver(relayout).observe(hero);

layout();

// The button on the marquee strip: pause or play every moving thing on the page.
const motionBtn = $("#motion");
function applyMotion() {
  document.documentElement.dataset.motion = motion ? "on" : "off";
  motionBtn.textContent = motion ? "⏸ Pause motion" : "▶ Play motion";
  motionBtn.setAttribute("aria-label", motion ? "Pause motion on this page" : "Play motion on this page");
  running = inView && motion;
  if (motion) start(); else { if (raf) cancelAnimationFrame(raf); raf = 0; step(0); }
  document.querySelectorAll(".stat b[data-n]").forEach(b => { if (!motion) b.textContent = b.dataset.n + (b.dataset.suffix || ""); });
}
motionBtn.addEventListener("click", () => {
  motion = !motion;
  try { localStorage.setItem("motion", motion ? "on" : "off"); } catch (e) { /* private window: the choice just is not remembered */ }
  applyMotion();
});
matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", () => {   // follow the system setting unless the visitor chose
  let stored = null; try { stored = localStorage.getItem("motion"); } catch (e) { /* ignore */ }
  if (!stored) { motion = initialMotion(osReduced(), null); applyMotion(); }
});
applyMotion();
