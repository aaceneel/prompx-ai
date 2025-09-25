import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, Wand2, Sparkles, Code, Image, Music, Video, MessageSquare, Zap, Target, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PromptGenerator, type PromptTemplate } from "@/lib/promptGenerator";

const AI_TOOLS = [
  { id: 'text', name: 'Text AI', icon: MessageSquare, description: 'ChatGPT, Claude, Gemini' },
  { id: 'image', name: 'Image AI', icon: Image, description: 'MidJourney, DALL·E, Stable Diffusion' },
  { id: 'code', name: 'Code AI', icon: Code, description: 'GitHub Copilot, Cursor' },
  { id: 'audio', name: 'Audio AI', icon: Music, description: 'ElevenLabs, MusicGen' },
  { id: 'video', name: 'Video AI', icon: Video, description: 'Runway, Pika, Sora' },
];

const WORKFLOW_STEPS = [
  { number: 1, title: 'Detect AI Tool Type', description: 'Identify the target AI platform' },
  { number: 2, title: 'Clarify the Goal', description: 'Extract the true intention' },
  { number: 3, title: 'Break Down the Prompt', description: 'Define objective, context, constraints' },
  { number: 4, title: 'Optimize for Accuracy', description: 'Add missing details and clarity' },
  { number: 5, title: 'Generate Final Prompt', description: 'Create copy-paste ready versions' },
];

