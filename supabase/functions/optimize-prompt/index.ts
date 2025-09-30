import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log(`${req.method} ${req.url}`);
  
  if (req.method === "OPTIONS") {
    console.log("CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing prompt optimization request...");
    const { text, platform } = await req.json();
    console.log("Input text:", text);
    console.log("Target platform:", platform);

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!platform || typeof platform !== 'string') {
      return new Response(
        JSON.stringify({ error: "Platform is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Platform-specific system prompts
    const platformPrompts: Record<string, string> = {
      chatgpt: `You are an expert at creating prompts for ChatGPT. Generate 3 optimized prompt variations that:
- Use clear, specific instructions
- Include role definitions when beneficial
- Structure complex tasks with numbered steps
- Specify desired output format
- Include examples when helpful`,

      claude: `You are an expert at creating prompts for Claude (Anthropic). Generate 3 optimized prompt variations that:
- Leverage Claude's strong analytical and reasoning capabilities
- Use XML tags for structure when dealing with complex data
- Include clear thinking instructions for complex reasoning
- Specify output format preferences
- Take advantage of Claude's long context window for detailed tasks`,

      gemini: `You are an expert at creating prompts for Google Gemini. Generate 3 optimized prompt variations that:
- Leverage multimodal capabilities (text, image, code)
- Use clear, structured instructions
- Include context and examples
- Specify output format
- Take advantage of Google's knowledge integration`,

      grok: `You are an expert at creating prompts for Grok (xAI). Generate 3 optimized prompt variations that:
- Leverage real-time information and current events
- Use conversational yet precise language
- Include context about timing and currency of information
- Specify factual accuracy requirements
- Structure for quick, actionable responses`,

      midjourney: `You are an expert at creating prompts for MidJourney. Generate 3 optimized prompt variations that:
- Include detailed visual descriptions (subject, style, lighting, composition)
- Use specific artistic terms and styles
- Add technical parameters (--ar, --v, --stylize, --chaos)
- Reference specific artists or art movements when relevant
- Specify mood, atmosphere, and color palette`,

      dalle: `You are an expert at creating prompts for DALL-E. Generate 3 optimized prompt variations that:
- Use clear, descriptive language for subjects and scenes
- Specify artistic style and medium
- Include lighting, perspective, and composition details
- Add color scheme and mood descriptors
- Keep prompts concise but detailed (under 400 characters)`,

      "stable-diffusion": `You are an expert at creating prompts for Stable Diffusion. Generate 3 optimized prompt variations that:
- Use weighted keywords and emphasis with (keyword:weight) syntax
- Include negative prompts to avoid unwanted elements
- Specify quality tags (8k, highly detailed, masterpiece)
- Reference specific models or LoRAs when beneficial
- Structure with main subject, style, technical specs, quality tags`,

      copilot: `You are an expert at creating prompts for GitHub Copilot. Generate 3 optimized code comment variations that:
- Use clear, specific function/method descriptions
- Include parameter types and return values
- Specify edge cases and error handling
- Reference coding patterns and best practices
- Add context about purpose and usage`,

      cursor: `You are an expert at creating prompts for Cursor AI. Generate 3 optimized prompt variations that:
- Use specific, actionable instructions
- Include file context and project structure when relevant
- Specify coding standards and patterns
- Reference existing code when making changes
- Include testing and documentation requirements`,

      elevenlabs: `You are an expert at creating prompts for ElevenLabs voice synthesis. Generate 3 optimized script variations that:
- Use natural, conversational language
- Include punctuation for proper pacing and intonation
- Add emotional context when needed
- Specify voice characteristics (tone, pace, emotion)
- Structure for clear, engaging delivery`,

      musicgen: `You are an expert at creating prompts for MusicGen. Generate 3 optimized prompt variations that:
- Specify genre, mood, and tempo
- Include instrumentation details
- Reference specific musical styles or artists
- Add atmosphere and emotional descriptors
- Specify structure (intro, verse, chorus, etc.)`,

      runway: `You are an expert at creating prompts for Runway video editing. Generate 3 optimized prompt variations that:
- Describe the desired video transformation clearly
- Specify visual style and aesthetic
- Include motion and transition details
- Add atmosphere and mood descriptors
- Reference specific video effects or techniques`,

      pika: `You are an expert at creating prompts for Pika text-to-video. Generate 3 optimized prompt variations that:
- Describe the scene with clear visual details
- Specify motion and camera movement
- Include lighting and atmosphere
- Add style and aesthetic descriptors
- Keep prompts concise but descriptive`,

      sora: `You are an expert at creating prompts for Sora (OpenAI video generation). Generate 3 optimized prompt variations that:
- Use cinematic, descriptive language
- Specify camera angles and movements
- Include detailed visual descriptions of subjects and environments
- Add temporal elements (time of day, season, weather)
- Describe mood, atmosphere, and visual style`
    };

    const systemPrompt = platformPrompts[platform] || platformPrompts.chatgpt;

    // Call AI to generate optimized prompts
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Original user request: "${text}"

Generate 3 distinct optimized prompt variations:
1. "Quick & Direct" - Concise, straightforward version
2. "Detailed & Professional" - Comprehensive, well-structured version
3. "Creative & Enhanced" - Imaginative version with rich details

Return ONLY a JSON array with this exact structure:
[
  {"title": "Quick & Direct", "prompt": "..."},
  {"title": "Detailed & Professional", "prompt": "..."},
  {"title": "Creative & Enhanced", "prompt": "..."}
]`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI prompt optimization failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    
    if (!content) {
      throw new Error("No content returned from AI");
    }

    console.log("AI response:", content);

    // Extract JSON from response
    let prompts;
    try {
      // Try to find JSON array in the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        prompts = JSON.parse(jsonMatch[0]);
      } else {
        prompts = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback: create basic prompts
      prompts = [
        { title: "Quick & Direct", prompt: content },
        { title: "Detailed & Professional", prompt: content },
        { title: "Creative & Enhanced", prompt: content }
      ];
    }

    console.log(`Generated ${prompts.length} optimized prompts for ${platform}`);

    return new Response(
      JSON.stringify({ prompts }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Optimize prompt error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
