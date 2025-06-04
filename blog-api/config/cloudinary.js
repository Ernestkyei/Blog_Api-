const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const { CloudinaryStorage } = require('multer-storage-cloudinary');




//configure
cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
  });
  

//instance of cloudinaryStorage
const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormat: ['jpg', 'png'],
    params:{
        folder:'blog-api',
        transformation: [{width:500, height:500, crop:'limit'}]

    }
})


module.exports = storage;