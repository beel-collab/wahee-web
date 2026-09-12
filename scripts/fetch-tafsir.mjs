import {writeFile} from 'node:fs/promises';
const catalog=await (await fetch('https://api.quran.com/api/v4/resources/tafsirs')).json();
const sources=[];
for(const id of [169,160]){
 const resource=catalog.tafsirs.find(r=>r.id===id);
 const passages={};
 for(let n=1;n<=7;n++){
  const url=`https://api.quran.com/api/v4/tafsirs/${id}/by_ayah/1:${n}`;
  const res=await fetch(url);if(!res.ok)throw new Error(`${url}: ${res.status}`);
  const {tafsir}=await res.json();if(!tafsir.text?.trim()||!tafsir.verses?.[`1:${n}`])throw new Error(`Missing content/mapping ${id} 1:${n}`);
  passages[`1:${n}`]=tafsir;
 }
 sources.push({...resource,passages});
}
await writeFile('data/fatiha-tafsir-source.json',JSON.stringify({provider:'Quran.com',retrieved:new Date().toISOString().slice(0,10),sources},null,2)+'\n');
console.log(sources.map(s=>({id:s.id,name:s.name,language:s.language_name,passages:Object.keys(s.passages).length})));
