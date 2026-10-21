# Wahee

<!-- impeccable:product-schema 1 -->

## Platform
web

## Product Purpose
Make the supplied Quran and Hadith collections readable and searchable in Wahee. The home page provides entrances to Quran, Hadith, Seerah, and Duas. The user authorized design changes wherever they improve the app experience.

## Capabilities and Constraints
The existing Quran directory lives at `/quran`, with existing surah, search, and saved-ayah links preserved. Hadith uses the nine supplied databases in `dbs/`: collection discovery, book browsing, source numbering, Arabic, available Urdu/English translations, source notes, search, and local saved passages. Seerah and Duas have clearly labeled empty pages for now. Preserve source content and numbering; do not infer authenticity grades from undocumented status codes. Open all baseline databases read-only. Decode shifted Urdu Hadith bodies at display time, leaving source files unchanged. Store reading preferences and bookmarks on the device.

## Evidence on Hand
`dbs/quranDb.db`: 6,236 numbered ayahs and 113 separate Bismillah records. Recovered Urdu translations and two Urdu tafsir columns, 11 translation editions, Arabic word roots and meanings, topics, and page/juz mappings. Existing chapter catalog supplies names, meanings, and revelation types. Nine Hadith databases contain Arabic records, encoded Urdu bodies, book/chapter titles and source notes; six also contain English translations. Derive book names from the titles attached to actual records: some copied `tbl_Kitab` catalogs do not match their collection. The databases do not contain audio. Source notes and religious text are never generated.

## Brand Commitments
Wahee. Prioritize the best reading experience; retain and extend the existing calm visual system when useful.

## Accessibility & Inclusion
Support Arabic and Urdu right-to-left content, keyboard use, adjustable text, mobile screens, and light, sepia, and dark reading themes.

## Open Decisions
Public hosting, accounts, synchronization, audio sources, and verification of abbreviated edition identities are not decided.
