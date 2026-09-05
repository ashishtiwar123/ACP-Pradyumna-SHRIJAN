// Utility function to process the API response data format and convert it to the expected AnalysisData format
export const processApiAnalysisData = (apiData: any) => {
  // Handle the case where data comes from the API response format you provided
  const data = Array.isArray(apiData) ? apiData[0] : apiData;
  
  // Parse JSON strings if they exist
  const parseJsonField = (field: any) => {
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return field;
      }
    }
    return field;
  };

  return {
    id: data.id || data.idx || 'unknown',
    startup_name: data.startup_name || 'Unknown Startup',
    executive_summary: data.executive_summary || '',
    overall_score: data.overall_score || 0,
    financial_health_score: data.financial_health_score || 0,
    growth_potential_score: data.growth_potential_score || 0,
    risk_assessment_score: data.risk_assessment_score || 0,
    current_revenue: typeof data.current_revenue === 'string' ? 
      parseInt(data.current_revenue) || 0 : data.current_revenue || 0,
    monthly_burn: typeof data.monthly_burn === 'string' ? 
      parseInt(data.monthly_burn) || 0 : data.monthly_burn || 0,
    runway_months: data.runway_months || 0,
    team_size: data.team_size || 0,
    funding_ask: typeof data.funding_ask === 'string' ? 
      parseInt(data.funding_ask) || 0 : data.funding_ask || 0,
    funding_probability_score: data.funding_probability_score || 0,
    business_overview: parseJsonField(data.business_overview),
    funding_details: parseJsonField(data.funding_details),
    market_analysis: parseJsonField(data.market_analysis),
    slide_insights: parseJsonField(data.slide_insights),
    red_flags: parseJsonField(data.red_flags),
    investment_recommendation: data.investment_recommendation || '',
    key_metrics: parseJsonField(data.key_metrics),
    comparable_companies: parseJsonField(data.comparable_companies),
    status: data.status,
    created_at: data.created_at,
    user_id: data.user_id
  };
};