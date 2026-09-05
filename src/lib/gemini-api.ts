import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface StartupData {
  startup_profile: any;
  domain_details: any;
  founder_assets: any;
  domain_type: 'healthcare' | 'fintech' | 'food' | 'ecommerce';
}

export interface AIAnalysisResult {
  timestamp: string;
  domain: string;
  performance_category: 'high_performer' | 'average_performer' | 'struggling' | 'new_startup';
  summary: {
    overall_score: number;
    financial_health: number;
    growth_potential: number;
    risk_level: number;
  };
  insights: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  red_flags: Array<{
    severity: 'high' | 'medium' | 'low';
    category: string;
    description: string;
    recommendation: string;
  }>;
  predictions: {
    runway_months: number;
    growth_forecast: string;
    funding_probability: number;
    breakeven_timeline: string;
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    action: string;
    impact: string;
    timeline: string;
  }>;
  charts_config: {
    primary_charts: string[];
    financial_charts: string[];
    domain_specific_charts: string[];
    metrics_to_highlight: string[];
  };
  key_metrics: Record<string, any>;
}

const createAnalysisPrompt = (data: StartupData): string => {
  return `
You are an expert startup analyst and business advisor. Analyze the following comprehensive startup data and provide detailed insights in JSON format.

STARTUP DATA:
${JSON.stringify(data, null, 2)}

Please analyze this startup and return a comprehensive analysis in the following JSON structure:

{
  "timestamp": "${new Date().toISOString()}",
  "domain": "${data.domain_type}",
  "performance_category": "high_performer|average_performer|struggling|new_startup",
  "summary": {
    "overall_score": 0-100,
    "financial_health": 0-100,
    "growth_potential": 0-100,
    "risk_level": 0-100
  },
  "insights": {
    "strengths": ["3-5 key strengths"],
    "weaknesses": ["3-5 key weaknesses"],
    "opportunities": ["3-5 growth opportunities"],
    "threats": ["3-5 potential threats"]
  },
  "red_flags": [
    {
      "severity": "high|medium|low",
      "category": "financial|operational|market|team",
      "description": "detailed description",
      "recommendation": "specific action to take"
    }
  ],
  "predictions": {
    "runway_months": estimated_months_until_cash_out,
    "growth_forecast": "detailed growth prediction",
    "funding_probability": 0-100,
    "breakeven_timeline": "estimated timeline to profitability"
  },
  "recommendations": [
    {
      "priority": "high|medium|low",
      "category": "financial|operational|marketing|product",
      "action": "specific action to take",
      "impact": "expected positive impact",
      "timeline": "recommended timeline"
    }
  ],
  "charts_config": {
    "primary_charts": ["revenue_trend", "burn_rate", "runway_projection"],
    "financial_charts": ["cash_flow", "funding_breakdown", "cost_structure"],
    "domain_specific_charts": ["industry_specific_charts_based_on_domain"],
    "metrics_to_highlight": ["key_metrics_to_emphasize"]
  },
  "key_metrics": {
    "calculated_runway": months,
    "monthly_burn_rate": amount,
    "growth_rate": percentage,
    "market_size": amount_or_description,
    "domain_specific_metrics": {}
  }
}

ANALYSIS GUIDELINES:
1. Be specific and actionable in recommendations
2. Consider the startup's industry/domain when providing insights
3. Factor in founder assets and financial health
4. Provide realistic timelines and predictions
5. Identify domain-specific opportunities and threats
6. Consider market conditions and competitive landscape
7. Be honest about weaknesses while highlighting strengths
8. Prioritize recommendations based on potential impact
9. Suggest appropriate charts and visualizations for this specific startup
10. Calculate meaningful metrics based on available data

Ensure the response is valid JSON and includes all required fields.
`;
};

export class GeminiAnalysisService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  async analyzeStartup(startupData: StartupData): Promise<AIAnalysisResult> {
    try {
      console.log('🤖 Starting Gemini analysis for startup...');
      
      const prompt = createAnalysisPrompt(startupData);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('📝 Gemini raw response received');

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in Gemini response');
      }

      const analysisResult: AIAnalysisResult = JSON.parse(jsonMatch[0]);
      
