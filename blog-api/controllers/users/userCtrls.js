const bcrypt = require('bcryptjs');
const User = require("../../models/User/User");
const generateToken = require('../../utils/generateToken');
const getTokenFromHeader = require('../../utils/gettokenfromHeader');
const { appErr, AppErr } = require('../../utils/appErr');
const Category = require('../../models/Category/Category');
const Post = require('../../models/Post/Post');
const Comment = require('../../models/Comment/Comment');





//Register
const userRegisterCtrl = async (req, res, next) => {
    const { firstname, lastname, email, password } = req.body;

    try {
        // 1. Check if user already exists
        const userFound = await User.findOne({ email });
        if (userFound) {
            return next(new AppErr("User already Exists", 400));
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // 3. Create the user
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashPassword
        });

        // 4. Return the newly created user
        return res.status(201).json({
            status: 'success',
            data: user
        });

    } catch (err) {
        console.error(err); // Show real error in terminal for debugging
        return next(new AppErr("Something went wrong during registration", 500));
    } 
};


//Login
const userLonginCtrl = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // //check if the email exist
        const userFound = await User.findOne({ email });
        if (!userFound) {
            return next(appErr("Invalid login credentials"))
            
        }

        //verify password
        const isPasswordMatched = await bcrypt.compare(password, userFound.password)
        if (!isPasswordMatched) {
            if (!userFound) {
            return next(appErr("Invalid login credentials"))
            
        }
        }

        res.json({
            status: 'success',
            data: {
                firstname: userFound.firstname,
                lastname: userFound.lastname,
                email: userFound.email,
                isAdmin: userFound.isAdmin,
                token: generateToken(userFound._id),
            }
        })
    }
    catch (err) {
         next(appErr("Invalid login credentials"))
    }
}





const userProfile = async (req, res) => {
    try {
        //get token from headers
        const token = getTokenFromHeader(req)
        // console.log(token)

        const user = await User.findById(req.userAuth).populate({
            path: "posts"
        })
        res.json({
            status: 'Succcess',
            data: user
        })
    }
    catch (err) {
        res.json({ err: err.message });
    }

}






const userDelete = async (req, res) => {
    try {
        res.json({
            status: 'Succcess',
            data: 'delete user route'
        })
    }
    catch (err) {
        res.json(err.message);
    }

}

const userUpdateCtrl = async (req, res, next) => {
    const { email, lastname, firstname } = req.body;

    try {
        // Make sure the authenticated user ID exists
        const userId = req.userAuth;
        if (!userId) {
            return next(appErr("Unauthorized: No user ID found in request", 401));
        }

        // Check if the new email is already taken (by another user)
        if (email) {
            const emailTaken = await User.findOne({ email });

            if (emailTaken && emailTaken._id.toString() !== userId) {
                return next(appErr("Email is already taken", 400));
            }
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                lastname,
                firstname,
                email,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedUser) {
            return next(appErr("User not found", 404));
        }

        // Send response
        res.status(200).json({
            status: "Success",
            data: updatedUser,
        });

    } catch (err) {
        next(appErr(err.message, 500));
    }
};


// Updating password
const UpdatePasswordCtrl = async (req, res, next) => {
    const { password } = req.body;

    try {
        // Check if user is updating the password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Update user
            await User.findByIdAndUpdate(
                req.userAuth,
                { password: hashedPassword },
                {
                    new: true,
                    runValidators: true,
                }
            );

            return res.json({
                status: "Success",
                data: "Password has been successfully updated",
            });
        } else {
            return next(appErr("Please provide password field", 400));
        }
    } catch (err) {
        return res.status(500).json({
            status: "failed",
            message: err.message,
        });
    }
};




//delete account
const deleteUserAccountCtrl = async (req, res, next) => {
    try {
        //1. Find the user  to be deleted
        const userToDelete = await User.findById(req.userAuth);
        //2. find all post  to be deleted
        await Post.deleteMany({ user: req.userAuth });
        //3. Delete  all comments  of the user
        await Comment.deleteMany({ user: req.userAuth })
        //4. await category of the user
        await Category.deleteMany({ user: req.userAuth })
        //5.delete
        await userToDelete.deleteOne();
        //send response
        return res.json({
            status: "Success",
            data: "Your account has been delete successfully"
        })
        res.send("Delete Account")
    } catch (error) {
        res.json(error.message)
    }

};





