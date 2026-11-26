"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/**
 * Fixed full-viewport WebGL backdrop: a bundle of light ribbons.
 * One bundle, three shapes (hairpin, S-sweep, horizontal waves). Scroll position
 * blends between the shapes and changes scale, focus and brightness, so the
 * backdrop is a single object that travels with the reader.
 */

type Key = { p: number; a: number; b: number; c: number; op: number; blur: number; scale: number; rot: number; y: number; bloom: number };

const KEYS: Key[] = [
  { p: 0.0, a: 1, b: 0, c: 0, op: 1, blur: 0, scale: 1, rot: 0, y: 0, bloom: 1.15 },
  { p: 0.09, a: 0.2, b: 0.8, c: 0, op: 0.95, blur: 0, scale: 1.05, rot: 0, y: 0, bloom: 1.0 },
  { p: 0.17, a: 0, b: 1, c: 0, op: 0.62, blur: 7, scale: 1.45, rot: 0.1, y: 0, bloom: 0.9 },
  { p: 0.3, a: 0, b: 1, c: 0, op: 0.5, blur: 15, scale: 2.1, rot: 0.35, y: 0, bloom: 0.8 },
  { p: 0.5, a: 0, b: 0.7, c: 0.3, op: 0.28, blur: 18, scale: 2.3, rot: -0.2, y: 0, bloom: 0.7 },
  { p: 0.72, a: 0.5, b: 0.5, c: 0, op: 0.45, blur: 14, scale: 1.8, rot: 0.2, y: 0, bloom: 0.8 },
  { p: 0.88, a: 0, b: 0, c: 1, op: 1, blur: 0, scale: 1, rot: 0, y: -0.9, bloom: 1.1 },
  { p: 1.0, a: 0, b: 0, c: 1, op: 0.95, blur: 0, scale: 1, rot: 0, y: 0.9, bloom: 1.0 },
];

const ss = (t: number) => t * t * (3 - 2 * t);
function sample(p: number): Key {
  if (p <= KEYS[0].p) return KEYS[0];
  for (let i = 1; i < KEYS.length; i++) {
    if (p <= KEYS[i].p) {
      const a = KEYS[i - 1], b = KEYS[i];
      const t = ss((p - a.p) / (b.p - a.p));
      const o: Record<string, number> = {};
      (Object.keys(a) as (keyof Key)[]).forEach((k) => (o[k] = a[k] + (b[k] - a[k]) * t));
      return o as unknown as Key;
    }
  }
  return KEYS[KEYS.length - 1];
}

