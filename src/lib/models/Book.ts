import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String,
    default: ''
  },
  genre: {
    type: String,
    trim: true
  },
  publishedYear: {
    type: Number
  },
  publisher: {
    type: String,
    trim: true
  },
  available: {
    type: Boolean,
    default: true
  },
  totalCopies: {
    type: Number,
    default: 1
  },
  availableCopies: {
    type: Number,
    default: 1
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
bookSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);