import OpenAI from 'openai';
import { NextRequest } from 'next/server';

// Configure Venice AI (using OpenAI-compatible API)
const venice = new OpenAI({
  apiKey: process.env.VENICE_API_KEY,
  baseURL: process.env.VENICE_API_BASE_URL,
});

// Define language types
type SupportedLanguage = 'english' | 'french' | 'spanish' | 'german';

// Language mapping for instructions
const languageInstructions: Record<SupportedLanguage, { systemPrompt: string; outputLanguage: string }> = {
  english: {
    systemPrompt: 'You are a comedy assistant that generates jokes based on user parameters. Respond in English.',
    outputLanguage: 'English'
  },
  french: {
    systemPrompt: 'Vous êtes un assistant de comédie qui génère des blagues basées sur les paramètres de l\'utilisateur. Répondez en français.',
    outputLanguage: 'French'
  },
  spanish: {
    systemPrompt: 'Eres un asistente de comedia que genera chistes basados en los parámetros del usuario. Responde en español.',
    outputLanguage: 'Spanish'
  },
  german: {
    systemPrompt: 'Sie sind ein Comedy-Assistent, der Witze basierend auf Benutzerparametern generiert. Antworten Sie auf Deutsch.',
    outputLanguage: 'German'
  }
};

// Keep track of previously generated jokes to avoid repetition
let previousJokes: Set<string> = new Set();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { messages } = await request.json();
    
    // Get the latest user message
    const lastUserMessage = messages[messages.length - 1];
    
    // Parse the parameters from the message content
    const { topic, tone, type, language, temperature } = JSON.parse(lastUserMessage.content);
    
    // Get language settings (default to English if not found)
    const languageSetting = languageInstructions[language as SupportedLanguage] || languageInstructions.english;

    // Add a timestamp to ensure uniqueness in each request
    const timestamp = new Date().toISOString();
    
    // Construct the prompt for Venice AI
    const prompt = `Generate a ${tone} ${type} joke about ${topic === 'random' ? 'anything' : topic} in ${languageSetting.outputLanguage}.
    
    The joke should be appropriate for general audiences and should be creative.
    
    If it's a knock-knock joke, format it properly with the back-and-forth structure.
    If it's a pun, make sure it's clever and plays on words.
    If it's a story joke, keep it concise but with a good punchline at the end.
    
    Make sure the joke is entirely in ${languageSetting.outputLanguage}.
    
    IMPORTANT: Generate a DIFFERENT joke than any you've generated before. Be original and creative.
    Current time: ${timestamp}`;

    // Create a new message array with our system prompt and the user's prompt
    const apiMessages = [
      {
        role: 'system' as const,
        content: languageSetting.systemPrompt
      },
      {
        role: 'user' as const,
        content: prompt
      }
    ];
    
    // Add previous jokes to avoid repetition (if any)
    if (previousJokes.size > 0) {
      apiMessages.push({
        role: 'system' as const,
        content: `Do NOT generate any of these jokes again: ${Array.from(previousJokes).join(' | ')}`
      });
    }
    
    // Call Venice AI API (using OpenAI-compatible interface)
    // Using type assertion to bypass TypeScript type checking for Venice AI parameters
    const completion = await venice.chat.completions.create({
      model: 'llama-3.2-3b', // Using a smaller model that works with free accounts
      messages: apiMessages,
      temperature: temperature,
      max_tokens: 150, // Reduced from 300 to save tokens
      frequency_penalty: 0.8, // Increase frequency penalty to reduce repetition
      presence_penalty: 0.6  // Increase presence penalty to encourage new content
      // Venice-specific parameters removed to fix TypeScript errors
    } as any);
    
    // Extract the joke from the response
    const joke = completion.choices[0]?.message?.content || 'Sorry, I couldn\'t come up with a joke right now.';
    
    // Store this joke to avoid repetition in future requests
    // Limit the size of the set to avoid memory issues
    if (previousJokes.size >= 10) {
      previousJokes.clear(); // Reset if we have too many
    }
    previousJokes.add(joke);
    
    // Return the joke
    return new Response(JSON.stringify({ joke }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error generating joke:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate joke' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
