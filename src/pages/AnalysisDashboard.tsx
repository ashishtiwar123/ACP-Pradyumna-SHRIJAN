import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, AlertTriangle, CheckCircle2, TrendingUp, Users, Target, ArrowLeft, Loader2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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

const AnalysisDashboard = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!analysisId || analysisId.startsWith('default-demo')) {
      // Load default data for demo purposes
      loadDefaultAnalysisData();
    } else {
      fetchAnalysisData();
    }
  }, [user, analysisId, navigate]);

  const loadDefaultAnalysisData = () => {
    // Try to get from session storage first
    const sessionData = sessionStorage.getItem('latest_analysis');
    if (sessionData) {
      try {
        const data = JSON.parse(sessionData);
        // Check for analysis_results in the expected structure
        const analysisResults = data.expected_outputs?.result?.analysis_results || data.result?.analysis_results || data.analysis_results;
        if (analysisResults) {
          // Process the session data similar to API data
          const processedData = {
            ...analysisResults,
            business_overview: typeof analysisResults.business_overview === 'string' ? JSON.parse(analysisResults.business_overview) : analysisResults.business_overview,
            funding_details: typeof analysisResults.funding_details === 'string' ? JSON.parse(analysisResults.funding_details) : analysisResults.funding_details,
            market_analysis: typeof analysisResults.market_analysis === 'string' ? JSON.parse(analysisResults.market_analysis) : analysisResults.market_analysis,
            slide_insights: typeof analysisResults.slide_insights === 'string' ? JSON.parse(analysisResults.slide_insights) : analysisResults.slide_insights,
            red_flags: typeof analysisResults.red_flags === 'string' ? JSON.parse(analysisResults.red_flags) : analysisResults.red_flags,
            key_metrics: typeof analysisResults.key_metrics === 'string' ? JSON.parse(analysisResults.key_metrics) : analysisResults.key_metrics,
            // Ensure numeric fields have safe defaults
            overall_score: analysisResults.overall_score || 0,
            financial_health_score: analysisResults.financial_health_score || 0,
            growth_potential_score: analysisResults.growth_potential_score || 0,
            risk_assessment_score: analysisResults.risk_assessment_score || 0,
            current_revenue: typeof analysisResults.current_revenue === 'string' ? parseInt(analysisResults.current_revenue) || 0 : analysisResults.current_revenue || 0,
            monthly_burn: typeof analysisResults.monthly_burn === 'string' ? parseInt(analysisResults.monthly_burn) || 0 : analysisResults.monthly_burn || 0,
            runway_months: analysisResults.runway_months || 0,
            team_size: analysisResults.team_size || 0,
            funding_ask: typeof analysisResults.funding_ask === 'string' ? parseInt(analysisResults.funding_ask) || 0 : analysisResults.funding_ask || 0,
            funding_probability_score: analysisResults.funding_probability_score || 0,
          };
          setAnalysis(processedData);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error parsing session data:', error);
      }
    }

    // If no session data, create default data based on analysisId
    const defaultData = getDefaultDataById(analysisId);
    setAnalysis(defaultData);
    setLoading(false);
  };

  const getDefaultDataById = (id: string) => {
    const baseData = {
      id: id || 'default-demo',
      startup_name: 'TechStartup Inc. (Demo)',
      executive_summary: 'This is demo data to showcase the investor analysis dashboard. TechStartup Inc. is a B2B SaaS platform addressing workflow automation for mid-market enterprises.',
      overall_score: 82,
      financial_health_score: 75,
      growth_potential_score: 88,
      risk_assessment_score: 79,
      current_revenue: 200000,
      monthly_burn: 15000,
      runway_months: 18,
      team_size: 8,
      funding_ask: 2000000,
      funding_probability_score: 68,
      business_overview: {
        company: 'TechStartup Inc.',
        industry: 'fintech',
        stage: 'seed',
        founded: 2023,
        description: 'B2B SaaS workflow automation platform'
      },
      funding_details: {
        funding_ask: 2000000,
        use_of_funds: 'Product development, team expansion, and market penetration',
        funding_probability: 68,
        runway_extension: 24,
        previous_funding: 500000
      },
      market_analysis: {
        tam: 12000000000,
        sam: 1200000000,
        som: 120000000,
        growth_rate: 23,
        market_maturity: 'growing',
        competitive_landscape: 'moderate competition with clear differentiation opportunities'
      },
      investment_recommendation: 'Strong investment opportunity with solid fundamentals. The team has relevant experience and the market timing is favorable. Recommend proceeding with due diligence.',
      slide_insights: {
        problemSolution: 'Well-articulated problem with compelling solution',
        marketSize: 'Large addressable market with clear growth trajectory',
        businessModel: 'Recurring revenue model with good unit economics'
      },
      red_flags: {
        competition: 'Several established players in the market',
        execution: 'Limited go-to-market experience in the team'
      }
    };

    // Customize data based on different demo IDs
    if (id === 'default-demo-2') {
      return {
        ...baseData,
        id: 'default-demo-2',
        startup_name: 'FinanceFlow AI (Demo)',
        overall_score: 75,
        financial_health_score: 70,
        growth_potential_score: 80,
        risk_assessment_score: 75,
        current_revenue: 150000,
        monthly_burn: 12000,
        executive_summary: 'FinanceFlow AI is disrupting financial planning with AI-powered insights for SMBs.',
        business_overview: {
          ...baseData.business_overview,
          company: 'FinanceFlow AI',
          industry: 'fintech',
          stage: 'pre-seed'
        }
      };
    }

    if (id === 'default-demo-3') {
      return {
        ...baseData,
        id: 'default-demo-3',
        startup_name: 'GreenTech Solutions (Demo)',
        overall_score: 68,
        financial_health_score: 65,
        growth_potential_score: 72,
        risk_assessment_score: 68,
        current_revenue: 100000,
        monthly_burn: 8000,
        executive_summary: 'GreenTech Solutions provides sustainable energy solutions for residential markets.',
        business_overview: {
          ...baseData.business_overview,
          company: 'GreenTech Solutions',
          industry: 'cleantech',
          stage: 'pre-seed'
        }
      };
    }

    return baseData;
  };

  const fetchAnalysisData = async () => {
    try {
      const { data, error } = await supabase
        .from("analysis_results")
        .select("*")
        .eq("id", analysisId)
        .eq("user_id", user!.id)
        .single();

      if (error) throw error;
      
      // Parse JSON strings if they exist
      const processedData = {
        ...data,
        business_overview: data.business_overview ? (typeof data.business_overview === 'string' ? JSON.parse(data.business_overview) : data.business_overview) : null,
        funding_details: data.funding_details ? (typeof data.funding_details === 'string' ? JSON.parse(data.funding_details) : data.funding_details) : null,
        market_analysis: data.market_analysis ? (typeof data.market_analysis === 'string' ? JSON.parse(data.market_analysis) : data.market_analysis) : null,
        slide_insights: data.slide_insights ? (typeof data.slide_insights === 'string' ? JSON.parse(data.slide_insights) : data.slide_insights) : null,
        red_flags: data.red_flags ? (typeof data.red_flags === 'string' ? JSON.parse(data.red_flags) : data.red_flags) : null,
        key_metrics: data.key_metrics ? (typeof data.key_metrics === 'string' ? JSON.parse(data.key_metrics) : data.key_metrics) : null,
        // Ensure numeric fields have safe defaults
        overall_score: data.overall_score || 0,
        financial_health_score: data.financial_health_score || 0,
        growth_potential_score: data.growth_potential_score || 0,
        risk_assessment_score: data.risk_assessment_score || 0,
        current_revenue: typeof data.current_revenue === 'string' ? parseInt(data.current_revenue) || 0 : data.current_revenue || 0,
        monthly_burn: typeof data.monthly_burn === 'string' ? parseInt(data.monthly_burn) || 0 : data.monthly_burn || 0,
        runway_months: data.runway_months || 0,
        team_size: data.team_size || 0,
        funding_ask: typeof data.funding_ask === 'string' ? parseInt(data.funding_ask) || 0 : data.funding_ask || 0,
        funding_probability_score: data.funding_probability_score || 0,
      };
      
      setAnalysis(processedData);
    } catch (error) {
      console.error("Error fetching analysis:", error);
      toast.error("Failed to load analysis results");
      navigate("/analysis");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: string) => {
    toast.success(`Exporting as ${format.toUpperCase()}...`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Analysis Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The requested analysis could not be found.
          </p>
          <Button onClick={() => navigate("/analysis")}>
            Back to Analysis History
          </Button>
        </Card>
      </div>
    );
  }

  const redFlags = [
    {
      severity: "high",
      title: "Missing Competition Analysis",
      description: "No dedicated slide addressing competitive landscape. Investors expect clear differentiation.",
    },
    {
      severity: "medium",
      title: "Vague Revenue Model",
      description: "Revenue projections lack detailed breakdown. Consider adding unit economics.",
    },
    {
      severity: "low",
      title: "Limited Team Information",
      description: "Brief team intro. Consider highlighting relevant industry experience.",
    },
  ];

  const insights = [
    {
      slide: "Problem Statement",
      score: 9,
      feedback: "Strong articulation of customer pain points with compelling market data.",
    },
    {
      slide: "Solution",
      score: 8,
      feedback: "Clear value proposition. Consider adding more technical differentiation.",
    },
    {
      slide: "Market Opportunity",
      score: 7,
      feedback: "Good TAM/SAM/SOM breakdown. Include growth rate projections.",
    },
    {
      slide: "Business Model",
      score: 6,
      feedback: "Revenue streams identified but need more detailed unit economics.",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/analysis")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {analysis.startup_name || 'Startup Analysis'}
                  </h1>
                  {(analysisId?.startsWith('default-demo') || sessionStorage.getItem('is_default_data') === 'true') && (
                    <Badge variant="outline" className="hidden md:block text-xs">
                      Demo Data
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">Investment Analysis Dashboard</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleExport("pdf")} variant="secondary">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <div className="flex gap-2">
                
                <Button onClick={() => navigate("/upload")} className="bg-gradient-primary">
                  New Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Score Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
              <div className="text-4xl font-bold text-primary mb-2">
                {analysis.overall_score || 0}/100
              </div>
              <p className="text-sm text-muted-foreground">Investment readiness</p>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Financial Health</h3>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {analysis.financial_health_score || 0}/100
              </div>
              <p className="text-sm text-muted-foreground">Revenue & burn rate</p>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Growth Potential</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {analysis.growth_potential_score || 0}/100
              </div>
              <p className="text-sm text-muted-foreground">Market opportunity</p>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {analysis.risk_assessment_score || 0}/100
              </div>
              <p className="text-sm text-muted-foreground">Risk mitigation</p>
            </div>
          </Card>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-semibold">Current Revenue</h3>
                <div className="text-2xl font-bold">
                  ${analysis.current_revenue ? (analysis.current_revenue / 1000).toFixed(0) + 'K' : '0'}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Annual recurring revenue</p>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-8 h-8 text-red-500" />
              <div>
                <h3 className="font-semibold">Monthly Burn</h3>
                <div className="text-2xl font-bold">
                  ${analysis.monthly_burn ? (analysis.monthly_burn / 1000).toFixed(0) + 'K' : '0'}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Operating expenses</p>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">Runway</h3>
                <div className="text-2xl font-bold">
                  {analysis.runway_months || 0} mo
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Months until cash depletion</p>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="font-semibold">Team Size</h3>
                <div className="text-2xl font-bold">
                  {analysis.team_size || 0}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Total team members</p>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Business Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Business Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Company</h4>
                  <p className="text-muted-foreground">{analysis.startup_name || 'Startup Name'}</p>
                </div>
                {analysis.business_overview?.problem && (
                  <div>
                    <h4 className="font-semibold mb-2">Problem</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{analysis.business_overview.problem}</p>
                  </div>
                )}
                {analysis.business_overview?.solution && (
                  <div>
                    <h4 className="font-semibold mb-2">Solution</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{analysis.business_overview.solution}</p>
                  </div>
                )}
                {analysis.business_overview?.business_model && (
                  <div>
                    <h4 className="font-semibold mb-2">Business Model</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{analysis.business_overview.business_model}</p>
                  </div>
                )}
                {analysis.business_overview?.traction && (
                  <div>
                    <h4 className="font-semibold mb-2">Traction</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{analysis.business_overview.traction}</p>
                  </div>
                )}
                {analysis.executive_summary && (
                  <div>
                    <h4 className="font-semibold mb-2">Executive Summary</h4>
                    <p className="text-muted-foreground leading-relaxed">{analysis.executive_summary}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Funding Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Funding Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">Funding Ask</h4>
                  <p className="text-2xl font-bold text-primary">
                    ${analysis.funding_ask ? (analysis.funding_ask / 1000000).toFixed(1) + 'M' : '0'}
                  </p>
                </div>
                {analysis.funding_details?.funding_stage && (
                  <div>
                    <h4 className="font-semibold mb-1">Funding Stage</h4>
                    <Badge variant="outline" className="capitalize">{analysis.funding_details.funding_stage}</Badge>
                  </div>
                )}
                {analysis.funding_details?.funding_raised && (
                  <div>
                    <h4 className="font-semibold mb-1">Previous Funding</h4>
                    <p className="text-sm text-muted-foreground">
                      ${(analysis.funding_details.funding_raised / 1000).toFixed(0)}K raised
                    </p>
                  </div>
                )}
                {analysis.funding_details?.use_of_funds && (
                  <div>
                    <h4 className="font-semibold mb-1">Use of Funds</h4>
                    <p className="text-sm text-muted-foreground">{analysis.funding_details.use_of_funds}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold mb-1">Funding Probability</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${analysis.funding_probability_score || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{analysis.funding_probability_score || 0}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Recommendation */}
        {analysis.investment_recommendation && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Investment Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {analysis.investment_recommendation}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tabs for Detailed Analysis */}
        <Tabs defaultValue="insights" className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="insights">Market Analysis</TabsTrigger>
            <TabsTrigger value="redflags">Risk Factors</TabsTrigger>
            <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
          </TabsList>

          {/* Market Analysis */}
          <TabsContent value="insights" className="space-y-4">
            {analysis.market_analysis ? (
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Market Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysis.market_analysis.market_size_estimate && (
                      <div>
                        <h4 className="font-semibold mb-2">Market Size</h4>
                        <div className="text-lg font-bold text-primary mb-1">
                          {analysis.market_analysis.market_size_estimate}
                        </div>
                        <p className="text-sm text-muted-foreground">Total addressable market</p>
                      </div>
                    )}
                    {analysis.market_analysis.market_trends && (
                      <div>
                        <h4 className="font-semibold mb-2">Market Trends</h4>
                        <div className="text-sm text-muted-foreground mb-1">
                          {analysis.market_analysis.market_trends}
                        </div>
                      </div>
                    )}
                    {analysis.market_analysis.target_market && (
                      <div className="md:col-span-2">
                        <h4 className="font-semibold mb-2">Target Market</h4>
                        <p className="text-muted-foreground">{analysis.market_analysis.target_market}</p>
                      </div>
                    )}
                    {analysis.market_analysis.competitive_edge && (
                      <div className="md:col-span-2">
                        <h4 className="font-semibold mb-2">Competitive Edge</h4>
                        <p className="text-muted-foreground">{analysis.market_analysis.competitive_edge}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No market analysis data available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Risk Factors */}
          <TabsContent value="redflags" className="space-y-4">
            {analysis.red_flags && Object.keys(analysis.red_flags).length > 0 ? (
              Object.entries(analysis.red_flags).map(([category, flags], categoryIndex) => (
                <Card 
                  key={categoryIndex} 
                  className="bg-card border-l-4 border-l-destructive"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <AlertTriangle className="h-6 w-6 mt-1 text-destructive" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="font-semibold text-lg capitalize">{category} Risks</h3>
                          <Badge variant="destructive">
                            {category.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {Array.isArray(flags) ? (
                            flags.map((flag, flagIndex) => (
                              <div key={flagIndex} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
                                <p className="text-muted-foreground text-sm">{flag}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground text-sm">{flags as string}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <h3 className="font-semibold text-lg mb-2">No Major Risk Factors Identified</h3>
                  <p className="text-muted-foreground">This analysis shows relatively low risk indicators</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Detailed Metrics */}
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Financial Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Current Revenue</span>
                      <span className="font-semibold">
                        ${analysis.current_revenue ? (analysis.current_revenue / 1000).toFixed(0) + 'K' : '0'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Monthly Burn</span>
                      <span className="font-semibold text-red-500">
                        ${analysis.monthly_burn ? (analysis.monthly_burn / 1000).toFixed(0) + 'K' : '0'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Runway</span>
                      <span className="font-semibold">
                        {analysis.runway_months || 0} months
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Team & Operations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Team Size</span>
                      <span className="font-semibold">{analysis.team_size || 0} members</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Burn per Employee</span>
                      <span className="font-semibold">
                        ${analysis.monthly_burn && analysis.team_size && analysis.team_size > 0 ? 
                          ((analysis.monthly_burn / analysis.team_size) / 1000).toFixed(1) + 'K' : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Revenue per Employee</span>
                      <span className="font-semibold text-green-600">
                        ${analysis.current_revenue && analysis.team_size && analysis.team_size > 0 ? 
                          ((analysis.current_revenue / analysis.team_size) / 1000).toFixed(0) + 'K' : 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Investment Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Funding Ask</span>
                      <span className="font-semibold">
                        ${analysis.funding_ask ? (analysis.funding_ask / 1000000).toFixed(1) + 'M' : '0'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Funding Probability</span>
                      <span className="font-semibold text-primary">
                        {analysis.funding_probability_score || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Valuation Multiple</span>
                      <span className="font-semibold">
                        {analysis.funding_ask && analysis.current_revenue && analysis.current_revenue > 0 ? 
                          (analysis.funding_ask / analysis.current_revenue).toFixed(1) + 'x' : 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Growth Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Growth Potential</span>
                      <span className="font-semibold text-blue-600">
                        {analysis.growth_potential_score || 0}/100
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Market Position</span>
                      <span className="font-semibold">
                        {analysis.growth_potential_score >= 80 ? 'Leader' :
                         analysis.growth_potential_score >= 60 ? 'Challenger' : 'Follower'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Risk Level</span>
                      <span className={`font-semibold ${
                        analysis.risk_assessment_score >= 80 ? 'text-green-600' :
                        analysis.risk_assessment_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {analysis.risk_assessment_score >= 80 ? 'Low' :
                         analysis.risk_assessment_score >= 60 ? 'Medium' : 'High'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