const VERT = /* glsl */ `
  attribute float aU;
  attribute float aId;
  attribute float aSeed;
  uniform float uTime;
  uniform vec3 uW;
  uniform float uScale;
  uniform float uRot;
  uniform float uY;
  uniform float uOp;
  uniform float uAspect;
  uniform vec2 uMouse;
  varying vec3 vCol;
  varying float vA;

  vec3 hairpin(float t, float id, float time) {
    float k = 0.55 + id * 0.6 + aSeed * 0.12;
    float tipX = -0.95 + id * 0.55 + sin(time * 0.25 + aSeed * 6.0) * 0.06;
    float tipY = -0.42 + (aSeed - 0.5) * 0.25;
    float dy = t * 2.7;
    float x = tipX + k * dy * dy * 0.5 + pow(abs(dy), 1.6) * 0.18;
    float y = tipY + dy * (0.92 + id * 0.1);
    float z = (id - 0.5) * 1.6 + sin(t * 4.0 + time * 0.5 + aSeed * 12.0) * 0.12 * (1.0 + abs(t));
    // slight twist makes the arms fan out like a real cable bundle
    float tw = sin(time * 0.3 + aSeed * 8.0) * 0.07 * abs(t);
    return vec3(x, y + tw, z);
  }

  vec3 sweep(float t, float id, float time) {
    float y = -t * 2.6;
    float x = 0.45 + id * 0.5 + sin(y * 1.1 + time * 0.3 + aSeed * 5.0) * (0.55 + id * 0.25) + (aSeed - 0.5) * 0.3 * abs(t);
    x += 0.6 * smoothstep(-0.2, 1.0, t);
    float z = (id - 0.5) * 1.4 + cos(y * 1.7 + aSeed * 9.0 + time * 0.4) * 0.2;
    return vec3(x, y, z);
  }

  vec3 waves(float t, float id, float time) {
    float x = t * 3.9;
    float y = -0.25 + (id - 0.5) * 0.85 + sin(x * 0.85 + time * 0.35 + id * 5.0 + aSeed * 3.0) * (0.28 + id * 0.18);
    y += sin(x * 1.9 - time * 0.5 + aSeed * 9.0) * 0.06;
    float z = (id - 0.5) * 1.2 + sin(x + aSeed * 7.0) * 0.12;
    return vec3(x, y, z);
  }

  void main() {
    float t = aU * 2.0 - 1.0;
    float id = aId;
    vec3 p = uW.x * hairpin(t, id, uTime) + uW.y * sweep(t, id, uTime) + uW.z * waves(t, id, uTime);
    p *= uScale;
    float c = cos(uRot), s = sin(uRot);
    p.xy = mat2(c, -s, s, c) * p.xy;
    p.y += uY;
    p.xy += uMouse * (0.12 + p.z * 0.04);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

    // colour: logo palette - cyan, blue, violet, magenta
    vec3 cyan = vec3(0.10, 0.88, 0.90);
    vec3 blue = vec3(0.20, 0.42, 1.00);
    vec3 violet = vec3(0.55, 0.30, 1.00);
    vec3 pink = vec3(1.00, 0.28, 0.58);
    float k = fract(aSeed * 3.7);
    vec3 col = mix(cyan, blue, smoothstep(0.0, 0.35, k));
    col = mix(col, violet, smoothstep(0.3, 0.65, k));
    col = mix(col, pink, smoothstep(0.62, 0.95, k));
    vCol = col;
    float core = exp(-t * t * 7.0);
    float fade = 1.0 - smoothstep(0.78, 1.0, abs(t));
    vA = (0.10 + 0.34 * core) * fade * uOp * (0.5 + 0.8 * fract(aSeed * 13.7));
  }
`;

const FRAG = /* glsl */ `
  varying vec3 vCol;
  varying float vA;
  void main() { gl_FragColor = vec4(vCol * vA, vA); }
`;

const DUST_V = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uOp;
  uniform float uPx;
  uniform vec2 uMouse;
  varying float vA;
  varying vec3 vCol;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * (0.02 + aSeed * 0.05) + 2.2, 4.4) - 2.2;
    p.x += sin(uTime * 0.2 + aSeed * 30.0) * 0.12;
    p.xy += uMouse * (0.2 + p.z * 0.1);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uPx * (0.5 + aSeed * 1.6) / -mv.z;
    gl_Position = projectionMatrix * mv;
    vA = (0.12 + 0.35 * fract(aSeed * 91.7 + uTime * 0.3 * aSeed)) * (0.3 + uOp * 0.5);
    vCol = mix(vec3(0.35, 0.6, 1.0), vec3(1.0, 0.45, 0.75), step(0.8, aSeed));
  }
`;
const DUST_F = /* glsl */ `
  varying float vA;
  varying vec3 vCol;
  void main() {
    vec2 q = gl_PointCoord - 0.5;
    float r = length(q);
    if (r > 0.5) discard;
    float a = (1.0 - smoothstep(0.0, 0.5, r)) * vA;
    gl_FragColor = vec4(vCol * a, a);
  }
