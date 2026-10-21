# Wahee

A Quran and Hadith reading app built on the supplied databases in **`dbs/`**. Next.js, React, TypeScript, and a local Express content API. The application opens SQLite read-only; it never modifies the baselines.

## Run

Node.js **22.13 or later** is required for built-in SQLite support (Node 24 recommended).

```sh
npm install
npm run dev
```

Open http://localhost:3001. The API listens on http://127.0.0.1:4401. Keep the databases in `dbs/`, or set `QURAN_DB_PATH` and `HADITH_DB_DIR` to absolute source paths. No database installation, API credentials, or external text service is required.

```sh
npm run typecheck
npm run verify:data
npm run verify:hadith
npm run verify:font
npm test
npm run build
npm start
```

Playwright uses Chromium; install it with `npx playwright install chromium` on a new machine. `npm start` launches the production app and content API together.

## Included

- Home has Quran, Hadith, Seerah, and Duas entrances. The existing Quran directory is now `/quran`; existing surah links are preserved. Seerah and Duas are labeled coming-soon pages.
- Nine Hadith collections with 72,656 source records: Bukhari, Muslim, Tirmidhi, Abu Dawud, Nasa’i, Ibn Majah, Musnad Ahmad, Mishkat, and Silsila. Browse actual book groupings, search Arabic/Urdu/English or source numbers, and read passages with expandable Arabic and source notes. Three collections have Urdu without English; only supplied languages appear.
- Hadith reading has adjustable text, Arabic-only mode, separate device-local bookmarks, and a continue-reading link. Numbering follows the supplied edition; the Muslim introduction is kept separate from Hadith 1.

- All 114 surahs and 6,236 numbered ayahs, with 113 separate Bismillah headings.
- Eleven populated translation editions: English, eight Urdu choices, Roman Urdu, and Hindi.
- Opening commentary and ayah tafsir from Maududi and Mufti Taqi Usmani, with explicit empty states wherever the source has no separate note.
- Inline ayah word meanings in English or Urdu, with Arabic roots and lemmas revealed on selection. Desktop shows details inline; mobile uses a compact bottom sheet.
- Search in Arabic and the chosen translation, direct references such as `2:255`, and 2,101 Quran topic entries.
- Navigation by surah, ayah, all 30 juz, and the source's 15-line page references (pages 2–610).
- Reading and translation modes, adjustable text sizes, light/sepia/dark themes, and English/Urdu interface.
- Device-local bookmarks across surahs and a continue-reading shortcut.
- Long surahs render 30 ayahs at a time. Direct ayah links open the appropriate range.
- Tafsir docks beside an interactive Quran at widths of 1180px or more, and becomes a focused reading view below that width. Desktop can expand it. Browser Back and the return button preserve the Quran reading position.
- Tafsir has adjustable text size, expandable ayah context, source paragraph and footnote formatting, and per-source scroll memory for the current reader session. Use `/surah/2?tafsir=255` to open a tafsir directly.

Seerah and Duas content, prayer times, accounts, and synchronization are not implemented. Audio is not supplied by these databases and is not included.

## Source handling

`dbs/quranDb.db` is the authoritative Quran source. `data/chapters.json` supplies the chapter names, meanings, and revelation metadata. Arabic uses Scheherazade New 4.500, including U+06C1 (ہ) and U+06C3 (ۃ). Urdu uses Noto Nastaliq Urdu. Both fonts are bundled under the SIL Open Font License; licenses are in `public/fonts`. Dark mode uses a near-black canvas with neutral charcoal surfaces and the original green accent.

Hadith reads the nine named `.db` files in `dbs/`. Only Urdu `hadees_languages.hadees` bodies are decoded: U+0623 becomes a space; other characters shift back three code points, preserving pre-existing line breaks. Book/chapter titles and notes are already Unicode. Some copied `tbl_Kitab` tables are unrelated catalogs, so navigation derives from actual `hadees.kitab_id` groups and their attached translated titles. Source notes are displayed as supplied; undocumented numeric status codes are never turned into authenticity grades. English rows can contain Urdu narrator text, which retains Urdu typography.

Twenty-five Silsila Arabic records include legacy font fragments (presentation-form quotation codes or private-use symbols). Their missing font is not supplied. The reader marks these fragments as `[source symbols]` and explains the limitation; it never guesses quotations or normalizes those codes into unrelated letters. Urdu translations remain available and the source files are unchanged.

Original database content is preserved. Display formatting removes existing ayah-number ornaments and private-use page annotations before adding one ayah marker. Translation links are converted to readable plain text; no original-app internal links are executed. Tafsir is rendered as text, never arbitrary HTML. Search normalization applies only to the in-memory index, not the displayed text or database.

Some edition identities are abbreviated in the source. AAI and TQ retain their source labels, and the English edition is not assigned a translator the database does not identify. Empty edition columns are not presented as available. The old Al-Fatihah JSON fixtures remain as historical source artifacts and are no longer used by the application.

The recovery utility is `scripts/recover_quran_db.py`. It is for the original encoded source; do not run it on the already recovered baseline. The recovery backup and generated copy are ignored by Git. Keep the baseline database alongside the app when moving or deploying it.

## API

Next.js proxies `/api/v1/*` to Express. Set `API_URL` and `API_PORT` when running the services separately.

- `GET /health`
- `GET /v1/chapters`
- `GET /v1/chapters/:id?edition=taqi`
- `GET /v1/verses/:surah:ayah?edition=english`
- `GET /v1/verses?keys=1:1,2:255&edition=urdu` (100 keys per request)
- `GET /v1/editions`
- `GET /v1/navigation`
- `GET /v1/tafsirs`
- `GET /v1/tafsirs/:id/verses/:surah:ayah` (`maududi` or `taqi`)
- `GET /v1/tafsirs/:id/chapters/:chapterId` (opening commentary)
- `GET /v1/words/:surah:ayah`
- `GET /v1/search?q=mercy&edition=english&page=1` (20 ayahs per page)
- `GET /v1/topics?q=patience&chapter=2&page=1` (30 topics per page)
- `GET /v1/hadith/records?keys=bukhari:1,muslim:2` (100 record keys per request, for local saved passages)

`npm run verify:data` checks every surah and numbered verse, all available translation choices, navigation, search, word roots, tafsir alignment, invalid references, and that reading the database has not changed it.

`npm run verify:hadith` checks the nine source files, book groups, numbering, language availability, search, all reversible Urdu bodies, and unchanged database hashes. `npm run verify:font` checks source characters against actual font glyph IDs.
