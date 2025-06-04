const express = require('express');
const categoryRoute = express.Router();
const {
    categoryCtrl,     
    deleteCategoryCtrls,
    fetchCategoriesCtrls,
    CategoriesDetailsCtrls,
    updateCategoryCtrls      

} = require('../../controllers/categories/categoryCtrl');    
const isLogin = require('../../middlewares/isLogin');


// POST /api/v1/category
categoryRoute.post('/', isLogin, categoryCtrl);
// GET /api/v1/categories
categoryRoute.get('/', fetchCategoriesCtrls);
// GET /api/v1/categories
categoryRoute.get('/:id', CategoriesDetailsCtrls);

// PUT /api/v1/categories/:id
categoryRoute.put('/:id',isLogin, updateCategoryCtrls);

 // DELETE /api/v1/categories/:id
categoryRoute.delete('/:id', isLogin, deleteCategoryCtrls);




module.exports = categoryRoute;