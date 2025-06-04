const Category = require("../../models/Category/Category");
const { appErr } = require("../../utils/appErr");




const categoryCtrl = async (req, res, next) => {
    try {
        const { title } = req.body;
        const category = await Category.create({
            title,
            user: req.userAuth
        });
        res.status(201).json({
            status: 'success',
            data: category
        });
    } catch (error) {
        next(appErr(error.message))
    }
};


//all
const fetchCategoriesCtrls = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({
            staus: 'success',
            data: categories
        })
    }
    catch (err) {
        res.json(err.message)
    }

}


//single
const CategoriesDetailsCtrls = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.json({
            staus: 'success',
            data: category
        })
    }
    catch (err) {
        res.json(err.message)
    }

}


const updateCategoryCtrls = async (req, res) => {
    const {title} = req.body;
    try {
          const category = await Category.findByIdAndUpdate(req.params.id,{title}, {new: true, runValidators: true});
        res.json({
            status: 'success',
            data: category,
        })
    }
    catch (err) {
        res.json(err.message)
    }

}



const deleteCategoryCtrls = async (req, res) => {

    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({
            staus: 'success',
            data: "Deleted successfully"
        })
    }
    catch (err) {
        res.json(err.message)
    }

}


module.exports = {
    categoryCtrl,
    updateCategoryCtrls,
    deleteCategoryCtrls,
    fetchCategoriesCtrls,
    CategoriesDetailsCtrls,
    updateCategoryCtrls


}