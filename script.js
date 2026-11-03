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

// 2. Automatikus verzió- és frissítési jegyzék betöltés (releases/releases.json)
(async function loadReleases() {
  const mainBtn = document.getElementById('main-download-btn');
  const versionInfo = document.getElementById('current-version-info');
  const changelogContainer = document.getElementById('changelog-list');

  try {
    const response = await fetch('releases/releases.json', { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const releases = Array.isArray(data.releases) ? data.releases : [];
    const latest = data.latest || releases[0] || null;

    if (!latest) {
      versionInfo.textContent = 'Jelenleg nincs feltöltött telepítő a releases/ mappában.';
      changelogContainer.innerHTML = '<p class="loading-text">Még nincs elérhető kiadás.</p>';
      return;
    }

    // Fő letöltés gomb frissítése a legújabb verzióra
    mainBtn.href = latest.url;
    mainBtn.setAttribute('download', latest.file);
    versionInfo.textContent = `Aktuális verzió: ${latest.version} (${latest.file}) • Windows telepítő (.exe)`;

    // Frissítési jegyzék felépítése
    changelogContainer.innerHTML = '';
    releases.forEach((rel, index) => {
      const item = document.createElement('div');
      item.className = 'changelog-item';

      const header = document.createElement('div');
      header.className = 'changelog-header';

      const titleWrap = document.createElement('div');
      titleWrap.className = 'changelog-title';

      const verSpan = document.createElement('span');
      verSpan.className = 'changelog-version';
      verSpan.textContent = `WinterTray ${rel.version}`;
      titleWrap.appendChild(verSpan);

      if (index === 0) {
        const latestBadge = document.createElement('span');
        latestBadge.className = 'changelog-latest-tag';
        latestBadge.textContent = 'Legújabb';
        titleWrap.appendChild(latestBadge);
      }

      const dlLink = document.createElement('a');
      dlLink.className = 'changelog-download';
      dlLink.href = rel.url;
      dlLink.setAttribute('download', rel.file);
      dlLink.textContent = `${rel.file} letöltése`;

      header.appendChild(titleWrap);
      header.appendChild(dlLink);
      item.appendChild(header);

      if (Array.isArray(rel.changes) && rel.changes.length > 0) {
        const ul = document.createElement('ul');
        ul.className = 'changelog-changes';
        rel.changes.forEach(changeText => {
          const li = document.createElement('li');
          li.textContent = changeText;
          ul.appendChild(li);
        });
        item.appendChild(ul);
      } else {
        const emptyNote = document.createElement('p');
        emptyNote.className = 'loading-text';
        emptyNote.textContent = 'Nincs megadva részletes változáslista ehhez a verzióhoz.';
        item.appendChild(emptyNote);
      }

      changelogContainer.appendChild(item);
    });
  } catch (err) {
    versionInfo.textContent = 'Nem sikerült betölteni a verzióinformációkat.';
    changelogContainer.innerHTML = '<p class="loading-text">A frissítési jegyzék jelenleg nem érhető el.</p>';
  }
})();
