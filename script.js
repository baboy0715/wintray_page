// ========================================================
// 1. Évszak- és Nyelvkezelés (Season & Language State)
// ========================================================

function safeGetStorage(key, defaultVal) {
  try {
    return localStorage.getItem(key) || defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function safeSetStorage(key, val) {
  try {
    localStorage.setItem(key, val);
  } catch (e) {}
}

let currentSeason = safeGetStorage('wintertray_season', 'winter');
// Alapértelmezetten angol (en)
let currentLang = safeGetStorage('wintertray_lang', 'en');

// ========================================================
// 2. Szótár (i18n Dictionary)
// ========================================================

const i18n = {
  en: {
    pageTitle: 'WinterTray – Winter Desktop Snow & Autumn Leaves for Windows 10 & 11',
    metaDesc: 'Lightweight system tray desktop snow and autumn atmosphere app for Windows 10 and Windows 11. Real-time window edge accumulation, icicles, falling leaves, and rain. Download free!',
    ogTitle: 'WinterTray – Winter Desktop Snow & Autumn Leaves for Windows 10 & 11',
    ogDesc: 'Realistic 120 FPS desktop snowfall, icicles, autumn leaf fall, and rain for Windows 10 & 11. Download the official installer!',
    seasonWinter: 'Winter',
    seasonAutumn: 'Autumn',
    seasonNewBadge: 'NEW',
    heroBadgeWinter: 'Windows 10 / 11 (64-bit) • Winter & Autumn Edition ❄️',
    heroBadgeAutumn: 'Windows 10 / 11 (64-bit) • Autumn & Winter Edition 🍂',
    heroLead: 'Lightweight system tray winter and autumn desktop atmosphere app for Windows 10 and Windows 11. Tracks open windows in real-time, forming natural snow layers and icicles, or falling leaves and raindrops in autumn mode.',
    downloadBtn: 'Download Installer',
    feedbackHeroBtn: 'Leave Feedback / Report Bug',
    versionPrefix: 'Latest:',
    versionSuffix: '• Windows Installer (.exe)',
    smartScreenBtn: 'Seeing "Windows protected your PC" blue popup?',
    smartScreenBadge: '100% Safe & Clean',
    smartScreenDesc: '<strong>WinterTray</strong> is an independent, open-source project. Microsoft Defender SmartScreen automatically displays this blue protection warning for newly released software that does not yet possess an expensive annual corporate code-signing certificate.',
    smartScreenTitle: 'Quick 2-click solution to start the installation:',
    smartScreenStep1: 'Click the underlined <strong>"More info"</strong> link in the blue window.',
    smartScreenStep2: 'Click the <strong>"Run anyway"</strong> button that appears in the bottom right corner.',
    demoStep1: '1. More info',
    demoStep2: '2. Run anyway',
    releasesHeading: 'Downloads & Releases',
    badgeLatest: 'Latest',
    dlBtnText: 'Download (.exe)',
    changelogBtn: 'Changelog',
    showOlderBtn: count => `+ Show older releases (${count})`,
    hideOlderBtn: '- Hide older releases',
    noReleasesText: 'No releases available yet.',
    noChangesText: 'No detailed changelog provided for this release.',
    featuresHeading: 'Key Features',
    feature1: '<strong>Winter & Autumn Season Modes:</strong> Seamlessly switch between winter snowfall and cozy autumn atmosphere from the system tray menu, featuring automated desktop wallpaper switching.',
    feature2: '<strong>Realistic Leaf Fall & Autumn Rain:</strong> 3 distinct leaf types (birch, oak, maple) across 4 autumn color tones, accompanied by gentle slanted raindrops and ripple splash effects.',
    feature3: '<strong>Realistic 120 FPS Desktop Snow:</strong> Multiple snowflake styles, wind physics, optional snow thickness limit removal, and growing icicles that shatter on click.',
    feature4: '<strong>Physical Window Accumulation & Cursor Sweep:</strong> Snow and leaves settle realistically on top of open window frames and the taskbar, scattering when windows move or swept with your mouse cursor.',
    feature5: '<strong>Multi-language & 0% Background Gaming Impact:</strong> English and Hungarian system tray settings, smooth 120 FPS fade-outs, and automatic suspension during full-screen apps and games.',
    specsHeading: 'System Requirements',
    specOsLabel: 'Operating System',
    specOsValue: 'Windows 10 or Windows 11 (64-bit)',
    specRuntimeLabel: 'Framework',
    specRuntimeValue: '.NET 8.0 (Built-in Self-Contained, no extra install needed)',
    specResourceLabel: 'Resource Usage',
    specResourceValue: 'Minimal CPU/GPU usage (Hardware accelerated)',
    feedbackBadge: 'Your Feedback Matters!',
    feedbackHeading: 'Feedback & Bug Report',
    feedbackOpenNewTab: 'Open in new tab ↗',
    feedbackIntro: 'Please share your impressions, suggest new features, or report any bugs to help us make WinterTray even better!',
    floatingFeedbackText: 'Feedback / Bug Report',
    footerText: 'WinterTray · Winter & Autumn Windows Desktop Atmosphere Application',
    videoTitle: 'WinterTray – Showcase & Installation Guide',
    videoHeroBtn: 'Video Demo',
    videoMinimizeTitle: 'Minimize to corner',
    videoExpandTitle: 'Expand to fullscreen',
    videoCloseTitle: 'Close video'
  },
  hu: {
    pageTitle: 'WinterTray – Téli hóesés és Őszi falevélhullás Windows 10 és 11 rendszerekre',
    metaDesc: 'Könnyed, tálcáról futó téli és őszi asztali hangulat-alkalmazás Windows 10 és Windows 11 rendszerekre. Valós időben követi a nyitott ablakokat természetes hóréteggel, jégcsapokkal, hulló falevelekkel és esővel.',
    ogTitle: 'WinterTray – Téli hóesés és Őszi falevélhullás Windows 10 és 11 rendszerekre',
    ogDesc: 'Valósághű, 120 FPS-es asztali hóesés, jégcsapok, valamint őszi falevélhullás és esőzés Windows 10 és 11-re. Töltsd le a hivatalos telepítőt!',
    seasonWinter: 'Tél',
    seasonAutumn: 'Ősz',
    seasonNewBadge: 'ÚJ',
    heroBadgeWinter: 'Windows 10 / 11 (64-bit) • Téli és Őszi kiadás ❄️',
    heroBadgeAutumn: 'Windows 10 / 11 (64-bit) • Őszi és Téli kiadás 🍂',
    heroLead: 'Könnyed, tálcáról (system tray) futó téli és őszi asztali hangulat-alkalmazás Windows 10 és Windows 11 rendszerekre. Valós időben követi a nyitott ablakokat, amelyek tetején természetes hóréteg és jégcsapok, vagy őszi módban hulló falevelek és esőcseppek képződnek.',
    downloadBtn: 'Telepítő letöltése',
    feedbackHeroBtn: 'Véleményt írok / Hibát jelentek',
    versionPrefix: 'Legújabb:',
    versionSuffix: '• Windows telepítő (.exe)',
    smartScreenBtn: '„A Windows megvédte a számítógépét” ablak jelenik meg?',
    smartScreenBadge: '100% Biztonságos & Kártevőmentes',
    smartScreenDesc: 'A <strong>WinterTray</strong> egy független, nyílt forráskódú fejlesztés. A Windows Defender SmartScreen minden olyan frissen kiadott telepítőnél automatikusan megjeleníti ezt a kék védelmi ablakot, amely még nem rendelkezik évi többszázezer forintos nagyvállalati digitális tanúsítvánnyal.',
    smartScreenTitle: 'Megoldás 2 kattintással a telepítés elindításához:',
    smartScreenStep1: 'Kattints a kék ablakban az aláhúzott <strong>„További információ”</strong> linkre.',
    smartScreenStep2: 'Kattints a jobb alsó sarokban megjelenő <strong>„Futtatás mindenképpen”</strong> gombra.',
    demoStep1: '1. További információ',
    demoStep2: '2. Futtatás mindenképpen',
    releasesHeading: 'Letöltések és Verziók',
    badgeLatest: 'Legújabb',
    dlBtnText: 'Letöltés (.exe)',
    changelogBtn: 'Változások',
    showOlderBtn: count => `+ Korábbi verziók megjelenítése (${count})`,
    hideOlderBtn: '- Korábbi verziók elrejtése',
    noReleasesText: 'Még nincs feltöltött kiadás.',
    noChangesText: 'Nincs megadva részletes változás ehhez a kiadáshoz.',
    featuresHeading: 'Főbb funkciók',
    feature1: '<strong>Téli és Őszi évszak mód:</strong> Egyetlen kattintással váltható téli havazás és őszi hangulat a tálcamenüből, automatikus asztali háttérkép-váltással.',
    feature2: '<strong>Szinuszos falevélhullás és őszi esőzés:</strong> 3 egyedi levélfajta (juhar, tölgy, nyír) 4 őszi színárnyalatban, finom dőlt esőcsíkokkal és mikrocsobbanó (ripple) effekttel.',
    feature3: '<strong>Valósághű, 120 FPS-es asztali hóesés:</strong> Több hópehely-stílus, szél-effekt, kikapcsolható hóvastagság-korlát, valamint növekvő, kattintással széttörhető jégcsapok.',
    feature4: '<strong>Fizikai ablakra tapadás és lesöprés:</strong> A hó és a falevelek a nyitott ablakok felső peremén és a tálcán ülnek meg, ablakmozgatáskor lehullanak, az egérkurzorral pedig lesöpörhetők.',
    feature5: '<strong>Többnyelvű beállítások és 0% játékterhelés:</strong> Angol és magyar nyelvű tálcamenü, analóg 120 FPS-es elhalványulás és automatikus szüneteltetés teljes képernyős alkalmazásoknál.',
    specsHeading: 'Rendszerkövetelmények',
    specOsLabel: 'Operációs rendszer',
    specOsValue: 'Windows 10 vagy Windows 11 (64-bit)',
    specRuntimeLabel: 'Keretrendszer',
    specRuntimeValue: '.NET 8.0 (Beépítve a telepítőbe, nem igényel külön telepítést)',
    specResourceLabel: 'Erőforrásigény',
    specResourceValue: 'Minimális CPU/GPU használat (hardveresen gyorsított megjelenítés)',
    feedbackBadge: 'Fontos a véleményed!',
    feedbackHeading: 'Visszajelzés és Hibabejelentés',
    feedbackOpenNewTab: 'Megnyitás külön lapon ↗',
    feedbackIntro: 'Kérlek, oszd meg a tapasztalataidat, ötleteidet vagy jelentsd be a hibákat, hogy még jobbá tehessük a WinterTray-t!',
    floatingFeedbackText: 'Vélemény / Hibabejelentés',
    footerText: 'WinterTray · Téli és őszi Windows asztali hangulat-alkalmazás',
    videoTitle: 'WinterTray – Bemutató és Letöltési Útmutató',
    videoHeroBtn: 'Videó bemutató',
    videoMinimizeTitle: 'Kicsinyítés a sarokba',
    videoExpandTitle: 'Kinyitás teljes méretre',
    videoCloseTitle: 'Bezárás'
  }
};

// ========================================================
// 3. Globális Nyelv- és Évszakváltó (Switchers)
// ========================================================

window.setLanguage = function(lang) {
  currentLang = lang === 'hu' ? 'hu' : 'en';
  safeSetStorage('wintertray_lang', currentLang);

  document.documentElement.setAttribute('lang', currentLang);
  document.documentElement.setAttribute('data-lang', currentLang);

  const t = i18n[currentLang];

  // Oldalcím és metaadatok
  if (t.pageTitle) document.title = t.pageTitle;
  const metaDesc = document.getElementById('meta-description');
  if (metaDesc) metaDesc.setAttribute('content', t.metaDesc);

  // Nyelvválasztó gombok
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isMatch = btn.getAttribute('data-lang-target') === currentLang;
    btn.classList.toggle('active', isMatch);
    btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
  });

  // Évszakválasztó gombok feliratai
  const winText = document.getElementById('season-btn-winter-text');
  if (winText) winText.textContent = t.seasonWinter;
  const autText = document.getElementById('season-btn-autumn-text');
  if (autText) autText.textContent = t.seasonAutumn;
  const newBadge = document.getElementById('season-btn-new-badge');
  if (newBadge) newBadge.textContent = t.seasonNewBadge;

  // Hero szövegek
  const heroBadge = document.getElementById('hero-badge');
  if (heroBadge) {
    heroBadge.textContent = currentSeason === 'autumn' ? t.heroBadgeAutumn : t.heroBadgeWinter;
  }
  const heroLead = document.getElementById('hero-lead');
  if (heroLead) heroLead.textContent = t.heroLead;
  const mainDlText = document.getElementById('main-download-text');
  if (mainDlText) mainDlText.textContent = t.downloadBtn;
  const heroFbText = document.getElementById('hero-feedback-text');
  if (heroFbText) heroFbText.textContent = t.feedbackHeroBtn;

  // SmartScreen blokk
  const ssBtn = document.getElementById('smartscreen-toggle-text');
  if (ssBtn) ssBtn.textContent = t.smartScreenBtn;
  const ssBadge = document.getElementById('smartscreen-badge-text');
  if (ssBadge) ssBadge.textContent = t.smartScreenBadge;
  const ssDesc = document.getElementById('smartscreen-desc-text');
  if (ssDesc) ssDesc.innerHTML = t.smartScreenDesc;
  const ssTitle = document.getElementById('smartscreen-steps-title-text');
  if (ssTitle) ssTitle.textContent = t.smartScreenTitle;
  const ssStep1 = document.getElementById('smartscreen-step1-text');
  if (ssStep1) ssStep1.innerHTML = t.smartScreenStep1;
  const ssStep2 = document.getElementById('smartscreen-step2-text');
  if (ssStep2) ssStep2.innerHTML = t.smartScreenStep2;
  const ssDemo1 = document.getElementById('smartscreen-demo1-text');
  if (ssDemo1) ssDemo1.textContent = t.demoStep1;
  const ssDemo2 = document.getElementById('smartscreen-demo2-text');
  if (ssDemo2) ssDemo2.textContent = t.demoStep2;

  // Címsorok
  const relHead = document.getElementById('releases-heading');
  if (relHead) relHead.textContent = t.releasesHeading;
  const featHead = document.getElementById('features-heading');
  if (featHead) featHead.textContent = t.featuresHeading;

  // Funkciók
  const f1 = document.getElementById('feature-item-1');
  if (f1) f1.innerHTML = t.feature1;
  const f2 = document.getElementById('feature-item-2');
  if (f2) f2.innerHTML = t.feature2;
  const f3 = document.getElementById('feature-item-3');
  if (f3) f3.innerHTML = t.feature3;
  const f4 = document.getElementById('feature-item-4');
  if (f4) f4.innerHTML = t.feature4;
  const f5 = document.getElementById('feature-item-5');
  if (f5) f5.innerHTML = t.feature5;

  // Rendszerkövetelmények
  const specHead = document.getElementById('specs-heading');
  if (specHead) specHead.textContent = t.specsHeading;
  const spOsL = document.getElementById('spec-os-label');
  if (spOsL) spOsL.textContent = t.specOsLabel;
  const spOsV = document.getElementById('spec-os-value');
  if (spOsV) spOsV.textContent = t.specOsValue;
  const spRtL = document.getElementById('spec-runtime-label');
  if (spRtL) spRtL.textContent = t.specRuntimeLabel;
  const spRtV = document.getElementById('spec-runtime-value');
  if (spRtV) spRtV.textContent = t.specRuntimeValue;
  const spResL = document.getElementById('spec-resource-label');
  if (spResL) spResL.textContent = t.specResourceLabel;
  const spResV = document.getElementById('spec-resource-value');
  if (spResV) spResV.textContent = t.specResourceValue;

  // Visszajelzés kártya
  const fbBadge = document.getElementById('feedback-badge-text');
  if (fbBadge) fbBadge.textContent = t.feedbackBadge;
  const fbHead = document.getElementById('feedback-heading');
  if (fbHead) fbHead.textContent = t.feedbackHeading;
  const fbLink = document.getElementById('feedback-external-link');
  if (fbLink) fbLink.textContent = t.feedbackOpenNewTab;
  const fbIntro = document.getElementById('feedback-intro-text');
  if (fbIntro) fbIntro.textContent = t.feedbackIntro;
  const floatFb = document.getElementById('floating-feedback-text');
  if (floatFb) floatFb.textContent = t.floatingFeedbackText;

  // Lábléc
  const footer = document.getElementById('footer-text');
  if (footer) footer.innerHTML = t.footerText;

  // Videó szövegek és gombok
  const vTitle = document.getElementById('video-title-text');
  if (vTitle) vTitle.textContent = t.videoTitle;
  const vHeroBtn = document.getElementById('hero-video-text');
  if (vHeroBtn) vHeroBtn.textContent = t.videoHeroBtn;
  const vMinBtn = document.getElementById('video-minimize-btn');
  if (vMinBtn) vMinBtn.setAttribute('title', t.videoMinimizeTitle);
  const vExpBtn = document.getElementById('video-expand-btn');
  if (vExpBtn) vExpBtn.setAttribute('title', t.videoExpandTitle);
  const vClsBtn = document.getElementById('video-close-btn');
  if (vClsBtn) vClsBtn.setAttribute('title', t.videoCloseTitle);

  // Verziósorok és lefordított changelogok azonnali újrarajzolása
  if (window.renderReleasesList) {
    window.renderReleasesList();
  }
};

