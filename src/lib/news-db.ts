import { supabase } from '@/integrations/supabase/client';
import { NewsItem } from '@/lib/news-api';
import type { TablesInsert } from '@/integrations/supabase/types';

export async function fetchNewsFromDB(limit = 20): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []).map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    tag: item.tag,
    timestamp: item.timestamp,
    category: item.category,
    readTime: item.read_time,
    summary: item.summary,
  }));
}

export async function insertNewsToDB(news: NewsItem[]): Promise<void> {
  // Prepare rows for DB insert (omit id, use DB default, and map readTime to read_time)
  const rows: TablesInsert<'news'>[] = news.map(({ id, readTime, timestamp, ...rest }) => ({
    ...rest,
    read_time: readTime,
    timestamp: timestamp || new Date().toISOString(),
  }));
  const { error } = await supabase.from('news').insert(rows);
  if (error) throw error;
}
