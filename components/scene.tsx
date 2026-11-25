"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hero scene: a LiDAR-style point cloud of a street corner.
 * Everything starts unlabeled (grey-blue). One sweep plane crosses the scene,
 * and as it passes each object it takes its label colour, gets a bounding box
 * and a tag. That is the product, in 3D: raw data in, labeled data out.
 */

type Obj = {
  label: string;
  color: string;
  parts: { c: [number, number, number]; s: [number, number, number]; kind?: "box" | "cyl" | "sph" }[];
  n: number;
};

const OBJS: Obj[] = [
  {
    label: "Vehicle",
    color: "#FF5A79",
    n: 5200,
    parts: [
      { c: [-3.4, 0.45, -0.6], s: [2.5, 0.8, 1.15] },
      { c: [-3.5, 1.05, -0.6], s: [1.35, 0.5, 1.0] },
    ],
  },
  {
    label: "Vehicle",
    color: "#FF5A79",
    n: 4600,
    parts: [
      { c: [2.6, 0.45, -3.3], s: [1.15, 0.8, 2.5] },
      { c: [2.6, 1.05, -3.4], s: [1.0, 0.5, 1.35] },
    ],
  },
  {
    label: "Pedestrian",
    color: "#12B886",
    n: 1500,
    parts: [
      { c: [-0.4, 0.8, 1.2], s: [0.5, 1.6, 0.5], kind: "cyl" },
      { c: [-0.4, 1.75, 1.2], s: [0.32, 0.32, 0.32], kind: "sph" },
    ],
  },
  {
    label: "Building",
    color: "#7C4DFF",
    n: 7600,
    parts: [{ c: [-1.5, 2.3, -9.5], s: [11, 4.6, 1.6] }],
  },
  {
    label: "Tree",
    color: "#00B8D4",
    n: 3200,
    parts: [
      { c: [-5.2, 0.8, -4.4], s: [0.28, 1.6, 0.28], kind: "cyl" },
      { c: [-5.2, 2.5, -4.4], s: [1.9, 1.9, 1.9], kind: "sph" },
    ],
  },
  {
    label: "Traffic sign",
    color: "#FFB833",
    n: 1100,
    parts: [
      { c: [0.2, 1.1, -2.2], s: [0.12, 2.2, 0.12], kind: "cyl" },
      { c: [0.2, 2.35, -2.2], s: [0.08, 0.8, 0.8] },
    ],
  },
];

function rnd(a = 1) {
  return Math.random() * a;
}

function sampleBox(c: number[], s: number[], out: number[]) {
  const [w, h, d] = s;
  const area = [h * d, h * d, w * d, w * d, w * h, w * h];
  const tot = area.reduce((a, b) => a + b, 0);
  let r = rnd(tot);
  let f = 0;
  while (f < 5 && r > area[f]) r -= area[f++];
  const u = rnd() - 0.5;
  const v = rnd() - 0.5;
  let x = 0, y = 0, z = 0;
  if (f < 2) { x = (f ? 0.5 : -0.5) * w; y = u * h; z = v * d; }
  else if (f < 4) { y = (f === 3 ? 0.5 : -0.5) * h; x = u * w; z = v * d; }
  else { z = (f === 5 ? 0.5 : -0.5) * d; x = u * w; y = v * h; }
  out.push(c[0] + x, c[1] + y, c[2] + z);
}

function sampleCyl(c: number[], s: number[], out: number[]) {
  const a = rnd(Math.PI * 2);
  const y = (rnd() - 0.5) * s[1];
  out.push(c[0] + Math.cos(a) * s[0] * 0.5, c[1] + y, c[2] + Math.sin(a) * s[2] * 0.5);
}

