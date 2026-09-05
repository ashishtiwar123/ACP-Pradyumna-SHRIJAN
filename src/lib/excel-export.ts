import * as XLSX from 'xlsx';

interface AnalysisData {
  id: string;
  startup_name: string;
  executive_summary: string;
  overall_score: number;
  financial_health_score: number;
  growth_potential_score: number;
  risk_assessment_score: number;
  current_revenue: number;
  monthly_burn: number;
  runway_months: number;
  team_size: number;
  funding_ask: number;
  funding_probability_score: number;
  business_overview: any;
  funding_details: any;
  market_analysis: any;
  slide_insights: any;
  red_flags: any;
  investment_recommendation: string;
}

export const exportToExcel = (analysis: AnalysisData) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Summary Sheet
  const summaryData = [
    ['Investment Analysis Report'],
    [''],
    ['Company Name', analysis.startup_name || 'N/A'],
    ['Report Date', new Date().toLocaleDateString()],
    [''],
    ['Key Scores'],
    ['Overall Score', `${analysis.overall_score || 0}/100`],
    ['Financial Health Score', `${analysis.financial_health_score || 0}/100`],
    ['Growth Potential Score', `${analysis.growth_potential_score || 0}/100`],
    ['Risk Assessment Score', `${analysis.risk_assessment_score || 0}/100`],
    [''],
    ['Key Financial Metrics'],
    ['Current Revenue', `$${(analysis.current_revenue || 0).toLocaleString()}`],
    ['Monthly Burn Rate', `$${(analysis.monthly_burn || 0).toLocaleString()}`],
    ['Runway (Months)', analysis.runway_months || 0],
    ['Team Size', analysis.team_size || 0],
    ['Funding Ask', `$${(analysis.funding_ask || 0).toLocaleString()}`],
    ['Funding Probability', `${analysis.funding_probability_score || 0}%`],
    [''],
    ['Executive Summary'],
    [analysis.executive_summary || 'N/A']
  ];

  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  // Business Overview Sheet
  if (analysis.business_overview) {
    const businessData = [
      ['Business Overview'],
      [''],
      ['Field', 'Details'],
      ['Problem', analysis.business_overview.problem || 'N/A'],
      ['Solution', analysis.business_overview.solution || 'N/A'],
      ['Business Model', analysis.business_overview.business_model || 'N/A'],
      ['Traction', analysis.business_overview.traction || 'N/A'],
      ['Competition', analysis.business_overview.competition || 'N/A']
    ];

    const businessWs = XLSX.utils.aoa_to_sheet(businessData);
    XLSX.utils.book_append_sheet(wb, businessWs, 'Business Overview');
  }

  // Market Analysis Sheet
  if (analysis.market_analysis) {
    const marketData = [
      ['Market Analysis'],
      [''],
      ['Field', 'Details'],
      ['Target Market', analysis.market_analysis.target_market || 'N/A'],
      ['Market Size Estimate', analysis.market_analysis.market_size_estimate || 'N/A'],
      ['Market Trends', analysis.market_analysis.market_trends || 'N/A'],
      ['Competitive Edge', analysis.market_analysis.competitive_edge || 'N/A']
    ];

    const marketWs = XLSX.utils.aoa_to_sheet(marketData);
    XLSX.utils.book_append_sheet(wb, marketWs, 'Market Analysis');
  }

  // Funding Details Sheet
  if (analysis.funding_details) {
    const fundingData = [
      ['Funding Details'],
      [''],
      ['Field', 'Details'],
      ['Funding Ask', `$${(analysis.funding_details.funding_ask || 0).toLocaleString()}`],
      ['Funding Stage', analysis.funding_details.funding_stage || 'N/A'],
      ['Previous Funding', `$${(analysis.funding_details.funding_raised || 0).toLocaleString()}`],
      ['Use of Funds', analysis.funding_details.use_of_funds || 'N/A']
    ];

    const fundingWs = XLSX.utils.aoa_to_sheet(fundingData);
    XLSX.utils.book_append_sheet(wb, fundingWs, 'Funding Details');
  }

  // Risk Factors Sheet
  if (analysis.red_flags && Object.keys(analysis.red_flags).length > 0) {
    const riskData = [
      ['Risk Factors'],
      [''],
      ['Category', 'Risk Details']
    ];

    Object.entries(analysis.red_flags).forEach(([category, flags]) => {
      if (Array.isArray(flags)) {
        flags.forEach((flag, index) => {
          riskData.push([index === 0 ? category.toUpperCase() : '', flag]);
        });
      } else {
        riskData.push([category.toUpperCase(), flags as string]);
      }
      riskData.push(['', '']); // Empty row for separation
    });

    const riskWs = XLSX.utils.aoa_to_sheet(riskData);
    XLSX.utils.book_append_sheet(wb, riskWs, 'Risk Factors');
  }

  // Financial Projections Sheet (calculated metrics)
  const projectionData = [
    ['Financial Projections & Calculations'],
    [''],
    ['Metric', 'Value', 'Calculation/Notes'],
    ['Current Annual Revenue', `$${(analysis.current_revenue || 0).toLocaleString()}`, 'Current revenue reported'],
    ['Monthly Burn Rate', `$${(analysis.monthly_burn || 0).toLocaleString()}`, 'Monthly operating expenses'],
    ['Current Runway', `${analysis.runway_months || 0} months`, 'Months until cash depletion'],
    ['Revenue per Employee', analysis.team_size > 0 ? `$${Math.round((analysis.current_revenue || 0) / analysis.team_size).toLocaleString()}` : 'N/A', 'Annual revenue divided by team size'],
    ['Burn per Employee', analysis.team_size > 0 ? `$${Math.round((analysis.monthly_burn || 0) / analysis.team_size).toLocaleString()}` : 'N/A', 'Monthly burn divided by team size'],
    ['Valuation Multiple', analysis.current_revenue > 0 ? `${((analysis.funding_ask || 0) / analysis.current_revenue).toFixed(1)}x` : 'N/A', 'Funding ask divided by current revenue'],
    ['Monthly Revenue', `$${Math.round((analysis.current_revenue || 0) / 12).toLocaleString()}`, 'Annual revenue divided by 12'],
    ['Revenue Run Rate', `$${((analysis.current_revenue || 0) * 1.2).toLocaleString()}`, 'Projected next year (20% growth assumed)']
  ];

  const projectionWs = XLSX.utils.aoa_to_sheet(projectionData);
  XLSX.utils.book_append_sheet(wb, projectionWs, 'Financial Projections');

  // Investment Recommendation Sheet
  if (analysis.investment_recommendation) {
    const recommendationData = [
      ['Investment Recommendation'],
      [''],
      [analysis.investment_recommendation]
    ];

    const recommendationWs = XLSX.utils.aoa_to_sheet(recommendationData);
    XLSX.utils.book_append_sheet(wb, recommendationWs, 'Recommendation');
  }

  // Style the workbook (basic formatting)
  Object.keys(wb.Sheets).forEach(sheetName => {
    const ws = wb.Sheets[sheetName];
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    
    // Auto-width for columns
    const colWidths = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellAddress];
        if (cell && cell.v) {
          const cellLength = cell.v.toString().length;
          maxWidth = Math.max(maxWidth, cellLength);
        }
      }
      colWidths.push({ width: Math.min(maxWidth + 2, 50) });
    }
    ws['!cols'] = colWidths;
  });

  // Generate filename and save
  const fileName = `${analysis.startup_name?.replace(/[^a-zA-Z0-9]/g, '_') || 'startup_analysis'}_report_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
};