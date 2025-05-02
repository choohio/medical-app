import { create } from 'zustand';

type NewsItem = {
  id: number
  title: string
  date: string
  description: string
}

type NewsStore = {
  news: NewsItem[]
  setNews: (data: NewsItem[]) => void
}

export const useNewsStore = create<NewsStore>((set) => ({
  news: [],
  setNews: (news) => set({ news }),
}))
