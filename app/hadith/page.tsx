import {getHadithCollections} from '../../data/hadith-db';
import {HadithLibrary} from './library-client';
export const dynamic='force-dynamic';
export const metadata={title:'Hadith library · Wahee'};
export default function Page(){return <HadithLibrary collections={getHadithCollections()}/>}
