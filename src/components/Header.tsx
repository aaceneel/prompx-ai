import React from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, LogOut } from 'lucide-react';

interface HeaderProps {
  user?: User | null;
}

export const Header = ({ user }: HeaderProps) => {
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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-light text-white tracking-tight">
              PROMPTX
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#" 
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 font-light tracking-wide"
            >
              HOME
            </a>
            <a 
              href="#" 
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 font-light tracking-wide"
            >
              FEATURES
            </a>
            <a 
              href="#" 
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 font-light tracking-wide"
            >
              DOCS
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden sm:block text-sm text-zinc-400 font-light">
                  {user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 h-9 px-4"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="bg-white text-black hover:bg-zinc-200 font-medium transition-all duration-300 h-9 px-6"
              >
                GET STARTED
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
