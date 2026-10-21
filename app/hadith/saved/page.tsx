import {getHadithCollections} from '../../../data/hadith-db';
import SavedHadith from './saved-client';
export const dynamic='force-dynamic';
export const metadata={title:'Saved Hadith · Wahee'};
export default function Page(){return <SavedHadith collections={getHadithCollections()}/>}
