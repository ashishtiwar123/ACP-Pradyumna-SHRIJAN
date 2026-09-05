import React from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// Color palette for charts
export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#f59e0b',
  danger: '#ef4444',
  warning: '#f97316',
  info: '#06b6d4',
  success: '#22c55e',
  muted: '#64748b',
  gradient: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316']
};

// Common chart props
const commonChartProps = {
  margin: { top: 20, right: 30, left: 20, bottom: 5 }
};

export interface ChartProps {
  data: any[];
  className?: string;
  height?: number;
}

/**
 * Revenue Trend Line Chart
 */
export const RevenueTrendChart: React.FC<ChartProps> = ({ data, className = '', height = 300 }) => (
  <div className={`w-full ${className}`}>
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} {...commonChartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="month" 
          stroke="#64748b"
          fontSize={12}
        />
        <YAxis 
          stroke="#64748b"
          fontSize={12}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          formatter={(value: any) => [`$${value?.toLocaleString()}`, 'Revenue']}
          labelStyle={{ color: '#1f2937' }}
          contentStyle={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={CHART_COLORS.primary}
          strokeWidth={3}
          dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 6 }}
          activeDot={{ r: 8, stroke: CHART_COLORS.primary, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Burn Rate Area Chart
 */
export const BurnRateChart: React.FC<ChartProps> = ({ data, className = '', height = 300 }) => (
  <div className={`w-full ${className}`}>
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} {...commonChartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="month" 
          stroke="#64748b"
          fontSize={12}
        />
        <YAxis 
          stroke="#64748b"
          fontSize={12}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          formatter={(value: any) => [`$${value?.toLocaleString()}`, 'Burn Rate']}
          contentStyle={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
        />
        <Area
          type="monotone"
          dataKey="burn"
          stroke={CHART_COLORS.danger}
          fill={`${CHART_COLORS.danger}20`}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Runway Projection Chart
 */
export const RunwayProjectionChart: React.FC<ChartProps> = ({ data, className = '', height = 300 }) => (
  <div className={`w-full ${className}`}>
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} {...commonChartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="month" 
          stroke="#64748b"
          fontSize={12}
        />
        <YAxis 
          stroke="#64748b"
          fontSize={12}
          tickFormatter={(value) => `${value} mo`}
        />
        <Tooltip 
          formatter={(value: any) => [`${value} months`, 'Runway']}
          contentStyle={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
        />
        <Line
          type="monotone"
          dataKey="runway"
          stroke={CHART_COLORS.warning}
          strokeWidth={3}
          dot={{ fill: CHART_COLORS.warning, strokeWidth: 2, r: 6 }}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Asset Allocation Pie Chart
 */
export const AssetAllocationChart: React.FC<ChartProps> = ({ data, className = '', height = 300 }) => (
  <div className={`w-full ${className}`}>
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={40}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={CHART_COLORS.gradient[index % CHART_COLORS.gradient.length]} 
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: any) => [`$${value?.toLocaleString()}`, 'Value']}
          contentStyle={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value) => <span style={{ color: '#374151' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Financial Health Radar Chart
 */
export const FinancialHealthRadar: React.FC<ChartProps> = ({ data, className = '', height = 300 }) => (
  <div className={`w-full ${className}`}>
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis 
          dataKey="metric" 
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 100]} 
          tick={{ fill: '#64748b', fontSize: 10 }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke={CHART_COLORS.primary}
          fill={`${CHART_COLORS.primary}30`}
          strokeWidth={2}
        />
        <Tooltip 
          formatter={(value: any) => [`${value}/100`, 'Score']}
          contentStyle={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Performance Comparison Bar Chart
 */
export const PerformanceComparisonChart: React.FC<ChartProps> = ({ data, className = '', height = 300 }) => (
  <div className={`w-full ${className}`}>
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} {...commonChartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="metric" 
          stroke="#64748b"
          fontSize={12}
        />
        <YAxis 
          stroke="#64748b"
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Bar 
          dataKey="your_startup" 
          fill={CHART_COLORS.primary}
          name="Your Startup"
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="industry_average" 
          fill={CHART_COLORS.muted}
          name="Industry Average"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Growth Metrics Line Chart
 */
export const GrowthMetricsChart: React.FC<ChartProps> = ({ data, className = '', height = 300 }) => (
  <div className={`w-full ${className}`}>
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} {...commonChartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="month" 
          stroke="#64748b"
          fontSize={12}
        />
        <YAxis 
          stroke="#64748b"
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="users"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          name="Users"
          dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={CHART_COLORS.secondary}
          strokeWidth={2}
          name="Revenue"
          dot={{ fill: CHART_COLORS.secondary, strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Cash Flow Chart
 */
export const CashFlowChart: React.FC<ChartProps> = ({ data, className = '', height = 300 }) => (
  <div className={`w-full ${className}`}>
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} {...commonChartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="month" 
          stroke="#64748b"
          fontSize={12}
        />
        <YAxis 
          stroke="#64748b"
          fontSize={12}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          formatter={(value: any, name: string) => [
            `$${value?.toLocaleString()}`, 
            name === 'inflow' ? 'Cash Inflow' : 'Cash Outflow'
          ]}
          contentStyle={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Bar 
          dataKey="inflow" 
          fill={CHART_COLORS.secondary}
          name="Inflow"
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="outflow" 
          fill={CHART_COLORS.danger}
          name="Outflow"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Market Share Donut Chart
 */
export const MarketShareChart: React.FC<ChartProps> = ({ data, className = '', height = 300 }) => (
  <div className={`w-full ${className}`}>
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={CHART_COLORS.gradient[index % CHART_COLORS.gradient.length]} 
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: any) => [`${value}%`, 'Market Share']}
          contentStyle={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value) => <span style={{ color: '#374151' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

// Export all chart components
export const Charts = {
  RevenueTrend: RevenueTrendChart,
  BurnRate: BurnRateChart,
  RunwayProjection: RunwayProjectionChart,
  AssetAllocation: AssetAllocationChart,
  FinancialHealthRadar: FinancialHealthRadar,
  PerformanceComparison: PerformanceComparisonChart,
  GrowthMetrics: GrowthMetricsChart,
  CashFlow: CashFlowChart,
  MarketShare: MarketShareChart
};