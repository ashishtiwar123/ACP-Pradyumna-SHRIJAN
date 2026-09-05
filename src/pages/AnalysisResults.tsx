import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, TrendingUp, FileText, Calendar, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AnalysisHistoryItem {
  id: string;
  created_at: string;
  startup_name: string;
  overall_score: number;
  file_name: string;
  status: string;
  analysis_result_id: string;
}

const AnalysisResults = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchAnalysisHistory();
  }, [user]);

  const fetchAnalysisHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("analysis_logs")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // If no data found, check if we should show default data
      if (!data || data.length === 0) {
        const shouldShowDefault = sessionStorage.getItem('is_default_data') === 'true';
        if (shouldShowDefault) {
          const defaultHistory: AnalysisHistoryItem[] = [
            {
              id: 'default-1',
              created_at: new Date().toISOString(),
              startup_name: 'TechStartup Inc. (Demo)',
              overall_score: 82,
              file_name: 'demo_pitch_deck.pdf',
              status: 'completed',
              analysis_result_id: 'default-demo'
            },
            {
              id: 'default-2',
              created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              startup_name: 'FinanceFlow AI (Demo)',
              overall_score: 75,
              file_name: 'financeflow_presentation.pptx',
              status: 'completed',
              analysis_result_id: 'default-demo-2'
            },
            {
              id: 'default-3',
              created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
              startup_name: 'GreenTech Solutions (Demo)',
              overall_score: 68,
              file_name: 'greentech_deck.pdf',
              status: 'completed',
              analysis_result_id: 'default-demo-3'
            }
          ];
          setAnalysisHistory(defaultHistory);
          return;
        }
      }

      setAnalysisHistory(data as any[]);
    } catch (error) {
      console.error("Error fetching analysis history:", error);
      toast.error("Failed to load analysis history");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysisClick = (analysisId: string) => {
    navigate(`/analysis-dashboard/${analysisId}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Analysis History
            </h1>
            {sessionStorage.getItem('is_default_data') === 'true' && (
              <Badge variant="outline" className="text-xs">
                Demo Data
              </Badge>
            )}
          </div>
          <Button onClick={() => navigate("/upload")}>
            New Analysis
          </Button>
        </div>


        {/* Analysis History List */}
        {analysisHistory.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-4">No Analysis Found</h2>
            <p className="text-muted-foreground mb-6">
              You haven't analyzed any startups yet. Upload your first pitch deck to get started.
            </p>
            <Button onClick={() => navigate("/upload")}>
              Analyze Your First Startup
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {analysisHistory.map((item) => (
              <Card 
                key={item.id} 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleAnalysisClick(item.analysis_result_id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          {item.startup_name || 'Untitled Analysis'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(item.created_at).toLocaleDateString()}
                          </div>
                          {item.file_name && (
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {item.file_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {item.overall_score && (
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(item.overall_score)}`}>
                            {item.overall_score}
                          </div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                      )}
                      <Badge variant={item.overall_score ? getScoreBadge(item.overall_score) : "secondary"}>
                        {item.status === 'completed' ? 'Complete' : item.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;
