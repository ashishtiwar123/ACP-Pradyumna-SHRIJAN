import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

import Spline from '@splinetool/react-spline';
import { Brain, FileText, AlertTriangle, Zap, LineChart, MessageSquare } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const isFounder = profile?.role === 'founder';
  const isInvestor = profile?.role === 'investor';
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
      {/* Hero Section with Integrated 3D Model */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />

        {/* Floating Elements - Spread Across Hero Section */}
        <div className="pointer-events-none select-none">
          {/* Top Left */}
          <div className="absolute top-8 left-8 w-12 h-12 bg-gradient-primary rounded-full opacity-70 animate-bounce" style={{animationDelay: '0.2s'}} />
          {/* Top Right */}
          <div className="absolute top-16 right-16 w-8 h-8 bg-gradient-primary rounded-full opacity-60 animate-bounce" style={{animationDelay: '1.2s'}} />
          {/* Center Left */}
          <div className="absolute top-1/2 left-0 w-6 h-6 bg-gradient-primary rounded-full opacity-50 animate-bounce" style={{animationDelay: '2.1s'}} />
          {/* Center Right */}
          <div className="absolute top-1/3 right-0 w-10 h-10 bg-gradient-primary rounded-full opacity-60 animate-bounce" style={{animationDelay: '1.7s'}} />
          {/* Bottom Left */}
          <div className="absolute bottom-12 left-20 w-7 h-7 bg-gradient-primary rounded-full opacity-70 animate-bounce" style={{animationDelay: '0.8s'}} />
          {/* Bottom Right */}
          <div className="absolute bottom-8 right-8 w-9 h-9 bg-gradient-primary rounded-full opacity-80 animate-bounce" style={{animationDelay: '2.5s'}} />
        </div>

        {/* Main Content Container */}
        <div className=" relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="animate-fade-in space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  AI-Powered
                </span>
                <br />
                <span className="text-foreground">
                  Startup Analyst
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                Transform pitch decks into investor-ready memos with AI-driven insights, red flag detection, and instant feedback.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 text-lg px-8 py-6 group"
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                  } else if (isInvestor) {
                    navigate('/upload');
                  } else if (isFounder) {
                    navigate('/dashboard');
                  }
                }}
              >
                <span className="group-hover:scale-105 transition-transform">
                  {!user ? 'Get Started' : isInvestor ? 'Analyze Pitch Decks' : 'View Dashboard'}
                </span>
              </Button>
              {user && isInvestor && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 border-2 hover:bg-secondary/10"
                  onClick={() => navigate('/analysis')}
                >
                  View Analysis History
                </Button>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>AI-Powered Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>

          {/* Right Side - 3D Model */}
          <div className="relative lg:order-last order-first">
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[700px] w-full">
              {/* Glow Effect Background */}
              <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent rounded-full blur-3xl" />
              {/* 3D Model Container */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-card/50 to-background/30 backdrop-blur-sm">
                <Spline
                  scene="https://prod.spline.design/32qv2birAJW4tCjP/scene.splinecode"
                />
              </div>
              <div className="absolute w-2/5 h-10 bg-background right-0 bottom-5" />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gradient-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Powerful Features
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Everything you need to 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> perfect your pitch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our AI-powered platform provides comprehensive analysis and actionable insights to help you create investor-ready presentations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 animate-fade-in relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardContent className="relative p-8">
                {/* Icon */}
                <div className="mb-6 p-4 bg-gradient-primary rounded-xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Element */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">Ready to see these features in action?</p>
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300"
            onClick={() => {
              if (!user) {
                navigate('/login');
              } else if (isInvestor) {
                navigate('/upload');
              } else if (isFounder) {
                navigate('/dashboard');
              }
            }}
          >
            Try It Now
          </Button>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Card className="relative bg-gradient-to-br from-primary via-primary to-primary/80 border-0 overflow-hidden shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
          </div>
          
          {/* Floating Orbs */}
          <div className="absolute top-8 right-8 w-16 h-16 bg-white/10 rounded-full blur-sm animate-pulse" />
          <div className="absolute bottom-8 left-8 w-12 h-12 bg-white/10 rounded-full blur-sm animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white/10 rounded-full blur-sm animate-pulse" style={{animationDelay: '2s'}} />

          <CardContent className="relative p-12 lg:p-16 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm font-medium">
                <Brain className="w-4 h-4" />
                AI-Powered Platform
              </div>

              {/* Heading */}
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                Ready to Transform Your
                <br />
                <span className="text-white/90">Pitch Into Success?</span>
              </h2>

              {/* Description */}
              <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Join thousands of founders who've already improved their pitch decks with our AI-powered insights. Get started in minutes, no credit card required.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8">
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">1000+</div>
                  <div className="text-white/80">Pitch Decks Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">95%</div>
                  <div className="text-white/80">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">2min</div>
                  <div className="text-white/80">Average Analysis Time</div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg px-10 py-6 bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl group"
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                    } else if (isInvestor) {
                      navigate('/upload');
                    } else if (isFounder) {
                      navigate('/dashboard');
                    }
                  }}
                >
                  <span className="group-hover:scale-105 transition-transform">
                    Start Your Free Analysis
                  </span>
                </Button>
                
                <p className="text-white/70 text-sm mt-4">
                  No signup required for your first analysis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
