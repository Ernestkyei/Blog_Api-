const mongoose = require('mongoose');
const post = require('../Post/Post');



//creating schema
const Userschema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'First Name is required']
    },

    lastname: {
        type: String,
        required: [true, 'Last Name is required']
    },
    Photo: {
        type: String,
        // required: [true, "Post image is required"]
    },
    email: {
        type: String,
        required: [true, 'email is required']

    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['Admin', 'Guest', 'Editor']
    },
    viewers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following:
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    blocked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }

    ],
    // plan:
    // {
    //     type: String,
    //     enum: ["Free", "Premium", "Pro"],
    //     default: "Free"
    // },

    userAward: {
        type: String,
        enum: ["Free", "Bronze", "Silver", "Gold"],
        default: "Free"
    }



}, {
    timestamps: true,
    toJSON: { virtuals: true }

})



Userschema.pre('findOne', async function (next) {
    try {
        //populate the post
        this.populate('posts')
        // Get the user ID from query conditions
        const userId = this._conditions._id;

        // Find the posts created by the user
        const posts = await post.find({ user: userId });

        // Fix the typo and check if there's at least one post
        const lastPost = posts[posts.length - 1];

        if (lastPost) {
            // Get the last post date
            const lastPostdate = new Date(lastPost.createdAt);

            // Get the last post date in string format
            const lastPostDateString = lastPostdate.toDateString();

            // Add virtual for last post date
            Userschema.virtual('lastPostDate').get(function () {
                return lastPostDateString;
            });

            // Attach the date directly to the query (for reference during exec)
            this._lastPostDate = lastPostDateString;

            // ✅ 30-day inactivity check (safe placement)
            const currentDate = new Date();
            const diff = currentDate - lastPostdate;
            const diffInDays = diff / (1000 * 3600 * 24);

            // Convert to "days ago"
            const daysAgo = Math.floor(diffInDays);
            // console.log(`User last posted ${daysAgo} day(s) ago.`);
            Userschema.virtual('lastActive').get(function(){
                //check if daysAgo is less than 0
                if(daysAgo <= 0){
                    return "Today"
                }
                //check if daysAgo  is equal to 1
                if(daysAgo === 1){
                    return "Yesterday"
                }
                //check if daysAgo is greater than 1
                if(daysAgo > 1){
                    return `${daysAgo} days ago `
                }
            })




            if (diffInDays > 30) {
                // Add virtual for inactivity
                Userschema.virtual('isInactive').get(function () {
                    return true;
                });

                // Block user
                await User.findByIdAndUpdate(
                    userId,
                    { isBlocked: true },
                    { new: true }
                );
            } else {
                // Add virtual for activity
                Userschema.virtual('inactive').get(function () {
                    return false;
                });

                // Unblock user
                await User.findByIdAndUpdate(
                    userId,
                    { isBlocked: false },
                    { new: true }
                );
            }
        }



        //update userAward bashed on the number post
        //get the number of post
        const numOfPost = posts.length
        //check if a user post is less than 10
        if(numOfPost < 10){
            await User.findByIdAndUpdate(userId, {
                userAward: "Bronze"
            },{
                new: true
            })
        } 
         //check if a user post is greater than 10
        if(numOfPost > 10){
            await User.findByIdAndUpdate(userId, {
                userAward: "Silver"

            },{
                new: true
            })
        }
 //check if a user post is greater than 20
        if(numOfPost > 20){
            await User.findByIdAndUpdate(userId, {
                userAward: "Gold"

            },{
                new: true
            })
        }

        



        next();
    } catch (error) {
        next(error);
    }
});




//post - after saving  
Userschema.post('save', function (doc) {
    console.log('Post hook', doc)

})

//Get fullname
Userschema.virtual('fullname').get(function () {
    return `${this.firstname} ${this.lastname}`

})

//get user initials
Userschema.virtual('initials').get(function () {
    return `${this.firstname[0]}${this.lastname[0]}`
})


//get post count
Userschema.virtual('postCount').get(function () {
    return this.posts.length
})

//get followers count
Userschema.virtual('followersCount').get(function () {
    return this.followers.length;
})


//get following count
Userschema.virtual('followingCount').get(function () {
    return this.following.length;
})



//get viewers count
Userschema.virtual('viewersCount').get(function () {
    return this.viewers.length;
})


//get blocked count
Userschema.virtual('blockedCount').get(function () {
    return this.blocked.length;
})



//compile the user model
const User = mongoose.model('User', Userschema)

module.exports = User
