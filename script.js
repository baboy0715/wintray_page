// 1. Évszak-választó (Season Switcher) és Háttér Canvas (Téli hóesés / Őszi falevelek + eső)
(function initSeasonAndCanvas() {
  const htmlEl = document.documentElement;
  const metaTheme = document.getElementById('meta-theme-color');
  const seasonBtns = document.querySelectorAll('[data-season-target]');
  const bullets = document.querySelectorAll('.feature-list .bullet');
  const canvas = document.getElementById('snow-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let currentSeason = localStorage.getItem('wintertray_season') || 'winter';
  let width = 0;
  let height = 0;

  // Téli részecskék (hópelyhek)
  let snowflakes = [];

  // Őszi részecskék (falevelek, esőcseppek, mikrocsobbanások)
  let leaves = [];
  let raindrops = [];
  let ripples = [];

  const autumnPalette = [
    { fill: '#e86f2c', stroke: '#9e3e0e' }, // Narancs
    { fill: '#d99b26', stroke: '#8c5d0b' }, // Aranybarna
    { fill: '#c93b2b', stroke: '#7a1c12' }, // Vörös
    { fill: '#f2a63b', stroke: '#a66612' }  // Alkonyat / Borostyán
  ];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function createWinterParticles() {
    const count = Math.min(110, Math.max(45, Math.floor((width * height) / 16000)));
    snowflakes = [];
    for (let i = 0; i < count; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 + 0.8,
        speedY: Math.random() * 0.65 + 0.3,
        speedX: (Math.random() - 0.5) * 0.35,
        swayAmp: Math.random() * 0.4 + 0.1,
        swaySpeed: Math.random() * 0.015 + 0.005,
        angle: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.45 + 0.2
      });
    }
  }

  function createAutumnParticles() {
    const leafCount = Math.min(42, Math.max(18, Math.floor((width * height) / 42000)));
    const rainCount = Math.min(65, Math.max(28, Math.floor((width * height) / 26000)));

    leaves = [];
    for (let i = 0; i < leafCount; i++) {
      leaves.push(makeLeaf(Math.random() * height));
    }

    raindrops = [];
    for (let i = 0; i < rainCount; i++) {
      raindrops.push(makeRaindrop(Math.random() * height));
    }

    ripples = [];
  }

  function makeLeaf(initialY) {
    const color = autumnPalette[Math.floor(Math.random() * autumnPalette.length)];
    return {
      x: Math.random() * width,
      y: initialY !== undefined ? initialY : -20,
      size: Math.random() * 6 + 7.5,
      type: Math.floor(Math.random() * 3), // 0: nyír, 1: tölgy, 2: juhar
      color: color,
      speedY: Math.random() * 0.75 + 0.45,
      speedX: Math.random() * 0.45 + 0.1,
      swayAmp: Math.random() * 0.9 + 0.35,
      swaySpeed: Math.random() * 0.018 + 0.008,
      swayAngle: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.022,
      flipAngle: Math.random() * Math.PI * 2,
      flipSpeed: Math.random() * 0.02 + 0.008,
      opacity: Math.random() * 0.35 + 0.5
    };
  }

  function makeRaindrop(initialY) {
    return {
      x: Math.random() * width,
      y: initialY !== undefined ? initialY : -30,
      length: Math.random() * 14 + 10,
      speedY: Math.random() * 5.5 + 7.5,
      speedX: 1.6,
      opacity: Math.random() * 0.18 + 0.08
    };
  }

  function drawLeafShape(ctx, type, s) {
    ctx.beginPath();
    if (type === 0) {
      // Nyírlevél (csepp/ovális forma)
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(s * 0.85, -s * 0.2, 0, s);
      ctx.quadraticCurveTo(-s * 0.85, -s * 0.2, 0, -s);
    } else if (type === 1) {
      // Tölgyfalevél (hullámos/karéjos)
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.6, -s * 0.8, s * 0.9, -s * 0.2, s * 0.45, s * 0.15);
      ctx.bezierCurveTo(s * 0.8, s * 0.45, s * 0.4, s * 0.85, 0, s);
      ctx.bezierCurveTo(-s * 0.4, s * 0.85, -s * 0.8, s * 0.45, -s * 0.45, s * 0.15);
      ctx.bezierCurveTo(-s * 0.9, -s * 0.2, -s * 0.6, -s * 0.8, 0, -s);
    } else {
      // Juharlevél (csúcsos csillagszerű)
      ctx.moveTo(0, -s * 1.05);
      ctx.lineTo(s * 0.32, -s * 0.35);
      ctx.lineTo(s * 0.95, -s * 0.45);
      ctx.lineTo(s * 0.5, s * 0.1);
      ctx.lineTo(s * 0.72, s * 0.65);
      ctx.lineTo(0, s * 0.45);
      ctx.lineTo(-s * 0.72, s * 0.65);
      ctx.lineTo(-s * 0.5, s * 0.1);
      ctx.lineTo(-s * 0.95, -s * 0.45);
      ctx.lineTo(-s * 0.32, -s * 0.35);
      ctx.closePath();
    }
    ctx.fill();
    ctx.lineWidth = 0.7;
    ctx.stroke();

    // Levélnyél és főér
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.6);
    ctx.lineTo(0, s * 1.25);
    ctx.stroke();
  }

  function updateAndDrawWinter() {
    for (let i = 0; i < snowflakes.length; i++) {
      const f = snowflakes[i];
      f.angle += f.swaySpeed;
      f.y += f.speedY;
      f.x += f.speedX + Math.sin(f.angle) * f.swayAmp;

      if (f.y > height + 5) {
        f.y = -5;
        f.x = Math.random() * width;
      }
      if (f.x > width + 5) f.x = -5;
      else if (f.x < -5) f.x = width + 5;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(225, 240, 255, ${f.opacity})`;
      ctx.fill();
    }
  }

  function updateAndDrawAutumn() {
    // 1. Esőcseppek
    ctx.lineWidth = 1.1;
    for (let i = 0; i < raindrops.length; i++) {
      const r = raindrops[i];
      r.y += r.speedY;
      r.x += r.speedX;

      ctx.beginPath();
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(r.x - r.speedX * 1.6, r.y - r.length);
      ctx.strokeStyle = `rgba(245, 205, 165, ${r.opacity})`;
      ctx.stroke();

      if (r.y > height - 6) {
        if (Math.random() < 0.28 && ripples.length < 18) {
          ripples.push({
            x: r.x,
            y: height - Math.random() * 14 - 2,
            rx: 1,
            maxRx: Math.random() * 10 + 7,
            alpha: 0.32
          });
        }
        r.y = -20;
        r.x = Math.random() * width;
      }
      if (r.x > width + 20) {
        r.x = -10;
      }
    }

    // 2. Mikrocsobbanások (ripples)
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.rx += 0.35;
      rp.alpha -= 0.012;
      if (rp.alpha <= 0 || rp.rx >= rp.maxRx) {
        ripples.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.ellipse(rp.x, rp.y, rp.rx, rp.rx * 0.32, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(245, 185, 120, ${rp.alpha})`;
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }

    // 3. Hulló őszi falevelek
    for (let i = 0; i < leaves.length; i++) {
      const lf = leaves[i];
      lf.swayAngle += lf.swaySpeed;
      lf.rotation += lf.rotSpeed;
      lf.flipAngle += lf.flipSpeed;

      lf.y += lf.speedY;
      lf.x += lf.speedX + Math.sin(lf.swayAngle) * lf.swayAmp;

      if (lf.y > height + 25) {
        Object.assign(lf, makeLeaf(-20));
      }
      if (lf.x > width + 25) lf.x = -20;
      else if (lf.x < -25) lf.x = width + 20;

      ctx.save();
      ctx.translate(lf.x, lf.y);
      ctx.rotate(lf.rotation);
      const scaleY = 0.55 + Math.abs(Math.cos(lf.flipAngle)) * 0.45;
      ctx.scale(1, scaleY);
      ctx.globalAlpha = lf.opacity;
      ctx.fillStyle = lf.color.fill;
      ctx.strokeStyle = lf.color.stroke;
      drawLeafShape(ctx, lf.type, lf.size);
      ctx.restore();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    if (currentSeason === 'autumn') {
      updateAndDrawAutumn();
    } else {
      updateAndDrawWinter();
    }
    requestAnimationFrame(animate);
  }

  function applySeason(season) {
    currentSeason = season === 'autumn' ? 'autumn' : 'winter';
    htmlEl.setAttribute('data-season', currentSeason);
    localStorage.setItem('wintertray_season', currentSeason);

    if (metaTheme) {
      metaTheme.setAttribute('content', currentSeason === 'autumn' ? '#140c07' : '#070d19');
    }

    seasonBtns.forEach(btn => {
      const isMatch = btn.getAttribute('data-season-target') === currentSeason;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });

    bullets.forEach(b => {
      b.textContent = currentSeason === 'autumn'
        ? (b.getAttribute('data-autumn-bullet') || '🍂')
        : (b.getAttribute('data-winter-bullet') || '❄');
    });
  }

  seasonBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applySeason(btn.getAttribute('data-season-target'));
    });
  });

  resize();
  createWinterParticles();
  createAutumnParticles();
  applySeason(currentSeason);

  window.addEventListener('resize', () => {
    resize();
    createWinterParticles();
    createAutumnParticles();
  });

  requestAnimationFrame(animate);
})();

