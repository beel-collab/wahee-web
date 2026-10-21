import Link from 'next/link';

export default function Brand(){
 return <Link href="/" className="brand" dir="rtl" aria-label="Wahee home"><span className="brand-mark"><span className="brand-name" lang="ar" dir="rtl">وحي</span><span className="brand-dot" aria-hidden="true">.</span></span></Link>;
}
