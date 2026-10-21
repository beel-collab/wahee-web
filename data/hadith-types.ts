export type HadithLanguage='en'|'ur'|'ar';
export type HadithCollection={slug:string;name:string;arabicName:string;count:number;bookCount:number;languages:('en'|'ur')[];firstRecord:number};
export type HadithBook={id:number;english:string;urdu:string;count:number;firstRecord:number;firstNumber:number;lastNumber:number};
export type HadithText={text:string;chapter:string;book:string;narrator:string;references:string;notes:string};
export type Hadith={collection:string;id:number;number:number;internationalNumber:number;bookId:number;arabic:string;english:HadithText|null;urdu:HadithText|null;previous:number|null;next:number|null;bookPage:number};
export type HadithPreview=Pick<Hadith,'collection'|'id'|'number'|'bookId'|'arabic'> & {english:string;urdu:string};
export type HadithResults={items:HadithPreview[];total:number;page:number;pageSize:number};
