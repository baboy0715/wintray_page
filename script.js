// 1. Finom, folyamatos háttér hóesés (HTML5 Canvas)
(function initSnowCanvas() {
  const canvas = document.getElementById('snow-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let flakes = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function createFlakes() {
    const count = Math.min(110, Math.max(45, Math.floor((width * height) / 16000)));
    flakes = [];
    for (let i = 0; i < count; i++) {
      flakes.push({
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

  function updateAndDraw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.angle += f.swaySpeed;
      f.y += f.speedY;
      f.x += f.speedX + Math.sin(f.angle) * f.swayAmp;

      if (f.y > height + 5) {
        f.y = -5;
        f.x = Math.random() * width;
      }
      if (f.x > width + 5) {
        f.x = -5;
      } else if (f.x < -5) {
        f.x = width + 5;
      }

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(225, 240, 255, ${f.opacity})`;
      ctx.fill();
    }

    requestAnimationFrame(updateAndDraw);
  }

  resize();
  createFlakes();
  window.addEventListener('resize', () => {
    resize();
    createFlakes();
  });
  requestAnimationFrame(updateAndDraw);
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
