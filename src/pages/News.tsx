import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, RefreshCw, Filter, Tag } from 'lucide-react';
import { newsService, NewsItem } from '@/lib/news-api';
import { fetchNewsFromDB, insertNewsToDB } from '@/lib/news-db';
import { useToast } from '@/hooks/use-toast';

type FilterType = 'all' | 'founder' | 'investor';

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const { toast } = useToast();

  // Fetch news from DB by default
  const fetchNews = async (showRefreshToast: boolean = false) => {
    try {
      if (showRefreshToast) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const dbNews = await fetchNewsFromDB(20);
      setNews(dbNews);
      if (showRefreshToast) {
        toast({
          title: "News Updated",
          description: `Loaded ${dbNews.length} articles from database`,
        });
      }
    } catch (error) {
      console.error('Failed to fetch news from DB:', error);
      toast({
        title: "Error",
        description: "Failed to load news from database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch news from AI, show loading, display only AI news, and save to DB
  const handleGetNewsFromAI = async () => {
    setAiLoading(true);
    setLoading(true);
    try {
      const aiNews = await newsService.getFilteredNews('all');
      setNews(aiNews);
      await insertNewsToDB(aiNews);
      toast({
        title: "AI News Saved",
        description: `Fetched and saved ${aiNews.length} AI news articles to database`,
      });
    } catch (error) {
      console.error('Failed to fetch/save AI news:', error);
      toast({
        title: "Error",
        description: "Failed to fetch or save AI news. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
      setLoading(false);
    }
  };

  const handleFilterChange = async (newFilter: FilterType) => {
    setFilter(newFilter);
    setLoading(true);
    
    try {
      const filteredNews = await newsService.getFilteredNews(newFilter);
      setNews(filteredNews);
    } catch (error) {
      console.error('Failed to filter news:', error);
      toast({
        title: "Error",
        description: "Failed to filter news. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    newsService.clearCache();
    fetchNews(true);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'founder':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'investor':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'both':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      funding: 'bg-emerald-100 text-emerald-700',
      product: 'bg-blue-100 text-blue-700',
      market: 'bg-orange-100 text-orange-700',
      strategy: 'bg-indigo-100 text-indigo-700',
      technology: 'bg-cyan-100 text-cyan-700',
      regulatory: 'bg-red-100 text-red-700',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const NewsCard = ({ item, index }: { item: NewsItem; index: number }) => (
    <Card className="mb-6 masonry-item break-inside-avoid hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge 
            variant="secondary" 
            className={`${getTagColor(item.tag)} text-xs font-medium`}
          >
            <Tag className="w-3 h-3 mr-1" />
            {item.tag === 'both' ? 'Founder & Investor' : item.tag.charAt(0).toUpperCase() + item.tag.slice(1)}
          </Badge>
          <Badge 
            variant="outline" 
            className={`${getCategoryColor(item.category)} text-xs`}
          >
            {item.category}
          </Badge>
        </div>
        <CardTitle className="text-lg font-semibold leading-tight">
          {item.title}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {item.readTime} min read
          </div>
          <span>
            {new Date(item.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-3">
          <p className="text-sm font-medium text-muted-foreground bg-muted/50 p-2 rounded-md">
            {item.summary}
          </p>
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">
          {item.content}
        </p>
      </CardContent>
    </Card>
  );

  const LoadingSkeleton = () => (
    <Card className="mb-6 masonry-item break-inside-avoid">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-16 w-full mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Startup News</h1>
                <p className="text-muted-foreground mt-1">
                  AI-curated news and insights for founders and investors
                </p>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={refreshing || aiLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  onClick={handleGetNewsFromAI}
                  variant="default"
                  size="sm"
                  disabled={aiLoading || refreshing}
                  className="flex items-center gap-2"
                >
                  {aiLoading ? (
                    <span className="flex items-center"><RefreshCw className="w-4 h-4 animate-spin mr-1" /> Loading AI News...</span>
                  ) : (
                    <span>Get News from AI</span>
                  )}
                </Button>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('all')}
                  className="text-sm"
                  disabled={aiLoading}
                >
                  All News
                </Button>
                <Button
                  variant={filter === 'founder' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('founder')}
                  className="text-sm"
                  disabled={aiLoading}
                >
                  For Founders
                </Button>
                <Button
                  variant={filter === 'investor' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('investor')}
                  className="text-sm"
                  disabled={aiLoading}
                >
                  For Investors
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Content */}
      <div className="container mx-auto px-4 py-8">
  {loading || aiLoading ? (
          <div className="masonry-container columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            {news.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Tag className="w-12 h-12 mx-auto text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No news found</h3>
                <p className="text-muted-foreground mb-4">
                  Try changing your filter or refresh to load new content.
                </p>
                <Button onClick={handleRefresh} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh News
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6 text-center">
                  <p className="text-muted-foreground">
                    Showing {news.length} articles
                    {filter !== 'all' && (
                      <span className="ml-1">
                        for {filter === 'founder' ? 'founders' : 'investors'}
                      </span>
                    )}
                  </p>
                </div>

                {/* Masonry Layout */}
                <div className="masonry-container columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
                  {news.map((item, index) => (
                    <NewsCard key={item.id} item={item} index={index} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            News powered by AI • Updated every 30 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default News;