const mongoose = require('mongoose');

// Create schema
const postschema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Post title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Post description is required"]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Post category is required"]
    },
    numViews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Author is required"]
    }
}, {
    timestamps: true
});

// Compile and export
const Post = mongoose.model('Post', postschema);
module.exports = Post;
