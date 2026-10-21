"""Recover shifted Urdu text into a new SQLite file; never edit the source.

Usage: python3 scripts/recover_quran_db.py [source.db] [output.db]
"""

import hashlib
import json
import sqlite3
import sys
from itertools import zip_longest
from pathlib import Path


COLUMNS = (
    "aai", "tq", "najfi", "botvi", "tafseer_moudoodi", "moudoodi",
    "k_iman", "translation_urdu", "translation_mufti_taqi", "taqi_tafseer",
)


def decode(text):
    # U+0623 encodes a space. Other characters are shifted by three code points.
    # Four literal LFs already exist in najfi; keep those as line breaks.
    return "".join(
        " " if char == "أ" else "\n" if char == "\n" else chr(ord(char) - 3)
        for char in text
    )


def fingerprint(path):
    with path.open("rb") as file:
        return hashlib.file_digest(file, "sha256").hexdigest()


def quote(name):
    return '"' + name.replace('"', '""') + '"'


def main():
    source = Path(sys.argv[1] if len(sys.argv) > 1 else "quranDb.db").resolve()
    output = Path(sys.argv[2] if len(sys.argv) > 2 else "quranDb.recovered.db").resolve()
    if not source.is_file():
        raise SystemExit(f"Source not found: {source}")
    before = fingerprint(source)
    src = sqlite3.connect(source.as_uri() + "?mode=ro", uri=True)
    # Exclusive creation prevents accidentally overwriting any existing file.
    with output.open("xb"):
        pass
    dst = sqlite3.connect(output)
    src.backup(dst)
    counts = {}
    with dst:
        for column in COLUMNS:
            values = src.execute(
                f"SELECT id, {quote(column)} FROM tbl_QuranComplete "
                f"WHERE {quote(column)} IS NOT NULL AND {quote(column)} != ''"
            ).fetchall()
            decoded = []
            for row_id, text in values:
                recovered = decode(text)
                # Confirm that every character is reversible, including the
                # exceptional pre-existing LF characters at their original positions.
                restored = "".join(
                    "\n" if old == "\n" else "أ" if new == " "
                    else chr(ord(new) + 3)
                    for old, new in zip(text, recovered)
                )
                assert restored == text, (column, row_id, "round-trip failed")
                assert not any(ord(ch) < 32 and ch not in "\n\t\r" for ch in recovered)
                decoded.append((recovered, row_id))
            dst.executemany(
                f"UPDATE tbl_QuranComplete SET {quote(column)} = ? WHERE id = ?",
                decoded,
            )
            counts[column] = len(decoded)

    # Compare every cell in every table: only the explicitly decoded fields may differ.
    tables = [r[0] for r in src.execute("SELECT name FROM sqlite_master WHERE type='table'")]
    checked_rows = 0
    for table in tables:
        columns = [r[1] for r in src.execute(f"PRAGMA table_info({quote(table)})")]
        query = f"SELECT * FROM {quote(table)} ORDER BY rowid"
        for old, new in zip_longest(src.execute(query), dst.execute(query)):
            assert old is not None and new is not None, (table, "row count changed")
            expected = tuple(
                decode(value) if table == "tbl_QuranComplete" and column in COLUMNS
                and value else value
                for column, value in zip(columns, old)
            )
            assert new == expected, (table, "unexpected cell change")
            checked_rows += 1
    integrity = dst.execute("PRAGMA integrity_check").fetchone()[0]
    assert integrity == "ok", integrity
    assert fingerprint(source) == before, "Original database changed"
    report = {
        "source": source.name, "output": output.name, "source_sha256": before,
        "output_sha256": fingerprint(output), "recovered_cells": sum(counts.values()),
        "columns": counts, "verified_rows": checked_rows, "integrity_check": integrity,
        "source_unchanged": True,
        "method": "U+0623 to space; subtract 3 from all other code points; preserve 4 pre-existing LFs.",
        "notes": [
            "Embedded reference links and annotation markers are preserved.",
            "Empty translation fields remain empty; this does not recreate missing content.",
            "Recovery validates the encoding transformation, not editorial or religious accuracy.",
        ],
    }
    preview = []
    for row in dst.execute(
        "SELECT surat_id, ayat_number, translation_urdu, translation_mufti_taqi, "
        "taqi_tafseer FROM tbl_QuranComplete WHERE surat_id=1 ORDER BY id"
    ):
        preview.append(dict(zip(
            ("surat_id", "ayat_number", "translation_urdu", "translation_mufti_taqi", "taqi_tafseer"), row
        )))
    report["preview"] = preview
    report_path = output.with_suffix(".recovery.json")
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    src.close()
    dst.close()
    print(json.dumps({k: v for k, v in report.items() if k != "preview"}, indent=2))
    print(f"Report and sample text: {report_path}")


if __name__ == "__main__":
    main()
