---
name: Wahee
description: A quiet space for reading the Quran and Hadith.
colors:
  bg: "#fff"
  side: "#f8faf8"
  ink: "#283a35"
  muted: "#63756d"
  line: "#e1e8e3"
  accent: "#367b6c"
  soft: "#edf5f0"
  hero: "#f3f6f2"
  dark-bg: "#09090b"
  dark-side: "#111113"
  dark-ink: "#f0f0f2"
  dark-muted: "#a5a5ad"
  dark-line: "#2b2b31"
  dark-accent: "#367b6c"
  dark-soft: "#191b1c"
  dark-hero: "#131315"
  sepia-bg: "#faf5e9"
  sepia-side: "#f4eddf"
  sepia-ink: "#514638"
  sepia-muted: "#766a55"
  sepia-line: "#e2d9c7"
  sepia-accent: "#736333"
  sepia-soft: "#efe9d6"
  sepia-hero: "#f0eadc"
typography:
  display:
    fontFamily: "Georgia, serif"
    fontSize: "38px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-1px"
  headline:
    fontFamily: "Georgia, serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.5px"
  title:
    fontFamily: "Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "14px"
    lineHeight: 1.8
  label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "13px"
    fontWeight: 500
  brand:
    fontFamily: "Georgia, serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-1.2px"
  quran:
    fontFamily: "Quran, serif"
    fontSize: "34px"
    fontWeight: 400
    lineHeight: 2.4
  urdu:
    fontFamily: "Urdu, serif"
    fontSize: "21px"
    lineHeight: 2.8
  tafsir:
    fontFamily: "Urdu, serif"
    fontSize: "20px"
    lineHeight: 2.5
  word-arabic:
    fontFamily: "Quran, serif"
    fontSize: "32px"
    lineHeight: 1.95
  word-meaning:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "14px"
    lineHeight: 1.65
  word-meaning-urdu:
    fontFamily: "Urdu, serif"
    fontSize: "18px"
    lineHeight: 2.3
  welcome-display:
    fontFamily: "Georgia, serif"
    fontSize: "clamp(34px, 4vw, 48px)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  library-heading:
    fontFamily: "Georgia, serif"
    fontSize: "37px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  hadith-arabic:
    fontFamily: "Quran, serif"
    fontSize: "32px"
    lineHeight: 2.1
  hadith-translation:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "20px"
    lineHeight: 1.95
  hadith-urdu:
    fontFamily: "Urdu, serif"
    fontSize: "22px"
    lineHeight: 2.7
  hadith-urdu-narrator:
    fontFamily: "Urdu, serif"
    fontSize: "20px"
    lineHeight: 2.7
rounded:
  control: "8px"
  surface: "12px"
  sheet: "18px"
  segmented: "6px"
  tab-track: "24px"
  tab: "20px"
  marker: "50%"
spacing:
  "4": "4px"
  "8": "8px"
  "12": "12px"
  "16": "16px"
  "20": "20px"
  "24": "24px"
  "28": "28px"
  "32": "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "10px 17px"
  button-secondary:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "10px 17px"
  button-secondary-hover:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.accent}"
  button-icon:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    size: "40px"
  search:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "8px 12px 8px 19px"
  quick-link:
    backgroundColor: "{colors.hero}"
    rounded: "{rounded.tab}"
    padding: "8px 12px"
  tab-selected:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.accent}"
    rounded: "{rounded.tab}"
    padding: "9px 17px"
  resume-card:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "22px 26px"
  tafsir-panel:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    width: "clamp(420px, 36vw, 520px)"
    height: "100dvh"
  word-unit:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 12px 13px"
  word-language-selected:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.accent}"
    rounded: "{rounded.segmented}"
    padding: "7px 12px"
  word-sheet:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
---

# Design System: Wahee

## Overview

**Creative North Star: "A quiet space for the Quran and Hadith"**

