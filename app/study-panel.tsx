'use client';
import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {ArrowLeft,ChevronDown,ChevronLeft,ChevronRight,Maximize2,Minimize2,Minus,Plus,X} from 'lucide-react';
import type {Chapter,TafsirPassage,TafsirResource} from '../data/quran-types';

export type StudyMemory={passages:Map<string,TafsirPassage>;positions:Map<string,number>};
type Props={
 chapter:Chapter;ayah:number;resources:TafsirResource[];resourceId:string;
 onResource:(id:string)=>void;locale:string;onChange:(n:number)=>void;onClose:()=>void;
 compact:boolean;expanded:boolean;onExpand:()=>void;onReveal:(n:number)=>void;
 textSize:number;onTextSize:(size:number)=>void;memory:StudyMemory;
};

export default function TafsirPanel({chapter,ayah,resources,resourceId,onResource,locale,onChange,onClose,compact,expanded,onExpand,onReveal,textSize,onTextSize,memory}:Props){
 const panel=useRef<HTMLElement>(null),body=useRef<HTMLDivElement>(null),heading=useRef<HTMLHeadingElement>(null);
 const [result,setResult]=useState<{key:string;passage:TafsirPassage}|null>(null);
 const [error,setError]=useState(false),[retry,setRetry]=useState(0);
 const ur=locale==='ur',fullScreen=compact||expanded;
 const t=(en:string,u:string)=>ur?u:en;
 const resource=resources.find(r=>r.id===resourceId)||resources[0];
 const key=`${chapter.id}:${ayah}:${resource.id}`;
 const passage=result?.key===key?result.passage:null;
 const verse=ayah>0?chapter.verses[ayah-1]:null;
 const arabic=verse?.arabic||chapter.bismillah||'';
 const reference=ayah===0?t('Opening commentary','ابتدائی تفسیر'):`${chapter.id}:${ayah}`;

 useEffect(()=>{heading.current?.focus({preventScroll:true});},[]);
 useEffect(()=>{
  if(!fullScreen)return;
  const before=document.body.style.overflow;document.body.style.overflow='hidden';
  return()=>{document.body.style.overflow=before;};
 },[fullScreen]);
 useEffect(()=>{
  const controller=new AbortController();setError(false);
  const cached=memory.passages.get(key);
  if(cached){setResult({key,passage:cached});return;}
  const url=ayah===0?`/api/v1/tafsirs/${resource.id}/chapters/${chapter.id}`:`/api/v1/tafsirs/${resource.id}/verses/${chapter.id}:${ayah}`;
  fetch(url,{signal:controller.signal}).then(async response=>{
   if(!response.ok)throw new Error('Tafsir unavailable');
   return response.json();
  }).then(({data}:{data:TafsirPassage})=>{
   if(controller.signal.aborted)return;
   memory.passages.set(key,data);setResult({key,passage:data});
  }).catch(()=>{if(!controller.signal.aborted)setError(true);});
  return()=>controller.abort();
 },[key,ayah,chapter.id,resource.id,memory,retry]);
 useLayoutEffect(()=>{
  if(passage&&body.current)body.current.scrollTop=memory.positions.get(key)||0;
 },[passage,key,memory]);

 function keyboard(event:React.KeyboardEvent){
  if(event.key==='Escape'){event.preventDefault();onClose();return;}
  if(event.key!=='Tab'||!fullScreen||!panel.current)return;
  const elements=Array.from(panel.current.querySelectorAll<HTMLElement>('button:not(:disabled),select,summary,a[href],[tabindex="0"]')).filter(el=>el.getClientRects().length>0);
  const first=elements[0],last=elements.at(-1);
  if(event.shiftKey&&(document.activeElement===first||document.activeElement===heading.current)){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 }

 return <section ref={panel} className={`tafsir-panel ${fullScreen?'is-full-screen':'is-docked'}`} role={fullScreen?'dialog':'region'} aria-modal={fullScreen?true:undefined} aria-labelledby="study-title" onKeyDown={keyboard} dir={ur?'rtl':'ltr'}>
  <header className="tafsir-panel-header">
   {fullScreen&&<button className="study-back" aria-label="Back to Quran" onClick={onClose}><ArrowLeft size={18}/><span>{t('Quran','قرآن')}</span></button>}
   <div className="tafsir-panel-title"><h2 id="study-title" ref={heading} tabIndex={-1}>{t('Tafsir','تفسیر')} <span>{reference}</span></h2><p>{chapter.name}</p></div>
   <div className="tafsir-panel-actions">{!compact&&<button className="icon-button" aria-label={expanded?'Dock tafsir':'Expand tafsir'} title={expanded?t('Return to side panel','ساتھ دیکھیں'):t('Expand for reading','مکمل اسکرین پر پڑھیں')} onClick={onExpand}>{expanded?<Minimize2 size={18}/>:<Maximize2 size={18}/>}</button>}{!fullScreen&&<button className="icon-button" aria-label="Close tafsir" onClick={onClose}><X size={20}/></button>}</div>
  </header>
  <div className="tafsir-panel-controls">
   <label className="tafsir-source"><span className="sr-only">Tafsir source</span><select aria-label="Tafsir source" value={resource.id} onChange={event=>onResource(event.target.value)}>{resources.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
   <div className="tafsir-type-controls" aria-label="Tafsir text size"><button aria-label="Decrease tafsir text size" disabled={textSize<=18} onClick={()=>onTextSize(Math.max(18,textSize-2))}><Minus size={16}/></button><span aria-live="polite">{textSize}</span><button aria-label="Increase tafsir text size" disabled={textSize>=28} onClick={()=>onTextSize(Math.min(28,textSize+2))}><Plus size={16}/></button></div>
  </div>
  <div className="tafsir-body" ref={body} onScroll={event=>{if(passage)memory.positions.set(key,event.currentTarget.scrollTop);}}>
   <details className="tafsir-context" key={`${chapter.id}:${ayah}`}><summary><span className="context-label">{ayah===0?t('Opening','آغاز'):t('Ayah','آیت')}</span><span className="context-preview" lang="ar" dir="rtl">{arabic}</span><ChevronDown size={15}/></summary><div className="context-full"><p className="arabic" lang="ar" dir="rtl">{arabic}</p>{verse&&<p className={chapter.edition.language==='ur'?'context-urdu':''} dir={chapter.edition.direction} lang={chapter.edition.language}>{verse.translation}</p>}</div></details>
   <p className="tafsir-source-credit" lang="ur" dir="rtl">{resource.author}</p>
   {!passage&&!error&&<p className="content-status" role="status">{t('Loading tafsir…','تفسیر لوڈ ہو رہی ہے…')}</p>}
   {error&&<div className="study-empty" role="alert"><h3>{t('Tafsir could not load','تفسیر لوڈ نہیں ہو سکی')}</h3><p>{t('Your reading place is saved. Please try again.','آپ کی پڑھنے کی جگہ محفوظ ہے۔ دوبارہ کوشش کریں۔')}</p><button className="secondary-button" onClick={()=>setRetry(value=>value+1)}>{t('Try again','دوبارہ کوشش کریں')}</button></div>}
   {passage&&(passage.text?<div className="tafsir-prose" lang="ur" dir="rtl" style={{fontSize:textSize}}>{passage.text.replace(/\r\n?/g,'\n').split(/\n+/).map(line=>line.trim()).filter(Boolean).map((line,index)=>line.length<180&&/حاشیہ\s*نمبر/.test(line)?<h3 key={index}>{line}</h3>:<p key={index}>{line}</p>)}</div>:<div className="study-empty"><h3>{t('No separate commentary for this ayah','اس آیت کی الگ تفسیر موجود نہیں')}</h3><p>{t('This source has no separate note here. Choose another tafsir or a nearby ayah.','اس ماخذ میں یہاں الگ تشریح موجود نہیں۔ دوسری تفسیر یا قریبی آیت دیکھیں۔')}</p><button className="secondary-button" onClick={()=>onResource(resource.id==='taqi'?'maududi':'taqi')}>{t('Try the other tafsir','دوسری تفسیر دیکھیں')}</button></div>)}
  </div>
  <footer className="tafsir-panel-navigation"><button className="secondary-button" disabled={ayah<=1} onClick={()=>onChange(ayah-1)}><ChevronLeft size={16}/>{t('Previous','پچھلی')}</button>{!fullScreen&&ayah>0?<button className="reveal-ayah" aria-label="Show ayah in Quran" onClick={()=>onReveal(ayah)}>{reference}</button>:<span>{reference}</span>}<button className="secondary-button" disabled={ayah===chapter.verseCount} onClick={()=>onChange(ayah+1)}>{t('Next','اگلی')}<ChevronRight size={16}/></button></footer>
 </section>;
}
