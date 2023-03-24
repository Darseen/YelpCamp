const cloudinary = require('cloudinary').v2;
require('dotenv').config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
cloudinary.api.resources({ type: 'upload', prefix: 'YelpCamp' }, function (err, res) {
    if (err) {
        console.log(err);
    }
    else {
        const publicIds = res.resources.map(resource => resource.public_id);

        publicIds.forEach(element => {
            cloudinary.uploader.destroy(element, (err, res) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log('Success', res);
                }
            })
        });
    }
})