window.setSeason = function(season) {
  currentSeason = season === 'autumn' ? 'autumn' : 'winter';
  safeSetStorage('wintertray_season', currentSeason);

  const htmlEl = document.documentElement;
  const bodyEl = document.body;
  const metaTheme = document.getElementById('meta-theme-color');
  const heroBadge = document.getElementById('hero-badge');

  htmlEl.setAttribute('data-season', currentSeason);
  if (bodyEl) {
    bodyEl.setAttribute('data-season', currentSeason);
    if (currentSeason === 'autumn') {
      bodyEl.classList.add('autumn-theme');
    } else {
      bodyEl.classList.remove('autumn-theme');
    }
  }

  if (metaTheme) {
    metaTheme.setAttribute('content', currentSeason === 'autumn' ? '#140c07' : '#070d19');
  }

  const t = i18n[currentLang];
  if (heroBadge) {
    heroBadge.textContent = currentSeason === 'autumn' ? t.heroBadgeAutumn : t.heroBadgeWinter;
  }

  // Gombok aktív állapotának frissítése
  const seasonBtns = document.querySelectorAll('.season-btn');
  seasonBtns.forEach(btn => {
    const target = btn.getAttribute('data-season-target');
    const isMatch = target === currentSeason;
    btn.classList.toggle('active', isMatch);
    btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
  });

  // Felsorolás ikonok frissítése
  const bullets = document.querySelectorAll('.feature-list .bullet');
  bullets.forEach(b => {
    b.textContent = currentSeason === 'autumn' ? '🍂' : '❄';
  });

  // Részecskék frissítése
  if (window.onSeasonChange) {
    window.onSeasonChange(currentSeason);
  }
};

