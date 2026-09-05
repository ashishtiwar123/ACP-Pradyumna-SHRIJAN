import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, AlertTriangle, CheckCircle2, TrendingUp, Users, Target } from "lucide-react";
import { toast } from "sonner";

const AnalysisDashboard = () => {
  const handleExport = (format: string) => {
    toast.success(`Exporting as ${format.toUpperCase()}...`);
  };

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
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                Analysis Dashboard
              </h1>
              <p className="text-muted-foreground">AI-Generated Insights for Your Pitch Deck</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleExport("pdf")} variant="secondary">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button onClick={() => handleExport("ppt")} className="bg-gradient-primary">
                <Download className="mr-2 h-4 w-4" />
                Export PPT
              </Button>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <Card className="mb-8 bg-card border-border animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">Executive Summary</CardTitle>
            <CardDescription>One-page investor memo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground/90 leading-relaxed">
                <strong className="text-primary">TechStartup Inc.</strong> is a B2B SaaS platform addressing workflow automation 
                for mid-market enterprises. The company demonstrates strong product-market fit with 15 design partners 
                and $200K ARR in early traction.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                The founding team brings 20+ years of combined experience from Google and McKinsey. Target market 
                shows $12B TAM with 23% CAGR. Revenue model is subscription-based with clear path to $10M ARR in 36 months.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 not-prose">
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm mb-1">Overall Score</div>
                  <div className="text-3xl font-bold text-success">8.2/10</div>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm mb-1">Investment Readiness</div>
                  <div className="text-3xl font-bold text-primary">High</div>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="text-muted-foreground text-sm mb-1">Red Flags</div>
                  <div className="text-3xl font-bold text-warning">3</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Detailed Analysis */}
        <Tabs defaultValue="insights" className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="insights">Slide Insights</TabsTrigger>
            <TabsTrigger value="redflags">Red Flags</TabsTrigger>
            <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          </TabsList>

          {/* Slide Insights */}
          <TabsContent value="insights" className="space-y-4">
            {insights.map((insight, index) => (
              <Card key={index} className="bg-card border-border hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        insight.score >= 8 ? 'bg-success/20 text-success' :
                        insight.score >= 6 ? 'bg-warning/20 text-warning' :
                        'bg-destructive/20 text-destructive'
                      }`}>
                        <span className="font-bold">{insight.score}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{insight.slide}</h3>
                        <Badge variant={insight.score >= 8 ? "default" : "secondary"} className="mt-1">
                          {insight.score >= 8 ? 'Strong' : insight.score >= 6 ? 'Good' : 'Needs Work'}
                        </Badge>
                      </div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <p className="text-muted-foreground">{insight.feedback}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Red Flags */}
          <TabsContent value="redflags" className="space-y-4">
            {redFlags.map((flag, index) => (
              <Card 
                key={index} 
                className={`bg-card border-l-4 ${
                  flag.severity === 'high' ? 'border-l-destructive shadow-glow-warning' :
                  flag.severity === 'medium' ? 'border-l-warning' :
                  'border-l-muted'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className={`h-6 w-6 mt-1 ${
                      flag.severity === 'high' ? 'text-destructive' :
                      flag.severity === 'medium' ? 'text-warning' :
                      'text-muted-foreground'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{flag.title}</h3>
                        <Badge variant={flag.severity === 'high' ? 'destructive' : 'secondary'}>
                          {flag.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{flag.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Key Metrics */}
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Team Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Team Size</span>
                      <span className="font-semibold">5 members</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Combined Experience</span>
                      <span className="font-semibold">20+ years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Technical Founders</span>
                      <span className="font-semibold text-success">3/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Market Opportunity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">TAM</span>
                      <span className="font-semibold">$12B</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Market Growth</span>
                      <span className="font-semibold text-success">23% CAGR</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Competitors Identified</span>
                      <span className="font-semibold">8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Traction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Current ARR</span>
                      <span className="font-semibold">$200K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Design Partners</span>
                      <span className="font-semibold text-success">15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">MoM Growth</span>
                      <span className="font-semibold text-success">18%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Fundraising
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Round Size</span>
                      <span className="font-semibold">$3M Seed</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Use of Funds</span>
                      <span className="font-semibold">Clear</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Runway</span>
                      <span className="font-semibold text-success">18 months</span>
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