export const PromptEngineer = () => {
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [userInput, setUserInput] = useState('');
  const [optimizedPrompts, setOptimizedPrompts] = useState<PromptTemplate[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard",
      });
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const generatePrompts = async () => {
    if (!selectedTool || !userInput.trim()) {
      toast({
        title: "Missing information", 
        description: "Please select an AI tool and enter your request",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setShowResults(false);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const generatedPrompts = PromptGenerator.generate(selectedTool, userInput);
    setOptimizedPrompts(generatedPrompts);
    setIsGenerating(false);
    
    // Animate results appearing
    setTimeout(() => {
      setShowResults(true);
      // Scroll to results on mobile
      document.getElementById('results')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 text-center bg-gradient-hero overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-particles"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
          
          {/* Geometric shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 border border-white/10 rotate-45 animate-float" />
          <div className="absolute top-40 right-16 w-24 h-24 border border-white/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-white/15 rotate-12 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 right-1/3 w-20 h-20 border border-white/25 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:50px_50px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-3 sm:px-4 py-2 mb-4 sm:mb-6 shadow-luxury">
            <Sparkles className="w-4 h-4 text-white/90" />
            <span className="text-xs sm:text-sm text-white/80 font-medium tracking-wide">LUXURY PROMPT ENGINEERING</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
            Transform Ideas into<br className="hidden sm:block" />
            <span className="inline sm:block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Perfected AI Prompts</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto mb-6 sm:mb-8 px-4 leading-relaxed">
            Elite prompt engineering platform that transforms your concepts into precision-crafted instructions for cutting-edge AI systems.
          </p>
          
          <Button 
            variant="hero" 
            size="lg" 
            className="animate-float shadow-luxury hover:shadow-glow"
            onClick={() => document.getElementById('tool-selector')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Wand2 className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="hidden sm:inline font-semibold tracking-wide">BEGIN CRAFTING</span>
            <span className="sm:hidden font-semibold">START</span>
          </Button>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="py-12 sm:py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 animate-fade-in tracking-tight">
            Precision Engineering Process
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {WORKFLOW_STEPS.map((step, index) => (
              <Card 
                key={step.number} 
                className="relative border-border bg-card shadow-luxury hover:shadow-glow transition-all duration-500 hover:scale-105 animate-slide-up group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs sm:text-sm font-bold px-3 py-1 shadow-luxury">
                      {step.number}
                    </Badge>
                    {index < WORKFLOW_STEPS.length - 1 && (
                      <div className="hidden lg:block absolute top-6 sm:top-8 -right-3 w-6 h-px bg-border group-hover:bg-primary transition-colors duration-300" />
                    )}
                  </div>
                  <h3 className="font-bold mb-2 text-sm sm:text-base tracking-wide">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Tool */}
      <section id="tool-selector" className="py-12 sm:py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <Card className="border-border bg-card shadow-luxury backdrop-blur-sm animate-scale-in">
            <CardHeader className="pb-4 sm:pb-6 border-b border-border/50">
              <CardTitle className="text-xl sm:text-2xl text-center font-bold tracking-wide">
                Elite AI Platform Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 sm:space-y-8 p-6 sm:p-8">
              {/* Tool Selection */}
              <div>
                <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 tracking-wide">Choose Your AI Platform</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                  {AI_TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Button
                        key={tool.id}
                        variant={selectedTool === tool.id ? "gradient" : "outline"}
                        className={`flex flex-col h-auto p-3 sm:p-4 transition-all duration-500 hover:scale-110 shadow-luxury ${
                          selectedTool === tool.id ? 'shadow-glow scale-105 bg-primary text-primary-foreground' : 'hover:shadow-glow hover:bg-accent/5'
                        }`}
                        onClick={() => setSelectedTool(tool.id)}
                      >
                        <Icon className="w-6 sm:w-8 h-6 sm:h-8 mb-1 sm:mb-2" />
                        <span className="font-bold text-xs sm:text-sm tracking-wide">{tool.name}</span>
                        <span className="text-xs opacity-70 hidden sm:block text-center leading-tight font-medium">
                          {tool.description}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Input Area */}
              <div>
                <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 tracking-wide">Craft Your Vision</h3>
                <Textarea
                  placeholder="Describe your vision here... Transform any concept into AI-ready instructions."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[100px] sm:min-h-[120px] bg-background border-border resize-none text-sm sm:text-base shadow-luxury focus:shadow-glow transition-all duration-300 font-medium"
                  rows={4}
                />
                {userInput.length > 0 && (
                  <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                    <span className="font-medium">{userInput.length} characters</span>
                    {selectedTool && (
                      <Badge variant="secondary" className="text-xs font-bold shadow-luxury">
                        {AI_TOOLS.find(t => t.id === selectedTool)?.name} Selected
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full transition-all duration-500 shadow-luxury hover:shadow-glow font-bold tracking-wide text-base" 
                onClick={generatePrompts}
                disabled={isGenerating || !selectedTool || !userInput.trim()}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    <span className="hidden sm:inline">CRAFTING PERFECTION...</span>
                    <span className="sm:hidden">CRAFTING...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span className="hidden sm:inline">GENERATE ELITE PROMPTS</span>
                    <span className="sm:hidden">GENERATE</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results */}
      {optimizedPrompts.length > 0 && (
        <section id="results" className="py-12 sm:py-16 px-4 bg-background">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 transition-all duration-500 tracking-tight ${
              showResults ? 'animate-fade-in' : 'opacity-0'
            }`}>
              Your Masterfully Crafted Prompts
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {optimizedPrompts.map((promptTemplate, index) => {
                const getIcon = (title: string) => {
                  if (title.includes('Quick') || title.includes('Simple')) return Zap;
                  if (title.includes('Professional') || title.includes('Production')) return Target;
                  if (title.includes('Creative') || title.includes('Artistic')) return Sparkles;
                  if (title.includes('Educational') || title.includes('Learning')) return BookOpen;
                  return Sparkles;
                };
                const Icon = getIcon(promptTemplate.title);
                
                return (
                  <Card 
                    key={index} 
                    className={`border-border bg-card shadow-luxury hover:shadow-glow transition-all duration-700 hover:scale-[1.02] group ${
                      showResults ? 'animate-slide-up' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 border-b border-border/30">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Icon className="w-4 sm:w-5 h-4 sm:h-5 text-primary group-hover:animate-pulse" />
                        <CardTitle className="text-base sm:text-lg font-bold tracking-wide">
                          {promptTemplate.title}
                          {index === 0 && (
                            <Badge className="ml-2 bg-primary text-primary-foreground text-xs font-bold shadow-luxury">
                              ELITE
                            </Badge>
                          )}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(promptTemplate.prompt, index)}
                        className="h-8 w-8 p-0 hover:bg-primary/10 transition-all duration-300 hover:scale-110 shadow-luxury"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === index ? (
                          <CheckCircle className="w-4 h-4 text-primary animate-scale-in" />
                        ) : (
                          <Copy className="w-4 h-4 group-hover:animate-pulse" />
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="bg-muted/30 rounded-lg p-3 sm:p-4 border border-border/50 shadow-luxury">
                        <pre className="text-xs sm:text-sm whitespace-pre-wrap font-mono leading-relaxed text-foreground break-words">
                          {promptTemplate.prompt}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Additional Actions */}
            <div className={`mt-8 text-center transition-all duration-700 ${
              showResults ? 'animate-fade-in' : 'opacity-0'
            }`}>
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                Require alternative variations? Refine your vision or select a different platform.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setOptimizedPrompts([]);
                  setShowResults(false);
                  setUserInput('');
                  document.getElementById('tool-selector')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:bg-primary/10 shadow-luxury hover:shadow-glow font-bold tracking-wide"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                CRAFT NEW PROMPTS
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};