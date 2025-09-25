import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, Wand2, Sparkles, Code, Image, Music, Video, MessageSquare, Zap, Target, BookOpen, ArrowRight } from "lucide-react";
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
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 text-center bg-gradient-primary">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/10 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-primary-foreground/80 tracking-wide">AI PROMPT ENGINEERING</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-primary-foreground mb-6 leading-[1.1] tracking-tight">
            Professional Prompt<br />
            <span className="text-primary-foreground/80">Engineering Platform</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-8 leading-relaxed font-light">
            Transform your ideas into precision-crafted prompts for any AI model. Built for professionals who demand excellence.
          </p>
          
          <Button 
            variant="grok" 
            size="lg" 
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 group"
            onClick={() => document.getElementById('tool-selector')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="font-medium">Get Started</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-medium text-center mb-12 animate-fade-in text-foreground/90">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
            {WORKFLOW_STEPS.map((step, index) => (
              <div 
                key={step.number} 
                className="relative group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-border flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{step.number}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2 text-sm text-foreground">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
                {index < WORKFLOW_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-4 -right-4 w-8 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Tool */}
      <section id="tool-selector" className="py-16 sm:py-20 px-4 bg-gradient-subtle">
        <div className="max-w-3xl mx-auto">
          <Card className="border-border bg-card shadow-lg animate-scale-in">
            <CardContent className="p-6 sm:p-8">
              {/* Tool Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 text-foreground">Select AI Platform</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {AI_TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all hover:bg-accent/50 ${
                          selectedTool === tool.id 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-background border-border hover:border-border/60'
                        }`}
                        onClick={() => setSelectedTool(tool.id)}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{tool.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Area */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4 text-foreground">Describe your task</h3>
                <Textarea
                  placeholder="What would you like the AI to do? Be as specific or general as you'd like..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[120px] bg-background border-border resize-none text-sm rounded-lg focus:ring-1 focus:ring-primary/20"
                  rows={5}
                />
              </div>

              {/* Generate Button */}
              <Button 
                variant="grok" 
                size="lg" 
                className="w-full" 
                onClick={generatePrompts}
                disabled={isGenerating || !selectedTool || !userInput.trim()}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    <span>Generating prompts...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Prompts</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results */}
      {optimizedPrompts.length > 0 && (
        <section id="results" className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className={`text-2xl font-medium text-center mb-8 transition-all duration-500 ${
              showResults ? 'animate-fade-in' : 'opacity-0'
            }`}>
              Generated Prompts
            </h2>
            <div className="space-y-4">
              {optimizedPrompts.map((promptTemplate, index) => (
                <Card 
                  key={index} 
                  className={`border-border bg-card shadow-md hover:shadow-lg transition-all duration-300 ${
                    showResults ? 'animate-slide-up' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-base font-medium">
                      {promptTemplate.title}
                      {index === 0 && (
                        <Badge className="ml-2 bg-primary text-primary-foreground text-xs">
                          Recommended
                        </Badge>
                      )}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(promptTemplate.prompt, index)}
                      className="h-8 w-8 p-0 hover:bg-accent"
                    >
                      {copiedIndex === index ? (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                      <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed text-foreground break-words">
                        {promptTemplate.prompt}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Reset Button */}
            <div className={`mt-8 text-center transition-all duration-500 ${
              showResults ? 'animate-fade-in' : 'opacity-0'
            }`}>
              <Button 
                variant="outline" 
                onClick={() => {
                  setOptimizedPrompts([]);
                  setShowResults(false);
                  setUserInput('');
                  document.getElementById('tool-selector')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:bg-accent"
              >
                Generate New Prompts
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};