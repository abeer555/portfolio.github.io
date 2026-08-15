/*
 * win95.js — full Windows 95 desktop in an overlay.
 *
 * Everything you can see, you can touch: MS-DOS Prompt runs a real portfolio
 * command line (dir/cd/type/win/notepad), Notepad edits & saves text, Explorer
 * browses the virtual FS, the Start menu's Programs/Documents/Settings/Find/
 * Run/Shut Down all do their job, and icons single-click to select and
 * double-click to open. Escape shuts down, Enter reboots.
 *
 * FS paths use backslashes and end-users can't delete the past — recycle bin
 * only opens a joke file, because this IS a portfolio, not a landfill.
 */

const FS = {
    '\\Desktop': { type: 'dir', kids: ['\\Desktop\\About Me.txt', '\\Desktop\\My Computer', '\\Desktop\\Work', '\\Desktop\\Recycle Bin', '\\Desktop\\Contact'] },
    '\\Desktop\\About Me.txt': { type: 'file', kind: 'note', body:
`Abeer Gupta
CS undergrad building real software — AI pipelines, cloud backends,
production sites for actual clients.

Ground control is a shell prompt; the desktop is Hyprland on Arch.

B.Tech CSE @ VIT Chennai
BS Data Science @ IIT Madras (online)` },
    '\\Desktop\\My Computer': { type: 'dir', kids: ['\\Desktop\\My Computer\\(C:)'] },
    '\\Desktop\\My Computer\\(C:)': { type: 'dir', kids: ['\\Desktop\\My Computer\\(C:)\\Projects', '\\Desktop\\My Computer\\(C:)\\Experience', '\\Desktop\\My Computer\\(C:)\\Skills'] },
    '\\Desktop\\My Computer\\(C:)\\Projects': { type: 'dir', kids: [
        '\\Desktop\\My Computer\\(C:)\\Projects\\quantum_rag.py',
        '\\Desktop\\My Computer\\(C:)\\Projects\\luxury_taj_tour',
        '\\Desktop\\My Computer\\(C:)\\Projects\\chat_server.js',
        '\\Desktop\\My Computer\\(C:)\\Projects\\vericrop.ts',
        '\\Desktop\\My Computer\\(C:)\\Projects\\edumorph_ai.py',
    ]},
    '\\Desktop\\My Computer\\(C:)\\Projects\\quantum_rag.py': { type: 'file', kind: 'note', body:
`# Quantum RAG Benchmark
# benchmarks quantum kernels vs classical MiniLM + Qdrant + T5

from pennylane import *
from qdrant_client import QdrantClient

# "does quantum actually help RAG? — reproducible answer."
# GH: github.com/abeer555/Quantum-Rag-Benchmark-agri` },
    '\\Desktop\\My Computer\\(C:)\\Projects\\luxury_taj_tour': { type: 'file', kind: 'note', body:
`Luxury Taj Tour — real client work
============================

Next.js PWA + GSAP + Vercel.
Smooth scroll animations, offline support.

live → luxurytajtour.com` },
    '\\Desktop\\My Computer\\(C:)\\Projects\\chat_server.js': { type: 'file', kind: 'note', body:
`// Private Chat App
// real-time chat over HTTP/3

// cloudflare + s3 + render
// built from scratch so prod infra isn't a mystery

// live → abeer.codes` },
    '\\Desktop\\My Computer\\(C:)\\Projects\\vericrop.ts': { type: 'file', kind: 'note', body:
`// VeriCrop — blockchain traceability for agriculture
// chainlink oracles, next.js 14, TS, ML fraud detection

// farm-to-consumer records nobody can edit
// live → vericrop-frontend-vercel.vercel.app` },
    '\\Desktop\\My Computer\\(C:)\\Projects\\edumorph_ai.py': { type: 'file', kind: 'note', body:
`# EduMorph AI — AWSImpact Finalist @ IIT Bombay
# PDFs → structured learning (textract + gemini + chromadb)

# turns a paper into something you can actually study from` },
    '\\Desktop\\My Computer\\(C:)\\Experience': { type: 'dir', kids: ['\\Desktop\\My Computer\\(C:)\\Experience\\Ericsson (now).txt','\\Desktop\\My Computer\\(C:)\\Experience\\C9Labs.txt','\\Desktop\\My Computer\\(C:)\\Experience\\Linux Club.txt'] },
    '\\Desktop\\My Computer\\(C:)\\Experience\\Ericsson (now).txt': { type: 'file', kind: 'note', body:
`SDE Intern @ Ericsson  (jun 2026 — present)

Cloud-native telecom software on enterprise stacks.
Distributed systems, containerized apps, CI/CD.
Grown-up engineering, filtered through a fish shell.` },
    '\\Desktop\\My Computer\\(C:)\\Experience\\C9Labs.txt': { type: 'file', kind: 'note', body:
`Cybersecurity Intern @ C9Labs  (may — aug 2025)

Wrote Python/Bash automation for security testing.
Wrote things that broke CI/CD not just reports.
Went through a serious hardening / offensive program.` },
    '\\Desktop\\My Computer\\(C:)\\Experience\\Linux Club.txt': { type: 'file', kind: 'note', body:
`Technical Team Member @ Linux Club VIT Chennai  (sep 2024 — present)

Keeps the lab's linux fleet alive.
Setup scripts so new machines Don't take an afternoon.
Runs CTF workshops on pentesting crypto and scripting.` },
    '\\Desktop\\My Computer\\(C:)\\Skills': { type: 'dir', kids: ['\\Desktop\\My Computer\\(C:)\\Skills\\askeladd.txt'] },
    '\\Desktop\\My Computer\\(C:)\\Skills\\askeladd.txt': { type: 'file', kind: 'note', body:
`Languages   python · javascript · node.js · bash · sql · c/c++
Web         fastapi · next.js · react · tailwind · docker
AI/ML       llms · rag · chromadb · embeddings · gemini · openai
Cloud       aws · azure · vercel · cloudflare · render
DevOps      github actions · ci/cd · ansible · grafana · prometheus
Security    nmap · burp suite · wireshark · pentesting · ctf` },
    '\\Desktop\\Work': { type: 'dir', kids: ['\\Desktop\\Work\\fun things.txt'] },
    '\\Desktop\\Work\\fun things.txt': { type: 'file', kind: 'note', body:
`hack-n-droid — finalist / 35th
cyber-0-day 3.0 — workshops / mentor
password x ctf — vuln analysis track` },
    '\\Desktop\\Recycle Bin': { type: 'dir', kids: [], kind: 'bin' },
    '\\Desktop\\Contact': { type: 'file', kind: 'note', body:
`echo $EMAIL   abeer@abeer.codes
mail hub      github.com/abeer555
linkedin      linkedin.com/in/abeer-gupta
thm           tryhackme.com/p/0xab33r` },
    '\\Desktop\\DOS Shell': { type: 'file', kind: 'app' },
};
const APP_IDS = { '\\Desktop\\DOS Shell': 'dos' };

const DIR_GLYPH = { dir: '📁', txt: '📄', sys: '🖥️', bin: '🗑️' };

/* ---------- entry ---------------------------------------------------------- */
export function bootDesktop(fromPath) {
    const root = document.getElementById('w95-root');
    if (!root) return;
    if (!root.hidden) { // already open
        return;
    }

    root.hidden = false;
    root.innerHTML = '';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('w95-live'); // swap crosshair → classic OS pointer

    // tube warm-up: the CRT flashes on, then the machine starts POST
    root.setAttribute('test-pattern', '');
    const flash = el('div', 'w95-flash');
    root.appendChild(flash);
    setTimeout(() => flash.remove(), 600);

    doBootSequence(root, () => showDesktop(root, fromPath));
}

/* ---------- tiny dom helpers ------------------------------------------------ */
function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
}
function btn(cls, text) { const b = document.createElement('button'); b.className = 'w95-btn ' + (cls || ''); b.type = 'button'; b.textContent = text; return b; }
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

