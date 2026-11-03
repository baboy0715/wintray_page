const fs = require('fs');
const path = require('path');

const releasesDir = path.join(__dirname, 'releases');
const outputFile = path.join(releasesDir, 'releases.json');

if (!fs.existsSync(releasesDir)) {
  fs.mkdirSync(releasesDir, { recursive: true });
}

function extractVersion(filename) {
  const match = filename.match(/v?(\d+(?:\.\d+)+)/i);
  return match ? match[1] : '0.0.0';
}

function compareVersionsDesc(a, b) {
  const partsA = a.version.split('.').map(Number);
  const partsB = b.version.split('.').map(Number);
  const len = Math.max(partsA.length, partsB.length);
  for (let i = 0; i < len; i++) {
    const numA = partsA[i] || 0;
    const numB = partsB[i] || 0;
    if (numA !== numB) return numB - numA;
  }
  return b.file.localeCompare(a.file);
}

function parseTxtLines(content) {
  return content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.replace(/^[-*•]\s*/, ''));
}

function parseUnifiedChangelog(changelogPath) {
  const map = {};
  if (!fs.existsSync(changelogPath)) return map;
  const content = fs.readFileSync(changelogPath, 'utf8');
  let currentVer = null;

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const headerMatch = line.match(/^\[?v?(\d+(?:\.\d+)+)\]?:?$/i);
    if (headerMatch) {
      currentVer = headerMatch[1];
      if (!map[currentVer]) map[currentVer] = [];
    } else if (currentVer) {
      map[currentVer].push(line.replace(/^[-*•]\s*/, ''));
    }
  }
  return map;
}

function buildReleases() {
  const files = fs.readdirSync(releasesDir);
  const exeFiles = files.filter(f => f.toLowerCase().endsWith('.exe'));
  const unifiedChangelog = parseUnifiedChangelog(path.join(releasesDir, 'changelog.txt'));

  let entries = [];

  if (exeFiles.length > 0) {
    entries = exeFiles.map(exeFile => {
      const baseName = exeFile.slice(0, -4);
      const version = extractVersion(exeFile);
      const exactTxtPath = path.join(releasesDir, `${baseName}.txt`);
      const verTxtPath = path.join(releasesDir, `v${version}.txt`);
      const plainVerTxtPath = path.join(releasesDir, `${version}.txt`);

      let changes = [];
      if (fs.existsSync(exactTxtPath)) {
        changes = parseTxtLines(fs.readFileSync(exactTxtPath, 'utf8'));
      } else if (fs.existsSync(verTxtPath)) {
        changes = parseTxtLines(fs.readFileSync(verTxtPath, 'utf8'));
      } else if (fs.existsSync(plainVerTxtPath)) {
        changes = parseTxtLines(fs.readFileSync(plainVerTxtPath, 'utf8'));
      } else if (unifiedChangelog[version]) {
        changes = unifiedChangelog[version];
      }

      const stat = fs.statSync(path.join(releasesDir, exeFile));
      const dateStr = stat.mtime.toISOString().split('T')[0];

      return {
        version: `v${version}`,
        rawVersion: version,
        file: exeFile,
        url: `releases/${encodeURIComponent(exeFile)}`,
        date: dateStr,
        changes
      };
    });
  } else {
    // Ha még nincs .exe feltöltve, a .txt fájlokból is felépítjük az előnézetet
    const txtFiles = files.filter(
      f => f.toLowerCase().endsWith('.txt') && f.toLowerCase() !== 'changelog.txt'
    );
    entries = txtFiles.map(txtFile => {
      const baseName = txtFile.slice(0, -4);
      const version = extractVersion(txtFile);
      const exeFile = `${baseName}.exe`;
      const changes = parseTxtLines(fs.readFileSync(path.join(releasesDir, txtFile), 'utf8'));
      const stat = fs.statSync(path.join(releasesDir, txtFile));
      const dateStr = stat.mtime.toISOString().split('T')[0];

      return {
        version: `v${version}`,
        rawVersion: version,
        file: exeFile,
        url: `releases/${encodeURIComponent(exeFile)}`,
        date: dateStr,
        changes
      };
    });
  }

  entries.sort((a, b) => {
    const partsA = a.rawVersion.split('.').map(Number);
    const partsB = b.rawVersion.split('.').map(Number);
    const len = Math.max(partsA.length, partsB.length);
    for (let i = 0; i < len; i++) {
      const numA = partsA[i] || 0;
      const numB = partsB[i] || 0;
      if (numA !== numB) return numB - numA;
    }
    return b.file.localeCompare(a.file);
  });

  const output = {
    latest: entries.length > 0 ? entries[0] : null,
    releases: entries
  };

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Generated ${outputFile} with ${entries.length} release(s).`);
}

buildReleases();
