import OpenAI from 'openai';
import { NextRequest } from 'next/server';

// Configure Venice AI (using OpenAI-compatible API)
const venice = new OpenAI({
  apiKey: process.env.VENICE_API_KEY,
  baseURL: process.env.VENICE_API_BASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const { joke } = await request.json();

    if (!joke) {
      return new Response(JSON.stringify({ error: 'No joke provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Using type assertion to bypass TypeScript type checking for Venice AI parameters
    const completion = await venice.chat.completions.create({
      model: 'mistral-7b', // Using a smaller model that works with free accounts
      messages: [
        {
          role: 'system',
          content: `You are a joke evaluation assistant. Analyze jokes for humor, appropriateness, and offensive content. 
          Keep your evaluation concise with format: Funny: true/false, Appropriate: true/false, Offensive: true/false, Comments: brief explanation.`
        },
        {
          role: 'user',
          content: `Evaluate this joke: "${joke}"`
        }
      ],
      temperature: 0.5, // Reduced temperature for more consistent evaluations
      max_tokens: 100 // Reduced from 200 to save tokens
      // Venice-specific parameters removed to fix TypeScript errors
    } as any);

    const response = completion.choices[0]?.message?.content;
    
    // Parse the AI's response to extract evaluation metrics
    const evaluation = {
      funny: response?.toLowerCase().includes('funny: true') || response?.toLowerCase().includes('humorous') || response?.toLowerCase().includes('amusing'),
      appropriate: !response?.toLowerCase().includes('inappropriate') && !response?.toLowerCase().includes('offensive'),
      offensive: response?.toLowerCase().includes('offensive') || response?.toLowerCase().includes('inappropriate'),
      comments: response?.split('comments:')[1]?.trim() || response
    };

    return new Response(JSON.stringify({ evaluation }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error evaluating joke:', error);
    return new Response(JSON.stringify({ error: 'Failed to evaluate joke' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
