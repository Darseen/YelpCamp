const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const { validateReview } = require('../utils/validateSchemas');
const isLoggedIn = require('../utils/isLoggedin');
const isReviewAuthor = require('../utils/isReviewAuthor');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.create));
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.delete));

module.exports = router;