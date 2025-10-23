import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, Users, TrendingUp, Brain, Workflow } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Prompts",
      description: "Generate optimized prompts with advanced AI assistance",
      link: "/dashboard"
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Track performance and ROI with detailed analytics",
      link: "/analytics"
    },
    {
      icon: Shield,
      title: "Compliance Checking",
      description: "Ensure your prompts meet industry standards",
      link: "/compliance"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together seamlessly with your team",
      link: "/team"
    },
    {
      icon: Workflow,
      title: "Workflow Builder",
      description: "Create automated prompt workflows",
      link: "/dashboard"
    },
    {
      icon: Zap,
      title: "Prompt Marketplace",
      description: "Discover and share prompt templates",
      link: "/marketplace"
    }
  ];

  return (
    <Layout user={user}>
      {/* Hero Section with Animated Background */}
      <section className="relative py-20 sm:py-32 overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
        {/* Animated PrompX background text */}
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
          <div 
            className="text-[clamp(6rem,25vw,28vw)] font-extrabold whitespace-nowrap tracking-tighter opacity-80"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.05em'
            }}
          >
            PrompX
          </div>
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-48 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-subtle pointer-events-none" />
        <div className="absolute bottom-0 -right-48 w-96 h-96 bg-gradient-to-tl from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-subtle pointer-events-none" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse-subtle pointer-events-none" style={{ animationDelay: '0.5s' }} />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent leading-tight">
              Professional Prompt Engineering Platform
            </h1>
            <p className="text-xl sm:text-2xl text-zinc-400 mb-10 font-light leading-relaxed">
              Create, optimize, and manage AI prompts with enterprise-grade tools
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {user ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate("/dashboard")} 
                  className="gap-2 bg-gradient-to-r from-white to-zinc-100 text-zinc-900 hover:from-zinc-50 hover:to-white font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-white/30 h-14 px-8 text-base rounded-xl hover:scale-105"
                >
                  Go to Dashboard <ArrowRight className="w-5 h-5" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    onClick={() => navigate("/auth")} 
                    className="gap-2 bg-gradient-to-r from-white to-zinc-100 text-zinc-900 hover:from-zinc-50 hover:to-white font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-white/30 h-14 px-8 text-base rounded-xl hover:scale-105"
                  >
                    Get Started <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => navigate("/auth")}
                    className="h-14 px-8 text-base bg-zinc-900/50 border-white/10 text-white hover:bg-zinc-900/80 hover:border-white/30 backdrop-blur-xl rounded-xl hover:scale-105 transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative bg-gradient-to-b from-black via-zinc-950 to-zinc-900 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-lg sm:text-xl text-zinc-400 font-light">
              Everything you need for professional prompt engineering
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group cursor-pointer border border-white/10 bg-zinc-900/50 backdrop-blur-xl hover:bg-zinc-900/80 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-1 overflow-hidden" 
                onClick={() => user ? navigate(feature.link) : navigate("/auth")}
              >
                {/* Gradient accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="pb-4">
                  <div className="p-3 bg-white/5 rounded-xl w-fit mb-4 group-hover:bg-white/10 transition-colors duration-300">
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl font-bold">{feature.title}</CardTitle>
                  <CardDescription className="text-zinc-400 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="ghost" 
                    className="gap-2 p-0 text-zinc-300 hover:text-white hover:bg-transparent transition-colors duration-300"
                  >
                    Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        </div>
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent leading-tight">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto">
              Join thousands of professionals using our platform to create better AI prompts
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate(user ? "/dashboard" : "/auth")} 
              className="gap-2 bg-gradient-to-r from-white to-zinc-100 text-zinc-900 hover:from-zinc-50 hover:to-white font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-white/30 h-16 px-10 text-lg rounded-xl hover:scale-105 mt-6"
            >
              {user ? "Go to Dashboard" : "Start Free Trial"} <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
