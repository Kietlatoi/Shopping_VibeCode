import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

export function BuyerLayout() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Breadcrumbs />
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
