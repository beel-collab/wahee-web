'use client';
import Link from 'next/link';
import {ArrowRight,ChevronLeft,ChevronRight,Search} from 'lucide-react';
import {useLibrary} from '../library-frame';
import type {HadithBook,HadithCollection,HadithPreview,HadithResults} from '../../data/hadith-types';
export function BookName({book,heading=false}:{book:HadithBook;heading?:boolean}){
 const {ur}=useLibrary();const isUrdu=ur||!book.english;const name=isUrdu?book.urdu:book.english;
 const text=name||`${ur?'کتاب':'Book'} ${book.id}`;
 return <span className={isUrdu?'hadith-urdu-title':undefined} lang={isUrdu?'ur':'en'} dir={isUrdu?'rtl':'ltr'}>{heading&&text===text.toUpperCase()?text.toLowerCase().replace(/^\w/,c=>c.toUpperCase()):text}</span>;
}
export function HadithSearchForm({collections,collection='',query=''}:{collections:HadithCollection[];collection?:string;query?:string}){
 const {t}=useLibrary();return <form action="/hadith/search" className="hadith-search-form"><label className="home-search"><Search size={20}/><input name="q" type="search" defaultValue={query} maxLength={160} aria-label="Search Hadith" placeholder={t('A word, a phrase, or a hadith number','لفظ، عبارت یا حدیث کا نمبر')}/><button type="submit" aria-label="Search Hadith"><ArrowRight size={19}/></button></label><select name="collection" defaultValue={collection} aria-label="Hadith collection"><option value="">{t('All collections','تمام مجموعے')}</option>{collections.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}</select></form>
}
export function HadithPreviewList({items,collections,showCollection=false}:{items:HadithPreview[];collections:HadithCollection[];showCollection?:boolean}){
 const {ur,t}=useLibrary();return <div className="hadith-preview-list">{items.map(item=>{const collection=collections.find(c=>c.slug===item.collection)!;const isUrdu=ur?!!item.urdu:!item.english&&!!item.urdu;const text=isUrdu?item.urdu:item.english||item.arabic;return <Link prefetch={false} key={`${item.collection}:${item.id}`} className="hadith-preview" href={`/hadith/${item.collection}/${item.id}`}><div className="hadith-preview-heading"><h2>{showCollection?`${collection.name} · `:''}{item.number===0?t('Introduction','مقدمہ'):`${t('Hadith','حدیث')} ${item.number}`}</h2><ArrowRight size={18}/></div><p className={isUrdu?'hadith-urdu-preview':undefined} lang={isUrdu?'ur':item.english?'en':'ar'} dir={isUrdu||!item.english?'rtl':'ltr'}>{text}{text.length>=240?'…':''}</p></Link>})}</div>
}
export function HadithPagination({results,href}:{results:HadithResults;href:(page:number)=>string}){
 const {t}=useLibrary();const pages=Math.ceil(results.total/results.pageSize);if(pages<2)return null;return <nav className="pagination" aria-label="Hadith pages">{results.page>1?<Link href={href(results.page-1)} className="secondary-button"><ChevronLeft size={16}/>{t('Previous','پچھلا')}</Link>:<span/>}<span>{results.page} / {pages}</span>{results.page<pages?<Link href={href(results.page+1)} className="secondary-button">{t('Next','اگلا')}<ChevronRight size={16}/></Link>:<span/>}</nav>
}
