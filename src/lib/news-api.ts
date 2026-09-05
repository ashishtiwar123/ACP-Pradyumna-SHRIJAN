import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  tag: 'founder' | 'investor' | 'both';
  timestamp: string;
  category: string;
  readTime: number;
  summary: string;
}

export interface NewsResponse {
  news: NewsItem[];
  timestamp: string;
  total: number;
}

const createNewsPrompt = (): string => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  return `
You are an expert startup and investment news curator. Generate 15-20 realistic and relevant startup news articles for ${currentDate}.

Create diverse news covering:
- Funding rounds and investment news
- Startup launches and product updates  
- Market trends and analysis
- Founder insights and advice
- Investor perspectives and strategies
- Industry developments (fintech, healthcare, food tech, ecommerce)
- Regulatory updates affecting startups
- Success stories and failures
- Technology trends impacting startups

For each news item, determine if it's primarily relevant for:
- "founder": News that helps founders with building, scaling, fundraising, operations
- "investor": News about investment opportunities, market analysis, due diligence insights
- "both": News relevant to both founders and investors

Return ONLY valid JSON in this exact format:

{
  "news": [
    {
      "id": "unique-id-1",
      "title": "Compelling news headline (50-80 characters)",
      "content": "Detailed news content (200-400 words) with actionable insights",
      "tag": "founder|investor|both",
      "timestamp": "${new Date().toISOString()}",
      "category": "funding|product|market|strategy|technology|regulatory",
      "readTime": 2-5,
      "summary": "Brief 1-2 sentence summary of key takeaways"
    }
  ],
  "timestamp": "${new Date().toISOString()}",
  "total": 15-20
}

REQUIREMENTS:
1. Make news realistic and current
2. Include specific company names, funding amounts, and concrete details
3. Vary the content types (announcements, analysis, interviews, reports)
4. Ensure content is actionable and valuable
5. Balance between founder-focused and investor-focused content
6. Include both positive and cautionary news
7. Cover different startup stages (seed, series A/B/C, IPO)
8. Include diverse industries and geographies
9. Make headlines engaging and informative
10. Ensure all JSON is properly formatted

Generate fresh, diverse content that startup founders and investors would actually want to read.
`;
};

