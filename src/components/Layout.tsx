import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen w-full">
      {/* Main Content Container */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;