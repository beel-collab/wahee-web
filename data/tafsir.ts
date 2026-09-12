import source from './fatiha-tafsir-source.json';
import sanitizeHtml from 'sanitize-html';
export const tafsirResources=source.sources.map(({id,name,author_name,slug,language_name})=>({id,name,author:author_name,slug,language:language_name}));
export function getTafsir(resourceId:number,key:string){
 const resource=source.sources.find(s=>s.id===resourceId);
 if(!resource)return null;
 const passage=(resource.passages as Record<string,{text:string;verses:Record<string,unknown>}>)[key];
 if(!passage)return null;
 return {resource:tafsirResources.find(r=>r.id===resourceId)!,verseKey:key,coveredVerses:Object.keys(passage.verses),html:sanitizeHtml(passage.text,{allowedTags:['p','h1','h2','h3','h4','strong','em','b','i','ul','ol','li','blockquote','br','sup','sub','span'],allowedAttributes:{}}),sourceUrl:`https://quran.com/${key}/tafsirs/${resource.slug}`,provider:source.provider,retrieved:source.retrieved};
}
export type TafsirPassage=NonNullable<ReturnType<typeof getTafsir>>;
