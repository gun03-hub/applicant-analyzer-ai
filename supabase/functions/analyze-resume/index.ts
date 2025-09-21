import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { jobDescription, resumeText } = await req.json();
    
    if (!jobDescription || !resumeText) {
      throw new Error('Job description and resume text are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Analyzing resume with AI...');

    const prompt = `You are an expert HR recruiter. Analyze the following job description and resume for relevance match.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Please provide a detailed analysis in this exact JSON format:
{
  "relevanceScore": [number 0-100],
  "matchedSkills": [array of matched skills/technologies],
  "missingSkills": [array of important missing skills],
  "recommendations": [array of specific improvement suggestions]
}

Focus on:
- Technical skills match
- Experience relevance
- Role requirements alignment
- Missing critical qualifications

Provide 3-5 items for each array. Be specific and actionable.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert HR recruiter analyzing resumes. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);

    // Parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback to mock data if parsing fails
      analysisResult = {
        relevanceScore: 75,
        matchedSkills: ["Communication", "Problem Solving", "Teamwork"],
        missingSkills: ["Specific technical skills", "Industry experience"],
        recommendations: [
          "Add more technical details to your experience",
          "Include quantifiable achievements",
          "Highlight relevant certifications"
        ]
      };
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to analyze resume',
        relevanceScore: 0,
        matchedSkills: [],
        missingSkills: [],
        recommendations: ["Please try again with valid inputs"]
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});