import {getHadithCollections,searchHadith} from '../../../data/hadith-db';
import {HadithSearchView} from '../library-client';
export const dynamic='force-dynamic';
export const metadata={title:'Search Hadith · Wahee'};
export default async function Page({searchParams}:{searchParams:Promise<{q?:string;collection?:string;page?:string}>}){const params=await searchParams;const query=String(params.q||'').trim().slice(0,160);const collections=getHadithCollections();const collection=collections.some(c=>c.slug===params.collection)?params.collection!:'';return <HadithSearchView collections={collections} query={query} collection={collection} results={searchHadith(query,collection,Number(params.page)||1)}/>}