function sampleSph(c: number[], s: number[], out: number[]) {
  const u = rnd() * 2 - 1;
  const a = rnd(Math.PI * 2);
  const r = Math.sqrt(1 - u * u);
  const k = 0.5 + rnd(0.04);
  out.push(c[0] + r * Math.cos(a) * s[0] * k, c[1] + u * s[1] * k, c[2] + r * Math.sin(a) * s[2] * k);
}

const VERT = /* glsl */ `
  attribute float aCls;
  attribute float aRand;
  attribute vec3 aCol;
  uniform float uSweep;
  uniform float uTime;
  uniform float uPx;
  varying vec3 vCol;
  varying float vA;
  varying float vGlow;
  void main() {
    vec3 p = position;
    float lab = aCls < 0.0 ? 0.0 : 1.0;
    // sweep travels along world X; points behind the plane are labeled
    float d = uSweep - p.x;
    float done = lab * smoothstep(0.0, 0.5, d);
    float edge = exp(-abs(d) * 2.2);
    vec3 raw = vec3(0.50, 0.60, 0.84);
    vCol = mix(raw, aCol, done);
    vCol += edge * 0.55;
    vGlow = edge;
    // very slight breathing so the cloud feels scanned, not static
    p.y += sin(uTime * 1.2 + aRand * 40.0) * 0.012;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;
    vA = clamp(1.25 - dist / 34.0, 0.12, 1.0) * mix(0.62, 1.0, done);
    gl_PointSize = uPx * (0.9 + aRand * 0.9 + edge * 1.6 + done * 0.5) / dist;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  varying vec3 vCol;
  varying float vA;
  varying float vGlow;
  void main() {
    vec2 q = gl_PointCoord - 0.5;
    float r = dot(q, q);
    if (r > 0.25) discard;
    float a = smoothstep(0.25, 0.08, r) * vA;
    gl_FragColor = vec4(vCol, a);
  }
`;