      // Validate the response structure
      this.validateAnalysisResult(analysisResult);
      
      console.log('✅ Gemini analysis completed successfully');
      return analysisResult;

    } catch (error) {
      console.error('❌ Gemini analysis failed:', error);
      
      // Return a fallback analysis structure
      return this.getFallbackAnalysis(startupData);
    }
  }

  private validateAnalysisResult(result: AIAnalysisResult): void {
    const requiredFields = [
      'timestamp', 'domain', 'performance_category', 'summary', 
      'insights', 'red_flags', 'predictions', 'recommendations', 
      'charts_config', 'key_metrics'
    ];

    for (const field of requiredFields) {
      if (!(field in result)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate summary scores are within 0-100 range
    const { summary } = result;
    const scores = [summary.overall_score, summary.financial_health, summary.growth_potential, summary.risk_level];
    
    for (const score of scores) {
      if (typeof score !== 'number' || score < 0 || score > 100) {
        throw new Error('Summary scores must be numbers between 0-100');
      }
    }
  }

  private getFallbackAnalysis(startupData: StartupData): AIAnalysisResult {
    console.warn('🔄 Using fallback analysis due to Gemini API failure');
    
    return {
      timestamp: new Date().toISOString(),
      domain: startupData.domain_type,
      performance_category: 'average_performer',
      summary: {
        overall_score: 65,
        financial_health: 60,
        growth_potential: 70,
        risk_level: 40
      },
      insights: {
        strengths: ['Active development', 'Clear business model', 'Experienced founder'],
        weaknesses: ['Limited market data', 'Early stage metrics', 'Resource constraints'],
        opportunities: ['Market expansion', 'Product development', 'Strategic partnerships'],
        threats: ['Market competition', 'Economic uncertainty', 'Regulatory changes']
      },
      red_flags: [
        {
          severity: 'medium',
          category: 'financial',
          description: 'Unable to perform detailed financial analysis',
          recommendation: 'Update financial data and retry analysis'
        }
      ],
      predictions: {
        runway_months: 12,
        growth_forecast: 'Moderate growth expected based on industry trends',
        funding_probability: 60,
        breakeven_timeline: '18-24 months'
      },
      recommendations: [
        {
          priority: 'high',
          category: 'operational',
          action: 'Complete data analysis with updated information',
          impact: 'Better insights and recommendations',
          timeline: 'Immediate'
        }
      ],
      charts_config: {
        primary_charts: ['revenue_trend', 'burn_rate'],
        financial_charts: ['cash_flow', 'funding_breakdown'],
        domain_specific_charts: ['industry_metrics'],
        metrics_to_highlight: ['revenue', 'burn_rate', 'team_size']
      },
      key_metrics: {
        calculated_runway: 12,
        monthly_burn_rate: 0,
        growth_rate: 0,
        market_size: 'Unknown',
        domain_specific_metrics: {}
      }
    };
  }

  // Method to analyze an uploaded pitch deck file (PDF, image, text) using Gemini multimodal capabilities
  async analyzePitchDeck(file: File): Promise<any> {
    try {
      console.log('🤖 Starting Gemini multimodal pitch deck analysis for:', file.name);

      const generativePart = await fileToGenerativePart(file);
      const prompt = createPitchDeckPrompt(file.name);

      const result = await this.model.generateContent([prompt, generativePart]);
      const response = await result.response;
      const text = response.text();

      console.log('📝 Gemini pitch deck response received');

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in Gemini pitch deck response');
      }

      const parsedJSON = JSON.parse(jsonMatch[0]);
      
      // Normalize structure if necessary
      if (parsedJSON.result) {
        return parsedJSON;
      } else if (parsedJSON.analysis_results) {
        return { result: parsedJSON };
      } else {
        return {
          result: {
            analysis_results: parsedJSON,
            analysis_logs: {
              model_used: 'gemini-2.5-flash',
              request_summary: `Analyzed ${file.name}`,
              response_summary: 'Pitch deck evaluation completed',
              startup_name: parsedJSON.startup_name || 'Startup',
              overall_score: parsedJSON.overall_score || 75,
              analysis_type: 'pitch_deck',
              status: 'completed',
              processing_time_seconds: 12
            }
          }
        };
      }
    } catch (error) {
      console.error('❌ Gemini pitch deck analysis failed:', error);
      throw error;
    }
  }

  // Method to test API connectivity
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.model.generateContent('Hello, please respond with "OK"');
      const response = await result.response;
      return response.text().includes('OK');
    } catch (error) {
      console.error('Gemini API connection test failed:', error);
      return false;
    }
  }
}