Wahee brings the Quran and Hadith into its incumbent calm identity with white space, muted teal, editorial serif headings, and clear sans serif controls. The reading text carries the visual weight. Navigation and study tools use smaller type and quieter surfaces so the passage remains easy to find when moving between reading and source context.

The system supports Arabic and Urdu as primary reading materials. Their bundled fonts, generous line spacing, independent text direction, and adjustable sizes belong to the visual system. Light, dark, and sepia are complete reading environments, with the same component relationships expressed through theme variables.

**Key Characteristics:**
- A single generous reading column with fine dividers.
- Muted teal actions and restrained tonal surfaces.
- Georgia headings and brand paired with Arial controls.
- Bundled Quran and Urdu faces with room for their marks and descenders.
- Compact wayfinding that becomes a drawer on mobile.

## Colors

The palette uses one primary accent, green tinted light neutrals, and corresponding near-black and warm paper reading themes. Frontmatter records the exact values; `app/globals.css` supplies the live CSS variables.

### Primary

- **Muted Teal** (`accent`): active navigation, links, bookmark state, calligraphy, focus outlines, and filled actions.
- **Muted Teal** (`dark-accent`): the original brand green, preserved in dark mode.
- **Warm Olive** (`sepia-accent`): the same action roles on sepia paper.

### Neutral

- **Reading Paper** (`bg`): the page, controls, selected tabs, and dialogs.
- **Quiet Edge** (`side`): footer and subdued hover surfaces.
- **Forest Ink** (`ink`): primary text, including Quran text.
- **Sage Text** (`muted`): supporting copy, locations, counts, and metadata.
- **Fine Sage Line** (`line`): verse dividers, list dividers, and control borders.
- **Mint Wash** (`soft`): resume reading, selected navigation, status panels, and hovered controls.
- **Pale Sage Panel** (`hero`): chapter identity, tab tracks, quick links, and compact input fills.

Each neutral has a `dark-` and `sepia-` counterpart. Those counterparts replace the matching CSS variable together; they are not additional accents. Tafsir and word study inherit the same theme roles from the reader.

**The Theme Role Rule.** Use the live `--bg`, `--side`, `--ink`, `--muted`, `--line`, `--accent`, `--soft`, and `--hero` roles for themed surfaces and controls.

## Typography

**Display and heading font:** Georgia with a serif fallback. **Control and Latin body font:** Arial, Helvetica, sans-serif. **Quran font:** bundled Scheherazade New, exposed as `Quran`. **Urdu font:** bundled Noto Nastaliq Urdu, exposed as `Urdu`.

The serif face gives page titles a reflective, editorial character. Smaller sans serif controls remain practical and legible. Quran and Urdu text use their own metrics rather than inheriting control line heights.

### Hierarchy

