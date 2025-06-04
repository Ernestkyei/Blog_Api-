const express = require('express');
const postRouter = express.Router();
const {postCtrl, postGettAll, postGetUniqueID, postDelete, postUpdate, fetchPosttAllCtrl, postDetailsCtrl, toggleLikesPostCtrl, toggleDisLikesPostCtrl} = require('../../controllers/posts/postCtrl');
const isLogin = require('../../middlewares/isLogin');



//post/api/v1/posts
postRouter.post('/', isLogin, postCtrl);


//get/api/v1/posts
postRouter.get('/', isLogin, fetchPosttAllCtrl);    
//api/v1/posts/:id
postRouter.get('/likes/:id', isLogin, toggleLikesPostCtrl);
//api/v1/posts/likes/:id
postRouter.get('/dislikes/:id', isLogin, toggleDisLikesPostCtrl);





//api/v1/posts/:id
postRouter.get('/:id', isLogin, postDetailsCtrl);


//put/api/v1/posts/:id
postRouter.put('/:id', postUpdate)

//delet/api/v1/posts/:id
postRouter.delete('/:id', postDelete)




module.exports = postRouter;