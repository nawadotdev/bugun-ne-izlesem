import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'movie' | 'tv' | 'person';
  itemId: number;
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['movie', 'tv', 'person'],
    required: true
  },
  itemId: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can't favorite the same item twice
FavoriteSchema.index({ userId: 1, type: 1, itemId: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema); 