const userCtrls = async (req, res) => {
    try {
        const users = await User.find()
        console.log(users);
        res.json({
            status: "Success",
            data: users
        })
    }
    catch (err) {
        console.log(err.message)


    }
}



//who view my profile
const whoViewMyProfileCtrl = async (req, res, next) => {
    try {
        //1.find the original post
        const user = await User.findById(req.params.id);

        //2.Find the user who viewed the original user
        const userWhoViewed = await User.findById(req.userAuth);

        //Check if orginal  and who viewed are found
        if (user && userWhoViewed) {
            //4.check if userWhoViewed is already in the users viewers arrays
            const isUserAlreadyViewed = user.viewers.find(viewers => viewers.toString() === userWhoViewed._id.toJSON());
            if (isUserAlreadyViewed) {
                return next(appErr("You already viewed this profile"))
            }
            else {
                //5.Push the userWhoViewed to the user's viewers  array
                user.viewers.push(userWhoViewed._id)
                //6. save the user
                await user.save()
                res.json({
                    status: "success",
                    data: "You have successfully viewed this profile"
                })
            }
        }
    }
    catch (err) {
         next(appErr("Invalid login credentials"))
    }
}




//profile Photo Upload
const profilePhotoUploadCtrl = async (req, res, next) => {
    console.log(req.file)
    try {
        //1. Find the user to be updated

        //2. Check if user is found
        const userToUpdate = await User.findById(req.userAuth);
        if (!userToUpdate) {
            return next(appErr('User not found', 404))
        }
        //3. check if the user is blocked
        if (userToUpdate.isBlocked) {
            return next(appErr("Action is not allowed, your account is blocked", 403))
        }
        //4. check if a user is updating their photo
        if (req.file) {
            //5. Update a profile
            await User.findByIdAndUpdate(req.userAuth, {
                $set: {
                    profilePhoto: req.file.path,
                }
            }, {
                new: true,
            })
            res.json({
                status: "success",
                data: "You have successfully updated your profile Photo Upload"
            })
        }
    }
    catch (err) {
        next(appErr(err.message, 5000));
    }
}



//following 
const followingCtrls = async (req, res) => {
    try {
        //1. Find the user to follow
        const userToFollow = await User.findById(req.params.id);
        //2. Find the user who is following
        const userWhoFollowed = await User.findById(req.userAuth);

        //3.Check if user and userwhofollowed are found
        if (userToFollow && userWhoFollowed) {
            //4. Check if userwhofollowed is already in the user's following array
            const isUserAlreadyFollowed = userToFollow.following.find(follower => follower.toString() == userWhoFollow._id.toString());

            if (isUserAlreadyFollowed) {
                return next(appErr("You already followed this user"))
            } else {
                //5. push  userwhofollowed into the user's  followers array
                userToFollow.followers.push(userWhoFollowed._id)
                //push userToFollow to the userWhoFollowed's following array
                userWhoFollowed.following.push(userToFollow._id);

                //save
                await userWhoFollowed.save()
                await userToFollow.save()

                res.json({
                    status: "Success",
                    data: "You have successfully followed this user"
                })

            }



        }

    }
    catch (err) {
       next(appErr("Invalid login credentials"))


    }
}


//unfollow
const unfollowCtrls = async (req, res, next) => {
    try {
        //1. Find the user to unfollow
        const userToBeUnfollowed = await User.findById(req.params.id);
        //2. Find the user who is unfollowing
        const userWhoUnFollowed = await User.findById(req.userAuth)

        //3. Check if user and userWhoUnfollowed are found
        if (userToBeUnfollowed && userWhoUnFollowed) {
            //4. Check if userWhoUnfollowed is already in the user's followers array
            const isUserAlreadyFollowed = userToBeUnfollowed.followers.find(follower => follower.toString() === userWhoUnFollowed._id.toString());

            if (!isUserAlreadyFollowed) {
                return next(appErr("You have not followed this user"))
            } else {
                //5. Remove userwhoUnfollowed from the user's followers array
                userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter(follower => follower.toString() !== userWhoUnFollowed._id.toString());

                //save the user
                await userToBeUnfollowed.save();
                //7. remove userToBeUnfollowed from the  userWhoUnfollowed's following array
                userWhoUnFollowed.following = userWhoUnFollowed.following.filter(following => following.toString() !== userToBeUnfollowed._id.toString())

                //8. save the user
                await userWhoUnFollowed.save()
                res.json({
                    status: "Success",
                    data: "You have successfully unfollowed this user"
                })

            }
        }
    }
    catch (err) {
        next(appErr("Invalid login credentials"))


    }
}




//block controller
const blockUserCtrls = async (req, res, next) => {
    try {
        //1.find the user to be block
        const userToBeBlocked = await User.findById(req.params.id);

        //2. Find the user who is blocking
        const userWhoBlocked = await User.findById(req.userAuth)

        //3. Check if userToBeBlocked and userWhoBlocked are found
        if (userWhoBlocked && userToBeBlocked) {
            //4. Check if userWhoUnfollowed is already in the user's blocked array
            const isUserAlreadyBlocked = userWhoBlocked.blocked.find(blocked => blocked.toString() === userToBeBlocked._id.toString())

            if (isUserAlreadyBlocked) {
                return next(appErr("You have already blocked this user"));

            }
            //7. push userToBeBlocked to the userwhoBlocked's blocked array
            userWhoBlocked.blocked.push(userToBeBlocked._id)

            //8.save
            await userWhoBlocked.save()
            res.json({
                status: "Success",
                data: "You have successfully blocked  this user"
            })
        }




    }
    catch (err) {
         next(appErr("Invalid login credentials"))


    }
}

//unblock
const unBlockedUserCtrls = async (req, res, next) => {
    try {
        //1. find the user to unblocked
        const userToBeUnblocked = await User.findById(req.params.id);

        //2. Find the user who is unblocking
        const userWhoUnblocked = await User.findById(req.userAuth);

        //3.check if the userToBeUnblocked and userwhoUnblocked are found
        if (userToBeUnblocked && userWhoUnblocked) {
            //4.check if userToBeUnblocked is already in the array's of userWhoUnblocked
            const isUserAlreadyBlocked = userWhoUnblocked.blocked.find(
                blocked => blocked.toString() === userToBeUnblocked._id.toString()
            );

            if (!isUserAlreadyBlocked) {
                return next(AppErr("You have not blocked this user"));

            }
            //remove the userToBeUnblocked from the original the main user
            userWhoUnblocked.blocked = userWhoUnblocked.blocked.filter(blocked => blocked.toString() !== userToBeUnblocked._id.toString()
            );

            //save        
            await userWhoUnblocked.save()
            res.json({
                status: "Success",
                data: "You have successfully unblocked this user"
            })
        }

    }
    catch (err) {
        next(appErr("Invalid login credentials"))


    }
}


//Admin-block
const adminBlockUserCtrls = async (req, res) => {
    try {

        //1. find the user to block
        const userToBeBlocked = await User.findById(req.params.id);
        //2. check if user found
        if (!userToBeBlocked) {
            return next(appErr("User not found"));
        }

        //Chnge the isBloacked to true
        userToBeBlocked.isBlocked = true;
        //save
        await userToBeBlocked.save()
        res.json({
            status: "Success",
            data: "You have successfully blocked this user"
        })
    }
    catch (err) {
         next(appErr("Invalid login credentials"))


    }
}


//Admin-Unblock
const adminUnBlockUserCtrls = async (req, res, next) => {
    try {

        //1. find the user to unblock
        const userToBeUnBlocked = await User.findById(req.params.id);
        //2. check if user found
        if (!userToBeUnBlocked) {
            return next(appErr("User not found"));
        }

        //Chnge the isBloacked to false
        userToBeUnBlocked.isBlocked = false;
        //save
        await userToBeUnBlocked.save()
        res.json({
            status: "Success",
            data: "You have successfully unblocked this user"
        })
    }
    catch (err) {
        next(appErr("Invalid login credentials"))


    }
}



module.exports = {
    userRegisterCtrl,
    userLonginCtrl,
    userProfile,
    userCtrls,
    userUpdateCtrl,
    profilePhotoUploadCtrl,
    whoViewMyProfileCtrl,
    followingCtrls,
    unfollowCtrls,
    blockUserCtrls,
    unBlockedUserCtrls,
    adminBlockUserCtrls,
    adminUnBlockUserCtrls,
    UpdatePasswordCtrl,
    deleteUserAccountCtrl


}