import type {Metadata} from 'next';
import './globals.css';
import './study.css';
import './library.css';
export const metadata:Metadata={title:'Wahee · Quran & Hadith',description:'Read the Quran and Hadith with translations and a quiet space for reflection.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-scroll-behavior="smooth"><body>{children}</body></html>}
