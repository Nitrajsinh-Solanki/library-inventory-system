//library-inventory-system\src\app\page.tsx

import Navbar from '@/components/Navbar';
import Home from '@/components/Home';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-grow flex">
        <Home />
      </main>
      <Footer />
    </div>
  );
}
