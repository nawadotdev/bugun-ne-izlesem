"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Film, Tv, Calendar } from 'lucide-react';

interface WatchlistItem {
  _id: string;
  type: 'movie' | 'tv'
  itemId: number;
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
}

export default function WatchlistPage() {
  const { user, token } = useUser();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'tv'>('all');

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    }
  }, [user]);

  const fetchWatchlist = async () => {
    try {
      const response = await fetch('/api/watchlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch watchlist');
      }

      const data = await response.json();
      setWatchlist(data);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Giriş Yapmalısınız</h2>
          <p className="text-slate-600 dark:text-slate-400">
            İzleme listenizi görmek için lütfen giriş yapın.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900 dark:border-white"></div>
      </div>
    );
  }

  const movies = watchlist.filter(item => item.type === 'movie');
  const tvShows = watchlist.filter(item => item.type === 'tv');

  const filteredWatchlist = activeTab === 'all' 
    ? watchlist 
    : activeTab === 'movies' 
      ? movies 
      : tvShows;

  return (
    <div className="min-h-screen py-8 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">İzleme Listem</h1>
          
          {/* Tab Butonları */}
          <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Tümü ({watchlist.length})
            </button>
            <button
              onClick={() => setActiveTab('movies')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'movies'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Filmler ({movies.length})
            </button>
            <button
              onClick={() => setActiveTab('tv')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'tv'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Diziler ({tvShows.length})
            </button>
          </div>
        </div>

        {/* İçerik Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredWatchlist.map((item) => (
            <Link
              key={item._id}
              href={`/${item.type}/${item.itemId}`}
              className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[2/3]">
                {item.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name || ''}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    {item.type === 'movie' ? (
                      <Film className="w-12 h-12 text-slate-400" />
                    ) : (
                      <Tv className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1 truncate">
                  {item.title || item.name}
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                  {item.vote_average && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{item.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                  {(item.release_date || item.first_air_date) && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(item.release_date || item.first_air_date!).getFullYear()}
                      </span>
                    </div>
                  )}
                </div>
                {item.overview && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                    {item.overview}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Boş Durum */}
        {filteredWatchlist.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Henüz İzleme Listesi Boş</h2>
            <p className="text-slate-600 dark:text-slate-400">
              İzlemek istediğiniz film ve dizileri izleme listenize ekleyerek burada görebilirsiniz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 