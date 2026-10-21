import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {getHadithCollections,getHadithBooks,getHadith,getHadithBookPage,searchHadith,decodeHadithUrdu} from '../data/hadith-db';
const files=['bukhari','muslim','tirmazi','abu_dawood','nasai','maja','musnad','mishkat','silsila'];
const hashes=()=>files.map(file=>createHash('sha256').update(readFileSync(`dbs/${file}.db`)).digest('hex'));
const before=hashes();const collections=getHadithCollections();assert.equal(collections.length,9);
let total=0,decoded=0;
for(const [index,c] of collections.entries()){
 const db=new DatabaseSync(`dbs/${files[index]}.db`,{readOnly:true});
 assert.equal(db.prepare('PRAGMA quick_check').get()?.quick_check,'ok');
 assert.equal(c.count,Number(db.prepare('SELECT count(*) AS n FROM hadees').get()?.n));
 const books=getHadithBooks(c.slug);assert.equal(books.length,c.bookCount);assert.equal(books.reduce((n,b)=>n+b.count,0),c.count);
 const firstRecord=db.prepare('SELECT kitab_id FROM hadees WHERE record_id=?');
 for(const book of books){assert.equal(firstRecord.get(book.firstRecord)?.kitab_id,book.id);assert.ok(book.english||book.urdu)}
 assert.ok(getHadithBookPage(c.slug,books[0].id)?.items.length);assert.ok(getHadithBookPage(c.slug,books.at(-1)!.id)?.items.length);
 const last=Number(db.prepare('SELECT max(record_id) AS id FROM hadees').get()?.id);assert.equal(getHadith(c.slug,c.firstRecord)?.previous,null);assert.equal(getHadith(c.slug,last)?.next,null);assert.equal(getHadith(c.slug,last+1),null);
 assert.equal(c.languages.includes('en'),!!getHadith(c.slug,c.firstRecord)?.english);
 for(const row of db.prepare('SELECT hadees FROM hadees_languages WHERE language_id=1').iterate()){
  const original=String(row.hadees);if(!original)continue;const chars=Array.from(original);const recovered=decodeHadithUrdu(original);const restored=Array.from(recovered,(char,i)=>chars[i]==='\n'?'\n':char===' '?'أ':String.fromCodePoint(char.codePointAt(0)!+3)).join('');
  assert.equal(restored,original);decoded++;
 }
 total+=c.count;db.close();
}
assert.equal(getHadith('not-a-collection',1),null);assert.equal(getHadith('bukhari',NaN),null);
assert.equal(getHadith('muslim',1)?.number,0);assert.ok(getHadith('bukhari',1)?.urdu?.text.includes('تمام اعمال'));
assert.equal(getHadithBooks('silsila').length,28);assert.equal(getHadithBooks('musnad-ahmad').length,1176);
assert.ok(searchHadith('intentions','bukhari').items.some(h=>h.id===1));assert.ok(searchHadith('نیت','bukhari').items.length);assert.equal(searchHadith('۱','bukhari').items[0]?.number,1);assert.equal(searchHadith('nonexistent-string-893921').total,0);
assert.deepEqual(hashes(),before);
console.log(`Verified nine collections, ${total.toLocaleString()} records, ${decoded.toLocaleString()} reversible Urdu bodies, actual book catalogs, available languages, search, numbering, and unchanged databases.`);