window.toggleSmartScreenHelp = function() {
  const content = document.getElementById('smartscreen-content');
  const btn = document.getElementById('smartscreen-btn');
  if (!content || !btn) return;
  const isOpen = content.classList.toggle('open');
  btn.classList.toggle('active', isOpen);
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
};

// ========================================================
// Videó Felugró Modal & Lebegő Mini-lejátszó funkciók
// ========================================================

window.minimizeVideo = function() {
  const overlay = document.getElementById('video-overlay');
  const container = document.getElementById('video-container');
  if (!overlay || !container) return;

  overlay.classList.remove('active');
  container.classList.remove('modal-mode');
  container.classList.add('mini-mode');
};

window.maximizeVideo = function() {
  const overlay = document.getElementById('video-overlay');
  const container = document.getElementById('video-container');
  const video = document.getElementById('intro-video');
  if (!overlay || !container) return;

  container.classList.remove('closed');
  container.classList.remove('mini-mode');
  container.classList.add('modal-mode');
  overlay.classList.add('active');

  if (video && video.paused) {
    video.play().catch(() => {});
  }
};

window.closeVideoCompletely = function(e) {
  if (e) e.stopPropagation();
  const overlay = document.getElementById('video-overlay');
  const container = document.getElementById('video-container');
  const video = document.getElementById('intro-video');
  if (video) video.pause();
  if (overlay) overlay.classList.remove('active');
  if (container) {
    container.classList.remove('modal-mode');
    container.classList.remove('mini-mode');
    container.classList.add('closed');
  }
};

