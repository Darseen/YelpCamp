const express = require('express');
const router = express.Router({ mergeParams: true });
const campgrounds = require('../controllers/campgrounds');
const wrapAsync = require('../utils/wrapAsync');
const { validateCamp } = require('../utils/validateSchemas');
const isLoggedIn = require('../utils/isLoggedin');
const isAuthor = require('../utils/isAuthor');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

router.get('/', wrapAsync(campgrounds.index));

router.route('/new')
    .get(isLoggedIn, campgrounds.new)
    .post(isLoggedIn, upload.array('image'), validateCamp, wrapAsync(campgrounds.create));

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, wrapAsync(campgrounds.edit))
    .patch(isLoggedIn, isAuthor, upload.array('image'), validateCamp, wrapAsync(campgrounds.update));


router.get('/:id/show', wrapAsync(campgrounds.show));
router.delete('/:id/delete', isLoggedIn, isAuthor, wrapAsync(campgrounds.delete))

module.exports = router;