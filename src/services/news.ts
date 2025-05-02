import type { NewsItem } from '../types/news';

export async function getNews(): Promise<NewsItem[]> {
  const res = await fetch('/api/news')
  if (!res.ok) throw new Error('Failed to fetch news')
  const data = await res.json()
  return data
}
