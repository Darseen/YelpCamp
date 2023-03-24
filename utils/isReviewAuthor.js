const Review = require("../models/review");
const AppError = require("./AppError");

const isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (req.user._id.equals(review.author)) {
        return next();
    }
    next(new AppError('Request Not Authorized', 401));
}

module.exports = isReviewAuthor;