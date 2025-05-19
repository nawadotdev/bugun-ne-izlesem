"use client";

import React, { useState, useEffect } from 'react';
import { getAiringTodayTVShows, getOnTheAirTVShows, getPopularTVShows, getTopRatedTVShows } from '@/actions/tmdbApi';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight, Tv } from 'lucide-react';

interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
}

interface TVShowListResponse {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}

type TVShowListType = 'airing_today' | 'on_the_air' | 'popular' | 'top_rated';

const listTitles = {
  airing_today: 'Bugün Yayınlananlar',
  on_the_air: 'Yayında',
  popular: 'Popüler Diziler',
  top_rated: 'En İyi Diziler',
};

const fetchFunctions = {
  airing_today: getAiringTodayTVShows,
  on_the_air: getOnTheAirTVShows,
  popular: getPopularTVShows,
  top_rated: getTopRatedTVShows,
};

const TVShowList: React.FC = () => {
  const [listType, setListType] = useState<TVShowListType>('popular');
  const [shows, setShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetchFunctions[listType]()
      .then((data: TVShowListResponse) => {
        if (data && data.results) {
          setShows(data.results);
        } else {
          setShows([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching TV shows:', error);
        setShows([]);
      })
      .finally(() => setLoading(false));
  }, [listType]);

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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Diziler</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">En yeni ve popüler diziler</p>
            </div>
            <div className="flex gap-2">
              <button
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  listType === 'airing_today' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                onClick={() => setListType('airing_today')}
              >
                Bugün Yayınlananlar
              </button>
              <button
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  listType === 'on_the_air' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                onClick={() => setListType('on_the_air')}
              >
                Yayında
              </button>
              <button
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  listType === 'popular' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                onClick={() => setListType('popular')}
              >
                Popüler
              </button>
              <button
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  listType === 'top_rated' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                onClick={() => setListType('top_rated')}
              >
                En İyiler
              </button>
            </div>
          </div>
        </div>

        <div className="relative min-h-[280px]">
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <span className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Yükleniyor...</span>
            </div>
          ) : (
            <>
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
                {shows.map((show) => (
                  <Link
                    key={show.id}
                    href={`/tv/${show.id}`}
                    className="group bg-white dark:bg-slate-900 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col h-full border border-slate-100 dark:border-slate-800 w-[180px] flex-shrink-0 snap-start hover:-translate-y-1"
                  >
                    <div className="relative w-full aspect-[2/3] bg-slate-200 dark:bg-slate-800">
                      {show.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                          alt={show.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="180px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-tv.png';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600 text-3xl">
                          <Tv className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col p-3">
                      <h3 className="font-medium text-sm text-slate-900 dark:text-white truncate mb-1">
                        {show.name}
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-500 text-xs mb-1">
                        <Star className="w-3 h-3" />
                        <span>{show.vote_average?.toFixed(1) ?? '-'}</span>
                      </div>
                      <span className="text-xs text-slate-400 mt-auto">
                        {show.first_air_date ? new Date(show.first_air_date).getFullYear() : ''}
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
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TVShowList; 