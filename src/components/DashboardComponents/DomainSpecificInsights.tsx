import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  MapPin, 
  CreditCard, 
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
  Utensils,
  Shield
} from 'lucide-react';
import { Charts } from './Charts';
import { DashboardData } from '../../lib/data-fetching';
import { AIAnalysisResult } from '../../lib/gemini-api';

interface DomainInsightsProps {
  dashboardData: DashboardData;
  analysisResult?: AIAnalysisResult;
}

// Healthcare-specific insights
const HealthcareInsights: React.FC<DomainInsightsProps> = ({ dashboardData, analysisResult }) => {
  const healthcareDetails = dashboardData.domain_details as any;
  
  if (!healthcareDetails) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Complete your healthcare details to see industry-specific insights</p>
        </CardContent>
      </Card>
    );
  }

  // Sample data for healthcare charts
  const clinicalProgressData = [
    { phase: 'Research', progress: 100, months: 6 },
    { phase: 'Pre-clinical', progress: 75, months: 12 },
    { phase: 'Phase I', progress: 30, months: 18 },
    { phase: 'Phase II', progress: 0, months: 24 },
    { phase: 'FDA Approval', progress: 0, months: 36 }
  ];

  const regulatoryTimelineData = [
    { month: 'Jan', target: 20, actual: 15 },
    { month: 'Feb', target: 35, actual: 28 },
    { month: 'Mar', target: 50, actual: 45 },
    { month: 'Apr', target: 65, actual: 52 },
    { month: 'May', target: 80, actual: 70 },
    { month: 'Jun', target: 100, actual: 85 }
  ];

  return (
    <div className="space-y-6">
      {/* Healthcare Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clinical Stage</p>
                <p className="text-2xl font-bold">{healthcareDetails.clinical_stage || 'Not specified'}</p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Time to Market</p>
                <p className="text-2xl font-bold">{healthcareDetails.estimated_time_to_market || 'TBD'}</p>
              </div>
              <Clock className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Key Partners</p>
                <p className="text-2xl font-bold">{healthcareDetails.key_partners?.split(',').length || 0}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regulatory Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-primary" />
            Regulatory Compliance Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthcareDetails.regulatory_requirements?.split(',').map((req: string, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{req.trim()}</span>
                <Badge variant="secondary">In Progress</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Development Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts.PerformanceComparison data={regulatoryTimelineData} height={250} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partnership Network</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthcareDetails.key_partners?.split(',').slice(0, 5).map((partner: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">{partner.trim()}</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Fintech-specific insights
const FintechInsights: React.FC<DomainInsightsProps> = ({ dashboardData, analysisResult }) => {
  const fintechDetails = dashboardData.domain_details as any;
  
  if (!fintechDetails) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Complete your fintech details to see industry-specific insights</p>
        </CardContent>
      </Card>
    );
  }

  // Sample data for fintech charts
  const paymentVolumeData = [
    { month: 'Jan', volume: 50000, transactions: 1200 },
    { month: 'Feb', volume: 65000, transactions: 1450 },
    { month: 'Mar', volume: 78000, transactions: 1680 },
    { month: 'Apr', volume: 85000, transactions: 1820 },
    { month: 'May', volume: 92000, transactions: 1950 },
    { month: 'Jun', volume: 108000, transactions: 2200 }
  ];

  const marketCoverageData = [
    { region: 'North America', coverage: 85 },
    { region: 'Europe', coverage: 60 },
    { region: 'Asia Pacific', coverage: 30 },
    { region: 'Latin America', coverage: 15 },
    { region: 'Africa', coverage: 5 }
  ];

  return (
    <div className="space-y-6">
      {/* Fintech Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Payment Volume</p>
                <p className="text-2xl font-bold">
                  ${fintechDetails.monthly_payment_volume?.toLocaleString() || '0'}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Markets</p>
                <p className="text-2xl font-bold">{fintechDetails.target_markets?.split(',').length || 0}</p>
              </div>
              <MapPin className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Integration Partners</p>
                <p className="text-2xl font-bold">{fintechDetails.integration_partners?.split(',').length || 0}</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts.GrowthMetrics 
              data={paymentVolumeData.map(d => ({ 
                month: d.month, 
                users: d.transactions, 
                revenue: d.volume 
              }))} 
              height={250} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketCoverageData.map((market, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{market.region}</span>
                    <span className="text-sm text-muted-foreground">{market.coverage}%</span>
                  </div>
                  <Progress value={market.coverage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-destructive" />
            Compliance & Risk Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Regulatory Compliance</h4>
              {fintechDetails.regulatory_requirements?.split(',').map((req: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm">{req.trim()}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Risk Factors</h4>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-sm">Market concentration risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-sm">Regulatory changes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Food industry insights
const FoodInsights: React.FC<DomainInsightsProps> = ({ dashboardData, analysisResult }) => {
  const foodDetails = dashboardData.domain_details as any;
  
  if (!foodDetails) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Complete your food industry details to see sector-specific insights</p>
        </CardContent>
      </Card>
    );
  }

  const supplyChainData = [
    { supplier: 'Local Farms', reliability: 85, cost: 120 },
    { supplier: 'Distributors', reliability: 92, cost: 150 },
    { supplier: 'Direct Import', reliability: 70, cost: 100 },
    { supplier: 'Co-ops', reliability: 88, cost: 110 }
  ];

  return (
    <div className="space-y-6">
      {/* Food Industry Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gross Margin</p>
                <p className="text-2xl font-bold">{foodDetails.gross_margin_percent || 0}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Perishability</p>
                <p className="text-2xl font-bold">{foodDetails.perishability_days || 0} days</p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suppliers</p>
                <p className="text-2xl font-bold">{foodDetails.suppliers?.split(',').length || 0}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supply Chain Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Supply Chain Reliability</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts.PerformanceComparison 
              data={supplyChainData.map(d => ({ 
                metric: d.supplier, 
                your_startup: d.reliability, 
                industry_average: 80 
              }))} 
              height={250} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Food Safety Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {foodDetails.food_safety_certifications?.split(',').map((cert: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="font-medium">{cert.trim()}</span>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-warning" />
            Supply Chain Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {foodDetails.supply_chain_risks?.split(',').map((risk: string, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-warning/5 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <p className="font-medium text-card-foreground">{risk.trim()}</p>
                  <p className="text-sm text-muted-foreground mt-1">Monitor and establish backup suppliers</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// E-commerce insights
const EcommerceInsights: React.FC<DomainInsightsProps> = ({ dashboardData, analysisResult }) => {
  const ecommerceDetails = dashboardData.domain_details as any;
  
  if (!ecommerceDetails) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Complete your e-commerce details to see retail-specific insights</p>
        </CardContent>
      </Card>
    );
  }

  const channelPerformanceData = [
    { channel: 'Website', revenue: 45, conversion: 3.2 },
    { channel: 'Mobile App', revenue: 35, conversion: 4.1 },
    { channel: 'Marketplace', revenue: 15, conversion: 2.8 },
    { channel: 'Social', revenue: 5, conversion: 1.9 }
  ];

  return (
    <div className="space-y-6">
      {/* E-commerce Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Order Value</p>
                <p className="text-2xl font-bold">${ecommerceDetails.average_order_value?.toLocaleString() || '0'}</p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Active Buyers</p>
                <p className="text-2xl font-bold">{ecommerceDetails.monthly_active_buyers?.toLocaleString() || 0}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Return Rate</p>
                <p className="text-2xl font-bold">{ecommerceDetails.return_rate_percent || 0}%</p>
              </div>
              <Package className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Channel Revenue Share</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts.MarketShare 
              data={channelPerformanceData.map(d => ({ 
                name: d.channel, 
                value: d.revenue 
              }))} 
              height={250} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fulfillment Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Current Strategy</h4>
                <p className="text-blue-800">{ecommerceDetails.fulfillment_strategy || 'Not specified'}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Primary Channels</h4>
                {ecommerceDetails.primary_channels?.split(',').map((channel: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{channel.trim()}</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key E-commerce Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">${ecommerceDetails.average_order_value || 0}</p>
              <p className="text-sm text-gray-600">AOV</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{ecommerceDetails.monthly_active_buyers?.toLocaleString() || 0}</p>
              <p className="text-sm text-gray-600">MAB</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{ecommerceDetails.return_rate_percent || 0}%</p>
              <p className="text-sm text-gray-600">Return Rate</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">85%</p>
              <p className="text-sm text-gray-600">Customer Satisfaction</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main domain insights component
export const DomainSpecificInsights: React.FC<DomainInsightsProps> = ({ dashboardData, analysisResult }) => {
  const { domain_type } = dashboardData;

  switch (domain_type) {
    case 'healthcare':
      return <HealthcareInsights dashboardData={dashboardData} analysisResult={analysisResult} />;
    case 'fintech':
      return <FintechInsights dashboardData={dashboardData} analysisResult={analysisResult} />;
    case 'food':
      return <FoodInsights dashboardData={dashboardData} analysisResult={analysisResult} />;
    case 'ecommerce':
      return <EcommerceInsights dashboardData={dashboardData} analysisResult={analysisResult} />;
    default:
      return (
        <Card>
          <CardContent className="text-center py-8">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Domain-specific insights will appear here once your industry is identified</p>
          </CardContent>
        </Card>
      );
  }
};

export default DomainSpecificInsights;