/* ---------- boot ------------------------------------------------------------ */
function doBootSequence(root, next) {
    root.innerHTML = ''; // clear the CRT test-pattern before POST text
    const boot = el('pre', 'w95-boot');
    boot.innerHTML = [
        'PhoenixBIOS 4.0 Release 6.0',
        'Copyright 1985-1998 Phoenix Technologies Ltd.',
        '',
        'CPU : Pentium Pro 200MHz',
        'Memory Test :  131072K OK',
        '',
        'Detecting IDE Primary Master    : ABEER HDD-13.3GB',
        'Detecting IDE Primary Slave     : None',
        '',
        'Starting Windows 95<span class="blink">_</span>',
    ].join('\n');
    root.appendChild(boot);
    setTimeout(() => { boot.remove(); next(); }, 1500);
}

/* ---------- desktop ---------------------------------------------------------- */
function showDesktop(root, openPath) {
    const desktop = el('div', 'w95-desktop');
    const icons = el('div', 'w95-icons');

    const entries = [
        { glyph: '🖥️', label: 'My Computer', action: () => openExplorer('C:') },
        { glyph: '📄', label: 'About Me.txt', action: () => openNotepad('\\Desktop\\About Me.txt') },
        { glyph: '🗂️', label: 'Work',         action: () => openExplorer('\\Desktop\\Work') },
        { glyph: '🗑️', label: 'Recycle Bin',  action: () => openRecycleBin() },
        { glyph: '⛶',  label: 'DOS Shell',    action: () => openDOS() },
    ];
    for (const e of entries) {
        const i = document.createElement('button');
        i.type = 'button';
        i.className = 'w95-icon';
        i.innerHTML = `<span class="glyph">${e.glyph}</span><span>${esc(e.label)}</span>`;
        i.addEventListener('click', () => { // single-click: select (authentic)
            icons.querySelectorAll('.w95-icon').forEach((n) => n.classList.remove('engrave'));
            i.classList.add('engrave');
        });
        i.addEventListener('dblclick', (ev) => { ev.stopPropagation(); e.action(); });
        i.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') e.action(); });
        icons.appendChild(i);
    }
    desktop.appendChild(icons);

    /* --- taskbar --- */
    const taskbar = el('div', 'w95-taskbar');
    const startBtn = btn('w95-start');
    startBtn.innerHTML = `<span class="win-flag">🪟</span><span>Start</span>`;
    const tasksRow = el('div', 'w95-tasks');
    const tray = el('div', 'w95-tray');
    const clock = el('span', 'clock');
    const clockTick = () => {
        const d = new Date();
        clock.textContent = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    };
    clockTick();
    const tick = setInterval(clockTick, 15000);
    tray.appendChild(clock);
    const shut = btn('', '⏻');
    shut.title = 'Turn off power';
    shut.addEventListener('click', () => shutdown(root, tick));
    tray.appendChild(shut);

    const startMenu = buildStartMenu(root, tick);
    desktop.appendChild(startMenu);

    /* Start menu: driven on pointerdown so there's no click-vs-pointerdown race.
       The desktop's click-outside handler would otherwise close the menu on the
       same press that opened it (the button's inner spans aren't `startBtn`). */
    const toggleStartMenu = (force) => {
        const willOpen = force !== undefined ? force : !startMenu.classList.contains('open');
        startMenu.classList.toggle('open', willOpen);
        startBtn.classList.toggle('w95-active', willOpen);
    };
    startBtn.addEventListener('pointerdown', (e) => {
        e.stopPropagation(); // keep the desktop's outside-handler from killing it
        toggleStartMenu();
    });

    taskbar.append(startBtn, tasksRow, tray);
    desktop.appendChild(taskbar);
    root.appendChild(desktop);

    // every window makeWindow() spawns lives on this layer
    root._wm = { zTop: 100, TaskNote: tasksRow, windows: new Map(), desktop };

    // click-outside closes start menu
    desktop.addEventListener('pointerdown', (e) => {
        if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) toggleStartMenu(false);
    });

    // ESC shuts down (authentic "close windows first" energy)
    const escKey = (e) => { if (e.key === 'Escape') shutdown(root, tick); };
    document.addEventListener('keydown', escKey);
    root._esc = escKey;

    // DOS shell launches straight into the command prompt; everything else
    // gets the welcome note. Either way, the desktop never opens empty.
    if (openPath === 'dos') openDOS();
    else openNotepad('\\Desktop\\About Me.txt', root, desktop);
}

/* open any FS path generically — used by Find, Run, desktop double-clicks.
 * App entries launch their program; dirs open Explorer; files open Notepad. */
export function openAny(path) {
    const item = FS[path];
    if (!item) return;
    if (item.kind === 'app') {
        const app = APP_IDS[path];
        if (app === 'dos') openDOS();
        return;
    }
    if (item.type === 'dir') openExplorer(path);
    else openNotepad(path);
}

/* ---------- FS path helpers ------------------------------------------------ */
function normalize(path) {
    return path.replace(/\//g, '\\').replace(/\\{2,}/g, '\\');
}
function fuzzyFind(name) {
    name = name.toLowerCase().trim();
    return Object.keys(FS).find((k) => k.split('\\').pop().toLowerCase() === name);
}
// resolve a name typed in DOS: fuzzy anywhere, then under cwd
function findPath(name, cwd) {
    const byName = Object.keys(FS).find((k) => k.split('\\').pop().toLowerCase() === name.toLowerCase());
    if (byName) return byName;
    const here = normalize((cwd.endsWith('\\') ? cwd : cwd + '\\') + name);
    return FS[here] ? here : null;
}

/* ---------- start menu ------------------------------------------------------- */
function buildStartMenu(root, tick) {
    const m = el('div', 'w95-startmenu');

    const leaf = (g, t, fn) => {
        const i = el('div', 'sm-item');
        i.innerHTML = `<span class="sm-g">${g}</span><span>${esc(t)}</span>`;
        i.addEventListener('click', () => { closeAll(); fn(); });
        return i;
    };
    const sep = () => el('div', 'sm-sep');

    /* cascading submenu — Programs ▸ Accessories ▸ … */
    const cascade = (g, t, kids) => {
        const item = el('div', 'sm-item sm-parent');
        item.innerHTML = `<span class="sm-g">${g}</span><span>${esc(t)}</span><span class="sm-arrow">▸</span>`;
        const sub = el('div', 'sm-cascade');
        kids.forEach((k) => sub.appendChild(k));
        item.appendChild(sub);
        item.addEventListener('pointerenter', () => {
            m.querySelectorAll('.sm-cascade.open').forEach((s) => { if (s !== sub) s.classList.remove('open'); });
            sub.classList.add('open');
        });
        return item;
    };
    const closeAll = () => {
        m.querySelectorAll('.sm-cascade.open').forEach((s) => s.classList.remove('open'));
        m.classList.remove('open');
        root.querySelector('.w95-start')?.classList.remove('w95-active');
    };

    const accessories = cascade('📁', 'Accessories', [
        leaf('🧮', 'Calculator', () => openCalculator()),
        leaf('🎨', 'Paint',       () => openPaint()),
        leaf('🔤', 'Character Map', () => openCharMap()),
        leaf('📝', 'Notepad',     () => openNotepad('\\Desktop\\About Me.txt')),
    ]);
    const games = cascade('📁', 'Games', [
        leaf('💣', 'Minesweeper', () => openMinesweeper()),
        leaf('🃏', 'Solitaire',   () => openSolitaire()),
    ]);
    const programs = cascade('📁', 'Programs', [
        accessories,
        games,
        leaf('🖥️', 'MS-DOS Prompt', () => openDOS()),
        leaf('🌐', 'Internet Explorer', () => openIE()),
    ]);

    m.append(
        leaf('🪟', 'Windows Update', () => openIE('windowsupdate')),
        programs,
        cascade('📁', 'Documents', [
            leaf('📄', 'About Me.txt', () => openNotepad('\\Desktop\\About Me.txt')),
            leaf('📄', 'Contact',      () => openNotepad('\\Desktop\\Contact')),
            leaf('📄', 'askeladd.txt', () => openNotepad('\\Desktop\\My Computer\\(C:)\\Skills\\askeladd.txt')),
        ]),
        leaf('⚙️', 'Settings', () => openControlPanel()),
        leaf('🔍', 'Find', () => openFindDialog()),
        leaf('▶️', 'Run...', () => promptDialog('Run', 'Type the name of a program, folder, or document.\n(Try “calc”, “paint”, “mines”, “notepad”)')),
        sep(),
        leaf('⏻', 'Shut Down...', () => shutdownDialog(root, tick)),
    );
    return m;
}

/* ---------- window factory --------------------------------------------------- */
const wmOf = () => document.getElementById('w95-root')._wm;

function raiseWin(w) {
    const wm = wmOf();
    wm.windows.forEach((n) => n.el.classList.toggle('w95-active', n.el === w));
    const win = wm.windows.get(w);
    if (win) win.el.style.zIndex = ++wm.zTop;
}
// every close path (✕, File→Close, DOS `exit`, dialog buttons) funnels here
function killWindow(win) {
    const wm = wmOf();
    wm.windows.delete(win);
    wm.TaskNote.querySelector(`[data-target="${win.id}"]`)?.remove();
    win.remove();
}
function makeWindow({ title, icon, w = 460, h = 320, content, status, mount }) {
    const root = document.getElementById('w95-root');
    const wm = wmOf();
    const win = el('div', 'w95-window');
    const id = Math.random().toString(36).slice(2);
    win.id = 'w95-win-' + id;
    win.style.width = w + 'px';
    win.style.height = h + 'px';
    win.style.left = (110 + wm.windows.size * 22) + 'px';
    win.style.top = (60 + wm.windows.size * 22) + 'px';
    win.style.zIndex = ++wm.zTop;

    const tb = el('div', 'w95-titlebar');
    tb.innerHTML = `<span class="tb-ico">${icon}</span><span class="tb-text">${esc(title)}</span>`;
    const btns = el('div', 'tb-btns');
    const bMin = document.createElement('button'); bMin.className = 'w95-tbtn'; bMin.textContent = '_';
    const bMax = document.createElement('button'); bMax.className = 'w95-tbtn'; bMax.textContent = '▢';
    const bClose = document.createElement('button'); bClose.className = 'w95-tbtn'; bClose.textContent = '✕';
    bMin.title = 'Minimize'; bMax.title = 'Maximize'; bClose.title = 'Close';
    btns.append(bMin, bMax, bClose);
    tb.appendChild(btns);
    win.appendChild(tb);

    const body = el('div', 'w95-body');
    body.appendChild(content);
    win.appendChild(body);

    if (status) {
        const sb = el('div', 'w95-statusbar');
        // accept both plain text and pre-built cells (notepad passes live
        // nodes so its char-count/save-state can keep ticking after mount)
        status.forEach((s) => sb.appendChild(s instanceof Node ? s : el('span', 'cell', s)));
        win.appendChild(sb);
    }

    // actually show the window — without this it lives only in _wm.windows
    wm.desktop.appendChild(win);

    bMin.addEventListener('click', () => {
        win.style.display = 'none';
        wm.windows.set(win, { ...wm.windows.get(win), minimized: true });
        const task = wm.TaskNote.querySelector(`[data-target="${win.id}"]`);
        if (task) task.classList.remove('w95-active');
    });
    // real maximize: snapshot the rect, fill the desktop work area, and restore
    function toggleMax() {
        if (win.classList.contains('w95-max')) {
            win.classList.remove('w95-max');
            const r = wm.windows.get(win)?.restore;
            if (r) Object.assign(win.style, { left: r.left, top: r.top, width: r.width, height: r.height });
            bMax.textContent = '▢'; bMax.title = 'Maximize';
        } else {
            wm.windows.set(win, { ...wm.windows.get(win), restore: { left: win.style.left, top: win.style.top, width: win.style.width, height: win.style.height } });
            win.classList.add('w95-max');
            bMax.textContent = '❐'; bMax.title = 'Restore';
        }
    }
    bMax.addEventListener('click', toggleMax);
    tb.addEventListener('dblclick', (e) => { if (!e.target.closest('.w95-tbtn')) toggleMax(); });
    bClose.addEventListener('click', () => killWindow(win));
    win.addEventListener('pointerdown', () => raiseWin(win));

    /* drag via titlebar — disabled when maximized */
    tb.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.w95-tbtn') || win.classList.contains('w95-max')) return;
        e.preventDefault();
        raiseWin(win);
        const sx = e.clientX, sy = e.clientY;
        const ox = win.offsetLeft, oy = win.offsetTop;
        function move(ev) {
            win.style.left = Math.max(0, ox + ev.clientX - sx) + 'px';
            win.style.top = Math.max(0, oy + ev.clientY - sy) + 'px';
        }
        function up() {
            document.removeEventListener('pointermove', move);
            document.removeEventListener('pointerup', up);
        }
        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', up);
    });

    // taskbar pill
    const task = btn('w95-task');
    task.dataset.target = win.id;
    task.innerHTML = `<span>${icon}</span><span>${esc(title)}</span>`;
    task.addEventListener('click', () => {
        const hidden = wm.windows.get(win)?.minimized;
        if (hidden || win.style.display === 'none') {
            wm.windows.set(win, { ...wm.windows.get(win), minimized: false });
            win.style.display = 'flex';
            raiseWin(win);
        } else if (win.classList.contains('w95-active')) {
            win.style.display = 'none';
            wm.windows.set(win, { ...wm.windows.get(win), minimized: true });
            task.classList.remove('w95-active');
        } else {
            raiseWin(win);
        }
    });
    wm.TaskNote.appendChild(task);

    wm.windows.set(win, { el: win, minimized: false, task });
    raiseWin(win);
    if (mount) mount(win); // caller hooks: autofocus, wire dropdowns, etc.
    return win;
}

/* ---------- app: notepad (editable, working File menu) ---------------------- */
function openNotepad(path, rootOverride, desktopOverride) {
    const file = FS[path];
    if (!file) return;
    const wrap = el('div', 'w95-nt-wrap');

    // menu bar with real dropdowns
    const menu = el('div', 'w95-menu');
    const fileTitle = el('span', 'menu-title', 'File');
    const editTitle = el('span', 'menu-title', 'Edit');
    fileTitle.classList.add('nd'); editTitle.classList.add('nd');
    const mkMenu = (parent, items) => {
        const drop = el('div', 'menu-drop');
        items.forEach(([label, sep, fn]) => {
            if (sep === true) { drop.appendChild(el('div', 'menu-sep')); return; }
            const it = el('div', 'menu-item', label);
            it.addEventListener('click', (ev) => { ev.stopPropagation(); drop.classList.remove('open'); fn(); });
            drop.appendChild(it);
        });
        parent.style.position = 'relative';
        parent.appendChild(drop);
        parent.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const will = !drop.classList.contains('open');
            wrap.querySelectorAll('.menu-drop').forEach((d) => d.classList.remove('open'));
            if (will) drop.classList.add('open');
        });
        return drop;
    };

    const dd = mkMenu(fileTitle, [
        ['New', null, () => { area.value = ''; area.focus(); }],
        ['Save', null, () => { file.body = area.value; markSaved(); }],
        [null, true, null],
        ['Close', null, null], // wired below
    ]);
    const editDd = mkMenu(editTitle, [
        ['Select All', null, () => { area.select(); area.focus(); }],
        [null, true, null],
        ['Time/Date', null, () => {
            const now = new Date();
            area.setRangeText(`${now.toLocaleTimeString()} ${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()} `, area.selectionStart, area.selectionStart, 'end');
            area.focus();
        }],
    ]);
    menu.append(fileTitle, editTitle);
    wrap.appendChild(menu);

    // content: a real editable page. edits save back to the FS on File→Save.
    const area = document.createElement('textarea');
    area.className = 'w95-nt-main';
    area.spellcheck = false;
    area.value = file.body;
    area.setAttribute('aria-label', `Contents of ${path}`);
    wrap.appendChild(area);

    function markSaved() { savedCell.textContent = 'Saved'; }
    function markDirty() { savedCell.textContent = 'Edited'; charCell.textContent = `${area.value.length} chars`; }
    area.addEventListener('input', () => { savedCell.textContent = 'Edited'; charCell.textContent = `${area.value.length} chars`; });

    const status = el('div', 'w95-statusbar');
    const charCell = el('span', 'cell', `${area.value.length} chars`);
    const savedCell = el('span', 'cell', 'Saved');
    status.append(charCell, savedCell);

    const w = makeWindow({
        title: path.split('\\').pop() + ' — Notepad',
        icon: '📄', w: 440, h: 300,
        content: wrap,
        status: [charCell, savedCell],
        mount: (win) => setTimeout(() => area.focus(), 0),
    });

    // File→Close closes this window
    dd.lastChild.addEventListener('click', () => {
        wmOf().windows.delete(w);
        wmOf().TaskNote.querySelector(`[data-target="${w.id}"]`)?.remove();
        w.remove();
    });
}

/* ---------- app: DOS shell (real command interpreter) ---------------------- */
function openDOS() {
    const content = el('div', 'w95-term');
    const log = el('pre', 'w95-dos-log');
    const line = el('div', 'w95-dos-line');
    const prompt = el('span', 'w95-dos-prompt');
    const input = document.createElement('input');
    input.type = 'text'; input.className = 'w95-dos-input';
    input.spellcheck = false; input.autocomplete = 'off';
    input.setAttribute('aria-label', 'MS-DOS command line');
    line.append(prompt, input);
    content.append(log, line);

    let cwd = 'C:\\';
    const hist = [];
    let histIdx = -1;

    // prompt cwd <-> FS key (canonical; cd below keeps this exact)
    function cwdFs(cur) {
        cur = cur ?? cwd;
        if (cur === 'C:\\') return '\\Desktop\\My Computer\\(C:)';
        return '\\Desktop\\My Computer\\' + cur.replace(/\\+$/, '');
    }
    function promptText() { prompt.textContent = cwd + '>'; }
    function print(html) {
        const d = el('div');
        d.innerHTML = html;
        log.appendChild(d);
        log.scrollTop = log.scrollHeight;
    }
    function printText(s) { print(esc(s)); }
    function header() {
        const dir = FS[cwdFs()];
        print(`<span class="dim"> Directory of ${esc(cwd)}</span>`);
        if (!dir || !dir.kids) { print('<span class="dim"> (empty)</span>'); return; }
        dir.kids.forEach((k) => {
            const kid = FS[k];
            const name = k.split('\\').pop();
            print(`${kid.type === 'dir' ? '&lt;DIR&gt; ' : '      '} ${kid.type === 'dir' ? `<span class="dir">${esc(name)}</span>` : esc(name)}`);
        });
    }

    function run(raw) {
        const cmd = raw.trim();
        if (!cmd) { promptText(); return; }
        hist.unshift(cmd); histIdx = -1;
        print(`<span class="white">${esc(promptText())}</span>${esc(cmd)}`);
        promptText();

        const parts = cmd.split(/\s+/);
        const verb = parts[0].toLowerCase();
        const arg = parts.slice(1).join(' ');

        switch (verb) {
            case 'dir': header(); break;
            case 'cls': log.innerHTML = ''; break;
            case 'cd': {
                if (!arg || arg === '.') break;
                const baseFs = cwdFs(); // canonical FS key for current dir
                if (arg === '..') {
                    const up = baseFs.replace(/\\[^\\]+$/, '');
                    if (!FS[up]) { printText('Invalid directory'); break; }
                    cwd = up === '\\Desktop\\My Computer\\(C:)' ? 'C:\\' : up.split('\\Desktop\\My Computer\\')[1] + '\\';
                    break;
                }
                const name = arg.split('\\')[0];
                const t = normalize(baseFs + '\\' + name); // always well-formed FS key
                let found = null;
                for (const key of Object.keys(FS)) {
                    if (key.toLowerCase().startsWith(t.toLowerCase()) && FS[key].type === 'dir') { found = key; break; }
                }
                if (found) {
                    const rel = found.split('\\Desktop\\My Computer\\')[1];
                    cwd = rel ? rel + '\\' : 'C:\\'; // canonical form, always cwdFs()-clean
                } else printText(`Invalid directory`);
                break;
            }
            case 'type': {
                const p = findPath(arg, cwdFs());
                if (!p) printText('File not found');
                else printText(FS[p].body);
                break;
            }
            case 'notepad': {
                const p = arg ? findPath(arg, cwdFs()) : null;
                if (p) openNotepad(p); // opens a real editor
                else openNotepad('\\Desktop\\About Me.txt');
                printText('Launching Notepad…');
                break;
            }
            case 'win':
                printText('Windows already running.');
                break;
            case 'help':
                printText('Commands: dir, cd, type, notepad, win, cls, help, exit');
                break;
            case 'exit': {
                // close THIS DOS window directly — killWindow owns cleanup
                killWindow(winEl);
                break;
            }
            default:
                printText(`Bad command or file name`);
        }
    }

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { const v = input.value; input.value = ''; run(v); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); if (histIdx < hist.length - 1) input.value = hist[++histIdx] ?? ''; }
        else if (e.key === 'ArrowDown') { e.preventDefault(); if (histIdx > -1) input.value = hist[--histIdx] ?? ''; }
    });

    const winEl = makeWindow({
        title: 'MS-DOS Prompt', icon: '⛶', w: 520, h: 300,
        content,
        status: ['DOS mode', 'type "help"'],
        mount: () => setTimeout(() => input.focus(), 0),
    });

    // banner + prompt
    printText('Microsoft(R) Windows 95');
    printText('   (C)Copyright Microsoft Corp 1981-1995.');
    print(' ');
    print(`<span class="white">${esc(promptText())}</span><span class="blink">_</span>`);
    promptText();
}

/* ---------- app: recycle bin (opens, and "empty" earns exactly what it says) */
function openRecycleBin() {
    const bin = FS['\\Desktop\\Recycle Bin'];
    const content = el('div');
    content.style.cssText = 'display:flex; flex-direction:column; gap:10px; height:100%; padding:2px;';

    const bodyText = el('div', 'w95-prop');
    const count = bin.kids?.length ?? 0;
    bodyText.innerHTML = count
        ? `<div><b>${count} object(s)</b> — mostly bad decisions from temp directories.</div>`
        : `<div>Recycle Bin is empty.</div><div style="color:#808080; font-size:10px; margin-top:4px;">(fortunately for everyone)</div>`;

    const row = el('div'); row.style.cssText = 'display:flex; gap:8px; margin-top:auto;';
    const emptyBtn = btn('', 'Empty Recycle Bin');
    emptyBtn.disabled = count === 0;
    emptyBtn.title = count === 0 ? 'Nothing to delete.' : 'Delete all items (still nothing).';
    emptyBtn.addEventListener('click', () => {
        FS['\\Desktop\\Recycle Bin'].kids = [];
        openRecycleBin(); // re-open to show the fresh empty state + a paper trail
        alertDialog('Recycle Bin', 'All items deleted. (There were none to begin with. Clean, always.)');
    });
    row.appendChild(emptyBtn);
    content.append(bodyText, row);

    makeWindow({
        title: 'Recycle Bin', icon: '🗑️', w: 380, h: 220,
        content, status: [count ? `${count} object(s)` : '0 object(s)'],
    });
}

