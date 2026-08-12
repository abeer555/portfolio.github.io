/*
 * scrollfx.js — every GSAP enhancement for the page lives here, behind an idle
 * dynamic import in main.js so first paint never waits on it. Reduced-motion
 * users skip this module entirely (main.js gates on the media query).

 * What runs, top-to-bottom:
 *   1. scroll progress bar          (scrubbed transform)
 *   2. hero boot timeline           (hero copy → CRT → greeting typed INTO the tube)
 *   3. section headers              (SplitText word-mask reveal)
 *   4. generic .reveal blocks       (batched snap-in, once)
 *   5. experience timeline draws    (log entries + bullet lists cascade)
 *   6. skills                       (whole group pops, then chips cascade)
 *   7. parallax dividers            (alternating xPercent scrubs)
 *   8. projects                     (desktop: pinned horizontal gallery; mobile: snap reveals)
 *   9. HUD — alert meter            (ScrollTrigger.progress over the whole page)
 *  10. in-page anchors              (native smooth scroll; GSAP stays out)
 *  11. the CRT is Draggable          (flick it, it springs home — pure delight)
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/ScrollTrigger.js/+esm';
import { Draggable } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/Draggable.js/+esm';
import { InertiaPlugin } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/InertiaPlugin.js/+esm';
import { SplitText } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/SplitText.js/+esm';

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin, SplitText);

const SNAP = { duration: 0.45, ease: 'power4.out' }; // snappy, not soft

export function init() {
    /* 1 ---------- terminal-green scroll progress bar ----------------------- */
    const bar = document.querySelector('#scroll-progress .bar');
    if (bar) {
        gsap.set(bar, { width: '100%', scaleX: 0, transformOrigin: 'left center' });
        gsap.to(bar, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        });
    }

    /* 2 ---------- hero: boot the page like a machine waking up ------------- */
    heroIntroTimeline();

    /* 3 ---------- section headers: word-by-word reveal --------------------- */
    gsap.utils.toArray('.sec-head h2').forEach((h2) => {
        const split = SplitText.create(h2, { wordsClass: 'sw', type: 'words' });
        gsap.from(split.words, {
            yPercent: 120,
            autoAlpha: 0,
            stagger: 0.09,
            duration: 0.6,
            ease: 'back.out(2)',
            onComplete: () => split.revert(), // headings never stay split
            scrollTrigger: { trigger: h2, start: 'top 88%', once: true },
        });
    });

    /* 4 ---------- generic snap-in reveals ---------------------------------- */
    ScrollTrigger.batch('.reveal:not(.p-card)', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
            gsap.from(batch, { y: 28, autoAlpha: 0, stagger: 0.08, clearProps: 'all', ...SNAP }),
    });

    /* 5 ---------- experience: entries cascade, bullets walk in ------------- */
    ScrollTrigger.batch('.log-entry', {
        start: 'top 86%',
        once: true,
        onEnter: (batch) => {
            gsap.from(batch, {
                x: -34, autoAlpha: 0, stagger: 0.12, clearProps: 'all', ...SNAP,
            });
            batch.forEach((entry, i) => {
                const items = entry.querySelectorAll('li');
                if (!items.length) return;
                gsap.from(items, {
                    x: 14, autoAlpha: 0,
                    delay: 0.18 + i * 0.12,
                    stagger: 0.07,
                    duration: 0.4,
                    ease: 'power3.out',
                    clearProps: 'all',
                });
            });
        },
    });

    /* 6 ---------- skills: group pops in, chip-row cascades after ------------ */
    gsap.utils.toArray('.skill-group').forEach((group) => {
        const chips = group.querySelectorAll('.chip');
        ScrollTrigger.create({
            trigger: group,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                gsap.from(group, { y: 24, autoAlpha: 0, scale: 0.98, clearProps: 'all', ...SNAP });
                if (chips.length) {
                    gsap.from(chips, {
                        x: -10, autoAlpha: 0,
                        delay: 0.12,
                        stagger: { each: 0.04, from: 'start' },
                        duration: 0.35,
                        ease: 'power2.out',
                        clearProps: 'all',
                    });
                }
            },
        });
    });

    /* 7 ---------- parallax dividers (alternate directions) ----------------- */
    gsap.utils.toArray('[data-divider]').forEach((el, i) => {
        const from = i % 2 ? -10 : 0;
        const to = i % 2 ? 0 : -10;
        gsap.fromTo(el, { xPercent: from }, {
            xPercent: to,
            ease: 'none',
            scrollTrigger: {
                trigger: el.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            },
        });
    });

    /* 8 ---------- projects: pinned horizontal gallery (desktop only) --------
     * Pinning uses CSS position:sticky (.proj-pin) instead of GSAP pin:true —
     * fixed-position pinning jitters/double-scrolls in Firefox and at browser
     * zoom levels other than 100%. The section is given extra height equal to
     * the horizontal distance, the sticky block holds still, and the track's
     * x is scrubbed across that distance. */
    const gallery = document.getElementById('gallery');
    const track = document.getElementById('track');
    const section = document.getElementById('projects');
    const pinEl = document.getElementById('proj-pin');
    if (gallery && track && section && pinEl) {
        const mm = gsap.matchMedia();

        mm.add('(min-width: 1100px)', () => {
            track.classList.add('h-scroll');
            section.classList.add('is-pinned');
            const dist = () => Math.max(0, track.scrollWidth - gallery.clientWidth);
            const setHeight = () => {
                section.style.height = ''; // re-measure natural height
                section.style.height = (pinEl.offsetHeight + dist()) + 'px';
            };
            setHeight();

            gsap.to(track, {
                x: () => -dist(),
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top+=20',
                    end: () => '+=' + dist(),
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                    onRefreshInit: setHeight,
                },
            });

            return () => { // cleanup on breakpoint change
                track.classList.remove('h-scroll');
                section.classList.remove('is-pinned');
                section.style.height = '';
            };
        });

        // mobile/tablet: cards stay in a grid, get the same snap-in reveal
        mm.add('(max-width: 1099px)', () => {
            ScrollTrigger.batch('.p-card', {
                start: 'top 90%',
                once: true,
                onEnter: (batch) =>
                    gsap.from(batch, { y: 32, autoAlpha: 0, stagger: 0.08, clearProps: 'all', ...SNAP }),
            });
        });
    }

    /* 9 ---------- HUD: alert meter + fuel gauge respond to scroll ---------- */
    const alerts = document.getElementById('hud-alerts');
    const fuel = document.getElementById('fuel-pct');
    if (alerts || fuel) {
        ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: (self) => {
                if (alerts) {
                    const n = Math.min(9, Math.floor(self.progress * 10));
                    if (alerts.textContent !== String(n)) alerts.textContent = n;
                }
                if (fuel) {
                    const pct = Math.max(3, Math.round(87 - self.progress * 52));
                    if (fuel.textContent !== pct + '%') fuel.textContent = pct + '%';
                }
            },
        });
    }

    /* 10 ---------- in-page anchors: native ----------------------------------
     * Anchor scroll is deliberately *not* intercepted here. The page sets
     * `html { scroll-behavior: smooth }` and hashing stays native; GSAP only
     * owns reveal/pin/parallax. A previous version piped every # link through
     * ScrollToPlugin, but that fought the browser's own smooth-scroll (both
     * sides ramped every frame) and the CTA buttons read as dead. Browser
     * smooth-scroll is the single source of truth for anchors. */

    /* 11 ---------- grab the CRT by the bezel and flick it ------------------- */
    initCrtDrag();

    // lazy images change layout heights — re-measure once everything is in
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

