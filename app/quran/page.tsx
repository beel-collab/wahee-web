import Home from '../home';
import {getChapters,getNavigation} from '../../data/quran-db';
export const dynamic='force-dynamic';
export const metadata={title:'The Quran · Wahee',description:'Read all 114 surahs with translations, tafsir, and word meanings.'};
export default function Page(){return <Home chapters={getChapters()} navigation={getNavigation()}/>}
