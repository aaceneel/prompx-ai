export interface PromptTemplate {
  title: string;
  prompt: string;
}

export class PromptGenerator {
  private static analyzeInput(input: string): {
    topic: string;
    intent: string;
    specificity: 'vague' | 'moderate' | 'detailed';
    keywords: string[];
  } {
    const lowerInput = input.toLowerCase();
    const words = input.split(/\s+/);
    
    // Detect intent
    let intent = 'create';
    if (lowerInput.includes('explain') || lowerInput.includes('how') || lowerInput.includes('what')) {
      intent = 'explain';
    } else if (lowerInput.includes('improve') || lowerInput.includes('fix') || lowerInput.includes('better')) {
      intent = 'improve';
    } else if (lowerInput.includes('analyze') || lowerInput.includes('review')) {
      intent = 'analyze';
    }

    // Determine specificity
    let specificity: 'vague' | 'moderate' | 'detailed' = 'vague';
    if (words.length > 20) specificity = 'detailed';
    else if (words.length > 8) specificity = 'moderate';

    // Extract keywords
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once'];
    const keywords = words
      .filter(word => word.length > 2 && !stopWords.includes(word.toLowerCase()))
      .slice(0, 10);

    return {
      topic: input.substring(0, 50) + (input.length > 50 ? '...' : ''),
      intent,
      specificity,
      keywords
    };
  }

  static generateForText(input: string): PromptTemplate[] {
    const analysis = this.analyzeInput(input);
    const prompts: PromptTemplate[] = [];

    // Generate dynamic ending based on user intent and specificity
    const getDynamicInstructions = (intent: string, specificity: string, keywords: string[]) => {
      const isQuestion = input.toLowerCase().includes('?') || intent === 'explain';
      const isCreative = keywords.some(k => ['creative', 'innovative', 'unique', 'original'].includes(k.toLowerCase()));
      const isTechnical = keywords.some(k => ['technical', 'code', 'algorithm', 'process', 'method'].includes(k.toLowerCase()));
      const isAnalytical = keywords.some(k => ['analyze', 'compare', 'evaluate', 'assess'].includes(k.toLowerCase()));
      
      if (isCreative) {
        return "Present your response with creative flair, using vivid examples and innovative perspectives that inspire action.";
      } else if (isTechnical) {
        return "Provide precise, technical details with step-by-step explanations and practical implementation guidance.";
      } else if (isAnalytical) {
        return "Include thorough analysis with data-driven insights, comparisons, and evidence-based conclusions.";
      } else if (isQuestion) {
        return "Answer directly and comprehensively, anticipating follow-up questions and providing actionable next steps.";
      } else if (specificity === 'detailed') {
        return "Deliver comprehensive coverage with multiple perspectives, detailed examples, and strategic recommendations.";
      } else {
        return "Focus on clarity and actionable insights that can be immediately understood and applied.";
      }
    };

    // Quick & Simple version
    prompts.push({
      title: "Quick & Simple",
      prompt: `You are a professional ${analysis.intent === 'explain' ? 'educator' : 'content strategist'}. ${input}

${getDynamicInstructions(analysis.intent, analysis.specificity, analysis.keywords)}`
    });

    // Detailed & Professional version
    const getDetailedApproach = () => {
      if (analysis.intent === 'explain') {
        return `Provide comprehensive education covering theory, practical application, and real-world implications with expert-level depth.`;
      } else if (analysis.intent === 'improve') {
        return `Deliver strategic improvement framework with measurable outcomes, implementation roadmap, and success metrics.`;
      } else if (analysis.intent === 'analyze') {
        return `Conduct thorough analysis with multiple methodologies, data interpretation, and actionable strategic recommendations.`;
      } else {
        return `Create comprehensive implementation guide with industry best practices, risk mitigation, and scalability considerations.`;
      }
    };

    prompts.push({
      title: "Detailed & Professional", 
      prompt: `Act as a subject matter expert in ${analysis.keywords.slice(0, 3).join(', ')}. Transform this request: "${input}" into a comprehensive guide.

${getDetailedApproach()}`
    });

    // Creative & Engaging version
    const getCreativeApproach = () => {
      const themes = analysis.keywords.slice(0, 2);
      if (analysis.intent === 'explain') {
        return `Transform complex concepts into engaging narratives using ${themes.join(' and ')} as creative anchors that make learning memorable and fun.`;
      } else if (themes.some(t => ['business', 'marketing', 'strategy'].includes(t.toLowerCase()))) {
        return `Craft compelling business storytelling that connects emotionally while delivering strategic insights and innovative solutions.`;
      } else {
        return `Create inspiring content that sparks curiosity and motivates action through creative examples and fresh perspectives.`;
      }
    };

    prompts.push({
      title: "Creative & Engaging",
      prompt: `You are a creative strategist and storyteller specializing in ${analysis.keywords.slice(0, 2).join(' and ')}. Based on "${input}":

${getCreativeApproach()}`
    });

    return prompts;
  }

