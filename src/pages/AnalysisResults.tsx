import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, TrendingUp, AlertTriangle, Target, Users, DollarSign, Lightbulb, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AnalysisData {
  id: string;
  created_at: string;
  slide_insights: Record<string, any>;
  red_flags: Record<string, any> | null;
  overall_score: number;
  executive_summary: string;
}

const AnalysisResults = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchLatestAnalysis();
  }, [user]);

  const fetchLatestAnalysis = async () => {
    try {
      const { data, error } = await supabase
        .from("analysis_results")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      setAnalysis(data as AnalysisData);
    } catch (error) {
      console.error("Error fetching analysis:", error);
      toast.error("Failed to load analysis results");
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-2xl font-bold mb-4">No Analysis Found</h2>
          <p className="text-muted-foreground mb-6">
            You haven't analyzed any startups yet.
          </p>
          <Button onClick={() => navigate("/upload")}>
            Analyze Startup
          </Button>
        </Card>
      </div>
    );
  }

  const insights = analysis.slide_insights || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button onClick={() => navigate("/upload")}>
            New Analysis
          </Button>
        </div>

        {/* Overall Score Card */}
        <Card className="p-8 text-center bg-gradient-to-br from-primary/10 to-secondary/10">
          <h1 className="text-4xl font-bold mb-2">Overall Score</h1>
          <div className="text-6xl font-bold text-primary my-4">
            {analysis.overall_score}/10
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {analysis.executive_summary}
          </p>
        </Card>

        {/* Problem & Solution */}
        {insights.problemSolution && (
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Target className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3">Problem & Solution</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{insights.problemSolution}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Market & Competitors */}
        {insights.marketCompetitors && (
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3">Market & Competitors</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{insights.marketCompetitors}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Business Model */}
        {insights.businessModel && (
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <DollarSign className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3">Business Model</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{insights.businessModel}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Team Strength */}
        {insights.teamStrength && (
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Users className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3">Team Strength</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{insights.teamStrength}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Funding Readiness */}
        {insights.fundingReadiness && (
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3">Funding Readiness</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{insights.fundingReadiness}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Risks & Red Flags */}
        {insights.risksRedFlags && (
          <Card className="p-6 border-destructive/50">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-destructive flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3 text-destructive">Risks & Red Flags</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{insights.risksRedFlags}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Growth Opportunities */}
        {insights.growthOpportunities && (
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Lightbulb className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3">Growth Opportunities</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{insights.growthOpportunities}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Growth Recommendation */}
        {insights.growthRecommendation && (
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3">Growth Recommendations</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{insights.growthRecommendation}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Overall Assessment */}
        {insights.overallAssessment && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-3">Overall Assessment</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{insights.overallAssessment}</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;
