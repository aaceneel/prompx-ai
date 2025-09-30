import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = authSchema.parse({ email, password, username });
      
      const { error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username: validated.username,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success!",
          description: "Your account has been created. You can now sign in.",
        });
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "An error occurred during sign up",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = authSchema.omit({ username: true }).parse({ email, password });

      const { error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Invalid credentials",
            description: "Please check your email and password and try again.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "An error occurred during sign in",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center p-4 sm:p-6">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black opacity-90" />
      
      {/* Large decorative text background */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden">
        <h1 className="text-[12rem] sm:text-[20rem] md:text-[30rem] font-bold text-white/[0.02] tracking-tighter leading-none">
          AUTH
        </h1>
      </div>

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Elegant card with glassmorphism */}
      <Card className="w-full max-w-lg relative z-10 border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl animate-scale-in">
        <CardHeader className="space-y-2 sm:space-y-3 pb-6 sm:pb-8 px-4 sm:px-6">
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white">
            Welcome
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm sm:text-base">
            Sign in to your account or create a new one to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-900/50 border border-white/10 p-1 h-10 sm:h-11">
              <TabsTrigger 
                value="signin"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-zinc-400 transition-all duration-300 text-sm sm:text-base"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-zinc-400 transition-all duration-300 text-sm sm:text-base"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="mt-6 sm:mt-8">
              <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="signin-email" className="text-zinc-300 text-xs sm:text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-white/30 focus:ring-white/20 h-11 sm:h-12 text-sm sm:text-base transition-all duration-300"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="signin-password" className="text-zinc-300 text-xs sm:text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-white/30 focus:ring-white/20 h-11 sm:h-12 text-sm sm:text-base transition-all duration-300"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 sm:h-12 bg-white text-black hover:bg-zinc-200 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-white/20 text-sm sm:text-base touch-manipulation"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-pulse">Signing in...</span>
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-6 sm:mt-8">
              <form onSubmit={handleSignUp} className="space-y-4 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="signup-username" className="text-zinc-300 text-xs sm:text-sm font-medium">
                    Username
                  </Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-white/30 focus:ring-white/20 h-11 sm:h-12 text-sm sm:text-base transition-all duration-300"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="signup-email" className="text-zinc-300 text-xs sm:text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-white/30 focus:ring-white/20 h-11 sm:h-12 text-sm sm:text-base transition-all duration-300"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="signup-password" className="text-zinc-300 text-xs sm:text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-white/30 focus:ring-white/20 h-11 sm:h-12 text-sm sm:text-base transition-all duration-300"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 sm:h-12 bg-white text-black hover:bg-zinc-200 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-white/20 text-sm sm:text-base touch-manipulation"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-pulse">Creating account...</span>
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
