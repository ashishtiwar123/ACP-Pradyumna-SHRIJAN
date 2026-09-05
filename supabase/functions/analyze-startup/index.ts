import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { startupInput, userId, uploadId } = await req.json();

    if (!startupInput || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: startupInput and userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing startup with Gemini API...');

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert startup analyst and venture capitalist. Analyze the following startup information and provide a comprehensive, structured analysis.

Startup Information:
${startupInput}

Please provide a detailed analysis with the following sections (use clear markdown headers):

## Problem & Solution
Analyze the problem they're solving and their proposed solution. Is it compelling? Is the solution innovative?

## Market & Competitors
Evaluate the market opportunity and competitive landscape. Who are the main competitors? What's the market size?

## Business Model
Assess their revenue model and monetization strategy. Is it sustainable and scalable?

## Team Strength
Evaluate the team's capabilities, experience, and ability to execute (if information is available).

## Funding Readiness
Assess how ready this startup is for investment. What stage are they at?

## Risks & Red Flags
List critical risks and potential red flags that could hinder success. Be specific and honest.

## Growth Opportunities
Identify key opportunities for growth and scaling.

## Growth Recommendation
Provide 3-5 actionable recommendations for how this startup can improve and scale effectively.

## Overall Assessment
Provide an overall score from 1-10 and a brief executive summary (2-3 sentences).

Please be thorough, honest, and constructive in your analysis.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze with Gemini API' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!analysisText) {
      throw new Error('No analysis text received from Gemini API');
    }

    console.log('Analysis completed, parsing results...');

    // Parse the analysis into structured sections
    const sections = parseAnalysis(analysisText);

    // Extract overall score from the analysis
    const scoreMatch = analysisText.match(/score.*?(\d+)\/10/i) || analysisText.match(/(\d+)\/10/);
    const overallScore = scoreMatch ? parseInt(scoreMatch[1]) : 7;

    // Store in Supabase
    const { data: analysisResult, error: dbError } = await supabase
      .from('analysis_results')
      .insert({
        user_id: userId,
        upload_id: uploadId || null,
        slide_insights: sections,
        red_flags: sections.risksRedFlags ? { items: sections.risksRedFlags.split('\n').filter((x: string) => x.trim()) } : null,
        key_metrics: {
          problemSolution: sections.problemSolution || '',
          marketCompetitors: sections.marketCompetitors || '',
          businessModel: sections.businessModel || '',
        },
        overall_score: overallScore,
        executive_summary: sections.executiveSummary || analysisText.substring(0, 500),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log('Analysis stored successfully');

    return new Response(
      JSON.stringify({
        success: true,
        analysisId: analysisResult.id,
        analysis: {
          fullText: analysisText,
          sections,
          overallScore,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-startup function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function parseAnalysis(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  
  // Extract sections using regex
  const sectionPatterns = [
    { key: 'problemSolution', pattern: /##\s*Problem\s*&\s*Solution\s*([\s\S]*?)(?=##|$)/i },
    { key: 'marketCompetitors', pattern: /##\s*Market\s*&\s*Competitors\s*([\s\S]*?)(?=##|$)/i },
    { key: 'businessModel', pattern: /##\s*Business\s*Model\s*([\s\S]*?)(?=##|$)/i },
    { key: 'teamStrength', pattern: /##\s*Team\s*Strength\s*([\s\S]*?)(?=##|$)/i },
    { key: 'fundingReadiness', pattern: /##\s*Funding\s*Readiness\s*([\s\S]*?)(?=##|$)/i },
    { key: 'risksRedFlags', pattern: /##\s*Risks\s*&\s*Red\s*Flags\s*([\s\S]*?)(?=##|$)/i },
    { key: 'growthOpportunities', pattern: /##\s*Growth\s*Opportunities\s*([\s\S]*?)(?=##|$)/i },
    { key: 'growthRecommendation', pattern: /##\s*Growth\s*Recommendation\s*([\s\S]*?)(?=##|$)/i },
    { key: 'overallAssessment', pattern: /##\s*Overall\s*Assessment\s*([\s\S]*?)(?=##|$)/i },
    { key: 'executiveSummary', pattern: /##\s*Overall\s*Assessment\s*([\s\S]*?)(?=##|$)/i },
  ];

  for (const { key, pattern } of sectionPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      sections[key] = match[1].trim();
    }
  }

  return sections;
}
