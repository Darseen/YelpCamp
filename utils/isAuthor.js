const AppError = require("./AppError");
const Campground = require('../models/campground');

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (req.user._id.equals(camp.author)) {
        return next();
    }
    next(new AppError('Request Not Authorized!', 401));
}

module.exports = isAuthor;