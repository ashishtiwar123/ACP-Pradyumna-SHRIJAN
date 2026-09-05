import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Wallet, 
  TrendingUp, 
  Home, 
  CreditCard, 
  PieChart, 
  Shield,
  Building,
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Charts } from './Charts';
import { DashboardData } from '../../lib/data-fetching';

interface FounderAssetsProps {
  dashboardData: DashboardData;
}

export const FounderAssetsVisualization: React.FC<FounderAssetsProps> = ({ dashboardData }) => {
  const { founder_assets } = dashboardData;
  
  if (!founder_assets) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Complete your founder assets profile to see financial insights</p>
          <Badge variant="outline">Optional but Recommended</Badge>
        </CardContent>
      </Card>
    );
  }

  // Calculate financial health metrics
  const calculateFinancialHealth = () => {
    const netWorth = founder_assets.personal_net_worth || 0;
    const liquidAssets = founder_assets.liquid_assets || 0;
    const totalDebt = founder_assets.personal_debt || 0;
    const monthlyExpenses = founder_assets.monthly_personal_expenses || 0;
    
    const liquidityRatio = liquidAssets > 0 && monthlyExpenses > 0 ? (liquidAssets / monthlyExpenses) : 0;
    const debtToAssetRatio = netWorth > 0 ? (totalDebt / netWorth) * 100 : 0;
    const emergencyFundScore = (founder_assets.emergency_fund_months || 0) / 6 * 100; // 6 months is ideal
    
    return {
      liquidityRatio: Math.min(liquidityRatio, 12), // Cap at 12 months
      debtToAssetRatio: Math.min(debtToAssetRatio, 100),
      emergencyFundScore: Math.min(emergencyFundScore, 100)
    };
  };

  const healthMetrics = calculateFinancialHealth();

  // Investment portfolio breakdown
  const portfolioData = [
    { name: 'Stocks', value: founder_assets.stock_investments || 0 },
    { name: 'Crypto', value: founder_assets.crypto_investments || 0 },
    { name: 'Real Estate', value: founder_assets.real_estate_investments || 0 },
    { name: 'Other', value: founder_assets.other_investments || 0 }
  ].filter(item => item.value > 0);

  // Assets vs Liabilities data
  const assetsLiabilitiesData = [
    { 
      category: 'Liquid Assets', 
      assets: founder_assets.liquid_assets || 0, 
      liabilities: 0 
    },
    { 
      category: 'Investments', 
      assets: (founder_assets.stock_investments || 0) + (founder_assets.crypto_investments || 0) + (founder_assets.other_investments || 0), 
      liabilities: 0 
    },
    { 
      category: 'Real Estate', 
      assets: (founder_assets.primary_residence_value || 0) + (founder_assets.investment_properties_value || 0), 
      liabilities: founder_assets.total_real_estate_debt || 0 
    },
    { 
      category: 'Business', 
      assets: founder_assets.current_business_equity_value || 0, 
      liabilities: 0 
    }
  ];

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toLocaleString()}`;
  };

  const getRiskColor = (riskTolerance: string | null) => {
    switch (riskTolerance?.toLowerCase()) {
      case 'high': return 'text-destructive bg-destructive/5 border-destructive/20';
      case 'medium': return 'text-warning-foreground bg-warning/5 border-warning/20';
      case 'low': return 'text-success bg-success/5 border-success/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Worth</p>
                <p className="text-2xl font-bold">{formatCurrency(founder_assets.personal_net_worth || 0)}</p>
              </div>
              <Wallet className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Liquid Assets</p>
                <p className="text-2xl font-bold">{formatCurrency(founder_assets.liquid_assets || 0)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Annual Income</p>
                <p className="text-2xl font-bold">{formatCurrency(founder_assets.personal_annual_income || 0)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Credit Score</p>
                <p className="text-2xl font-bold">{founder_assets.credit_score || 'N/A'}</p>
              </div>
              <CreditCard className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-primary" />
            Financial Health Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Liquidity Score</span>
                <span className="text-sm text-muted-foreground">{healthMetrics.liquidityRatio.toFixed(1)} months</span>
              </div>
              <Progress value={(healthMetrics.liquidityRatio / 6) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {healthMetrics.liquidityRatio < 3 ? 'Consider building emergency fund' : 
                 healthMetrics.liquidityRatio < 6 ? 'Good liquidity position' : 'Excellent liquidity'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Debt-to-Asset Ratio</span>
                <span className="text-sm text-muted-foreground">{healthMetrics.debtToAssetRatio.toFixed(1)}%</span>
              </div>
              <Progress value={100 - healthMetrics.debtToAssetRatio} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {healthMetrics.debtToAssetRatio > 50 ? 'High debt burden' : 
                 healthMetrics.debtToAssetRatio > 25 ? 'Moderate debt levels' : 'Low debt burden'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Emergency Fund</span>
                <span className="text-sm text-gray-600">{founder_assets.emergency_fund_months || 0} months</span>
              </div>
              <Progress value={healthMetrics.emergencyFundScore} className="h-2" />
              <p className="text-xs text-gray-500">
                {(founder_assets.emergency_fund_months || 0) < 3 ? 'Build emergency fund' : 
                 (founder_assets.emergency_fund_months || 0) < 6 ? 'Good emergency coverage' : 'Excellent coverage'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Portfolio and Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investment Portfolio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-green-600" />
              Investment Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            {portfolioData.length > 0 ? (
              <Charts.AssetAllocation data={portfolioData} height={250} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <PieChart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No investment data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assets vs Liabilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Assets vs Liabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Charts.CashFlow 
              data={assetsLiabilitiesData.map(d => ({
                month: d.category,
                inflow: d.assets,
                outflow: d.liabilities
              }))} 
              height={250} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Business & Professional Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              Professional Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Industry Experience</p>
                <p className="font-semibold">{founder_assets.industry_experience_years || 0} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Previous Exits</p>
                <p className="font-semibold">{formatCurrency(founder_assets.previous_startup_exits || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Business Equity</p>
                <p className="font-semibold">{formatCurrency(founder_assets.current_business_equity_value || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dependents</p>
                <p className="font-semibold">{founder_assets.dependents_count || 0}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Risk Tolerance</p>
              <Badge className={`${getRiskColor(founder_assets.risk_tolerance)} border`}>
                {founder_assets.risk_tolerance?.toUpperCase() || 'NOT SET'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2 text-green-600" />
              Startup Investment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Personal Funds Committed</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(founder_assets.personal_funds_committed_to_startup || 0)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Previous Funding Raised</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(founder_assets.previous_funding_raised || 0)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">IP Value</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(founder_assets.intellectual_property_value || 0)}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Network & Connections</p>
              {founder_assets.investor_connections ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Strong investor network</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">Building investor network</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Details */}
      {(founder_assets.business_assets_description || founder_assets.professional_network_value) && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Assets & Network</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {founder_assets.business_assets_description && (
              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">Business Assets Description</p>
                <p className="text-sm border-2 p-3 rounded-lg">{founder_assets.business_assets_description}</p>
              </div>
            )}
            
            {founder_assets.professional_network_value && (
              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">Professional Network Value</p>
                <p className="text-sm border-2 p-3 rounded-lg">{founder_assets.professional_network_value}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FounderAssetsVisualization;