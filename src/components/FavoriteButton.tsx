"use client";

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  type: 'movie' | 'tv' | 'person';
  itemId: number;
  size?: number;
}

export default function FavoriteButton({ type, itemId, size = 24 }: FavoriteButtonProps) {
  const { user, token} = useUser();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, type, itemId]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(
        `/api/favorites?type=${type}&itemId=${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setIsFavorited(data.length > 0);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Favori eklemek için giriş yapmalısınız');
      return;
    }

    setIsLoading(true);
    try {
      const method = isFavorited ? 'DELETE' : 'POST';
      const response = await fetch('/api/favorites', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, itemId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update favorite status');
      }

      setIsFavorited(!isFavorited);
      toast.success(isFavorited ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi');
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toast.error(error.message || 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className="text-slate-400 hover:text-yellow-400 transition-colors disabled:opacity-50"
    >
      <Star
        size={size}
        className={isFavorited ? 'fill-yellow-400 text-yellow-400' : ''}
      />
    </button>
  );
} 