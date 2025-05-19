import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Favorite from '@/models/Favorite';
import { verifyToken } from '@/lib/auth'
import { getMovieDetails, getTVShowDetails, getPersonDetails } from '@/actions/tmdbApi';

export async function POST(req: NextRequest) {
  try {
    // Token kontrolü
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { type, itemId } = await req.json();

    if (!type || !itemId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['movie', 'tv', 'person'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    await connectDB();

    const favorite = await Favorite.create({
      userId,
      type,
      itemId
    });

    return NextResponse.json(favorite);
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Already favorited' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Token kontrolü
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { type, itemId } = await req.json();

    if (!type || !itemId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const result = await Favorite.deleteOne({
      userId,
      type,
      itemId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Favorite removed' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Token kontrolü
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const itemId = searchParams.get('itemId');

    await connectDB();

    const query: any = { userId };
    if (type) query.type = type;
    if (itemId) query.itemId = Number(itemId);

    const favorites = await Favorite.find(query);

    // Favori öğelerin detaylarını TMDB API'den al
    const favoritesWithDetails = await Promise.all(
      favorites.map(async (favorite) => {
        let details = null;
        try {
          // scripted tipini tv olarak işle
          const contentType = favorite.type === 'Scripted' ? 'tv' : favorite.type;
          
          switch (contentType) {
            case 'movie':
              details = await getMovieDetails(favorite.itemId.toString());
              break;
            case 'tv':
              details = await getTVShowDetails(favorite.itemId.toString());
              break;
            case 'person':
              details = await getPersonDetails(favorite.itemId.toString());
              break;
          }
        } catch (error) {
          console.error(`Error fetching details for ${favorite.type} ${favorite.itemId}:`, error);
        }

        return {
          _id: favorite._id,
          type: favorite.type === 'scripted' ? 'tv' : favorite.type,
          itemId: favorite.itemId,
          ...details
        };
      })
    );

    return NextResponse.json(favoritesWithDetails);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 