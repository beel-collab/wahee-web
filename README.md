# Wahee — Al-Fatihah prototype

Next.js / React / TypeScript reader with a separate Express API. Only Surah Al-Fatihah is included.

## Run

Requires Node.js 22 or later.

```sh
npm install
npm run dev
```

Web: http://localhost:3001. API: http://localhost:4401.

```sh
npm run typecheck
npm test
npm run build
npm start
```

Playwright requires Chromium (`npx playwright install chromium` on a new machine). The production build and API start together with `npm start`.

## Features

Arabic reading and translation modes; English (Pickthall) and Urdu (Fateh Muhammad Jalandhry); localized interface; light, sepia, and dark themes; adjustable Arabic size; local bookmarks; direct verse links; per-ayah and continuous Alafasy audio. Audio requires an internet connection. Bookmarks and preferences remain on the current device.

## Content

`data/fatiha-source.json` is the unchanged response retrieved on 2026-09-12 from:
https://api.alquran.cloud/v1/surah/1/editions/quran-uthmani,en.pickthall,ur.jalandhry

The seven ayahs are aligned by source order and mapped to verse keys in `data/fatiha.ts`. Arabic and translations are never generated. This is a development fixture; review source edition permissions and content with a qualified reviewer before public distribution. Quran Foundation authenticated integration, additional editions, database storage, accounts and offline audio are future work.

Arabic and Urdu fonts are bundled under the SIL Open Font License; license files are in `public/fonts`.

## API

- `GET /health`
- `GET /v1/chapters`
- `GET /v1/chapters/1`
- `GET /v1/verses/1:1`

Other chapter and verse IDs return 404. Next.js proxies `/api/v1/*` to Express. Server rendering fetches Express directly. Set `API_URL` for the web service and `API_PORT` for Express when deploying separately; secrets belong on the server. No database or credentials are needed for this prototype.

## Tafsir

The reader includes Ibn Kathir (Abridged), English (resource 169), and Tafsir Ibn Kathir, Urdu (resource 160), by Hafiz Ibn Kathir, sourced from Quran.com. The unchanged source records and retrieval date are in `data/fatiha-tafsir-source.json`. Each ayah preserves the provider’s `verses` mapping, including commentary spanning several ayahs. HTML is sanitized by the API using an explicit tag allowlist, with no attributes or embedded media allowed.

- `GET /v1/tafsirs`
- `GET /v1/tafsirs/169/verses/1:1`
- `GET /v1/tafsirs/160/verses/1:1`

Use `node scripts/fetch-tafsir.mjs` to explicitly refresh the development fixture from Quran.com. This validates that every requested ayah has commentary and a source mapping. Review edition permissions before public distribution. The panel fetches commentary on demand, supports English/Urdu selection and previous/next ayah navigation, and restores focus on closing.

## Quran typography

Ayah text uses QPC Uthmanic Hafs (UthmanicHafs1Ver18), loaded at runtime from the Quran Foundation URL documented at https://api-docs.quran.com/docs/tutorials/fonts/font-rendering/. Matched `text_qpc_hafs` word data is stored with provenance in `data/fatiha-qpc-source.json`; only `word` records are joined, as the reader renders ayah markers separately. Original AlQuran Cloud Arabic remains unchanged in its source fixture. Amiri Quran remains the fallback and heading font. The QPC font requires network access; it is not redistributed in this repository.
