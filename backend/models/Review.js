const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reviewText: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  userEmail: {
    type: String,
    required: true,
  },
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
