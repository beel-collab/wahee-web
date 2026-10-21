'use client';
import {useEffect,useRef,useState} from 'react';
export type Preferences={theme:'light'|'dark'|'sepia';locale:'en'|'ur';edition:string;size:number;translationSize:number;mode:'translation'|'reading';tafsir:string;tafsirSize:number;wordLanguage:'en'|'ur'};
export const defaults:Preferences={theme:'light',locale:'en',edition:'english',size:34,translationSize:21,mode:'translation',tafsir:'maududi',tafsirSize:20,wordLanguage:'en'};
export function readStore<T>(key:string,fallback:T):T{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}}
export function writeStore(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value))}catch{/* Reading remains available when device storage is disabled. */}}
export function readBookmarks():string[]{const data=readStore<unknown>('wahee-bookmarks',[]);return Array.isArray(data)?[...new Set(data.map(k=>typeof k==='number'?`1:${k}`:k).filter((k):k is string=>typeof k==='string'&&/^\d{1,3}:\d{1,3}$/.test(k)))]:[]}
export function usePreferences(){
 const [prefs,setPrefs]=useState(defaults),[ready,setReady]=useState(false);
 const changed=useRef(new Set<keyof Preferences>());
 useEffect(()=>{const p=readStore<Partial<Preferences>>('wahee-prefs',{});let locale='en';try{locale=localStorage.getItem('wahee-locale')||'en'}catch{}
 const loaded:Preferences={...defaults,...p,theme:['light','dark','sepia'].includes(p.theme||'')?p.theme!:defaults.theme,locale:locale==='ur'?'ur':'en',size:Math.min(56,Math.max(26,Number(p.size)||34)),translationSize:Math.min(32,Math.max(16,Number(p.translationSize)||21)),mode:p.mode==='reading'?'reading':'translation',tafsirSize:Math.min(28,Math.max(18,Number(p.tafsirSize)||20)),wordLanguage:p.wordLanguage==='ur'||(!p.wordLanguage&&locale==='ur')?'ur':'en'};
 setPrefs(current=>({...loaded,...Object.fromEntries([...changed.current].map(key=>[key,current[key]]))}));setReady(true)},[]);
 useEffect(()=>{if(!ready)return;writeStore('wahee-prefs',prefs);try{localStorage.setItem('wahee-locale',prefs.locale)}catch{}document.documentElement.lang=prefs.locale;document.documentElement.style.colorScheme=prefs.theme==='dark'?'dark':'light'},[prefs,ready]);
 function pref<K extends keyof Preferences>(key:K,value:Preferences[K]){changed.current.add(key);setPrefs(p=>({...p,[key]:value}))}
 return {prefs,pref,ready};
}
