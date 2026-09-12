import type { Metadata } from 'next';
import './globals.css';
import './reader-design.css';
export const metadata: Metadata = {title:'Al-Fatihah · Wahee',description:'A quiet space to read the Quran. Read Surah Al-Fatihah with English and Urdu translations.'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
