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

  // Parse actual data from healthcare details
  const regulatoryApprovals = healthcareDetails.regulatory_approvals?.split(',') || [];
  const clinicalPartners = healthcareDetails.clinical_partners?.split(',') || [];
  const timeToMarket = healthcareDetails.estimated_time_to_market_months || 0;

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
                <p className="text-2xl font-bold">
                  {timeToMarket ? `${timeToMarket} months` : 'TBD'}
                </p>
              </div>
              <Clock className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clinical Partners</p>
                <p className="text-2xl font-bold">{clinicalPartners.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Target Patient Population */}
      {healthcareDetails.target_patient_population && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Target Patient Population
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {healthcareDetails.target_patient_population}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Regulatory Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-primary" />
            Regulatory Approvals & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {regulatoryApprovals.length > 0 ? (
              regulatoryApprovals.map((approval, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium">{approval.trim()}</span>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No regulatory approvals specified</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reimbursement Strategy */}
      {healthcareDetails.reimbursement_strategy && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-success" />
              Reimbursement Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200">
                {healthcareDetails.reimbursement_strategy}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

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
            <CardTitle>Clinical Partnership Network</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clinicalPartners.length > 0 ? (
                clinicalPartners.slice(0, 5).map((partner, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">{partner.trim()}</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No clinical partners specified</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Healthcare Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Healthcare Development Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{healthcareDetails.clinical_stage || 'N/A'}</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Clinical Stage</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{timeToMarket || 'TBD'}</p>
              <p className="text-sm text-green-700 dark:text-green-300">Months to Market</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{regulatoryApprovals.length}</p>
              <p className="text-sm text-purple-700 dark:text-purple-300">Regulatory Approvals</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{clinicalPartners.length}</p>
              <p className="text-sm text-orange-700 dark:text-orange-300">Clinical Partners</p>
            </div>
          </div>
        </CardContent>
      </Card>
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

  // Parse the actual data structure from your API
  const paymentsVolume = parseInt(fintechDetails.payments_volume_30d) || 0;
  const principalMarkets = fintechDetails.principal_markets?.split(',') || [];
  const integrations = fintechDetails.integrations?.split(',') || [];
  const licenseRequirements = fintechDetails.licencing_requirements?.split(',') || [];

  // Sample data for fintech charts based on actual payment volume
  const paymentVolumeData = [
    { month: 'Jan', volume: paymentsVolume * 0.7, transactions: Math.floor(paymentsVolume / 20000) },
    { month: 'Feb', volume: paymentsVolume * 0.8, transactions: Math.floor(paymentsVolume / 18000) },
    { month: 'Mar', volume: paymentsVolume * 0.9, transactions: Math.floor(paymentsVolume / 16000) },
    { month: 'Apr', volume: paymentsVolume * 0.85, transactions: Math.floor(paymentsVolume / 17000) },
    { month: 'May', volume: paymentsVolume * 0.95, transactions: Math.floor(paymentsVolume / 15000) },
    { month: 'Jun', volume: paymentsVolume, transactions: Math.floor(paymentsVolume / 14000) }
  ];

  // Market coverage based on principal markets
  const marketCoverageData = principalMarkets.map((market, index) => ({
    region: market.trim(),
    coverage: Math.max(20, 100 - index * 25) // Decreasing coverage for demo
  }));

  return (
    <div className="space-y-6">
      {/* Fintech Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">30-Day Payment Volume</p>
                <p className="text-2xl font-bold">
                  ₹{(paymentsVolume / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-muted-foreground">
                  ${(paymentsVolume / 83 / 1000000).toFixed(1)}M USD
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
                <p className="text-2xl font-bold">{principalMarkets.length}</p>
                <p className="text-xs text-muted-foreground">
                  {principalMarkets.slice(0, 2).join(', ')}
                </p>
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
                <p className="text-2xl font-bold">{integrations.length}</p>
                <p className="text-xs text-muted-foreground">
                  Active integrations
                </p>
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
            <CardTitle>Market Presence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketCoverageData.length > 0 ? (
                marketCoverageData.map((market, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{market.region}</span>
                      <span className="text-sm text-muted-foreground">{market.coverage}%</span>
                    </div>
                    <Progress value={market.coverage} className="h-2" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No market data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Partners */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-primary" />
            Integration Ecosystem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {integrations.map((integration, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium">{integration.trim()}</span>
                </div>
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KYC Process */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-500" />
            KYC & Compliance Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Current KYC Process</h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              {fintechDetails.kyc_process || 'No KYC process specified'}
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Regulatory Licenses & Requirements</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {licenseRequirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  <span className="text-sm">{req.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Fintech Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">₹{(paymentsVolume / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-green-700 dark:text-green-300">Monthly Volume</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{principalMarkets.length}</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Active Markets</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{integrations.length}</p>
              <p className="text-sm text-purple-700 dark:text-purple-300">Integrations</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{licenseRequirements.length}</p>
              <p className="text-sm text-orange-700 dark:text-orange-300">Licenses</p>
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