'use client';

import dynamic from 'next/dynamic';

// The PLXN workspace is fully client-side (canvas, localStorage, drawing).
// Load it with ssr disabled to avoid window/localStorage mismatch.
const PlxnApp = dynamic(() => import('@/plxn/App'), { ssr: false, loading: () => null });

export default function Home() {
  return <PlxnApp />;
}
