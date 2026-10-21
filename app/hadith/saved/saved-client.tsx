'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {Bookmark,ChevronLeft,Trash2} from 'lucide-react';
import LibraryFrame,{useLibrary} from '../../library-frame';
import {writeStore} from '../../preferences';
import {HadithPreviewList} from '../hadith-components';
import {readHadithBookmarks} from '../hadith-store';
import type {HadithCollection,HadithPreview} from '../../../data/hadith-types';
export default function SavedHadith({collections}:{collections:HadithCollection[]}){return <LibraryFrame current="hadith-saved"><SavedContent collections={collections}/></LibraryFrame>}
function SavedContent({collections}:{collections:HadithCollection[]}){
 const {t}=useLibrary();const [items,setItems]=useState<HadithPreview[]>([]),[pending,setPending]=useState(true),[error,setError]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{const controller=new AbortController();const keys=readHadithBookmarks();setPending(true);setError(false);if(!keys.length){setItems([]);setPending(false);return()=>controller.abort()}
  const batches=Array.from({length:Math.ceil(keys.length/100)},(_,i)=>keys.slice(i*100,(i+1)*100));
  Promise.all(batches.map(batch=>fetch(`/api/v1/hadith/records?keys=${encodeURIComponent(batch.join(','))}`,{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error();return r.json()}))).then(results=>setItems(results.flatMap(r=>r.data))).catch(e=>{if(e.name!=='AbortError')setError(true)}).finally(()=>{if(!controller.signal.aborted)setPending(false)});return()=>controller.abort()},[retry]);
 function remove(key:string){writeStore('wahee-hadith-bookmarks',readHadithBookmarks().filter(k=>k!==key));setItems(items=>items.filter(h=>`${h.collection}:${h.id}`!==key))}
 return <main className="library-main hadith-book-main"><Link href="/hadith" className="back-link"><ChevronLeft size={16}/>{t('Hadith library','احادیث کے مجموعے')}</Link><section className="library-intro"><h1>{t('Your saved hadiths.','آپ کی محفوظ احادیث۔')}</h1><p>{t('Keep the narrations you want to return to. Saved on this device.','دوبارہ پڑھنے کے لیے روایات محفوظ کریں۔ یہ اسی آلے پر رہتی ہیں۔')}</p></section>{pending?<p role="status" className="content-status">{t('Loading saved hadiths…','محفوظ احادیث لوڈ ہو رہی ہیں…')}</p>:error?<div className="empty" role="alert"><h2>{t('Saved hadiths could not load','محفوظ احادیث لوڈ نہیں ہو سکیں')}</h2><button className="secondary-button" onClick={()=>setRetry(n=>n+1)}>{t('Try again','دوبارہ کوشش کریں')}</button></div>:!items.length?<div className="hadith-search-hint"><Bookmark size={29} strokeWidth={1.3}/><h2>{t('Keep a narration close.','پسندیدہ روایت محفوظ کریں۔')}</h2><p>{t('Use the bookmark beside a hadith to find it here.','کسی حدیث کے ساتھ محفوظ کرنے کا نشان دبائیں۔')}</p><Link href="/hadith" className="primary-button">{t('Explore Hadith','احادیث دیکھیں')}</Link></div>:<div>{items.map(item=><div className="saved-hadith-row" key={`${item.collection}:${item.id}`}><HadithPreviewList items={[item]} collections={collections} showCollection/><button className="icon-button" aria-label={`Remove saved hadith ${item.collection}:${item.id}`} onClick={()=>remove(`${item.collection}:${item.id}`)}><Trash2 size={17}/></button></div>)}</div>}</main>
}
