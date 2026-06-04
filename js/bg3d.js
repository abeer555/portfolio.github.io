/*
 * bg3d.js - constellation network background.
 * Nodes + connecting lines that fade with distance, cursor-parallax tilt,
 * scroll parallax. Desktop only (gated in main.js); never under reduced motion.
 * Perf: DPR 1, ~20fps tick, O(N^2) connection check at N=90 is ~4k ops/frame.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js';

const G = new THREE.Color(0x00ff41);   // terminal green
const A = new THREE.Color(0xffb000);   // amber

const N = 90;           // node count
const CONNECT = 3.8;    // world-unit connection threshold
const MAX_SEG = N * 8;  // pre-allocated line segment budget

export function createBackground(container) {
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' });
    } catch {
        return null;
    }

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    renderer.setPixelRatio(1);
    renderer.setSize(W(), H());
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W() / H(), 0.1, 80);
    camera.position.z = 18;

    /* ---- nodes ---- */
    // spread slightly beyond visible area so edges stay populated
    const nodePos = new Float32Array(N * 3);
    const nodeVel = new Float32Array(N * 3);
    // ~16% of nodes are amber, rest green
    const isAmber = new Uint8Array(N);

    for (let i = 0; i < N; i++) {
        nodePos[i * 3]     = (Math.random() - 0.5) * 28;
        nodePos[i * 3 + 1] = (Math.random() - 0.5) * 18;
        nodePos[i * 3 + 2] = (Math.random() - 0.5) * 3;
        nodeVel[i * 3]     = (Math.random() - 0.5) * 0.0018;
        nodeVel[i * 3 + 1] = (Math.random() - 0.5) * 0.0018;
        isAmber[i] = Math.random() < 0.16 ? 1 : 0;
    }

    // vertex-coloured point cloud
    const nodeColors = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        const c = isAmber[i] ? A : G;
        nodeColors[i * 3]     = c.r;
        nodeColors[i * 3 + 1] = c.g;
        nodeColors[i * 3 + 2] = c.b;
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos.slice(), 3));
    nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));
    const nodeMat = new THREE.PointsMaterial({
        vertexColors: true, size: 0.14, transparent: true, opacity: 0.95, sizeAttenuation: true,
    });
    const nodesMesh = new THREE.Points(nodeGeo, nodeMat);

    /* ---- line segments (pre-allocated) ---- */
    const segPos = new Float32Array(MAX_SEG * 6);   // 2 endpoints x 3 coords
    const segCol = new Float32Array(MAX_SEG * 6);   // vertex colour per endpoint
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(segPos, 3));
    lineGeo.setAttribute('color',    new THREE.BufferAttribute(segCol, 3));
    lineGeo.setDrawRange(0, 0);
    const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true, transparent: true, opacity: 1,
    });
    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);

    const group = new THREE.Group();
    group.add(linesMesh, nodesMesh);
    scene.add(group);

    /* ---- state ---- */
    let px = 0, py = 0, tx = 0, ty = 0;
    let rafId = 0, running = false, tick = 0;
    const clock = new THREE.Clock();

    function onPointerMove(e) {
        tx = (e.clientX / W() - 0.5) * 2.2;
        ty = (e.clientY / H() - 0.5) * 1.4;
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    function onResize() {
        camera.aspect = W() / H();
        camera.updateProjectionMatrix();
        renderer.setSize(W(), H());
    }
    window.addEventListener('resize', onResize, { passive: true });

    function onVis() { if (document.hidden) pause(); else if (running) resume(); }
    document.addEventListener('visibilitychange', onVis);

    function frame() {
        rafId = requestAnimationFrame(frame);
        tick = (tick + 1) % 3;
        if (tick) return; // ~20fps

        clock.getElapsedTime(); // keep clock ticking
        px += (tx - px) * 0.04;
        py += (ty - py) * 0.04;

        group.rotation.y = px * 0.06;
        group.rotation.x = py * 0.04;
        group.position.y = window.scrollY * 0.003; // scroll parallax

        /* drift nodes, bounce at boundary */
        const pos = nodeGeo.attributes.position;
        for (let i = 0; i < N; i++) {
            pos.array[i * 3]     += nodeVel[i * 3];
            pos.array[i * 3 + 1] += nodeVel[i * 3 + 1];
            if (Math.abs(pos.array[i * 3])     > 14) nodeVel[i * 3]     *= -1;
            if (Math.abs(pos.array[i * 3 + 1]) > 9)  nodeVel[i * 3 + 1] *= -1;
        }
        pos.needsUpdate = true;

        /* rebuild line segments */
        let seg = 0;
        const lp = lineGeo.attributes.position.array;
        const lc = lineGeo.attributes.color.array;

        for (let i = 0; i < N && seg < MAX_SEG; i++) {
            const ix = pos.array[i * 3], iy = pos.array[i * 3 + 1];
            const iAmber = isAmber[i];
            for (let j = i + 1; j < N && seg < MAX_SEG; j++) {
                const dx = ix - pos.array[j * 3];
                const dy = iy - pos.array[j * 3 + 1];
                const d2 = dx * dx + dy * dy;
                if (d2 > CONNECT * CONNECT) continue;

                const t = 1 - Math.sqrt(d2) / CONNECT; // 0..1, 1 = closest
                const bright = t * t * 0.75;            // quadratic falloff, max ~0.75
                const c = (iAmber || isAmber[j]) ? A : G;

                const base = seg * 6;
                // endpoint i
                lp[base]     = pos.array[i * 3];
                lp[base + 1] = pos.array[i * 3 + 1];
                lp[base + 2] = pos.array[i * 3 + 2];
                // endpoint j
                lp[base + 3] = pos.array[j * 3];
                lp[base + 4] = pos.array[j * 3 + 1];
                lp[base + 5] = pos.array[j * 3 + 2];
                // colour (brightness encodes opacity on dark bg)
                lc[base]     = c.r * bright; lc[base + 1] = c.g * bright; lc[base + 2] = c.b * bright;
                lc[base + 3] = c.r * bright; lc[base + 4] = c.g * bright; lc[base + 5] = c.b * bright;
                seg++;
            }
        }

        lineGeo.setDrawRange(0, seg * 2);
        lineGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.color.needsUpdate    = true;

        renderer.render(scene, camera);
    }

    function pause()  { cancelAnimationFrame(rafId); rafId = 0; clock.stop(); }
    function resume() { if (!rafId) { clock.start(); frame(); } }

    return {
        start()   { running = true; if (!document.hidden) resume(); },
        stop()    { running = false; pause(); },
        destroy() {
            this.stop();
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('resize', onResize);
            document.removeEventListener('visibilitychange', onVis);
            [nodeGeo, lineGeo, nodeMat, lineMat].forEach((o) => o.dispose());
            renderer.dispose();
            renderer.domElement.remove();
        },
    };
}
