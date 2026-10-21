// These source glyphs depend on an absent legacy font. Normalizing their Unicode
// presentation forms would turn the quotations into unrelated Arabic letters.
const legacy=/([\ufb50-\ufbff\ue000-\uf8ff]+(?:[ \t]*[\ufb50-\ufbff\ue000-\uf8ff]+)*)/g;
export function hadithArabicParts(text:string){return text.split(legacy).filter(Boolean).map((text,index)=>({text,legacy:/[\ufb50-\ufbff\ue000-\uf8ff]/u.test(text)}))}
export function hasLegacyHadithArabic(text:string){return /[\ufb50-\ufbff\ue000-\uf8ff]/u.test(text)}
