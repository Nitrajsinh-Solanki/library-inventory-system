// library-inventory-system\src\lib\models\FareSetting.ts


import mongoose from 'mongoose';

const fareSettingSchema = new mongoose.Schema({
  borrowDuration: {
    type: Number,
    required: true,
    default: 14, // Default borrow duration in days
    min: 1
  },
  borrowFee: {
    type: Number,
    required: true,
    default: 0, // Default fee for borrowing
    min: 0
  },
  lateFeePerDay: {
    type: Number,
    required: true,
    default: 1, // Default late fee per day
    min: 0
  },
  maxBorrowDuration: {
    type: Number,
    required: true,
    default: 30, // Maximum allowed borrow duration in days
    min: 1
  },
  currency: {
    type: String,
    required: true,
    default: '$', // Default currency symbol
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
fareSettingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const FareSetting = mongoose.models.FareSetting || mongoose.model('FareSetting', fareSettingSchema);