/* ---------- app: explorer (navigable, tree + list both live) --------------- */
function openExplorer(path) {
    path = normalize(path);
    // alias the drive letter the way real win95 talked about it
    if (/^C[:\\]/i.test(path)) path = path.replace(/^C[:\\]/i, '\\Desktop\\My Computer\\(C:)');
    const dir = FS[path];
    if (!dir || dir.type !== 'dir') return;

    // toolbar with a functional up-level button + address path
    const bar = el('div', 'w95-expl-bar');
    const bUp = btn('', '⬆ Up');
    const addr = el('span', 'fpath', path);
    bar.append(bUp, addr);

    const tree = el('div', 'tree');
    const list = el('div', 'list');

    function treeRow(p, depth) {
        const d = FS[p];
        if (!d || d.type !== 'dir') return;
        const row = el('div');
        row.dataset.path = p;
        row.style.cssText = `padding-left:${depth * 12}px; cursor:pointer; padding-top:2px; padding-bottom:2px;`;
        row.innerHTML = `${p.includes('(C:)') && p.endsWith('(C:)') ? '💾' : '📁'} ${esc(p.split('\\').pop() || p)}`;
        row.addEventListener('click', () => renderList(p));
        tree.appendChild(row);
        if (d.kids) d.kids.forEach((k) => treeRow(k, depth + 1));
    }
    treeRow('\\Desktop\\My Computer', 0);

    function renderList(p) {
        const d = FS[p];
        addr.textContent = p; // address bar follows every navigation
        list.dataset.cwd = p;
        list.innerHTML = `<div style="font-weight:700; margin-bottom:6px;">${esc(p)}</div>`;
        if (!d.kids) return;
        d.kids.forEach((k) => {
            const kid = FS[k];
            const row = el('div', 'frow');
            row.dataset.path = k;
            const glyph = kid.type === 'dir' ? DIR_GLYPH.dir : (kid.kind === 'note' ? DIR_GLYPH.txt : kid.kind === 'bin' ? DIR_GLYPH.bin : DIR_GLYPH.sys);
            row.innerHTML = `${glyph} ${esc(k.split('\\').pop())}`;
            row.addEventListener('dblclick', () => {
                if (kid.type === 'dir') renderList(k);
                else openNotepad(k);
            });
            row.addEventListener('click', () => {
                list.querySelectorAll('.frow').forEach((r) => r.classList.remove('w95-sel'));
                row.classList.add('w95-sel');
            });
            list.appendChild(row);
        });
        // highlight the current folder in the tree
        tree.querySelectorAll('div').forEach((d2) => d2.classList.toggle('w95-sel', d2.dataset.path === p));
    }
    bUp.addEventListener('click', () => {
        const cur = list.dataset.cwd || '\\Desktop\\My Computer';
        const up = cur.replace(/\\[^\\]+$/, '');
        if (FS[up]) renderList(up);
    });

    renderList(path);

    const grid = el('div', 'w95-expl');
    grid.append(tree, list);
    const wrap = el('div');
    wrap.append(bar, grid);

    makeWindow({
        title: path.split('\\').pop() === '' ? path : path.split('\\').pop(),
        icon: '📁', w: 560, h: 360,
        content: wrap,
        status: [`${FS[path]?.kids?.length ?? 0} object(s)`, 'My Computer'],
    });
}

/* ---------- app: find ------------------------------------------------------ */
function openFindDialog() {
    const c = el('div');
    c.className = 'w95-find';
    const row = el('div'); row.style.cssText = 'display:flex; gap:8px; margin-bottom:8px;';
    const inp = document.createElement('input');
    inp.type = 'text'; inp.className = 'w95-inp'; inp.style.flex = '1';
    inp.placeholder = 'e.g. ericsson, projects, askeladd';
    inp.setAttribute('aria-label', 'File name to find');
    const findBtn = btn('', 'Find Now');
    row.append(inp, findBtn);
    const results = el('div', 'results');
    c.append(row, results);

    function doFind() {
        const q = inp.value.trim().toLowerCase();
        if (!q) { results.innerHTML = '<div class="dim" style="padding:6px 4px;">type something first.</div>'; return; }
        results.innerHTML = '';
        const hits = Object.keys(FS).filter((k) => k.toLowerCase().includes(q));
        if (!hits.length) { results.innerHTML = '<div class="dim" style="padding:6px 4px;">No matches. (Nothing personal.)</div>'; return; }
        hits.forEach((k) => {
            const d = FS[k];
            const r = el('div', 'hit');
            r.innerHTML = `${d.type === 'dir' ? '📁' : '📄'} ${esc(k)}`;
            r.addEventListener('dblclick', () => { d.type === 'dir' ? openExplorer(k) : openNotepad(k); });
            r.addEventListener('click', () => { results.querySelectorAll('.hit').forEach((h) => h.classList.remove('w95-sel')); r.classList.add('w95-sel'); });
            results.appendChild(r);
        });
    }
    findBtn.addEventListener('click', doFind);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') doFind(); });
    setTimeout(() => inp.focus(), 0);

    makeWindow({ title: 'Find: All Files', icon: '🔍', w: 420, h: 280, content: c, status: ['Ready'] });
}

/* ---------- app: control panel (working applets) ---------------------------- */
function openControlPanel() {
    const c = el('div', 'w95-ctrl');
    const mk = (g, t, fn) => {
        const b = el('button', 'w95-cp-icon');
        b.innerHTML = `<span class="glyph">${g}</span><span>${esc(t)}</span>`;
        b.addEventListener('dblclick', fn);
        return b;
    };
    c.append(
        mk('🖥️', 'Display', openDisplayApplet),
        mk('🕒', 'Date/Time', openDateTimeApplet),
        mk('🖱️', 'Mouse', openMouseApplet),
        mk('⌨️', 'Keyboard', openKeyboardApplet),
        mk('🔊', 'Sounds', openSoundsApplet),
        mk('🖺', 'Printers', openPrintersApplet),
    );
    makeWindow({ title: 'Control Panel', icon: '⚙️', w: 420, h: 220, content: c, status: ['6 object(s)'] });
}

function openMouseApplet() {
    const c = el('div'); c.className = 'w95-prop';
    c.innerHTML = `<div style="margin-bottom:8px;"><b>Double-click speed:</b></div>`;
    const track = el('div'); track.style.cssText = 'display:flex; gap:6px; align-items:center;';
    const slider = document.createElement('input');
    slider.type = 'range'; slider.min = 200; slider.max = 900; slider.value = 500; slider.step = 50;
    slider.style.flex = '1';
    const readout = el('span', null, '500 ms');
    slider.addEventListener('input', () => readout.textContent = slider.value + ' ms');
    track.append(slider, readout);
    const pad = el('div', 'w95-well-inset');
    pad.style.cssText = 'margin-top:10px; height:52px; display:grid; place-items:center; font-size:11px; color:#808080; user-select:none;';
    pad.textContent = 'Double-click here to test';
    let last = 0;
    pad.addEventListener('click', () => {
        const now = performance.now();
        pad.textContent = (now - last < +slider.value) ? '✓ registered' : 'too slow — try faster';
        last = now;
        setTimeout(() => pad.textContent = 'Double-click here to test', 1200);
    });
    c.append(track, pad);
    makeWindow({ title: 'Mouse Properties', icon: '🖱️', w: 320, h: 180, content: c, status: [] });
}

function openKeyboardApplet() {
    const c = el('div'); c.className = 'w95-prop';
    c.innerHTML = `<div><b>Input locale:</b> English (United States)</div>
        <div style="margin-top:8px;"><b>Keyboard:</b> Standard 101/102-Key</div>
        <div style="margin-top:10px; color:#808080; font-size:10px;">The best keyboard is the one you didn't have to configure.</div>`;
    makeWindow({ title: 'Keyboard Properties', icon: '⌨️', w: 300, h: 160, content: c, status: [] });
}

function openSoundsApplet() {
    const c = el('div'); c.className = 'w95-prop';
    c.innerHTML = `<div style="margin-bottom:8px;"><b>Events:</b></div>`;
    const list = el('div', 'w95-well-inset');
    list.style.cssText = 'padding:6px; height:90px; overflow:auto; font-size:11px;';
    ['Start Windows', 'Asterisk', 'Critical Stop', 'Exit Windows', 'Ding'].forEach(s => {
        const r = el('div', null, '🔔 ' + s); r.style.padding = '2px 2px'; list.appendChild(r);
    });
    const note = el('div', null, '(this machine shipped with no speaker)');
    note.style.cssText = 'color:#808080; font-size:10px; margin-top:8px;';
    c.append(list, note);
    makeWindow({ title: 'Sounds', icon: '🔊', w: 300, h: 200, content: c, status: [] });
}

function openPrintersApplet() {
    const c = el('div'); c.className = 'w95-prop';
    c.innerHTML = `<div style="margin-bottom:8px;"><b>Installed printers:</b></div>`;
    const row = el('div', 'w95-well-inset');
    row.style.cssText = 'padding:10px; font-size:11px;';
    row.innerHTML = '🖨️ <b>Generic / Text Only</b> — LPT1:<br><span style="color:#808080;">Ready. Nobody prints anymore.</span>';
    c.appendChild(row);
    makeWindow({ title: 'Printers', icon: '🖨️', w: 300, h: 160, content: c, status: [] });
}