export class NewsService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  private cache: NewsResponse | null = null;
  private cacheExpiry: Date | null = null;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  private checkApiKey(): boolean {
    return !!import.meta.env.VITE_GEMINI_API_KEY;
  }

  async fetchNews(forceRefresh: boolean = false): Promise<NewsResponse> {
    try {
      // Check API key availability
      if (!this.checkApiKey()) {
        console.warn('⚠️ Gemini API key not found, using fallback news');
        return this.getFallbackNews();
      }

      // Check cache first
      if (!forceRefresh && this.cache && this.cacheExpiry && new Date() < this.cacheExpiry) {
        console.log('📰 Returning cached news data');
        return this.cache;
      }

      console.log('🤖 Fetching fresh news from Gemini AI...');
      
      const prompt = createNewsPrompt();
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('📝 Gemini news response received');

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in Gemini response');
      }

      const newsResponse: NewsResponse = JSON.parse(jsonMatch[0]);
      // Validate the response structure
      this.validateNewsResponse(newsResponse);
      // Cache the response
      this.cache = newsResponse;
      this.cacheExpiry = new Date(Date.now() + this.CACHE_DURATION);
      console.log(`✅ Successfully fetched ${newsResponse.total} news articles`);
      // Log the news response to the console for debugging/visibility
      console.log('News Response:', newsResponse);
      return newsResponse;

    } catch (error) {
      console.error('❌ News fetching failed:', error);
      
      // Return fallback news if API fails
      return this.getFallbackNews();
    }
  }

  async getFilteredNews(filter: 'all' | 'founder' | 'investor' = 'all'): Promise<NewsItem[]> {
    const newsResponse = await this.fetchNews();
    
    if (filter === 'all') {
      return newsResponse.news;
    }

    return newsResponse.news.filter(item => 
      item.tag === filter || item.tag === 'both'
    );
  }

  private validateNewsResponse(response: NewsResponse): void {
    if (!response.news || !Array.isArray(response.news)) {
      throw new Error('Invalid news response structure');
    }

    if (response.news.length === 0) {
      throw new Error('No news items in response');
    }

    // Validate each news item
    for (const item of response.news) {
      const requiredFields = ['id', 'title', 'content', 'tag', 'timestamp', 'category', 'readTime', 'summary'];
      
      for (const field of requiredFields) {
        if (!(field in item)) {
          throw new Error(`Missing required field in news item: ${field}`);
        }
      }

      if (!['founder', 'investor', 'both'].includes(item.tag)) {
        throw new Error(`Invalid tag value: ${item.tag}`);
      }
    }
  }

  private getFallbackNews(): NewsResponse {
    console.warn('🔄 Using fallback news data due to API unavailability');
    
    const fallbackNews: NewsItem[] = [
      {
        id: 'fallback-1',
        title: 'AI Startup Funding Reaches Record High in Q4 2024',
        content: 'Artificial intelligence startups raised over $2.3 billion in the fourth quarter of 2024, marking a significant increase from previous quarters. Leading investors are particularly interested in startups focusing on enterprise AI solutions, with companies like DataMind AI and SmartFlow securing major Series B rounds. This trend indicates strong market confidence in AI-driven business solutions. Founders in the AI space should focus on demonstrating clear ROI and scalable business models to attract investment.',
        tag: 'both',
        timestamp: new Date().toISOString(),
        category: 'funding',
        readTime: 3,
        summary: 'AI startup funding hits $2.3B in Q4 2024, driven by enterprise solutions demand.'
      },
      {
        id: 'fallback-2',
        title: 'Essential Metrics Every SaaS Founder Should Track',
        content: 'Successful SaaS founders focus on key metrics that drive sustainable growth. Monthly Recurring Revenue (MRR), Customer Acquisition Cost (CAC), and Customer Lifetime Value (CLV) form the foundation of SaaS analytics. Additionally, tracking churn rate, net revenue retention, and product-market fit indicators helps founders make informed decisions. Recent studies show that startups monitoring these metrics closely are 3x more likely to achieve profitability within 24 months.',
        tag: 'founder',
        timestamp: new Date().toISOString(),
        category: 'strategy',
        readTime: 4,
        summary: 'Key SaaS metrics like MRR, CAC, and CLV are crucial for sustainable growth.'
      },
      {
        id: 'fallback-3',
        title: 'Due Diligence Red Flags Investors Should Watch For',
        content: 'Experienced investors have identified common red flags during due diligence that often predict startup failure. These include inconsistent financial reporting, lack of product-market fit evidence, over-dependence on single customers, and unrealistic market size projections. Additionally, founders who cannot articulate clear unit economics or show defensive responses to criticism raise concerns. Smart investors also look for signs of poor team dynamics and inadequate competitive analysis.',
        tag: 'investor',
        timestamp: new Date().toISOString(),
        category: 'strategy',
        readTime: 3,
        summary: 'Key due diligence red flags include inconsistent financials and unrealistic projections.'
      },
      {
        id: 'fallback-4',
        title: 'FinTech Regulations: What Startups Need to Know in 2025',
        content: 'New financial technology regulations coming into effect in 2025 will significantly impact fintech startups. The updated frameworks focus on consumer data protection, anti-money laundering compliance, and cross-border payment regulations. Startups operating in the payments, lending, or cryptocurrency spaces must ensure compliance to avoid penalties. Legal experts recommend conducting compliance audits and building regulatory costs into funding requirements.',
        tag: 'both',
        timestamp: new Date().toISOString(),
        category: 'regulatory',
        readTime: 4,
        summary: 'New 2025 fintech regulations require startups to prioritize compliance and data protection.'
      },
      {
        id: 'fallback-5',
        title: 'Healthcare Startups See 40% Growth in Digital Health Solutions',
        content: 'The digital health sector experienced remarkable growth in 2024, with healthcare startups focusing on telemedicine, AI diagnostics, and patient management systems attracting significant investment. Companies like HealthTech Pro and MediConnect raised substantial Series A rounds, indicating strong investor confidence. The aging population and increased healthcare digitization drive this growth. Founders should focus on regulatory compliance and clinical validation to succeed in this space.',
        tag: 'both',
        timestamp: new Date().toISOString(),
        category: 'market',
        readTime: 3,
        summary: 'Digital health startups grew 40% in 2024, driven by telemedicine and AI diagnostics.'
      },
      {
        id: 'fallback-6',
        title: 'Series A Funding: What Investors Look For in 2025',
        content: 'Series A investors are increasingly selective in 2025, focusing on startups with proven product-market fit and clear paths to profitability. Key criteria include monthly recurring revenue of at least $100K, strong unit economics, and experienced founding teams. Investors also prioritize companies addressing large market opportunities with defensible technology or business models. Understanding these criteria helps founders better prepare for fundraising.',
        tag: 'both',
        timestamp: new Date().toISOString(),
        category: 'funding',
        readTime: 3,
        summary: 'Series A investors prioritize proven PMF, strong unit economics, and experienced teams.'
      },
      {
        id: 'fallback-7',
        title: 'Building Scalable Product Architecture from Day One',
        content: 'Technical founders often struggle with scaling their products as they grow. Key principles include designing for microservices early, implementing proper database indexing, and building automated testing pipelines. Cloud-native architecture with containers and serverless functions can significantly reduce operational overhead. Planning for scale from the beginning prevents costly rewrites later and enables faster feature development.',
        tag: 'founder',
        timestamp: new Date().toISOString(),
        category: 'technology',
        readTime: 4,
        summary: 'Early scalable architecture planning prevents costly rewrites and enables faster growth.'
      },
      {
        id: 'fallback-8',
        title: 'Market Research: The Investor Perspective',
        content: 'Successful investors conduct thorough market research before making investment decisions. This includes analyzing market size, growth trends, competitive landscape, and regulatory environment. Smart investors also evaluate the founder-market fit and assess whether the team has deep domain expertise. Understanding these evaluation criteria helps startups present more compelling investment opportunities.',
        tag: 'investor',
        timestamp: new Date().toISOString(),
        category: 'strategy',
        readTime: 3,
        summary: 'Thorough market research and founder-market fit evaluation are crucial for investment decisions.'
      }
    ];

    return {
      news: fallbackNews,
      timestamp: new Date().toISOString(),
      total: fallbackNews.length
    };
  }

  // Method to clear cache and force refresh
  clearCache(): void {
    this.cache = null;
    this.cacheExpiry = null;
  }

  // Method to test API connectivity
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.model.generateContent('Hello, please respond with "OK"');
      const response = await result.response;
      return response.text().includes('OK');
    } catch (error) {
      console.error('News API connection test failed:', error);
      return false;
    }
  }
}

export const newsService = new NewsService();