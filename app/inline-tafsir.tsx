'use client';
import {useEffect,useState} from 'react';
import type {TafsirPassage} from '../data/tafsir';
export default function InlineTafsir({ayah,language,locale}:{ayah:number;language:'en'|'ur';locale:string}){
 const [passage,setPassage]=useState<TafsirPassage|null>(null),[error,setError]=useState(false),[retry,setRetry]=useState(0);
 const t=(en:string,ur:string)=>locale==='ur'?ur:en;
 useEffect(()=>{const controller=new AbortController();setError(false);setPassage(null);
 fetch(`/api/v1/tafsirs/${language==='ur'?160:169}/verses/1:${ayah}`,{signal:controller.signal}).then(async res=>{if(!res.ok)throw new Error('Unavailable');return res.json()}).then(({data})=>{if(!controller.signal.aborted)setPassage(data)}).catch(()=>{if(!controller.signal.aborted)setError(true)});
 return()=>controller.abort();},[ayah,language,retry]);
 return <section className="inline-tafsir" aria-label={`${t('Tafsir','تفسیر')} 1:${ayah}`}><header><strong>{t('Tafsir','تفسیر')}</strong>{passage&&<a href={passage.sourceUrl} target="_blank" rel="noreferrer">{language==='ur'?'تفسیر ابن کثیر':'Ibn Kathir (Abridged)'} ↗</a>}</header>{passage&&passage.coveredVerses.length>1&&<p className="inline-tafsir-range">{t('Commentary covers','تفسیر برائے')} {passage.coveredVerses.join(', ')}</p>}{!passage&&!error&&<p role="status">{t('Loading tafsir…','تفسیر لوڈ ہو رہی ہے…')}</p>}{error&&<div role="alert"><p>{t('Tafsir could not load.','تفسیر لوڈ نہیں ہو سکی۔')}</p><button onClick={()=>setRetry(n=>n+1)}>{t('Try again','دوبارہ کوشش کریں')}</button></div>}{passage&&<div className={`tafsir-prose ${language==='ur'?'tafsir-urdu':''}`} lang={language} dir={language==='ur'?'rtl':'ltr'} dangerouslySetInnerHTML={{__html:passage.html}}/>}</section>
}
