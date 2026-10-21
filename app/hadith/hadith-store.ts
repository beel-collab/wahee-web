import {readStore} from '../preferences';
export function readHadithBookmarks():string[]{const saved=readStore<unknown>('wahee-hadith-bookmarks',[]);return Array.isArray(saved)?[...new Set(saved.filter((key):key is string=>typeof key==='string'&&/^[a-z-]+:[1-9]\d*$/.test(key)))]:[]}
