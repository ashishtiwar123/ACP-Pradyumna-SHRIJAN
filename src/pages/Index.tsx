import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, FileText, AlertTriangle, Zap, LineChart, MessageSquare } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced AI analyzes your pitch deck to extract key insights and generate comprehensive investor memos.",
    },
    {
      icon: FileText,
      title: "Instant Summaries",
      description: "Get a one-page executive summary with slide-by-slide breakdown in seconds.",
    },
    {
      icon: AlertTriangle,
      title: "Red Flag Detection",
      description: "Automatically identify missing sections, weak arguments, and potential investor concerns.",
    },
    {
      icon: Zap,
      title: "Real-Time Feedback",
      description: "Receive instant actionable recommendations to strengthen your pitch.",
    },
    {
      icon: LineChart,
      title: "Market Insights",
      description: "Visualize team composition, competitive landscape, and market opportunity analysis.",
    },
    {
      icon: MessageSquare,
      title: "Interactive Q&A",
      description: "Chat with AI about your startup to get detailed answers and clarifications.",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-accent opacity-50" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              AI-Powered Startup Analyst
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Transform pitch decks into investor-ready memos with AI-driven insights, red flag detection, and instant feedback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 text-lg px-8 py-6"
                onClick={() => navigate(user ? '/upload' : '/auth')}
              >
                {user ? 'Analyze Your Deck' : 'Get Started'}
              </Button>
              {user && (
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg px-8 py-6"
                  onClick={() => navigate('/dashboard')}
                >
                  View Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl font-bold mb-4">Powerful Features for Founders</h2>
          <p className="text-xl text-muted-foreground">Everything you need to perfect your pitch</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-glow-primary animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="mb-4 p-3 bg-gradient-primary rounded-lg w-fit">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Card className="bg-gradient-primary border-0 overflow-hidden">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4 text-primary-foreground">
              Ready to Impress Investors?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Upload your pitch deck and get AI-powered insights in minutes. No credit card required.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 py-6 animate-glow"
              onClick={() => navigate(user ? '/upload' : '/auth')}
            >
              Get Started Now
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
