import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Calendar, Globe, Users, Play, Tv, ExternalLink, ShoppingCart, CreditCard } from "lucide-react";
import { getMovieDetails, getMovieCredits, getMovieWatchProviders } from "@/actions/tmdbApi";
import type { Movie, Credits, WatchProviders } from "@/actions/tmdbApi";
import FavoriteButton from '@/components/FavoriteButton';
import WatchlistButton from '@/components/WatchlistButton';

type Params = Promise<{
  id: string;
}>;

export default async function MoviePage(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const [movie, credits, watchProviders] = await Promise.all([
    getMovieDetails(id),
    getMovieCredits(id),
    getMovieWatchProviders(id)
  ]);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Hata</h2>
          <p>Film bulunamadı</p>
        </div>
      </div>
    );
  }


  const director = credits.crew.find(person => person.job === "Director");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

        {/* Favori ve İzleme Listesi Butonları */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <WatchlistButton type="movie" itemId={movie.id} size={32} />
          <FavoriteButton type="movie" itemId={movie.id} size={32} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-xl text-slate-200 mb-6 italic">
                "{movie.tagline}"
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span>{movie.vote_average.toFixed(1)}</span>
                <span className="text-slate-300">({movie.vote_count} oy)</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <Calendar className="w-5 h-5" />
                <span>{new Date(movie.release_date).toLocaleDateString("tr-TR")}</span>
              </div>
              {movie.runtime > 0 && (
                <div className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-5 h-5" />
                  <span>{movie.runtime} dakika</span>
                </div>
              )}
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
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            {movie.overview && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Özet</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {movie.overview}
                </p>
              </div>
            )}

            {movie.genres && movie.genres.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Türler</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
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

            {/* Yönetmen */}
            {director && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Yönetmen</h2>
                <Link href={`/person/${director.id}`} className="flex items-center gap-4 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors">
                  {director.profile_path ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${director.profile_path}`}
                        alt={director.name}
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
                    <h3 className="font-semibold">{director.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{director.job}</p>
                  </div>
                </Link>
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
          </div>
        </div>
      </div>
    </div>
  );
}