/* ================================================================== details */
/* Hero intro: come in, settle, hand the styles back.
 * gsap.from() leaves inline transforms/opacity on the targets if the timeline
 * gets paused, killed, or simply hasn't hit its last render tick yet — the
 * page-load loader can do exactly that (waits 1900ms). Then hover re-runs
 * transform on a half-settled element and the buttons "don't click" because
 * every pointer move reschedules the layout. clearProps:'all' means: when
 * each tween finishes, drop the inline styles so the browser owns the
 * buttons again. */
function heroIntroTimeline() {
    const parts = {
        title: document.querySelector('.hero-title'),
        tag: document.querySelector('.hero-tag'),
        pitch: document.querySelector('.hero-pitch'),
        ctas: document.querySelector('.hero-ctas'),
        boot: document.querySelector('.boot-win'),
        crt: document.getElementById('crt-wrap'),
    };

    if (!parts.title) return;

    const tl = gsap.timeline({
        defaults: { duration: 0.6, ease: 'power3.out' },
        onComplete: () => {
            /* safety net: even if a sub-tween was interrupted (e.g. by an
               early click that navigated away mid-intro), clear every inline
               style the timeline applied so the buttons stay clickable. */
            gsap.set(
                [parts.title, parts.tag, parts.pitch, parts.boot, parts.crt, ...(parts.ctas?.children || [])].filter(Boolean),
                { clearProps: 'all' },
            );
        },
    });
    tl.from(parts.title, { y: 46, autoAlpha: 0, duration: 0.75 })
        .from(parts.tag, { y: 22, autoAlpha: 0, clearProps: 'all' }, '-=0.42')
        .from(parts.pitch, { y: 18, autoAlpha: 0, clearProps: 'all' }, '-=0.38')
        .from(parts.ctas?.children, { y: 14, autoAlpha: 0, stagger: 0.08, clearProps: 'all' }, '-=0.34')
        .from(parts.boot, { y: 22, autoAlpha: 0, clearProps: 'all' }, '-=0.32');

    if (parts.crt) {
        tl.from(parts.crt, {
            x: 48,
            autoAlpha: 0, duration: 0.7, ease: 'power3.out',
            clearProps: 'all',
        }, '-=0.5');
    }
}

/* The monitor is a toy too: drag it by the carry-handle of a bezel and fling
 * it — inertia carries it, edge resistance bites, and it always settles back
 * to home when you let go. Desktop + full-motion only (touch users get the
 * tap-to-power path; the CSS already flattens tilt under 1400px). */
function initCrtDrag() {
    const wrap = document.getElementById('crt-wrap');
    if (!wrap) return;

    const mm = gsap.matchMedia();
    mm.add({ isDesktop: '(min-width: 1400px)', fine: '(pointer: fine)' }, (ctx) => {
        const { isDesktop, fine } = ctx.conditions;
        if (!isDesktop || !fine) return;

        let home = null;
        const [drag] = Draggable.create(wrap, {
            type: 'x,y',
            edgeResistance: 0.62,
            bounds: { minX: -80, maxX: 180, minY: -60, maxY: 60 },
            inertia: true,
            zIndexBoost: false,
            cursor: 'grab',
            activeCursor: 'grabbing',
            onPress() { home = { x: this.x, y: this.y }; },
            onThrowComplete() {
                gsap.to(this.target, {
                    x: 0, y: 0,
                    duration: 0.9,
                    ease: 'back.out(1.5)',
                });
            },
        });

        return () => { drag && drag.kill(); };
    });
}
