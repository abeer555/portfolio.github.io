/*
 * twin95.js — win95-flavored interactive hero terminal (no deps, plain JS).
 *
 * A fully working tiny shell with a virtual filesystem of the portfolio:
 *   dir / cd / cat / cls / whoami / pwd / nmap / help / banner
 * Auto-boots with a short typed sequence so the pane is alive even idle.
 */

const FS = {
    'C:\\': { type: 'dir' },
    'C:\\projects': { type: 'dir' },
    'C:\\projects\\qrag.py': { type: 'file', body: 'Quantum RAG benchmark harness — PennyLane + Qiskit, MiniLM+Qdrant-T5 baseline, Crawl4AI corpus. All the way through: [https://github.com/abeer555/Quantum-Rag-Benchmark-agri]' },
    'C:\\projects\\luxury_taj_tour\\': { type: 'file', body: 'Real client work. Next.js PWA + GSAP, Vercel. → luxurytajtour.com' },
    'C:\\projects\\chat.js': { type: 'file', body: 'HTTP/3 real-time chat. Cloudflare + S3 + Render. → abeer.codes' },
    'C:\\projects\\vericrop.ts': { type: 'file', body: 'Blockchain traceability for agriculture. Chainlink oracles, ML fraud, Next.js 14.' },
    'C:\\about.txt': { type: 'file', body: 'name  : abeer\ncode  : ai pipelines / cloud backends / things that ship\nos    : arch linux (btw)\nshell : fish\neduc  : b.tech cse @ vit chennai · bs data science @ iit madras (online)' },
    'C:\\contact.txt': { type: 'file', body: 'mail  : abeer@abeer.codes\ngit   : github.com/abeer555\nlink  : linkedin.com/in/abeer-gupta' },
    'C:\\certs.log': { type: 'file', body: '[THM] Pre-Security\n[THM] Cyber Security 101\n[AWS] Educate: Cloud 101' },
};

const BANNER = [
    '╔════════════════════════════════╗',
    '║   abeerOS 6.19  —  tty0        ║',
    '║   ready. type "help", nerdlord ║',
    '╚════════════════════════════════╝',
];

const WELCOME = [
    '[ OK ] C:\\> mount /home/abeer',
    '[ OK ] services: portfolio daemon running',
    '[ OK ] tty0 session started',
    ' ',
    'type "help" to wreck around',
];

const HELP = [
    ['dir           list files'],
    ['cd <dir>      change directory'],
    ['cat <file>    read a file'],
    ['cls           clear screen'],
    ['whoami        who are you again'],
    ['pwd           where are we'],
    ['nmap          probably not ethical'],
    ['banner        make it pretty again'],
    ['mother        try it'],
];

