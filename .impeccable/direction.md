# Quran application extension

User direction: use the recovered database as baseline; Quran only. User delegated design decisions to achieve the best app experience.

Mode: Read with Operate wayfinding. Extend the incumbent Wahee identity: white, muted teal, serif brand and editorial headings, clear sans controls, bundled Arabic and Urdu typography. Remove prototype-only states. No replacement visual world, invented artwork, or image comp is needed for this data-driven extension.

First viewport: complete Quran discovery on the home page; reader immediately exposes surah identity, language selection, Bismillah where supplied, and the opening ayahs. Persistent header provides search and saved ayahs.

Signature interaction: move from an ayah into its tafsir or word roots without losing the reading place. On mobile, navigation becomes a dismissible drawer; reading remains a single generous column. On desktop it opens beside the text.

Preserve numbered ayahs and Bismillah separation; local-only bookmarks and progress; no external audio because the source contains none and verse segmentation must stay aligned. Render long surahs in 30-ayah ranges with direct-link positioning. Empty tafsir is a first-class state, never substitute another ayah's commentary.

## Study interaction update

Approved by the user: replace shared study popups with docked, nonmodal tafsir at widths of 1180px and above, and a focused full-screen tafsir view below that width. Browser Back returns to the preserved Quran reading position. Desktop can expand tafsir for longer reading. Keep the corrected Scheherazade New Arabic face, original brand green #367b6c, and near-black dark canvas #09090b.

Word-by-word replaces the selected ayah text with a right-to-left sequence of Arabic words and one chosen meaning language (English or Urdu). Roots and lemmas appear on selection, inline on desktop and in a compact sheet on smaller screens. Tafsir uses existing source paragraph breaks and footnote headings, with independent text-size controls and separate remembered scroll positions for each ayah/source during the reader session.

## Quran haa correction

User identified 1:5 and explicitly requested the two-eyed ھ form. They then requested an existing font instead of a customized font. Quran reading now uses the original, unmodified Noorehira 2.001, which natively supplies the requested initial/medial haa and covers all displayed Quran characters. The custom Wahee Quran font and build script are removed. Source Unicode text and the baseline database remain unchanged. Noorehira draws the source's U+066A code as the intended ruku mark (ع), so the earlier percent-stripping workaround is removed and the marker is preserved. Hadith and Urdu translation typography retain their existing faces. Keep the established reading sizes, spacing, original brand green #367b6c and near-black dark canvas #09090b.

## Arabic wordmark and dark accent

The user requested the logo in the same font as the Quran, the name in Arabic, and the existing dot retained. Shared header and footer branding now reads «وحي» in unmodified Noorehira, with the dot kept at the visual left in either interface locale. The user also replaced the earlier original-green-in-dark requirement with a light green for visibility. Dark accent is now #8bcdbf on the existing #09090b canvas; light mode retains #367b6c. Keep the existing reading typography, spacing and behavior.

## Wordmark alignment

The user identified the Arabic logo sitting too low. Keep its home-link tap area centered with a 44px minimum height; shift the visible lettering and left-side dot together by -0.35em to compensate Noorehira's tall recitation metrics. The correction scales with the existing responsive font sizes and applies to shared headers and footers.
