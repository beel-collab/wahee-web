import {notFound} from 'next/navigation';
import {getHadith,getHadithBooks,getHadithCollection} from '../../../../data/hadith-db';
import HadithReader from '../../hadith-reader';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{collection:string;record:string}>}){const {collection:slug,record}=await params;const collection=getHadithCollection(slug);const passage=getHadith(slug,Number(record));return {title:collection&&passage?`${collection.name} ${passage.number===0?'Introduction':passage.number} · Wahee`:'Hadith not found · Wahee'}}
export default async function Page({params}:{params:Promise<{collection:string;record:string}>}){const {collection:slug,record}=await params;const collection=getHadithCollection(slug);const passage=getHadith(slug,Number(record));const book=passage?getHadithBooks(slug).find(b=>b.id===passage.bookId):null;if(!collection||!passage||!book||String(passage.id)!==record)notFound();return <HadithReader key={`${slug}:${record}`} collection={collection} book={book} passage={passage}/>}
