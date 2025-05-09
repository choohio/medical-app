import type { NewsItem } from '@/types/news';
import axios from 'axios';

export async function getNews(): Promise<NewsItem[]> {
    const response = await axios.get('/api/news').catch((err) => {
        throw new Error(err.message || 'Failed to fetch news');
    });

    return response.data;
}