  static generateForImage(input: string): PromptTemplate[] {
    const analysis = this.analyzeInput(input);
    const prompts: PromptTemplate[] = [];

    const getImageContext = () => {
      const isPortrait = analysis.keywords.some(k => ['person', 'people', 'portrait', 'face'].includes(k.toLowerCase()));
      const isLandscape = analysis.keywords.some(k => ['landscape', 'nature', 'outdoor', 'scenery'].includes(k.toLowerCase()));
      const isProduct = analysis.keywords.some(k => ['product', 'object', 'commercial', 'brand'].includes(k.toLowerCase()));
      
      if (isPortrait) return 'portrait photography with perfect skin tones and natural expressions';
      if (isLandscape) return 'landscape photography with dramatic natural lighting and atmospheric depth';
      if (isProduct) return 'commercial product photography with clean backgrounds and professional presentation';
      return 'professional photography with optimal composition and lighting';
    };

    // Photorealistic version
    prompts.push({
      title: "Photorealistic",
      prompt: `Create a stunning photorealistic image: ${input}

Focus on ${getImageContext()}, captured with cinema-quality equipment and post-production excellence. --ar 16:9 --style raw --quality 2`
    });

    // Artistic & Creative version
    const getArtisticStyle = () => {
      const style = analysis.keywords.find(k => ['modern', 'vintage', 'abstract', 'realistic', 'minimalist', 'detailed'].includes(k.toLowerCase()));
      const mood = analysis.keywords.find(k => ['dark', 'bright', 'colorful', 'monochrome', 'vibrant', 'subtle'].includes(k.toLowerCase()));
      
      return `${style || 'contemporary'} artistic style with ${mood || 'balanced'} aesthetic, emphasizing ${analysis.keywords.slice(0, 2).join(' and ')} themes`;
    };

    prompts.push({
      title: "Artistic & Creative", 
      prompt: `Generate artistic interpretation of: ${input}

Create ${getArtisticStyle()} that captures the essence of your vision with masterful artistic execution. --v 6 --stylize 750`
    });

    // Commercial & Clean version
    const getCommercialPurpose = () => {
      if (analysis.keywords.some(k => ['marketing', 'advertisement', 'promotion'].includes(k.toLowerCase()))) {
        return 'marketing campaign ready with strong brand appeal and conversion optimization';
      } else if (analysis.keywords.some(k => ['website', 'web', 'digital'].includes(k.toLowerCase()))) {
        return 'web-optimized with fast loading and responsive design considerations';
      } else if (analysis.keywords.some(k => ['social', 'media', 'instagram'].includes(k.toLowerCase()))) {
        return 'social media optimized for maximum engagement and shareability';
      }
      return 'versatile commercial use with professional presentation standards';
    };

    prompts.push({
      title: "Commercial & Clean",
      prompt: `Professional commercial image for: ${input}

Deliver ${getCommercialPurpose()} with clean, modern aesthetics that align with current design trends. --ar 1:1 --quality 2`
    });

    return prompts;
  }