// ========================================================
// 4. Háttér Canvas Animációs Motor (Snow & Leaves + Rain)
// ========================================================

(function initCanvasEngine() {
  const canvas = document.getElementById('snow-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;

  let snowflakes = [];
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

  function makeLeaf(initialY) {
    const color = autumnPalette[Math.floor(Math.random() * autumnPalette.length)];
    return {
      x: Math.random() * width,
      y: initialY !== undefined ? initialY : -25,
      size: Math.random() * 6 + 7.5,
      type: Math.floor(Math.random() * 3), // 0: nyír, 1: tölgy, 2: juhar
      color: color,
      speedY: Math.random() * 0.8 + 0.5,
      speedX: Math.random() * 0.5 + 0.15,
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

  function drawLeafShape(c, type, s) {
    c.beginPath();
    if (type === 0) {
      // Nyírlevél
      c.moveTo(0, -s);
      c.quadraticCurveTo(s * 0.85, -s * 0.2, 0, s);
      c.quadraticCurveTo(-s * 0.85, -s * 0.2, 0, -s);
    } else if (type === 1) {
      // Tölgyfalevél
      c.moveTo(0, -s);
      c.bezierCurveTo(s * 0.6, -s * 0.8, s * 0.9, -s * 0.2, s * 0.45, s * 0.15);
      c.bezierCurveTo(s * 0.8, s * 0.45, s * 0.4, s * 0.85, 0, s);
      c.bezierCurveTo(-s * 0.4, s * 0.85, -s * 0.8, s * 0.45, -s * 0.45, s * 0.15);
      c.bezierCurveTo(-s * 0.9, -s * 0.2, -s * 0.6, -s * 0.8, 0, -s);
    } else {
      // Juharlevél
      c.moveTo(0, -s * 1.05);
      c.lineTo(s * 0.32, -s * 0.35);
      c.lineTo(s * 0.95, -s * 0.45);
      c.lineTo(s * 0.5, s * 0.1);
      c.lineTo(s * 0.72, s * 0.65);
      c.lineTo(0, s * 0.45);
      c.lineTo(-s * 0.72, s * 0.65);
      c.lineTo(-s * 0.5, s * 0.1);
      c.lineTo(-s * 0.95, -s * 0.45);
      c.lineTo(-s * 0.32, -s * 0.35);
      c.closePath();
    }
    c.fill();
    c.lineWidth = 0.7;
    c.stroke();

    // Levél szára
    c.beginPath();
    c.moveTo(0, -s * 0.5);
    c.lineTo(0, s * 1.25);
    c.stroke();
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
      if (rp.rx > 0) {
        ctx.beginPath();
        if (ctx.ellipse) {
          ctx.ellipse(rp.x, rp.y, rp.rx, rp.rx * 0.32, 0, 0, Math.PI * 2);
        } else {
          ctx.arc(rp.x, rp.y, rp.rx, 0, Math.PI * 2);
        }
        ctx.strokeStyle = `rgba(245, 185, 120, ${rp.alpha})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
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

  window.onSeasonChange = function(newSeason) {
    if (newSeason === 'autumn') {
      if (leaves.length === 0) createAutumnParticles();
    } else {
      if (snowflakes.length === 0) createWinterParticles();
    }
  };

  resize();
  createWinterParticles();
  createAutumnParticles();

  window.addEventListener('resize', () => {
    resize();
    createWinterParticles();
    createAutumnParticles();
  });

  requestAnimationFrame(animate);
})();

// ========================================================
// 5. Verziókezelő & Automatikus Changelog Fordító
// ========================================================

const dynamicTranslationCache = {};

async function translateTextClientSide(text, sl, tl) {
  if (!text) return '';
  const key = `${sl}_${tl}_${text}`;
  if (dynamicTranslationCache[key]) return dynamicTranslationCache[key];

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sl}|${tl}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data && data.responseData && data.responseData.translatedText) {
        let trans = data.responseData.translatedText.trim();
        trans = trans.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
        dynamicTranslationCache[key] = trans;
        return trans;
      }
    }
  } catch (e) {}

  return text;
}

let cachedReleasesData = null;

async function resolveChangelogLines(rel, lang) {
  if (lang === 'hu') {
    return rel.changes || [];
  }

  // Angol nyelv:
  if (Array.isArray(rel.changes_en) && rel.changes_en.length === (rel.changes || []).length) {
    return rel.changes_en;
  }

  // Ha hiányzik vagy új elem van benne, lefordítjuk automatikusan a fordító API-val:
  const lines = rel.changes || [];
  const translated = [];
  for (let i = 0; i < lines.length; i++) {
    const orig = lines[i];
    if (rel.changes_en && rel.changes_en[i] && rel.changes_en[i] !== orig) {
      translated.push(rel.changes_en[i]);
    } else {
      const t = await translateTextClientSide(orig, 'hu', 'en');
      translated.push(t);
    }
  }
  return translated;
}

window.renderReleasesList = async function() {
  const mainBtn = document.getElementById('main-download-btn');
  const versionInfo = document.getElementById('current-version-info');
  const wrapper = document.getElementById('releases-wrapper');
  if (!cachedReleasesData || !wrapper) return;

  const t = i18n[currentLang];
  const releases = Array.isArray(cachedReleasesData.releases) ? cachedReleasesData.releases : [];
  const latest = cachedReleasesData.latest || releases[0] || null;

  if (!latest) {
    if (versionInfo) versionInfo.textContent = t.noReleasesText;
    wrapper.innerHTML = `<p class="loading-text">${t.noReleasesText}</p>`;
    return;
  }

  // Fő letöltés gomb beállítása
  if (mainBtn) {
    mainBtn.href = latest.url;
    mainBtn.setAttribute('download', latest.file);
  }
  if (versionInfo) {
    versionInfo.textContent = `${t.versionPrefix} ${latest.version} (${latest.file}) ${t.versionSuffix}`;
  }

  wrapper.innerHTML = '';

  async function createReleaseRow(rel, isLatest) {
    const card = document.createElement('div');
    card.className = 'release-card-row';

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
      badge.textContent = t.badgeLatest;
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
    dlBtn.innerHTML = `<span>${t.dlBtnText}</span>`;

    // Változások lenyitása gomb
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn-toggle-changelog';
    toggleBtn.type = 'button';
    toggleBtn.innerHTML = `<span>${t.changelogBtn}</span> <span class="arrow">▼</span>`;

    rightActions.appendChild(dlBtn);
    rightActions.appendChild(toggleBtn);

    mainBar.appendChild(leftInfo);
    mainBar.appendChild(rightActions);
    card.appendChild(mainBar);

    // Lenyíló fiók a változásokkal
    const drawer = document.createElement('div');
    drawer.className = 'release-changelog-drawer';

    const changelogLines = await resolveChangelogLines(rel, currentLang);

    if (Array.isArray(changelogLines) && changelogLines.length > 0) {
      const ul = document.createElement('ul');
      ul.className = 'changelog-changes';
      changelogLines.forEach(lineText => {
        const li = document.createElement('li');
        li.textContent = lineText;
        ul.appendChild(li);
      });
      drawer.appendChild(ul);
    } else {
      const p = document.createElement('p');
      p.className = 'loading-text';
      p.textContent = t.noChangesText;
      drawer.appendChild(p);
    }

    card.appendChild(drawer);

    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
    });

    return card;
  }

  // 1. Legújabb kiadás kirajzolása
  const latestCard = await createReleaseRow(latest, true);
  wrapper.appendChild(latestCard);

  // 2. Korábbi verziók lenyitható listája
  const olderReleases = releases.slice(1);
  if (olderReleases.length > 0) {
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'toggle-older-container';

    const showOlderBtn = document.createElement('button');
    showOlderBtn.className = 'btn-show-all-versions';
    showOlderBtn.type = 'button';
    showOlderBtn.textContent = t.showOlderBtn(olderReleases.length);

    const olderList = document.createElement('div');
    olderList.className = 'older-releases-list';

    for (const rel of olderReleases) {
      const row = await createReleaseRow(rel, false);
      olderList.appendChild(row);
    }

    showOlderBtn.addEventListener('click', () => {
      const isOpen = olderList.classList.toggle('open');
      showOlderBtn.textContent = isOpen
        ? t.hideOlderBtn
        : t.showOlderBtn(olderReleases.length);
    });

    toggleContainer.appendChild(showOlderBtn);
    wrapper.appendChild(toggleContainer);
    wrapper.appendChild(olderList);
  }
};

function parseGitHubReleaseNotes(body) {
  if (!body) return [];
  return body
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.replace(/^[-*•]\s*/, ''));
}

async function fetchGitHubReleases() {
  try {
    const res = await fetch('https://api.github.com/repos/baboy0715/wintray_page/releases', {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!res.ok) return null;
    const items = await res.json();
    return Array.isArray(items) && items.length > 0 ? items : null;
  } catch (e) {
    return null;
  }
}

function mergeGitHubReleases(localData, ghItems) {
  if (!Array.isArray(ghItems) || ghItems.length === 0) return localData;

  const localReleases = (localData && Array.isArray(localData.releases)) ? [...localData.releases] : [];
  const merged = [];

  for (const gh of ghItems) {
    const tag = gh.tag_name || '';
    const rawVer = tag.replace(/^v/i, '');
    const exeAsset = (gh.assets || []).find(a => a.name && a.name.toLowerCase().endsWith('.exe')) || (gh.assets || [])[0];
    const dlUrl = exeAsset ? exeAsset.browser_download_url : gh.html_url;
    const fileName = exeAsset ? exeAsset.name : `WinterTray-Setup-${tag}.exe`;
    const dateStr = gh.published_at ? gh.published_at.split('T')[0] : '';
    const changes = parseGitHubReleaseNotes(gh.body);

    const existing = localReleases.find(r => r.rawVersion === rawVer || r.version === tag);

    merged.push({
      version: tag.startsWith('v') ? tag : `v${tag}`,
      rawVersion: rawVer,
      file: fileName,
      url: dlUrl,
      date: dateStr || (existing ? existing.date : ''),
      changes: changes.length > 0 ? changes : (existing ? existing.changes : []),
      changes_en: (existing && existing.changes_en) ? existing.changes_en : undefined
    });
  }

  for (const loc of localReleases) {
    const already = merged.some(m => m.rawVersion === loc.rawVersion || m.version === loc.version);
    if (!already) {
      merged.push(loc);
    }
  }

  merged.sort((a, b) => {
    const partsA = (a.rawVersion || '').split('.').map(Number);
    const partsB = (b.rawVersion || '').split('.').map(Number);
    const len = Math.max(partsA.length, partsB.length);
    for (let i = 0; i < len; i++) {
      const numA = partsA[i] || 0;
      const numB = partsB[i] || 0;
      if (numA !== numB) return numB - numA;
    }
    return (b.file || '').localeCompare(a.file || '');
  });

  return {
    latest: merged[0] || null,
    releases: merged
  };
}

(async function initReleases() {
  // 1. Azonnali megjelenítés a helyi gyorsítótárból
  try {
    const response = await fetch('releases/releases.json?v=' + Date.now(), { cache: 'no-cache' });
    if (response.ok) {
      cachedReleasesData = await response.json();
      window.renderReleasesList();
    }
  } catch (err) {}

  // 2. Automatikus frissítés a legújabb GitHub Releases API-ból
  try {
    const ghItems = await fetchGitHubReleases();
    if (ghItems && ghItems.length > 0) {
      cachedReleasesData = mergeGitHubReleases(cachedReleasesData, ghItems);
      window.renderReleasesList();
    }
  } catch (err) {}

  if (!cachedReleasesData) {
    const t = i18n[currentLang];
    const wrapper = document.getElementById('releases-wrapper');
    if (wrapper) wrapper.innerHTML = `<p class="loading-text">${t.noReleasesText}</p>`;
  }
})();

// Kezdeti állapot aktiválása: ALAPÉRTELMEZETTEN ANGOL (vagy tárolt nyelv)
document.addEventListener('DOMContentLoaded', () => {
  window.setLanguage(currentLang);
  window.setSeason(currentSeason);
});

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  window.setLanguage(currentLang);
  window.setSeason(currentSeason);
}
