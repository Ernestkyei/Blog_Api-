const express = require('express');
const userRoute = express.Router();
const { userRegisterCtrl,
     userLonginCtrl,
     userProfile,
     userUpdate,
     userCtrls, profilePhotoUploadCtrl, whoViewMyProfileCtrl, followingCtrls, 
     unfollowCtrls, blockUserCtrls, unBlockedUserCtrls, adminBlockUserCtrls, adminUnBlockUserCtrls, userUpdateCtrl, UpdatePasswordCtrl, deleteUserAccountCtrl} = require('../../controllers/users/userCtrls')
     const isLogin = require('../../middlewares/isLogin');   
const storage = require("../../config/cloudinary")     
const multer = require("multer");
const isAdmin = require('../../middlewares/isAdmin');


//instance of multer
const upload =  multer({storage})


//POST/api/vi/users/register
userRoute.get('/', userCtrls);
userRoute.post('/register', userRegisterCtrl);
userRoute.post('/login', userLonginCtrl);
userRoute.get('/profile/', isLogin, userProfile);





//Get/v1/api/users/profile-viewers/:id
userRoute.get('/profile-viewers/:id', isLogin, whoViewMyProfileCtrl);
//get/api/v1/users/following/:id
userRoute.get('/following/:id',isLogin, followingCtrls);

//get/api/v1/users/unfollow/:id
userRoute.get('/unfollow/:id',isLogin, unfollowCtrls);

//get/api/v1/users/block/:id
userRoute.get('/block/:id',isLogin, blockUserCtrls);

//get/api/v1/users/unblock/:id
userRoute.get('/unblock/:id',isLogin, unBlockedUserCtrls);

//put/api/v1/users/admin-block/:id
userRoute.put('/admin-block/:id',isLogin,isAdmin, adminBlockUserCtrls);

//put/api/v1/users/adminUnblock/:id
userRoute.put('/admin-unblock/:id',isLogin,isAdmin, adminUnBlockUserCtrls);

///PUT/api/v1/users/:id
userRoute.put('/', isLogin, userUpdateCtrl)


//Post/api/v1/users/
userRoute.post('/profile-photo-upload',isLogin, upload.single('profile'), profilePhotoUploadCtrl);


//put/api/v1/users/update-password
userRoute.put('/update-password', isLogin, UpdatePasswordCtrl);


//put/api/v1/users/update-password
userRoute.delete('/delete-acount', isLogin, deleteUserAccountCtrl);




userRoute.get('/profile', isLogin, whoViewMyProfileCtrl);



module.exports = userRoute; 