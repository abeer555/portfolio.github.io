/*
 * main.js — tiny eager module. Everything heavy (Three.js, GSAP) is
 * dynamically imported AFTER first paint, and never under reduced motion.
 */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 968px)').matches;

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