- **Display:** the Quran directory heading uses the display token; it reduces to (31px) on mobile. The front-door heading uses welcome-display, reducing to (34px) at (760px). Library headings use library-heading, reducing to (31px). Quran search page headings use (36px), reducing to (30px).
- **Headline:** chapter headings use the headline token, reducing to (27px) on mobile. Directory headings use (29px), reducing to (25px).
- **Title:** tafsir headings use the sans serif title token, reducing to (17px) below (1180px). Supporting card titles use sans serif (15–18px).
- **Body:** introductory copy uses the body token. Latin translations default to (19px) with a (1.9) line height and a maximum measure of (75ch).
- **Label:** controls primarily use (12–13px); secondary metadata uses (9–12px). Location numbers use tabular numerals.
- **Quran:** ayahs default to the quran token and can be adjusted from (26px) to (56px). Reading mode increases the line height to (2.7). Bismillah uses (32px/2), reducing to (26px) on mobile.
- **Urdu:** translations default to the urdu token and use unrestricted paragraph width. Translation size is adjustable from (16px) to (32px). Tafsir independently defaults to (20px/2.5), adjusts from (18px) to (28px) in (2px) steps, and separates source paragraphs with (1.35em) bottom margins. Source footnote headings use the same face at (0.85em) in muted text.
- **Word study:** Arabic defaults to the word-arabic token and follows the ayah size, clamped to (26–40px). Each word pairs with one meaning: Latin (14px/1.65) or Urdu (18px/2.3). Selected details use Latin (16px/1.8) or Urdu (20px/2.5), with Quran roots and lemmas (26px/1.9). Study metadata and compact controls use (11–13px); expanded ayah context uses Quran (28px) and Latin (15px/1.9) or Urdu (19px/2.6).
- **Hadith:** selected translations lead at Latin (20px/1.95) or Urdu (22px/2.7), with Latin measure capped at (73ch). Reading size adjusts from (16px) to (28px) in (2px) steps; Urdu adds (2px) and Arabic adds (12px), making Arabic default to (32px/2.1), with mobile line height (2.15). Source narrators in Urdu retain (20px/2.7) Nastaliq and right-to-left direction even inside an English translation. Source paragraph breaks remain visible.
- **Calligraphy:** Quran directory calligraphy uses (52px/1.8), reducing to (44px). Chapter calligraphy uses (40px/1.7), reducing to (30px) and moving to another flex row when space is limited. Front-door entrance calligraphy uses (43px/1.9), reducing to (37px/1.7).

Library interface headings in Urdu use the bundled Urdu face with (2.3) line height and no tracking; their script is independent of the selected passage language.

**The Reading Metrics Rule.** Preserve the Quran and Urdu font families, independent right to left direction, and generous line heights when reusing reading content. Keep chapter calligraphy together as one unbroken name while allowing its container to move to another row.

## Layout

The top header is a horizontal band (76px desktop, 66px mobile) with a serif wordmark, main links, language switch, and theme action. A sticky chapter bar sits at the top of the reader viewport (minimum 61px desktop, 58px mobile).

The root route (`/`) is a four-section front door. Quran and Hadith are the two generous reading entrances, side by side with a (24px) gap on desktop and stacked at (760px). Seerah and Duas follow as quieter ruled rows explicitly marked upcoming. The front door and Hadith library share a maximum width of (1180px), with (44px) desktop and (23px) mobile side padding.

The existing Quran directory now lives at `/quran`. Its container retains a maximum width of (1250px), with (40px) desktop and (22px) mobile side padding. Its search field stops at (690px). Resume reading and saved ayahs share a two column row, then stack on mobile. The surah directory is a divided list in three columns, two at (1100px), and one at (760px). The juz list reduces from three columns to two at (760px).

Hadith collection and book directories use two ruled columns, becoming one at (760px). Collection and book context precede their records. The Hadith reader stops at (980px), with (50px) desktop and (23px) mobile side padding. It uses one generous text column, with a sticky bottom footer for previous, back-to-book, and next links. The back-to-book route retains the passage's numbered range.

The reader workspace stops at (1600px). Its main column stops at (1060px), with (55px) desktop side padding and (23px) on mobile. The ayah section stops at (920px). Opening navigation docks a (295px) sidebar beside the text on desktop; the main padding reduces to (36px). At (760px) the sidebar becomes a fixed, full height drawer, at most (320px) or (88vw), over a dimmed backdrop.

At widths of (1180px) and above, tafsir docks at the inline end as a nonmodal region with width `clamp(420px, 36vw, 520px)` and full viewport height. The reader reserves the same width and remains usable beside it. Desktop can expand tafsir to the full viewport; smaller screens always use the focused full-screen view. Full-screen header, controls, and navigation stop at (880px), while the scrollable body stops at (820px). Header, source and size controls, scrolling commentary, and previous/next footer are separate regions. Back and browser Back return to the preserved Quran position.

