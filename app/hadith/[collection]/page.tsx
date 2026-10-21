import {notFound} from 'next/navigation';
import {getHadithCollection,getHadithCollections,getHadithBooks} from '../../../data/hadith-db';
import {HadithCollectionView} from '../library-client';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{collection:string}>}){const {collection}=await params;return {title:`${getHadithCollection(collection)?.name??'Collection not found'} · Wahee`}}
export default async function Page({params}:{params:Promise<{collection:string}>}){const {collection:slug}=await params;const collection=getHadithCollection(slug);if(!collection)notFound();return <HadithCollectionView collection={collection} books={getHadithBooks(slug)} collections={getHadithCollections()}/>}
