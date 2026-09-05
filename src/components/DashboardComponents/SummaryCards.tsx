import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar, 
  Building, 
  Target,
  AlertTriangle,
  Clock,
  Flame,
  Zap
} from 'lucide-react';
import { DashboardData } from '../../lib/data-fetching';
import { AIAnalysisResult } from '../../lib/gemini-api';

interface SummaryCardsProps {
  dashboardData: DashboardData;
  analysisResult?: AIAnalysisResult;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'primary',
  className = ''
}) => {
  const colorClasses = {
    primary: 'border-primary/20 bg-primary/5',
    secondary: 'border-border bg-muted',
    success: 'border-success/20 bg-success/5',
    danger: 'border-destructive/20 bg-destructive/5',
    warning: 'border-warning/20 bg-warning/5'
  };

  const iconColorClasses = {
    primary: 'text-primary',
    secondary: 'text-muted-foreground',
    success: 'text-success',
    danger: 'text-destructive',
    warning: 'text-warning'
  };

  return (
    <Card className={`${colorClasses[color]} ${className} min-w-0 overflow-hidden`}>
      <CardContent className="p-6 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground mb-1 truncate" title={title}>{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold text-card-foreground truncate" title={String(value)}>{value}</h3>
              {trend && trendValue && (
                <div className={`flex items-center text-sm ${
                  trend === 'up' ? 'text-success' : 
                  trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : 
                   trend === 'down' ? <TrendingDown className="w-4 h-4 mr-1" /> : null}
                  {trendValue}
                </div>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1 truncate" title={subtitle}>{subtitle}</p>
            )}
          </div>
          <div className={`${iconColorClasses[color]} ml-4`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const HealthScoreCard: React.FC<{ score: number; title: string; description: string }> = ({
  score,
  title,
  description
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const color = getScoreColor(score);

  return (
    <Card className="border-l-4 border-l-blue-500 min-w-0 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between min-w-0">
          <span className="truncate mr-2" title={title}>{title}</span>
          <Badge variant={color === 'success' ? 'default' : color === 'warning' ? 'secondary' : 'destructive'} className="whitespace-nowrap">
            {score}/100
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={score} className="mb-3" />
        <p className="text-sm text-gray-600 truncate" title={description}>{description}</p>
      </CardContent>
    </Card>
  );
};

export const SummaryCards: React.FC<SummaryCardsProps> = ({ dashboardData, analysisResult }) => {
  const { startup_profile, founder_assets, domain_type } = dashboardData;

  // Calculate runway if we have the data
  const calculateRunway = () => {
    if (startup_profile.monthly_burn && startup_profile.revenue_current_year) {
      const monthlyRevenue = Number(startup_profile.revenue_current_year) / 12;
      const monthlyBurn = Number(startup_profile.monthly_burn);
      const netBurn = monthlyBurn - monthlyRevenue;
      
      if (netBurn > 0 && founder_assets?.liquid_assets) {
        return Math.floor(founder_assets.liquid_assets / netBurn);
      }
    }
    return analysisResult?.key_metrics?.calculated_runway || 0;
  };

  const formatCurrency = (value: string | number | null | undefined): string => {
    if (!value) return '$0';
    const numValue = typeof value === 'string' ? parseInt(value) : value;
    if (numValue >= 1000000) {
      return `$${(numValue / 1000000).toFixed(1)}M`;
    } else if (numValue >= 1000) {
      return `$${(numValue / 1000).toFixed(0)}k`;
    }
    return `$${numValue.toLocaleString()}`;
  };

  const formatNumber = (value: string | number | null | undefined): string => {
    if (!value) return '0';
    const numValue = typeof value === 'string' ? parseInt(value) : value;
    return numValue.toLocaleString();
  };

  const runway = calculateRunway();

  return (
    <div className="space-y-6">
      {/* Health Scores */}
      {analysisResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <HealthScoreCard
            score={analysisResult.summary.overall_score}
            title="Overall Score"
            description="Comprehensive startup health assessment"
          />
          <HealthScoreCard
            score={analysisResult.summary.financial_health}
            title="Financial Health"
            description="Cash flow, runway, and financial stability"
          />
          <HealthScoreCard
            score={analysisResult.summary.growth_potential}
            title="Growth Potential"
            description="Market opportunity and scalability"
          />
          <HealthScoreCard
            score={100 - analysisResult.summary.risk_level}
            title="Risk Assessment"
            description="Identified threats and mitigation"
          />
        </div>
      )}

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-0">
        <MetricCard
          title="Current Revenue"
          value={formatCurrency(startup_profile.revenue_current_year)}
          subtitle="Annual recurring revenue"
          icon={<DollarSign className="w-8 h-8" />}
          color="success"
        />

        <MetricCard
          title="Monthly Burn"
          value={formatCurrency(startup_profile.monthly_burn)}
          subtitle="Operating expenses per month"
          icon={<Flame className="w-8 h-8" />}
          color="danger"
        />

        <MetricCard
          title="Runway"
          value={runway > 0 ? `${runway} mo` : "N/A"}
          subtitle="Months until cash depletion"
          icon={<Clock className="w-8 h-8" />}
          color={runway > 12 ? 'success' : runway > 6 ? 'warning' : 'danger'}
        />

        <MetricCard
          title="Team Size"
          value={formatNumber(startup_profile.team_size)}
          subtitle="Total team members"
          icon={<Users className="w-8 h-8" />}
          color="primary"
        />
      </div>

      {/* Business Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-0">
        <Card className="min-w-0 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center min-w-0">
              <Building className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" />
              <span className="truncate">Business Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 min-w-0">
            <div>
              <p className="text-sm text-gray-600">Company</p>
              <p className="font-semibold truncate" title={startup_profile.startup_name}>
                {startup_profile.startup_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Industry</p>
              <Badge variant="outline" className="mt-1 truncate max-w-full" title={startup_profile.industry}>
                {startup_profile.industry}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Stage</p>
              <Badge variant="secondary" className="mt-1">
                {startup_profile.stage}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Founded</p>
              <p className="font-semibold">{startup_profile.founded_year}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center min-w-0">
              <Target className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
              <span className="truncate">Funding Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 min-w-0">
            <div>
              <p className="text-sm text-gray-600">Funding Ask</p>
              <p className="font-semibold text-lg">
                {formatCurrency(startup_profile.funding_ask)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Use of Funds</p>
              <p className="text-sm text-gray-800 truncate" title={startup_profile.funding_use || 'Not specified'}>
                {startup_profile.funding_use || 'Not specified'}
              </p>
            </div>
            {analysisResult && (
              <div>
                <p className="text-sm text-gray-600 truncate">Funding Probability</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Progress value={analysisResult.predictions.funding_probability} className="flex-1" />
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {analysisResult.predictions.funding_probability}%
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {founder_assets && (
          <Card className="min-w-0 overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center min-w-0">
                <Zap className="w-5 h-5 mr-2 text-yellow-600 flex-shrink-0" />
                <span className="truncate">Founder Assets</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 min-w-0">
              <div>
                <p className="text-sm text-gray-600">Net Worth</p>
                <p className="font-semibold text-lg">
                  {formatCurrency(founder_assets.personal_net_worth)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Liquid Assets</p>
                <p className="font-semibold text-lg">
                  {formatCurrency(founder_assets.liquid_assets)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Risk Tolerance</p>
                <Badge 
                  variant={
                    founder_assets.risk_tolerance === 'high' ? 'destructive' :
                    founder_assets.risk_tolerance === 'medium' ? 'secondary' : 'default'
                  }
                  className="mt-1"
                >
                  {founder_assets.risk_tolerance || 'Unknown'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Performance Category Badge */}
      {analysisResult && (
        <Card className="bg-card min-w-0 overflow-hidden">
          <CardContent className="p-6 min-w-0">
            <div className="flex items-center justify-between min-w-0 gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold mb-2 truncate">
                  Performance Category
                </h3>
                <Badge 
                  variant={
                    analysisResult.performance_category === 'high_performer' ? 'default' :
                    analysisResult.performance_category === 'average_performer' ? 'secondary' :
                    analysisResult.performance_category === 'struggling' ? 'destructive' : 'outline'
                  }
                  className="text-sm px-3 py-1"
                >
                  {analysisResult.performance_category.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <div className="text-right min-w-0">
                <p className="text-sm text-gray-600">Domain</p>
                <p className="font-semibold capitalize truncate" title={domain_type}>{domain_type}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SummaryCards;