const Review = require('../models/Review');

// Retrieve all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve a review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { title, author, rating, reviewText, dateAdded, userEmail } = req.body;
    if (!userEmail) {
      return res.status(400).json({ message: 'userEmail is required' });
    }
    
    const newReview = new Review({
      title,
      author,
      rating,
      reviewText,
      dateAdded,
      userEmail,
    });

    await newReview.save();
    res.status(201).json(newReview); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.updateReview = async (req, res) => {
  try {
    const { title, author, rating, reviewText, dateAdded } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        rating,
        reviewText,
        dateAdded,
      },
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review by ID
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
