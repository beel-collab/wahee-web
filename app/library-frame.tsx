'use client';
import {createContext,useContext} from 'react';
import Link from 'next/link';
import AppHeader from './app-header';
import {usePreferences} from './preferences';
const LibraryContext=createContext<ReturnType<typeof usePreferences>|null>(null);
export function useLibrary(){const context=useContext(LibraryContext);if(!context)throw new Error('Library view requires its frame.');return {...context,ur:context.prefs.locale==='ur',t:(english:string,urdu:string)=>context.prefs.locale==='ur'?urdu:english}}
export default function LibraryFrame({children,current='home'}:{children:React.ReactNode;current?:string}){
 const preferences=usePreferences();const {prefs,pref}=preferences;
 return <LibraryContext.Provider value={preferences}><div className={`app library-app theme-${prefs.theme}`} dir={prefs.locale==='ur'?'rtl':'ltr'}><AppHeader prefs={prefs} current={current} onLocale={()=>pref('locale',prefs.locale==='ur'?'en':'ur')} onTheme={()=>pref('theme',prefs.theme==='dark'?'light':'dark')}/>{children}<footer className="library-footer"><Link href="/" className="brand" aria-label="Wahee home">wahee<span className="brand-dot">.</span></Link><p>{prefs.locale==='ur'?'پڑھنے کی جگہ۔ غور و فکر کا لمحہ۔':'A place to read. A moment to reflect.'}</p></footer></div></LibraryContext.Provider>
}
