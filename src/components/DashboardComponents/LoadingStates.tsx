import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { AlertCircle, RefreshCw, Database, Wifi, Brain } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

// Loading Skeletons
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Health Scores Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-12" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-2 w-full mb-3" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-4 w-4 rounded-full flex-shrink-0 mt-1" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-4 w-4 rounded-full flex-shrink-0 mt-1" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Loading States
export const LoadingStates = {
  FetchingData: () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Database className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-card-foreground mb-2">Fetching Your Data</h3>
        <p className="text-muted-foreground">Loading startup and founder information...</p>
      </div>
    </div>
  ),

  AnalyzingWithAI: () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="relative">
          <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
          <div className="absolute -top-1 -right-1">
            <div className="w-4 h-4 bg-primary rounded-full animate-ping"></div>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-card-foreground mb-2">AI Analysis in Progress</h3>
        <p className="text-muted-foreground">Generating insights and recommendations...</p>
        <div className="mt-4 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  ),

  LoadingFromCache: () => (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 text-success animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-600">Loading cached analysis...</p>
      </div>
    </div>
  )
};

// Error States
interface ErrorStateProps {
  error: Error | string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorStates = {
  DataFetchError: ({ error, onRetry, showRetry = true }: ErrorStateProps) => (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Data Loading Failed</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p>Unable to fetch your startup data from the database.</p>
        <p className="text-sm font-mono bg-red-50 p-2 rounded">
          {typeof error === 'string' ? error : error.message}
        </p>
        {showRetry && onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            size="sm"
            className="mt-3"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  ),

  AIAnalysisError: ({ error, onRetry, showRetry = true }: ErrorStateProps) => (
    <Alert variant="destructive" className="mb-6">
      <Brain className="h-4 w-4" />
      <AlertTitle>AI Analysis Failed</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p>The AI analysis could not be completed. Your data is safe, but insights are unavailable.</p>
        <p className="text-sm font-mono bg-red-50 p-2 rounded">
          {typeof error === 'string' ? error : error.message}
        </p>
        {showRetry && onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            size="sm"
            className="mt-3"
          >
            <Brain className="w-4 h-4 mr-2" />
            Retry Analysis
          </Button>
        )}
      </AlertDescription>
    </Alert>
  ),

  NetworkError: ({ error, onRetry, showRetry = true }: ErrorStateProps) => (
    <Alert variant="destructive" className="mb-6">
      <Wifi className="h-4 w-4" />
      <AlertTitle>Connection Problem</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p>Unable to connect to our servers. Please check your internet connection.</p>
        <p className="text-sm font-mono bg-red-50 p-2 rounded">
          {typeof error === 'string' ? error : error.message}
        </p>
        {showRetry && onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            size="sm"
            className="mt-3"
          >
            <Wifi className="w-4 h-4 mr-2" />
            Reconnect
          </Button>
        )}
      </AlertDescription>
    </Alert>
  ),

  IncompleteProfile: ({ onRetry }: { onRetry?: () => void }) => (
    <Alert className="mb-6 border-orange-500 ">
      <AlertCircle className="h-4 w-4 " />
      <AlertTitle className="">Profile Incomplete</AlertTitle>
      <AlertDescription className="mt-2 space-y-3 ">
        <p>Your startup profile is missing some important information needed for analysis.</p>
        <p>Please complete your profile to get comprehensive insights and recommendations.</p>
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            size="sm"
            className="mt-3 border-orange-300 text-orange-700 hover:scale-100"
          >
            Complete Profile
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
};

// Empty States
export const EmptyStates = {
  NoData: () => (
    <div className="hidden text-center py-12">
      <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
      <p className="text-gray-600 mb-6">
        Set up your startup profile to see insights and analytics.
      </p>
      <Button variant="default">
        Complete Your Profile
      </Button>
    </div>
  ),

  FirstTime: () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Brain className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Your Dashboard</h3>
      <p className="text-gray-600 mb-6">
        Once you complete your profile, you'll see AI-powered insights and analytics here.
      </p>
      <div className="space-y-2">
        <Button variant="default" className="w-full sm:w-auto">
          Get Started
        </Button>
        <p className="text-xs text-gray-500">Analysis takes about 30 seconds</p>
      </div>
    </div>
  )
};

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class DashboardErrorBoundary extends React.Component<
  React.PropsWithChildren<{ onReset?: () => void }>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{ onReset?: () => void }>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription className="mt-2 space-y-3">
                <p>The dashboard encountered an unexpected error.</p>
                <p className="text-sm font-mono bg-red-50 p-2 rounded">
                  {this.state.error?.message || 'Unknown error'}
                </p>
                <Button 
                  onClick={() => {
                    this.setState({ hasError: false, error: undefined });
                    this.props.onReset?.();
                  }}
                  variant="outline" 
                  size="sm"
                  className="mt-3"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}