`;

export default function Backdrop() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 760;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: /[?&]shot/.test(location.search) });
    } catch {
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 1);
    const cv = renderer.domElement;
    cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;will-change:filter";
    cv.setAttribute("aria-hidden", "true");
    el.appendChild(cv);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.set(0, 0, 5);

    // ribbons
    const N = small ? 64 : 120;
    const M = 240;
    const verts = N * M;
    const aU = new Float32Array(verts), aId = new Float32Array(verts), aSeed = new Float32Array(verts), pos = new Float32Array(verts * 3);
    for (let i = 0; i < N; i++) {
      const id = i / (N - 1);
      const seed = Math.random();
      for (let j = 0; j < M; j++) {
        const k = i * M + j;
        aU[k] = j / (M - 1);
        aId[k] = id;
        aSeed[k] = seed;
      }
    }
    const idx: number[] = [];
    for (let i = 0; i < N; i++) for (let j = 0; j < M - 1; j++) idx.push(i * M + j, i * M + j + 1);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aU", new THREE.BufferAttribute(aU, 1));
    g.setAttribute("aId", new THREE.BufferAttribute(aId, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 1));
    g.setIndex(idx);
    const U = {
      uTime: { value: 0 },
      uW: { value: new THREE.Vector3(1, 0, 0) },
      uScale: { value: 1 },
      uRot: { value: 0 },
      uY: { value: 0 },
      uOp: { value: 1 },
      uAspect: { value: 1.6 },
      uMouse: { value: new THREE.Vector2() },
    };
    const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const lines = new THREE.LineSegments(g, mat);
    lines.frustumCulled = false;
    scene.add(lines);

    // dust
    const D = small ? 260 : 620;
    const dp = new Float32Array(D * 3), ds = new Float32Array(D);
    for (let i = 0; i < D; i++) {
      dp[i * 3] = (Math.random() - 0.5) * 8;
      dp[i * 3 + 1] = (Math.random() - 0.5) * 4.4;
      dp[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
      ds[i] = Math.random();
    }
    const dg = new THREE.BufferGeometry();
    dg.setAttribute("position", new THREE.BufferAttribute(dp, 3));
    dg.setAttribute("aSeed", new THREE.BufferAttribute(ds, 1));
    const DU = { uTime: U.uTime, uOp: U.uOp, uPx: { value: 11 * dpr }, uMouse: U.uMouse };
    const dm = new THREE.ShaderMaterial({ vertexShader: DUST_V, fragmentShader: DUST_F, uniforms: DU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const dust = new THREE.Points(dg, dm);
    dust.frustumCulled = false;
    scene.add(dust);

    // post
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.6, 0.5, 0.12);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    let w = 1, h = 1;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      renderer.setSize(w, h, false);
      composer.setPixelRatio(dpr);
      composer.setSize(w, h);
      camera.aspect = w / h;
      // keep the composition when the window is narrow: pull the camera back
      camera.position.z = w / h < 1 ? 5 + (1 - w / h) * 4.5 : 5;
      camera.updateProjectionMatrix();
      U.uAspect.value = camera.aspect;
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = new THREE.Vector2();
    const mTarget = new THREE.Vector2();
    const onMove = (e: PointerEvent) => {
      mTarget.set((e.clientX / w - 0.5) * 2, -(e.clientY / h - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let cur = { ...sample(0) };
    let lastBlur = -1;
    const progress = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      return Math.min(1, Math.max(0, window.scrollY / max));
    };

    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;
    const frame = () => {
      const t = reduce ? 4.0 : clock.getElapsedTime();
      const target = sample(progress());
      const k = reduce ? 1 : 0.075;
      (Object.keys(cur) as (keyof Key)[]).forEach((key) => { cur[key] += (target[key] - cur[key]) * k; });
      mouse.lerp(mTarget, 0.04);
      U.uTime.value = t;
      U.uW.value.set(cur.a, cur.b, cur.c);
      U.uScale.value = cur.scale;
      U.uRot.value = cur.rot;
      U.uY.value = cur.y;
      U.uOp.value = cur.op;
      U.uMouse.value.copy(mouse);
      bloom.strength = cur.bloom * 0.62;
      bloom.radius = 0.55 + cur.blur * 0.02;
      const b = Math.round(cur.blur * 2) / 2;
      if (b !== lastBlur) {
        cv.style.filter = b > 0 ? `blur(${b}px) saturate(1.1)` : "none";
        lastBlur = b;
      }
      composer.render();
    };
    const loop = () => {
      if (!running) return;
      frame();
      raf = requestAnimationFrame(loop);
    };
    const onVis = () => {
      running = !document.hidden;
      if (running && !reduce) { cancelAnimationFrame(raf); loop(); }
    };
    document.addEventListener("visibilitychange", onVis);
    if (reduce) {
      const draw = () => frame();
      draw();
      window.addEventListener("scroll", draw, { passive: true });
      window.addEventListener("resize", draw);
    } else {
      loop();
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      g.dispose(); dg.dispose(); mat.dispose(); dm.dispose(); composer.dispose(); renderer.dispose();
      cv.remove();
    };
  }, []);

  return <div ref={host} aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-[#020001]" />;
}
