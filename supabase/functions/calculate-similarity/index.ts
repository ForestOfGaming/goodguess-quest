
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { guess, target, category } = await req.json();
    
    if (!guess || !target || !category) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the API key from environment variable
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error('Missing OpenAI API key');
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured',
          // Fall back to algorithmic calculation
          proximity: null
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a prompt for GPT to evaluate the similarity
    const messages = [
      {
        role: "system",
        content: 
          `You are an AI that evaluates semantic similarity between words in a word-guessing game.
          You will be given two words and their category.
          Return a similarity score from 0 to 100, where:
          - 100 means they are identical
          - 0 means they have absolutely nothing in common
          - Scores in between reflect the degree of similarity based on:
            * Semantic relationship in the given category
            * Shared characteristics or properties
            * Cultural or conceptual connections
          
          Respond with ONLY a JSON object with a single field "proximity": the similarity score.
          Do not include explanations or any text besides the JSON.`
      },
      {
        role: "user",
        content: `Compare these two ${category} words: "${guess}" and "${target}". How similar are they on a scale from 0-100?`
      }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.3,
        max_tokens: 150
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', JSON.stringify(data));

    // Extract the proximity value from the response
    let proximity;
    try {
      const content = data.choices[0].message.content.trim();
      // Try to parse the JSON response
      let jsonMatch = content.match(/\{.*\}/s);
      if (jsonMatch) {
        const jsonResponse = JSON.parse(jsonMatch[0]);
        proximity = jsonResponse.proximity;
      } else {
        // Try to extract just the number if JSON parsing fails
        const numberMatch = content.match(/\b(\d{1,3})\b/);
        proximity = numberMatch ? parseInt(numberMatch[1]) : null;
      }
      
      // Ensure proximity is within valid range
      if (proximity !== null) {
        proximity = Math.max(0, Math.min(100, Math.round(proximity)));
      }
    } catch (e) {
      console.error('Error parsing proximity:', e);
      proximity = null;
    }

    // Return the result
    return new Response(
      JSON.stringify({ proximity }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message, proximity: null }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
