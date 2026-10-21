import {DatabaseSync} from 'node:sqlite';
import path from 'node:path';
import sanitizeHtml from 'sanitize-html';
import {normalize} from './quran-text';
import type {Hadith,HadithBook,HadithCollection,HadithPreview,HadithResults,HadithText} from './hadith-types';

const sources=[
 {slug:'bukhari',file:'bukhari.db',name:'Sahih al-Bukhari',arabicName:'صحیح البخاری'},
 {slug:'muslim',file:'muslim.db',name:'Sahih Muslim',arabicName:'صحیح مسلم'},
 {slug:'tirmidhi',file:'tirmazi.db',name:'Jamiʿ at-Tirmidhi',arabicName:'جامع الترمذی'},
 {slug:'abu-dawud',file:'abu_dawood.db',name:'Sunan Abi Dawud',arabicName:'سنن ابی داود'},
 {slug:'nasai',file:'nasai.db',name:'Sunan an-Nasa’i',arabicName:'سنن النسائی'},
 {slug:'ibn-majah',file:'maja.db',name:'Sunan Ibn Majah',arabicName:'سنن ابن ماجہ'},
 {slug:'musnad-ahmad',file:'musnad.db',name:'Musnad Ahmad',arabicName:'مسند احمد'},
 {slug:'mishkat',file:'mishkat.db',name:'Mishkat al-Masabih',arabicName:'مشکوٰۃ المصابیح'},
 {slug:'silsila',file:'silsila.db',name:'Silsila as-Sahihah',arabicName:'سلسلہ احادیث صحیحہ'},
];
type Row=Record<string,string|number|null>;
const connections=new Map<string,DatabaseSync>();
function database(slug:string){
 const source=sources.find(s=>s.slug===slug);if(!source)return null;
 let db=connections.get(slug);
 if(!db){const directory=process.env.HADITH_DB_DIR?path.resolve(/* turbopackIgnore: true */ process.env.HADITH_DB_DIR):path.join(process.cwd(),'dbs');db=new DatabaseSync(path.join(directory,source.file),{readOnly:true});connections.set(slug,db)}
 return db;
}
function rows(slug:string,sql:string,...args:(string|number)[]){return database(slug)!.prepare(sql).all(...args) as Row[]}
function row(slug:string,sql:string,...args:(string|number)[]){return database(slug)!.prepare(sql).get(...args) as Row|undefined}
export function decodeHadithUrdu(text:string){
 // Only the Urdu body column is encoded. Titles and source notes are already Unicode.
 return Array.from(text,char=>char==='أ'?' ':char==='\n'?'\n':String.fromCodePoint(Math.max(0,char.codePointAt(0)!-3))).join('');
}
export function cleanHadithText(value:unknown){
 return sanitizeHtml(String(value??''),{allowedTags:[],allowedAttributes:{}})
  .replace(/\\u(200[c-f])/gi,(_,hex:string)=>String.fromCodePoint(parseInt(hex,16)))
  .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'')
  .replace(/\r\n?/g,'\n').replace(/[ \t]+/g,' ').trim();
}
let collectionCache:HadithCollection[];
export function getHadithCollections(){
 return collectionCache??=sources.map(({file:_,...s})=>{
  const stats=row(s.slug,'SELECT count(*) AS count,count(distinct kitab_id) AS books,min(record_id) AS firstRecord FROM hadees')!;
  const languages=rows(s.slug,"SELECT DISTINCT language_id FROM hadees_languages WHERE length(trim(hadees))>0").map(l=>Number(l.language_id)===2?'en':'ur') as ('en'|'ur')[];
  return {...s,count:Number(stats.count),bookCount:Number(stats.books),firstRecord:Number(stats.firstRecord),languages:[...new Set(languages)]};
 });
}
export function getHadithCollection(slug:string){return getHadithCollections().find(c=>c.slug===slug)??null}
const bookCache=new Map<string,HadithBook[]>();
export function getHadithBooks(slug:string):HadithBook[]{
 if(!sources.some(s=>s.slug===slug))return [];
 let books=bookCache.get(slug);if(books)return books;
 const stats=rows(slug,'SELECT kitab_id AS id,count(*) AS count,min(record_id) AS firstRecord,min(hadees_number) AS firstNumber,max(hadees_number) AS lastNumber FROM hadees GROUP BY kitab_id ORDER BY min(record_id)');
 const titles=rows(slug,'SELECT h.kitab_id,l.language_id,l.kitab FROM hadees h JOIN hadees_languages l ON l.hadees_record_id=h.record_id WHERE h.record_id IN (SELECT min(record_id) FROM hadees GROUP BY kitab_id)');
 books=stats.map(s=>({id:Number(s.id),count:Number(s.count),firstRecord:Number(s.firstRecord),firstNumber:Number(s.firstNumber),lastNumber:Number(s.lastNumber),english:cleanHadithText(titles.find(t=>t.kitab_id===s.id&&t.language_id===2)?.kitab),urdu:cleanHadithText(titles.find(t=>t.kitab_id===s.id&&t.language_id===1)?.kitab)}));
 bookCache.set(slug,books);return books;
}
function translated(r:Row,urdu:boolean):HadithText{return {text:cleanHadithText(urdu?decodeHadithUrdu(String(r.hadees??'')):r.hadees),chapter:cleanHadithText(r.baab),book:cleanHadithText(r.kitab),narrator:cleanHadithText(r.ravi),references:cleanHadithText(r.Takhreej),notes:cleanHadithText(r.wazahat)}}
export function getHadith(slug:string,id:number):Hadith|null{
 if(!sources.some(s=>s.slug===slug)||!Number.isSafeInteger(id)||id<1)return null;
 const h=row(slug,'SELECT * FROM hadees WHERE record_id=?',id);if(!h)return null;
 const texts=rows(slug,'SELECT * FROM hadees_languages WHERE hadees_record_id=?',id);
 const en=texts.find(t=>t.language_id===2),ur=texts.find(t=>t.language_id===1);
 const adjacent=row(slug,'SELECT (SELECT max(record_id) FROM hadees WHERE record_id<?) AS previous,(SELECT min(record_id) FROM hadees WHERE record_id>?) AS next',id,id)!;
 const position=row(slug,'SELECT count(*) AS n FROM hadees WHERE kitab_id=? AND record_id<?',Number(h.kitab_id),id)!;
 return {collection:slug,id,number:Number(h.hadees_number),internationalNumber:Number(h.international_number),bookId:Number(h.kitab_id),arabic:cleanHadithText(h.arabic),english:en?translated(en,false):null,urdu:ur?translated(ur,true):null,previous:adjacent.previous===null?null:Number(adjacent.previous),next:adjacent.next===null?null:Number(adjacent.next),bookPage:Math.floor(Number(position.n)/20)+1};
}
function previews(slug:string,records:Row[]):HadithPreview[]{
 if(!records.length)return [];
 const texts=rows(slug,`SELECT hadees_record_id,language_id,hadees FROM hadees_languages WHERE hadees_record_id IN (${records.map(()=>'?').join(',')})`,...records.map(h=>Number(h.record_id)));
 return records.map(h=>{const en=texts.find(t=>t.hadees_record_id===h.record_id&&t.language_id===2),ur=texts.find(t=>t.hadees_record_id===h.record_id&&t.language_id===1);return {collection:slug,id:Number(h.record_id),number:Number(h.hadees_number),bookId:Number(h.kitab_id),arabic:cleanHadithText(h.arabic).slice(0,240),english:cleanHadithText(en?.hadees).slice(0,240),urdu:ur?cleanHadithText(decodeHadithUrdu(String(ur.hadees??''))).slice(0,240):''}});
}
export function getHadithBookPage(slug:string,bookId:number,page=1):HadithResults|null{
 const book=getHadithBooks(slug).find(b=>b.id===bookId);if(!book)return null;
 page=Math.min(Math.ceil(book.count/20),Math.max(1,Math.floor(page)||1));
 return {items:previews(slug,rows(slug,'SELECT record_id,hadees_number,kitab_id,arabic FROM hadees WHERE kitab_id=? ORDER BY record_id LIMIT 20 OFFSET ?',bookId,(page-1)*20)),total:book.count,page,pageSize:20};
}
const searchCache=new Map<string,HadithResults>();
export function searchHadith(query:string,collection='',page=1):HadithResults{
 const q=query.trim().slice(0,160);const normalized=normalize(q);page=Math.max(1,Math.floor(page)||1);
 const empty={items:[],total:0,page:1,pageSize:20};
 if(!q||(!/^\d+$/.test(normalized)&&q.length<2))return empty;
 const selected=sources.filter(s=>!collection||s.slug===collection);if(!selected.length)return empty;
 const cacheKey=JSON.stringify([q,collection,page]);const cached=searchCache.get(cacheKey);if(cached)return cached;
 const literal=(s:string)=>`%${s.replace(/[\\%_]/g,'\\$&')}%`;
 const encoded=Array.from(q,c=>c===' '?'أ':String.fromCodePoint(c.codePointAt(0)!+3)).join('');
 const numeric=/^\d+$/.test(normalized);
 const where=numeric?'h.hadees_number=?':"(h.arabic_without_aeraab LIKE ? ESCAPE '\\' OR l.hadees LIKE ? ESCAPE '\\' OR l.hadees LIKE ? ESCAPE '\\' OR l.baab LIKE ? ESCAPE '\\')";
 const args=numeric?[Number(normalized)]:[literal(normalized),literal(q),literal(encoded),literal(q)];
 const from='FROM hadees h JOIN hadees_languages l ON l.hadees_record_id=h.record_id';
 const counts=selected.map(s=>({slug:s.slug,count:Number(row(s.slug,`SELECT count(distinct h.record_id) AS n ${from} WHERE ${where}`,...args)!.n)}));
 const total=counts.reduce((n,c)=>n+c.count,0);page=Math.min(Math.max(1,Math.ceil(total/20)),page);
 let offset=(page-1)*20;const items:HadithPreview[]=[];
 for(const c of counts){if(offset>=c.count){offset-=c.count;continue}const matched=rows(c.slug,`SELECT DISTINCT h.record_id,h.hadees_number,h.kitab_id,h.arabic ${from} WHERE ${where} ORDER BY h.record_id LIMIT ? OFFSET ?`,...args,20-items.length,offset);items.push(...previews(c.slug,matched));offset=0;if(items.length===20)break}
 const result={items,total,page,pageSize:20};if(searchCache.size>=24)searchCache.delete(searchCache.keys().next().value!);searchCache.set(cacheKey,result);return result;
}