  static generateForCode(input: string): PromptTemplate[] {
    const analysis = this.analyzeInput(input);
    const prompts: PromptTemplate[] = [];

    const getCodeContext = () => {
      const tech = analysis.keywords.find(k => ['react', 'javascript', 'python', 'java', 'api', 'database'].includes(k.toLowerCase()));
      const purpose = analysis.keywords.find(k => ['app', 'website', 'system', 'algorithm', 'function'].includes(k.toLowerCase()));
      
      if (tech && purpose) {
        return `optimized ${tech} ${purpose} with enterprise-grade architecture and comprehensive testing suite`;
      } else if (analysis.intent === 'improve') {
        return `refactored solution with enhanced performance, security, and maintainability standards`;
      } else {
        return `robust, scalable solution following current industry best practices and design patterns`;
      }
    };

    // Production Ready
    prompts.push({
      title: "Production Ready",
      prompt: `Create production-grade code for: ${input}

Deliver ${getCodeContext()} with complete documentation and deployment readiness.`
    });

    // Learning & Educational
    const getLearningApproach = () => {
      if (analysis.specificity === 'vague') {
        return `comprehensive learning guide starting from basics and building up to advanced concepts with interactive examples`;
      } else if (analysis.keywords.some(k => ['beginner', 'learn', 'tutorial'].includes(k.toLowerCase()))) {
        return `beginner-friendly tutorial with clear explanations, practical exercises, and common mistake prevention`;
      } else {
        return `structured educational implementation with progressive complexity and hands-on learning opportunities`;
      }
    };

    prompts.push({
      title: "Learning & Educational",
      prompt: `Build educational implementation of: ${input}

Create ${getLearningApproach()} that maximizes understanding and retention.`
    });

    // Quick Solution
    const getQuickSolutionFocus = () => {
      if (analysis.intent === 'fix') {
        return `immediate fix with minimal changes that resolves the core issue efficiently and safely`;
      } else if (analysis.keywords.some(k => ['prototype', 'mvp', 'demo'].includes(k.toLowerCase()))) {
        return `rapid prototype demonstrating core functionality with clean, extensible foundation`;
      } else {
        return `streamlined solution focusing on essential features with clear, maintainable code structure`;
      }
    };

    prompts.push({
      title: "Quick Solution",
      prompt: `Rapid implementation for: ${input}

Provide ${getQuickSolutionFocus()} ready for immediate use and future enhancement.`
    });

    return prompts;
  }

  static generateForAudio(input: string): PromptTemplate[] {
    const analysis = this.analyzeInput(input);
    const prompts: PromptTemplate[] = [];

    const getAudioContext = () => {
      if (analysis.keywords.some(k => ['podcast', 'interview', 'conversation'].includes(k.toLowerCase()))) {
        return 'engaging podcast-style delivery with natural conversational flow and authentic personality';
      } else if (analysis.keywords.some(k => ['presentation', 'business', 'corporate'].includes(k.toLowerCase()))) {
        return 'executive-level professional presentation with authoritative confidence and clarity';
      } else if (analysis.keywords.some(k => ['story', 'narrative', 'book'].includes(k.toLowerCase()))) {
        return 'compelling storytelling with dramatic pacing and emotional resonance';
      } else {
        return 'versatile professional narration adapted to content requirements and audience expectations';
      }
    };

    // Professional Narration
    prompts.push({
      title: "Professional Narration",
      prompt: `Create professional audio narration for: ${input}

Deliver ${getAudioContext()} with broadcast-quality production standards.`
    });

    // Conversational & Friendly
    const getFriendlyApproach = () => {
      if (analysis.keywords.some(k => ['tutorial', 'guide', 'how-to'].includes(k.toLowerCase()))) {
        return 'friendly tutorial style that makes complex topics feel approachable and easy to understand';
      } else if (analysis.keywords.some(k => ['story', 'personal', 'experience'].includes(k.toLowerCase()))) {
        return 'intimate storytelling that creates personal connection and emotional engagement';
      } else {
        return 'warm, relatable conversation that feels like chatting with a knowledgeable friend';
      }
    };

    prompts.push({
      title: "Conversational & Friendly",
      prompt: `Generate friendly, conversational audio: ${input}

Create ${getFriendlyApproach()} with authentic personality and natural charm.`
    });

    // Formal & Authoritative
    const getAuthorityLevel = () => {
      if (analysis.keywords.some(k => ['academic', 'research', 'scientific'].includes(k.toLowerCase()))) {
        return 'scholarly authority with academic precision and evidence-based credibility';
      } else if (analysis.keywords.some(k => ['business', 'executive', 'corporate'].includes(k.toLowerCase()))) {
        return 'executive leadership presence with strategic insight and business acumen';
      } else if (analysis.keywords.some(k => ['legal', 'medical', 'technical'].includes(k.toLowerCase()))) {
        return 'professional expertise with technical accuracy and regulatory compliance';
      } else {
        return 'authoritative expertise with confident delivery and subject matter mastery';
      }
    };

    prompts.push({
      title: "Formal & Authoritative", 
      prompt: `Produce formal, authoritative audio content: ${input}

Establish ${getAuthorityLevel()} with impeccable professional presentation standards.`
    });

    return prompts;
  }

