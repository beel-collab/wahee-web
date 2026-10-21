'use client';
import {useEffect,useRef,useState} from 'react';

export function useTafsirNavigation(chapterId:number,verseCount:number){
 const [ayah,setAyah]=useState<number|null>(null);
 const opener=useRef<HTMLElement|null>(null);
 const opened=useRef(false),closing=useRef(false);
 const readingPosition=useRef({x:0,y:0});
 function restoreReader(){
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   window.scrollTo({left:readingPosition.current.x,top:readingPosition.current.y,behavior:'instant'});
   opener.current?.focus({preventScroll:true});
  }));
 }
 useEffect(()=>{
  const sync=()=>{
   const value=new URLSearchParams(location.search).get('tafsir');
   const number=value!==null&&/^\d+$/.test(value)?Number(value):null;
   const next=number!==null&&number>=0&&number<=verseCount?number:null;
   closing.current=false;setAyah(next);
   if(next===null&&opened.current){
    opened.current=false;
    restoreReader();
   }
  };
  sync();window.addEventListener('popstate',sync);
  return()=>window.removeEventListener('popstate',sync);
 },[chapterId,verseCount]);
 function open(number:number){
  if(ayah===null){opener.current=document.activeElement as HTMLElement;readingPosition.current={x:window.scrollX,y:window.scrollY};opened.current=true;}
  const url=new URL(location.href);url.searchParams.set('tafsir',String(number));
  if(ayah===null)history.pushState({...history.state,waheeTafsir:true},'',url);
  else history.replaceState(history.state,'',url);
  setAyah(number);
 }
 function close(){
  if(closing.current)return;
  if(history.state?.waheeTafsir){closing.current=true;history.back();return;}
  const url=new URL(location.href);url.searchParams.delete('tafsir');
  history.replaceState(history.state,'',url);setAyah(null);
  if(opened.current){opened.current=false;restoreReader();}
 }
 return {ayah,open,close};
}
