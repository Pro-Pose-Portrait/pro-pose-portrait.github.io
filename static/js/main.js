document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initShowcase();
    initCharts();

    // BibTeX copy functionality
    const bibtex = document.querySelector('.bibtex');
    if (bibtex) {
        bibtex.addEventListener('click', () => {
            const text = bibtex.textContent;
            navigator.clipboard.writeText(text).then(() => {
                const orig = bibtex.style.outline;
                bibtex.style.outline = '2px solid #5e60ce';
                bibtex.style.outlineOffset = '2px';
                setTimeout(() => {
                    bibtex.style.outline = orig;
                    bibtex.style.outlineOffset = '';
                }, 800);
            });
        });
        bibtex.style.cursor = 'pointer';
        bibtex.title = 'Click to copy BibTeX';
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') showcaseNav(-1);
        else if (e.key === 'ArrowRight') showcaseNav(1);
    });
});

// =============================================
// Tab Navigation
// =============================================

function initTabs() {
    const btns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            // Update buttons
            btns.forEach(b => b.classList.remove('tab-active'));
            btn.classList.add('tab-active');

            // Update panels
            panels.forEach(p => {
                p.classList.toggle('tab-visible', p.dataset.tab === target);
            });

            // Scroll to top of content area
            const tabBar = document.getElementById('tab-bar');
            if (tabBar) {
                tabBar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
}

// =============================================
// 3D Orbit Carousel
// =============================================

const IMG_DIR_MAIN = "static/images/crops_from_qual_v6/";
const IMG_DIR_SUPPL = "static/images/crops_from_suppl_qual/";

const PAIRS = [
    // Main qualitative (10 pairs)
    { dir: IMG_DIR_MAIN, ref: "crop_27.png",  target: "crop_30.png",  outputs: ["crop_32.png","crop_35.png","crop_37.png","crop_40.png","crop_43.png","crop_46.png"] },
    { dir: IMG_DIR_MAIN, ref: "crop_77.png",  target: "crop_80.png",  outputs: ["crop_82.png","crop_85.png","crop_87.png","crop_90.png","crop_93.png","crop_96.png"] },
    { dir: IMG_DIR_MAIN, ref: "crop_127.png", target: "crop_130.png", outputs: ["crop_132.png","crop_135.png","crop_137.png","crop_140.png","crop_143.png","crop_146.png"] },
    { dir: IMG_DIR_MAIN, ref: "crop_177.png", target: "crop_180.png", outputs: ["crop_182.png","crop_185.png","crop_187.png","crop_190.png","crop_193.png","crop_196.png"] },
    { dir: IMG_DIR_MAIN, ref: "crop_227.png", target: "crop_230.png", outputs: ["crop_232.png","crop_235.png","crop_237.png","crop_240.png","crop_243.png","crop_246.png"] },
    { dir: IMG_DIR_MAIN, ref: "crop_277.png", target: "crop_280.png", outputs: ["crop_282.png","crop_285.png","crop_287.png","crop_290.png","crop_293.png","crop_296.png"] },
    { dir: IMG_DIR_MAIN, ref: "crop_327.png", target: "crop_330.png", outputs: ["crop_332.png","crop_335.png","crop_337.png","crop_340.png","crop_343.png","crop_346.png"] },
    { dir: IMG_DIR_MAIN, ref: "crop_377.png", target: "crop_380.png", outputs: ["crop_382.png","crop_385.png","crop_387.png","crop_390.png","crop_393.png","crop_396.png"] },
    { dir: IMG_DIR_MAIN, ref: "crop_427.png", target: "crop_430.png", outputs: ["crop_432.png","crop_435.png","crop_437.png","crop_440.png","crop_443.png","crop_446.png"] },
    { dir: IMG_DIR_MAIN, ref: "crop_477.png", target: "crop_480.png", outputs: ["crop_482.png","crop_485.png","crop_487.png","crop_490.png","crop_493.png","crop_496.png"] },
    // Supplemental qualitative (10 pairs)
    { dir: IMG_DIR_SUPPL, ref: "crop_1.png",   target: "crop_3.png",   outputs: ["crop_5.png","crop_7.png","crop_9.png","crop_11.png","crop_13.png","crop_15.png"] },
    { dir: IMG_DIR_SUPPL, ref: "crop_33.png",  target: "crop_35.png",  outputs: ["crop_37.png","crop_39.png","crop_41.png","crop_43.png","crop_45.png","crop_47.png"] },
    { dir: IMG_DIR_SUPPL, ref: "crop_65.png",  target: "crop_67.png",  outputs: ["crop_69.png","crop_71.png","crop_73.png","crop_75.png","crop_77.png","crop_79.png"] },
    { dir: IMG_DIR_SUPPL, ref: "crop_97.png",  target: "crop_99.png",  outputs: ["crop_101.png","crop_103.png","crop_105.png","crop_107.png","crop_109.png","crop_111.png"] },
    { dir: IMG_DIR_SUPPL, ref: "crop_129.png", target: "crop_131.png", outputs: ["crop_133.png","crop_135.png","crop_137.png","crop_139.png","crop_141.png","crop_143.png"] },
    { dir: IMG_DIR_SUPPL, ref: "crop_161.png", target: "crop_163.png", outputs: ["crop_165.png","crop_167.png","crop_169.png","crop_171.png","crop_173.png","crop_175.png"] },
    { dir: IMG_DIR_SUPPL, ref: "crop_193.png", target: "crop_195.png", outputs: ["crop_197.png","crop_199.png","crop_201.png","crop_203.png","crop_205.png","crop_207.png"] },
    { dir: IMG_DIR_SUPPL, ref: "crop_225.png", target: "crop_227.png", outputs: ["crop_229.png","crop_231.png","crop_233.png","crop_235.png","crop_237.png","crop_239.png"] },
    { dir: IMG_DIR_SUPPL, ref: "crop_257.png", target: "crop_259.png", outputs: ["crop_261.png","crop_263.png","crop_265.png","crop_267.png","crop_269.png","crop_271.png"] },
    { dir: IMG_DIR_SUPPL, ref: "crop_289.png", target: "crop_291.png", outputs: ["crop_293.png","crop_295.png","crop_297.png","crop_299.png","crop_301.png","crop_303.png"] }
];

const METHOD_NAMES = ["MCLD", "LEFFA", "UniHuman", "OnePoseTrans", "Gemini 2.5 Flash Image", "Pro-Pose"];
// Baselines cycle in col 3; Pro-Pose is fixed in col 4
const BASELINE_NAMES = METHOD_NAMES.slice(0, -1);
const CYCLE_INTERVAL = 2500;

let currentPair = 0;
let currentMethod = 0;
let isCycling = true;  // true = "All" mode, false = pinned to one method
let cycleTimer = null;
let progressTimer = null;
let progressStart = 0;
let cardElements = [];

function initShowcase() {
    const ring = document.getElementById('orbit-ring');
    if (!ring) return;

    // Build a card for each pair
    PAIRS.forEach((pair, idx) => {
        const card = document.createElement('div');
        card.className = 'orbit-card pos-hidden';
        card.dataset.pairIndex = idx;

        const inner = document.createElement('div');
        inner.className = 'orbit-card-inner';

        // Column 1: Reference
        const col1 = buildCol('Reference', pair.dir + pair.ref, 'card-col-ref');
        inner.appendChild(col1);

        // Column 2: Target Pose
        const col2 = buildCol('Target Pose', pair.dir + pair.target, 'card-col-target');
        inner.appendChild(col2);

        // Column 3: Cycling baseline outputs (first 5)
        const col3 = document.createElement('div');
        col3.className = 'card-col card-col-output';

        const label3 = document.createElement('div');
        label3.className = 'card-col-label card-method-label';
        label3.textContent = BASELINE_NAMES[0];
        col3.appendChild(label3);

        const cycleWrap = document.createElement('div');
        cycleWrap.className = 'card-img-wrap card-cycle-wrap';
        // Only first 5 outputs are baselines; index 5 is Pro-Pose
        pair.outputs.slice(0, BASELINE_NAMES.length).forEach((file, mi) => {
            const img = document.createElement('img');
            img.src = pair.dir + file;
            img.alt = BASELINE_NAMES[mi];
            img.loading = 'lazy';
            if (mi === 0) img.classList.add('cycle-active');
            cycleWrap.appendChild(img);
        });
        col3.appendChild(cycleWrap);

        inner.appendChild(col3);

        // Column 4: Pro-Pose (fixed)
        const oursFile = pair.outputs[pair.outputs.length - 1]; // last output is Pro-Pose
        const col4 = buildCol('Pro-Pose', pair.dir + oursFile, 'card-col-ours');
        inner.appendChild(col4);

        card.appendChild(inner);

        // Click side cards to navigate
        card.addEventListener('click', () => {
            if (card.classList.contains('pos-left')) showcaseNav(-1);
            else if (card.classList.contains('pos-right')) showcaseNav(1);
        });

        ring.appendChild(card);
        cardElements.push(card);
    });

    // Build indicators
    const indicatorContainer = document.getElementById('showcase-indicators');
    for (let i = 0; i < PAIRS.length; i++) {
        const dot = document.createElement('button');
        dot.className = 'orbit-dot' + (i === 0 ? ' dot-active' : '');
        dot.onclick = () => goToPair(i);
        indicatorContainer.appendChild(dot);
    }

    // Build method pills: "All" button + individual baselines (no Pro-Pose pill)
    const pillContainer = document.getElementById('showcase-methods');

    // "All" button
    const allPill = document.createElement('button');
    allPill.className = 'method-pill pill-all pill-active';
    allPill.textContent = 'All \u25B6';
    allPill.onclick = () => {
        isCycling = true;
        stopCycle();
        startCycle();
        updatePillStates(-1); // -1 = "All" active
    };
    pillContainer.appendChild(allPill);

    BASELINE_NAMES.forEach((name, idx) => {
        const pill = document.createElement('button');
        pill.className = 'method-pill';
        pill.textContent = name;
        pill.onclick = () => {
            isCycling = false;
            stopCycle();
            showMethod(idx);
            updatePillStates(idx);
        };
        pillContainer.appendChild(pill);
    });

    // Initial layout + start cycling
    layoutCards();
    startCycle();
}

function buildCol(labelText, imgSrc, extraClass) {
    const col = document.createElement('div');
    col.className = 'card-col ' + extraClass;

    const label = document.createElement('div');
    label.className = 'card-col-label';
    label.textContent = labelText;
    col.appendChild(label);

    const wrap = document.createElement('div');
    wrap.className = 'card-img-wrap';

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = labelText;
    img.loading = 'lazy';
    wrap.appendChild(img);

    col.appendChild(wrap);
    return col;
}

// Position all cards based on which pair is current
function layoutCards() {
    const n = PAIRS.length;
    cardElements.forEach((card, idx) => {
        // Remove all position classes
        card.classList.remove('pos-center', 'pos-left', 'pos-right', 'pos-far-left', 'pos-far-right', 'pos-hidden');

        const offset = ((idx - currentPair) % n + n) % n; // 0..n-1 wrapped
        // Map offset to position: 0=center, 1=right, n-1=left, 2=far-right, n-2=far-left
        if (offset === 0) {
            card.classList.add('pos-center');
        } else if (offset === 1) {
            card.classList.add('pos-right');
        } else if (offset === n - 1) {
            card.classList.add('pos-left');
        } else if (offset === 2) {
            card.classList.add('pos-far-right');
        } else if (offset === n - 2) {
            card.classList.add('pos-far-left');
        } else {
            card.classList.add('pos-hidden');
        }
    });

    // Update indicators
    document.querySelectorAll('.orbit-dot').forEach((dot, i) => {
        dot.classList.toggle('dot-active', i === currentPair);
    });
}

// Show a specific baseline method across ALL cards
function showMethod(methodIdx) {
    currentMethod = methodIdx;

    cardElements.forEach(card => {
        const imgs = card.querySelectorAll('.card-cycle-wrap img');
        imgs.forEach((img, i) => {
            img.classList.toggle('cycle-active', i === methodIdx);
        });
        const label = card.querySelector('.card-method-label');
        if (label) label.textContent = BASELINE_NAMES[methodIdx];
    });

    resetProgress();
}

function updatePillStates(activeIdx) {
    // activeIdx: -1 = All, 0..4 = specific baseline
    const pills = document.querySelectorAll('.method-pill');
    pills.forEach((pill, i) => {
        if (i === 0) {
            // "All" button is index 0
            pill.classList.toggle('pill-active', activeIdx === -1);
        } else {
            pill.classList.toggle('pill-active', (i - 1) === activeIdx);
        }
    });
}

function startCycle() {
    stopCycle();
    if (!isCycling) return;
    progressStart = performance.now();
    animateProgress();

    cycleTimer = setInterval(() => {
        showMethod((currentMethod + 1) % BASELINE_NAMES.length);
    }, CYCLE_INTERVAL);
}

function stopCycle() {
    if (cycleTimer) { clearInterval(cycleTimer); cycleTimer = null; }
    if (progressTimer) { cancelAnimationFrame(progressTimer); progressTimer = null; }
}

function resetProgress() {
    progressStart = performance.now();
    const fill = document.getElementById('showcase-progress-fill');
    if (fill) fill.style.width = isCycling ? '0%' : '0%';
    // Hide progress bar when pinned
    const bar = document.getElementById('showcase-progress');
    if (bar) bar.style.opacity = isCycling ? '1' : '0';
}

function animateProgress() {
    const fill = document.getElementById('showcase-progress-fill');
    if (!fill) return;

    function tick() {
        const elapsed = performance.now() - progressStart;
        const pct = Math.min((elapsed / CYCLE_INTERVAL) * 100, 100);
        fill.style.width = pct + '%';
        progressTimer = requestAnimationFrame(tick);
    }
    tick();
}

function goToPair(index) {
    if (index === currentPair) return;
    currentPair = index;
    layoutCards();
}

window.showcaseNav = function(direction) {
    let next = currentPair + direction;
    const n = PAIRS.length;
    if (next < 0) next = n - 1;
    else if (next >= n) next = 0;
    goToPair(next);
};

// =============================================
// Quantitative Results — Table-style Bar Charts
// =============================================

const CHART_DATA = {
    deepfashion: {
        metrics: [
            { name: "PSNR", dir: "up" },
            { name: "FID", dir: "down" },
            { name: "SSIM", dir: "up" },
            { name: "LPIPS", dir: "down" },
            { name: "OKS", dir: "up" },
            { name: "FaceSim", dir: "up" },
            { name: "DINO", dir: "up" },
            { name: "HPSv3", dir: "up" }
        ],
        methods: [
            { name: "CFLD",                   v: [17.65, 7.15, 0.748, 0.182, 0.48, 0.3180, 0.9731, 4.15] },
            { name: "MCLD",                   v: [18.21, 7.08, 0.756, 0.176, 0.49, 0.3440, 0.9654, 4.29] },
            { name: "LEFFA",                  v: [14.02, 4.23, 0.755, 0.119, 0.44, 0.5794, 0.9409, 4.41] },
            { name: "OnePoseTrans",           v: [13.57, 8.74, 0.605, 0.307, 0.46, 0.5750, 0.9476, 4.32] },
            { name: "UniHuman",               v: [14.05, 6.25, 0.796, 0.156, 0.46, 0.5810, 0.9434, 4.03] },
            { name: "Gemini 2.5 Flash Image", v: [16.98, 4.59, 0.738, 0.179, 0.43, 0.5815, 0.9691, 7.19] },
            { name: "Pro-Pose",               v: [19.36, 4.24, 0.818, 0.075, 0.48, 0.6047, 0.9759, 7.24] }
        ]
    },
    wpose: {
        metrics: [
            { name: "M-PSNR", dir: "up" },
            { name: "FID", dir: "down" },
            { name: "M-SSIM", dir: "up" },
            { name: "M-LPIPS", dir: "down" },
            { name: "OKS", dir: "up" },
            { name: "FaceSim", dir: "up" },
            { name: "DINO", dir: "up" },
            { name: "HPSv3", dir: "up" }
        ],
        methods: [
            { name: "CFLD",                   v: [15.43, 96.07, 0.744, 0.208, 0.31, 0.0885, 0.6412, 1.94] },
            { name: "MCLD",                   v: [15.64, 94.23, 0.759, 0.201, 0.35, 0.0995, 0.6478, 1.96] },
            { name: "LEFFA",                  v: [16.71, 67.85, 0.776, 0.193, 0.32, 0.0914, 0.5725, 2.01] },
            { name: "OnePoseTrans",           v: [17.23, 27.43, 0.818, 0.151, 0.33, 0.1735, 0.7205, 4.44] },
            { name: "UniHuman",               v: [17.64, 27.75, 0.807, 0.161, 0.34, 0.1121, 0.7207, 2.89] },
            { name: "Gemini 2.5 Flash Image", v: [16.67, 9.55, 0.779, 0.149, 0.32, 0.4713, 0.7005, 7.35] },
            { name: "Pro-Pose",               v: [19.95, 5.99, 0.860, 0.121, 0.38, 0.5571, 0.7394, 7.55] }
        ]
    }
};

let activeDataset = 'wpose';

function initCharts() {
    renderCharts(activeDataset);
}

window.switchDataset = function(key) {
    if (key === activeDataset) return;
    activeDataset = key;

    document.querySelectorAll('.dataset-tab').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(
            key === 'deepfashion' ? 'deepfashion' : 'wpose'
        ));
    });

    renderCharts(key);
};

