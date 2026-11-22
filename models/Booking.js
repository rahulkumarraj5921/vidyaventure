const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'Listing reference is required'],
    },
    listingTitle: {
      type: String,
      required: true,
    },
    listingImage: {
      type: String,
      default: '',
    },
    district: {
      type: String,
      default: '',
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
    userEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: [true, 'Please provide your contact phone number'],
    },
    visitDate: {
      type: Date,
      required: [true, 'Please select your intended visit date'],
    },
    guestsCount: {
      type: Number,
      required: true,
      min: [1, 'At least 1 guest is required'],
      max: [50, 'Maximum 50 guests per group'],
      default: 1,
    },
    needGuide: {
      type: Boolean,
      default: true,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    specialRequests: {
      type: String,
      default: '',
      maxlength: [500, 'Special requests cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Completed', 'Cancelled'],
      default: 'Confirmed',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