function openDisplayApplet() {
    const c = el('div');
    c.className = 'w95-prop';
    const label = el('div', null, 'Desktop color:');
    label.style.marginBottom = '8px';
    const row = el('div'); row.style.cssText = 'display:flex; gap:10px;';
    const swatches = [
        ['Teal', '#008080'], ['Gray', '#808080'], ['Blue', '#000080'].slice(0, 3),
        ['Green', '#008000'], ['Maroon', '#800000', ], ['Purple', '#800080'], ['Black', '#000000'], ['Sand', '#c0a060'],
    ];
    const appBtn = btn('', 'Apply');
    swatches.slice(0, 8).forEach(([name, hex]) => {
        const s = el('button', 'swatch');
        s.type = 'button'; s.title = name; s.style.background = hex;
        s.setAttribute('aria-label', name);
        s.addEventListener('click', () => selected = hex);
        row.appendChild(s);
    });
    let selected = '#008080';
    appBtn.addEventListener('click', () => {
        const desktop = document.querySelector('.w95-desktop');
        if (desktop) desktop.style.background = '';
        document.documentElement.style.setProperty('--w95-desktop', selected); // live repaint
    });
    const south = el('div'); south.style.cssText = 'margin-top:14px; display:flex; justify-content:flex-end;';
    south.appendChild(appBtn);
    c.append(label, row, south);
    makeWindow({ title: 'Display Properties', icon: '🖥️', w: 300, h: 180, content: c, status: [] });
}

function openDateTimeApplet() {
    const c = el('div');
    c.className = 'w95-prop';
    const t = el('div'); t.style.cssText = 'font-size:18px; margin:6px 0;';
    const d = new Date();
    t.textContent = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        + ' — ' + d.toLocaleTimeString();
    const note = el('div', null, '(read-only, like all good mornings)');
    note.style.cssText = 'color:#808080; margin-top:10px; font-size:10px;';
    c.append(t, note);
    makeWindow({ title: 'Date/Time Properties', icon: '🕒', w: 300, h: 160, content: c, status: [] });
}

/* ---------- dialogs ---------------------------------------------------------- */
function dialogBody(title, icon, bodyHtml, btns) {
    const c = el('div');
    c.className = 'w95-prop';
    const msg = el('div');
    msg.innerHTML = bodyHtml;
    const row = el('div'); row.style.cssText = 'margin-top:14px; display:flex; gap:8px; justify-content:flex-end;';
    btns.forEach(([label, fn]) => {
        const b = btn('', label);
        b.addEventListener('click', fn);
        row.appendChild(b);
    });
    c.append(msg, row);
    return c;
}

function alertDialog(title, body) {
    const c = dialogBody(title, '⚙️', esc(body).replace(/\n/g, '<br>'), [
        ['OK', () => {}], // populated below
    ]);
    const w = makeWindow({ title, icon: '⚙️', w: 360, h: 210, content: c, status: [] });
    c.querySelector('.w95-prop button').addEventListener('click', () => {
        const wm = wmOf(); wm.windows.delete(w); w.remove(); wm.TaskNote.querySelector(`[data-target="${w.id}"]`)?.remove();
    });
}

function promptDialog(title, hint) {
    const c = dialogBody(title, '▶️', esc(hint).replace(/\n/g, '<br>') + `<input type="text" class="w95-inp" style="width:100%; margin-top:10px;">`, [
        ['OK', null], ['Cancel', null],
    ]);
    const w = makeWindow({ title, icon: '▶️', w: 360, h: 200, content: c, status: [] });
    const close = () => { const wm = wmOf(); wm.windows.delete(w); w.remove(); wm.TaskNote.querySelector(`[data-target="${w.id}"]`)?.remove(); };
    const [ok, cancel] = c.querySelectorAll('.w95-prop button');
    cancel.addEventListener('click', close);
    ok.addEventListener('click', () => {
        const v = c.querySelector('input').value.trim().toLowerCase();
        if (v === 'notepad') openNotepad('\\Desktop\\About Me.txt');
        else if (v === 'win' || v === 'explorer') openExplorer('C:');
        else if (v === 'dos' || v === 'command' || v === 'cmd') openDOS();
        else if (/^(calc|calculator)$/.test(v)) openCalculator();
        else if (/^paint(brush)?$/.test(v)) openPaint();
        else if (/^(mine|mines|minesweeper)$/.test(v)) openMinesweeper();
        else if (/^(sol|solitaire|cards)$/.test(v)) openSolitaire();
        else if (/^charmap$/.test(v)) openCharMap();
        else if (/^(iexplore|internet|browser|ie)$/.test(v)) openIE();
        else if (/^(control|settings)$/.test(v)) openControlPanel();
        else if (v) alertDialog('Run', `Cannot find '${v}'.`)
        close();
    });
}

function shutdownDialog(root, tick) {
    const c = el('div');
    c.className = 'w95-prop';
    c.innerHTML = `
        <div class="shut-row">
            <label class="w95-radio">
                <input type="radio" name="w95-shut" value="standby"> Stand by
            </label>
        </div>
        <div class="shut-row">
            <label class="w95-radio">
                <input type="radio" name="w95-shut" value="shutdown" checked> Shut down
            </label>
        </div>
        <div class="shut-row">
            <label class="w95-radio">
                <input type="radio" name="w95-shut" value="restart"> Restart
            </label>
        </div>`;
    const row = el('div'); row.style.cssText = 'margin-top:14px; display:flex; gap:8px; justify-content:flex-end;';
    const ok = btn('', 'OK');
    const cancel = btn('', 'Cancel');
    row.append(ok, cancel);
    c.appendChild(row);
    const w = makeWindow({ title: 'Shut Down Windows', icon: '⏻', w: 300, h: 260, content: c, status: [] });
    const close = () => { const wm = wmOf(); wm.windows.delete(w); w.remove(); wm.TaskNote.querySelector(`[data-target="${w.id}"]`)?.remove(); };
    cancel.addEventListener('click', close);
    ok.addEventListener('click', () => {
        const mode = c.querySelector('input[name="w95-shut"]:checked')?.value || 'shutdown';
        close();
        if (mode === 'restart') {
            root.innerHTML = '';
            setTimeout(() => doBootSequence(root, () => showDesktop(root)), 260);
        } else if (mode === 'standby') {
            root._esc && document.removeEventListener('keydown', root._esc);
            root.innerHTML = '';
            const off = el('div', 'w95-safeoff');
            off.innerHTML = `<div class="frame"><div style="font-size:26px;">💾</div><p>Butler is thinking…</p><p style="color:#808080; font-size:10px;">(standby)</p></div>`;
            root.appendChild(off);
            const wake = () => { document.removeEventListener('keydown', wake); off.remove(); doBootSequence(root, () => showDesktop(root)); };
            document.addEventListener('keydown', wake, { once: true });
            off.addEventListener('pointerdown', wake, { once: true });
        } else shutdown(root, tick);
    });
}

/* ============ NEW APPS ============ */

/* ---------- app: calculator ------------------------------------------------ */
function openCalculator() {
    const wrap = el('div', 'w95-calc');
    const disp = el('div', 'calc-display', '0');
    wrap.appendChild(disp);
    const pad = el('div', 'calc-pad');
    let acc = null, op = null, cur = '0', fresh = true;

    const keys = [
        'C', '±', '√', '/',
        '7', '8', '9', '*',
        '4', '5', '6', '-',
        '1', '2', '3', '+',
        '0', '.', '=', '=',
    ];
    // dedupe the equals key visually — wide layout uses it twice in the grid
    const seen = new Set();
    keys.forEach((k) => {
        const b = el('button', 'w95-btn calc-key', k);
        b.type = 'button';
        if (k === '=') { b.classList.add('calc-eq'); if (seen.has('=')) b.style.visibility = 'hidden'; seen.add('='); }
        b.addEventListener('click', () => press(k));
        pad.appendChild(b);
    });
    wrap.appendChild(pad);

    function fmt(n) { const s = (+n.toPrecision(10)).toString(); return s.length > 12 ? n.toExponential(6) : s; }
    function press(k) {
        if (/[0-9]/.test(k)) {
            cur = fresh ? k : (cur === '0' ? k : cur + k);
            fresh = false;
        } else if (k === '.') {
            if (!cur.includes('.')) cur += '.';
            fresh = false;
        } else if (k === 'C') {
            acc = null; op = null; cur = '0'; fresh = true;
        } else if (k === '±') {
            cur = fmt(-parseFloat(cur));
        } else if (k === '√') {
            cur = fmt(Math.sqrt(parseFloat(cur))); fresh = true;
        } else if (['+', '-', '*', '/'].includes(k)) {
            /* an op pressed right after = (or another op) chains off the display,
               so a sequence like 9 ÷ 0 can never resurrect a stale accumulator */
            acc = parseFloat(cur); op = k; fresh = true;
        } else if (k === '=') {
            if (op == null || acc == null) { disp.textContent = cur; return; }
            const a = acc, b = parseFloat(cur);
            let r = 0;
            if (op === '+') r = a + b; else if (op === '-') r = a - b;
            else if (op === '*') r = a * b; else if (op === '/') r = b === 0 ? NaN : a / b;
            cur = isNaN(r) ? 'Cannot divide by zero' : fmt(r);
            op = null; acc = null; fresh = true;
        }
        disp.textContent = cur;
    }
    makeWindow({ title: 'Calculator', icon: '🧮', w: 200, h: 240, content: wrap, status: [] });
}

