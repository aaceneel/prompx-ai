import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, LogOut, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface HeaderProps {
  user?: User | null;
}

export const Header = ({ user }: HeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'HOME', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: 'FEATURES', action: () => scrollToSection('features') },
    { label: 'PRICING', action: () => scrollToSection('pricing') },
    { label: 'API', action: () => scrollToSection('api') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-md flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </div>
            <span className="text-lg sm:text-xl font-light text-white tracking-tight">
              PrompX
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button 
                key={link.label}
                onClick={link.action}
                className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 font-light tracking-wide"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {user ? (
              <>
                <span className="hidden lg:block text-sm text-zinc-400 font-light truncate max-w-[180px]">
                  {user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 h-9 px-3 lg:px-4"
                >
                  <LogOut className="w-4 h-4 lg:mr-2" />
                  <span className="hidden lg:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="bg-white text-black hover:bg-zinc-200 font-medium transition-all duration-300 h-9 px-4 lg:px-6 text-sm"
              >
                GET STARTED
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-white hover:bg-white/10 h-9 w-9 p-0"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-black/95 border-white/10 backdrop-blur-xl">
              <div className="flex flex-col gap-6 mt-8">
                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={link.action}
                      className="text-base text-zinc-300 hover:text-white transition-colors duration-300 font-light tracking-wide py-2 text-left"
                    >
                      {link.label}
                    </button>
                  ))}
                </nav>

                {/* Mobile User Section */}
                <div className="pt-6 border-t border-white/10">
                  {user ? (
                    <div className="flex flex-col gap-4">
                      <span className="text-sm text-zinc-400 font-light truncate">
                        {user.email}
                      </span>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 h-10"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        navigate("/auth");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-white text-black hover:bg-zinc-200 font-medium transition-all duration-300 h-10"
                    >
                      GET STARTED
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
