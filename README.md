# WinterTray – Letöltő Weboldal

Letisztult, egyoldalas letöltő weboldal a **WinterTray** Windows alkalmazáshoz, automatikus verzió- és frissítési jegyzék (changelog) generálással.

---

## Új verzió kiadása (GitHub)

Új verzió kiadásához nincs szükség a HTML vagy JavaScript kód szerkesztésére. Mindössze két fájlt kell elhelyezned a `releases/` mappában:

1. **A telepítőfájlt (`.exe`)**, amelynek a nevében szerepel a verziószám:
   - Példa: `releases/WinterTray-Setup-v1.1.exe`
2. **A hozzá tartozó szöveges leírást (`.txt`)**, pontosan ugyanazzal a fájlnévvel:
   - Példa: `releases/WinterTray-Setup-v1.1.txt`

### A `.txt` fájl formátuma

Írj minden változást külön sorba (a sor eleji `- ` vagy `* ` felsorolásjel opcionális, a script automatikusan kezeli):

```text
- Új hópehely-stílusok és finomított szélfizika
- Javított ablakfelismerés többmonitoros rendszereken
- Kisebb memóriahasználat a háttérben
```

*(Alternatívaként használhatsz egyetlen közös `releases/changelog.txt` fájlt is, amelyben `[v1.1]` fejlécek alá írod a sorokat, de a verziónkénti külön `.txt` fájl a legegyszerűbb és legátláthatóbb.)*

Miután bemásoltad a `.exe` és `.txt` fájlokat a `releases/` mappába, egyszerűen commitold és pushold fel a GitHub repóba:

```bash
git add .
git commit -m "Release v1.1"
git push
```

---

## Cloudflare Pages beállítása

Amikor összekötöd a GitHub repót (`baboy0715/wintray_page`) a **Cloudflare Pages** szolgáltatással, a következő **Build settings** értékeket állítsd be:

- **Framework preset:** `None`
- **Build command:** `node build.js` *(vagy `npm run build`)*
- **Build output directory:** `/` *(vagy hagyd üresen / `.`)*

### Hogyan működik?
Minden GitHub push alkalmával a Cloudflare Pages lefuttatja a `node build.js` szkriptet, amely:
1. Átvizsgálja a `releases/` mappában lévő `.exe` és `.txt` fájlokat.
2. Verziószám szerint csökkenő sorrendbe rendezi őket (így pl. a `v1.10` garantáltan a `v1.2` elé kerül).
3. Létrehozza a `releases/releases.json` fájlt, amelyből a weboldal automatikusan frissíti a fő **"Telepítő letöltése"** gombot és a **Frissítési jegyzék** szekciót.
