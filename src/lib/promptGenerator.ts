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

    // Quick & Simple version
    prompts.push({
      title: "Quick & Simple",
      prompt: `You are a professional ${analysis.intent === 'explain' ? 'educator' : 'content strategist'}. ${input}. 

Please provide a clear, structured response with:
- Direct answer to the main question
- Key points in bullet format
- Practical examples where relevant
- Professional yet accessible tone

Keep it concise but comprehensive.`
    });

    // Detailed & Professional version
    prompts.push({
      title: "Detailed & Professional", 
      prompt: `Act as a subject matter expert. Transform this request: "${input}" into a comprehensive guide.

Requirements:
- **Background Context**: Relevant industry knowledge and frameworks
- **Step-by-Step Process**: Clear, actionable instructions
- **Best Practices**: Industry standards and recommendations  
- **Examples**: Real-world applications and case studies
- **Next Steps**: What to do after implementation

Tone: Authoritative yet engaging, with clear structure using headers and bullet points.`
    });

    // Creative & Engaging version  
    prompts.push({
      title: "Creative & Engaging",
      prompt: `You are a creative strategist and storyteller. Based on "${input}", create compelling content that:

- Opens with a hook that captures attention
- Uses storytelling elements and analogies
- Includes actionable insights with creative examples
- Incorporates relevant trends and innovative approaches
- Ends with thought-provoking questions or challenges

Style: Dynamic, inspiring, and memorable while maintaining accuracy.`
    });

    return prompts;
  }

  static generateForImage(input: string): PromptTemplate[] {
    const analysis = this.analyzeInput(input);
    const prompts: PromptTemplate[] = [];

    // Photorealistic version
    prompts.push({
      title: "Photorealistic",
      prompt: `Create a stunning photorealistic image: ${input}

Technical specs:
- Style: Professional photography, cinematic lighting
- Quality: 8K resolution, ultra-detailed, masterpiece quality
- Camera: DSLR setup, perfect focus, optimal composition
- Lighting: Dramatic, well-balanced, studio-quality
- Color: Rich saturation, professional color grading

Composition: Rule of thirds, dynamic angles, depth of field --ar 16:9 --style raw`
    });

    // Artistic & Creative version
    prompts.push({
      title: "Artistic & Creative", 
      prompt: `Generate artistic interpretation of: ${input}

Art direction:
- Style: Modern digital art, concept art quality
- Mood: ${analysis.intent === 'create' ? 'Inspiring and captivating' : 'Professional and clean'}
- Colors: Vibrant palette, perfect harmony, visual impact
- Technique: Mixed media, detailed textures, artistic flair
- Composition: Visually striking, balanced, memorable

Output: Gallery-worthy, print-ready, trending on ArtStation --v 6`
    });

    // Commercial & Clean version
    prompts.push({
      title: "Commercial & Clean",
      prompt: `Professional commercial image for: ${input}

Business requirements:
- Purpose: Marketing/advertising ready
- Style: Clean, modern, brand-appropriate  
- Background: Minimalist or contextually relevant
- Quality: High-resolution, print and web ready
- Mood: Professional, trustworthy, appealing to target audience

Technical: Perfect lighting, sharp focus, commercial photography standards --ar 1:1`
    });

    return prompts;
  }

  static generateForCode(input: string): PromptTemplate[] {
    const analysis = this.analyzeInput(input);
    const prompts: PromptTemplate[] = [];

    // Production Ready
    prompts.push({
      title: "Production Ready",
      prompt: `Create production-grade code for: ${input}

Requirements:
- **Architecture**: Clean, scalable, maintainable design
- **Code Quality**: Follow industry best practices and conventions
- **Error Handling**: Comprehensive error management and validation
- **Documentation**: Clear comments and usage examples
- **Testing**: Include unit tests and edge case handling
- **Performance**: Optimized for efficiency and speed

Provide complete implementation with setup instructions and deployment notes.`
    });

    // Learning & Educational
    prompts.push({
      title: "Learning & Educational",
      prompt: `Build educational implementation of: ${input}

Structure:
1. **Concept Explanation**: What this solves and why
2. **Step-by-Step Build**: Incremental development process
3. **Code Comments**: Detailed explanations of logic
4. **Variations**: Different approaches and their trade-offs
5. **Common Pitfalls**: What to avoid and debugging tips
6. **Extensions**: How to expand and improve

Focus on learning and understanding over complexity.`
    });

    // Quick Solution
    prompts.push({
      title: "Quick Solution",
      prompt: `Rapid implementation for: ${input}

Deliver:
- Minimal viable solution that works immediately
- Clean, readable code with essential features only
- Basic error handling for common scenarios  
- Simple usage examples
- Quick setup instructions

Priority: Speed of implementation while maintaining code quality.`
    });

    return prompts;
  }

  static generateForAudio(input: string): PromptTemplate[] {
    const prompts: PromptTemplate[] = [];

    // Professional Narration
    prompts.push({
      title: "Professional Narration",
      prompt: `Create professional audio narration for: ${input}

Voice specifications:
- Tone: Authoritative yet warm and engaging
- Pace: Well-measured, clear articulation
- Style: Conversational professional, trustworthy
- Emotion: Appropriate to content, genuine
- Quality: Studio-grade, broadcast ready

Technical: 48kHz, noise-free, optimized levels, perfect pronunciation`
    });

    // Conversational & Friendly
    prompts.push({
      title: "Conversational & Friendly",
      prompt: `Generate friendly, conversational audio: ${input}

Characteristics:
- Personality: Warm, approachable, relatable
- Delivery: Natural rhythm, conversational flow
- Engagement: Interactive tone, as if speaking to a friend
- Energy: Enthusiastic but not overwhelming
- Clarity: Easy to understand, well-paced

Format: Podcast-quality, engaging storytelling style`
    });

    // Formal & Authoritative
    prompts.push({
      title: "Formal & Authoritative", 
      prompt: `Produce formal, authoritative audio content: ${input}

Professional standards:
- Authority: Expert-level confidence and knowledge
- Clarity: Precise pronunciation, perfect diction
- Formality: Business/academic appropriate tone
- Credibility: Trustworthy, well-researched delivery
- Structure: Clear introduction, body, conclusion

Output: Conference/presentation quality, executive-level polish`
    });

    return prompts;
  }

  static generateForVideo(input: string): PromptTemplate[] {
    const prompts: PromptTemplate[] = [];

    // Cinematic & Professional
    prompts.push({
      title: "Cinematic & Professional",
      prompt: `Create cinematic video sequence: ${input}

Production value:
- Cinematography: Professional camera work, varied shot compositions
- Lighting: Cinematic lighting setup, mood-appropriate
- Movement: Smooth camera moves, dynamic transitions  
- Color: Professional color grading, visual consistency
- Pacing: Engaging rhythm, well-timed cuts

Technical: 4K resolution, 24fps, broadcast quality --duration 60s`
    });

    // Social Media Optimized
    prompts.push({
      title: "Social Media Ready",
      prompt: `Generate social media video for: ${input}

Social optimization:
- Format: Vertical/square for mobile consumption
- Hook: Attention-grabbing opening 3 seconds
- Pacing: Fast, engaging, thumb-stopping content
- Text: On-screen text for sound-off viewing
- CTA: Clear call-to-action for engagement

Platform: Instagram/TikTok ready, viral potential --aspect 9:16 --duration 30s`
    });

    // Educational & Informative
    prompts.push({
      title: "Educational & Clear",
      prompt: `Produce educational video content: ${input}

Educational focus:
- Structure: Clear introduction, main content, summary
- Visuals: Supporting graphics, demonstrations, examples
- Narration: Clear, well-paced explanation
- Flow: Logical progression, easy to follow
- Retention: Engaging throughout, key points emphasized

Style: Professional educational, tutorial-quality production`
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