'use client';
import {useEffect,useRef,useState} from 'react';
import {ChevronRight,X} from 'lucide-react';
import type {Verse,Word} from '../data/quran-types';

const cache=new Map<string,Word[]>();
type Props={verse:Verse;language:'en'|'ur';onLanguage:(language:'en'|'ur')=>void;locale:string;compact:boolean;suspended:boolean;size:number;onClose:()=>void};

export default function InlineWords({verse,language,onLanguage,locale,compact,suspended,size,onClose}:Props){
 const [words,setWords]=useState<Word[]|null>(()=>cache.get(verse.key)||null),[selected,setSelected]=useState<Word|null>(null),[error,setError]=useState(false),[retry,setRetry]=useState(0);
 const opener=useRef<HTMLElement|null>(null);
 useEffect(()=>{if(suspended)setSelected(null);},[suspended]);
 const ur=locale==='ur';const t=(en:string,u:string)=>ur?u:en;
 useEffect(()=>{
  const cached=cache.get(verse.key);if(cached){setWords(cached);return;}
  const controller=new AbortController();setError(false);
  fetch(`/api/v1/words/${verse.key}`,{signal:controller.signal}).then(async response=>{if(!response.ok)throw new Error('Words unavailable');return response.json();}).then(({data}:{data:Word[]})=>{if(!controller.signal.aborted){cache.set(verse.key,data);setWords(data);}}).catch(()=>{if(!controller.signal.aborted)setError(true);});
  return()=>controller.abort();
 },[verse.key,retry]);
 function select(word:Word){opener.current=document.activeElement as HTMLElement;setSelected(current=>current?.id===word.id?null:word);}
 function closeDetails(){setSelected(null);requestAnimationFrame(()=>opener.current?.focus({preventScroll:true}));}
 const details=selected&&<WordDetail word={selected} language={language} locale={locale}/>;
 return <section className="inline-words" aria-label={`Word by word ${verse.key}`}>
  <header className="inline-words-header"><h3>{t('Word by word','لفظ بہ لفظ')}</h3><div className="word-language" aria-label="Word meaning language"><button aria-pressed={language==='en'} onClick={()=>onLanguage('en')}>English</button><button aria-pressed={language==='ur'} onClick={()=>onLanguage('ur')}>اردو</button></div><button className="icon-button" aria-label={`Close word by word ${verse.key}`} onClick={onClose}><X size={17}/></button></header>
  {(!words||words.length===0)&&<p className="arabic" lang="ar" dir="rtl" style={{fontSize:size}}>{verse.arabic}</p>}
  {!words&&!error&&<p className="word-status" role="status">{t('Loading word meanings…','لفظی معنی لوڈ ہو رہے ہیں…')}</p>}
  {error&&<div className="word-status" role="alert"><p>{t('Word meanings could not load.','لفظی معنی لوڈ نہیں ہو سکے۔')}</p><button className="text-link" onClick={()=>setRetry(value=>value+1)}>{t('Try again','دوبارہ کوشش کریں')}</button></div>}
  {words&&words.length>0&&<><div className="word-flow" dir="rtl">{words.map(word=><button className={`word-unit ${selected?.id===word.id?'is-selected':''}`} key={word.id} aria-pressed={selected?.id===word.id} aria-label={`Word ${word.position}: ${word.arabic} — ${language==='ur'?word.urdu:word.english}`} onClick={()=>select(word)}><span className="word-unit-arabic" lang="ar" style={{fontSize:Math.max(26,Math.min(40,size-2))}}>{word.arabic}</span><span className={`word-unit-meaning ${language==='ur'?'meaning-urdu':''}`} dir={language==='ur'?'rtl':'ltr'} lang={language}>{(language==='ur'?word.urdu:word.english)||t('Meaning unavailable','معنی موجود نہیں')}</span></button>)}</div><p className="word-hint">{t('Select a word to explore its root and form.','مادہ اور بنیادی لفظ جاننے کے لیے لفظ منتخب کریں۔')}</p></>}
  {words?.length===0&&<p className="word-status">{t('Word details are not available for this ayah.','اس آیت کی لفظی تفصیل موجود نہیں۔')}</p>}
  {selected&&!suspended&&(compact?<WordSheet word={selected} verseKey={verse.key} onClose={closeDetails} locale={locale}>{details}</WordSheet>:<section className="word-detail-inline" aria-label="Word details"><div className="word-detail-heading"><span className="selected-word" lang="ar" dir="rtl">{selected.arabic}</span><button className="icon-button" aria-label="Close word details" onClick={closeDetails}><X size={18}/></button></div>{details}</section>)}
 </section>;
}

function WordDetail({word,language,locale}:{word:Word;language:'en'|'ur';locale:string}){
 const ur=locale==='ur';
 return <div className="word-detail-content"><p className={language==='ur'?'detail-meaning-urdu':'detail-meaning'} dir={language==='ur'?'rtl':'ltr'} lang={language}>{(language==='ur'?word.urdu:word.english)||(ur?'معنی موجود نہیں':'Meaning unavailable')}</p><dl><div><dt>{ur?'مادہ':'Root'}</dt><dd lang="ar" dir="rtl">{word.root||'—'}</dd></div><div><dt>{ur?'بنیادی لفظ':'Lemma'}</dt><dd lang="ar" dir="rtl">{word.lemma||'—'}</dd></div></dl>{!word.root&&!word.lemma&&<p className="word-status">{ur?'اس لفظ کا الگ مادہ یا بنیادی لفظ درج نہیں۔':'No separate root or lemma is recorded for this word.'}</p>}</div>;
}

function WordSheet({word,verseKey,locale,onClose,children}:{word:Word;verseKey:string;locale:string;onClose:()=>void;children:React.ReactNode}){
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{
  const element=dialog.current,before=document.body.style.overflow;element?.showModal();document.body.style.overflow='hidden';
  return()=>{element?.close();document.body.style.overflow=before;};
 },[]);
 return <dialog ref={dialog} className="word-sheet" aria-labelledby="word-sheet-title" onCancel={onClose} onClick={event=>{if(event.target===dialog.current)onClose();}} dir={locale==='ur'?'rtl':'ltr'}><div className="word-sheet-content"><header><div><p className="word-sheet-reference">{verseKey} <ChevronRight size={12}/> {locale==='ur'?'لفظ':'Word'} {word.position}</p><h3 id="word-sheet-title" lang="ar" dir="rtl">{word.arabic}</h3></div><button className="icon-button" aria-label="Close word details" onClick={onClose} autoFocus><X size={20}/></button></header>{children}</div></dialog>;
}
