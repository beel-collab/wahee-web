import Reader from './reader';
import type { Chapter } from '../data/fatiha';
export const dynamic = 'force-dynamic';
export default async function Page() {
 try {
 const response = await fetch(`${process.env.API_URL || 'http://127.0.0.1:4401'}/v1/chapters/1`, {cache:'no-store',signal:AbortSignal.timeout(5000)});
 if(!response.ok) throw new Error('Content unavailable');
 const {data}:{data:Chapter} = await response.json();
 return <Reader chapter={data}/>;
 } catch {return <main className="unavailable"><h1>Let’s get your reader ready.</h1><p>The content service is unavailable. Start both services with <code>npm run dev</code>, then refresh this page.</p><a href="/">Try again</a></main>}
}
