const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');


router.get('/', reviewController.getAllReviews);         // GET /reviews
router.get('/:id', reviewController.getReviewById);      // GET /reviews/:id
router.post('/', reviewController.createReview);         // POST /reviews
router.put('/:id', reviewController.updateReview);       // PUT /reviews/:id
router.delete('/:id', reviewController.deleteReview);    // DELETE /reviews/:id

module.exports = router;
