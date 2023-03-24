const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.create = async (req, res) => {
    const { id } = req.params;
    const { body, rating } = req.body;
    const camp = await Campground.findById(id);
    const review = await Review.create({ body, rating, author: req.user._id });
    camp.reviews.push(review._id);
    await camp.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${id}/show`);
}

module.exports.delete = async (req, res) => {
    const { id, reviewId } = req.params;
    const camp = await Campground.findById(id);
    await camp.reviews.pull(reviewId);
    await Review.findByIdAndDelete(reviewId);
    await camp.save();
    req.flash('success', 'Review deleted');
    res.redirect(`/campgrounds/${id}/show`);
}