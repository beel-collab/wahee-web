import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {editions,getChapter,getChapters,getNavigation,getTafsir,getOpeningTafsir,getVerse,getWords,searchVerses,normalize} from '../data/quran-db';
const hash=()=>createHash('sha256').update(readFileSync('dbs/quranDb.db')).digest('hex');
const before=hash();const db=new DatabaseSync('dbs/quranDb.db',{readOnly:true});
const chapters=getChapters();assert.equal(chapters.length,114);assert.equal(chapters.reduce((n,c)=>n+c.verseCount,0),6236);
for(const c of chapters){const chapter=getChapter(c.id)!;assert.equal(chapter.verses.length,c.verseCount);for(let i=0;i<chapter.verses.length;i++){const v=chapter.verses[i];assert.equal(v.key,`${c.id}:${i+1}`);assert.ok(v.arabic);assert.ok(v.translation);assert.ok(v.juz>=1&&v.juz<=30);assert.ok(v.page>=2&&v.page<=610)}assert.equal(!!chapter.bismillah,c.id!==9)}
for(const e of editions){const c=getChapter(2,e.id)!;assert.equal(c.edition.id,e.id);assert.equal(c.verses.length,286);assert.ok(c.verses[0].translation);assert.ok(!c.verses.some(v=>v.translation.includes('kuhi@')))}
assert.equal(getChapter(0),null);assert.equal(getChapter(115),null);assert.equal(getVerse('2:287'),null);assert.equal(getVerse('1:0'),null);assert.equal(getVerse('2:1 OR 1=1'),null);
const nav=getNavigation();assert.equal(nav.juz.length,30);assert.equal(nav.pages.length,609);
for(const e of [...nav.juz,...nav.pages])assert.ok(getVerse(`${e.chapterId}:${e.verse}`));
assert.equal(getTafsir('maududi','2:255')?.text,String(db.prepare('select tafseer_moudoodi as t from tbl_QuranComplete where surat_id=2 and ayat_number=255').get()?.t).trim());
assert.ok(getTafsir('taqi','1:1')?.text?.includes('تعریف'));assert.equal(getTafsir('missing','1:1'),null);
assert.ok(getOpeningTafsir('maududi',1)?.text?.includes('سورة'));
assert.equal(getWords('1:1')?.[0].root,'ح م د');assert.equal(getWords('1:1')?.length,4);
assert.equal(searchVerses('2:255').results[0].key,'2:255');assert.equal(searchVerses('۲:۲۵۵').results[0].key,'2:255');assert.ok(searchVerses('رحمة').total>0);assert.ok(searchVerses('mercy').total>0);assert.ok(searchVerses('الله').total>0);assert.equal(searchVerses('nonexistent-string-993939').total,0);
assert.equal(normalize('اللّٰہ'),normalize('الله'));assert.equal(hash(),before);
console.log('Verified 114 surahs, 6,236 ayahs, 11 editions, 30 juz, 609 page entries, tafsir, words, search, and unchanged baseline.');
