const fs = require('fs');
const path = require('path');
const https = require('https');

const releasesDir = path.join(__dirname, 'releases');
const outputFile = path.join(releasesDir, 'releases.json');
const translationsFile = path.join(releasesDir, 'translations.json');

if (!fs.existsSync(releasesDir)) {
  fs.mkdirSync(releasesDir, { recursive: true });
}

let translationsCache = {};
if (fs.existsSync(translationsFile)) {
  try {
    translationsCache = JSON.parse(fs.readFileSync(translationsFile, 'utf8'));
  } catch (e) {
    translationsCache = {};
  }
}

function extractVersion(filename) {
  const match = filename.match(/v?(\d+(?:\.\d+)+)/i);
  return match ? match[1] : '0.0.0';
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

function fetchTranslation(text) {
  return new Promise(resolve => {
    // If text already looks completely English or is cached
    if (translationsCache[text]) {
      return resolve(translationsCache[text]);
    }

    const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=hu|en';
    const req = https.get(url, { timeout: 4000 }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json && json.responseData && json.responseData.translatedText) {
            let translated = json.responseData.translatedText.trim();
            // Clean up possible HTML entities
            translated = translated.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
            translationsCache[text] = translated;
            return resolve(translated);
          }
        } catch (err) {}
        resolve(text);
      });
    });

    req.on('error', () => resolve(text));
    req.on('timeout', () => {
      req.destroy();
      resolve(text);
    });
  });
}

async function buildReleases() {
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

  // Verziók rendezése csökkenő sorrendben (pl. v2.1 > v2.0.1 > v2.0 > v1.0)
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

  // Angol fordítások generálása/összegyűjtése minden változáshoz
  console.log('Translating release changelogs to English...');
  for (const entry of entries) {
    entry.changes_en = [];
    for (const change of entry.changes) {
      const translated = await fetchTranslation(change);
      entry.changes_en.push(translated);
    }
  }

  // Mentjük a fordítási gyorsítótárat
  try {
    fs.writeFileSync(translationsFile, JSON.stringify(translationsCache, null, 2), 'utf8');
  } catch (e) {}

  const output = {
    latest: entries.length > 0 ? entries[0] : null,
    releases: entries
  };

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Generated ${outputFile} with ${entries.length} release(s) (HU & EN changelogs included).`);
}

buildReleases().catch(err => {
  console.error('Build error:', err);
  process.exit(1);
});
