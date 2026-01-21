// app/page.tsx
/**
 * Home page (/)
 * Resources: app/_source/
 */

import Header from './_source/components/Header';
import Ticketing from './_source/components/ticketing/Ticketing';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <>
      <Header />
      <Ticketing />
    </>
  );
}
