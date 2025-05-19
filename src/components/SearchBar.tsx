"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Film, Tv, Users, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { searchMulti } from "@/actions/tmdbApi";
import type { SearchResult } from "@/actions/tmdbApi";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await searchMulti(searchQuery);
      setResults(data.results);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery, handleSearch]);

  const getItemLink = (item: SearchResult) => {
    switch (item.media_type) {
      case "movie":
        return `/movie/${item.id}`;
      case "tv":
        return `/tv/${item.id}`;
      case "person":
        return `/person/${item.id}`;
      default:
        return "#";
    }
  };

  const getItemTitle = (item: SearchResult) => {
    switch (item.media_type) {
      case "movie":
        return item.title;
      case "tv":
        return item.name;
      case "person":
        return item.name;
      default:
        return "İsimsiz";
    }
  };

  const getItemIcon = (item: SearchResult) => {
    switch (item.media_type) {
      case "movie":
        return <Film className="w-4 h-4" />;
      case "tv":
        return <Tv className="w-4 h-4" />;
      case "person":
        return <Users className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getItemImage = (item: SearchResult) => {
    if (item.media_type === "person") {
      return item.profile_path;
    }
    return item.poster_path;
  };

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Film, dizi veya kişi ara..."
          className="w-full px-4 py-2 pl-10 bg-slate-100 dark:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-lg max-h-[60vh] overflow-y-auto z-50">
          {results.map((item) => (
            <Link
              key={`${item.media_type}-${item.id}`}
              href={getItemLink(item)}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                {getItemImage(item) ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w92${getItemImage(item)}`}
                    alt={getItemTitle(item) || "İsimsiz"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    {getItemIcon(item)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{getItemTitle(item)}</span>
                  {getItemIcon(item)}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {item.media_type === "movie" && item.release_date
                    ? new Date(item.release_date).getFullYear()
                    : item.media_type === "tv" && item.first_air_date
                    ? new Date(item.first_air_date).getFullYear()
                    : item.media_type === "person"
                    ? "Kişi"
                    : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 