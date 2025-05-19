import Image from "next/image";
import Link from "next/link";
import { Star, Calendar, Globe, Users, Film, Tv, Facebook, Instagram, Twitter, Youtube, ExternalLink } from "lucide-react";
import { getPersonDetails, getPersonCombinedCredits, getPersonExternalIds } from "@/actions/tmdbApi";
import type { Person, CombinedCredit, ExternalIds } from "@/actions/tmdbApi";
import FavoriteButton from '@/components/FavoriteButton';

export default async function PersonPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const [person, credits, externalIds] = await Promise.all([
    getPersonDetails(id),
    getPersonCombinedCredits(id),
    getPersonExternalIds(id)
  ]);

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Hata</h2>
          <p>Kişi bulunamadı</p>
        </div>
      </div>
    );
  }

  // Film ve dizi rollerini ayır ve sırala
  const movies = credits.cast
    .filter(credit => credit.media_type === 'movie' && credit.release_date)
    .sort((a, b) => new Date(b.release_date!).getTime() - new Date(a.release_date!).getTime());

  const tvShows = credits.cast
    .filter(credit => credit.media_type === 'tv' && credit.first_air_date)
    .sort((a, b) => new Date(b.first_air_date!).getTime() - new Date(a.first_air_date!).getTime());

  // Yapım ekibi rollerini ayır ve sırala
  const movieCrew = credits.crew
    .filter(credit => credit.media_type === 'movie' && credit.release_date)
    .sort((a, b) => new Date(b.release_date!).getTime() - new Date(a.release_date!).getTime())
    .reduce((unique, credit) => {
      // Eğer bu film ID'si daha önce eklenmemişse ekle
      if (!unique.some(item => item.id === credit.id)) {
        unique.push(credit);
      }
      return unique;
    }, [] as CombinedCredit[]);

  const tvCrew = credits.crew
    .filter(credit => credit.media_type === 'tv' && credit.first_air_date)
    .sort((a, b) => new Date(b.first_air_date!).getTime() - new Date(a.first_air_date!).getTime())
    .reduce((unique, credit) => {
      // Eğer bu dizi ID'si daha önce eklenmemişse ekle
      if (!unique.some(item => item.id === credit.id)) {
        unique.push(credit);
      }
      return unique;
    }, [] as CombinedCredit[]);

  // Sosyal medya linkleri
  const socialLinks = [
    { id: 'imdb', icon: ExternalLink, url: externalIds.imdb_id ? `https://www.imdb.com/name/${externalIds.imdb_id}` : null },
    { id: 'facebook', icon: Facebook, url: externalIds.facebook_id ? `https://www.facebook.com/${externalIds.facebook_id}` : null },
    { id: 'instagram', icon: Instagram, url: externalIds.instagram_id ? `https://www.instagram.com/${externalIds.instagram_id}` : null },
    { id: 'twitter', icon: Twitter, url: externalIds.twitter_id ? `https://twitter.com/${externalIds.twitter_id}` : null },
    { id: 'youtube', icon: Youtube, url: externalIds.youtube_id ? `https://www.youtube.com/${externalIds.youtube_id}` : null },
  ].filter(link => link.url);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full">
        {person.profile_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
            alt={person.name}
            fill
            className="object-cover brightness-50"
            priority
          />
        ) : (
          <div className="w-full h-full bg-slate-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

        {/* Favori Butonu */}
        <div className="absolute top-4 right-4 z-50">
          <FavoriteButton type="person" itemId={person.id} size={32} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {person.name}
            </h1>
            {person.known_for_department && (
              <p className="text-xl text-slate-200 mb-6">
                {person.known_for_department}
              </p>
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
              {person.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                  <Users className="w-16 h-16 text-slate-400" />
                </div>
              )}
            </div>

            {/* Kişisel Bilgiler */}
            <div className="mt-6 space-y-4">
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Kişisel Bilgiler</h3>
                
                {person.gender !== undefined && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Users className="w-5 h-5 text-slate-400" />
                    <span>Cinsiyet: {person.gender === 1 ? 'Kadın' : person.gender === 2 ? 'Erkek' : 'Belirtilmemiş'}</span>
                  </div>
                )}

                {person.birthday && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <span>Doğum Tarihi: {new Date(person.birthday).toLocaleDateString("tr-TR")}</span>
                  </div>
                )}

                {person.place_of_birth && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Globe className="w-5 h-5 text-slate-400" />
                    <span>Doğum Yeri: {person.place_of_birth}</span>
                  </div>
                )}
              </div>

              {/* Sosyal Medya Linkleri */}
              {socialLinks.length > 0 && (
                <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Sosyal Medya</h3>
                  <div className="flex gap-4">
                    {socialLinks.map(({ id, icon: Icon, url }) => (
                      <Link
                        key={id}
                        href={url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      >
                        <Icon className="w-6 h-6" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-8">
            {person.biography && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Biyografi</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {person.biography}
                </p>
              </div>
            )}

            {/* Film Rolleri */}
            {movies.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Film Rolleri ({movies.length})</h2>
                <div className="relative">
                  <div className="overflow-x-auto pb-4">
                    <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
                      {movies.map((credit) => (
                        <Link
                          key={`${credit.credit_id}-${credit.id}`}
                          href={`/movie/${credit.id}`}
                          className="flex flex-col w-48 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                        >
                          <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                            {credit.poster_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w185${credit.poster_path}`}
                                alt={credit.title || credit.name || 'İsimsiz'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                <Film className="w-8 h-8 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm">{credit.title || credit.name || 'İsimsiz'}</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {credit.character}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(credit.release_date!).getFullYear()}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dizi Rolleri */}
            {tvShows.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Dizi Rolleri ({tvShows.length})</h2>
                <div className="relative">
                  <div className="overflow-x-auto pb-4">
                    <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
                      {tvShows.map((credit) => (
                        <Link
                          key={`${credit.credit_id}-${credit.id}`}
                          href={`/tv/${credit.id}`}
                          className="flex flex-col w-48 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                        >
                          <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                            {credit.poster_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w185${credit.poster_path}`}
                                alt={credit.name || 'İsimsiz'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                <Tv className="w-8 h-8 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm">{credit.name || 'İsimsiz'}</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {credit.character}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(credit.first_air_date!).getFullYear()}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Film Yapım Ekibi Rolleri */}
            {movieCrew.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Film Yapım Ekibi Rolleri ({movieCrew.length})</h2>
                <div className="relative">
                  <div className="overflow-x-auto pb-4">
                    <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
                      {movieCrew.map((credit) => (
                        <Link
                          key={`${credit.id}-${credit.credit_id}`}
                          href={`/movie/${credit.id}`}
                          className="flex flex-col w-48 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                        >
                          <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                            {credit.poster_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w185${credit.poster_path}`}
                                alt={credit.title || 'İsimsiz'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                <Film className="w-8 h-8 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm">{credit.title || 'İsimsiz'}</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {credit.job}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(credit.release_date!).getFullYear()}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dizi Yapım Ekibi Rolleri */}
            {tvCrew.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Dizi Yapım Ekibi Rolleri ({tvCrew.length})</h2>
                <div className="relative">
                  <div className="overflow-x-auto pb-4">
                    <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
                      {tvCrew.map((credit) => (
                        <Link
                          key={`${credit.id}-${credit.credit_id}`}
                          href={`/tv/${credit.id}`}
                          className="flex flex-col w-48 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
                        >
                          <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                            {credit.poster_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w185${credit.poster_path}`}
                                alt={credit.name || 'İsimsiz'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                <Tv className="w-8 h-8 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm">{credit.name || 'İsimsiz'}</h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {credit.job}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(credit.first_air_date!).getFullYear()}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 