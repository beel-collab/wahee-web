import source from './fatiha-source.json';
import qpc from './fatiha-qpc-source.json';
const [arabic, english, urdu] = source.data;
export const fatiha = {
  id: 1, name: 'Al-Fatihah', arabicName: arabic.name, meaning: 'The Opening', verseCount: 7,
  arabicSource: {name:qpc.provider,url:qpc.url,retrieved:qpc.retrieved,script:'QPC Uthmanic Hafs'},
  source: { name: 'AlQuran Cloud', url: 'https://alquran.cloud/api', retrieved: '2026-09-12', editions: source.data.map(d => d.edition) },
  verses: arabic.ayahs.map((a,i) => ({number: a.numberInSurah, key: `1:${a.numberInSurah}`, arabic: qpc.verses.find(v=>v.verse_key===`1:${a.numberInSurah}`)!.words.filter(w=>w.char_type_name==='word').map(w=>w.text_qpc_hafs).join(' '), english: english.ayahs[i].text, urdu: urdu.ayahs[i].text, audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`}))
};
export type Chapter = typeof fatiha;
