import express from 'express';
import {getTafsir,tafsirResources} from '../data/tafsir';
import { fatiha } from '../data/fatiha';
const app = express();
app.disable('x-powered-by');
app.get('/v1/tafsirs', (_req,res)=>res.json({data:tafsirResources}));
app.get('/v1/tafsirs/:id/verses/:key', (req,res)=>{
 const passage=getTafsir(Number(req.params.id),req.params.key);
 if(!passage){res.status(404).json({error:'Tafsir is not available for this source and verse.'});return;}
 res.set('Cache-Control','public, max-age=3600').json({data:passage});
});
app.get('/health', (_req,res) => res.json({status:'ok'}));
app.get('/v1/chapters', (_req,res) => res.json({data:[{id:1,name:fatiha.name,verseCount:7}]}));
app.get('/v1/chapters/:id', (req,res) => {
 if(req.params.id !== '1') { res.status(404).json({error:'Only Al-Fatihah is available in this prototype.'}); return; }
 res.set('Cache-Control','public, max-age=3600').json({data:fatiha});
});
app.get('/v1/verses/:key', (req,res) => {
 const verse=fatiha.verses.find(v=>v.key===req.params.key);
 if(!verse) {res.status(404).json({error:'Verse not available'}); return;}
 res.json({data:verse});
});
app.listen(Number(process.env.API_PORT || 4401), '0.0.0.0', () => console.log('Wahee API: http://localhost:4401'));
