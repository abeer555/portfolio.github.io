/*
 * scrollfx.js — GSAP ScrollTrigger effects. Dynamically imported by main.js;
 * never loaded under reduced motion (the page is fully usable without it).
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/ScrollTrigger.js/+esm';

gsap.registerPlugin(ScrollTrigger);

const SNAP = { duration: 0.45, ease: 'power4.out' }; // snappy, not soft

export function init() {
    /* ---------- terminal-green scroll progress bar ---------- */
    const bar = document.querySelector('#scroll-progress .bar');
    if (bar) {
        gsap.set(bar, { width: '100%', scaleX: 0, transformOrigin: 'left center' });
        gsap.to(bar, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        });
    }

    /* ---------- snappy staggered reveals (sections, blocks — not cards) ---------- */
    ScrollTrigger.batch('.reveal:not(.p-card)', {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
            gsap.from(batch, { y: 28, autoAlpha: 0, stagger: 0.08, clearProps: 'all', ...SNAP }),
    });

    /* ---------- parallax dividers (alternate directions) ---------- */
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

    /* ---------- projects: pinned horizontal gallery (desktop only) ----------
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

    // lazy images change layout heights — re-measure once everything is in
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
