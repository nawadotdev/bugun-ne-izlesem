"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { BookmarkPlus, BookmarkCheck } from 'lucide-react';

interface WatchlistButtonProps {
  type: 'movie' | 'tv' | 'Scripted';
  itemId: number;
  size?: number;
}

export default function WatchlistButton({ type, itemId, size = 24 }: WatchlistButtonProps) {
  const { user, token } = useUser();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkWatchlistStatus();
    }
  }, [user, type, itemId]);

  const checkWatchlistStatus = async () => {
    try {
      const response = await fetch(`/api/watchlist?type=${type}&itemId=${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsInWatchlist(data.length > 0);
      }
    } catch (error) {
      console.error('Error checking watchlist status:', error);
    }
  };

  const toggleWatchlist = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/watchlist', {
        method: isInWatchlist ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, itemId }),
      });

      if (response.ok) {
        setIsInWatchlist(!isInWatchlist);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={toggleWatchlist}
      disabled={isLoading}
      className={`transition-colors ${
        isInWatchlist
          ? 'text-green-500 hover:text-green-600'
          : 'text-slate-400 hover:text-slate-300'
      }`}
      title={isInWatchlist ? 'İzleme Listesinden Çıkar' : 'İzleme Listesine Ekle'}
    >
      {isInWatchlist ? (
        <BookmarkCheck size={size} />
      ) : (
        <BookmarkPlus size={size} />
      )}
    </button>
  );
} 