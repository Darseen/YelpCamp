const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index');
const axios = require('axios');

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.new = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.create = async (req, res) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${req.body.location}, USA&limit=1`;
    const response = await axios.get(url);
    let [lat, lon] = [0, 0];
    if (response.data[0]) {
        lat = response.data[0].lat;
        lon = response.data[0].lon;
    }

    const { title, location, price, description } = req.body;
    const camp = new Campground({ title, location, price, description, lat, lon });
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user._id;
    await camp.save();

    req.flash('success', "Successfully made a new campground");
    res.redirect(`/campgrounds/${camp._id}/show`);
}

module.exports.edit = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'Campground not found or deleted');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp });
}

module.exports.show = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    if (!camp) {
        req.flash('error', 'Campground not found or deleted');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp });
}

module.exports.update = async (req, res, next) => {
    const { id } = req.params;
    const { title, location, price, description } = req.body;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${req.body.location}, USA&limit=1`;
    const response = await axios.get(url);
    const lat = response.data[0].lat;
    const lon = response.data[0].lon;

    const camp = await Campground.findByIdAndUpdate(id, { title, location, price, description, lat, lon });
    const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images = camp.images.concat(newImages);
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await Campground.findByIdAndUpdate(id, { $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${id}/show`);
}
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted');
    res.redirect('/campgrounds');
}