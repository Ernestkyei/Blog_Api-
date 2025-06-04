
const User = require("../models/User/User")
const { appErr } = require("../utils/appErr")
const getTokenFromHeader = require("../utils/gettokenfromHeader")
const verifyToken = require("../utils/verifyToken")




const isAdmin = async (req, res, next) => {
    //get token from header
    const token = getTokenFromHeader(req)
    //verfify the token  
    const decodedUser = verifyToken(token)

    //save the user into req object
    req.userAuth = decodedUser.id
    console.log('admin', decodedUser.id);

    //Find the user in DB
    const user = await User.findById(decodedUser.id);
    //check if admin  
    if(user.isAdmin){
        return next()
    }else{
        return next(appErr("Access Denied Admin Only", 503));
    }

}


module.exports = isAdmin;