function renderCharts(datasetKey) {
    const ds = CHART_DATA[datasetKey];
    const container = document.getElementById('charts-container');
    if (!container) return;
    container.innerHTML = '';

    const methodNames = ds.methods.map(m => m.name);
    const metricsPerRow = 4;

    // Split metrics into rows of 4
    for (let rowStart = 0; rowStart < ds.metrics.length; rowStart += metricsPerRow) {
        const rowMetrics = ds.metrics.slice(rowStart, rowStart + metricsPerRow);

        const row = document.createElement('div');
        row.className = 'chart-row';

        // Method labels column
        const methodsCol = document.createElement('div');
        methodsCol.className = 'chart-methods';
        methodNames.forEach(name => {
            const label = document.createElement('div');
            label.className = 'chart-method-label';
            if (name === 'Pro-Pose') label.classList.add('method-ours');
            label.textContent = name;
            methodsCol.appendChild(label);
        });
        row.appendChild(methodsCol);

        // One column per metric
        rowMetrics.forEach((metric, colIdx) => {
            const mi = rowStart + colIdx;  // global metric index
            const col = document.createElement('div');
            col.className = 'metric-col';

            // Header
            const header = document.createElement('div');
            header.className = 'metric-col-header';
            const arrow = metric.dir === 'up' ? '↑' : '↓';
            const arrowClass = metric.dir === 'up' ? 'arrow-up' : 'arrow-down';
            header.innerHTML = `${metric.name} <span class="${arrowClass}">${arrow}</span>`;
            col.appendChild(header);

            // Get all values for this metric to find min/max and best
            const lowerBetter = metric.dir === 'down';
            const allVals = ds.methods.map(m => m.v[mi]);
            const mn = Math.min(...allVals);
            const mx = Math.max(...allVals);
            const bestVal = lowerBetter ? mn : mx;

            // One bar per method (same order for all metrics)
            ds.methods.forEach(m => {
                const value = m.v[mi];
                const barRow = document.createElement('div');
                barRow.className = 'metric-bar-row';

                const track = document.createElement('div');
                track.className = 'metric-bar-track';

                const fill = document.createElement('div');
                fill.className = 'metric-bar-fill';

                // Width: proportional to value (bigger value = bigger bar)
                let pct;
                if (mx === 0) {
                    pct = 50;
                } else {
                    pct = (value / mx) * 65 + 35;
                }

                const isOurs = m.name === 'Pro-Pose';
                const isBest = value === bestVal;

                if (isOurs) fill.classList.add('fill-ours');
                if (isBest) fill.classList.add('fill-best');

                // Value label
                const val = document.createElement('span');
                val.className = 'metric-bar-val';
                val.textContent = formatValue(value);

                track.appendChild(fill);
                track.appendChild(val);
                barRow.appendChild(track);
                col.appendChild(barRow);

                // Animate
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        fill.style.width = pct + '%';
                    });
                });
            });

            row.appendChild(col);
        });

        container.appendChild(row);
    }
}

function formatValue(v) {
    if (v >= 10) return v % 1 === 0 ? v.toString() : v.toFixed(2);
    if (v >= 1) return v.toFixed(2);
    return v.toFixed(4);
}