export default function Scene({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const tags = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    const tagLayer = tags.current;
    if (!el || !tagLayer) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: /[?&]shot/.test(window.location.search) });
    } catch {
      return; // no WebGL: the CSS background and copy still carry the hero
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);

    // ---- build points
    const pos: number[] = [];
    const cls: number[] = [];
    const rand: number[] = [];
    const col: number[] = [];
    const tmp = new THREE.Color();

    // ground: concentric LiDAR rings around the sensor
    for (let ring = 0; ring < 46; ring++) {
      const r = 1.2 + ring * 0.34 + ring * ring * 0.006;
      const count = Math.floor(70 + r * 34);
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + rnd(0.02);
        pos.push(Math.cos(a) * r, 0, Math.sin(a) * r);
        cls.push(-1);
        rand.push(Math.random());
        col.push(0.46, 0.55, 0.78);
      }
    }

    const bounds: { box: THREE.Box3; label: string; color: string; lines: THREE.LineSegments; mat: THREE.LineBasicMaterial }[] = [];

    OBJS.forEach((o, idx) => {
      tmp.set(o.color);
      const srgb = tmp.clone().convertLinearToSRGB();
      const start = pos.length / 3;
      const per = o.parts.length;
      for (let i = 0; i < o.n; i++) {
        const p = o.parts[i % per];
        const kind = p.kind ?? "box";
        if (kind === "box") sampleBox(p.c, p.s, pos);
        else if (kind === "cyl") sampleCyl(p.c, p.s, pos);
        else sampleSph(p.c, p.s, pos);
        cls.push(idx);
        rand.push(Math.random());
        col.push(srgb.r, srgb.g, srgb.b);
      }
      const box = new THREE.Box3();
      for (let i = start; i < pos.length / 3; i++) box.expandByPoint(new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]));
      box.expandByScalar(0.06);
      const size = box.getSize(new THREE.Vector3());
      const ctr = box.getCenter(new THREE.Vector3());
      const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(size.x, size.y, size.z));
      const mat = new THREE.LineBasicMaterial({ color: tmp.clone(), transparent: true, opacity: 0 });
      const lines = new THREE.LineSegments(edges, mat);
      lines.position.copy(ctr);
      scene.add(lines);
      bounds.push({ box, label: o.label, color: o.color, lines, mat });
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("aCls", new THREE.Float32BufferAttribute(cls, 1));
    geo.setAttribute("aRand", new THREE.Float32BufferAttribute(rand, 1));
    geo.setAttribute("aCol", new THREE.Float32BufferAttribute(col, 3));

    const uniforms = {
      uSweep: { value: reduce ? 20 : -9 },
      uTime: { value: 0 },
      uPx: { value: 34 * dpr },
    };
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthWrite: false,
    });
    const cloud = new THREE.Points(geo, mat);
    scene.add(cloud);

    // ---- tag elements (DOM, so text stays crisp and selectable-free)
    const tagEls = bounds.map((b) => {
      const d = document.createElement("div");
      d.className = "scene-tag";
      d.style.setProperty("--tc", b.color);
      d.textContent = b.label;
      tagLayer.appendChild(d);
      return d;
    });

    // ---- sizing
    let w = 1, h = 1;
    const resize = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      uniforms.uPx.value = (h / 800) * 34 * dpr * (w < 700 ? 1.2 : 1);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // ---- pointer parallax
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // ---- loop
    const clock = new THREE.Clock();
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) loop(); }, { threshold: 0 });
    io.observe(el);

    const v = new THREE.Vector3();
    const SWEEP_START = -9, SWEEP_END = 7, SWEEP_TIME = 7.5, HOLD_DELAY = 0.9;
    let t0 = 0;

    const frame = (t: number) => {
      uniforms.uTime.value = t;
      const s = reduce ? SWEEP_END + 4 : SWEEP_START + Math.min(1, Math.max(0, (t - HOLD_DELAY) / SWEEP_TIME)) * (SWEEP_END - SWEEP_START + 4);
      uniforms.uSweep.value = s;

      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;
      const ang = (reduce ? 0.62 : 0.62 + Math.sin(t * 0.12) * 0.22) + cur.x * 0.18;
      const rad = w < 700 ? 25 : 17.5;
      const hgt = 6.6 - cur.y * 1.1;
      camera.position.set(Math.sin(ang) * rad, hgt, Math.cos(ang) * rad);
      camera.lookAt(w < 700 ? 0 : 1.2, 1.2, 0);
      // shift the whole scene right on wide screens so copy owns the left
      camera.setViewOffset(w, h, w < 900 ? 0 : -w * 0.17, w < 700 ? h * 0.2 : 0, w, h);

      bounds.forEach((b, i) => {
        const reached = s - b.box.max.x;
        const k = THREE.MathUtils.clamp((reached + 0.6) / 1.4, 0, 1);
        b.mat.opacity = k * 0.95;
        const el2 = tagEls[i];
        v.set((b.box.min.x + b.box.max.x) / 2, b.box.max.y + 0.15, (b.box.min.z + b.box.max.z) / 2).project(camera);
        const x = (v.x * 0.5 + 0.5) * w;
        const y = (-v.y * 0.5 + 0.5) * h;
        el2.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`;
        el2.style.opacity = String(k);
      });
      renderer.render(scene, camera);
    };

    const loop = () => {
      if (!visible) return;
      frame(clock.getElapsedTime() - t0);
      if (!reduce) raf = requestAnimationFrame(loop);
    };
    loop();
    if (reduce) {
      const onResizeRender = () => frame(0);
      window.addEventListener("resize", onResizeRender);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      mat.dispose();
      bounds.forEach((b) => { b.lines.geometry.dispose(); b.mat.dispose(); });
      renderer.dispose();
      renderer.domElement.remove();
      tagLayer.replaceChildren();
    };
  }, []);

  return (
    <div className={className}>
      <div ref={host} className="absolute inset-0" />
      <div ref={tags} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true" />
    </div>
  );
}
