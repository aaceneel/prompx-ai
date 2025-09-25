import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, Wand2, Sparkles, Code, Image, Music, Video, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [optimizedPrompts, setOptimizedPrompts] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
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
    
    // Simulate AI processing (replace with actual AI service)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockPrompts = generateMockPrompts(selectedTool, userInput);
    setOptimizedPrompts(mockPrompts);
    setIsGenerating(false);
  };

  const generateMockPrompts = (tool: string, input: string): string[] => {
    const toolInfo = AI_TOOLS.find(t => t.id === tool);
    
    switch (tool) {
      case 'text':
        return [
          `You are a professional content strategist. ${input}. Please provide a detailed response with clear structure, actionable insights, and specific examples. Format your response with headers and bullet points for easy reading.`,
          `Act as an expert in your field. Based on this request: "${input}" - create a comprehensive guide that includes background context, step-by-step instructions, and practical tips. Use a professional yet engaging tone.`,
          `Transform this idea: "${input}" into a detailed strategy document. Include objectives, methodology, expected outcomes, and next steps. Be specific and actionable.`
        ];
      case 'image':
        return [
          `Create a photorealistic 8K image of ${input}. Style: cinematic, high contrast, dramatic lighting. Camera: professional DSLR, shallow depth of field. Composition: rule of thirds, dynamic angles. --ar 16:9 --v 6`,
          `Generate a stunning artistic interpretation of ${input}. Art style: modern digital art, vibrant colors, detailed textures. Mood: inspiring and captivating. Quality: ultra-high resolution, masterpiece level detail.`,
          `Professional commercial photography of ${input}. Studio lighting setup, clean background, sharp focus on subject. Color grading: warm tones, high saturation. Output: magazine quality, print-ready resolution.`
        ];
      case 'code':
        return [
          `Create a well-documented, production-ready implementation for: ${input}. Include error handling, type safety, and best practices. Add comments explaining the logic and provide usage examples.`,
          `Build a robust solution for ${input} using modern development practices. Include unit tests, proper error handling, and clear documentation. Follow industry standards and conventions.`,
          `Develop a scalable, maintainable codebase for ${input}. Use clean code principles, proper naming conventions, and modular architecture. Include setup instructions and examples.`
        ];
      case 'audio':
        return [
          `Generate high-quality audio for: ${input}. Voice characteristics: professional, clear articulation, appropriate pace. Audio specs: 44.1kHz, uncompressed. Tone: engaging and natural.`,
          `Create professional narration for ${input}. Voice style: authoritative yet friendly, perfect pronunciation. Background: studio-quality silence. Format: broadcast-ready audio.`,
          `Produce premium audio content: ${input}. Vocal delivery: confident, well-paced, emotionally appropriate. Technical specs: crisp, noise-free, optimized levels.`
        ];
      case 'video':
        return [
          `Create a cinematic video sequence: ${input}. Style: professional cinematography, smooth camera movements, color graded. Duration: 30-60 seconds. Resolution: 4K, 24fps. Mood: engaging and dynamic.`,
          `Generate a high-impact video for ${input}. Visual style: modern, clean aesthetics, professional lighting. Pacing: dynamic cuts, smooth transitions. Quality: broadcast standard.`,
          `Produce a compelling video showcasing ${input}. Cinematography: varied shot compositions, professional framing. Post-production: color correction, smooth editing, engaging rhythm.`
        ];
      default:
        return [`Optimized prompt for ${input}`];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-hero">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm text-white/90">Professional Prompt Engineering</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Transform Vague Ideas into
            <br />
            Perfect AI Prompts
          </h1>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Professional prompt engineering tool that optimizes your requests for ChatGPT, MidJourney, Stable Diffusion, and other AI platforms.
          </p>
          
          <Button variant="secondary" size="lg" onClick={() => document.getElementById('tool-selector')?.scrollIntoView({ behavior: 'smooth' })}>
            <Wand2 className="w-5 h-5" />
            Start Engineering Prompts
          </Button>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {WORKFLOW_STEPS.map((step, index) => (
              <Card key={step.number} className="relative border-border bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      {step.number}
                    </Badge>
                    {index < WORKFLOW_STEPS.length - 1 && (
                      <div className="hidden md:block absolute top-8 -right-3 w-6 h-px bg-border" />
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Tool */}
      <section id="tool-selector" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center">AI Tool Selector</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tool Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Your Target AI Tool</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {AI_TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Button
                        key={tool.id}
                        variant={selectedTool === tool.id ? "gradient" : "outline"}
                        className={`flex flex-col h-auto p-4 ${selectedTool === tool.id ? 'shadow-glow' : ''}`}
                        onClick={() => setSelectedTool(tool.id)}
                      >
                        <Icon className="w-8 h-8 mb-2" />
                        <span className="font-medium">{tool.name}</span>
                        <span className="text-xs opacity-70">{tool.description}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Input Area */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Enter Your Request</h3>
                <Textarea
                  placeholder="Enter your vague idea or request here... (e.g., 'make me a video idea' or 'I want an image of a house')"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[120px] bg-background border-border"
                />
              </div>

              {/* Generate Button */}
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full" 
                onClick={generatePrompts}
                disabled={isGenerating || !selectedTool || !userInput.trim()}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                    Optimizing Your Prompt...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Optimized Prompts
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results */}
      {optimizedPrompts.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Your Optimized Prompts</h2>
            <div className="space-y-4">
              {optimizedPrompts.map((prompt, index) => (
                <Card key={index} className="border-border bg-card/50 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg">
                      Version {index + 1}
                      {index === 0 && <Badge className="ml-2 bg-accent text-accent-foreground">Recommended</Badge>}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(prompt, index)}
                      className="h-8 w-8 p-0"
                    >
                      {copiedIndex === index ? (
                        <CheckCircle className="w-4 h-4 text-accent" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm bg-background/50 rounded-lg p-4 border border-border font-mono">
                      {prompt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};