'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="unavailable"><h1>This page could not load.</h1><p>Please try again. Your saved passages remain on this device.</p><button className="primary-button" onClick={reset}>Try again</button><a href="/">Back to home</a></main>}
