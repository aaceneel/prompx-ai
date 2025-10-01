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

  const primaryNav = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Analytics', path: '/analytics' },
  ];

  const workspaceNav = [
    { name: 'Team', path: '/team' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Compliance', path: '/compliance' },
  ];

  const accountNav = [
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl w-full">
      <div className="w-full">
        {/* Top Section - User Info & Quick Actions */}
        <div className="border-b border-white/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-between h-10">
              <div className="flex items-center gap-6 text-xs text-zinc-400">
                <span>Professional Prompt Engineering Platform</span>
              </div>
              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <span className="text-xs text-zinc-400 hidden md:block">
                      {user.email}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-xs text-zinc-400 hover:text-white h-8 px-3"
                    >
                      <LogOut className="w-3 h-3 mr-1.5" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/auth")}
                    className="text-xs text-zinc-400 hover:text-white h-8 px-3"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Logo & Primary Navigation */}
        <div className="border-b border-white/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-light text-white tracking-tight">
                  PrompX
                </span>
              </div>

              {/* Primary Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {primaryNav.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => navigate(link.path)}
                    className="px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200"
                  >
                    {link.name}
                  </button>
                ))}
              </nav>

              {/* Mobile Menu Toggle */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden text-white hover:bg-white/10"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] bg-black/95 border-white/10 backdrop-blur-xl">
                  <div className="flex flex-col gap-6 mt-8">
                    <div>
                      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Main</h3>
                      <nav className="flex flex-col gap-1">
                        {primaryNav.map((link) => (
                          <button
                            key={link.name}
                            onClick={() => {
                              navigate(link.path);
                              setMobileMenuOpen(false);
                            }}
                            className="text-left px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-md transition-all"
                          >
                            {link.name}
                          </button>
                        ))}
                      </nav>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Workspace</h3>
                      <nav className="flex flex-col gap-1">
                        {workspaceNav.map((link) => (
                          <button
                            key={link.name}
                            onClick={() => {
                              navigate(link.path);
                              setMobileMenuOpen(false);
                            }}
                            className="text-left px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-md transition-all"
                          >
                            {link.name}
                          </button>
                        ))}
                      </nav>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Account</h3>
                      <nav className="flex flex-col gap-1">
                        {accountNav.map((link) => (
                          <button
                            key={link.name}
                            onClick={() => {
                              navigate(link.path);
                              setMobileMenuOpen(false);
                            }}
                            className="text-left px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-md transition-all"
                          >
                            {link.name}
                          </button>
                        ))}
                      </nav>
                    </div>

                    {user && (
                      <div className="pt-4 border-t border-white/10">
                        <Button
                          variant="outline"
                          onClick={handleLogout}
                          className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Bottom Section - Secondary Navigation */}
        <div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="hidden lg:flex items-center justify-between h-12">
              {/* Workspace Section */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-zinc-500 mr-2">Workspace:</span>
                {workspaceNav.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => navigate(link.path)}
                    className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-white/5 rounded transition-all"
                  >
                    {link.name}
                  </button>
                ))}
              </div>

              {/* Account Section */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-zinc-500 mr-2">Account:</span>
                {accountNav.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => navigate(link.path)}
                    className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-white/5 rounded transition-all"
                  >
                    {link.name}
                  </button>
                ))}
                {!user && (
                  <Button
                    onClick={() => navigate("/auth")}
                    size="sm"
                    className="ml-2 bg-white text-black hover:bg-zinc-200 h-7 px-4 text-xs"
                  >
                    GET STARTED
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
