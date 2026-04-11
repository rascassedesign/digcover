'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  date: string; // YYYY-MM-DD
  slug: string;
};

export default function AlbumClient({ date }: Props) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/?date=${date}`);
  }, [date, router]);

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Redirection vers DigCover…</p>
      <noscript>
        <a href={`/?date=${date}`}>Voir cet album sur DigCover</a>
      </noscript>
    </main>
  );
}