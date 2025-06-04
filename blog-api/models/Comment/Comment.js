const mongoose = require('mongoose');


//create schema 

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Post is required"]
    },

    User: {
        type: Object,
        require: [true, "User is required"]
    },

    description: {
        type: String,
        required: [true, "comment description is required"]
    }
},
 { timestamps: true}
)

//compile the comment
const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment;