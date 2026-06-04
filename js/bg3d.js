/*
 * bg3d.js — low-cost persistent WebGL particle field behind the page.
 * Desktop only (gated in main.js); never loaded under reduced motion.
 * Perf caps: DPR 1.25, no antialias, ~30fps frame-skip, pauses on hidden tab.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js';

const GREEN = 0x00ff41;
const AMBER = 0xffb000;

export function createBackground(container) {
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' });
    } catch {
        return null; // no WebGL — static CSS grid stays
    }

    const width = () => window.innerWidth;
    const height = () => window.innerHeight;

    renderer.setPixelRatio(1); // background detail is invisible at higher DPR — keep raster cheap
    renderer.setSize(width(), height());
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width() / height(), 0.1, 80);
    camera.position.z = 18;

    /* two point clouds drifting in a deep box: dense green + sparse amber */
    const group = new THREE.Group();

    function makeCloud(count, color, size) {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 70;     // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 45; // y
            positions[i * 3 + 2] = -Math.random() * 35;        // z (behind camera plane)
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return new THREE.Points(
            geo,
            new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0.7, sizeAttenuation: true })
        );
    }

    const greenCloud = makeCloud(300, GREEN, 0.09);
    const amberCloud = makeCloud(50, AMBER, 0.12);
    group.add(greenCloud, amberCloud);
    scene.add(group);

    /* --- state --- */
    let px = 0;
    let py = 0;
    let targetX = 0;
    let targetY = 0;
    let rafId = 0;
    let running = false;
    let tick = 0; // render every 3rd frame (~20fps) — plenty for a slow drift
    const clock = new THREE.Clock();

    function onPointerMove(e) {
        targetX = (e.clientX / width() - 0.5) * 1.6;
        targetY = (e.clientY / height() - 0.5) * 1.0;
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    function onResize() {
        camera.aspect = width() / height();
        camera.updateProjectionMatrix();
        renderer.setSize(width(), height());
    }
    window.addEventListener('resize', onResize, { passive: true });

    function onVisibility() {
        if (document.hidden) pause(); else if (running) resume();
    }
    document.addEventListener('visibilitychange', onVisibility);

    function frame() {
        rafId = requestAnimationFrame(frame);
        tick = (tick + 1) % 3;
        if (tick) return;

        const t = clock.getElapsedTime();
        px += (targetX - px) * 0.03;
        py += (targetY - py) * 0.03;

        group.rotation.y = t * 0.015 + px * 0.12;
        group.rotation.x = py * 0.08;
        // scroll parallax: field slides up slowly as the page scrolls
        group.position.y = window.scrollY * 0.004;
        greenCloud.rotation.z = t * 0.008;
        amberCloud.rotation.z = -t * 0.012;

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

    return {
        start() { running = true; if (!document.hidden) resume(); },
        stop() { running = false; pause(); },
        destroy() {
            this.stop();
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('resize', onResize);
            document.removeEventListener('visibilitychange', onVisibility);
            scene.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    Array.isArray(obj.material) ? obj.material.forEach((m) => m.dispose()) : obj.material.dispose();
                }
            });
            renderer.dispose();
            renderer.domElement.remove();
        },
    };
}
