import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {arabicText} from '../data/quran-db';
import {cleanHadithText} from '../data/hadith-db';
import {hadithArabicParts,hasLegacyHadithArabic} from '../data/hadith-text';

// Check actual cmap glyph IDs, rather than relying on browser font fallback.
const font=readFileSync('public/fonts/ScheherazadeNew-Regular.ttf');
let cmap=0;
for(let i=0;i<font.readUInt16BE(4);i++){
 const entry=12+16*i;
 if(font.toString('ascii',entry,entry+4)==='cmap')cmap=font.readUInt32BE(entry+8);
}
assert.ok(cmap,'Font must contain a Unicode character map');
function hasGlyph(code:number){
 for(let i=0;i<font.readUInt16BE(cmap+2);i++){
  const table=cmap+font.readUInt32BE(cmap+8+8*i),format=font.readUInt16BE(table);
  if(format===4&&code<=0xffff){
   const count=font.readUInt16BE(table+6)/2;
   const end=table+14,start=end+2*count+2,delta=start+2*count,ranges=delta+2*count;
   for(let j=0;j<count;j++){
    const first=font.readUInt16BE(start+2*j),last=font.readUInt16BE(end+2*j);
    if(code<first||code>last)continue;
    const adjustment=font.readInt16BE(delta+2*j),offset=font.readUInt16BE(ranges+2*j);
    const glyph=offset?font.readUInt16BE(ranges+2*j+offset+2*(code-first)):code;
    if((!offset||glyph!==0)&&((glyph+adjustment)&0xffff)!==0)return true;
   }
  }else if(format===12){
   for(let j=0;j<font.readUInt32BE(table+12);j++){
    const group=table+16+12*j,first=font.readUInt32BE(group),last=font.readUInt32BE(group+4);
    if(code>=first&&code<=last&&font.readUInt32BE(group+8)+code-first!==0)return true;
   }
  }
 }
 return false;
}
const db=new DatabaseSync('dbs/quranDb.db',{readOnly:true});
const characters=new Set<string>();
for(const row of db.prepare('SELECT arabic FROM tbl_QuranComplete').iterate())for(const char of arabicText(row.arabic))if(!/\s/u.test(char))characters.add(char);
const missing=[...characters].filter(char=>!hasGlyph(char.codePointAt(0)!));
assert.deepEqual(missing,[],'Every Quran character must exist in the bundled font');
assert.ok(hasGlyph(0x06c1),'Haa (ہ) must not use a fallback font');
assert.ok(hasGlyph(0x06c3),'Teh marbuta (ۃ) must not use a fallback font');
db.close();
console.log(`Font verified: all ${characters.size} displayed Quran characters, including ہ and ۃ, have actual glyphs.`);
const hadithCharacters=new Set<string>();
let legacyRecords=0;
for(const name of ['bukhari','muslim','tirmazi','abu_dawood','nasai','maja','musnad','mishkat','silsila']){
 const source=new DatabaseSync(`dbs/${name}.db`,{readOnly:true});
 for(const row of source.prepare('SELECT arabic FROM hadees').iterate()){
  const text=cleanHadithText(row.arabic);if(hasLegacyHadithArabic(text))legacyRecords++;
  for(const part of hadithArabicParts(text))if(!part.legacy)for(const char of part.text)if(!/[\s\p{Cf}]/u.test(char))hadithCharacters.add(char);
 }
 source.close();
}
assert.deepEqual([...hadithCharacters].filter(char=>!hasGlyph(char.codePointAt(0)!)),[],'Every displayed Hadith source character must exist in the bundled font');
console.log(`Font verified: all ${hadithCharacters.size} visible characters in the nine Hadith Arabic sources have actual glyphs.`);
console.log(`${legacyRecords} source records contain legacy font fragments, explicitly marked by the reader rather than rendered as unrelated letters.`);
