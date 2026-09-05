import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { cn } from '../lib/utils';
import { 
  Brain, 
  RefreshCw, 
  Calendar,
  BarChart3,
  Target,
  Wallet,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Menu,
  Home,
  Activity
} from 'lucide-react';

// Import all dashboard components
import { SummaryCards } from '../components/DashboardComponents/SummaryCards';
import { AIInsights } from '../components/DashboardComponents/AIInsights';
import { DomainSpecificInsights } from '../components/DashboardComponents/DomainSpecificInsights';
import { FounderAssetsVisualization } from '../components/DashboardComponents/FounderAssetsVisualization';
import { 
  DashboardSkeleton, 
  LoadingStates, 
  ErrorStates, 
  EmptyStates,
  DashboardErrorBoundary 
} from '../components/DashboardComponents/LoadingStates';

// Import services
import { DataFetchingService, DashboardData } from '../lib/data-fetching';
import { DashboardCacheService } from '../lib/dashboard-cache';
import { geminiService, AIAnalysisResult } from '../lib/gemini-api';

type DashboardState = 'loading' | 'analyzing' | 'ready' | 'error' | 'empty';
type ActiveView = 'overview' | 'insights' | 'domain' | 'assets';

interface DashboardError {
  type: 'data' | 'ai' | 'network' | 'profile';
  message: string;
  error?: Error;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [state, setState] = useState<DashboardState>('loading');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<DashboardError | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize dashboard
  useEffect(() => {
    if (user?.id) {
      initializeDashboard();
    }
  }, [user?.id]);

  const initializeDashboard = async () => {
    try {
      setState('loading');
      setError(null);

      console.log('🚀 Initializing dashboard for user:', user?.id);

      // Check for cached data first
      const cachedData = DashboardCacheService.getDashboardData(user!.id);
      
      if (cachedData) {
        console.log('📦 Using cached dashboard data');
        setDashboardData(cachedData.rawData as DashboardData);
        setAnalysisResult(cachedData.analysisResult);
        setLastAnalyzed(cachedData.createdAt);
        setState('ready');
        return;
      }

      // Fetch fresh data
      console.log('🔄 Fetching fresh dashboard data');
      const freshData = await DataFetchingService.fetchDashboardData(user!.id);
      setDashboardData(freshData);

      // Check if profile is complete enough for analysis
      const completeness = await DataFetchingService.checkProfileCompleteness(user!.id);
      
      if (completeness.completionPercentage < 60) {
        setError({
          type: 'profile',
          message: `Profile ${completeness.completionPercentage}% complete. Need at least 60% for AI analysis.`
        });
        setState('error');
        return;
      }

      // Perform AI analysis
      await performAIAnalysis(freshData);

    } catch (err) {
      console.error('❌ Dashboard initialization failed:', err);
      const error = err as Error;
      
      if (error.message.includes('network') || error.message.includes('fetch')) {
        setError({
          type: 'network',
          message: 'Unable to connect to servers. Please check your internet connection.',
          error
        });
      } else if (error.message.includes('profile')) {
        setError({
          type: 'profile',
          message: error.message,
          error
        });
      } else {
        setError({
          type: 'data',
          message: 'Failed to load dashboard data. Please try again.',
          error
        });
      }
      
      setState('error');
    }
  };