Word-by-word stays inside its ayah, replacing the continuous Arabic line with a wrapping right-to-left flow of word units. Each unit keeps Arabic above one chosen meaning language. Selected root and lemma details appear below the flow at (1180px) and above; smaller screens use a native dialog sheet, at most (75dvh) tall, anchored to the bottom with safe-area padding. Word units use (16px 8px) row and column gaps, reducing to (14px 5px) below (1180px).

Spacing is based on repeated (4px) increments, with larger reading gaps and surface padding chosen for text measure. Verses use generous vertical padding and fine bottom rules rather than enclosed cards. The reader renders long chapters in ranges of 30 ayahs, retaining the same continuous column.

## Elevation & Depth

The ordinary page is flat. Background tone and fine borders separate content; shadows identify floating UI or a selected tab. There are no decorative shadows on surah rows or reading verses.

### Shadow Vocabulary

- **Selected tab:** `0 2px 5px #173c2710` gives a small lift within the tab track.
- **Settings:** `0 15px 65px #102b2626` separates the floating settings panel.
- **Toast:** `0 8px 30px #172b2220` separates brief feedback from reading content.
- **Word detail sheet:** `0 -12px 50px #0003` separates the compact bottom sheet from the reader.
- **Mobile drawer:** `10px 0 45px #102b2629` marks the navigation edge above the page.

Docked and full-screen tafsir use flat page surfaces with no shadow or dimmed backdrop; a fine border separates the docked region. The native word sheet backdrop uses `#0008`; the mobile navigation backdrop uses `#142b2560`. Smooth scrolling is the main motion. Reduced motion removes smooth scrolling, transitions, and animation.

## Shapes

Controls use gently curved corners (8px). Search, hero, resume, bookmark, and settings surfaces use larger corners (12px). Tafsir has square outer corners in docked and full-screen views. Word detail sheets use top corners (18px) and square bottom corners. The word language track uses (8px) corners with smaller selected segments (6px). Tab tracks and quick links are pill shaped, while verse numbers use a circular outlined marker. Theme choices and verse action buttons use small local variations (7px). Lines remain thin (1px); the selected main navigation link uses a (2px) bottom rule.

## Components

### Buttons

Primary and secondary actions are compact, calm, and text led. Both have a minimum height of (42px), (10px 17px) padding, and the control radius. Primary uses accent fill with page colored text and a subtle opacity change on hover. Secondary uses a page fill and fine border; hover adds the soft surface and accent text. Disabled buttons reduce opacity to (0.4).

Icon buttons are at least (40px) square and add a soft surface on hover. Ayah actions use (36px) targets; mobile increases their height to (38px). All keyboard focusable controls receive an accent outline (2px) with a (4px) offset.

Tafsir source, text size, Back, and previous/next controls use a minimum height of (44px). Word language and sheet close controls also use (44px) targets. These study-specific targets do not change the incumbent control sizes elsewhere.

### Chips

Quran directory quick links use the hero surface, pill corners, small labels (11px), and (8px 12px) padding. Hover changes them to the soft surface with accent text. They are direct navigation links rather than selectable filters.

### Tabs

The tab track uses the hero surface and small internal padding (4px). The selected pill uses page fill, accent text, and the selected tab shadow. Desktop labels use (13px); mobile uses (12px). Sidebar navigation tabs use a smaller version of the same surface relationship.

### Cards / Containers

Resume reading uses the soft surface; saved ayahs uses a page surface with a fine border. Both use surface corners and (22px 26px) desktop padding. Surah entries are open divided rows, with their number, Latin identity, metadata, and Quran name aligned horizontally. Hover adds the side surface. Verse content likewise stays open, with a fine bottom divider; a directly targeted verse adds a soft background and control corners.

Front-door reading entrances use surface corners with (30px 32px) desktop padding. Quran uses the soft surface; Hadith uses a page surface and fine border. Upcoming sections use ruled rows with smaller headings and an explicit coming-soon label. Hadith collections, books, and preview records continue the open-row treatment, with side-surface hover and no cover artwork or raised card effects.

