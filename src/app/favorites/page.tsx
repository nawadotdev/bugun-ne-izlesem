"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Film, Tv, Users, Calendar, MapPin, Cake, User } from 'lucide-react';

interface Favorite {
  _id: string;
  type: 'movie' | 'tv' | 'person'
  itemId: number;
  title?: string;
  name?: string;
  poster_path?: string;
  profile_path?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  known_for_department?: string;
  biography?: string;
  birthday?: string;
  place_of_birth?: string;
  gender?: number;
  popularity?: number;
}

export default function FavoritesPage() {
  const { user, token } = useUser();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'tv' | 'people'>('all');

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      console.log('Fetched favorites:', data);
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
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
            Favorilerinizi görmek için lütfen giriş yapın.
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

  const movies = favorites.filter(fav => fav.type === 'movie');
  const tvShows = favorites.filter(fav => fav.type === 'tv');
  const people = favorites.filter(fav => fav.type === 'person');

  const filteredFavorites = activeTab === 'all' 
    ? favorites 
    : activeTab === 'movies' 
      ? movies 
      : activeTab === 'tv' 
        ? tvShows 
        : people;

  return (
    <div className="min-h-screen py-8 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Favorilerim</h1>
          
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
              Tümü ({favorites.length})
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
            <button
              onClick={() => setActiveTab('people')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'people'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Kişiler ({people.length})
            </button>
          </div>
        </div>

        {/* İçerik Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredFavorites.map((item) => (
            <Link
              key={item._id}
              href={`/${item.type}/${item.itemId}`}
              className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[2/3]">
                {item.poster_path || item.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}`}
                    alt={item.title || item.name || ''}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    {item.type === 'movie' ? (
                      <Film className="w-12 h-12 text-slate-400" />
                    ) : item.type === 'tv' ? (
                      <Tv className="w-12 h-12 text-slate-400" />
                    ) : (
                      <Users className="w-12 h-12 text-slate-400" />
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
                  {item.type === 'person' && item.known_for_department && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{item.known_for_department}</span>
                    </div>
                  )}
                </div>
                {item.type === 'person' && (
                  <div className="flex flex-wrap gap-2 mt-2 text-xs text-slate-600 dark:text-slate-400">
                    {item.birthday && (
                      <div className="flex items-center gap-1">
                        <Cake className="w-3 h-3" />
                        <span>
                          {new Date().getFullYear() - new Date(item.birthday).getFullYear()} yaşında
                        </span>
                      </div>
                    )}
                    {item.gender !== undefined && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>
                          {item.gender === 1 ? 'Kadın' : item.gender === 2 ? 'Erkek' : 'Belirtilmemiş'}
                        </span>
                      </div>
                    )}
                    {item.place_of_birth && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{item.place_of_birth}</span>
                      </div>
                    )}
                  </div>
                )}
                {item.overview && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                    {item.overview}
                  </p>
                )}
                {item.type === 'person' && item.biography && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                    {item.biography}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Boş Durum */}
        {filteredFavorites.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Henüz Favori Eklenmemiş</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Beğendiğiniz film, dizi ve kişileri favorilere ekleyerek burada görebilirsiniz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 