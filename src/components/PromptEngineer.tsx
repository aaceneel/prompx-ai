import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, Wand2, Sparkles, Code, Image, Music, Video, MessageSquare, Zap, Target, BookOpen, ArrowRight, Stars, Palette, Brain } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-bg">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-24 lg:py-32 px-4 text-center bg-gradient-hero overflow-hidden">
        {/* Animated Background Layers */}
        <div className="absolute inset-0">
          {/* Primary gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
          
          {/* Animated geometric patterns */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-white/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          </div>
          
          {/* Moving grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
          </div>
          
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.1),rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
          
          {/* Edge vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_70%,rgba(0,0,0,0.4)_100%)]" />
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10 animate-fade-in">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-3 bg-black/30 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-8 shadow-2xl hover:bg-black/40 transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Stars className="w-5 h-5 text-white/90 animate-pulse" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-0 animate-ping">
                  <Stars className="w-5 h-5 text-white/30" />
                </div>
              </div>
              <span className="text-sm font-bold text-white/90 tracking-widest uppercase bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Professional AI Engineering
              </span>
              <div className="w-2 h-2 bg-gradient-to-r from-white to-white/60 rounded-full animate-pulse group-hover:animate-bounce" />
            </div>
          </div>
          
          {/* Main Headline with Enhanced Typography */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight tracking-tight">
            <span className="inline-block text-white mb-2 animate-slide-up">Craft Perfect</span><br />
            <span className="inline-block bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent animate-slide-up filter drop-shadow-lg" style={{ animationDelay: '0.2s' }}>
              AI Prompts
            </span>
            {/* Decorative line */}
            <div className="mx-auto mt-4 w-24 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full animate-fade-in" style={{ animationDelay: '0.8s' }} />
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-xl text-white/80 max-w-2xl lg:max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light px-4 sm:px-0">
            Transform your ideas into precision-engineered prompts that unlock the full potential of any AI model.
          </p>
          
          {/* Enhanced CTA Section */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              variant="premium" 
              size="lg" 
              className="relative bg-white text-black hover:bg-zinc-100 hover:shadow-2xl group text-lg px-12 py-4 h-16 rounded-2xl font-bold overflow-hidden border-2 border-white/20 transition-all duration-300 hover:scale-105"
              onClick={() => document.getElementById('tool-selector')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
              
              <div className="relative flex items-center gap-3">
                <div className="p-1 rounded-lg bg-black/10 group-hover:bg-black/20 transition-colors">
                  <Palette className="w-5 h-5 group-hover:animate-spin transition-transform duration-700" />
                </div>
                <span>Start Crafting</span>
                <ArrowRight className="w-5 h-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
              </div>
            </Button>
            
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="py-20 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 animate-fade-in px-4 sm:px-0">
              Engineering Process
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground animate-fade-in px-4 sm:px-0 max-w-2xl mx-auto" style={{ animationDelay: '0.1s' }}>
              Five steps to transform your vision into AI-ready instructions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
            {WORKFLOW_STEPS.map((step, index) => (
              <div 
                key={step.number} 
                className="relative group animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Card className="h-full bg-gradient-card shadow-md hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 border-0 overflow-hidden group-hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-md group-hover:animate-float">
                        <span className="text-lg font-bold text-white">{step.number}</span>
                      </div>
                      {index < WORKFLOW_STEPS.length - 1 && (
                        <div className="hidden lg:block flex-1 h-px bg-gradient-to-r from-border via-border/60 to-transparent" />
                      )}
                    </div>
                    <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Tool */}
      <section id="tool-selector" className="py-20 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-card shadow-elegant border-0 animate-scale-in overflow-hidden">
            <div className="p-8 sm:p-12">
              <div className="text-center mb-10">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 px-4 sm:px-0">
                  Select Your AI Platform
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground px-4 sm:px-0 max-w-2xl mx-auto">
                  Choose the AI tool you want to create optimized prompts for
                </p>
              </div>

              {/* Tool Selection */}
              <div className="mb-10">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {AI_TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        className={`group relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                          selectedTool === tool.id 
                            ? 'bg-gradient-primary text-white border-primary shadow-glow scale-105' 
                            : 'bg-background border-border/30 hover:border-primary/30 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedTool(tool.id)}
                      >
                        <div className={`p-3 rounded-xl transition-all duration-300 ${
                          selectedTool === tool.id 
                            ? 'bg-white/20 group-hover:animate-pulse' 
                            : 'bg-primary/5 group-hover:bg-primary/10'
                        }`}>
                          <Icon className={`w-6 h-6 transition-colors ${
                            selectedTool === tool.id ? 'text-white' : 'text-primary'
                          }`} />
                        </div>
                        <div className="text-center">
                          <span className={`text-xs sm:text-sm font-bold block ${
                            selectedTool === tool.id ? 'text-white' : 'text-foreground'
                          }`}>
                            {tool.name}
                          </span>
                          <span className={`text-xs mt-1 hidden md:block ${
                            selectedTool === tool.id ? 'text-white/80' : 'text-muted-foreground'
                          }`}>
                            {tool.description}
                          </span>
                        </div>
                        {selectedTool === tool.id && (
                          <div className="absolute -top-1 -right-1">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse-subtle shadow-md" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Area */}
              <div className="mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 px-4 sm:px-0">
                  Describe Your Vision
                </h3>
                <div className="relative">
                  <Textarea
                    placeholder="What would you like the AI to accomplish? Describe your goal, the context, and any specific requirements..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-[140px] bg-background/50 backdrop-blur border-2 border-border/30 focus:border-primary/50 resize-none text-base rounded-2xl shadow-inner focus:shadow-md transition-all duration-300 p-6"
                    rows={6}
                  />
                  {userInput.length > 0 && (
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-primary/90 text-primary-foreground shadow-md">
                        {userInput.length} chars
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <Button 
                variant="stylish" 
                size="lg" 
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold mx-4 sm:mx-0" 
                onClick={generatePrompts}
                disabled={isGenerating || !selectedTool || !userInput.trim()}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current" />
                    <span>Engineering your prompts...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
                    <span>Generate Premium Prompts</span>
                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Results */}
      {optimizedPrompts.length > 0 && (
        <section id="results" className="py-20 px-4 bg-muted/20">
          <div className="max-w-4xl mx-auto">
            <div className={`text-center mb-12 transition-all duration-700 ${
              showResults ? 'animate-fade-in' : 'opacity-0'
            }`}>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 px-4 sm:px-0">
                Your Premium Prompts
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground px-4 sm:px-0 max-w-2xl mx-auto">
                Copy and paste these optimized prompts into your AI tool
              </p>
            </div>
            
            <div className="space-y-6">
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
                    className={`bg-gradient-card shadow-elegant hover:shadow-glow border-0 transition-all duration-700 hover:-translate-y-1 group overflow-hidden ${
                      showResults ? 'animate-slide-up' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/20 bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-primary/10 group-hover:animate-pulse">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
                            {promptTemplate.title}
                          </CardTitle>
                          {index === 0 && (
                            <Badge className="mt-1 bg-gradient-primary text-white shadow-md">
                              ⭐ Recommended
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopy(promptTemplate.prompt, index)}
                        className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 group/copy"
                      >
                        {copiedIndex === index ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">Copied!</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Copy className="w-4 h-4 group-hover/copy:animate-pulse" />
                            <span className="text-sm font-medium">Copy</span>
                          </div>
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="bg-background/70 backdrop-blur rounded-xl p-4 sm:p-6 border border-border/30 shadow-inner">
                        <pre className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-foreground break-words font-mono">
                          {promptTemplate.prompt}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Reset Button */}
            <div className={`mt-12 text-center transition-all duration-700 ${
              showResults ? 'animate-fade-in' : 'opacity-0'
            }`}>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  setOptimizedPrompts([]);
                  setShowResults(false);
                  setUserInput('');
                  document.getElementById('tool-selector')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group"
              >
                <Wand2 className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Create New Prompts
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};