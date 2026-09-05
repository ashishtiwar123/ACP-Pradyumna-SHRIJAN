import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Loader2, Brain } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const UploadPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [startupName, setStartupName] = useState("");
  const [description, setDescription] = useState("");
  const [pitchText, setPitchText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf" || selectedFile.type.includes("presentation")) {
        setFile(selectedFile);
        toast.success("File uploaded successfully!");
      } else {
        toast.error("Please upload a PDF or PowerPoint file");
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
      if (droppedFile.type === "application/pdf" || droppedFile.type.includes("presentation")) {
        setFile(droppedFile);
        toast.success("File uploaded successfully!");
      } else {
        toast.error("Please upload a PDF or PowerPoint file");
      }
    }
  };

  const handleAnalyze = async () => {
    if (!startupName && !pitchText && !description) {
      toast.error("Please provide startup name, pitch details, or description");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to analyze");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Prepare startup input for analysis
      const startupInput = `
Startup Name: ${startupName || 'Not provided'}
Description: ${description || 'Not provided'}
Pitch Details: ${pitchText || 'Not provided'}
${file ? `Attached File: ${file.name}` : ''}
      `.trim();

      console.log('Sending analysis request...');

      // Call the Gemini analysis edge function
      const { data, error } = await supabase.functions.invoke('analyze-startup', {
        body: {
          startupInput,
          userId: user.id,
          uploadId: null,
        }
      });

      if (error) {
        console.error('Analysis error:', error);
        throw error;
      }

      console.log('Analysis completed:', data);

      toast.success("AI Analysis complete! Redirecting to results...");
      
      // Navigate to analysis results page
      setTimeout(() => {
        navigate("/analysis");
      }, 1500);

    } catch (error) {
      console.error('Error during analysis:', error);
      toast.error("Failed to analyze startup. Please try again.");
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
            <CardTitle>Upload Pitch Deck</CardTitle>
            <CardDescription>
              Supported formats: PDF, PowerPoint (PPT, PPTX)
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
                accept=".pdf,.ppt,.pptx"
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

            {/* Startup Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startup-name">Startup Name *</Label>
                <Input
                  id="startup-name"
                  placeholder="Enter your startup name"
                  value={startupName}
                  onChange={(e) => setStartupName(e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pitch-text">Pitch Details *</Label>
                <Textarea
                  id="pitch-text"
                  placeholder="Describe your startup idea, problem you're solving, target market, business model, etc."
                  value={pitchText}
                  onChange={(e) => setPitchText(e.target.value)}
                  className="bg-background border-border min-h-[150px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Information (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Any additional context or information"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-background border-border min-h-[100px]"
                />
              </div>
            </div>

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!startupName && !pitchText)}
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
                  Analyzing with Gemini AI...
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                  Evaluating market & competitors...
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                  Generating insights and recommendations...
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
