import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Watchlist from '@/models/Watchlist';
import { verifyToken } from '@/lib/auth';
import { getMovieDetails, getTVShowDetails } from '@/actions/tmdbApi';

export async function POST(req: NextRequest) {
  try {
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

    if (!['movie', 'tv', 'Scripted'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    await connectDB();

    const watchlist = await Watchlist.create({
      userId,
      type,
      itemId
    });

    return NextResponse.json(watchlist);
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Already in watchlist' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
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

    const result = await Watchlist.deleteOne({
      userId,
      type,
      itemId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Watchlist item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Removed from watchlist' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
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

    const watchlist = await Watchlist.find(query);

    const watchlistWithDetails = await Promise.all(
      watchlist.map(async (item) => {
        let details = null;
        try {
          const contentType = item.type === 'Scripted' ? 'tv' : item.type;
          
          switch (contentType) {
            case 'movie':
              details = await getMovieDetails(item.itemId.toString());
              break;
            case 'tv':
              details = await getTVShowDetails(item.itemId.toString());
              break;
          }
        } catch (error) {
          console.error(`Error fetching details for ${item.type} ${item.itemId}:`, error);
        }

        return {
          _id: item._id,
          type: item.type === 'Scripted' ? 'tv' : item.type,
          itemId: item.itemId,
          ...details
        };
      })
    );

    return NextResponse.json(watchlistWithDetails);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 