/* ---------- app: minesweeper ------------------------------------------------ */
function openMinesweeper() {
    const N = 9, MINES = 10;
    const wrap = el('div', 'w95-mines');
    const top = el('div', 'mines-top');
    const counter = el('span', 'mines-count', String(MINES).padStart(3, '0'));
    const face = el('button', 'mines-face', '🙂');
    face.type = 'button';
    const timer = el('span', 'mines-timer', '000');
    top.append(counter, face, timer);
    const grid = el('div', 'mines-grid');
    wrap.append(top, grid);

    let cells, revealed, flagged, alive, started, timerId, secs;

    function reset() {
        alive = true; started = false; secs = 0;
        clearInterval(timerId); timer.textContent = '000';
        face.textContent = '🙂';
        revealed = 0; flagged = 0;
        counter.textContent = String(MINES).padStart(3, '0');
        cells = Array.from({ length: N * N }, () => ({ mine: false, n: 0, open: false, flag: false }));
        // plant mines
        let planted = 0;
        while (planted < MINES) {
            const i = (Math.random() * N * N) | 0;
            if (!cells[i].mine) { cells[i].mine = true; planted++; }
        }
        // count neighbors
        const idx = (r, c) => (r < 0 || c < 0 || r >= N || c >= N) ? -1 : r * N + c;
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
            const i = idx(r, c);
            if (cells[i].mine) continue;
            [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr, dc]) => {
                const j = idx(r + dr, c + dc);
                if (j >= 0 && cells[j].mine) cells[i].n++;
            });
        }
        render();
    }

    function render() {
        grid.innerHTML = '';
        cells.forEach((cl, i) => {
            const d = el('button', 'mcell');
            d.type = 'button';
            d.dataset.i = i;
            if (cl.open) {
                d.classList.add('open');
                if (cl.mine) { d.textContent = '💣'; d.classList.add('boom'); }
                else if (cl.n) { d.textContent = cl.n; d.classList.add('n' + cl.n); }
            } else if (cl.flag) {
                d.textContent = '🚩';
            }
            grid.appendChild(d);
        });
    }

    grid.addEventListener('click', (e) => {
        const d = e.target.closest('.mcell'); if (!d || !alive) return;
        const i = +d.dataset.i;
        const cl = cells[i];
        if (cl.open || cl.flag) return;
        if (!started) { started = true; timerId = setInterval(() => { timer.textContent = String(Math.min(999, ++secs)).padStart(3, '0'); }, 1000); }
        if (cl.mine) {
            cl.open = true; alive = false; clearInterval(timerId);
            face.textContent = '😵';
            cells.forEach((x) => { if (x.mine) x.open = true; });
            render();
            return;
        }
        flood(i);
        render();
        checkWin();
    });
    grid.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const d = e.target.closest('.mcell'); if (!d || !alive) return;
        const cl = cells[+d.dataset.i];
        if (cl.open) return;
        cl.flag = !cl.flag;
        flagged += cl.flag ? 1 : -1;
        counter.textContent = String(Math.max(0, MINES - flagged)).padStart(3, '0');
        render();
    });
    const idx2 = (r, c) => (r < 0 || c < 0 || r >= N || c >= N) ? -1 : r * N + c;
    function flood(i) {
        const stack = [i];
        while (stack.length) {
            const cur = stack.pop();
            const cl = cells[cur];
            if (cl.open || cl.flag) continue;
            cl.open = true; revealed++;
            if (cl.n === 0) {
                const r = (cur / N) | 0, c = cur % N;
                [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr, dc]) => {
                    const j = idx2(r + dr, c + dc);
                    if (j >= 0 && !cells[j].open && !cells[j].mine) stack.push(j);
                });
            }
        }
    }
    function checkWin() {
        if (revealed === N * N - MINES) {
            alive = false; clearInterval(timerId);
            face.textContent = '😎';
            alertDialog('Minesweeper', `Cleared in ${secs} second(s). The mines remain at large.`);
        }
    }
    face.addEventListener('click', reset);

    reset();
    makeWindow({ title: 'Minesweeper', icon: '💣', w: 212, h: 282, content: wrap, status: [] });
}

/* ---------- app: paint ------------------------------------------------------- */
function openPaint() {
    const wrap = el('div', 'w95-paint');
    const bar = el('div', 'paint-bar');
    const colors = ['#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
                    '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'];
    let color = '#000000', size = 3, drawing = false, last = null;

    const swRow = el('div', 'paint-swatches');
    colors.forEach((c) => {
        const s = el('button', 'swatch');
        s.type = 'button'; s.style.background = c; s.title = c;
        s.addEventListener('click', () => { color = c; swRow.querySelectorAll('.swatch').forEach(x => x.classList.remove('sel')); s.classList.add('sel'); });
        swRow.appendChild(s);
    });
    swRow.firstChild.classList.add('sel');

    const tools = el('div', 'paint-tools');
    const small = btn('', '·'); small.title = 'Fine';
    const med = btn('', '●'); med.title = 'Medium';
    const big = btn('', '⬤'); big.title = 'Thick';
    small.style.fontSize = '8px'; med.style.fontSize = '11px'; big.style.fontSize = '14px';
    [small, med, big].forEach((b, i) => b.addEventListener('click', () => { size = [2, 4, 8][i]; [small, med, big].forEach(x => x.classList.remove('w95-active')); b.classList.add('w95-active'); }));
    med.classList.add('w95-active');
    const clear = btn('', 'Clear');
    tools.append(small, med, big, clear);

    bar.append(swRow, tools);

    const cv = document.createElement('canvas');
    cv.className = 'paint-canvas';
    cv.width = 460; cv.height = 300;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    function pos(e) {
        const r = cv.getBoundingClientRect();
        return [(e.clientX - r.left) * (cv.width / r.width), (e.clientY - r.top) * (cv.height / r.height)];
    }
    cv.addEventListener('pointerdown', (e) => { drawing = true; last = pos(e); cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', (e) => {
        if (!drawing) return;
        const p = pos(e);
        ctx.strokeStyle = color; ctx.lineWidth = size;
        ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
        last = p;
    });
    ['pointerup', 'pointercancel'].forEach(ev => cv.addEventListener(ev, () => { drawing = false; }));
    clear.addEventListener('click', () => { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cv.width, cv.height); });

    wrap.append(bar, cv);
    makeWindow({ title: 'untitled — Paint', icon: '🎨', w: 500, h: 400, content: wrap, status: [] });
}