### Inputs / Fields

The main search is a wide, bordered surface with an accent icon, a borderless inner input, and a soft submit button. Focus within changes the outer border to accent. Compact search uses a hero filled input with control corners and (11px 12px) padding. Selects use page fill, fine borders, control corners, and a minimum height of (40px).

### Navigation

Main links pair line icons with labels. Quran (`/quran`) and Hadith (`/hadith`) remain the global reading destinations; the brand returns to `/`. Search and saved links follow the current reading section: Quran uses `/search` and `/bookmarks`, while Hadith uses `/hadith/search` and `/hadith/saved`. The front door and upcoming sections show the two main reading links. Muted text becomes accent with an accent bottom rule for the current section. At (760px), the labels hide and the named icons remain. The chapter navigation contains a compact tab group, search, scrollable rows, and a saved ayahs footer. Selected and hovered rows use the soft surface and accent text. Direction follows the interface locale, while Arabic and Urdu reading blocks set their own direction.

### Ayah and Study

Each ayah starts with a small location and actions row, followed by right aligned Quran text and an outlined circular number. Translation sits below it. Bookmark state uses accent color and a filled bookmark icon. The active tafsir ayah receives a hero surface; active tafsir and word actions use accent text with a soft background.

Tafsir is a docked nonmodal region on wide screens and a focused full-screen reading view below (1180px), with optional desktop expansion. It has a source selector and independent text-size controls, an expandable ayah-and-translation context, one Urdu commentary column, and a previous/next footer. Source paragraphs remain separate and footnote headings remain quiet. Returning to an ayah/source restores its own commentary scroll position during the reader session. Full-screen study contains keyboard focus, makes the reader inert, and provides Back; docked study keeps the Quran available and provides a direct ayah reveal action.

Word-by-word toggles inline per ayah. A compact English/Urdu selector chooses one meaning language; the wrapping Arabic word sequence remains right to left. Hover adds a hero surface; selection adds soft fill and an accent border. Root and lemma stay hidden until selection, then appear inline on wide screens or in the compact native dialog sheet below (1180px). Closing word details restores focus to the selected word. Tafsir and word meanings retain distinct reading patterns. Loading, unavailable content, and retry states use the existing status or empty state patterns rather than fabricated commentary.

### Hadith Reading

The source reference and book context precede language and text-size controls. Selected Urdu or English translations lead; a native details summary above them reveals the complete Arabic source. Arabic-only mode shows the source continuously. The Arabic preview truncates within its summary rather than displacing the chosen translation. Translation selectors and passage action buttons are (44px) high; footer navigation reaches the same height on mobile.

References and explanation use separate native details rows with fine rules and accent summaries. Narrator script follows the actual source, including Urdu narrator lines attached to English records. Source text, notes, numbering, and any supplied metadata remain faithful to the collection; undocumented status codes do not become authenticity badges. Legacy glyph fragments in affected Silsila records receive explicit source-symbol markers and an explanatory notice, while available translations remain readable. Saved passages and reading preferences stay on the device.

## Do's and Don'ts

### Do:
- **Do** use theme roles together so light, dark, and sepia preserve the same hierarchy.
- **Do** keep ayahs in one generous column, with fine dividers and compact actions above the reading text.
- **Do** use Georgia for editorial headings, Arial for controls, and the bundled reading fonts for Quran and Urdu content.
- **Do** retain visible keyboard focus and respect the reduced motion preference.
- **Do** let chapter calligraphy move to its own row on narrow screens while keeping the name intact.

### Don't:
- **Don't** turn surah rows or ayahs into raised cards; the shipped reading surfaces use open rows and dividers.
- **Don't** apply Latin control line heights to Quran or Nastaliq text.
- **Don't** hard code light theme colors into new themed surfaces.
- **Don't** place a fixed width navigation column beside the reader on mobile; use the dismissible drawer.