export function bootTerminal(root) {
    const log = root.querySelector('#term-log');
    const form = root.querySelector('#term-form');
    const input = root.querySelector('#term-input');
    const promptEl = root.querySelector('#term-prompt');
    const title = root.querySelector('#term-title');

    let cwd = 'C:\\';
    const hist = [];
    let histIdx = -1;

    const pad = (s, n) => (s + ' '.repeat(n)).slice(0, n);
    const write = (html) => {
        const line = document.createElement('div');
        line.innerHTML = html;
        log.appendChild(line);
        log.scrollTop = log.scrollHeight;
    };
    const writePrompt = (cmd) =>
        write(`<span class="white">${esc(promptEl.textContent)}</span>${esc(cmd)}`);

    function esc(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function syncPrompt() {
        promptEl.textContent = cwd.replace(/^C:/, 'C:') + '>';
        if (title) title.textContent = `abeer@arch — ${cwd}`;
    }
    function boot() {
        syncPrompt();
        BANNER.forEach((l) => write(`<span class="dim">${l}</span>`));
        write(' ');
        WELCOME.forEach((l) => write(l));
    }

    function exec(raw) {
        const cmd = raw.trim();
        if (!cmd) return;
        hist.unshift(cmd);
        histIdx = -1;
        writePrompt(cmd);

        const parts = cmd.split(/\s+/);
        const verb = parts[0].toLowerCase();
        const arg = parts.slice(1).join(' ');

        switch (verb) {
            case 'help':
                write('available commands:');
                HELP.forEach(([l]) => write(`  <span class="amber">${pad(l.split(' ')[0], 10)}</span> <span class="dim">${l.slice(l.indexOf(' ')).trim()}</span>`));
                break;
            case 'dir': {
                const entries = Object.keys(FS).filter((k) => k.startsWith(cwd) && k !== cwd && k.split('\\').pop() !== '');
                write(' Volume in drive C is ABEER');
                write(` Directory of ${cwd}\n`);
                entries.forEach((k) => {
                    const name = k.split('\\').pop();
                    const isDir = FS[k].type === 'dir';
                    write(`${isDir ? '<DIR>' : '     '}  ${isDir ? `<span class="dir">${name}</span>` : name}`);
                });
                write(`        ${entries.length} entry(ies)`);
                break;
            }
            case 'cd': {
                if (!arg || arg === '..') { cwd = 'C:\\'; syncPrompt(); break; }
                const target = (cwd === 'C:\\' ? 'C:\\' : cwd + '\\') + arg;
                if (FS[target] && FS[target].type === 'dir') { cwd = target; syncPrompt(); }
                else write(`<span class="red">Path not found: ${arg}</span>`);
                break;
            }
            case 'cat': {
                const target = (cwd === 'C:\\' ? 'C:\\' : cwd + '\\') + arg;
                const file = FS[target] || FS[(cwd === 'C:\\' ? 'C:\\' : cwd + '\\') + arg + '\\'];
                if (file && file.type === 'file') write(file.body);
                else write(`<span class="red">File not found: ${arg}</span>`);
                break;
            }
            case 'cls':
                log.innerHTML = '';
                break;
            case 'whoami':
                write('builder. shipper. terminal dweller.');
                write('<span class="dim">(also: guy whose arch install took a weekend)</span>');
                break;
            case 'pwd':
                write(cwd);
                break;
            case 'nmap':
                write('<span class="red">[ ALARM ] unauthorized scan of production confidence</span>');
                write('<span class="dim">more sorties in the ctf log below — try ./projects first</span>');
                break;
            case 'banner':
                BANNER.forEach((l) => write(`<span class="amber">${l}</span>`));
                break;
            case 'mother':
                write('whatever man');
                break;
            case 'sudo':
                write('<span class="red">nice try.</span>');
                break;
            default:
                write(`<span class="red">'${verb}' is not recognized as an internal or external command.</span>`);
                write(`type "help"`);
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = input.value;
        input.value = '';
        exec(v);
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') { e.preventDefault(); if (histIdx < hist.length - 1) input.value = hist[++histIdx] ?? ''; }
        else if (e.key === 'ArrowDown') { e.preventDefault(); if (histIdx > -1) input.value = hist[--histIdx] ?? ''; }
    });

    boot();

    // idle animation: a fake command types itself every few seconds if untouched
    let alive = false;
    setInterval(() => {
        if (alive) return;
        alive = true;
        const ghost = ['dir', 'cat about.txt', 'whoami'][(Math.random() * 3) | 0];
        write(`<span class="dim">${esc(cwd + '>')} ${esc(ghost)}</span>`);
        execGhost(ghost);
        setTimeout(() => { alive = false; }, 2600);
    }, 14000);

    function execGhost(raw) {
        const parts = raw.split(/\s+/);
        const verb = parts[0].toLowerCase();
        const arg = parts.slice(1).join(' ');
        switch (verb) {
            case 'dir': {
                const entries = Object.keys(FS).filter((k) => k.startsWith(cwd) && k !== cwd && k.split('\\').pop() !== '');
                write(' Volume in drive C is ABEER\n' + ` Directory of ${cwd}\n`);
                entries.forEach((k) => {
                    const name = k.split('\\').pop();
                    const isDir = FS[k].type === 'dir';
                    write(`${isDir ? '<DIR>' : '     '}  ${isDir ? `<span class="dir">${name}</span>` : name}`);
                });
                break;
            }
            case 'cat': {
                const target = (cwd === 'C:\\' ? 'C:\\' : cwd + '\\') + arg;
                const file = FS[target];
                if (file && file.type === 'file') write(file.body);
                break;
            }
            case 'whoami':
                write('builder. shipper. terminal dweller.');
                break;
        }
    }
}
