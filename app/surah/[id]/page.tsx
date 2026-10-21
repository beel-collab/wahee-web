import {notFound} from 'next/navigation';
import Reader from '../../reader';
import {getChapter,getChapters,getNavigation,editions,tafsirResources} from '../../../data/quran-db';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const chapter=getChapters().find(c=>String(c.id)===id);return {title:chapter?`${chapter.name} · Wahee`:'Surah not found · Wahee'}}
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const chapter=getChapter(Number(id));if(!chapter||String(chapter.id)!==id)notFound();return <Reader key={chapter.id} chapter={chapter} chapters={getChapters()} navigation={getNavigation()} editions={editions} resources={tafsirResources}/>}