/* ---------- app: solitaire (real, playable klondike-lite) -------------------- */
function openSolitaire() {
    const wrap = el('div', 'w95-sol');
    const felt = el('div', 'sol-felt');
    wrap.appendChild(felt);

    const SUITS = ['♠', '♥', '♦', '♣'];
    const REDS = { '♥': 1, '♦': 1 };
    let deck, waste, piles, foundations, moves;

    function newGame() {
        deck = []; waste = []; piles = [[], [], [], [], [], [], []]; foundations = { '♠': [], '♥': [], '♦': [], '♣': [] }; moves = 0;
        SUITS.forEach((s) => { for (let v = 1; v <= 13; v++) deck.push({ s, v, up: false }); });
        for (let i = deck.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [deck[i], deck[j]] = [deck[j], deck[i]]; }
        for (let p = 0; p < 7; p++) for (let k = 0; k <= p; k++) { const card = deck.pop(); card.up = k === p; piles[p].push(card); }
        render();
    }

    const rank = (v) => v === 1 ? 'A' : v === 11 ? 'J' : v === 12 ? 'Q' : v === 13 ? 'K' : String(v);
    const cardEl = (c) => {
        const d = el('div', 'solcard' + (c.up ? ' up' : ''));
        if (c.up) { d.textContent = rank(c.v) + c.s; if (REDS[c.s]) d.classList.add('red'); }
        else d.textContent = '';
        return d;
    };

    function render() {
        felt.innerHTML = '';
        const topRow = el('div', 'sol-row');
        // stock + waste
        const stock = el('div', 'solcard slot stock');
        stock.textContent = deck.length ? '🂠' : '↺';
        stock.title = deck.length ? 'Deal' : 'Recycle waste';
        stock.addEventListener('click', () => {
            if (deck.length) { const c = deck.pop(); c.up = true; waste.push(c); }
            else { deck = waste.reverse().map(c => ({ ...c, up: false })); waste = []; }
            moves++; render();
        });
        topRow.appendChild(stock);
        const wasteEl = el('div', 'solcard slot waste');
        const wt = waste[waste.length - 1];
        if (wt) { wasteEl.textContent = rank(wt.v) + wt.s; if (REDS[wt.s]) wasteEl.classList.add('red'); wasteEl.dataset.src = 'waste'; }
        else wasteEl.textContent = '';
        topRow.appendChild(wasteEl);
        topRow.appendChild(el('div', 'sol-gap'));
        // foundations
        SUITS.forEach((s) => {
            const f = el('div', 'solcard slot found');
            const top = foundations[s][foundations[s].length - 1];
            if (top) { f.textContent = rank(top.v) + top.s; if (REDS[top.s]) f.classList.add('red'); }
            else f.textContent = s;
            f.dataset.found = s;
            topRow.appendChild(f);
        });
        felt.appendChild(topRow);

        // tableau piles
        const pilesRow = el('div', 'sol-row sol-tab');
        piles.forEach((pile, pi) => {
            const col = el('div', 'sol-pile');
            pile.forEach((c, ci) => {
                const cd = cardEl(c);
                cd.dataset.pile = pi; cd.dataset.cardIdx = ci;
                col.appendChild(cd);
            });
            if (!pile.length) { const empty = el('div', 'solcard slot'); col.appendChild(empty); }
            pilesRow.appendChild(col);
        });
        felt.appendChild(pilesRow);

        // wire up simple move: click waste top → try foundation/tableau; click tableau top → try foundation
        wasteEl.addEventListener('click', () => tryAuto(waste, waste));
        felt.querySelectorAll('.sol-pile').forEach((col) => {
            const pi = +col.lastChild?.dataset?.pile;
            if (isNaN(pi)) return;
            const pile = piles[pi];
            const topCard = pile[pile.length - 1];
            if (!topCard || !topCard.up) return;
            col.lastChild.addEventListener('click', () => tryAuto(pile, pile));
        });
    }

    function tryAuto(fromArr) {
        const c = fromArr[fromArr.length - 1]; if (!c) return;
        // try foundation first
        if (c.up && ((c.v === 1 && !foundations[c.s].length) || (foundations[c.s].length && foundations[c.s][foundations[c.s].length - 1].v === c.v - 1))) {
            foundations[c.s].push(fromArr.pop()); moves++; flipTop(fromArr); render(); return;
        }
        // try tableau (descending, alternating colors)
        for (let p = 0; p < 7; p++) {
            const target = piles[p][piles[p].length - 1];
            if (!target) { if (c.v === 13) { piles[p].push(fromArr.pop()); moves++; flipTop(fromArr); render(); return; } continue; }
            if (target.up && target.v === c.v + 1 && !!REDS[target.s] !== !!REDS[c.s]) {
                piles[p].push(fromArr.pop()); moves++; flipTop(fromArr); render(); return;
            }
        }
    }
    function flipTop(arr) { if (arr.length && !arr[arr.length - 1].up) arr[arr.length - 1].up = true; }

    newGame();
    const w = makeWindow({ title: 'Solitaire', icon: '🃏', w: 560, h: 420, content: wrap, status: [] });
    // re-render on Game restart via double-click felt
    felt.addEventListener('dblclick', newGame);
    return w;
}

/* ---------- app: character map ---------------------------------------------- */
function openCharMap() {
    const wrap = el('div', 'w95-charmap');
    const grid = el('div', 'charmap-grid');
    const preview = el('div', 'charmap-preview', '—');
    const copyRow = el('div', 'charmap-foot');
    const buf = el('input');
    buf.type = 'text'; buf.className = 'w95-inp'; buf.readOnly = true; buf.style.flex = '1';
    const copyBtn = btn('', 'Copy');
    copyRow.append(buf, copyBtn);
    wrap.append(grid, preview, copyRow);

    const chars = '¡¢£¥§©®°±²³µ¶·½¿Ωπ∞†‡•‰€™←↑→↓↔↕─│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬░▒▓█■▲►◄◊○●◘◙☺☻♠♣♥♦♪♫✓✗'.split('');
    let picked = '';
    chars.forEach((ch) => {
        const b = el('button', 'cmcell', ch);
        b.type = 'button';
        b.addEventListener('click', () => {
            preview.textContent = ch;
            picked += ch;
            buf.value = picked;
        });
        grid.appendChild(b);
    });
    copyBtn.addEventListener('click', () => { buf.select(); document.execCommand?.('copy'); buf.focus(); });
    makeWindow({ title: 'Character Map', icon: '🔤', w: 320, h: 300, content: wrap, status: [] });
}

/* ---------- app: internet explorer (offline, era-perfect) -------------------- */
function openIE(page) {
    const wrap = el('div', 'w95-ie');
    const bar = el('div', 'ie-bar');
    bar.innerHTML = `<span style="margin-right:6px;">Address</span>`;
    const addr = el('input');
    addr.type = 'text'; addr.className = 'w95-inp'; addr.style.flex = '1';
    addr.value = page === 'windowsupdate' ? 'http://www.windowsupdate.com/' : 'http://www.microsoft.com/ie/';
    addr.disabled = true;
    bar.appendChild(addr);

    const view = el('div', 'ie-view');
    view.innerHTML = `
        <div style="text-align:center; padding-top:30px;">
            <div style="font-size:44px;">🌐</div>
            <h2 style="color:#000080; margin:10px 0 4px;">Internet Explorer</h2>
            <div style="color:#808080; font-size:11px;">Your gateway to the information superhighway.</div>
            <div class="ie-progress" style="margin:24px auto 0;">
                <div class="ie-block"></div><div class="ie-block"></div><div class="ie-block"></div><div class="ie-block"></div><div class="ie-block"></div>
            </div>
            <div style="color:#808080; font-size:10px; margin-top:8px;">Connecting… no, really. Any second now.</div>
        </div>`;
    wrap.append(bar, view);
    const w = makeWindow({ title: 'Microsoft Internet Explorer', icon: '🌐', w: 480, h: 340, content: wrap, status: ['Opening page…'] });
    setTimeout(() => { const sb = w.querySelector('.w95-statusbar .cell'); if (sb) sb.textContent = 'Done (you are offline. it is 1995.)'; }, 2200);
}



/* ---------- shutdown ---------------------------------------------------------- */
function shutdown(root, clockTick) {
    clearInterval(clockTick);
    if (root._esc) { document.removeEventListener('keydown', root._esc); root._esc = null; }
    const wm = wmOf();
    wm.windows.clear();
    root.innerHTML = '';
    document.body.classList.remove('w95-live');
    window.dispatchEvent(new CustomEvent('w95:shutdown'));
    const off = el('div', 'w95-safeoff');
    off.innerHTML = `
        <div class="frame">
            <div style="font-size:26px; letter-spacing:1px;">🏁</div>
            <p>It's now safe to turn off your computer.</p>
            <p style="color:#808080; font-size:10px; margin-top:8px;">press ENTER to reboot into <span style="color:#7cf5d3">/home/abeer</span></p>
        </div>`;
    root.appendChild(off);
    const reboot = (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            document.removeEventListener('keydown', reboot);
            root.innerHTML = '';
            root.hidden = true;
            document.body.style.overflow = '';
        }
    };
    document.addEventListener('keydown', reboot);
    off.addEventListener('pointerdown', reboot);
}
