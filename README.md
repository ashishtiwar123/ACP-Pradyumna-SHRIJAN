# Smart AI Investor - AI-Powered Startup Investment Analysis Dashboard

An intelligent investment analysis platform powered by Google's Gemini AI that provides comprehensive startup evaluation, financial health assessment, and investment recommendations. Smart AI Investor analyzes startup data across multiple domains including healthcare, fintech, food & beverage, and e-commerce.

## Overview

Smart AI Investor is a sophisticated analytics platform designed to help investors, founders, and analysts make data-driven investment decisions. It combines startup financial data, founder assets information, and domain-specific metrics to provide AI-powered insights and investment recommendations.

The platform uses Google's Gemini API to analyze complex startup data and generate:

- SWOT analysis (Strengths, Weaknesses, Opportunities, Threats)
- Financial health scoring and predictions
- Risk assessment and red flags
- Growth forecasts and funding probability
- Actionable investment recommendations
- Domain-specific insights (Healthcare, Fintech, Food, E-commerce)

## Key Features

### Data Upload & Analysis

- Upload comprehensive startup data via file upload
- Support for multiple file formats
- Real-time AI analysis using Gemini API
- Batch processing capabilities

### Intelligent Dashboard

- **Summary Cards** - Quick overview metrics
  - Overall investment score
  - Financial health status
  - Growth potential rating
  - Risk level assessment

- **AI-Generated Insights**
  - Strengths and weaknesses analysis
  - Market opportunities and threats
  - Red flags with severity levels
  - Actionable recommendations prioritized by impact

- **Domain-Specific Analysis**
  - Healthcare: Regulatory compliance, market size, reimbursement models
  - Fintech: Regulatory landscape, user acquisition costs, market competition
  - Food & Beverage: Supply chain, margins, distribution channels
  - E-commerce: CAC, LTV, market saturation, fulfillment costs

- **Founder Assets Visualization**
  - Visual representation of founder resources
  - Asset allocation charts
  - Runway calculations
  - Burn rate analysis

### Advanced Metrics & Predictions

- Runway calculation (months until cash out)
- Growth forecasts based on historical data
- Funding probability scoring
- Break-even timeline estimation
- Comprehensive key metrics tracking

### News Integration

- Curated startup and investment news
- Industry-specific news filtering
- Real-time market updates
- Investment trend tracking

### Export Capabilities

- Export analysis to PDF reports
- Export data to Excel spreadsheets
- Shareable dashboard snapshots

## Technology Stack

### Frontend

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Responsive utility-first styling
- **shadcn/ui** - Premium accessible components
- **React Router** - Client-side routing
- **React Query** - Server state and caching
- **React Hook Form** - Efficient form management
- **Zod** - Schema validation

### Backend & AI Services

- **Supabase** - PostgreSQL database and authentication
- **Google Generative AI (Gemini)** - Advanced AI analysis
- **News API** - Real-time news aggregation

### Data Visualization

- **Recharts** - Beautiful, responsive charts
- **Chart.js** - Advanced charting capabilities

## Project Structure

```
src/
├── pages/                # Route pages
│   ├── Index.tsx        # Landing/home page
│   ├── Auth.tsx         # Authentication
│   ├── CompleteProfile.tsx # Profile setup
│   ├── Upload.tsx       # Data upload interface
│   ├── Dashboard.tsx    # Main dashboard
│   ├── AnalysisDashboard.tsx # Detailed analysis view
│   ├── AnalysisResults.tsx # Results presentation
│   └── News.tsx         # News feed
├── components/          # UI Components
│   ├── Layout.tsx       # App layout wrapper
│   ├── DashboardComponents/
│   │   ├── SummaryCards.tsx # Overview metrics
│   │   ├── AIInsights.tsx # AI analysis display
│   │   ├── DomainSpecificInsights.tsx
│   │   ├── FounderAssetsVisualization.tsx
│   │   ├── Charts.tsx
│   │   └── LoadingStates.tsx # Skeletons & states
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom hooks
│   ├── useAuth.tsx      # Authentication logic
│   ├── useProfile.tsx   # Profile management
│   └── use-mobile.tsx   # Mobile detection
├── lib/                 # Utility functions
│   ├── gemini-api.ts    # Gemini API integration
│   ├── data-fetching.ts # Data retrieval logic
│   ├── data-processing.ts # Data transformation
│   ├── dashboard-cache.ts # Caching strategy
│   ├── pdf-export.ts    # PDF generation
│   ├── excel-export.ts  # Excel export
│   └── utils.ts         # General utilities
├── contexts/            # React contexts
│   └── ThemeContext.tsx # Theme management
└── integrations/        # External service integrations
    └── supabase/        # Supabase client setup
```

## Supported Domains

### Healthcare

- Medical device efficiency
- Clinical trial outcomes
- Regulatory approval status
- Market adoption rates
- Reimbursement models

### Fintech

- User acquisition cost (UAC)
- Customer lifetime value (LTV)
- Regulatory compliance status
- Transaction volume growth
- Market penetration rate

### Food & Beverage

- Unit economics
- Supply chain efficiency
- Distribution channels
- Ingredient sourcing costs
- Franchise potential

### E-Commerce

- Customer acquisition cost
- Return rate and logistics
- Inventory turnover
- Market competition
- Seasonal trends

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account
- Google Gemini API key
- News API key

### Installation

```bash
# Clone repository
git clone <repository-url>
cd Smart-AI-Invester

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add API credentials to .env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_NEWS_API_KEY=your_news_api_key

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Development Commands

```bash
npm run dev       # Start dev server with hot reload
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## AI Analysis Workflow

1. **Data Upload**: User uploads startup profile, financial data, and founder assets
2. **Data Processing**: System normalizes and structures the data
3. **AI Analysis**: Gemini API analyzes data and generates comprehensive insights
4. **Visualization**: Dashboard renders charts, metrics, and recommendations
5. **Caching**: Results cached for performance optimization
6. **Export**: User can export analysis as PDF or Excel

## Key API Integrations

### Google Gemini API

```typescript
// Analyzes startup data and returns structured insights
- SWOT analysis
- Financial health scoring
- Risk assessment
- Growth predictions
- Investment recommendations
```

### News API

```typescript
// Fetches relevant startup and investment news
- Domain-specific news filtering
- Real-time updates
- Market trend analysis
```

## Database Schema

Uses Supabase PostgreSQL with tables for:

- `users` - User accounts and profiles
- `startups` - Startup profiles and data
- `analyses` - Cached analysis results
- `news` - Aggregated news data
- `notifications` - User notifications

See `db_schema.sql` for complete schema details.

## Caching Strategy

The application implements smart caching:

- Analysis results cached for 24 hours
- News data refreshed every 6 hours
- User profile data cached until manual update
- Optimized for performance on repeat visits

## Deployment

### Build for Production

```bash
npm run build
```

Optimized files ready for deployment to Vercel, Netlify, or other platforms.

## Environment Variables

```
VITE_SUPABASE_URL=              # Supabase project URL
VITE_SUPABASE_ANON_KEY=         # Supabase public key
VITE_GEMINI_API_KEY=            # Google Gemini API key
VITE_NEWS_API_KEY=              # NewsAPI.org key
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/Enhancement`)
3. Make your changes
4. Commit (`git commit -m 'Add Enhancement'`)
5. Push to branch (`git push origin feature/Enhancement`)
6. Open a Pull Request

## License

This project is open source under the MIT License.

- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2f2d8f09-596f-44eb-8009-36da208d10d3) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