// 2. OptiFine-stílusú kompakt verziólista és leugró változásjegyzék
(async function loadReleases() {
  const mainBtn = document.getElementById('main-download-btn');
  const versionInfo = document.getElementById('current-version-info');
  const wrapper = document.getElementById('releases-wrapper');

  function renderReleaseRow(rel, isLatest) {
    const card = document.createElement('div');
    card.className = 'release-card-row';

    // Fő vízszintes sáv (OptiFine stílus)
    const mainBar = document.createElement('div');
    mainBar.className = 'release-main-bar';

    const leftInfo = document.createElement('div');
    leftInfo.className = 'release-info-left';

    const name = document.createElement('span');
    name.className = 'release-name';
    name.textContent = `WinterTray ${rel.version}`;
    leftInfo.appendChild(name);

    if (isLatest) {
      const badge = document.createElement('span');
      badge.className = 'badge-latest';
      badge.textContent = 'Legújabb';
      leftInfo.appendChild(badge);
    }

    if (rel.date) {
      const date = document.createElement('span');
      date.className = 'release-date';
      date.textContent = rel.date;
      leftInfo.appendChild(date);
    }

    const rightActions = document.createElement('div');
    rightActions.className = 'release-actions-right';

    // Letöltés gomb
    const dlBtn = document.createElement('a');
    dlBtn.className = 'btn-optifine-download';
    dlBtn.href = rel.url;
    dlBtn.setAttribute('download', rel.file);
    dlBtn.innerHTML = `<span>Letöltés (.exe)</span>`;

    // Változások lenyitása gomb (leugró ablak/fiók)
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn-toggle-changelog';
    toggleBtn.type = 'button';
    toggleBtn.innerHTML = `<span>Változások</span> <span class="arrow">▼</span>`;

    rightActions.appendChild(dlBtn);
    rightActions.appendChild(toggleBtn);

    mainBar.appendChild(leftInfo);
    mainBar.appendChild(rightActions);
    card.appendChild(mainBar);

    // Lenyíló változáslista rész
    const drawer = document.createElement('div');
    drawer.className = 'release-changelog-drawer';

    if (Array.isArray(rel.changes) && rel.changes.length > 0) {
      const ul = document.createElement('ul');
      ul.className = 'changelog-changes';
      rel.changes.forEach(changeText => {
        const li = document.createElement('li');
        li.textContent = changeText;
        ul.appendChild(li);
      });
      drawer.appendChild(ul);
    } else {
      const p = document.createElement('p');
      p.className = 'loading-text';
      p.textContent = 'Nincs megadva részletes változás ehhez a kiadáshoz.';
      drawer.appendChild(p);
    }

    card.appendChild(drawer);

    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
    });

    return card;
  }

  try {
    const response = await fetch('releases/releases.json', { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const releases = Array.isArray(data.releases) ? data.releases : [];
    const latest = data.latest || releases[0] || null;

    if (!latest) {
      versionInfo.textContent = 'Jelenleg nincs elérhető telepítő.';
      wrapper.innerHTML = '<p class="loading-text">Még nincs feltöltött kiadás.</p>';
      return;
    }

    // Fő Hero gomb beállítása
    mainBtn.href = latest.url;
    mainBtn.setAttribute('download', latest.file);
    versionInfo.textContent = `Legújabb: ${latest.version} (${latest.file}) • Windows telepítő (.exe)`;

    wrapper.innerHTML = '';

    // 1. Csak a legújabb verzió jelenik meg kiemelve
    const latestCard = renderReleaseRow(latest, true);
    wrapper.appendChild(latestCard);

    // 2. Ha vannak régebbi verziók, "+ Korábbi verziók megjelenítése" leugró alá kerülnek
    const olderReleases = releases.slice(1);
    if (olderReleases.length > 0) {
      const toggleContainer = document.createElement('div');
      toggleContainer.className = 'toggle-older-container';

      const showOlderBtn = document.createElement('button');
      showOlderBtn.className = 'btn-show-all-versions';
      showOlderBtn.type = 'button';
      showOlderBtn.textContent = `+ Korábbi verziók megjelenítése (${olderReleases.length})`;

      const olderList = document.createElement('div');
      olderList.className = 'older-releases-list';

      olderReleases.forEach(rel => {
        olderList.appendChild(renderReleaseRow(rel, false));
      });

      showOlderBtn.addEventListener('click', () => {
        const isOpen = olderList.classList.toggle('open');
        showOlderBtn.textContent = isOpen
          ? `- Korábbi verziók elrejtése`
          : `+ Korábbi verziók megjelenítése (${olderReleases.length})`;
      });

      toggleContainer.appendChild(showOlderBtn);
      wrapper.appendChild(toggleContainer);
      wrapper.appendChild(olderList);
    }

  } catch (err) {
    versionInfo.textContent = 'Nem sikerült betölteni a verziókat.';
    wrapper.innerHTML = '<p class="loading-text">A kiadások listája jelenleg nem érhető el.</p>';
  }
})();
