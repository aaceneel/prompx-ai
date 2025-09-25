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
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-2 mb-4 sm:mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-xs sm:text-sm text-white/90">Professional Prompt Engineering</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Transform Vague Ideas into<br className="hidden sm:block" />
            <span className="inline sm:block">Perfect AI Prompts</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Professional prompt engineering tool that optimizes your requests for ChatGPT, MidJourney, Stable Diffusion, and other AI platforms.
          </p>
          
          <Button 
            variant="secondary" 
            size="lg" 
            className="animate-pulse-glow"
            onClick={() => document.getElementById('tool-selector')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Wand2 className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="hidden sm:inline">Start Engineering Prompts</span>
            <span className="sm:hidden">Get Started</span>
          </Button>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 animate-fade-in">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {WORKFLOW_STEPS.map((step, index) => (
              <Card 
                key={step.number} 
                className="relative border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs sm:text-sm">
                      {step.number}
                    </Badge>
                    {index < WORKFLOW_STEPS.length - 1 && (
                      <div className="hidden lg:block absolute top-6 sm:top-8 -right-3 w-6 h-px bg-border" />
                    )}
                  </div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Tool */}
      <section id="tool-selector" className="py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-border bg-card/50 backdrop-blur-sm shadow-lg animate-scale-in">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl text-center">AI Tool Selector</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 sm:space-y-8">
              {/* Tool Selection */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Select Your Target AI Tool</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                  {AI_TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Button
                        key={tool.id}
                        variant={selectedTool === tool.id ? "gradient" : "outline"}
                        className={`flex flex-col h-auto p-3 sm:p-4 transition-all duration-300 hover:scale-105 ${
                          selectedTool === tool.id ? 'shadow-glow scale-105' : 'hover:shadow-lg'
                        }`}
                        onClick={() => setSelectedTool(tool.id)}
                      >
                        <Icon className="w-6 sm:w-8 h-6 sm:h-8 mb-1 sm:mb-2" />
                        <span className="font-medium text-xs sm:text-sm">{tool.name}</span>
                        <span className="text-xs opacity-70 hidden sm:block text-center leading-tight">
                          {tool.description}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Input Area */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Enter Your Request</h3>
                <Textarea
                  placeholder="Enter your vague idea or request here... (e.g., 'make me a video idea' or 'I want an image of a house')"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[100px] sm:min-h-[120px] bg-background border-border resize-none text-sm sm:text-base"
                  rows={4}
                />
                {userInput.length > 0 && (
                  <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                    <span>{userInput.length} characters</span>
                    {selectedTool && (
                      <Badge variant="secondary" className="text-xs">
                        {AI_TOOLS.find(t => t.id === selectedTool)?.name} Ready
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full transition-all duration-300" 
                onClick={generatePrompts}
                disabled={isGenerating || !selectedTool || !userInput.trim()}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    <span className="hidden sm:inline">Optimizing Your Prompt...</span>
                    <span className="sm:hidden">Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span className="hidden sm:inline">Generate Optimized Prompts</span>
                    <span className="sm:hidden">Generate Prompts</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results */}
      {optimizedPrompts.length > 0 && (
        <section id="results" className="py-12 sm:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 transition-all duration-500 ${
              showResults ? 'animate-fade-in' : 'opacity-0'
            }`}>
              Your Optimized Prompts
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
                    className={`border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-500 hover:shadow-lg ${
                      showResults ? 'animate-slide-up' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Icon className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                        <CardTitle className="text-base sm:text-lg">
                          {promptTemplate.title}
                          {index === 0 && (
                            <Badge className="ml-2 bg-primary text-primary-foreground text-xs">
                              Recommended
                            </Badge>
                          )}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(promptTemplate.prompt, index)}
                        className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === index ? (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-background/50 rounded-lg p-3 sm:p-4 border border-border">
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
              <p className="text-sm text-muted-foreground mb-4">
                Need different variations? Try adjusting your input or selecting a different AI tool.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setOptimizedPrompts([]);
                  setShowResults(false);
                  setUserInput('');
                  document.getElementById('tool-selector')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:bg-primary/10"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Create New Prompts
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};