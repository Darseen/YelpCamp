const BaseJoi = require('joi');
const AppError = require('./AppError');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowerAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value });
                return clean;
            }
        }
    }
})

const Joi = BaseJoi.extend(extension);

const validateCamp = (req, res, next) => {
    const campgroundSchema = Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().min(0).required(),
        images: Joi.array().items(
            Joi.object({
                url: Joi.string().required(),
                filename: Joi.string().required()
            })
        ),
        lat: Joi.number(),
        lon: Joi.number(),
        deleteImages: Joi.array(),
        description: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML()
    })
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        next(new AppError(error, 400));
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const reviewSchema = Joi.object({
        body: Joi.string()
            .required()
            .escapeHTML(),
        rating: Joi.number()
            .min(1)
            .max(5)
            .required()
    })
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        next(new AppError(error, 400));
    }
    else {
        next();
    }
}

module.exports = {
    validateCamp,
    validateReview
};