import type {NextConfig} from 'next';
const config:NextConfig={
 outputFileTracingIncludes:{'/*':['./dbs/*.db']},
 outputFileTracingExcludes:{'/*':['./dbs/quranDb.original-encoded.db','./dbs/quranDb.recovered.db','./.impeccable/review/**/*']},
 async rewrites(){return [{source:'/api/v1/:path*',destination:`${process.env.API_URL||'http://127.0.0.1:4401'}/v1/:path*`}]},
};
export default config;
