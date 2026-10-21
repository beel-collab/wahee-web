import {DatabaseSync} from 'node:sqlite';
import path from 'node:path';
import sanitizeHtml from 'sanitize-html';
import catalog from './chapters.json';
import type {Chapter,ChapterSummary,Edition,QuranNavigation,Verse,Topic,SearchResult,Word,TafsirResource,TafsirPassage} from './quran-types';

let connection:DatabaseSync;
function db(){
 const databasePath=process.env.QURAN_DB_PATH
  ? path.resolve(/* turbopackIgnore: true */ process.env.QURAN_DB_PATH)
  : path.join(process.cwd(),'dbs','quranDb.db');
 connection??=new DatabaseSync(databasePath,{readOnly:true});
 return connection;
}
type Row=Record<string,string|number|null>;
const all=(sql:string,...params:(string|number)[])=>db().prepare(sql).all(...params) as Row[];
const one=(sql:string,...params:(string|number)[])=>db().prepare(sql).get(...params) as Row|undefined;
export function plain(value:unknown){return sanitizeHtml(String(value??''),{allowedTags:[],allowedAttributes:{}}).replace(/\s+/g,' ').trim()}
// Strip duplicated source numbering and private-use page annotations. Keep
// U+066A: Noorehira renders this legacy source code as the intended ruku mark.
export function arabicText(value:unknown){return String(value??'').replace(/﴿[^﴾]*﴾/g,'').replace(/[\uE000-\uF8FF].*$/u,'').replace(/\s+/g,' ').trim()}
export {normalize} from './quran-text';
import {normalize} from './quran-text';
const editionColumns:Record<string,string>={english:'translation_english',urdu:'translation_urdu',taqi:'translation_mufti_taqi',maududi:'moudoodi',kanz:'k_iman',najfi:'najfi',botvi:'botvi',aai:'aai',tq:'tq',roman:'translation_roman_urdu',hindi:'hindi_nazar'};
export const editions:Edition[]=[
 {id:'english',name:'English translation',language:'en',direction:'ltr'},
 {id:'urdu',name:'اردو · بنیادی ترجمہ',language:'ur',direction:'rtl'},
 {id:'taqi',name:'اردو · مفتی تقی عثمانی',language:'ur',direction:'rtl'},
 {id:'maududi',name:'اردو · مودودی',language:'ur',direction:'rtl'},
 {id:'kanz',name:'اردو · کنز الایمان',language:'ur',direction:'rtl'},
 {id:'najfi',name:'اردو · نجفی',language:'ur',direction:'rtl'},
 {id:'botvi',name:'اردو · بوٹوی',language:'ur',direction:'rtl'},
 {id:'aai',name:'اردو · AAI',language:'ur',direction:'rtl'},
 {id:'tq',name:'اردو · TQ',language:'ur',direction:'rtl'},
 {id:'roman',name:'Roman Urdu',language:'ur-Latn',direction:'ltr'},
 {id:'hindi',name:'हिन्दी · नज़र',language:'hi',direction:'ltr'},
];
export const tafsirResources:TafsirResource[]=[
 {id:'maududi',name:'تفہیم القرآن',author:'مولانا مودودی',language:'ur',direction:'rtl'},
 {id:'taqi',name:'تفسیر · مفتی تقی عثمانی',author:'مفتی تقی عثمانی',language:'ur',direction:'rtl'},
];
export function getEdition(id='english'){return editions.find(e=>e.id===id)??editions[0]}
let chapterCache:ChapterSummary[];
export function getChapters(){
 if(chapterCache)return chapterCache;
 const rows=all('SELECT q.surat_id,count(*) AS count,min(q.para_id) AS juz,min(l.Line15_PageNo) AS page FROM tbl_QuranComplete q JOIN tbl_LineQuran l ON l.ayat_id=q.id WHERE q.ayat_number>0 GROUP BY q.surat_id');
 chapterCache=rows.map(row=>{const c=catalog.chapters.find(c=>c.number===row.surat_id)!;return {id:c.number,name:c.englishName,arabicName:c.name,meaning:c.englishNameTranslation,verseCount:Number(row.count),revelation:c.revelationType,juz:Number(row.juz),page:Number(row.page)}});
 return chapterCache;
}
function verse(row:Row):Verse{return {id:Number(row.id),number:Number(row.ayat_number),key:`${row.surat_id}:${row.ayat_number}`,chapterId:Number(row.surat_id),arabic:arabicText(row.arabic),translation:plain(row.translation),juz:Number(row.para_id),page:Number(row.page)}}
function projection(edition:string){return `q.id,q.surat_id,q.ayat_number,q.arabic,q.para_id,l.Line15_PageNo AS page,q.${editionColumns[getEdition(edition).id]} AS translation`}
export function getChapter(id:number,editionId='english'):Chapter|null{
 const chapter=getChapters().find(c=>c.id===id);if(!chapter)return null;
 const bismillah=one('SELECT arabic, length(tafseer_moudoodi)+length(taqi_tafseer) AS notes FROM tbl_QuranComplete WHERE surat_id=? AND ayat_number=0',id);
 return {...chapter,edition:getEdition(editionId),openingNotes:Number(bismillah?.notes)>0,bismillah:bismillah?arabicText(bismillah.arabic):null,verses:all(`SELECT ${projection(editionId)} FROM tbl_QuranComplete q JOIN tbl_LineQuran l ON l.ayat_id=q.id WHERE q.surat_id=? AND q.ayat_number>0 ORDER BY q.ayat_number`,id).map(verse)};
}
export function getVerse(key:string,editionId='english'){
 if(!/^\d{1,3}:\d{1,3}$/.test(key))return null;
 const [s,a]=key.split(':').map(Number);if(a<1)return null;
 const row=one(`SELECT ${projection(editionId)} FROM tbl_QuranComplete q JOIN tbl_LineQuran l ON l.ayat_id=q.id WHERE q.surat_id=? AND q.ayat_number=?`,s,a);
 return row?verse(row):null;
}
export function getNavigation():QuranNavigation{
 const entries=(rows:Row[])=>rows.map(r=>({number:Number(r.n),chapterId:Number(r.surat_id),verse:Number(r.ayat_number),name:getChapters().find(c=>c.id===r.surat_id)!.name}));
 return {
  juz:entries(all('SELECT q.para_id AS n,q.surat_id,q.ayat_number FROM tbl_QuranComplete q WHERE q.ayat_number>0 GROUP BY q.para_id HAVING q.id=min(q.id) ORDER BY q.para_id')),
  // Page numbers follow the supplied 15-line edition (2–610).
  pages:entries(all('SELECT l.Line15_PageNo AS n,q.surat_id,q.ayat_number FROM tbl_QuranComplete q JOIN tbl_LineQuran l ON l.ayat_id=q.id WHERE q.ayat_number>0 GROUP BY l.Line15_PageNo HAVING q.id=min(q.id) ORDER BY l.Line15_PageNo'))
 };
}
export function getOpeningTafsir(id:string,chapterId:number):TafsirPassage|null{
 if(!getChapters().some(c=>c.id===chapterId))return null;
 return readTafsir(id,`${chapterId}:0`);
}
export function getTafsir(id:string,key:string):TafsirPassage|null{
 if(!getVerse(key))return null;
 return readTafsir(id,key);
}
function readTafsir(id:string,key:string):TafsirPassage|null{
 const resource=tafsirResources.find(r=>r.id===id);if(!resource)return null;
 const [s,a]=key.split(':').map(Number);
 const row=one(`SELECT ${id==='maududi'?'tafseer_moudoodi':'taqi_tafseer'} AS text FROM tbl_QuranComplete WHERE surat_id=? AND ayat_number=?`,s,a);
 return {resource,verseKey:key,text:String(row?.text??'').trim()||null};
}
export function getWords(key:string):Word[]|null{
 if(!getVerse(key))return null;
 const [s,a]=key.split(':').map(Number);
 return all('SELECT id,word_id,arabic_word,root,lemma,english_meaning,urdu_meaning,position_grammar_1,position_grammar_2,position_grammar_3,position_grammar_4,position_grammar_5 FROM tbl_arabic_words WHERE arabic_surat_id=? AND arabic_ayat_number=? ORDER BY word_id',s,a).map(r=>({id:Number(r.id),position:Number(r.word_id),arabic:arabicText(r.arabic_word),root:String(r.root??'').trim(),lemma:String(r.lemma??'').trim(),english:plain(r.english_meaning),urdu:plain(r.urdu_meaning),grammar:[1,2,3,4,5].map(n=>String(r[`position_grammar_${n}`]??'').trim()).filter(Boolean)}));
}
let topicsCache:Topic[];
export function getTopics(){return topicsCache??=all('SELECT * FROM tbl_QuranTopics ORDER BY topic_id').map(r=>({id:Number(r.topic_id),chapterId:Number(r.surat_id),start:Math.max(1,Number(r.start_ayat_id)),end:Number(r.end_ayat_id),english:plain(r.eng_topics),urdu:plain(r.urdu_topics)}))}
type Indexed=SearchResult & {haystack:string};
const indexes=new Map<string,Indexed[]>();
export function searchVerses(query:string,editionId='english',page=1){
 const q=normalize(query).slice(0,200);const edition=getEdition(editionId).id;
 if(!q)return {results:[],total:0,page};
 if(/^\d{1,3}:\d{1,3}$/.test(q)){const v=getVerse(q,edition);return {results:v?[{...v,chapterName:getChapters().find(c=>c.id===v.chapterId)!.name}]:[],total:v?1:0,page:1}}
 let index=indexes.get(edition);
 if(!index){index=all(`SELECT ${projection(edition)} FROM tbl_QuranComplete q JOIN tbl_LineQuran l ON l.ayat_id=q.id WHERE q.ayat_number>0 ORDER BY q.id`).map(r=>{const v=verse(r);return {...v,chapterName:getChapters().find(c=>c.id===v.chapterId)!.name,haystack:normalize(`${v.arabic} ${v.translation}`)}});indexes.set(edition,index)}
 const terms=q.split(' ');const matches=index.filter(v=>terms.every(term=>v.haystack.includes(term)));
 return {results:matches.slice((page-1)*20,page*20).map(({haystack:_,...v})=>v),total:matches.length,page};
}
