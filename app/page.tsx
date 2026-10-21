import Welcome from './welcome';
import {getHadithCollections} from '../data/hadith-db';
export const dynamic='force-dynamic';
export const metadata={title:'Wahee · Read. Learn. Reflect.',description:'A quiet place for the Quran and Hadith, with Seerah and Duas to come.'};
export default function Page(){const collections=getHadithCollections();return <Welcome collections={collections.length} hadiths={collections.reduce((n,c)=>n+c.count,0)}/>}
