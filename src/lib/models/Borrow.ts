
// library-inventory-system\src\lib\models\Borrow.ts


import mongoose from 'mongoose';

const borrowSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrowDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  borrowFee: {
    type: Number,
    default: 0
  },
  feeCollected: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed'
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
borrowSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Borrow = mongoose.models.Borrow || mongoose.model('Borrow', borrowSchema);
