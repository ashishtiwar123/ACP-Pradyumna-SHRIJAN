import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Loader2, Brain } from "lucide-react";
import { toast } from "sonner";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [startupName, setStartupName] = useState("");
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

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
    if (!file || !startupName) {
      toast.error("Please provide both a file and startup name");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("Analysis complete!");
      navigate("/dashboard");
    }, 3000);
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
                <Label htmlFor="description">Brief Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about your startup in a few sentences..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-background border-border min-h-[100px]"
                />
              </div>
            </div>

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={!file || !startupName || isAnalyzing}
              className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 text-lg py-6"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Your Deck...
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
                  Extracting text from slides...
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                  Running AI analysis...
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                  Generating insights and red flags...
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