async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64Data = reader.result.split(',')[1];
        let mimeType = file.type;
        if (!mimeType) {
          if (file.name.endsWith('.pdf')) mimeType = 'application/pdf';
          else if (file.name.endsWith('.png')) mimeType = 'image/png';
          else if (file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) mimeType = 'image/jpeg';
          else if (file.name.endsWith('.txt')) mimeType = 'text/plain';
          else mimeType = 'application/pdf';
        }
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      } else {
        reject(new Error('Failed to read file as base64 string'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const createPitchDeckPrompt = (fileName: string): string => {
  return `
You are an expert venture capitalist and startup pitch deck analyst. Analyze the attached startup pitch deck document/file (${fileName}) thoroughly.

Extract key financial, operational, product, and market details from the file, evaluate the startup, and respond strictly with a single, valid JSON object containing the exact structure below:

{
  "result": {
    "analysis_results": {
      "startup_name": "Name of the startup (extracted or inferred from document)",
      "executive_summary": "Comprehensive 3-5 sentence executive summary of the startup and investment thesis.",
      "overall_score": 82,
      "financial_health_score": 78,
      "growth_potential_score": 85,
      "risk_assessment_score": 72,
      "funding_probability_score": 75,
      "current_revenue": 150000,
      "monthly_burn": 20000,
      "runway_months": 18,
      "team_size": 8,
      "funding_ask": 1500000,
      "business_overview": {
        "company": "Startup Name",
        "industry": "fintech",
        "stage": "seed",
        "founded": 2024,
        "description": "Short description of business",
        "problem": "Problem statement",
        "solution": "Proposed solution",
        "business_model": "Monetization model",
        "traction": "Key traction metrics"
      },
      "funding_details": {
        "funding_ask": 1500000,
        "use_of_funds": "Primary breakdown of funds allocation",
        "funding_stage": "seed",
        "runway_extension": 18,
        "previous_funding": 250000
      },
      "market_analysis": {
        "market_size_estimate": "Estimated TAM/SAM e.g. $10B",
        "market_trends": "Key market tailwinds and trends",
        "target_market": "Target audience and segment",
        "competitive_edge": "Unfair advantages and differentiation"
      },
      "investment_recommendation": "Detailed recommendation for venture capital investors on whether to proceed, pass, or request more information.",
      "slide_insights": {
        "problemSolution": "Feedback on problem & solution presentation",
        "marketSize": "Feedback on market size and opportunity",
        "businessModel": "Feedback on unit economics and monetization"
      },
      "red_flags": {
        "competition": ["Key competitive risk factors"],
        "financial": ["Financial or burn rate risk factors"],
        "execution": ["Execution or team risk factors"]
      },
      "key_metrics": {
        "arr": 150000,
        "mrr": 12500,
        "growth_rate": "15% MoM",
        "cac": 350,
        "ltv": 2400
      },
      "status": "completed"
    },
    "analysis_logs": {
      "model_used": "gemini-2.5-flash",
      "request_summary": "Analyzed ${fileName}",
      "response_summary": "Completed pitch deck evaluation",
      "startup_name": "Startup Name",
      "overall_score": 82,
      "analysis_type": "pitch_deck",
      "status": "completed",
      "processing_time_seconds": 10
    }
  }
}

Guidelines:
1. Extract exact figures whenever mentioned in the pitch deck. If a metric is missing, provide a realistic industry-standard estimate based on the startup's stage.
2. Ensure overall_score, financial_health_score, growth_potential_score, risk_assessment_score, and funding_probability_score are numbers between 0 and 100.
3. Be rigorous and objective. Highlight red flags clearly.
4. Return ONLY valid JSON with no markdown syntax outside the JSON block.
`;
};

export const geminiService = new GeminiAnalysisService();