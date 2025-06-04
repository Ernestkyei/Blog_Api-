
const { appErr } = require("../utils/appErr")
const getTokenFromHeader = require("../utils/gettokenfromHeader")
const verifyToken = require("../utils/verifyToken")
appErr



const isLogin = (req, res, next) => {
    //get token from header
    const token = getTokenFromHeader(req)
    //verfify the token  
    const decodedUser = verifyToken(token)

    //save the user into req object
    req.userAuth = decodedUser.id

    if (!decodedUser) {
        return next(appErr("Invaliad/Expired token, please login back"));
    } else {

        next();
    }





}


module.exports = isLogin;