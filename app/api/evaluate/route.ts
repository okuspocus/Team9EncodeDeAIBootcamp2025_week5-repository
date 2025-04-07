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

    const completion = await venice.chat.completions.create({
      model: 'llama-3.3-70b', // Using Venice's Llama 3.3 70B model instead of gpt-4o-mini
      messages: [
        {
          role: 'system',
          content: `You are a joke evaluation assistant. Analyze jokes for their humor, appropriateness, and potential offensive content. 
          Provide a structured evaluation with boolean values for funny, appropriate, and offensive, along with brief comments.
          Be honest but constructive in your evaluation.`
        },
        {
          role: 'user',
          content: `Please evaluate this joke: "${joke}"`
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
      venice_parameters: {
        include_venice_system_prompt: false, // Disable Venice's system prompts for evaluation to ensure consistent results
        enable_web_search: false // Disable web search for evaluation
      }
    });

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
