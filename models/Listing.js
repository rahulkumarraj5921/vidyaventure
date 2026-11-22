const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a destination or skill listing title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    tagline: {
      type: String,
      trim: true,
      maxlength: [150, 'Tagline cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Heritage & Historical',
        'Spiritual & Pilgrimage',
        'Nature & Eco-Tourism',
        'Art, Culture & Crafts',
        'Adventure & Leisure',
      ],
      default: 'Heritage & Historical',
    },
    district: {
      type: String,
      required: [true, 'Please specify the Bihar district'],
      enum: [
        'Patna',
        'Gaya',
        'Nalanda',
        'Vaishali',
        'Bhagalpur',
        'West Champaran',
        'Rohtas',
        'Jehanabad',
        'Madhubani',
        'Banka',
        'Begusarai',
        'Munger',
        'Saran',
        'Nawada',
        'Kaimur',
        'Muzaffarpur',
        'Sitamarhi',
        'Bhojpur',
        'Aurangabad',
        'Other Districts',
      ],
      default: 'Patna',
    },
    location: {
      type: String,
      required: [true, 'Please provide the specific location or address'],
      trim: true,
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    },
    images: {
      type: [String],
      default: [],
    },
    entryFee: {
      type: Number,
      default: 0,
      min: [0, 'Entry fee cannot be negative'],
    },
    bestSeason: {
      type: String,
      default: 'October to March (Pleasant weather)',
    },
    timings: {
      type: String,
      default: '06:00 AM - 06:00 PM',
    },
    howToReach: {
      air: { type: String, default: 'Nearest Airport: Gaya Airport (GAY) or Jay Prakash Narayan Airport Patna (PAT)' },
      train: { type: String, default: 'Nearest Railway Station with direct connectivity' },
      road: { type: String, default: 'Well-connected via National & State Highways with regular bus and taxi service' },
    },
    highlights: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    authorName: {
      type: String,
      default: 'Bihar State Tourism Board',
    },
    guideAvailable: {
      type: Boolean,
      default: true,
    },
    guideFeePerDay: {
      type: Number,
      default: 800,
    },
    contactNumber: {
      type: String,
      default: '+91 612 2225411',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    coordinates: {
      lat: { type: Number, default: 25.0961 },
      lng: { type: Number, default: 85.3131 },
    },
  },
  {
    timestamps: true,
  }
);

// Add text search index for title, description, district, and category
listingSchema.index({
  title: 'text',
  tagline: 'text',
  description: 'text',
  district: 'text',
  category: 'text',
});

module.exports = mongoose.models.Listing || mongoose.model('Listing', listingSchema);
