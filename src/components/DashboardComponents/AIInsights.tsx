import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Target, 
  Lightbulb,
  AlertCircle,
  Star,
  Flag,
  ChevronRight,
  Calendar,
  DollarSign,
  Users,
  BarChart3
} from 'lucide-react';
import { AIAnalysisResult } from '../../lib/gemini-api';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

interface AIInsightsProps {
  analysisResult: AIAnalysisResult;
}

const PriorityIcon: React.FC<{ priority: 'high' | 'medium' | 'low' }> = ({ priority }) => {
  const iconClass = "w-4 h-4";
  switch (priority) {
    case 'high':
      return <AlertTriangle className={`${iconClass} text-destructive`} />;
    case 'medium':
      return <AlertCircle className={`${iconClass} text-warning`} />;
    case 'low':
      return <Clock className={`${iconClass} text-primary`} />;
  }
};

const SeverityIcon: React.FC<{ severity: 'high' | 'medium' | 'low' }> = ({ severity }) => {
  const iconClass = "w-4 h-4";
  switch (severity) {
    case 'high':
      return <Flag className={`${iconClass} text-destructive`} />;
    case 'medium':
      return <AlertCircle className={`${iconClass} text-warning`} />;
    case 'low':
      return <AlertTriangle className={`${iconClass} text-warning`} />;
  }
};

const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
  const iconClass = "w-4 h-4 text-muted-foreground";
  
  switch (category.toLowerCase()) {
    case 'financial':
      return <DollarSign className={iconClass} />;
    case 'operational':
      return <BarChart3 className={iconClass} />;
    case 'marketing':
      return <TrendingUp className={iconClass} />;
    case 'team':
      return <Users className={iconClass} />;
    case 'product':
      return <Target className={iconClass} />;
    default:
      return <Lightbulb className={iconClass} />;
  }
};

export const AIInsights: React.FC<AIInsightsProps> = ({ analysisResult }) => {
  const [expandedRecommendations, setExpandedRecommendations] = useState<number[]>([]);
  const [expandedRedFlags, setExpandedRedFlags] = useState<number[]>([]);

  const toggleRecommendation = (index: number) => {
    setExpandedRecommendations(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const toggleRedFlag = (index: number) => {
    setExpandedRedFlags(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">SWOT</TabsTrigger>
          <TabsTrigger value="recommendations">Actions</TabsTrigger>
          <TabsTrigger value="red-flags">Red Flags</TabsTrigger>
          <TabsTrigger value="predictions">Forecasts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-warning" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Overall Score</span>
                      <span className="text-sm font-bold">{analysisResult.summary.overall_score}/100</span>
                    </div>
                    <Progress value={analysisResult.summary.overall_score} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Financial Health</span>
                      <span className="text-sm font-bold">{analysisResult.summary.financial_health}/100</span>
                    </div>
                    <Progress value={analysisResult.summary.financial_health} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Growth Potential</span>
                      <span className="text-sm font-bold">{analysisResult.summary.growth_potential}/100</span>
                    </div>
                    <Progress value={analysisResult.summary.growth_potential} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Risk Level</span>
                      <span className="text-sm font-bold text-destructive">{analysisResult.summary.risk_level}/100</span>
                    </div>
                    <Progress value={analysisResult.summary.risk_level} className="h-2" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Badge 
                    variant={
                      analysisResult.performance_category === 'high_performer' ? 'default' :
                      analysisResult.performance_category === 'average_performer' ? 'secondary' :
                      'destructive'
                    }
                    className="w-full justify-center py-2"
                  >
                    {analysisResult.performance_category.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Key Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-success" />
                  Key Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Runway</span>
                    <span className="font-semibold">{analysisResult.predictions.runway_months} months</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Funding Probability</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={analysisResult.predictions.funding_probability} className="w-16 h-2" />
                      <span className="font-semibold text-sm">{analysisResult.predictions.funding_probability}%</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-border">
                    <span className="text-sm text-muted-foreground">Growth Forecast</span>
                    <p className="text-sm mt-1 font-medium">{analysisResult.predictions.growth_forecast}</p>
                  </div>
                  
                  <div className="pt-3 border-t border-border">
                    <span className="text-sm text-muted-foreground">Breakeven Timeline</span>
                    <p className="text-sm mt-1 font-medium">{analysisResult.predictions.breakeven_timeline}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SWOT Analysis Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card className="border-success/20 bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center text-success">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.insights.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-card-foreground">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Opportunities */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Target className="w-5 h-5 mr-2" />
                  Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.insights.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-card-foreground">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Weaknesses */}
            <Card className="border-warning/20 bg-warning/5">
              <CardHeader>
                <CardTitle className="flex items-center text-warning-foreground">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.insights.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-card-foreground">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Threats */}
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Threats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.insights.threats.map((threat, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-card-foreground">{threat}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <div className="space-y-4">
            {analysisResult.recommendations.map((recommendation, index) => (
              <Collapsible key={index}>
                <Card className={`
                  ${recommendation.priority === 'high' ? 'border-destructive/20' : 
                    recommendation.priority === 'medium' ? 'border-warning/20' : 'border-primary/20'}
                `}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover: transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <PriorityIcon priority={recommendation.priority} />
                          <CategoryIcon category={recommendation.category} />
                          <div>
                            <CardTitle className="text-base">{recommendation.action}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge 
                                variant={
                                  recommendation.priority === 'high' ? 'destructive' :
                                  recommendation.priority === 'medium' ? 'secondary' : 'default'
                                }
                                className="text-xs"
                              >
                                {recommendation.priority.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {recommendation.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Expected Impact:</span>
                          <p className="text-sm mt-1">{recommendation.impact}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Timeline:</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{recommendation.timeline}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </TabsContent>

        {/* Red Flags Tab */}
        <TabsContent value="red-flags" className="space-y-4">
          <div className="space-y-4">
            {analysisResult.red_flags.map((redFlag, index) => (
              <Collapsible key={index}>
                <Card className={`
                  ${redFlag.severity === 'high' ? 'border-red-300 ' : 
                    redFlag.severity === 'medium' ? 'border-orange-300 ' : 'border-yellow-300 '}
                `}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:opacity-90 transition-opacity">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <SeverityIcon severity={redFlag.severity} />
                          <div>
                            <CardTitle className="text-base">{redFlag.description}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge 
                                variant={
                                  redFlag.severity === 'high' ? 'destructive' :
                                  redFlag.severity === 'medium' ? 'secondary' : 'default'
                                }
                                className="text-xs"
                              >
                                {redFlag.severity.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {redFlag.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Recommended Action:</span>
                          <p className="text-sm mt-1">{redFlag.recommendation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Projections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3  rounded-lg">
                    <span className="font-medium">Current Runway</span>
                    <Badge variant="outline">{analysisResult.predictions.runway_months} months</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3  rounded-lg">
                    <span className="font-medium">Breakeven Timeline</span>
                    <Badge variant="secondary">{analysisResult.predictions.breakeven_timeline}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3  rounded-lg">
                    <span className="font-medium">Funding Success Rate</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={analysisResult.predictions.funding_probability} className="w-20 h-2" />
                      <Badge variant="default">{analysisResult.predictions.funding_probability}%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">{analysisResult.predictions.growth_forecast}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIInsights;