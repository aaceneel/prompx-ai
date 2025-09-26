import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, Wand2, Sparkles, Code, Image, Music, Video, MessageSquare, Zap, Target, BookOpen, ArrowRight, Stars, Palette, Brain, Mic, MicOff, Volume2, Globe, Languages, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PromptGenerator, type PromptTemplate } from "@/lib/promptGenerator";

// Language detection and translation
const detectLanguage = async (text: string): Promise<string> => {
  try {
    const { franc } = await import('franc');
    const detectedLang = franc(text);
    
    // Map franc language codes to common names
    const langMap: { [key: string]: string } = {
      'eng': 'English', 'spa': 'Spanish', 'fra': 'French', 'deu': 'German', 'ita': 'Italian',
      'por': 'Portuguese', 'rus': 'Russian', 'jpn': 'Japanese', 'kor': 'Korean', 'cmn': 'Chinese',
      'ara': 'Arabic', 'hin': 'Hindi', 'ben': 'Bengali', 'urd': 'Urdu', 'tur': 'Turkish',
      'vie': 'Vietnamese', 'tha': 'Thai', 'nld': 'Dutch', 'pol': 'Polish', 'ukr': 'Ukrainian',
      'ces': 'Czech', 'hun': 'Hungarian', 'ron': 'Romanian', 'bul': 'Bulgarian', 'hrv': 'Croatian',
      'srp': 'Serbian', 'slk': 'Slovak', 'slv': 'Slovenian', 'lit': 'Lithuanian', 'lav': 'Latvian',
      'est': 'Estonian', 'fin': 'Finnish', 'swe': 'Swedish', 'nor': 'Norwegian', 'dan': 'Danish',
      'isl': 'Icelandic', 'ell': 'Greek', 'heb': 'Hebrew', 'fas': 'Persian', 'cat': 'Catalan',
      'eus': 'Basque', 'glg': 'Galician', 'gle': 'Irish', 'cym': 'Welsh', 'sco': 'Scots',
      'afr': 'Afrikaans', 'amh': 'Amharic', 'hau': 'Hausa', 'ibo': 'Igbo', 'yor': 'Yoruba',
      'swa': 'Swahili', 'som': 'Somali', 'orm': 'Oromo', 'tir': 'Tigrinya', 'zul': 'Zulu'
    };
    
    return langMap[detectedLang] || 'Unknown';
  } catch (error) {
    return 'English';
  }
};

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
  
  // Voice and language features
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Initialize voice recognition on component mount
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Configure for maximum language detection
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 5;
      
      // Get supported languages
      const languages = [
        'en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-BR', 'ru-RU', 'ja-JP', 'ko-KR', 'zh-CN',
        'ar-SA', 'hi-IN', 'bn-BD', 'ur-PK', 'tr-TR', 'vi-VN', 'th-TH', 'nl-NL', 'pl-PL', 'uk-UA',
        'cs-CZ', 'hu-HU', 'ro-RO', 'bg-BG', 'hr-HR', 'sr-RS', 'sk-SK', 'sl-SI', 'lt-LT', 'lv-LV',
        'et-EE', 'fi-FI', 'sv-SE', 'no-NO', 'da-DK', 'is-IS', 'el-GR', 'he-IL', 'fa-IR', 'ca-ES',
        'eu-ES', 'gl-ES', 'ga-IE', 'cy-GB', 'af-ZA', 'am-ET', 'ha-NG', 'ig-NG', 'yo-NG',
        'sw-KE', 'so-SO', 'om-ET', 'ti-ET', 'zu-ZA'
      ];
      setSupportedLanguages(languages);
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setIsRecording(true);
      };
      
      recognitionRef.current.onresult = async (event: any) => {
        let transcript = '';
        let isFinal = false;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          transcript += result[0].transcript;
          if (result.isFinal) {
            isFinal = true;
          }
        }
        
        setVoiceTranscript(transcript);
        
        if (isFinal && transcript.trim()) {
          setIsProcessingVoice(true);
          
          // Detect language
          const language = await detectLanguage(transcript);
          setDetectedLanguage(language);
          
          // Auto-enhance the voice input
          const { enhanced, improvements } = await enhanceUserInput(transcript);
          setUserInput(enhanced);
          
          if (improvements.length > 0) {
            toast({
              title: `Voice Input Processed! (${language})`,
              description: `Applied ${improvements.length} enhancement${improvements.length > 1 ? 's' : ''} to your voice input`,
            });
          }
          
          setIsProcessingVoice(false);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setIsListening(false);
        setIsProcessingVoice(false);
        
        toast({
          title: "Voice Input Error",
          description: "Please try again or check microphone permissions",
          variant: "destructive",
        });
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setIsListening(false);
      };
    }
  }, []);

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

  const startVoiceInput = async () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Auto-detect language or use browser language
      const browserLang = navigator.language || 'en-US';
      recognitionRef.current.lang = browserLang;
      
      setVoiceTranscript('');
      setDetectedLanguage('');
      recognitionRef.current.start();
      
      toast({
        title: "🎤 Voice Input Started",
        description: "Speak your prompt in any language...",
      });
    } catch (error) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice input",
        variant: "destructive",
      });
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
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

  // Advanced spell check function
  const performAdvancedSpellCheck = (text: string): { corrected: string; spellCorrections: string[] } => {
    const corrections: string[] = [];
    let corrected = text;
    
    // Comprehensive spell check dictionary with common mistakes
    const spellCheckDict: Record<string, string> = {
      // Common typos
      'teh': 'the', 'adn': 'and', 'ot': 'to', 'fo': 'of', 'hte': 'the',
      'taht': 'that', 'wich': 'which', 'waht': 'what', 'whe': 'when',
      'reciever': 'receiver', 'recieve': 'receive', 'acheive': 'achieve',
      'beleive': 'believe', 'seperate': 'separate', 'definately': 'definitely',
      'neccessary': 'necessary', 'occured': 'occurred', 'occurence': 'occurrence',
      'begining': 'beginning', 'writting': 'writing', 'succesful': 'successful',
      'accomodate': 'accommodate', 'embarass': 'embarrass', 'ocasionally': 'occasionally',
      'proffesional': 'professional', 'bussiness': 'business', 'recomend': 'recommend',
      'reccomend': 'recommend', 'explaination': 'explanation', 'alot': 'a lot',
      'everytime': 'every time', 'aswell': 'as well', 'incase': 'in case',
      'alright': 'all right', 'anyways': 'anyway', 'alittle': 'a little',
      
      // Homophones and confusing words
      'loose': 'lose', 'brake': 'break', 'breath': 'breathe', 'advise': 'advice',
      'affect': 'effect', 'than': 'then', 'were': 'where', 'weather': 'whether',
      'accept': 'except', 'compliment': 'complement', 'stationary': 'stationery',
      'principle': 'principal', 'capitol': 'capital', 'council': 'counsel',
      'dessert': 'desert', 'lightening': 'lightning', 'waist': 'waste',
      
      // Technical terms
      'algoritm': 'algorithm', 'databse': 'database', 'progam': 'program',
      'programing': 'programming', 'sofware': 'software', 'hardward': 'hardware',
      'framwork': 'framework', 'libary': 'library', 'functin': 'function',
      'varaible': 'variable', 'instace': 'instance', 'responce': 'response',
      'comunication': 'communication', 'compatiblity': 'compatibility',
      
      // Business terms
      'managment': 'management', 'oppurtunity': 'opportunity', 'experiance': 'experience',
      'performace': 'performance', 'implmentation': 'implementation', 'anaylsis': 'analysis',
      'requirment': 'requirement', 'devlopment': 'development', 'efficency': 'efficiency',
      'maintanance': 'maintenance', 'strategey': 'strategy', 'finacial': 'financial',
      
      // Double letter corrections
      'comming': 'coming', 'runing': 'running', 'geting': 'getting',
      'puting': 'putting', 'planing': 'planning', 'stoping': 'stopping', 
      'droping': 'dropping', 'shiping': 'shipping',
      
      // Reversed letters
      'form': 'from', 'united': 'untied', 'filed': 'field', 'trial': 'trail'
    };
    
    // Apply spell corrections
    let hasSpellCorrections = false;
    Object.entries(spellCheckDict).forEach(([wrong, correct]) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      if (regex.test(corrected)) {
        corrected = corrected.replace(regex, correct);
        if (!hasSpellCorrections) {
          corrections.push("Fixed spelling errors");
          hasSpellCorrections = true;
        }
      }
    });
    
    // Fix double spaces and formatting
    const originalCorrected = corrected;
    corrected = corrected
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/\s*([.!?])/g, '$1') // Remove spaces before punctuation
      .replace(/([.!?])\s*([a-z])/g, '$1 $2') // Add space after punctuation
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
      .trim();
      
    if (corrected !== originalCorrected) {
      corrections.push("Fixed text formatting");
    }
    
    return { corrected, spellCorrections: corrections };
  };

  // Content quality analysis function
  const analyzeContentQuality = (text: string): { score: number; suggestions: string[] } => {
    const suggestions: string[] = [];
    let score = 50; // Base score

    // Length analysis
    if (text.length < 20) {
      suggestions.push("Consider adding more specific details to improve clarity");
      score -= 15;
    } else if (text.length > 100) {
      score += 10;
    }

    // Clarity indicators
    const clarityWords = ['specific', 'detailed', 'exactly', 'precisely', 'clearly'];
    if (clarityWords.some(word => text.toLowerCase().includes(word))) {
      score += 10;
    } else {
      suggestions.push("Add specific requirements or constraints for better results");
    }

    // Professional tone check
    const professionalTerms = ['implement', 'develop', 'optimize', 'enhance', 'analyze', 'create'];
    if (professionalTerms.some(term => text.toLowerCase().includes(term))) {
      score += 5;
    }

    // Context richness
    const contextWords = ['because', 'in order to', 'for the purpose of', 'considering', 'given that'];
    if (contextWords.some(word => text.toLowerCase().includes(word))) {
      score += 10;
    } else {
      suggestions.push("Include context or reasoning to improve AI understanding");
    }

    // Goal clarity
    const goalWords = ['should', 'need', 'want', 'require', 'expect', 'goal', 'objective'];
    if (goalWords.some(word => text.toLowerCase().includes(word))) {
      score += 10;
    } else {
      suggestions.push("Clearly state your desired outcome or goal");
    }

    // Technical specificity for code/technical prompts
    if (text.toLowerCase().includes('code') || text.toLowerCase().includes('program')) {
      const techTerms = ['framework', 'library', 'language', 'version', 'api', 'database'];
      if (techTerms.some(term => text.toLowerCase().includes(term))) {
        score += 10;
      } else {
        suggestions.push("Specify programming language, framework, or technical requirements");
      }
    }

    return { score: Math.min(100, Math.max(0, score)), suggestions };
  };

  // Professional tone enhancement
  const enhanceProfessionalTone = (text: string): { enhanced: string; changes: string[] } => {
    const changes: string[] = [];
    let enhanced = text;

    const improvements = [
      // Casual to professional replacements
      { from: /\bkinda\b/gi, to: 'somewhat', desc: 'Replaced casual language' },
      { from: /\bsorta\b/gi, to: 'somewhat', desc: 'Replaced casual language' },
      { from: /\bgonna\b/gi, to: 'going to', desc: 'Used formal language' },
      { from: /\bwanna\b/gi, to: 'want to', desc: 'Used formal language' },
      { from: /\bcan't\b/gi, to: 'cannot', desc: 'Used formal contractions' },
      { from: /\bwon't\b/gi, to: 'will not', desc: 'Used formal contractions' },
      { from: /\bisn't\b/gi, to: 'is not', desc: 'Used formal contractions' },
      { from: /\baren't\b/gi, to: 'are not', desc: 'Used formal contractions' },
      
      // Vague to specific language
      { from: /\bstuff\b/gi, to: 'content', desc: 'Used specific terminology' },
      { from: /\bthings\b/gi, to: 'elements', desc: 'Used specific terminology' },
      { from: /\ba lot of\b/gi, to: 'numerous', desc: 'Used professional language' },
      { from: /\bpretty good\b/gi, to: 'effective', desc: 'Used professional language' },
      { from: /\breally\s+(\w+)/gi, to: 'highly $1', desc: 'Enhanced professional tone' },
      
      // Uncertainty to confidence
      { from: /\bi think\b/gi, to: 'I believe', desc: 'Enhanced confidence' },
      { from: /\bmaybe\b/gi, to: 'potentially', desc: 'Used professional language' },
      { from: /\bkind of\b/gi, to: 'somewhat', desc: 'Used professional language' },
      
      // Add professional action verbs
      { from: /\bmake\s+(\w+)/gi, to: 'develop $1', desc: 'Used professional action verbs' },
      { from: /\bshow\s+me\b/gi, to: 'demonstrate', desc: 'Used professional language' },
      { from: /\bfigure out\b/gi, to: 'determine', desc: 'Used professional language' },
    ];

    improvements.forEach(({ from, to, desc }) => {
      if (from.test(enhanced)) {
        enhanced = enhanced.replace(from, to);
        if (!changes.includes(desc)) {
          changes.push(desc);
        }
      }
    });

    return { enhanced, changes };
  };

  // Structure optimization for better AI comprehension
  const optimizeStructure = (text: string): { optimized: string; improvements: string[] } => {
    const improvements: string[] = [];
    let optimized = text;

    // Add structure for complex requests
    if (text.length > 50 && !text.includes(':') && !text.includes('-')) {
      // Check if it's a multi-part request
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
      if (sentences.length > 2) {
        // Try to identify different parts
        const parts: string[] = [];
        sentences.forEach(sentence => {
          const trimmed = sentence.trim();
          if (trimmed) {
            parts.push(`- ${trimmed.charAt(0).toUpperCase() + trimmed.slice(1)}`);
          }
        });
        
        if (parts.length > 1) {
          optimized = `Please help with the following:\n\n${parts.join('\n')}`;
          improvements.push("Restructured into clear bullet points");
        }
      }
    }

    // Add context prompts for vague requests
    if (text.length < 30 && !text.includes('specific') && !text.includes('detailed')) {
      if (!optimized.includes('Please provide')) {
        optimized = `${optimized}\n\nPlease provide specific examples and detailed explanations.`;
        improvements.push("Added request for specificity");
      }
    }

    return { optimized, improvements };
  };

  const enhanceUserInput = async (input: string): Promise<{ enhanced: string; improvements: string[] }> => {
    const improvements: string[] = [];
    let enhanced = input.trim();

    if (!enhanced) return { enhanced, improvements };

    // Detect language first
    const language = await detectLanguage(enhanced);
    if (language !== 'English' && language !== 'Unknown') {
      improvements.push(`Detected ${language} input`);
    }

    // Advanced multilingual processing
    enhanced = await processMultilingualInput(enhanced, language, improvements);

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

    // Advanced spell check and grammar corrections
    const { corrected, spellCorrections } = performAdvancedSpellCheck(enhanced);
    if (spellCorrections.length > 0) {
      enhanced = corrected;
      improvements.push(...spellCorrections);
    }

    // Content quality analysis
    const qualityAnalysis = analyzeContentQuality(enhanced);
    if (qualityAnalysis.score < 70) {
      improvements.push(`Content quality: ${qualityAnalysis.score}/100 - Consider improvements`);
    }

    // Professional tone enhancement
    const { enhanced: professionalEnhanced, changes: toneChanges } = enhanceProfessionalTone(enhanced);
    if (toneChanges.length > 0) {
      enhanced = professionalEnhanced;
      improvements.push(...toneChanges);
    }

    // Structure optimization
    const { optimized: structureOptimized, improvements: structureImprovements } = optimizeStructure(enhanced);
    if (structureImprovements.length > 0) {
      enhanced = structureOptimized;
      improvements.push(...structureImprovements);
    }

    // Grammar and style fixes
    const grammarFixes = [
      // Common grammar mistakes
      { from: /\bi\b/g, to: 'I', desc: 'Fixed capitalization of "I"' },
      { from: /\byour\s+welcome\b/gi, to: 'you\'re welcome', desc: 'Fixed grammar (you\'re vs your)' },
      { from: /\bits\s+([aeiou])/gi, to: 'it\'s $1', desc: 'Fixed contraction (it\'s vs its)' },
      { from: /\btheir\s+going\b/gi, to: 'they\'re going', desc: 'Fixed grammar (they\'re vs their)' },
      { from: /\bwhos\s+([a-z])/gi, to: 'who\'s $1', desc: 'Fixed contraction (who\'s vs whose)' },
      { from: /\bthere\s+going\b/gi, to: 'they\'re going', desc: 'Fixed grammar (they\'re vs there)' },
      { from: /\bcant\b/gi, to: 'can\'t', desc: 'Added apostrophe in contraction' },
      { from: /\bdont\b/gi, to: 'don\'t', desc: 'Added apostrophe in contraction' },
      { from: /\bwont\b/gi, to: 'won\'t', desc: 'Added apostrophe in contraction' },
      { from: /\bisnt\b/gi, to: 'isn\'t', desc: 'Added apostrophe in contraction' },
      { from: /\barent\b/gi, to: 'aren\'t', desc: 'Added apostrophe in contraction' },
      { from: /\bcouldnt\b/gi, to: 'couldn\'t', desc: 'Added apostrophe in contraction' },
      { from: /\bshouldnt\b/gi, to: 'shouldn\'t', desc: 'Added apostrophe in contraction' },
      { from: /\bwouldnt\b/gi, to: 'wouldn\'t', desc: 'Added apostrophe in contraction' },
      
      // Informal to formal/professional
      { from: /\bkinda\b/gi, to: 'somewhat', desc: 'Made more professional' },
      { from: /\bgonna\b/gi, to: 'going to', desc: 'Made more formal' },
      { from: /\bwanna\b/gi, to: 'want to', desc: 'Made more formal' },
      { from: /\bu\b/g, to: 'you', desc: 'Expanded abbreviation' },
      { from: /\bur\b/g, to: 'your', desc: 'Expanded abbreviation' },
      { from: /\btn\b/g, to: 'than', desc: 'Fixed abbreviation' },
      { from: /\bw\/\b/g, to: 'with', desc: 'Expanded abbreviation' },
      { from: /\b&\b/g, to: 'and', desc: 'Expanded symbol' },
      
      // Clarity improvements
      { from: /\bstuff\b/gi, to: 'content', desc: 'Made more specific' },
      { from: /\bthings\b/gi, to: 'elements', desc: 'Made more specific' },
      { from: /\bokay\b/gi, to: 'suitable', desc: 'Made more professional' },
      { from: /\bcool\b/gi, to: 'effective', desc: 'Made more professional' },
      { from: /\bawesome\b/gi, to: 'excellent', desc: 'Made more professional' }
    ];

    let hasGrammarFixes = false;
    grammarFixes.forEach(fix => {
      if (fix.from.test(enhanced)) {
        enhanced = enhanced.replace(fix.from, fix.to);
        if (!hasGrammarFixes) {
          improvements.push("Applied grammar and style corrections");
          hasGrammarFixes = true;
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

  const processMultilingualInput = async (input: string, language: string, improvements: string[]): Promise<string> => {
    let processed = input;

    // Handle different languages with specific optimizations
    if (language !== 'English' && language !== 'Unknown') {
      // Translate common non-English phrases to English for better AI processing
      const commonTranslations: { [key: string]: { [key: string]: string } } = {
        'Spanish': {
          'crear': 'create', 'hacer': 'make', 'generar': 'generate', 'escribir': 'write',
          'diseñar': 'design', 'ayudar': 'help', 'explicar': 'explain', 'mejorar': 'improve'
        },
        'French': {
          'créer': 'create', 'faire': 'make', 'générer': 'generate', 'écrire': 'write',
          'concevoir': 'design', 'aider': 'help', 'expliquer': 'explain', 'améliorer': 'improve'
        },
        'German': {
          'erstellen': 'create', 'machen': 'make', 'generieren': 'generate', 'schreiben': 'write',
          'entwerfen': 'design', 'helfen': 'help', 'erklären': 'explain', 'verbessern': 'improve'
        },
        'Italian': {
          'creare': 'create', 'fare': 'make', 'generare': 'generate', 'scrivere': 'write',
          'progettare': 'design', 'aiutare': 'help', 'spiegare': 'explain', 'migliorare': 'improve'
        },
        'Portuguese': {
          'criar': 'create', 'fazer': 'make', 'gerar': 'generate', 'escrever': 'write',
          'projetar': 'design', 'ajudar': 'help', 'explicar': 'explain', 'melhorar': 'improve'
        },
        'Russian': {
          'создать': 'create', 'сделать': 'make', 'генерировать': 'generate', 'писать': 'write',
          'проектировать': 'design', 'помочь': 'help', 'объяснить': 'explain', 'улучшить': 'improve'
        },
        'Japanese': {
          '作成': 'create', '作る': 'make', '生成': 'generate', '書く': 'write',
          '設計': 'design', '手伝う': 'help', '説明': 'explain', '改善': 'improve'
        },
        'Chinese': {
          '创建': 'create', '制作': 'make', '生成': 'generate', '写': 'write',
          '设计': 'design', '帮助': 'help', '解释': 'explain', '改进': 'improve'
        },
        'Korean': {
          '만들다': 'create', '하다': 'make', '생성': 'generate', '쓰다': 'write',
          '디자인': 'design', '돕다': 'help', '설명': 'explain', '개선': 'improve'
        },
        'Arabic': {
          'إنشاء': 'create', 'صنع': 'make', 'توليد': 'generate', 'كتابة': 'write',
          'تصميم': 'design', 'مساعدة': 'help', 'شرح': 'explain', 'تحسين': 'improve'
        },
        'Hindi': {
          'बनाना': 'create', 'करना': 'make', 'उत्पन्न': 'generate', 'लिखना': 'write',
          'डिज़ाइन': 'design', 'मदद': 'help', 'समझाना': 'explain', 'सुधार': 'improve'
        }
      };

      const translations = commonTranslations[language];
      if (translations) {
        Object.entries(translations).forEach(([original, translation]) => {
          const regex = new RegExp(`\\b${original}\\b`, 'gi');
          if (regex.test(processed)) {
            processed = processed.replace(regex, translation);
            improvements.push(`Translated "${original}" to "${translation}"`);
          }
        });
      }

      // Add multilingual context
      processed = `${processed} Please provide response optimized for ${language} context and cultural nuances.`;
      improvements.push(`Added ${language} cultural context`);
    }

    // Enhanced smart content detection across languages
    const universalPatterns = [
      { pattern: /\b(website|site|web|página|site web|веб-сайт|ウェブサイト|网站)\b/i, context: 'web development' },
      { pattern: /\b(app|application|aplicación|приложение|アプリ|应用)\b/i, context: 'mobile application' },
      { pattern: /\b(business|negocio|entreprise|geschäft|бизнес|ビジネス|商业)\b/i, context: 'business strategy' },
      { pattern: /\b(marketing|mercadotecnia|маркетинг|マーケティング|营销)\b/i, context: 'marketing campaign' },
      { pattern: /\b(design|diseño|conception|дизайн|デザイン|设计)\b/i, context: 'creative design' },
      { pattern: /\b(code|código|code|код|コード|代码)\b/i, context: 'programming' },
      { pattern: /\b(AI|IA|人工知能|人工智能|искусственный интеллект)\b/i, context: 'artificial intelligence' }
    ];

    universalPatterns.forEach(({ pattern, context }) => {
      if (pattern.test(processed) && !processed.toLowerCase().includes(context)) {
        processed = `${processed} Focus on ${context} best practices.`;
        improvements.push(`Added ${context} context`);
      }
    });

    return processed;
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
    <div className="min-h-screen w-full bg-gradient-bg">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 text-center bg-gradient-hero overflow-hidden">
        {/* Animated Background Layers */}
        <div className="absolute inset-0">
          {/* Dynamic gradient overlay with movement */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-zinc-800/50 to-transparent animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          
          {/* Enhanced floating orbs */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDuration: '6s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDuration: '8s', animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-2xl animate-float" style={{ animationDuration: '7s', animationDelay: '3s' }} />
          </div>
          
          {/* Animated particles - contained */}
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${20 + (i * 8)}%`,
                  top: `${30 + (i * 5)}%`,
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
        
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full px-3 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 shadow-2xl hover:bg-black/50 transition-all duration-300 group touch-none">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <Stars className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 animate-pulse" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-0 animate-ping">
                  <Stars className="w-4 h-4 sm:w-5 sm:h-5 text-white/30" />
                </div>
              </div>
              <span className="text-xs sm:text-sm font-bold text-white/90 tracking-wider uppercase bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Professional AI Engineering
              </span>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-white to-white/60 rounded-full animate-pulse group-hover:animate-bounce-gentle" />
            </div>
          </div>
          
          {/* Main Headline with Enhanced Typography */}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight tracking-tight">
            <span className="inline-block text-white mb-1 sm:mb-2 animate-slide-up">Craft Perfect</span><br />
            <span className="inline-block bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-slide-up filter drop-shadow-lg" style={{ animationDelay: '0.2s' }}>
              AI Prompts
            </span>
            {/* Decorative line */}
            <div className="mx-auto mt-2 sm:mt-4 w-16 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full animate-fade-in" style={{ animationDelay: '0.8s' }} />
          </h1>
          
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-white/80 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10 leading-relaxed font-light px-2 sm:px-4">
            Transform your ideas into precision-engineered prompts that unlock the full potential of any AI model. Works in 50+ languages with smart voice input.
          </p>
          
          {/* Enhanced CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-2">
            <Button 
              variant="default"
              size="lg" 
              className="relative w-full sm:w-auto bg-gradient-primary text-white hover:shadow-glow group text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-3 sm:py-4 h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl font-bold overflow-hidden border-2 border-primary/20 transition-all duration-300 hover:scale-105 touch-manipulation"
              onClick={() => document.getElementById('tool-selector')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
              
              <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                <div className="p-1 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-pulse transition-transform duration-700" />
                </div>
                <span className="whitespace-nowrap">Start Crafting</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
              </div>
            </Button>
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 animate-fade-in">
              Engineering Process
            </h2>
            <p className="text-sm xs:text-base sm:text-lg text-muted-foreground animate-fade-in max-w-xl sm:max-w-2xl mx-auto px-2" style={{ animationDelay: '0.1s' }}>
              Five steps to transform your vision into AI-ready instructions
            </p>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-4 xl:gap-6">
            {WORKFLOW_STEPS.map((step, index) => (
              <div 
                key={step.number} 
                className="relative group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="h-full bg-gradient-card shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 border border-border/30 overflow-hidden group-hover:scale-[1.02] sm:group-hover:scale-105 touch-manipulation">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col xs:flex-row lg:flex-col items-start xs:items-center lg:items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-primary flex items-center justify-center shadow-md group-hover:animate-bounce-gentle flex-shrink-0">
                        <span className="text-base sm:text-lg font-bold text-white">{step.number}</span>
                      </div>
                      {index < WORKFLOW_STEPS.length - 1 && (
                        <div className="hidden lg:block flex-1 h-px bg-gradient-to-r from-primary/30 via-primary/60 to-transparent" />
                      )}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 text-foreground group-hover:text-primary transition-colors leading-tight">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Tool */}
      <section id="tool-selector" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-card shadow-xl border border-border/30 animate-scale-in overflow-hidden max-w-5xl mx-auto">
            <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
              <div className="text-center mb-6 sm:mb-8 md:mb-10">
                <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                  Select Your AI Platform
                </h3>
                <p className="text-sm xs:text-base sm:text-lg text-muted-foreground max-w-xl sm:max-w-2xl mx-auto px-2">
                  Choose the AI tool you want to create optimized prompts for
                </p>
              </div>

              {/* Tool Selection */}
              <div className="mb-6 sm:mb-8 md:mb-10">
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 max-w-4xl mx-auto">
                  {AI_TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        className={`group relative flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 hover:-translate-y-0.5 sm:hover:-translate-y-1 hover:shadow-lg min-h-[100px] sm:min-h-[120px] touch-manipulation ${
                          selectedTool === tool.id 
                            ? 'bg-gradient-primary text-white border-primary shadow-glow scale-[1.02] sm:scale-105' 
                            : 'bg-background border-border/50 hover:border-primary/40 hover:shadow-md hover:bg-primary/5'
                        }`}
                        onClick={() => setSelectedTool(tool.id)}
                      >
                        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 ${
                          selectedTool === tool.id 
                            ? 'bg-white/20 group-hover:animate-bounce-gentle' 
                            : 'bg-primary/10 group-hover:bg-primary/20'
                        }`}>
                          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                            selectedTool === tool.id ? 'text-white' : 'text-primary'
                          }`} />
                        </div>
                        <div className="text-center flex-1">
                          <span className={`text-xs sm:text-sm font-bold block leading-tight ${
                            selectedTool === tool.id ? 'text-white' : 'text-foreground'
                          }`}>
                            {tool.name}
                          </span>
                          <span className={`text-xs mt-1 hidden sm:block leading-tight ${
                            selectedTool === tool.id ? 'text-white/80' : 'text-muted-foreground'
                          }`}>
                            {tool.description}
                          </span>
                        </div>
                        {selectedTool === tool.id && (
                          <div className="absolute -top-1 -right-1">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-md" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Area with Voice Support */}
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground">
                    Describe Your Vision
                  </h3>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Languages className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">50+ Languages</span>
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                    <Mic className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">Voice Input</span>
                  </div>
                </div>
                
                <div className="relative">
                  <Textarea
                    placeholder="What would you like the AI to accomplish? Speak or type in any language - I'll auto-detect and enhance your prompt..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-[120px] sm:min-h-[140px] bg-background/70 backdrop-blur border-2 border-border/40 focus:border-primary/60 resize-none text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-inner focus:shadow-lg transition-all duration-300 p-4 sm:p-6 pr-12 sm:pr-20 touch-manipulation"
                    rows={5}
                  />
                  
                  {/* Voice Input Button - Fixed positioning */}
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      variant={isRecording ? "destructive" : "secondary"}
                      size="sm"
                      onClick={isRecording ? stopVoiceInput : startVoiceInput}
                      className="h-10 w-10 p-0 rounded-full shadow-md hover:scale-110 transition-all duration-300 touch-manipulation bg-background/90 backdrop-blur-sm border border-border/50"
                      disabled={isProcessingVoice}
                    >
                      {isProcessingVoice ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isRecording ? (
                        <MicOff className="w-4 h-4 animate-pulse text-white" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Character count and language indicator - Fixed positioning */}
                  <div className="absolute bottom-4 right-4 z-10 flex flex-wrap items-center gap-2">
                    {detectedLanguage && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                        <Globe className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                        <span className="hidden xs:inline">{detectedLanguage}</span>
                        <span className="xs:hidden">{detectedLanguage.substring(0, 3)}</span>
                      </Badge>
                    )}
                    {userInput.length > 0 && (
                      <Badge className="bg-primary/90 text-primary-foreground shadow-md text-xs">
                        {userInput.length}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Voice Recording Status */}
                {isRecording && (
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl animate-pulse">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                      <span className="text-red-600 dark:text-red-400 font-medium text-sm sm:text-base">
                        🎤 Listening... Speak in any language
                      </span>
                      <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 animate-bounce-gentle flex-shrink-0" />
                    </div>
                    {voiceTranscript && (
                      <p className="text-red-700 dark:text-red-300 mt-2 text-xs sm:text-sm italic break-words">
                        "{voiceTranscript}"
                      </p>
                    )}
                  </div>
                )}

                {/* Voice Processing Status */}
                {isProcessingVoice && (
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg sm:rounded-xl">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-blue-500 flex-shrink-0" />
                      <span className="text-blue-600 dark:text-blue-400 font-medium text-sm sm:text-base">
                        🧠 Processing your voice input with AI intelligence...
                      </span>
                    </div>
                  </div>
                )}
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
                    <Brain className="w-6 h-6 group-hover:animate-pulse" />
                    <span>Generate Perfect AI Prompts</span>
                    <span className="text-xs opacity-75">(Any Language)</span>
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