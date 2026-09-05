import jsPDF from 'jspdf';

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

export const exportToPDF = (analysis: AnalysisData) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12, isBold: boolean = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    const lines = pdf.splitTextToSize(text, maxWidth);
    lines.forEach((line: string, index: number) => {
      if (y + (index * fontSize * 0.5) > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, x, y + (index * fontSize * 0.5));
    });
    
    return y + (lines.length * fontSize * 0.5) + 5;
  };

  // Helper function to add a section header
  const addSectionHeader = (title: string, y: number) => {
    if (y > pageHeight - 40) {
      pdf.addPage();
      y = margin;
    }
    
    pdf.setFillColor(59, 130, 246); // Primary blue color
    pdf.rect(margin, y - 5, contentWidth, 20, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, margin + 5, y + 8);
    
    pdf.setTextColor(0, 0, 0);
    return y + 25;
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `$${amount.toFixed(0)}`;
    }
  };

  // Title Page
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246);
  yPosition = addWrappedText(`Investment Analysis Report`, margin, yPosition, contentWidth, 24, true);
  
  pdf.setFontSize(18);
  pdf.setTextColor(0, 0, 0);
  yPosition = addWrappedText(analysis.startup_name || 'Startup Analysis', margin, yPosition + 10, contentWidth, 18, true);

  // Date
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  yPosition = addWrappedText(`Generated on: ${currentDate}`, margin, yPosition + 10, contentWidth);

  yPosition += 20;

  // Executive Summary Section
  yPosition = addSectionHeader('EXECUTIVE SUMMARY', yPosition);
  if (analysis.executive_summary) {
    yPosition = addWrappedText(analysis.executive_summary, margin, yPosition, contentWidth);
  }

  yPosition += 10;

  // Key Scores Section
  yPosition = addSectionHeader('KEY PERFORMANCE SCORES', yPosition);
  
  const scores = [
    { label: 'Overall Score', value: `${analysis.overall_score || 0}/100`, color: [59, 130, 246] },
    { label: 'Financial Health', value: `${analysis.financial_health_score || 0}/100`, color: [34, 197, 94] },
    { label: 'Growth Potential', value: `${analysis.growth_potential_score || 0}/100`, color: [59, 130, 246] },
    { label: 'Risk Assessment', value: `${analysis.risk_assessment_score || 0}/100`, color: [249, 115, 22] }
  ];

  scores.forEach((score, index) => {
    const xPos = margin + (index % 2) * (contentWidth / 2);
    const yPos = yPosition + Math.floor(index / 2) * 25;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(score.label, xPos, yPos);
    
    pdf.setFontSize(16);
    pdf.setTextColor(score.color[0], score.color[1], score.color[2]);
    pdf.text(score.value, xPos, yPos + 10);
    pdf.setTextColor(0, 0, 0);
  });

  yPosition += 60;

  // Key Metrics Section
  yPosition = addSectionHeader('KEY FINANCIAL METRICS', yPosition);
  
  const metrics = [
    { label: 'Current Revenue', value: formatCurrency(analysis.current_revenue || 0) },
    { label: 'Monthly Burn Rate', value: formatCurrency(analysis.monthly_burn || 0) },
    { label: 'Runway', value: `${analysis.runway_months || 0} months` },
    { label: 'Team Size', value: `${analysis.team_size || 0} members` },
    { label: 'Funding Ask', value: formatCurrency(analysis.funding_ask || 0) },
    { label: 'Funding Probability', value: `${analysis.funding_probability_score || 0}%` }
  ];

  metrics.forEach((metric, index) => {
    const xPos = margin + (index % 2) * (contentWidth / 2);
    const yPos = yPosition + Math.floor(index / 2) * 20;
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${metric.label}:`, xPos, yPos);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text(metric.value, xPos + 80, yPos);
  });

  yPosition += 80;

  // Business Overview Section
  if (analysis.business_overview) {
    yPosition = addSectionHeader('BUSINESS OVERVIEW', yPosition);
    
    const businessFields = [
      { key: 'problem', label: 'Problem Statement' },
      { key: 'solution', label: 'Solution' },
      { key: 'business_model', label: 'Business Model' },
      { key: 'traction', label: 'Traction' },
      { key: 'competition', label: 'Competition' }
    ];

    businessFields.forEach(field => {
      if (analysis.business_overview[field.key]) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        yPosition = addWrappedText(`${field.label}:`, margin, yPosition, contentWidth, 12, true);
        
        pdf.setFont('helvetica', 'normal');
        yPosition = addWrappedText(analysis.business_overview[field.key], margin, yPosition, contentWidth) + 5;
      }
    });
  }

  // Market Analysis Section
  if (analysis.market_analysis) {
    yPosition = addSectionHeader('MARKET ANALYSIS', yPosition);
    
    const marketFields = [
      { key: 'target_market', label: 'Target Market' },
      { key: 'market_size_estimate', label: 'Market Size' },
      { key: 'market_trends', label: 'Market Trends' },
      { key: 'competitive_edge', label: 'Competitive Edge' }
    ];

    marketFields.forEach(field => {
      if (analysis.market_analysis[field.key]) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        yPosition = addWrappedText(`${field.label}:`, margin, yPosition, contentWidth, 12, true);
        
        pdf.setFont('helvetica', 'normal');
        yPosition = addWrappedText(analysis.market_analysis[field.key], margin, yPosition, contentWidth) + 5;
      }
    });
  }

  // Funding Details Section
  if (analysis.funding_details) {
    yPosition = addSectionHeader('FUNDING DETAILS', yPosition);
    
    const fundingFields = [
      { key: 'funding_ask', label: 'Funding Ask', format: (val: any) => formatCurrency(val) },
      { key: 'funding_stage', label: 'Funding Stage' },
      { key: 'funding_raised', label: 'Previous Funding', format: (val: any) => formatCurrency(val) },
      { key: 'use_of_funds', label: 'Use of Funds' }
    ];

    fundingFields.forEach(field => {
      if (analysis.funding_details[field.key]) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        yPosition = addWrappedText(`${field.label}:`, margin, yPosition, contentWidth, 12, true);
        
        pdf.setFont('helvetica', 'normal');
        const value = field.format ? field.format(analysis.funding_details[field.key]) : analysis.funding_details[field.key];
        yPosition = addWrappedText(value, margin, yPosition, contentWidth) + 5;
      }
    });
  }

  // Risk Factors Section
  if (analysis.red_flags && Object.keys(analysis.red_flags).length > 0) {
    yPosition = addSectionHeader('RISK FACTORS', yPosition);
    
    Object.entries(analysis.red_flags).forEach(([category, flags]) => {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(220, 38, 38); // Red color for risk categories
      yPosition = addWrappedText(`${category.toUpperCase()} RISKS:`, margin, yPosition, contentWidth, 12, true);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      
      if (Array.isArray(flags)) {
        flags.forEach(flag => {
          yPosition = addWrappedText(`• ${flag}`, margin + 10, yPosition, contentWidth - 10);
        });
      } else {
        yPosition = addWrappedText(`• ${flags}`, margin + 10, yPosition, contentWidth - 10);
      }
      yPosition += 5;
    });
  }

  // Investment Recommendation Section
  if (analysis.investment_recommendation) {
    yPosition = addSectionHeader('INVESTMENT RECOMMENDATION', yPosition);
    yPosition = addWrappedText(analysis.investment_recommendation, margin, yPosition, contentWidth);
  }

  // Footer on last page
  const totalPages = (pdf as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 30, pageHeight - 10);
    pdf.text('Smart AI Investor - Investment Analysis Report', margin, pageHeight - 10);
  }

  // Save the PDF
  const fileName = `${analysis.startup_name?.replace(/[^a-zA-Z0-9]/g, '_') || 'startup_analysis'}_report_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};