const express = require('express');
const commentRoute = express.Router();
const {commentPostCtrls, commentGetCtrls, uniqueGetComment, commentUpdate, commentDelete}  = require ('../../controllers/comments/commentCtrl') 






commentRoute.post('/', commentPostCtrls)
commentRoute.get('/', commentGetCtrls)   
commentRoute.get('/:id', uniqueGetComment)
//delete//api/v1/comment/:id'
commentRoute.put('/:id', commentUpdate)
///DELETe/api/vi/comment/:id
commentRoute.delete('/:id',commentDelete )









module.exports = commentRoute;

