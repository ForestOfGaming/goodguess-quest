
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
    const { guess, target, category, action } = await req.json();
    
    // Get the API key from environment variable
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error('Missing OpenAI API key');
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured',
          // Fall back to algorithmic calculation or validation
          proximity: action === 'validate' ? true : null
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle word validation request
    if (action === 'validate') {
      // Create a simpler prompt for GPT to validate if a word is real
      const messages = [
        {
          role: "system",
          content: 
            `You are a word validator that only responds with a JSON object containing "isValid": true/false.
             A word is valid if it's a real English word, proper noun people would recognize, or common term.
             Only respond with {"isValid": true} or {"isValid": false}.`
        },
        {
          role: "user",
          content: `Is "${guess}" a real word, name, or term?`
        }
      ];

      // Call OpenAI API for validation - use the mini model for speed
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          temperature: 0.1, // Lower temperature for more deterministic responses
          max_tokens: 30    // Reduce token limit for faster responses
        }),
      });

      const data = await response.json();
      console.log('OpenAI validation response:', JSON.stringify(data));

      // Extract the validation result from the response
      let isValid = true; // Default to true if parsing fails
      try {
        const content = data.choices[0].message.content.trim();
        // Try to parse the JSON response
        let jsonMatch = content.match(/\{.*\}/s);
        if (jsonMatch) {
          const jsonResponse = JSON.parse(jsonMatch[0]);
          isValid = jsonResponse.isValid;
        }
      } catch (e) {
        console.error('Error parsing validation result:', e);
        // Default to true if parsing fails
      }

      // Return the validation result
      return new Response(
        JSON.stringify({ isValid }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    // Handle similarity calculation request
    else {
      if (!guess || !target || !category) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create a more specific prompt based on the category - special handling for countries
      let systemPrompt = 
        `You are an AI that evaluates semantic similarity between words in a word-guessing game.
        You will be given two words and their category.
        Return a similarity score from 0 to 100, where:
        - 100 means they are identical
        - 0 means they have absolutely nothing in common
        
        Your scores should utilize the full range from 0 to 100.
        The last digit of your score must be between 1 and 9 (never use 0 as the last digit).
        
        Respond with ONLY a JSON object with a single field "proximity": the similarity score.
        Do not include explanations or any text besides the JSON.`;

      // Special handling for countries category
      if (category === 'countries') {
        systemPrompt = 
          `You are an AI that evaluates the geographic and cultural similarity between countries.
          You will be given two country names.
          Return a similarity score from 0 to 100, where:
          - 100 means they are identical
          - 0 means they have absolutely nothing in common
          
          When scoring country similarity, prioritize these factors (in order):
          1. Geographic proximity (neighboring countries should score at least 70+)
          2. Shared region/continent (countries in the same region score at least 50+)
          3. Cultural, linguistic, and historical connections
          4. Economic and political relationships
          
          Examples:
          - Spain and Portugal should score 85-95 (neighbors, shared history, similar culture)
          - USA and Canada should score 80-90 (neighbors, shared language, similar culture)
          - France and Italy should score 70-80 (close European countries, Latin languages)
          - UK and Australia should score 50-60 (historical ties but geographically distant)
          - Japan and Brazil should score 10-20 (very different geography and culture)
          
          Your scores should utilize the full range from 0 to 100.
          The last digit of your score must be between 1 and 9 (never use 0 as the last digit).
          
          Respond with ONLY a JSON object with a single field "proximity": the similarity score.
          Do not include explanations or any text besides the JSON.`;
      } else {
        // For other categories, add category-specific scoring guidance
        systemPrompt += `\nScores in between reflect the degree of similarity based on:
          * Semantic relationship in the given category
          * Shared characteristics or properties
          * Cultural or conceptual connections`;
      }

      const messages = [
        {
          role: "system",
          content: systemPrompt
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
          temperature: 0.7, // Increased temperature for more varied responses
          max_tokens: 150
        }),
      });

      const data = await response.json();
      console.log('OpenAI similarity response:', JSON.stringify(data));

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
          // Make sure proximity is within the 0-100 range
          proximity = Math.max(0, Math.min(100, Math.floor(proximity)));
          
          // Ensure the last digit is between 1-9 (never 0)
          if (proximity % 10 === 0) {
            // If the last digit is 0, change it to a random number between 1-9
            proximity = proximity - 1 + Math.floor(Math.random() * 9) + 1;
          }
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
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message, result: null }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
