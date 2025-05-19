import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['movie', 'tv', 'Scripted'],
  },
  itemId: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// Aynı kullanıcı için aynı içeriği birden fazla kez eklemeyi engelle
watchlistSchema.index({ userId: 1, type: 1, itemId: 1 }, { unique: true });

const Watchlist = mongoose.models.Watchlist || mongoose.model('Watchlist', watchlistSchema);

export default Watchlist; 