"use client";

import React, { useState, useEffect } from 'react';
import { getTrendingAll, getTrendingMovies, getTrendingTV, getTrendingPersons } from '@/actions/tmdbApi';
import type { TrendingResult } from '@/actions/tmdbApi';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Film, Tv, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const typeIcon = {
  movie: <Film className="w-5 h-5 text-blue-500" />,
  tv: <Tv className="w-5 h-5 text-green-500" />,
  person: <Users className="w-5 h-5 text-purple-500" />,
};

function getTypeIcon(type: string) {
  if (type === 'movie') return typeIcon.movie;
  if (type === 'tv') return typeIcon.tv;
  if (type === 'person') return typeIcon.person;
  return null;
}

function getCardLink(item: TrendingResult) {
  if (item.media_type === 'movie') return `/movie/${item.id}`;
  if (item.media_type === 'tv') return `/tv/${item.id}`;
  if (item.media_type === 'person') return `/person/${item.id}`;
  return '#';
}

function getCardTitle(item: TrendingResult) {
  return item.title || item.name || 'İsimsiz';
}

function getCardImage(item: TrendingResult) {
  if (item.media_type === 'person') return item.profile_path;
  return item.poster_path;
}

const TrendSection: React.FC = () => {
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('day');
  const [contentType, setContentType] = useState<'all' | 'movie' | 'tv' | 'person'>('all');
  const [trends, setTrends] = useState<TrendingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        let data;
        switch (contentType) {
          case 'movie':
            data = await getTrendingMovies(timeWindow);
            break;
          case 'tv':
            data = await getTrendingTV(timeWindow);
            break;
          case 'person':
            data = await getTrendingPersons(timeWindow);
            break;
          default:
            data = await getTrendingAll(timeWindow);
        }
        setTrends(data.results);
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeWindow, contentType]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="w-full py-8 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trend</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">Günün en popüler içerikleri</p>
            </div>
            <div className="flex gap-2">
              <button
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeWindow === 'day' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                onClick={() => setTimeWindow('day')}
              >
                Bugün
              </button>
              <button
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeWindow === 'week' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                onClick={() => setTimeWindow('week')}
              >
                Bu Hafta
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                contentType === 'all' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              onClick={() => setContentType('all')}
            >
              Tümü
            </button>
            <button
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                contentType === 'movie' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              onClick={() => setContentType('movie')}
            >
              Filmler
            </button>
            <button
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                contentType === 'tv' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              onClick={() => setContentType('tv')}
            >
              Diziler
            </button>
            <button
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                contentType === 'person' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              onClick={() => setContentType('person')}
            >
              Kişiler
            </button>
          </div>
        </div>

        <div className="relative min-h-[280px]">
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="flex gap-4 w-full px-1">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-900 rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-slate-100 dark:border-slate-800 w-[180px] flex-shrink-0"
                  >
                    <div className="relative w-full aspect-[2/3] bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    <div className="flex-1 flex flex-col p-3">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-1" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-1" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mt-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => scroll('left')}
                className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-900 p-2 rounded-full shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 border border-slate-200 dark:border-slate-800"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {trends.map((item, index) => (
                  <Link
                    key={item.media_type + '-' + item.id}
                    href={getCardLink(item)}
                    className="group bg-white dark:bg-slate-900 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col h-full border border-slate-100 dark:border-slate-800 w-[180px] flex-shrink-0 snap-start hover:-translate-y-1"
                  >
                    <div className="relative w-full aspect-[2/3] bg-slate-200 dark:bg-slate-800">
                      {getCardImage(item) ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w300${getCardImage(item)}`}
                          alt={getCardTitle(item)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="180px"
                          priority={index < 6}
                          loading={index < 6 ? "eager" : "lazy"}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600 text-3xl">
                          {getTypeIcon(item.media_type)}
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-white/90 dark:bg-slate-900/90 rounded-full p-1 shadow-md backdrop-blur-sm">
                        {getTypeIcon(item.media_type)}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col p-3">
                      <h3 className="font-medium text-sm text-slate-900 dark:text-white truncate mb-1">
                        {getCardTitle(item)}
                      </h3>
                      {item.media_type !== 'person' && (
                        <div className="flex items-center gap-1 text-yellow-500 text-xs mb-1">
                          <Star className="w-3 h-3" />
                          <span>{item.vote_average?.toFixed(1) ?? '-'}</span>
                        </div>
                      )}
                      {item.media_type === 'person' && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">Kişi</span>
                      )}
                      <span className="text-xs text-slate-400 mt-auto">
                        {item.media_type === 'movie' && item.release_date ? new Date(item.release_date).getFullYear() : ''}
                        {item.media_type === 'tv' && item.first_air_date ? new Date(item.first_air_date).getFullYear() : ''}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <button
                onClick={() => scroll('right')}
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-900 p-2 rounded-full shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 border border-slate-200 dark:border-slate-800"
              >
                <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendSection; 