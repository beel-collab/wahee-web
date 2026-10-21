import SearchPage from './search-client';
import {editions,getChapters} from '../../data/quran-db';
export const dynamic='force-dynamic';
export const metadata={title:'Search the Quran · Wahee'};
export default async function Page({searchParams}:{searchParams:Promise<{q?:string;tab?:string;chapter?:string}>}){const params=await searchParams;return <SearchPage initialQuery={params.q||''} initialTab={params.tab==='topics'?'topics':'verses'} chapterId={params.chapter||''} chapters={getChapters()} editions={editions}/>}
