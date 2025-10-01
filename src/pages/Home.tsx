import { useEffect, useState, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, Users, TrendingUp, Brain, Workflow } from "lucide-react";

// Memoized feature card for performance
const FeatureCard = memo(({ feature, user, navigate }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <Card 
        className="group cursor-pointer border border-white/10 bg-zinc-900/50 backdrop-blur-xl hover:bg-zinc-900/80 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-1 active:translate-y-0 overflow-hidden touch-manipulation will-change-transform" 
        onClick={() => user ? navigate(feature.link) : navigate("/auth")}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="pb-3 sm:pb-4 p-5 sm:p-6">
          <div className="p-2.5 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl w-fit mb-3 sm:mb-4 group-hover:bg-white/10 transition-colors duration-300">
            <feature.icon className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
          </div>
          <CardTitle className="text-white text-[1.05rem] sm:text-xl font-bold leading-snug">{feature.title}</CardTitle>
          <CardDescription className="text-zinc-400 text-[0.875rem] sm:text-base leading-[1.4rem] sm:leading-relaxed">
            {feature.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 sm:p-6 pt-0">
          <Button 
            variant="ghost" 
            className="gap-2 p-0 text-zinc-300 hover:text-white hover:bg-transparent transition-colors duration-300 text-[0.875rem] sm:text-base"
          >
            Learn more <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
});

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [sectionsVisible, setSectionsVisible] = useState({
    hero: false,
    features: false,
    cta: false
  });

  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Intersection Observer for smooth animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -10% 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setSectionsVisible(prev => ({ ...prev, [id]: true }));
        }
      });
    }, observerOptions);

    if (heroRef.current) observer.observe(heroRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
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
      {/* Hero Section with Optimized Animated Background */}
      <section 
        id="hero"
        ref={heroRef}
        className={`relative py-16 sm:py-24 md:py-28 lg:py-32 xl:py-40 overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black min-h-[calc(100vh-4rem)] flex items-center transition-opacity duration-1000 ${sectionsVisible.hero ? 'opacity-100' : 'opacity-0'}`}
        style={{ contentVisibility: 'auto' }}
      >
        {/* Animated PrompX background text - Enhanced like Auth page */}
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
          <div 
            className="text-[clamp(6rem,22vw,28vw)] sm:text-[clamp(10rem,22vw,26vw)] md:text-[clamp(14rem,24vw,28vw)] lg:text-[clamp(16rem,26vw,32vw)] font-extrabold whitespace-nowrap tracking-tighter animate-pulse-subtle"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.12) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.05em'
            }}
          >
            PrompX
          </div>
        </div>

        {/* Enhanced animated gradient orbs with glow - Like Auth page */}
        <div className="absolute top-0 -left-24 sm:-left-48 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-subtle pointer-events-none -z-10" />
        <div className="absolute bottom-0 -right-24 sm:-right-48 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-tl from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-subtle pointer-events-none -z-10" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-72 sm:h-72 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse-subtle pointer-events-none -z-10" style={{ animationDelay: '0.5s' }} />
        
        {/* Enhanced grid pattern with shimmer effect - Like Auth page */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none -z-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 w-full">
          <div className={`text-center max-w-5xl mx-auto transition-all duration-1000 delay-300 ${sectionsVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h1 className="text-[2rem] leading-[2.25rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-5 sm:mb-6 lg:mb-8 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent sm:leading-tight px-3">
              Professional Prompt Engineering Platform
            </h1>
            <p className="text-[0.95rem] leading-[1.5rem] sm:text-lg md:text-xl lg:text-2xl text-zinc-400 mb-7 sm:mb-10 lg:mb-12 font-light sm:leading-relaxed px-5 max-w-3xl mx-auto">
              Create, optimize, and manage AI prompts with enterprise-grade tools
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-5 sm:px-0">
              {user ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate("/dashboard")} 
                  className="gap-2 bg-gradient-to-r from-white to-zinc-100 text-zinc-900 hover:from-zinc-50 hover:to-white font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-white/30 h-[3.25rem] sm:h-14 lg:h-16 px-7 sm:px-8 lg:px-10 text-[0.95rem] sm:text-base lg:text-lg rounded-xl hover:scale-105 active:scale-95 w-full sm:w-auto touch-manipulation min-h-[3.25rem]"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    onClick={() => navigate("/auth")} 
                    className="gap-2 bg-gradient-to-r from-white to-zinc-100 text-zinc-900 hover:from-zinc-50 hover:to-white font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-white/30 h-[3.25rem] sm:h-14 lg:h-16 px-7 sm:px-8 lg:px-10 text-[0.95rem] sm:text-base lg:text-lg rounded-xl hover:scale-105 active:scale-95 w-full sm:w-auto touch-manipulation min-h-[3.25rem]"
                  >
                    Get Started <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => navigate("/auth")}
                    className="h-[3.25rem] sm:h-14 lg:h-16 px-7 sm:px-8 lg:px-10 text-[0.95rem] sm:text-base lg:text-lg bg-zinc-900/50 border-white/10 text-white hover:bg-zinc-900/80 hover:border-white/30 backdrop-blur-xl rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto touch-manipulation min-h-[3.25rem]"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Optimized */}
      <section 
        id="features" 
        ref={featuresRef}
        className={`py-12 sm:py-16 md:py-20 lg:py-24 relative bg-gradient-to-b from-black via-zinc-950 to-zinc-900 overflow-hidden transition-opacity duration-1000 ${sectionsVisible.features ? 'opacity-100' : 'opacity-0'}`}
        style={{ contentVisibility: 'auto' }}
      >
        {/* Lightweight background elements */}
        {sectionsVisible.features && (
          <>
            <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-64 sm:h-64 bg-blue-500/4 rounded-full blur-[60px] pointer-events-none will-change-transform" />
            <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-48 h-48 sm:w-64 sm:h-64 bg-purple-500/4 rounded-full blur-[60px] pointer-events-none will-change-transform" />
          </>
        )}
        
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
          <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-700 ${sectionsVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="text-[1.75rem] leading-[2rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent px-3">
              Powerful Features
            </h2>
            <p className="text-[0.9rem] leading-[1.4rem] sm:text-lg md:text-xl text-zinc-400 font-light px-5">
              Everything you need for professional prompt engineering
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} user={user} navigate={navigate} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Optimized */}
      <section 
        id="cta"
        ref={ctaRef}
        className={`relative py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black overflow-hidden transition-opacity duration-1000 ${sectionsVisible.cta ? 'opacity-100' : 'opacity-0'}`}
        style={{ contentVisibility: 'auto' }}
      >
        {/* Lightweight background elements */}
        {sectionsVisible.cta && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-gradient-to-r from-blue-500/8 to-purple-500/8 rounded-full blur-[100px] will-change-transform" />
          </div>
        )}
        
        {/* Lightweight grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 text-center relative z-10">
          <div className={`max-w-4xl mx-auto space-y-5 sm:space-y-8 transition-all duration-700 delay-200 ${sectionsVisible.cta ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="text-[1.85rem] leading-[2.15rem] sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent sm:leading-tight px-3">
              Ready to Get Started?
            </h2>
            <p className="text-[0.95rem] leading-[1.5rem] sm:text-lg md:text-xl text-zinc-400 font-light sm:leading-relaxed max-w-2xl mx-auto px-5">
              Join thousands of professionals using our platform to create better AI prompts
            </p>
            <div className="pt-2 sm:pt-4 px-5 sm:px-0">
              <Button 
                size="lg" 
                onClick={() => navigate(user ? "/dashboard" : "/auth")} 
                className="gap-2 bg-gradient-to-r from-white to-zinc-100 text-zinc-900 hover:from-zinc-50 hover:to-white font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-white/30 h-[3.25rem] sm:h-14 md:h-16 px-7 sm:px-8 md:px-10 text-[0.95rem] sm:text-base md:text-lg rounded-xl hover:scale-105 active:scale-95 w-full sm:w-auto touch-manipulation min-h-[3.25rem]"
              >
                {user ? "Go to Dashboard" : "Start Free Trial"} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
