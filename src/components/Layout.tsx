import React from 'react';
import { User } from '@supabase/supabase-js';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface LayoutProps {
  children: React.ReactNode;
  user?: User | null;
}

export const Layout = ({ children, user }: LayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-black flex flex-col overflow-x-hidden">
      <Header user={user} />
      
      {/* Main Content Container with proper spacing for fixed header */}
      <main className="w-full mt-16 lg:mt-20 flex-1 relative">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;