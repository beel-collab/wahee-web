import Bookmarks from './saved-client';
import {getChapters} from '../../data/quran-db';
export const dynamic='force-dynamic';
export const metadata={title:'Saved ayahs · Wahee'};
export default function Page(){return <Bookmarks chapters={getChapters()}/>}
