import React from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface LayoutProps {
  children: React.ReactNode;
  user?: User | null;
}

export const Layout = ({ children, user }: LayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen w-full">
      {/* Header with user info and logout */}
      {user && (
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Signed in as {user.email}
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </header>
      )}
      
      {/* Main Content Container */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;