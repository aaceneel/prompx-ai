import React from 'react';
import { User } from '@supabase/supabase-js';
import { Header } from '@/components/Header';

interface LayoutProps {
  children: React.ReactNode;
  user?: User | null;
}

export const Layout = ({ children, user }: LayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-black">
      <Header user={user} />
      
      {/* Main Content Container with top padding for fixed header */}
      <main className="w-full pt-20">
        {children}
      </main>
    </div>
  );
};

export default Layout;