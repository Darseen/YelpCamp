const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = { toJSON: { virtuals: true } }

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    lat: Number,
    lon: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts)

CampgroundSchema.virtual('popUpMarkUp').get(function () {
    return `<h5>${this.title}</h5><p>${this.location}</p><a href="/campgrounds/${this._id}/show">Go to Camp</a>`
})

CampgroundSchema.post('findOneAndDelete', async function (camp) {
    if (camp && camp.reviews.length) {
        await Review.deleteMany({ _id: { $in: camp.reviews } });
    }
})


module.exports = mongoose.model('Campground', CampgroundSchema);