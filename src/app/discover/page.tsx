"use client";

import React, { useState, useEffect } from 'react';
import { discoverMovies, getMovieGenres, getTVGenres, getMovieCertifications, searchPerson, type Genre, type Certification, type PersonSearchResult, type DiscoverFilters } from '@/actions/tmdbApi';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Film, Tv, RefreshCw, ChevronLeft, Calendar, Clock, Globe, Award, Building, Users, Tag, Video, Filter, X, Search } from 'lucide-react';

interface Content {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
}

const sortOptions = [
  { value: 'popularity.desc', label: 'Popülerlik' },
  { value: 'vote_average.desc', label: 'Puan' },
  { value: 'release_date.desc', label: 'Yeni Çıkanlar' },
  { value: 'revenue.desc', label: 'Hasılat' },
  { value: 'vote_count.desc', label: 'Oy Sayısı' },
];

const languageOptions = [
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'İngilizce' },
  { value: 'es', label: 'İspanyolca' },
  { value: 'fr', label: 'Fransızca' },
  { value: 'de', label: 'Almanca' },
  { value: 'it', label: 'İtalyanca' },
  { value: 'ja', label: 'Japonca' },
  { value: 'ko', label: 'Korece' },
  { value: 'ru', label: 'Rusça' },
  { value: 'hi', label: 'Hintçe' },
  { value: 'pt', label: 'Portekizce' },
  { value: 'ar', label: 'Arapça' },
  { value: 'zh', label: 'Çince' },
];

const yearOptions = [
  { value: 2024, label: '2024 ve sonrası' },
  { value: 2023, label: '2023 ve sonrası' },
  { value: 2022, label: '2022 ve sonrası' },
  { value: 2021, label: '2021 ve sonrası' },
  { value: 2020, label: '2020 ve sonrası' },
  { value: 2019, label: '2019 ve sonrası' },
  { value: 2018, label: '2018 ve sonrası' },
  { value: 2017, label: '2017 ve sonrası' },
  { value: 2016, label: '2016 ve sonrası' },
  { value: 2015, label: '2015 ve sonrası' },
  { value: 2014, label: '2014 ve sonrası' },
  { value: 2013, label: '2013 ve sonrası' },
  { value: 2012, label: '2012 ve sonrası' },
  { value: 2011, label: '2011 ve sonrası' },
  { value: 2010, label: '2010 ve sonrası' },
  { value: 0, label: 'Tümü' },
];

const tvStatusOptions = [
  { value: '0', label: 'Devam Eden' },
  { value: '1', label: 'Tamamlanmış' },
  { value: '2', label: 'İptal Edilmiş' },
  { value: '3', label: 'Yakında' },
  { value: '4', label: 'Pilot' },
  { value: '5', label: 'Yapım Aşamasında' },
];

const tvTypeOptions = [
  { value: '0', label: 'Belgesel' },
  { value: '1', label: 'Reality Show' },
  { value: '2', label: 'Talk Show' },
  { value: '3', label: 'Mini Dizi' },
  { value: '4', label: 'Dizi' },
  { value: '5', label: 'Animasyon' },
  { value: '6', label: 'Yarışma' },
];

const watchMonetizationTypes = [
  { value: 'flatrate', label: 'Abonelik' },
  { value: 'free', label: 'Ücretsiz' },
  { value: 'ads', label: 'Reklamlı' },
  { value: 'rent', label: 'Kiralama' },
  { value: 'buy', label: 'Satın Alma' },
];

