const mongoose = require('mongoose');

//create schema
const categortSchema = new mongoose.Schema({

    
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "USer",
        required: true
    },
    title:{
        type: String,
        required: true,
    }

},{
    timestamps: true

})

//comple the model
const Category = mongoose.model("Category", categortSchema);


module.exports = Category;