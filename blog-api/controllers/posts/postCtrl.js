const Post = require("../../models/Post/Post");
const User = require("../../models/User/User");
const {appErr} = require('../../utils/appErr');




const postCtrl = async (req, res, next) => {
    const {title, description, category} = req.body;    
    try {
        //Find the user
        const author = await User.findById(req.userAuth);
        //check if the user is blocked
        if(author.isBlocked){
            return next(appErr("Access denied, account is bloacked", 403));
        }
        //Create  the post
        const createPost = await Post.create({
            title,
            description,
            user: author._id,
            category
        }) 
        //Associate user to a post - push  the post  into the user post field
        author.posts.push(createPost)
        await author.save()
        res.json({
            status: 'success',
            data: createPost,
        })
    }
    catch (err) {
        next(appErr("Invalid login credentials"))
    }
}



//all 
const fetchPosttAllCtrl = async (req, res, next) => {
    try {
        //find all post
        const posts = await Post.find({}).populate('user').populate('category', 'title');
        ///check if the user is blocked by the post owner
        const filterPosts =  posts.filter(post=>{
            //get all block useers
            const blockedUsers = post.user.blocked
            const isBlocked = blockedUsers.includes(req.userAuth);
            return isBlocked ? null : post  
        
        })
        res.json({
            staus: 'success',
            data: posts
        })
    }
    catch (err) {
        next(appErr("Invalid login credentials"))
    }

}




//toggleLikes
const toggleLikesPostCtrl = async (req, res, next) => {
    try {
        //1. get the post
        const post = await Post.findById(req.params.id)
                //2. check if the user has already like the post

        const isLiked = post.likes.includes(req.userAuth)
            //3.if the user has already liked the post, unlike the post
            
            if(isLiked){
                post.likes = post.likes.filter(like => like != req.userAuth)
                await post.save()
            }else{
                //4. if the user has not liked the post, like the post
                post.likes.push(req.userAuth);
                await post.save();
            }
        res.json({
            staus: 'success',
            data:  "You have successfully like a post"
        })
    }
    catch (err) {
        next(appErr("Invalid login credentials"))
    }

}


//togg Dislike
const toggleDisLikesPostCtrl = async (req, res, next) => {
    try {
        //1. get the post
        const post = await Post.findById(req.params.id)
                //2. check if the user has already like the post
        const isUnLiked = post.likes.includes(req.userAuth)
            //3.if the user has already liked the post, unlike the post            
            if(isUnLiked){
                post.dislikes = post.dislikes.filter(dislike => dislike.toString() !== req.userAuth())
                await post.save()
            }else{
                //4. if the user has not liked the post, like the post
                post.dislikes.push(req.userAuth);
                await post.save();
            }
        res.json({
            staus: 'success',
            data:  "You have successfully dislike the post"
        })
    }
    catch (err) {
        next(appErr("Invalid login credentials"))
    }

}



const postDetailsCtrl = async (req, res, next) => {
    try {
        //find the post
        const post = await Post.findById(req.params.id)
        res.json({
            staus: 'success',
            data: post
        })
    }
    catch (err) {
        next(appErr("Invalid login credentials"))
    }

}


const postGetUniqueID = async (req, res, next) => {
    try {
        res.json({
            status: 'Succcess',
            data: 'post route'
        })
    }
    catch (err) {
         next(appErr("Invalid login credentials"))
    }

}

const postUpdate = async (req, res, next) => {
    try {
        res.json({
            status: 'Succcess',
            data: 'delete user route'
        })
    }
    catch (err) {
     next(appErr("Invalid login credentials"))
    }

}


const postDelete = async (req, res, next) => {
    try {
        res.json({
            status: 'Succcess',
            data: 'delete user route'
        })
    }
    catch (err) {
         next(appErr("Invalid login credentials"))
    }

}



module.exports = {
    postCtrl,
    postDetailsCtrl,
    postGetUniqueID,
    postUpdate,
    postDelete,
    fetchPosttAllCtrl,
    toggleLikesPostCtrl,
    toggleDisLikesPostCtrl




}