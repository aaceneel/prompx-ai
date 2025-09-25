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
  const [enhancedInput, setEnhancedInput] = useState('');
  const [inputEnhancements, setInputEnhancements] = useState<string[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);
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

  const detectUserIntent = (input: string): { 
    intent: string; 
    domain: string; 
    style: string; 
    confidence: number;
    context: string[];
  } => {
    const lower = input.toLowerCase();
    
    // Intent patterns
    const intentPatterns = {
      create: /\b(create|make|build|generate|produce|design|craft)\b/i,
      improve: /\b(improve|enhance|optimize|refine|polish|upgrade|fix)\b/i,
      explain: /\b(explain|describe|tell|show|how|what|why|define)\b/i,
      analyze: /\b(analyze|review|evaluate|assess|compare|examine)\b/i,
      plan: /\b(plan|strategy|roadmap|outline|framework|structure)\b/i,
      solve: /\b(solve|fix|debug|troubleshoot|resolve|handle)\b/i,
      learn: /\b(learn|understand|tutorial|guide|teach|study)\b/i,
      convert: /\b(convert|transform|translate|change|adapt|modify)\b/i
    };

    // Domain patterns
    const domainPatterns = {
      business: /\b(business|marketing|sales|revenue|profit|strategy|company|corporate|enterprise|startup)\b/i,
      technical: /\b(code|programming|software|development|API|database|system|tech|algorithm|function)\b/i,
      creative: /\b(creative|art|design|visual|story|content|copy|brand|aesthetic|beautiful|artistic)\b/i,
      academic: /\b(research|study|academic|paper|thesis|analysis|scientific|scholarly|education)\b/i,
      personal: /\b(personal|lifestyle|health|fitness|relationship|family|hobby|self|individual)\b/i,
      professional: /\b(professional|career|job|work|skill|resume|interview|workplace|office)\b/i
    };

    // Style patterns
    const stylePatterns = {
      formal: /\b(formal|professional|official|corporate|serious|academic)\b/i,
      casual: /\b(casual|friendly|relaxed|informal|conversational|easy)\b/i,
      creative: /\b(creative|innovative|unique|original|artistic|imaginative)\b/i,
      technical: /\b(technical|precise|detailed|specific|systematic|structured)\b/i,
      persuasive: /\b(persuasive|convincing|compelling|engaging|powerful|impactful)\b/i,
      educational: /\b(educational|teaching|learning|tutorial|instructional|explanatory)\b/i
    };

    // Detect patterns
    const intent = Object.entries(intentPatterns).find(([_, pattern]) => pattern.test(input))?.[0] || 'create';
    const domain = Object.entries(domainPatterns).find(([_, pattern]) => pattern.test(input))?.[0] || 'general';
    const style = Object.entries(stylePatterns).find(([_, pattern]) => pattern.test(input))?.[0] || 'professional';

    // Calculate confidence based on pattern matches and specificity
    let confidence = 0.5;
    if (input.length > 50) confidence += 0.2;
    if (input.includes('specific') || input.includes('detailed')) confidence += 0.1;
    if (Object.values(intentPatterns).some(pattern => pattern.test(input))) confidence += 0.1;
    if (Object.values(domainPatterns).some(pattern => pattern.test(input))) confidence += 0.1;

    // Context inference
    const context: string[] = [];
    if (input.length < 30) context.push('needs_expansion');
    if (!input.match(/[.!?]$/)) context.push('needs_punctuation');
    if (/\b(i|me|my|myself)\b/i.test(input)) context.push('personal_request');
    if (/\b(we|us|our|team|company)\b/i.test(input)) context.push('team_request');
    if (/\b(urgent|asap|quickly|fast|immediate)\b/i.test(input)) context.push('time_sensitive');
    if (/\b(professional|business|client|customer)\b/i.test(input)) context.push('professional_context');

    return { intent, domain, style, confidence, context };
  };

  const enhanceUserInput = async (input: string): Promise<{ enhanced: string; improvements: string[] }> => {
    const improvements: string[] = [];
    let enhanced = input.trim();

    if (!enhanced) return { enhanced, improvements };

    // Detect user intent and context
    const analysis = detectUserIntent(enhanced);
    
    // Phase 1: Basic language fixes
    if (enhanced[0] !== enhanced[0].toUpperCase()) {
      enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
      improvements.push("Capitalized first letter");
    }

    if (!enhanced.match(/[.!?]$/)) {
      enhanced += '.';
      improvements.push("Added proper punctuation");
    }

    // Advanced typo and grammar fixes
    const advancedFixes = [
      // Common typos
      { from: /\bi\b/g, to: 'I', desc: 'Fixed capitalization' },
      { from: /\bteh\b/g, to: 'the', desc: 'Fixed typo' },
      { from: /\brecieve\b/g, to: 'receive', desc: 'Fixed spelling' },
      { from: /\bdefintely\b/g, to: 'definitely', desc: 'Fixed spelling' },
      { from: /\bwant to\b/g, to: 'need to', desc: 'Made more specific' },
      
      // Informal to formal
      { from: /\bkinda\b/g, to: 'somewhat', desc: 'Made more professional' },
      { from: /\bgonna\b/g, to: 'going to', desc: 'Made more formal' },
      { from: /\bwanna\b/g, to: 'want to', desc: 'Made more formal' },
      { from: /\bu\b/g, to: 'you', desc: 'Expanded abbreviation' },
      { from: /\bur\b/g, to: 'your', desc: 'Expanded abbreviation' },
      { from: /\btn\b/g, to: 'than', desc: 'Fixed abbreviation' },
      { from: /\bw\/\b/g, to: 'with', desc: 'Expanded abbreviation' },
      
      // Clarity improvements
      { from: /\bthat will\b/g, to: 'that should', desc: 'Clarified requirements' },
      { from: /\bstuff\b/g, to: 'content', desc: 'Made more specific' },
      { from: /\bthings\b/g, to: 'elements', desc: 'Made more specific' },
      { from: /\bokay\b/g, to: 'suitable', desc: 'Made more professional' },
      { from: /\bcool\b/g, to: 'effective', desc: 'Made more professional' }
    ];

    advancedFixes.forEach(fix => {
      if (fix.from.test(enhanced)) {
        enhanced = enhanced.replace(fix.from, fix.to);
        if (!improvements.includes(fix.desc)) {
          improvements.push(fix.desc);
        }
      }
    });

    // Phase 2: Smart content enhancement based on analysis
    const originalEnhanced = enhanced;

    // Handle very short inputs
    if (enhanced.length < 25) {
      const intentMap = {
        create: 'Create a comprehensive',
        improve: 'Improve and optimize',
        explain: 'Provide a detailed explanation of',
        analyze: 'Conduct a thorough analysis of',
        plan: 'Develop a strategic plan for',
        solve: 'Provide a solution for',
        learn: 'Create a learning guide about',
        convert: 'Convert and transform'
      };
      
      enhanced = `${intentMap[analysis.intent as keyof typeof intentMap] || 'Create'} ${enhanced.replace(/^(create|make|build|generate|improve|explain|analyze|plan|solve|learn|convert)\s*/i, '')}`;
      improvements.push("Expanded brief request with smart context");
    }

    // Add domain-specific context
    if (analysis.domain !== 'general') {
      const domainContext = {
        business: 'Focus on practical business value, ROI, and actionable insights.',
        technical: 'Include technical specifications, best practices, and implementation details.',
        creative: 'Emphasize originality, visual appeal, and creative innovation.',
        academic: 'Ensure scholarly rigor, proper citations, and comprehensive analysis.',
        personal: 'Make it relatable, practical, and personally meaningful.',
        professional: 'Maintain professional tone and industry standards.'
      };

      if (!enhanced.toLowerCase().includes(analysis.domain)) {
        enhanced = `${enhanced} ${domainContext[analysis.domain as keyof typeof domainContext]}`;
        improvements.push(`Added ${analysis.domain} domain context`);
      }
    }

    // Add style-specific enhancements
    const styleEnhancements = {
      formal: 'Use formal language and professional structure.',
      casual: 'Keep the tone conversational and approachable.',
      creative: 'Be innovative and think outside the box.',
      technical: 'Provide precise, detailed, and systematic information.',
      persuasive: 'Make it compelling and convincing.',
      educational: 'Structure it for easy learning and understanding.'
    };

    if (analysis.confidence > 0.7 && !enhanced.toLowerCase().includes(analysis.style)) {
      enhanced = `${enhanced} ${styleEnhancements[analysis.style as keyof typeof styleEnhancements]}`;
      improvements.push(`Added ${analysis.style} style guidance`);
    }

    // Handle context-specific improvements
    if (analysis.context.includes('time_sensitive')) {
      enhanced = enhanced.replace('.', '. Prioritize quick, actionable solutions.');
      improvements.push("Added urgency context");
    }

    if (analysis.context.includes('team_request')) {
      enhanced = enhanced.replace('.', '. Consider team collaboration and stakeholder needs.');
      improvements.push("Added team context");
    }

    if (analysis.context.includes('professional_context')) {
      enhanced = enhanced.replace('.', '. Ensure professional quality and business standards.');
      improvements.push("Added professional context");
    }

    // Phase 3: AI-tool specific optimization
    if (!enhanced.toLowerCase().includes('detailed') && !enhanced.toLowerCase().includes('specific')) {
      enhanced = enhanced.replace(/\.$/, '. Provide detailed, specific, and actionable results.');
      improvements.push("Added specificity requirements");
    }

    // Handle vague requests with smart expansion
    const vaguePatterns = [
      { pattern: /^(make|create|build|generate)\s*$/i, expansion: 'a comprehensive solution' },
      { pattern: /^(help|assist|support)\s*$/i, expansion: 'with detailed guidance and actionable steps' },
      { pattern: /^(write|code|design)\s*$/i, expansion: 'something professional and effective' },
      { pattern: /^(improve|enhance|optimize)\s*$/i, expansion: 'the quality and effectiveness' },
      { pattern: /^(explain|describe|tell)\s*$/i, expansion: 'in clear, comprehensive detail' }
    ];

    vaguePatterns.forEach(({ pattern, expansion }) => {
      if (pattern.test(enhanced)) {
        enhanced = enhanced.replace(pattern, (match) => `${match} ${expansion}`);
        improvements.push("Clarified vague request");
      }
    });

    // Add smart examples request when appropriate
    if (analysis.domain === 'technical' && !enhanced.toLowerCase().includes('example')) {
      enhanced = enhanced.replace(/\.$/, '. Include practical examples and code snippets where relevant.');
      improvements.push("Added request for examples");
    }

    if (analysis.domain === 'business' && !enhanced.toLowerCase().includes('metric')) {
      enhanced = enhanced.replace(/\.$/, '. Include relevant metrics and success indicators.');
      improvements.push("Added business metrics context");
    }

    // Final quality check - ensure the enhancement was meaningful
    if (enhanced === originalEnhanced && improvements.length === 0) {
      enhanced = `${enhanced} Please ensure the output is comprehensive, well-structured, and tailored for optimal AI results.`;
      improvements.push("Added general optimization guidance");
    }

    return { enhanced, improvements };
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
    setIsEnhancing(true);
    setShowResults(false);
    setInputEnhancements([]);
    
    // Phase 1: Enhance the user input
    await new Promise(resolve => setTimeout(resolve, 800));
    const { enhanced, improvements } = await enhanceUserInput(userInput);
    setEnhancedInput(enhanced);
    setInputEnhancements(improvements);
    setIsEnhancing(false);

    if (improvements.length > 0) {
      toast({
        title: "Input Enhanced!",
        description: `Applied ${improvements.length} improvement${improvements.length > 1 ? 's' : ''} to your prompt`,
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Phase 2: Generate optimized prompts using enhanced input
    const generatedPrompts = PromptGenerator.generate(selectedTool, enhanced);
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
      <section className="relative py-20 sm:py-24 lg:py-32 px-0 text-center bg-gradient-hero overflow-hidden w-full">
        {/* Animated Background Layers */}
        <div className="absolute inset-0">
          {/* Dynamic gradient overlay with movement */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-zinc-800/50 to-transparent animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          
          {/* Enhanced floating orbs */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDuration: '6s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDuration: '8s', animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-2xl animate-float" style={{ animationDuration: '7s', animationDelay: '3s' }} />
          </div>
          
          {/* Animated particles */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          
          {/* Dynamic grid pattern with shimmer */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-shimmer" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-shimmer" style={{ animationDuration: '4s', animationDelay: '1.5s' }} />
          </div>
          
          {/* Breathing light effect */}
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(99,102,241,0.1),rgba(168,85,247,0.05),rgba(255,255,255,0))] animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(236,72,153,0.1),rgba(59,130,246,0.05),rgba(255,255,255,0))] animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
          </div>
          
          {/* Enhanced edge vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_60%,rgba(0,0,0,0.6)_100%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in px-4">
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

              {/* Enhanced Input Preview */}
              {enhancedInput && (
                <div className="mb-8 animate-slide-up">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-green-800 dark:text-green-200">Input Enhanced!</h4>
                        <p className="text-sm text-green-600 dark:text-green-400">AI automatically improved your prompt</p>
                      </div>
                    </div>
                    
                    {inputEnhancements.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2 text-sm">Applied Improvements:</h5>
                        <div className="flex flex-wrap gap-2">
                          {inputEnhancements.map((improvement, idx) => (
                            <Badge key={idx} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                              {improvement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 border border-green-200/50 dark:border-green-800/50">
                      <p className="text-sm text-green-800 dark:text-green-200 font-medium">Enhanced Version:</p>
                      <p className="text-green-700 dark:text-green-300 mt-1">{enhancedInput}</p>
                    </div>
                  </div>
                </div>
              )}

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
                    <span>
                      {isEnhancing ? 'Enhancing your input...' : 'Engineering your prompts...'}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
                    <span>Generate Perfect AI Prompts</span>
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