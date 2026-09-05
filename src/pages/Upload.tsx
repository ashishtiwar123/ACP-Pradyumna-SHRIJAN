import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2, Brain } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const UploadPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedTypes = [
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ];
      
      if (allowedTypes.includes(selectedFile.type) || selectedFile.type.includes("presentation")) {
        setFile(selectedFile);
        toast.success("File uploaded successfully!");
      } else {
        toast.error("Please upload a PDF, PowerPoint, or Excel file");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const allowedTypes = [
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ];
      
      if (allowedTypes.includes(droppedFile.type) || droppedFile.type.includes("presentation")) {
        setFile(droppedFile);
        toast.success("File uploaded successfully!");
      } else {
        toast.error("Please upload a PDF, PowerPoint, or Excel file");
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload a file to analyze");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to analyze");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      console.log('Sending file to local AI model...');

      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', user.id);

      // Call local Python AI model
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const analysisData = await response.json();
      console.log('Analysis completed:', analysisData);

      // TODO: Save analysis results to database after running migration
      // For now, just redirect to analysis dashboard
      toast.success("AI Analysis complete! Redirecting to dashboard...");
      
      // Navigate to analysis dashboard
      setTimeout(() => {
        navigate('/analysis-dashboard');
      }, 1500);

      // Store analysis data temporarily in session storage for development
      sessionStorage.setItem('latest_analysis', JSON.stringify(analysisData));

    } catch (error) {
      console.error('Error during analysis:', error);
      toast.error("Make sure the AI model is running. Redirecting to see demo results...");
      
      // Store default analysis data for demo purposes
      const defaultAnalysisData = {
        analysis_results: {
          id: 'default-demo',
          startup_name: 'TechStartup Inc. (Demo)',
          executive_summary: 'This is demo data to showcase the investor analysis dashboard. TechStartup Inc. is a B2B SaaS platform addressing workflow automation for mid-market enterprises. The company demonstrates strong product-market fit with early traction.',
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
        }
      };
      
      sessionStorage.setItem('latest_analysis', JSON.stringify(defaultAnalysisData));
      sessionStorage.setItem('is_default_data', 'true');
      
      // Navigate to analysis results after a short delay
      setTimeout(() => {
        navigate('/analysis');
      }, 2000);
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Analyze Your Pitch Deck
          </h1>
          <p className="text-xl text-muted-foreground">
            Upload your deck and get AI-powered insights in minutes
          </p>
        </div>

        <Card className="bg-card border-border animate-slide-up">
          <CardHeader>
            <CardTitle>Upload Your Pitch Deck</CardTitle>
            <CardDescription>
              Supported formats: PDF, PowerPoint (PPT, PPTX), Excel (XLS, XLSX)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer"
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.ppt,.pptx,.xls,.xlsx"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="h-12 w-12 text-success" />
                    <p className="text-lg font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <p className="text-lg font-medium">
                      Drag and drop your file here, or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Maximum file size: 20MB
                    </p>
                  </div>
                )}
              </label>
            </div>



            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !file}
              className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 text-lg py-6"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Your Startup...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-5 w-5" />
                  Analyze with AI
                </>
              )}
            </Button>

            {isAnalyzing && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                  Processing your pitch deck...
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                  Analyzing market & financials...
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                  Generating investor insights...
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadPage;
