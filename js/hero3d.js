/*
 * hero3d.js — cursor-reactive, scroll-driven wireframe centerpiece.
 * Dynamically imported by main.js; never loaded under reduced motion.
 * Perf: DPR capped, render loop pauses offscreen/hidden tab, full disposal API.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js';

const GREEN = 0x00ff41;
const AMBER = 0xffb000;

export function createHero(container, { simplified = false } = {}) {
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: !simplified, alpha: true, powerPreference: 'high-performance' });
    } catch {
        return null; // no WebGL — caller keeps the static SVG fallback
    }

    const width = () => container.clientWidth;
    const height = () => container.clientHeight;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, simplified ? 1.5 : 1.75));
    renderer.setSize(width(), height());
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width() / height(), 0.1, 50);
    camera.position.z = 7;

    /* --- geometry: outer wireframe icosahedron + inner amber core + particle shell --- */
    const group = new THREE.Group();

    const outerGeo = new THREE.IcosahedronGeometry(2.4, 1);
    const outerEdges = new THREE.EdgesGeometry(outerGeo);
    const outer = new THREE.LineSegments(
        outerEdges,
        new THREE.LineBasicMaterial({ color: GREEN })
    );

    const innerGeo = new THREE.IcosahedronGeometry(1.15, 0);
    const inner = new THREE.Mesh(
        innerGeo,
        new THREE.MeshBasicMaterial({ color: AMBER, wireframe: true })
    );

    group.add(outer, inner);

    let points = null;
    const particleCount = simplified ? 160 : 550; // sane draw budget
    if (particleCount > 0) {
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            // random point on a shell between r=3.1 and r=4.3
            const r = 3.1 + Math.random() * 1.2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        points = new THREE.Points(
            pGeo,
            new THREE.PointsMaterial({ color: GREEN, size: 0.04, transparent: true, opacity: 0.8, sizeAttenuation: true })
        );
        group.add(points);
    }

    scene.add(group);

    /* --- interaction state --- */
    let targetX = 0; // pointer-driven rotation targets
    let targetY = 0;
    let px = 0;
    let py = 0;
    let scrollP = 0; // 0..1, set by main.js as the page scrolls
    let running = false;
    let rafId = 0;
    const clock = new THREE.Clock();

    function onPointerMove(e) {
        const r = container.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        targetY = ((e.clientX - cx) / window.innerWidth) * 1.4;
        targetX = ((e.clientY - cy) / window.innerHeight) * 1.0;
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    function onVisibility() {
        if (document.hidden) pause(); else if (running) resume();
    }
    document.addEventListener('visibilitychange', onVisibility);

    const ro = new ResizeObserver(() => {
        camera.aspect = width() / height();
        camera.updateProjectionMatrix();
        renderer.setSize(width(), height());
    });
    ro.observe(container);

    /* --- render loop --- */
    function frame() {
        rafId = requestAnimationFrame(frame);
        const t = clock.getElapsedTime();

        // lerp cursor influence (smooth but snappy)
        px += (targetX - px) * 0.06;
        py += (targetY - py) * 0.06;

        // scroll mutates the object: extra spin, tilt, contraction, camera push-in
        group.rotation.y = t * 0.18 + py * 0.8 + scrollP * Math.PI * 1.5;
        group.rotation.x = px * 0.6 + scrollP * 0.9;
        inner.rotation.y = -t * 0.45 - scrollP * Math.PI;
        inner.rotation.z = t * 0.2;
        if (points) points.rotation.y = -t * 0.05;

        const s = 1 - scrollP * 0.22;
        group.scale.setScalar(s);
        camera.position.z = 7 - scrollP * 1.6;

        renderer.render(scene, camera);
    }

    function pause() {
        cancelAnimationFrame(rafId);
        rafId = 0;
        clock.stop();
    }
    function resume() {
        if (!rafId) {
            clock.start();
            frame();
        }
    }

    /* --- public API --- */
    return {
        start() { running = true; if (!document.hidden) resume(); },
        stop() { running = false; pause(); },
        setProgress(p) { scrollP = p; },
        destroy() {
            this.stop();
            window.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('visibilitychange', onVisibility);
            ro.disconnect();
            scene.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    Array.isArray(obj.material) ? obj.material.forEach((m) => m.dispose()) : obj.material.dispose();
                }
            });
            outerGeo.dispose();
            renderer.dispose();
            renderer.domElement.remove();
        },
    };
}
