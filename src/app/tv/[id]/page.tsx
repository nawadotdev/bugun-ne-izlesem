import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Calendar, Globe, Users, Play, Tv } from "lucide-react";
import { getTVShowDetails, getTVShowCredits, getTVShowWatchProviders } from "@/actions/tmdbApi";
import type { TVShow, Credits, WatchProviders } from "@/actions/tmdbApi";
import FavoriteButton from '@/components/FavoriteButton';
import WatchlistButton from '@/components/WatchlistButton';

export default async function TVShowPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const [tvShow, credits, watchProviders] = await Promise.all([
    getTVShowDetails(id),
    getTVShowCredits(id),
    getTVShowWatchProviders(id)
  ]);

  if (!tvShow) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Hata</h2>
          <p>Dizi bulunamadı</p>
        </div>
      </div>
    );
  }

  // Yaratıcıları bul
  const creators = credits.crew.filter(person => person.job === "Creator");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`}
          alt={tvShow.name}
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

        {/* Favori ve İzleme Listesi Butonları */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <WatchlistButton type="tv" itemId={tvShow.id} size={32} />
          <FavoriteButton type="tv" itemId={tvShow.id} size={32} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {tvShow.name}
            </h1>
            {tvShow.tagline && (
              <p className="text-xl text-slate-200 mb-6 italic">
                "{tvShow.tagline}"
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span>{tvShow.vote_average.toFixed(1)}</span>
                <span className="text-slate-300">({tvShow.vote_count} oy)</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <Calendar className="w-5 h-5" />
                <span>{new Date(tvShow.first_air_date).toLocaleDateString("tr-TR")}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <Clock className="w-5 h-5" />
                <span>{tvShow.episode_run_time[0]} dakika</span>
              </div>
            </div>

            {/* İzleme Seçenekleri */}
            {watchProviders?.flatrate && watchProviders.flatrate.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-slate-300">İzle:</span>
                <div className="flex gap-4">
                  {watchProviders.flatrate.map((provider) => (
                    <div
                      key={provider.id}
                      className="relative w-8 h-8"
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                        alt={provider.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
              <Image
                src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                alt={tvShow.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            {tvShow.overview && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Özet</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {tvShow.overview}
                </p>
              </div>
            )}

            {tvShow.genres && tvShow.genres.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Türler</h2>
                <div className="flex flex-wrap gap-2">
                  {tvShow.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Yaratıcılar */}
            {creators.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Yaratıcılar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {creators.map((creator) => (
                    <Link
                      key={creator.id}
                      href={`/person/${creator.id}`}
                      className="flex items-center gap-4 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                    >
                      {creator.profile_path ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden">
                          <Image
                            src={`https://image.tmdb.org/t/p/w185${creator.profile_path}`}
                            alt={creator.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                          <Users className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{creator.name}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Yaratıcı</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Oyuncular */}
            {credits.cast.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Oyuncular</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {credits.cast.slice(0, 8).map((actor) => (
                    <Link
                      key={actor.id}
                      href={`/person/${actor.id}`}
                      className="flex flex-col items-center text-center hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                    >
                      <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
                        {actor.profile_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                            alt={actor.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                            <Users className="w-8 h-8 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm">{actor.name}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{actor.character}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Yapım Şirketleri */}
              {tvShow.production_companies && tvShow.production_companies.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Yapım Şirketleri</h2>
                  <ul className="space-y-2">
                    {tvShow.production_companies.map((company) => (
                      <li key={company.id} className="flex items-center gap-2">
                        {company.logo_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                            alt={company.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        ) : (
                          <Users className="w-5 h-5 text-slate-400" />
                        )}
                        <span>{company.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Üretim Ülkeleri */}
              {tvShow.production_countries && tvShow.production_countries.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Üretim Ülkeleri</h2>
                  <ul className="space-y-2">
                    {tvShow.production_countries.map((country) => (
                      <li key={country.iso_3166_1} className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-slate-400" />
                        <span>{country.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}