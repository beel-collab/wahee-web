import {notFound} from 'next/navigation';
import Reader from '../../reader';
import Home from '../../home';
import catalog from '../../../data/chapters.json';
import type {Chapter} from '../../../data/fatiha';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const chapter=catalog.chapters.find(c=>String(c.number)===id);
 return {title:chapter?`${chapter.englishName} · Wahee`:'Surah not found · Wahee'};
}
export default async function Page({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const chapter=catalog.chapters.find(c=>String(c.number)===id);if(!chapter)notFound();
 if(id!=='1')return <Home selected={chapter}/>;
 try{
 const response=await fetch(`${process.env.API_URL||'http://127.0.0.1:4401'}/v1/chapters/1`,{cache:'no-store',signal:AbortSignal.timeout(5000)});
 if(!response.ok)throw new Error('Content unavailable');
 const {data}:{data:Chapter}=await response.json();return <Reader chapter={data}/>;
 }catch{return <main className="unavailable"><h1>The reader is temporarily unavailable.</h1><p>Please check that the content service is running.</p><a href="/surah/1">Try again</a> · <a href="/">All surahs</a></main>}
}
