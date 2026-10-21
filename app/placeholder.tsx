'use client';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import LibraryFrame,{useLibrary} from './library-frame';
export default function Placeholder({section}:{section:'seerah'|'duas'}){return <LibraryFrame current={section}><PlaceholderContent section={section}/></LibraryFrame>}
function PlaceholderContent({section}:{section:'seerah'|'duas'}){const {t}=useLibrary();return <main className="placeholder-main"><h1>{section==='seerah'?t('Seerah','سیرت'):t('Duas','دعائیں')}</h1><h2>{t('Coming soon.','جلد آ رہا ہے۔')}</h2><p>{t('There’s no content here yet. In the meantime, the Quran and Hadith are ready to explore.','یہاں ابھی کوئی مواد موجود نہیں۔ اس دوران قرآن اور حدیث کا مطالعہ کریں۔')}</p><Link href="/" className="secondary-button"><ArrowLeft size={17}/>{t('Back to home','صفحۂ اوّل پر واپس')}</Link></main>}
