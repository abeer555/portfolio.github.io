/*
 * main.js — tiny eager module. GSAP scroll FX code-splits behind idle.
 */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* ---------- boot loader cleanup ---------- */
const loader = document.getElementById('loader');
if (loader) {
    if (reduceMotion) loader.remove();
    else setTimeout(() => loader.remove(), 1900);
}

/* ---------- CRT → full Win95 desktop ----------
   The CRT is a prop. One tap on the glass or the power button boots the full
   Windows 95 desktop overlay. That's it. No terminal hiding inside. */
const crt = {
    power: document.getElementById('crt-power'),
    screen: document.getElementById('crt-screen'),
    wrap: document.getElementById('crt-wrap'),
    led: document.getElementById('crt-led'),
    desktopOpen: false,
};

function openWin95() {
    if (crt.desktopOpen) return;
    crt.desktopOpen = true;
    crt.power?.setAttribute('aria-pressed', 'true');
    crt.led?.classList.add('on');
    crt.wrap?.classList.add('is-on');
    crt.screen?.classList.add('is-on');
    import('./win95.js').then((m) => m.bootDesktop()).catch(() => {
        crt.desktopOpen = false;
        crtBootBtnSet(false);
        crt.led?.classList.remove('on');
        crt.wrap?.classList.remove('is-on');
        crt.screen?.classList.remove('is-on');
    });
}

function crtBootBtnSet(pressed) {
    crt.power?.setAttribute('aria-pressed', pressed ? 'true' : 'false');
}

if (crt.power) crt.power.addEventListener('click', openWin95);
if (crt.screen) crt.screen.addEventListener('click', openWin95);

// when the desktop overlay shuts down, the physical button + LED fall back
// to standby so the CRT in the hero reads "off" again
window.addEventListener('w95:shutdown', () => {
    crt.desktopOpen = false;
    crtBootBtnSet(false);
    crt.led?.classList.remove('on');
    crt.wrap?.classList.remove('is-on');
    crt.screen?.classList.remove('is-on');
});

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
            box.classList.toggle('off', !!overField);
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
            bx += (x - bx) * 0.22;
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

/* ---------- boot log typing ---------- */
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

/* ---------- arc card: pointer tilt + hover shine (scroll-stable) ---------- */
(function () {
    const card = document.getElementById('arc-card');
    if (!card) return;

    const MAX_TILT = 14;
    const setVars = (x, y, on) => {
        card.style.setProperty('--rx', x.toFixed(2) + 'deg');
        card.style.setProperty('--ry', y.toFixed(2) + 'deg');
        card.style.setProperty('--mx', ((y / MAX_TILT * 0.5 + 0.5) * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((-x / MAX_TILT * 0.5 + 0.5) * 100).toFixed(1) + '%');
        card.style.setProperty('--shine-opacity', on ? '1' : '0');
    };

    if (reduceMotion) { setVars(0, 0, false); return; }

    let raf = 0, cx = 0, cy = 0, tx = 0, ty = 0, hovering = false;
    function loop() {
        raf = requestAnimationFrame(loop);
        cx += (tx - cx) * 0.2;
        cy += (ty - cy) * 0.2;
        setVars(cx, cy, hovering && (Math.abs(cx) > 0.05 || Math.abs(cy) > 0.05));
    }

    card.addEventListener('pointerenter', () => { hovering = true; loop(); });
    card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        tx = -((e.clientY - r.top) / r.height - 0.5) * 2 * MAX_TILT;
        ty = ((e.clientX - r.left) / r.width - 0.5) * 2 * MAX_TILT;
    }, { passive: true });
    card.addEventListener('pointerleave', () => { hovering = false; tx = 0; ty = 0; });

    /*
     * The transform itself is pure CSS so:
     *  — the card never fights the layout loop
     *  — scrolling causes no glitchy repaint (variables separate from compositor)
     */
})();

/* ---------- scroll FX ---------- */
function enhance() {
    import('./scrollfx.js').then((m) => m.init()).catch(() => { /* static still works */ });
}

if (!reduceMotion) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(enhance, { timeout: 2500 });
    } else {
        setTimeout(enhance, 400);
    }
}
