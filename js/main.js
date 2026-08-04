/*
 * main.js — tiny eager module. Everything heavy (Three.js, GSAP) is
 * dynamically imported AFTER first paint, and never under reduced motion.
 */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 968px)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* ---------- boot loader cleanup (CSS dismisses it; JS just removes the node) ---------- */
const loader = document.getElementById('loader');
if (loader) {
    if (reduceMotion) loader.remove();
    else setTimeout(() => loader.remove(), 1700); // CSS hides it at ~1.6s
}

/* ---------- custom cursor (fine pointers only) ---------- */
if (finePointer && !reduceMotion) {
    const box = document.getElementById('cursor');
    const dot = document.getElementById('cursor-dot');
    if (box && dot) {
        document.body.classList.add('custom-cursor');
        let x = innerWidth / 2;
        let y = innerHeight / 2;
        let bx = x;
        let by = y;
        let scale = 1;
        let hot = false;
        let down = false;

        const HOT_SELECTOR = 'a, button, .p-card, input, textarea, label';

        document.addEventListener('pointermove', (e) => {
            x = e.clientX;
            y = e.clientY;
            dot.style.transform = `translate(${x}px, ${y}px)`;
            const overField = e.target.closest?.('input, textarea');
            box.classList.toggle('off', !!overField); // native I-beam wins on form fields
            dot.classList.toggle('off', !!overField);
            hot = !overField && !!e.target.closest?.(HOT_SELECTOR);
            box.classList.toggle('hot', hot);
        }, { passive: true });

        document.addEventListener('pointerdown', () => { down = true; });
        document.addEventListener('pointerup', () => { down = false; });
        document.addEventListener('pointerleave', () => { box.classList.add('off'); dot.classList.add('off'); });
        document.addEventListener('pointerenter', () => { box.classList.remove('off'); dot.classList.remove('off'); });

        (function cursorLoop() {
            requestAnimationFrame(cursorLoop);
            bx += (x - bx) * 0.22; // square trails the dot slightly
            by += (y - by) * 0.22;
            const target = down ? 0.75 : (hot ? 1.5 : 1);
            scale += (target - scale) * 0.25;
            box.style.transform = `translate(${bx}px, ${by}px) scale(${scale.toFixed(3)})`;
        })();
    }
}

/* ---------- active nav highlight ---------- */
const sections = document.querySelectorAll('main section[id]');
const navLinks = [...document.querySelectorAll('.nav-link')];

const navIO = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = '#' + entry.target.id;
        navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === id));
    }
}, { rootMargin: '-30% 0px -60% 0px' });
sections.forEach((s) => navIO.observe(s));

/* ---------- boot log typing (non-blocking, skipped under reduced motion) ---------- */
const bootLog = document.getElementById('boot-log');
if (bootLog && !reduceMotion) {
    const finalHTML = bootLog.innerHTML;
    const lines = bootLog.textContent.split('\n');
    bootLog.textContent = '';
    let li = 0;
    const typeLine = () => {
        if (li >= lines.length) { bootLog.innerHTML = finalHTML; return; }
        bootLog.textContent += (li ? '\n' : '') + lines[li];
        li += 1;
        setTimeout(typeLine, 90 + Math.random() * 110);
    };
    setTimeout(typeLine, 250);
}

/* ---------- arc card: holographic tilt + foil ---------- */
(function () {
    const card = document.getElementById('arc-card');
    if (!card || reduceMotion) return;

    const inner = card.querySelector('.arc-card-inner');
    const MAX_TILT = 15; // degrees

    function update(x, y, rect) {
        // normalise to [-1, 1]
        const nx = ((x - rect.left) / rect.width  - 0.5) * 2;
        const ny = ((y - rect.top)  / rect.height - 0.5) * 2;

        const ry =  nx * MAX_TILT;  // yaw  (left/right)
        const rx = -ny * MAX_TILT;  // pitch (up/down, inverted)

        // foil/glare position in % (0-100)
        const mx = ((nx + 1) / 2 * 100).toFixed(1) + '%';
        const my = ((ny + 1) / 2 * 100).toFixed(1) + '%';

        card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
        card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
        card.style.setProperty('--mx', mx);
        card.style.setProperty('--my', my);
        card.style.setProperty('--shine-opacity', '1');
    }

    card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        update(e.clientX, e.clientY, rect);
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
        inner.style.transition = 'transform 0.5s cubic-bezier(.17,.67,.43,.98), box-shadow 0.15s ease';
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--shine-opacity', '0');
        setTimeout(() => { inner.style.transition = ''; }, 500);
    });

    // touch support
    card.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        const rect = card.getBoundingClientRect();
        update(t.clientX, t.clientY, rect);
    }, { passive: true });
})();

/* ---------- deferred 3D + scroll FX ---------- */
const state = { hero: null };

function enhance() {
    // scroll-driven animations (GSAP) — code-split
    import('./scrollfx.js').then((m) => m.init()).catch(() => { /* static page still works */ });

    // WebGL hero — mount only when near viewport, pause when offscreen
    const stage = document.getElementById('hero-3d');
    if (stage && window.WebGLRenderingContext) {
        let heroApi = null;
        let loading = false;
        let visible = false;

        const heroIO = new IntersectionObserver(async (entries) => {
            visible = entries[0].isIntersecting;
            if (visible && !heroApi && !loading) {
                loading = true;
                try {
                    const m = await import('./hero3d.js');
                    heroApi = m.createHero(stage, { simplified: isMobile });
                    if (heroApi) {
                        state.hero = heroApi;
                        const fallback = document.getElementById('gl-fallback');
                        if (fallback) fallback.style.opacity = '0';
                        if (visible) heroApi.start();
                    }
                } catch { /* CDN blocked / WebGL failed — SVG fallback stays */ }
                loading = false;
            } else if (heroApi) {
                if (visible) heroApi.start(); else heroApi.stop();
            }
        }, { rootMargin: '120px' });
        heroIO.observe(stage);
    }

    // cheap scroll → 3D progress (no GSAP dependency)
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking || !state.hero) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            state.hero.setProgress(Math.min(1, window.scrollY / (window.innerHeight * 1.8)));
        });
    }, { passive: true });
}

if (!reduceMotion) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(enhance, { timeout: 2500 });
    } else {
        setTimeout(enhance, 400);
    }
}
