import {notFound} from 'next/navigation';
import {getHadithCollection,getHadithBooks,getHadithBookPage} from '../../../../../data/hadith-db';
import {HadithBookView} from '../../../library-client';
export const dynamic='force-dynamic';
export default async function Page({params,searchParams}:{params:Promise<{collection:string;book:string}>;searchParams:Promise<{page?:string}>}){const {collection:slug,book:id}=await params;const {page}=await searchParams;const collection=getHadithCollection(slug);const book=getHadithBooks(slug).find(b=>String(b.id)===id);const results=book?getHadithBookPage(slug,book.id,Number(page)||1):null;if(!collection||!book||!results)notFound();return <HadithBookView collection={collection} book={book} results={results}/>}