  const performAIAnalysis = async (data?: DashboardData) => {
    try {
      setIsAnalyzing(true);
      setState('analyzing');

      const dataToAnalyze = data || dashboardData;
      if (!dataToAnalyze) {
        throw new Error('No data available for analysis');
      }

      console.log('🤖 Starting AI analysis...');
      
      const startupData = DataFetchingService.convertToStartupData(dataToAnalyze);
      const analysis = await geminiService.analyzeStartup(startupData);
      
      setAnalysisResult(analysis);
      setLastAnalyzed(new Date().toISOString());
      
      // Cache the complete dashboard data
      DashboardCacheService.saveDashboardData(
        user!.id,
        analysis,
        dataToAnalyze
      );

      console.log('✅ AI analysis completed and cached');
      setState('ready');

    } catch (err) {
      console.error('❌ AI analysis failed:', err);
      const error = err as Error;
      
      setError({
        type: 'ai',
        message: 'AI analysis failed. Your data is safe, but insights are unavailable.',
        error
      });
      
      setState('ready'); // Still show dashboard without AI insights
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeAgain = async () => {
    if (!dashboardData) return;
    
    // Clear cache to force fresh analysis
    DashboardCacheService.clearDashboardData(user!.id);
    await performAIAnalysis(dashboardData);
  };

  const handleRetry = async () => {
    await initializeDashboard();
  };

  const getLastAnalyzedText = () => {
    if (!lastAnalyzed) return null;
    
    const date = new Date(lastAnalyzed);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  };

  // Render different states
  if (state === 'loading') {
    return (
      <div className="container mx-auto px-6 py-8">
        <LoadingStates.FetchingData />
        <div className="mt-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (state === 'analyzing') {
    return (
      <div className="container mx-auto px-6 py-8">
        <LoadingStates.AnalyzingWithAI />
        {dashboardData && (
          <div className="mt-8">
            <SummaryCards dashboardData={dashboardData} />
          </div>
        )}
      </div>
    );
  }

  if (state === 'error' && !dashboardData) {
    return (
      <div className="container mx-auto px-6 py-8">
        {error?.type === 'data' && (
          <ErrorStates.DataFetchError 
            error={error.message} 
            onRetry={handleRetry}
          />
        )}
        {error?.type === 'network' && (
          <ErrorStates.NetworkError 
            error={error.message} 
            onRetry={handleRetry}
          />
        )}
        {error?.type === 'profile' && (
          <ErrorStates.IncompleteProfile 
            onRetry={() => window.location.href = '/complete-profile'}
          />
        )}
        <EmptyStates.NoData />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto px-6 py-8">
        <EmptyStates.FirstTime />
      </div>
    );
  }

  // Navigation items
  const navigationItems = [
    {
      id: 'overview' as ActiveView,
      name: 'Overview',
      icon: Home,
      description: 'Summary & Key Metrics'
    },
    {
      id: 'insights' as ActiveView,
      name: 'AI Insights',
      icon: Brain,
      description: 'Analysis & Recommendations'
    },
    {
      id: 'domain' as ActiveView,
      name: dashboardData?.domain_type || 'Industry',
      icon: Target,
      description: 'Domain-specific Insights'
    },
    {
      id: 'assets' as ActiveView,
      name: 'Assets',
      icon: Wallet,
      description: 'Founder Financial Profile'
    }
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-card-foreground">
          {dashboardData?.startup_profile.startup_name || 'Dashboard'}
        </h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
          <Calendar className="w-4 h-4" />
          <span>{getLastAnalyzedText()}</span>
        </div>
        {analysisResult && (
          <Badge variant="secondary" className="mt-2 capitalize">
            {analysisResult.performance_category.replace('_', ' ')}
          </Badge>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                activeView === item.id
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-card-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground truncate">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* Analyze Again Button */}
      <div className="p-4 border-t border-border">
        <Button 
          onClick={handleAnalyzeAgain}
          disabled={isAnalyzing}
          className="w-full"
          variant={isAnalyzing ? "secondary" : "default"}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Analyze Again
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <SummaryCards 
              dashboardData={dashboardData!} 
              analysisResult={analysisResult} 
            />
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    {analysisResult?.summary.overall_score || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">Overall Score</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">
                    {analysisResult?.red_flags.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Red Flags</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">
                    {analysisResult?.recommendations.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">Recommendations</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'insights':
        return analysisResult ? (
          <AIInsights analysisResult={analysisResult} />
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">AI insights are not available</p>
              <Button onClick={handleAnalyzeAgain} disabled={isAnalyzing}>
                {isAnalyzing ? 'Analyzing...' : 'Generate Insights'}
              </Button>
            </CardContent>
          </Card>
        );

      case 'domain':
        return (
          <DomainSpecificInsights 
            dashboardData={dashboardData!} 
            analysisResult={analysisResult} 
          />
        );

      case 'assets':
        return <FounderAssetsVisualization dashboardData={dashboardData!} />;

      default:
        return null;
    }
  };

  // Main dashboard render
  return (
    <DashboardErrorBoundary onReset={handleRetry}>
      <div className="flex min-h-[calc(100vh-4rem)] bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:top-16">
          <div className="flex flex-col flex-grow bg-card border-r border-border">
            {renderSidebarContent()}
          </div>
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64">
            {renderSidebarContent()}
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 lg:pl-64">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="lg:hidden bg-card border-b border-border px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Menu className="w-5 h-5" />
                      </Button>
                    </SheetTrigger>
                  </Sheet>
                  <h1 className="text-lg font-semibold text-card-foreground">
                    {navigationItems.find(item => item.id === activeView)?.name}
                  </h1>
                </div>
                {analysisResult && (
                  <Badge variant="secondary" className="capitalize">
                    {analysisResult.performance_category.replace('_', ' ')}
                  </Badge>
                )}
              </div>
            </div>

            {/* Error Banner (if AI failed but data loaded) */}
            {error?.type === 'ai' && (
              <div className="p-4">
                <ErrorStates.AIAnalysisError 
                  error={error.message} 
                  onRetry={handleAnalyzeAgain}
                />
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto">
              <div className="p-6">
                {renderMainContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardErrorBoundary>
  );
};

export default Dashboard;