const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide review comments'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    visitDate: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting multiple reviews for the same listing
reviewSchema.index({ listing: 1, user: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function (listingId) {
  const stats = await this.aggregate([
    { $match: { listing: listingId } },
    {
      $group: {
        _id: '$listing',
        avgRating: { $avg: '$rating' },
        reviewsCount: { $sum: 1 },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model('Listing').findByIdAndUpdate(listingId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        reviewsCount: stats[0].reviewsCount,
      });
    } else {
      await mongoose.model('Listing').findByIdAndUpdate(listingId, {
        rating: 5,
        reviewsCount: 0,
      });
    }
  } catch (err) {
    console.error('Error updating listing rating:', err);
  }
};

// Call calculateAverageRating after save
reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.listing);
});

// Call calculateAverageRating after remove / delete
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.listing);
  }
});

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);