  static generateForVideo(input: string): PromptTemplate[] {
    const analysis = this.analyzeInput(input);
    const prompts: PromptTemplate[] = [];

    const getCinematicStyle = () => {
      if (analysis.keywords.some(k => ['commercial', 'advertisement', 'brand'].includes(k.toLowerCase()))) {
        return 'high-end commercial cinematography with brand storytelling and emotional impact';
      } else if (analysis.keywords.some(k => ['documentary', 'interview', 'real'].includes(k.toLowerCase()))) {
        return 'documentary-style cinematography with authentic storytelling and compelling visual narrative';
      } else if (analysis.keywords.some(k => ['artistic', 'creative', 'experimental'].includes(k.toLowerCase()))) {
        return 'artistic cinematography with creative visual language and innovative filming techniques';
      } else {
        return 'cinematic excellence with professional production values and compelling visual storytelling';
      }
    };

    // Cinematic & Professional
    prompts.push({
      title: "Cinematic & Professional",
      prompt: `Create cinematic video sequence: ${input}

Produce ${getCinematicStyle()} with 4K broadcast quality. --duration 60s --fps 24`
    });

    // Social Media Optimized
    const getSocialStrategy = () => {
      if (analysis.keywords.some(k => ['tiktok', 'viral', 'trending'].includes(k.toLowerCase()))) {
        return 'viral TikTok content with trending hooks, fast-paced editing, and maximum shareability';
      } else if (analysis.keywords.some(k => ['instagram', 'reel', 'story'].includes(k.toLowerCase()))) {
        return 'Instagram-optimized content with aesthetic appeal and engagement-driven storytelling';
      } else if (analysis.keywords.some(k => ['educational', 'tutorial', 'tips'].includes(k.toLowerCase()))) {
        return 'educational social content with quick learning value and actionable takeaways';
      } else {
        return 'platform-optimized content designed for maximum engagement and organic reach';
      }
    };

    prompts.push({
      title: "Social Media Ready",
      prompt: `Generate social media video for: ${input}

Create ${getSocialStrategy()} with mobile-first design. --aspect 9:16 --duration 30s`
    });

    // Educational & Clear
    const getEducationalFocus = () => {
      if (analysis.keywords.some(k => ['tutorial', 'how-to', 'guide'].includes(k.toLowerCase()))) {
        return 'comprehensive tutorial with step-by-step demonstrations and practical hands-on learning';
      } else if (analysis.keywords.some(k => ['explain', 'concept', 'theory'].includes(k.toLowerCase()))) {
        return 'concept explanation with visual aids, examples, and clear knowledge progression';
      } else if (analysis.keywords.some(k => ['course', 'lesson', 'training'].includes(k.toLowerCase()))) {
        return 'structured educational content with learning objectives and retention optimization';
      } else {
        return 'educational video content designed for effective knowledge transfer and engagement';
      }
    };

    prompts.push({
      title: "Educational & Clear",
      prompt: `Produce educational video content: ${input}

Deliver ${getEducationalFocus()} with professional instructional design principles.`
    });

    return prompts;
  }

  static generate(toolType: string, input: string): PromptTemplate[] {
    switch (toolType) {
      case 'text':
        return this.generateForText(input);
      case 'image':
        return this.generateForImage(input);
      case 'code':
        return this.generateForCode(input);
      case 'audio':
        return this.generateForAudio(input);
      case 'video':
        return this.generateForVideo(input);
      default:
        return this.generateForText(input);
    }
  }
}