export default function DiscoverPage() {
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTVGenres] = useState<Genre[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PersonSearchResult[]>([]);
  const [selectedActors, setSelectedActors] = useState<PersonSearchResult[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [filters, setFilters] = useState<DiscoverFilters>({
    media_type: 'movie',
    sort_by: 'popularity.desc',
    'vote_average.gte': 7,
    vote_count_gte: 100,
    year: new Date().getFullYear(),
    with_genres: '',
    with_original_language: '',
    with_runtime_gte: 0,
    with_runtime_lte: 240,
    with_cast: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, tvData] = await Promise.all([
          getMovieGenres(),
          getTVGenres(),
        ]);
        setMovieGenres(movieData.genres);
        setTVGenres(tvData.genres);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [mediaType]);

  useEffect(() => {
    const searchActors = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const data = await searchPerson(searchQuery);
        setSearchResults(data.results);
      } catch (error) {
        console.error('Error searching actors:', error);
      }
    };

    const timeoutId = setTimeout(searchActors, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleActorSelect = (actor: PersonSearchResult) => {
    if (!selectedActors.find(a => a.id === actor.id)) {
      setSelectedActors([...selectedActors, actor]);
      setFilters(prev => ({
        ...prev,
        with_cast: [...selectedActors, actor].map(a => a.id).join(',')
      }));
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleActorRemove = (actorId: number) => {
    const newSelectedActors = selectedActors.filter(a => a.id !== actorId);
    setSelectedActors(newSelectedActors);
    setFilters(prev => ({
      ...prev,
      with_cast: newSelectedActors.map(a => a.id).join(',')
    }));
  };

  const fetchRandomContents = async () => {
    setLoading(true);
    try {
      const data = await discoverMovies({
        ...filters,
        page: Math.floor(Math.random() * 5) + 1,
      });
      
      if (data.results && data.results.length > 0) {
        const shuffled = [...data.results].sort(() => 0.5 - Math.random());
        setContents(shuffled.slice(0, 5));
        setCurrentIndex(0);
      } else {
        setContents([]);
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setContents([]);
      setCurrentIndex(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomContents();
  }, [mediaType]);

  const handleMediaTypeChange = (type: 'movie' | 'tv') => {
    setMediaType(type);
    setContents([]);
    setCurrentIndex(0);
    setFilters(prev => ({
      ...prev,
      media_type: type,
      with_genres: '',
    }));
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? contents.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === contents.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [contents.length]);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguages(prev => {
      const newLanguages = prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language];
      
      setFilters(prevFilters => ({
        ...prevFilters,
        with_original_language: newLanguages.join('|')
      }));
      
      return newLanguages;
    });
  };

  const renderFilterSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-medium text-slate-900 dark:text-white">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          Ana Sayfa
        </Link>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => handleMediaTypeChange('movie')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  mediaType === 'movie'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Film className="w-5 h-5 inline-block mr-2" />
                Film
              </button>
              <button
                onClick={() => handleMediaTypeChange('tv')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  mediaType === 'tv'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Tv className="w-5 h-5 inline-block mr-2" />
                Dizi
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderFilterSection('Sıralama ve Puan', <Award className="w-5 h-5" />, (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Sıralama
                    </label>
                    <select
                      value={filters.sort_by}
                      onChange={(e) => setFilters(prev => ({ ...prev, sort_by: e.target.value }))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Minimum Puan
                    </label>
                    <select
                      value={filters['vote_average.gte']}
                      onChange={(e) => setFilters(prev => ({ ...prev, 'vote_average.gte': Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating}+
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Minimum Oy Sayısı
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={filters.vote_count_gte}
                      onChange={(e) => setFilters(prev => ({ ...prev, vote_count_gte: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                </>
              ))}

              {renderFilterSection('Tarih ve Süre', <Calendar className="w-5 h-5" />, (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Yıl
                    </label>
                    <input
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={filters.year}
                      onChange={(e) => setFilters(prev => ({ ...prev, year: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                      placeholder="Yıl girin (örn: 2024)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Süre (Dakika)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        max="240"
                        value={filters.with_runtime_gte}
                        onChange={(e) => setFilters(prev => ({ ...prev, with_runtime_gte: Number(e.target.value) }))}
                        className="w-1/2 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        min="0"
                        max="240"
                        value={filters.with_runtime_lte}
                        onChange={(e) => setFilters(prev => ({ ...prev, with_runtime_lte: Number(e.target.value) }))}
                        className="w-1/2 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </>
              ))}

              {renderFilterSection('Tür ve Oyuncu', <Tag className="w-5 h-5" />, (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Tür
                    </label>
                    <select
                      value={filters.with_genres}
                      onChange={(e) => setFilters(prev => ({ ...prev, with_genres: e.target.value }))}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                    >
                      <option value="">Tümü</option>
                      {(mediaType === 'movie' ? movieGenres : tvGenres).map((genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Oyuncu Ara (En az birini içeren)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                        placeholder="Oyuncu adı yazın..."
                      />
                      {searchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {searchResults.map((actor) => (
                            <button
                              key={actor.id}
                              onClick={() => handleActorSelect(actor)}
                              className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
                            >
                              {actor.profile_path ? (
                                <Image
                                  src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                                  alt={actor.name}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                  <Users className="w-4 h-4 text-slate-500" />
                                </div>
                              )}
                              <span className="text-slate-900 dark:text-white">{actor.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {selectedActors.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedActors.map((actor) => (
                          <div
                            key={actor.id}
                            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-full px-3 py-1"
                          >
                            {actor.profile_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                                alt={actor.name}
                                width={24}
                                height={24}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                                <Users className="w-3 h-3 text-slate-500" />
                              </div>
                            )}
                            <span className="text-sm text-slate-900 dark:text-white">{actor.name}</span>
                            <button
                              onClick={() => handleActorRemove(actor.id)}
                              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Dil
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {languageOptions.map((lang) => (
                        <button
                          key={lang.value}
                          onClick={() => {
                            const newLanguages = selectedLanguages.includes(lang.value)
                              ? selectedLanguages.filter(l => l !== lang.value)
                              : [...selectedLanguages, lang.value];
                            setSelectedLanguages(newLanguages);
                            setFilters(prev => ({
                              ...prev,
                              with_original_language: newLanguages.join('|')
                            }));
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                            selectedLanguages.includes(lang.value)
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ))}
            </div>

            <button
              onClick={fetchRandomContents}
              disabled={loading}
              className="w-full md:w-auto mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Yükleniyor...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Yeni {mediaType === 'movie' ? 'Film' : 'Dizi'} Öner</span>
                </>
              )}
            </button>
          </div>

          {contents.length === 0 && !loading && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 text-center">
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                Seçilen kriterlere uygun {mediaType === 'movie' ? 'film' : 'dizi'} bulunamadı. Lütfen filtreleri değiştirip tekrar deneyin.
              </p>
            </div>
          )}

          {contents.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 relative aspect-[2/3] bg-slate-200 dark:bg-slate-700">
                  {contents[currentIndex].poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${contents[currentIndex].poster_path}`}
                      alt={contents[currentIndex].title || contents[currentIndex].name || ''}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600 text-3xl">
                      {mediaType === 'movie' ? <Film className="w-12 h-12" /> : <Tv className="w-12 h-12" />}
                    </div>
                  )}
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {contents[currentIndex].title || contents[currentIndex].name}
                    </h2>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-5 h-5" />
                      <span>{contents[currentIndex].vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    {contents[currentIndex].overview}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span>
                      {new Date(contents[currentIndex].release_date || contents[currentIndex].first_air_date || '').getFullYear()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-6">
                    <Link
                      href={`/${mediaType}/${contents[currentIndex].id}`}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                      Detayları Gör
                    </Link>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevious}
                        className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {currentIndex + 1} / {contents.length}
                      </span>
                      <button
                        onClick={handleNext}
                        className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
                      >
                        <ChevronLeft className="w-5 h-5 rotate-180" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 